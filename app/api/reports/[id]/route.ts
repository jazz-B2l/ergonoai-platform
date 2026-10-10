import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: reportId } = await params
    if (!reportId) {
      return NextResponse.json({ error: 'Report ID required' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'User authentication required' },
        { status: 401 }
      )
    }

    // Get user's active organization membership
    const { data: member } = await supabase
      .from('organization_members')
      .select('organization_id')
      .eq('profile_id', user.id)
      .eq('is_active', true)
      .maybeSingle()

    if (!member?.organization_id) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'No active organization found' },
        { status: 403 }
      )
    }

    // Verify report exists and belongs to this organization
    const { data: report, error: reportErr } = await supabase
      .from('generated_reports')
      .select('id, organization_id')
      .eq('id', reportId)
      .maybeSingle()

    if (reportErr || !report) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Report not found' },
        { status: 404 }
      )
    }

    if (report.organization_id !== member.organization_id) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'You do not have permission to delete this report' },
        { status: 403 }
      )
    }

    // Delete the report
    const { error: deleteErr } = await supabase
      .from('generated_reports')
      .delete()
      .eq('id', reportId)

    if (deleteErr) {
      console.error('Error deleting report:', deleteErr)
      return NextResponse.json(
        { error: 'Delete Failed', message: deleteErr.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Report deleted successfully' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Delete Report API Error:', error)
    return NextResponse.json(
      { error: 'Internal Error', message: error.message || 'Failed to delete report' },
      { status: 500 }
    )
  }
}

const updateReportSchema = z.object({
  name: z.string().min(1).optional(),
  isSaved: z.boolean().optional(),
  notes: z.string().optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: reportId } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: member } = await supabase
      .from('organization_members')
      .select('organization_id')
      .eq('profile_id', user.id)
      .eq('is_active', true)
      .maybeSingle()

    if (!member?.organization_id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { data: report } = await supabase
      .from('generated_reports')
      .select('*')
      .eq('id', reportId)
      .eq('organization_id', member.organization_id)
      .maybeSingle()

    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }

    const body = await request.json().catch(() => ({}))
    const parsed = updateReportSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payload', message: parsed.error.message }, { status: 400 })
    }

    const currentParams = report.parameters || {}
    const updatedParams = {
      ...currentParams,
      ...(parsed.data.isSaved !== undefined ? { isSaved: parsed.data.isSaved } : {}),
      ...(parsed.data.notes !== undefined ? { userNotes: parsed.data.notes } : {})
    }

    const updatePayload: any = {
      parameters: updatedParams
    }
    if (parsed.data.name) {
      updatePayload.name = parsed.data.name
    }

    const { data: updated, error: updateErr } = await supabase
      .from('generated_reports')
      .update(updatePayload)
      .eq('id', reportId)
      .select()
      .single()

    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, report: updated }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Update failed' }, { status: 500 })
  }
}
