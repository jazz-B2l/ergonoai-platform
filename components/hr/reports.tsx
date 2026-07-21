import { useState, useEffect } from 'react'
import { FileText, Download, Clock, Shield, TrendingUp, Sparkles, Loader2, Printer, AlertTriangle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

export function HRReports() {
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [orgId, setOrgId] = useState<string | null>(null)
  const [readinessNotice, setReadinessNotice] = useState<string | null>(null)

  async function fetchReports() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get membership organization
      const { data: member } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('profile_id', user.id)
        .eq('is_active', true)
        .maybeSingle()

      if (!member) return
      const currentOrgId = member.organization_id
      setOrgId(currentOrgId)

      // Fetch assessment campaign readiness status
      const { data: campaigns } = await supabase
        .from('assessment_campaigns')
        .select('id')
        .eq('organization_id', currentOrgId)

      if (!campaigns || campaigns.length === 0) {
        setReadinessNotice('No assessment campaign created yet. You must create an assessment campaign and collect employee responses before generating an executive report.')
      } else {
        const campaignIds = campaigns.map(c => c.id)
        const { data: assignments } = await supabase
          .from('assessment_assignments')
          .select('id')
          .in('campaign_id', campaignIds)

        const assignmentIds = (assignments || []).map(a => a.id)
        if (assignmentIds.length === 0) {
          setReadinessNotice('No employee assessment assignments found. Employees must be assigned to an assessment campaign first.')
        } else {
          const { data: responses } = await supabase
            .from('assessment_responses')
            .select('id')
            .in('assignment_id', assignmentIds)

          const totalResponses = responses?.length || 0
          const totalAssignments = assignmentIds.length

          if (totalResponses === 0) {
            setReadinessNotice('No completed employee assessments found. Employees must finish answering their assessments before generating an executive report.')
          } else if (totalResponses < totalAssignments) {
            setReadinessNotice(`Assessment campaign is still in progress (${totalResponses} of ${totalAssignments} employees completed). All assigned employees must finish answering their assessments before generating an executive report.`)
          } else {
            setReadinessNotice(null)
          }
        }
      }

      // Fetch generated reports
      const { data: reportsData } = await supabase
        .from('generated_reports')
        .select('*')
        .eq('organization_id', currentOrgId)
        .order('created_at', { ascending: false })

      if (reportsData) {
        const mapped = reportsData.map(r => ({
          id: r.id,
          title: r.name,
          subtitle: r.type === 'AI_EXECUTIVE' ? 'Executive Ergonomic Summary' : r.type,
          type: r.type === 'AI_EXECUTIVE' ? 'wellbeing' : 'osh',
          date: new Date(r.created_at).toLocaleDateString(),
          departments: r.parameters?.departmentCount || 0,
          responseRate: r.parameters?.totalAssessments ? `${r.parameters.totalAssessments} responses` : 'N/A',
          status: r.status === 'COMPLETED' ? 'ready' : r.status === 'FAILED' ? 'failed' : 'processing',
          description: `AI-generated report compiled in ${r.generation_time_ms || 0}ms. Storage size: ${(r.file_size / 1024).toFixed(2)} KB.`,
          rawReport: r.parameters?.reportData
        }))
        setReports(mapped)
      }
    } catch (err) {
      console.error('Failed to load reports:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [])

  async function handleGenerateReport() {
    if (!orgId) return
    if (readinessNotice) {
      alert(`Cannot Generate Report:\n\n${readinessNotice}`)
      return
    }
    setGenerating(true)
    try {
      const res = await fetch('/api/ai/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organizationId: orgId })
      })
      if (res.ok) {
        await fetchReports()
      } else {
        const errData = await res.json()
        alert(`Cannot Generate Report: ${errData.message || 'Unknown error'}`)
      }
    } catch (err) {
      console.error(err)
      alert('An error occurred during report generation.')
    } finally {
      setGenerating(false)
    }
  }

  function handleDownloadPdf(report: any) {
    const raw = report.rawReport || {
      title: report.title,
      executiveSummary: report.description,
      overallRiskLevel: 'medium',
      keyFindings: ['Detailed assessment report metadata is archived in your storage path.'],
      recommendationsSummary: ['Refer to the recommendations section on your dashboard.']
    };
    
    const reportData = typeof raw === 'string' ? JSON.parse(raw) : raw;

    let hazardsChartUrl = '';
    if (reportData.hazardsDetail && reportData.hazardsDetail.length > 0) {
      const counts = reportData.hazardsDetail.reduce((acc: any, h: any) => {
        acc[h.status] = (acc[h.status] || 0) + 1;
        return acc;
      }, {});
      const labels = Object.keys(counts);
      const data = Object.values(counts);
      const bgColors = labels.map((l: string) => l === 'OPEN' ? '#fee2e2' : l === 'INVESTIGATING' ? '#fef9c3' : '#dcfce7');
      const chartConfig = {
        type: 'doughnut',
        data: {
          labels,
          datasets: [{ data, backgroundColor: bgColors }]
        },
        options: {
          plugins: {
            legend: { position: 'right' }
          }
        }
      };
      hazardsChartUrl = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(chartConfig))}&w=400&h=200`;
    }

    let recsChartUrl = '';
    if (reportData.recommendationsDetail && reportData.recommendationsDetail.length > 0) {
      const counts = reportData.recommendationsDetail.reduce((acc: any, r: any) => {
        acc[r.status] = (acc[r.status] || 0) + 1;
        return acc;
      }, {});
      const labels = Object.keys(counts);
      const data = Object.values(counts);
      const chartConfig = {
        type: 'doughnut',
        data: {
          labels,
          datasets: [{ data }]
        },
        options: {
          plugins: {
            legend: { position: 'right' }
          }
        }
      };
      recsChartUrl = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(chartConfig))}&w=400&h=200`;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Pop-up blocker is enabled. Please allow popups for this site to generate the PDF.');
      return;
    }

    const content = `
      <html>
        <head>
          <title>${reportData.title || report.title}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
              line-height: 1.6;
              color: #334155;
              padding: 40px;
              max-width: 800px;
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
              font-size: 20px;
              font-weight: bold;
              color: #0f766e;
            }
            .date {
              font-size: 12px;
              color: #64748b;
            }
            h1 {
              font-size: 24px;
              color: #0f172a;
              margin-top: 0;
              margin-bottom: 10px;
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
              padding-bottom: 5px;
              margin-top: 30px;
            }
            .summary {
              background-color: #f8fafc;
              border-left: 4px solid #0f766e;
              padding: 15px;
              margin-bottom: 25px;
              border-radius: 0 8px 8px 0;
            }
            ul {
              padding-left: 20px;
            }
            li {
              margin-bottom: 10px;
            }
            .footer {
              margin-top: 60px;
              border-top: 1px solid #e2e8f0;
              padding-top: 15px;
              font-size: 11px;
              color: #94a3b8;
              text-align: center;
            }
            .detail-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
              margin-bottom: 20px;
              font-size: 13px;
            }
            .detail-table th, .detail-table td {
              border: 1px solid #e2e8f0;
              padding: 8px 12px;
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
              font-size: 11px;
              font-weight: bold;
              text-transform: uppercase;
              background-color: #f1f5f9;
              color: #475569;
            }
            .status-OPEN { background-color: #fee2e2; color: #b91c1c; }
            .status-INVESTIGATING { background-color: #fef9c3; color: #a16207; }
            .status-RESOLVED { background-color: #dcfce7; color: #15803d; }
            
            .conclusion-box {
              background-color: #e0f2fe;
              border: 1px solid #bae6fd;
              padding: 20px;
              border-radius: 8px;
              margin-top: 30px;
              margin-bottom: 30px;
            }
            .conclusion-box h2 {
              margin-top: 0;
              border-bottom: none;
              color: #0369a1;
            }
            @media print {
              body { padding: 0; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="brand">ErgonoAI</div>
            <div class="date">Generated: ${report.date || new Date().toLocaleDateString()}</div>
          </div>
          
          <h1>${reportData.title || report.title}</h1>
          
          <div style="margin-bottom: 20px;">
            <span class="risk-badge risk-${(reportData.overallRiskLevel || 'medium').toLowerCase()}">
              Overall Risk: ${reportData.overallRiskLevel || 'Medium'}
            </span>
          </div>
          
          <div class="summary">
            <strong>Executive Summary:</strong><br/>
            ${reportData.executiveSummary || reportData.summary || 'No summary available.'}
          </div>
          
          <h2>Key Findings</h2>
          <ul>
            ${(reportData.keyFindings || []).map((f: string) => `<li>${f}</li>`).join('')}
          </ul>
          
          <h2>Recommendations Summary</h2>
          <ul>
            ${(reportData.recommendationsSummary || reportData.recommendations || []).map((r: string) => `<li>${r}</li>`).join('')}
          </ul>

          ${reportData.hazardsDetail && reportData.hazardsDetail.length > 0 ? `
            <h2>Detailed Active Hazards</h2>
            ${hazardsChartUrl ? `<div style="text-align: center; margin: 20px 0;"><img src="${hazardsChartUrl}" alt="Hazards Chart" style="max-width: 100%; height: auto; border-radius: 8px;" /></div>` : ''}
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
                    <td><strong>${h.title}</strong><br/><span style="font-size:11px;color:#64748b;">${h.description}</span></td>
                    <td>${h.department}</td>
                    <td><span class="status-badge status-${h.status}">${h.status}</span></td>
                    <td>${h.severity}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : ''}

          ${reportData.recommendationsDetail && reportData.recommendationsDetail.length > 0 ? `
            <h2>Detailed AI Recommendations</h2>
            ${recsChartUrl ? `<div style="text-align: center; margin: 20px 0;"><img src="${recsChartUrl}" alt="Recommendations Chart" style="max-width: 100%; height: auto; border-radius: 8px;" /></div>` : ''}
            <table class="detail-table">
              <thead>
                <tr>
                  <th>Recommendation</th>
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
              <h2>Final Ergonomic Conclusion</h2>
              <p>${reportData.finalConclusion}</p>
            </div>
          ` : ''}
          
          ${reportData.additionalNotes ? `
            <h2>Additional Safety Notes</h2>
            <p>${reportData.additionalNotes}</p>
          ` : ''}
          
          <div class="footer">
            ErgonoAI Workplace Ergonomics Management Platform &middot; Powered by Groq AI
          </div>
          
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
  }

  function handleDownloadJson(report: any) {
    const raw = report.rawReport || {
      title: report.title,
      description: report.description,
      date: report.date
    };
    const reportData = typeof raw === 'string' ? JSON.parse(raw) : raw;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${(reportData.title || report.title).replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    )
  }

  const ready = reports.filter((r) => r.status === 'ready')
  const processing = reports.filter((r) => r.status === 'processing')

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Exportable reports for HR, OSH Committee, and management review
          </p>
        </div>
        <button
          onClick={handleGenerateReport}
          disabled={generating || !orgId}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand text-brand-foreground text-xs font-semibold hover:bg-brand/90 transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
        >
          {generating ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Generating Report...
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              Generate Executive Report
            </>
          )}
        </button>
      </div>

      {readinessNotice && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 font-sans text-xs">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
          <div>
            <strong className="font-semibold block mb-0.5">Report Generation Pending</strong>
            {readinessNotice}
          </div>
        </div>
      )}

      {/* Info banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans">
        {[
          { icon: Shield, label: 'OSH Compliance-Support', desc: 'Organized by hazard category. Supports committee documentation.' },
          { icon: TrendingUp, label: 'Wellbeing / Ergonomics', desc: 'Anonymized aggregate scores with cycle-over-cycle trend comparison.' },
          { icon: Clock, label: 'On-Demand Generation', desc: 'Compile data from active assessments dynamically at any moment.' },
        ].map(({ icon: Icon, label, desc }) => (
          <div key={label} className="bg-card rounded-xl border border-border p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4 text-brand" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Generating/Processing reports */}
      {processing.length > 0 && (
        <div className="space-y-3 font-sans">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-mono">Processing</h2>
          {processing.map((report) => (
            <div key={report.id} className="bg-card rounded-xl border border-border p-5 animate-pulse">
              <div className="flex items-center gap-4">
                <Loader2 className="w-5 h-5 text-brand animate-spin" />
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{report.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Report is being generated in the background...</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ready reports */}
      <div className="space-y-3 font-sans">
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-mono">Current Cycle</h2>
        {ready.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-border rounded-xl bg-muted/10">
            <FileText className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-sm font-semibold text-foreground">No reports generated yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Click the &quot;Generate Executive Report&quot; button above to compile your first organization assessment summary.
            </p>
          </div>
        ) : (
          ready.map((report) => (
            <div key={report.id} className="bg-card rounded-xl border border-border p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                    report.type === 'wellbeing' ? 'bg-success/10' : 'bg-brand/10',
                  )}>
                    <FileText className={cn('w-5 h-5', report.type === 'wellbeing' ? 'text-success' : 'text-brand')} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{report.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{report.subtitle}</p>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed max-w-xl">{report.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span>Generated {report.date}</span>
                      <span>·</span>
                      <span>{report.departments} departments</span>
                      {report.responseRate !== 'N/A' && (
                        <>
                          <span>·</span>
                          <span>{report.responseRate}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 shrink-0">
                  <button 
                    onClick={() => handleDownloadPdf(report)}
                    className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-brand text-brand-foreground text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Export PDF
                  </button>
                  <button 
                    onClick={() => handleDownloadJson(report)}
                    className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted/10 text-xs font-medium transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download JSON
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
