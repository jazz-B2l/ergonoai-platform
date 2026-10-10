import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: campaignId } = await params
    if (!campaignId) {
      return NextResponse.json({ error: 'Campaign ID required' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'User authentication required' },
        { status: 401 }
      )
    }

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

    // Verify campaign belongs to user's organization
    const { data: campaign } = await supabase
      .from('assessment_campaigns')
      .select('id, organization_id')
      .eq('id', campaignId)
      .maybeSingle()

    if (!campaign || campaign.organization_id !== member.organization_id) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'You do not have permission to delete this campaign' },
        { status: 403 }
      )
    }

    // Delete campaign (CASCADE deletes assignments and responses in PostgreSQL)
    const { error: deleteErr } = await supabase
      .from('assessment_campaigns')
      .delete()
      .eq('id', campaignId)

    if (deleteErr) {
      console.error('Error deleting campaign:', deleteErr)
      return NextResponse.json(
        { error: 'Delete Failed', message: deleteErr.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Assessment campaign deleted successfully' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Delete Campaign Error:', error)
    return NextResponse.json(
      { error: 'Internal Error', message: error.message || 'Failed to delete campaign' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: campaignId } = await params
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

    const body = await request.json().catch(() => ({}))

    const updateData: any = {
      updated_at: new Date().toISOString()
    }
    if (body.status) updateData.status = body.status
    if (body.end_date) updateData.end_date = body.end_date
    if (body.title) updateData.title = body.title

    const { data: updated, error: updateErr } = await supabase
      .from('assessment_campaigns')
      .update(updateData)
      .eq('id', campaignId)
      .eq('organization_id', member.organization_id)
      .select()
      .single()

    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, campaign: updated }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Update failed' }, { status: 500 })
  }
}
