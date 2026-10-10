'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  FileText,
  Download,
  Clock,
  Shield,
  TrendingUp,
  Sparkles,
  Loader2,
  Printer,
  AlertTriangle,
  Building2,
  CheckCircle2,
  Users,
  Search,
  ChevronRight,
  Eye,
  X,
  RefreshCw,
  Layers,
  AlertCircle,
  Trash2,
  Bookmark,
  BookmarkCheck,
  Check,
  FileDown
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import { useAIProvider } from '@/components/providers/AIProviderContext'
import { useApp } from '@/lib/app-context'

interface DepartmentStat {
  id: string
  name: string
  chef: string
  employeeCount: number
  assignedCount: number
  completedCount: number
  completionRate: number
  avgRiskScore: number | null
  wellnessScore: number | null
  openHazardsCount: number
  hasCompletedCampaign: boolean
  isReadyForReport: boolean
  latestReportDate?: string
  latestReportId?: string
}

export function HRReports() {
  const { aiProvider, aiModel } = useAIProvider()
  const { language } = useApp()
  const isAr = language === 'ar'

  // Data states
  const [loading, setLoading] = useState(true)
  const [orgId, setOrgId] = useState<string | null>(null)
  const [orgName, setOrgName] = useState<string>('Organization')
  const [departments, setDepartments] = useState<DepartmentStat[]>([])
  const [reports, setReports] = useState<any[]>([])

  // Operation states
  const [generatingDeptId, setGeneratingDeptId] = useState<string | null>(null)
  const [deletingReportId, setDeletingReportId] = useState<string | null>(null)
  const [reportToDelete, setReportToDelete] = useState<any | null>(null)
  const [savingReportId, setSavingReportId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('all')
  const [activeReportModal, setActiveReportModal] = useState<any | null>(null)
  const [orgReadinessNotice, setOrgReadinessNotice] = useState<string | null>(null)

  async function loadData() {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // 1. Get current member organization
      const { data: member } = await supabase
        .from('organization_members')
        .select('organization_id, organizations(name)')
        .eq('profile_id', user.id)
        .eq('is_active', true)
        .maybeSingle()

      if (!member) return
      const currentOrgId = member.organization_id
      setOrgId(currentOrgId)
      if ((member as any).organizations?.name) {
        setOrgName((member as any).organizations.name)
      }

      // 2. Fetch all departments
      const { data: deptsData } = await supabase
        .from('departments')
        .select('*')
        .eq('organization_id', currentOrgId)
        .order('name', { ascending: true })

      // 3. Fetch members with department mapping
      const { data: membersList } = await supabase
        .from('organization_members')
        .select('id, department_id')
        .eq('organization_id', currentOrgId)
        .eq('is_active', true)

      const memberDeptMap = new Map<string, string>()
      const deptMemberCountMap = new Map<string, number>()
      ;(membersList || []).forEach((m: any) => {
        if (m.department_id) {
          memberDeptMap.set(m.id, m.department_id)
          deptMemberCountMap.set(m.department_id, (deptMemberCountMap.get(m.department_id) || 0) + 1)
        }
      })

      // 4. Fetch campaigns
      const { data: campaigns } = await supabase
        .from('assessment_campaigns')
        .select('id, title, status')
        .eq('organization_id', currentOrgId)

      const campaignIds = (campaigns || []).map((c: any) => c.id)

      // 5. Fetch assignments
      let assignmentsList: any[] = []
      if (campaignIds.length > 0) {
        const { data: assigns } = await supabase
          .from('assessment_assignments')
          .select('id, member_id, campaign_id')
          .in('campaign_id', campaignIds)
        assignmentsList = assigns || []
      }

      const assignmentMemberMap = new Map<string, string>()
      const deptAssignmentsMap = new Map<string, number>()
      assignmentsList.forEach((a: any) => {
        assignmentMemberMap.set(a.id, a.member_id)
        const deptId = memberDeptMap.get(a.member_id)
        if (deptId) {
          deptAssignmentsMap.set(deptId, (deptAssignmentsMap.get(deptId) || 0) + 1)
        }
      })

      // 6. Fetch responses
      let responsesList: any[] = []
      if (assignmentsList.length > 0) {
        const { data: resps } = await supabase
          .from('assessment_responses')
          .select('id, assignment_id, ai_risk_score, completion_percentage')
          .in('assignment_id', assignmentsList.map((a: any) => a.id))
        responsesList = resps || []
      }

      const deptCompletedMap = new Map<string, number>()
      const deptScoresMap = new Map<string, number[]>()

      responsesList.forEach((r: any) => {
        const memberId = assignmentMemberMap.get(r.assignment_id)
        if (memberId) {
          const deptId = memberDeptMap.get(memberId)
          if (deptId) {
            if (r.completion_percentage === 100 || r.ai_risk_score !== null) {
              deptCompletedMap.set(deptId, (deptCompletedMap.get(deptId) || 0) + 1)
            }
            if (r.ai_risk_score !== null) {
              const current = deptScoresMap.get(deptId) || []
              current.push(Number(r.ai_risk_score))
              deptScoresMap.set(deptId, current)
            }
          }
        }
      })

      // 7. Fetch hazards count per department
      const { data: hazards } = await supabase
        .from('hazard_occurrences')
        .select('id, department_id, status')
        .eq('organization_id', currentOrgId)
        .eq('status', 'OPEN')

      const deptHazardsMap = new Map<string, number>()
      ;(hazards || []).forEach((h: any) => {
        if (h.department_id) {
          deptHazardsMap.set(h.department_id, (deptHazardsMap.get(h.department_id) || 0) + 1)
        }
      })

      // 8. Fetch generated reports
      const { data: reportsData } = await supabase
        .from('generated_reports')
        .select('*')
        .eq('organization_id', currentOrgId)
        .order('created_at', { ascending: false })

      const mappedReports = (reportsData || []).map((r: any) => {
        const params = r.parameters || {}
        return {
          id: r.id,
          title: r.name,
          subtitle: params.departmentName
            ? `${params.departmentName} Department Audit`
            : (r.type === 'AI_EXECUTIVE' ? 'Executive Ergonomic Summary' : r.type),
          departmentId: params.departmentId || 'all',
          departmentName: params.departmentName || (params.departmentCount ? 'Organization-Wide' : 'General'),
          type: r.type === 'AI_EXECUTIVE' ? 'wellbeing' : 'osh',
          date: new Date(r.created_at).toLocaleDateString(),
          timestamp: new Date(r.created_at).getTime(),
          departmentsCount: params.departmentCount || 1,
          responseRate: params.totalAssessments ? `${params.totalAssessments} responses` : 'N/A',
          completionRate: params.completionRate ?? (params.totalAssessments ? 100 : null),
          status: r.status === 'COMPLETED' ? 'ready' : r.status === 'FAILED' ? 'failed' : 'processing',
          description: `AI-generated report compiled in ${r.generation_time_ms || 0}ms. Storage size: ${(r.file_size / 1024).toFixed(2)} KB.`,
          rawReport: params.reportData,
          fallbackOccurred: params.fallbackOccurred || false,
          fallbackDetails: params.fallbackDetails || '',
          providerUsed: params.aiProvider || '',
          modelUsed: params.aiModel || '',
          overallRisk: params.reportData?.overallRiskLevel || 'medium',
          isSaved: Boolean(params.isSaved)
        }
      })
      setReports(mappedReports)

      // Map latest reports to departments
      const deptLatestReportMap = new Map<string, { date: string; id: string }>()
      mappedReports.forEach((r: any) => {
        if (r.departmentId && r.departmentId !== 'all' && !deptLatestReportMap.has(r.departmentId)) {
          deptLatestReportMap.set(r.departmentId, { date: r.date, id: r.id })
        }
      })

      // 9. Build Department Stats List
      const compiledDepts: DepartmentStat[] = (deptsData || []).map((d: any) => {
        const assigned = deptAssignmentsMap.get(d.id) || 0
        const completed = deptCompletedMap.get(d.id) || 0
        const scores = deptScoresMap.get(d.id) || []
        const avgRisk = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : null
        const wellness = avgRisk !== null ? Math.max(0, Math.min(10, 10 - (avgRisk / 10))) : null
        const rate = assigned > 0 ? Math.round((completed / assigned) * 100) : (completed > 0 ? 100 : 0)
        const isReady = completed > 0
        const hasCompleted = assigned > 0 && completed >= assigned
        const latest = deptLatestReportMap.get(d.id)

        return {
          id: d.id,
          name: d.name,
          chef: d.chef_department || (isAr ? 'غير محدد' : 'Not assigned'),
          employeeCount: d.employee_count || deptMemberCountMap.get(d.id) || 0,
          assignedCount: assigned,
          completedCount: completed,
          completionRate: rate,
          avgRiskScore: avgRisk ? Math.round(avgRisk) : null,
          wellnessScore: wellness ? Math.round(wellness * 10) / 10 : null,
          openHazardsCount: deptHazardsMap.get(d.id) || 0,
          hasCompletedCampaign: hasCompleted,
          isReadyForReport: isReady,
          latestReportDate: latest?.date,
          latestReportId: latest?.id
        }
      })

      setDepartments(compiledDepts)

      // Check organization-wide readiness
      const totalOrgCompleted = compiledDepts.reduce((sum, d) => sum + d.completedCount, 0)
      if (campaigns?.length === 0) {
        setOrgReadinessNotice(
          isAr
            ? 'لم يتم إنشاء أي حملة تقييم بعد. يرجى إطلاق حملة استبيان لجمع إجابات الموظفين.'
            : 'No assessment campaigns have been launched yet. Create an assessment campaign to begin collecting data.'
        )
      } else if (totalOrgCompleted === 0) {
        setOrgReadinessNotice(
          isAr
            ? 'لم يقم أي موظف بإكمال استبيان التقييم حتى الآن. يجب إكمال التقييمات لتوليد التقارير.'
            : 'No completed employee assessments found yet. Reports can be generated as soon as staff complete their assessments.'
        )
      } else {
        setOrgReadinessNotice(null)
      }

    } catch (err) {
      console.error('Failed to load reports page data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Trigger Report Generation (Per Department or Organization-Wide)
  async function handleGenerateReport(targetDepartmentId?: string) {
    if (!orgId) return

    const targetKey = targetDepartmentId || 'all'
    setGeneratingDeptId(targetKey)

    try {
      const res = await fetch('/api/ai/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId: orgId,
          departmentId: targetDepartmentId === 'all' ? undefined : targetDepartmentId,
          aiProvider,
          aiModel: aiProvider === 'auto' ? undefined : aiModel
        })
      })

      if (res.ok) {
        const data = await res.json()
        await loadData()
        if (data?.report) {
          setActiveReportModal({
            title: data.report.title || 'Executive Ergonomic Report',
            rawReport: data.report,
            date: new Date().toLocaleDateString(),
            departmentName: targetDepartmentId && targetDepartmentId !== 'all'
              ? departments.find(d => d.id === targetDepartmentId)?.name || 'Department'
              : 'Organization-Wide'
          })
        }
      } else {
        const errData = await res.json()
        alert(errData.message || 'Failed to generate report. Please try again.')
      }
    } catch (err: any) {
      console.error('Report generation error:', err)
      alert('An unexpected error occurred during report generation.')
    } finally {
      setGeneratingDeptId(null)
    }
  }

  // Delete Report Action
  async function handleDeleteReport(reportId: string) {
    if (!reportId) return
    setDeletingReportId(reportId)

    try {
      const res = await fetch(`/api/reports/${reportId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        // Optimistically remove from state
        setReports(prev => prev.filter(r => r.id !== reportId))
        if (activeReportModal?.id === reportId) {
          setActiveReportModal(null)
        }
        setReportToDelete(null)
        await loadData()
      } else {
        const err = await res.json()
        alert(err.message || 'Failed to delete report')
      }
    } catch (err: any) {
      console.error('Failed to delete report:', err)
      alert('An error occurred while deleting the report.')
    } finally {
      setDeletingReportId(null)
    }
  }

  // Toggle Save / Bookmark Report
  async function handleToggleSaveReport(report: any) {
    const reportId = report.id
    const newSavedStatus = !report.isSaved
    setSavingReportId(reportId)

    // Optimistic UI update
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, isSaved: newSavedStatus } : r))
    if (activeReportModal?.id === reportId) {
      setActiveReportModal((prev: any) => ({ ...prev, isSaved: newSavedStatus }))
    }

    try {
      const res = await fetch(`/api/reports/${reportId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isSaved: newSavedStatus })
      })

      if (!res.ok) {
        // Revert on error
        setReports(prev => prev.map(r => r.id === reportId ? { ...r, isSaved: !newSavedStatus } : r))
        if (activeReportModal?.id === reportId) {
          setActiveReportModal((prev: any) => ({ ...prev, isSaved: !newSavedStatus }))
        }
      }
    } catch (err) {
      console.error('Failed to update saved status:', err)
      // Revert on error
      setReports(prev => prev.map(r => r.id === reportId ? { ...r, isSaved: !newSavedStatus } : r))
    } finally {
      setSavingReportId(null)
    }
  }

  // Print/Export PDF generator
  function handleDownloadPdf(report: any) {
    const raw = report.rawReport || {
      title: report.title,
      executiveSummary: report.description,
      overallRiskLevel: 'medium',
      keyFindings: ['Detailed assessment report metadata is archived in storage.'],
      recommendationsSummary: ['Refer to the recommendations section on your dashboard.']
    }

    const reportData = typeof raw === 'string' ? JSON.parse(raw) : raw

    let hazardsChartUrl = ''
    if (reportData.hazardsDetail && reportData.hazardsDetail.length > 0) {
      const counts = reportData.hazardsDetail.reduce((acc: any, h: any) => {
        acc[h.status] = (acc[h.status] || 0) + 1
        return acc
      }, {})
      const labels = Object.keys(counts)
      const data = Object.values(counts)
      const bgColors = labels.map((l: string) => l === 'OPEN' ? '#fee2e2' : l === 'INVESTIGATING' ? '#fef9c3' : '#dcfce7')
      const chartConfig = {
        type: 'doughnut',
        data: {
          labels,
          datasets: [{ data, backgroundColor: bgColors }]
        },
        options: {
          plugins: { legend: { position: 'right' } }
        }
      }
      hazardsChartUrl = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(chartConfig))}&w=400&h=200`
    }

    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      alert('Pop-up blocker is enabled. Please allow popups for this site to generate the PDF.')
      return
    }

    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${reportData.title || report.title}</title>
          <meta charset="utf-8" />
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
              line-height: 1.6;
              color: #334155;
              padding: 40px;
              max-width: 850px;
              margin: 0 auto;
            }
            .header {
              border-bottom: 2px solid #0f766e;
              padding-bottom: 15px;
              margin-bottom: 30px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .brand {
              font-size: 22px;
              font-weight: 800;
              color: #0f766e;
              letter-spacing: -0.5px;
            }
            .dept-badge {
              font-size: 11px;
              font-weight: 700;
              text-transform: uppercase;
              background-color: #f0fdf4;
              color: #166534;
              border: 1px solid #bbf7d0;
              padding: 3px 8px;
              border-radius: 6px;
              margin-left: 8px;
            }
            .date {
              font-size: 12px;
              color: #64748b;
            }
            h1 {
              font-size: 24px;
              color: #0f172a;
              margin-top: 0;
              margin-bottom: 12px;
            }
            .risk-badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 9999px;
              font-size: 12px;
              font-weight: bold;
              text-transform: uppercase;
            }
            .risk-low { background-color: #dcfce7; color: #15803d; }
            .risk-medium { background-color: #fef9c3; color: #a16207; }
            .risk-high { background-color: #fee2e2; color: #b91c1c; }
            .risk-critical { background-color: #fce7f3; color: #be185d; }
            
            h2 {
              font-size: 16px;
              color: #0f766e;
              border-bottom: 1px solid #e2e8f0;
              padding-bottom: 6px;
              margin-top: 30px;
            }
            .summary {
              background-color: #f8fafc;
              border-left: 4px solid #0f766e;
              padding: 16px;
              margin-bottom: 25px;
              border-radius: 0 8px 8px 0;
              font-size: 14px;
            }
            ul {
              padding-left: 20px;
            }
            li {
              margin-bottom: 10px;
              font-size: 13.5px;
            }
            .detail-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 12px;
              margin-bottom: 20px;
              font-size: 12.5px;
            }
            .detail-table th, .detail-table td {
              border: 1px solid #e2e8f0;
              padding: 9px 12px;
              text-align: left;
            }
            .detail-table th {
              background-color: #f8fafc;
              font-weight: 600;
              color: #475569;
            }
            .status-badge {
              display: inline-block;
              padding: 2px 8px;
              border-radius: 4px;
              font-size: 10px;
              font-weight: bold;
              text-transform: uppercase;
              background-color: #f1f5f9;
              color: #475569;
            }
            .status-OPEN { background-color: #fee2e2; color: #b91c1c; }
            .status-INVESTIGATING { background-color: #fef9c3; color: #a16207; }
            .status-RESOLVED { background-color: #dcfce7; color: #15803d; }
            
            .conclusion-box {
              background-color: #f0fdfa;
              border: 1px solid #99f6e4;
              padding: 18px;
              border-radius: 8px;
              margin-top: 30px;
              margin-bottom: 30px;
            }
            .conclusion-box h2 {
              margin-top: 0;
              border-bottom: none;
              color: #0f766e;
            }
            .footer {
              margin-top: 50px;
              border-top: 1px solid #e2e8f0;
              padding-top: 15px;
              font-size: 11px;
              color: #94a3b8;
              text-align: center;
            }
            @media print {
              body { padding: 0; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <span class="brand">ErgonoAI</span>
              <span class="dept-badge">${report.departmentName || 'Organization-Wide'}</span>
            </div>
            <div class="date">Generated: ${report.date || new Date().toLocaleDateString()}</div>
          </div>
          
          <h1>${reportData.title || report.title}</h1>
          
          <div style="margin-bottom: 20px;">
            <span class="risk-badge risk-${(reportData.overallRiskLevel || 'medium').toLowerCase()}">
              Overall Risk Level: ${reportData.overallRiskLevel || 'Medium'}
            </span>
          </div>
          
          <div class="summary">
            <strong>Executive Ergonomics Summary:</strong><br/>
            ${reportData.executiveSummary || reportData.summary || 'No executive summary available.'}
          </div>
          
          <h2>Key Assessment Findings</h2>
          <ul>
            ${(reportData.keyFindings || []).map((f: string) => `<li>${f}</li>`).join('')}
          </ul>
          
          <h2>AI Recommendations Summary</h2>
          <ul>
            ${(reportData.recommendationsSummary || reportData.recommendations || []).map((r: string) => `<li>${r}</li>`).join('')}
          </ul>

          ${reportData.hazardsDetail && reportData.hazardsDetail.length > 0 ? `
            <h2>Active Hazard Observations</h2>
            ${hazardsChartUrl ? `<div style="text-align: center; margin: 15px 0;"><img src="${hazardsChartUrl}" alt="Hazards Distribution" style="max-width: 100%; height: auto; border-radius: 8px;" /></div>` : ''}
            <table class="detail-table">
              <thead>
                <tr>
                  <th>Hazard</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Severity</th>
                </tr>
              </thead>
              <tbody>
                ${reportData.hazardsDetail.map((h: any) => `
                  <tr>
                    <td><strong>${h.title}</strong><br/><span style="font-size:11px;color:#64748b;">${h.description || ''}</span></td>
                    <td>${h.department}</td>
                    <td><span class="status-badge status-${h.status}">${h.status}</span></td>
                    <td>${h.severity || 'Medium'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : ''}

          ${reportData.recommendationsDetail && reportData.recommendationsDetail.length > 0 ? `
            <h2>Detailed Action Items</h2>
            <table class="detail-table">
              <thead>
                <tr>
                  <th>Action Recommendation</th>
                  <th>Priority</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${reportData.recommendationsDetail.map((r: any) => `
                  <tr>
                    <td><strong>${r.title}</strong><br/><span style="font-size:11px;color:#64748b;">${r.description}</span></td>
                    <td>${r.priority}</td>
                    <td><span class="status-badge">${r.status}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : ''}

          ${reportData.finalConclusion ? `
            <div class="conclusion-box">
              <h2>Final Ergonomic Conclusion & OSH Sign-off</h2>
              <p style="margin-bottom:0;font-size:13.5px;">${reportData.finalConclusion}</p>
            </div>
          ` : ''}
          
          <div class="footer">
            ErgonoAI &middot; ISO 7730 & NMQ Compliant &middot; Generated via Gemini AI
          </div>
          
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `

    printWindow.document.write(content)
    printWindow.document.close()
  }

  function handleDownloadJson(report: any) {
    const raw = report.rawReport || {
      title: report.title,
      description: report.description,
      date: report.date
    }
    const reportData = typeof raw === 'string' ? JSON.parse(raw) : raw
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute("href", dataStr)
    downloadAnchor.setAttribute("download", `${(reportData.title || report.title).replace(/\s+/g, '_')}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  // Filtered reports list
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const matchDept = selectedDeptFilter === 'all'
        ? true
        : selectedDeptFilter === 'saved'
          ? r.isSaved
          : selectedDeptFilter === 'org'
            ? (r.departmentId === 'all' || r.departmentsCount > 1)
            : r.departmentId === selectedDeptFilter

      const matchSearch = searchQuery.trim() === '' || (
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.departmentName.toLowerCase().includes(searchQuery.toLowerCase())
      )

      return matchDept && matchSearch
    })
  }, [reports, selectedDeptFilter, searchQuery])

  // Count ready departments
  const readyDeptsCount = departments.filter(d => d.isReadyForReport).length
  const totalCompletedResponses = departments.reduce((sum, d) => sum + d.completedCount, 0)
  const savedReportsCount = reports.filter(r => r.isSaved).length

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[70vh] bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-8 font-sans" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-2.5 py-0.5 rounded-full border border-teal-200/60 dark:border-teal-900/40">
              {isAr ? 'مركز التقارير التنفيذية' : 'Executive Audit Center'}
            </span>
            <span className="text-xs text-muted-foreground">· {orgName}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight mt-1 font-sora">
            {isAr ? 'تقارير الأقسام والامتثال الأرغونومي' : 'Department & Executive Reports'}
          </h1>
          <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
            {isAr
              ? 'توليد وحفظ وحذف تقارير الأداء الأرغونومي المعتمدة بالذكاء الاصطناعي لكل قسم، مع إمكانية التصدير المباشر لملفات PDF.'
              : 'Generate, save, export, and delete AI ergonomic audit reports per department as soon as assessments complete.'}
          </p>
        </div>

        {/* Global Organization Report Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleGenerateReport('all')}
            disabled={generatingDeptId !== null || totalCompletedResponses === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand text-brand-foreground text-xs font-bold hover:bg-brand/90 transition-all shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {generatingDeptId === 'all' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {isAr ? 'جاري التحليل الشامل...' : 'Compiling Full Org Report...'}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                {isAr ? 'توليد التقرير الشامل للمؤسسة' : 'Generate Full Org Report'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Top Overview KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: isAr ? 'الأقسام الجاهزة للتقرير' : 'Departments Ready for Report',
            value: `${readyDeptsCount} / ${departments.length}`,
            sub: readyDeptsCount === departments.length ? (isAr ? 'جميع الأقسام مكتملة' : 'All departments ready') : (isAr ? 'حملات التقييم قيد الإنجاز' : 'Campaigns in progress'),
            icon: Building2,
            accent: readyDeptsCount > 0 ? 'text-success bg-success/10' : 'text-muted-foreground bg-muted'
          },
          {
            label: isAr ? 'إجمالي الاستبيانات المكتملة' : 'Completed Employee Surveys',
            value: totalCompletedResponses,
            sub: isAr ? 'إجابات موظفين محللة بالذكاء الاصطناعي' : 'Anonymized employee submissions',
            icon: Users,
            accent: 'text-brand bg-brand/10'
          },
          {
            label: isAr ? 'التقارير المحفوظة والمؤرشفة' : 'Archived & Saved Reports',
            value: `${reports.length} ${savedReportsCount > 0 ? `(${savedReportsCount} saved)` : ''}`,
            sub: isAr ? 'تقارير قابلة للحفظ والتصدير والحذف' : 'Exportable & deletable records',
            icon: FileText,
            accent: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30'
          },
          {
            label: isAr ? 'المعايير المعتمدة' : 'Compliance Standards',
            value: 'ISO 7730 & NMQ',
            sub: isAr ? 'تقييم الراحة والجهد العضلي' : 'Physical & environmental criteria',
            icon: Shield,
            accent: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30'
          }
        ].map(({ label, value, sub, icon: Icon, accent }) => (
          <div key={label} className="bg-card rounded-2xl border border-border p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground font-medium">{label}</span>
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', accent)}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground font-sora">{value}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {orgReadinessNotice && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
          <div className="flex-1">
            <strong className="font-semibold block mb-0.5">{isAr ? 'حالة جاهزية الاستبيانات' : 'Campaign Progress Note'}</strong>
            {orgReadinessNotice}
          </div>
        </div>
      )}

      {/* SECTION 1: DEPARTMENT ASSESSMENT CAMPAIGNS & REPORT GENERATION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-foreground flex items-center gap-2 font-sora">
              <Building2 className="w-4 h-4 text-brand" />
              {isAr ? 'تقارير الأقسام (مقسمة حسب القسم)' : 'Department Assessment Reports'}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isAr
                ? 'كل قسم أكمل استبياناته يظهر هنا لتوليد تقريره الخاص وحفظه أو تصديره.'
                : 'Each department with completed assessments is shown below. Generate and save dedicated reports per department.'}
            </p>
          </div>
        </div>

        {departments.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-border rounded-2xl bg-muted/10">
            <Building2 className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold text-foreground">{isAr ? 'لم يتم العثور على أقسام' : 'No departments configured'}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {isAr ? 'قم بإضافة أقسامك في إعدادات المؤسسة أولاً.' : 'Configure your organization departments to enable per-department reports.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {departments.map((dept) => {
              const isGeneratingThis = generatingDeptId === dept.id
              const hasReport = Boolean(dept.latestReportId)

              return (
                <div
                  key={dept.id}
                  className={cn(
                    'group bg-card border rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-md relative overflow-hidden',
                    dept.isReadyForReport ? 'border-border hover:border-brand/50' : 'border-border/60 bg-muted/10'
                  )}
                >
                  {/* Department Card Header */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-foreground group-hover:text-brand transition-colors font-sora">
                            {dept.name}
                          </h3>
                          {dept.isReadyForReport && (
                            <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-success/15 text-success">
                              <CheckCircle2 className="w-3 h-3" />
                              {dept.hasCompletedCampaign ? (isAr ? 'مكتمل' : '100% Ready') : (isAr ? 'بيانات جاهزة' : 'Data Ready')}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-muted-foreground block mt-0.5">
                          {isAr ? 'رئيس القسم' : 'Head'}: {dept.chef} · {dept.employeeCount} {isAr ? 'موظف' : 'members'}
                        </span>
                      </div>

                      {/* Wellness Score Badge */}
                      {dept.wellnessScore !== null ? (
                        <div className="text-right shrink-0">
                          <span className={cn(
                            'text-xs font-bold px-2 py-1 rounded-lg font-mono block',
                            dept.wellnessScore >= 7 ? 'bg-success/15 text-success' : dept.wellnessScore >= 5 ? 'bg-warning/15 text-warning' : 'bg-danger/15 text-danger'
                          )}>
                            {dept.wellnessScore.toFixed(1)}/10
                          </span>
                          <span className="text-[9px] text-muted-foreground uppercase">{isAr ? 'مؤشر الراحة' : 'Comfort'}</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded shrink-0">
                          {isAr ? 'بانتظار البيانات' : 'No data'}
                        </span>
                      )}
                    </div>

                    {/* Progress Meter */}
                    <div className="space-y-1.5 my-3.5 bg-muted/40 p-3 rounded-xl border border-border/50">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground font-medium">
                          {isAr ? 'نسبة إكمال التقييم' : 'Assessment Progress'}
                        </span>
                        <span className="font-bold text-foreground">
                          {dept.completedCount} / {dept.assignedCount || dept.employeeCount} ({dept.completionRate}%)
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className={cn(
                            'h-2 rounded-full transition-all duration-500',
                            dept.completionRate === 100 ? 'bg-success' : dept.completionRate > 0 ? 'bg-brand' : 'bg-transparent'
                          )}
                          style={{ width: `${Math.min(100, Math.max(5, dept.completionRate))}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1">
                        <span>{dept.openHazardsCount} {isAr ? 'ملاحظات سلامة مفتوحة' : 'open hazards'}</span>
                        {dept.latestReportDate && (
                          <span className="text-brand font-medium">
                            {isAr ? 'آخر تقرير' : 'Latest report'}: {dept.latestReportDate}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-border flex items-center justify-between gap-2 mt-auto">
                    {dept.isReadyForReport ? (
                      <>
                        <button
                          onClick={() => handleGenerateReport(dept.id)}
                          disabled={isGeneratingThis || generatingDeptId !== null}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-brand text-brand-foreground text-xs font-bold hover:bg-brand/90 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                        >
                          {isGeneratingThis ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              {isAr ? 'جاري التحليل...' : 'Generating...'}
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5" />
                              {hasReport ? (isAr ? 'إعادة توليد التقرير' : 'Regenerate Report') : (isAr ? 'توليد تقرير القسم' : 'Generate Report')}
                            </>
                          )}
                        </button>

                        {hasReport && (
                          <button
                            onClick={() => {
                              const found = reports.find(r => r.id === dept.latestReportId)
                              if (found) handleDownloadPdf(found)
                            }}
                            title={isAr ? 'طباعة / حفظ PDF' : 'Save / Export PDF'}
                            className="p-2 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors cursor-pointer shrink-0"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        )}
                      </>
                    ) : (
                      <div className="w-full flex items-center justify-center py-2 text-xs text-muted-foreground font-medium bg-muted/30 rounded-xl border border-dashed border-border">
                        <Clock className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                        {isAr ? 'بانتظار إجابات موظفي هذا القسم' : 'Awaiting employee submissions'}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* SECTION 2: GENERATED REPORTS ARCHIVE & MANAGEMENT */}
      <div className="space-y-4 pt-4 border-t border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-foreground flex items-center gap-2 font-sora">
              <FileText className="w-4 h-4 text-brand" />
              {isAr ? 'إدارة وحفظ وحذف التقارير المولدة' : 'Manage, Save & Delete Reports'}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isAr
                ? 'استعراض أو حفظ أو تصدير PDF أو حذف أي تقرير تم توليده بضغطة زر.'
                : 'View, save as PDF/JSON, bookmark, or permanently delete generated reports.'}
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'بحث في التقارير...' : 'Search reports...'}
              className="w-full bg-card border border-border rounded-xl pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
        </div>

        {/* Filter Tabs by Department & Saved */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedDeptFilter('all')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer',
              selectedDeptFilter === 'all'
                ? 'bg-brand text-brand-foreground shadow-sm'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground'
            )}
          >
            {isAr ? 'جميع التقارير' : 'All Reports'} ({reports.length})
          </button>

          {savedReportsCount > 0 && (
            <button
              onClick={() => setSelectedDeptFilter('saved')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer',
                selectedDeptFilter === 'saved'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-card border border-border text-amber-600 dark:text-amber-400 hover:text-foreground'
              )}
            >
              <Bookmark className="w-3 h-3 fill-current" />
              {isAr ? 'التقارير المحفوظة' : 'Saved'} ({savedReportsCount})
            </button>
          )}

          <button
            onClick={() => setSelectedDeptFilter('org')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer',
              selectedDeptFilter === 'org'
                ? 'bg-brand text-brand-foreground shadow-sm'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground'
            )}
          >
            {isAr ? 'شامل للمؤسسة' : 'Organization-Wide'}
          </button>

          {departments.map((dept) => {
            const count = reports.filter(r => r.departmentId === dept.id).length
            if (count === 0) return null

            return (
              <button
                key={dept.id}
                onClick={() => setSelectedDeptFilter(dept.id)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer',
                  selectedDeptFilter === dept.id
                    ? 'bg-brand text-brand-foreground shadow-sm'
                    : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                )}
              >
                {dept.name} ({count})
              </button>
            )
          })}
        </div>

        {/* Reports Cards Grid */}
        {filteredReports.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-border rounded-2xl bg-muted/10">
            <FileText className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-sm font-semibold text-foreground">
              {isAr ? 'لا توجد تقارير مطابقة' : 'No reports found for this filter'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {isAr
                ? 'اختر قسماً جاهزاً من الأعلى واضغط على "توليد تقرير القسم".'
                : 'Generate a report from the departments section above to see it archived here.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredReports.map((report) => {
              const risk = (report.overallRisk || 'medium').toLowerCase()
              const isOrgWide = report.departmentId === 'all' || report.departmentsCount > 1
              const isDeleting = deletingReportId === report.id
              const isSaving = savingReportId === report.id

              return (
                <div
                  key={report.id}
                  className={cn(
                    'bg-card rounded-2xl border p-5 shadow-sm hover:border-border/80 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden',
                    report.isSaved ? 'border-amber-500/40 bg-amber-500/[0.02]' : 'border-border'
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      'w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mt-0.5',
                      isOrgWide ? 'bg-brand/10 text-brand' : 'bg-teal-500/10 text-teal-600 dark:text-teal-400'
                    )}>
                      {isOrgWide ? <Layers className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-foreground font-sora">
                          {report.title}
                        </h3>
                        <span className={cn(
                          'text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border',
                          isOrgWide
                            ? 'bg-brand/10 text-brand border-brand/20'
                            : 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-900/40'
                        )}>
                          {report.departmentName}
                        </span>
                        <span className={cn(
                          'text-[10px] font-bold uppercase px-2 py-0.5 rounded-full',
                          risk === 'low' ? 'bg-success/15 text-success' : risk === 'medium' ? 'bg-warning/15 text-warning' : 'bg-danger/15 text-danger'
                        )}>
                          Risk: {risk}
                        </span>
                        {report.isSaved && (
                          <span className="flex items-center gap-1 text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/30">
                            <Bookmark className="w-2.5 h-2.5 fill-current" />
                            {isAr ? 'محفوظ' : 'Saved'}
                          </span>
                        )}
                        {report.fallbackOccurred && (
                          <span className="text-[9px] font-bold bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-full border border-amber-500/20">
                            Groq Fallback
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-2 max-w-2xl leading-relaxed">
                        {report.rawReport?.executiveSummary || report.description}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground pt-1 flex-wrap">
                        <span>{isAr ? 'تاريخ الإصدار' : 'Date'}: {report.date}</span>
                        <span>·</span>
                        <span>{report.responseRate}</span>
                        {report.completionRate !== null && (
                          <>
                            <span>·</span>
                            <span>{report.completionRate}% {isAr ? 'معدل الإكمال' : 'completion'}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions (View, Save PDF, Bookmark, JSON, Delete) */}
                  <div className="flex items-center gap-1.5 shrink-0 md:self-center flex-wrap">
                    {/* Bookmark / Pin */}
                    <button
                      onClick={() => handleToggleSaveReport(report)}
                      disabled={isSaving}
                      title={report.isSaved ? (isAr ? 'إلغاء التثبيت' : 'Unsave report') : (isAr ? 'حفظ / تثبيت التقرير' : 'Save / Bookmark report')}
                      className={cn(
                        'p-2 rounded-xl border transition-colors cursor-pointer',
                        report.isSaved
                          ? 'bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400'
                          : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted/40'
                      )}
                    >
                      {isSaving ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : report.isSaved ? (
                        <BookmarkCheck className="w-3.5 h-3.5 fill-current" />
                      ) : (
                        <Bookmark className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {/* View Report */}
                    <button
                      onClick={() => setActiveReportModal(report)}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-muted/60 hover:bg-muted text-foreground text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      {isAr ? 'عرض' : 'View'}
                    </button>

                    {/* Save / Export PDF */}
                    <button
                      onClick={() => handleDownloadPdf(report)}
                      title={isAr ? 'حفظ وتصدير PDF' : 'Save / Export PDF'}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand text-brand-foreground text-xs font-bold hover:bg-brand/90 transition-all shadow-sm cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      {isAr ? 'حفظ PDF' : 'Save PDF'}
                    </button>

                    {/* Download JSON */}
                    <button
                      onClick={() => handleDownloadJson(report)}
                      title={isAr ? 'حفظ كملف JSON' : 'Save JSON raw data'}
                      className="p-2 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Report Button */}
                    <button
                      onClick={() => setReportToDelete(report)}
                      disabled={isDeleting}
                      title={isAr ? 'حذف هذا التقرير' : 'Delete this report'}
                      className="p-2 rounded-xl border border-red-200 dark:border-red-950/40 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isDeleting ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-red-600" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5 text-red-600" />
                      )}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* INTERACTIVE REPORT VIEW MODAL */}
      {activeReportModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-sans animate-in fade-in duration-200"
          dir={isAr ? 'rtl' : 'ltr'}
        >
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col transition-all zoom-in-95">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand/10 flex items-center justify-center text-brand">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground font-sora truncate max-w-md">
                    {activeReportModal.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-semibold text-brand">{activeReportModal.departmentName}</span>
                    <span>·</span>
                    <span>{activeReportModal.date}</span>
                  </div>
                </div>
              </div>

              {/* Header Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleSaveReport(activeReportModal)}
                  title={activeReportModal.isSaved ? (isAr ? 'إلغاء الحفظ' : 'Unsave') : (isAr ? 'حفظ التقرير' : 'Save report')}
                  className={cn(
                    'p-2 rounded-lg border transition-colors cursor-pointer',
                    activeReportModal.isSaved
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-600'
                      : 'border-border text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Bookmark className={cn('w-3.5 h-3.5', activeReportModal.isSaved && 'fill-current')} />
                </button>

                <button
                  onClick={() => handleDownloadPdf(activeReportModal)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand text-brand-foreground text-xs font-bold hover:bg-brand/90 transition-all cursor-pointer shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  {isAr ? 'حفظ وتصدير PDF' : 'Save / Print PDF'}
                </button>

                {activeReportModal.id && (
                  <button
                    onClick={() => {
                      setReportToDelete(activeReportModal)
                    }}
                    title={isAr ? 'حذف هذا التقرير' : 'Delete report'}
                    className="p-2 rounded-lg border border-red-200 dark:border-red-950/40 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  onClick={() => setActiveReportModal(null)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-foreground">
              {/* Executive Summary */}
              <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand">
                  {isAr ? 'الملخص التنفيذي' : 'Executive Summary'}
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {activeReportModal.rawReport?.executiveSummary || activeReportModal.description}
                </p>
              </div>

              {/* Key Findings */}
              {activeReportModal.rawReport?.keyFindings && activeReportModal.rawReport.keyFindings.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand" />
                    {isAr ? 'أهم نتائج وملاحظات التقييم' : 'Key Assessment Findings'}
                  </h4>
                  <ul className="space-y-1.5 pl-4 list-disc text-muted-foreground">
                    {activeReportModal.rawReport.keyFindings.map((finding: string, idx: number) => (
                      <li key={idx} className="leading-relaxed">{finding}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations Summary */}
              {activeReportModal.rawReport?.recommendationsSummary && activeReportModal.rawReport.recommendationsSummary.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-warning" />
                    {isAr ? 'توصيات الذكاء الاصطناعي الأرغونومية' : 'AI Ergonomic Action Items'}
                  </h4>
                  <ul className="space-y-1.5 pl-4 list-disc text-muted-foreground">
                    {activeReportModal.rawReport.recommendationsSummary.map((rec: string, idx: number) => (
                      <li key={idx} className="leading-relaxed">{rec}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Conclusion Box */}
              {activeReportModal.rawReport?.finalConclusion && (
                <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/40 text-teal-900 dark:text-teal-200 space-y-1">
                  <strong className="text-xs font-bold block">{isAr ? 'خلاصة التقييم الأرغونومي' : 'Final Ergonomic Conclusion'}</strong>
                  <p className="text-xs leading-relaxed opacity-90">{activeReportModal.rawReport.finalConclusion}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-border bg-muted/20 flex items-center justify-between">
              <button
                onClick={() => handleDownloadJson(activeReportModal)}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                {isAr ? 'تحميل كـ JSON' : 'Download raw JSON'}
              </button>

              <button
                onClick={() => setActiveReportModal(null)}
                className="px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold transition-colors cursor-pointer"
              >
                {isAr ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG MODAL */}
      {reportToDelete && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-sans animate-in fade-in duration-200"
          dir={isAr ? 'rtl' : 'ltr'}
        >
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-destructive/15 border border-destructive/20 flex items-center justify-center text-destructive shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground font-sora">
                  {isAr ? 'تأكيد حذف التقرير' : 'Delete Report'}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {isAr
                    ? `هل أنت متأكد من رغبتك في حذف "${reportToDelete.title}"؟ لا يمكن التراجع عن هذا الإجراء.`
                    : `Are you sure you want to permanently delete "${reportToDelete.title}"? This action cannot be undone.`}
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={deletingReportId !== null}
                onClick={() => setReportToDelete(null)}
                className="px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-medium transition-colors cursor-pointer"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>

              <button
                type="button"
                disabled={deletingReportId !== null}
                onClick={() => handleDeleteReport(reportToDelete.id)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs font-bold transition-all cursor-pointer shadow-sm disabled:opacity-50"
              >
                {deletingReportId === reportToDelete.id ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    {isAr ? 'جاري الحذف...' : 'Deleting...'}
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    {isAr ? 'نعم، حذف التقرير' : 'Delete Report'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
