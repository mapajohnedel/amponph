import 'server-only'

import { randomBytes } from 'node:crypto'
import type { User } from '@supabase/supabase-js'
import {
  normalizeOptionalText,
  partnerApplicationReviewSchema,
  partnerApplicationSchema,
  type PartnerApplicationInput,
  type PartnerApplicationRecord,
  type PartnerApplicationReviewInput,
} from '@/lib/partner/applications'
import { createServiceRoleClient } from '@/lib/supabase/service-role'

function createGeneratedPassword() {
  return `AmponPH-${randomBytes(9).toString('base64url')}`
}

export async function submitPartnerApplication(input: PartnerApplicationInput) {
  const payload = partnerApplicationSchema.parse(input)
  const supabase = createServiceRoleClient() as any

  const { data, error } = await supabase
    .from('partner_applications')
    .insert({
      applicant_type: payload.applicantType,
      organization_name: payload.organizationName,
      contact_person_name: payload.contactPersonName,
      email: payload.email.toLowerCase(),
      phone: payload.phone,
      address_line: payload.addressLine,
      city: payload.city,
      province_or_region: payload.provinceOrRegion,
      notes: normalizeOptionalText(payload.notes),
    })
    .select('*')
    .single()

  if (error) {
    if (error.code === '23505') {
      throw new Error('An application already exists for this email address.')
    }

    throw new Error(error.message)
  }

  return data as PartnerApplicationRecord
}

export async function listPartnerApplications() {
  const supabase = createServiceRoleClient() as any
  const { data, error } = await supabase
    .from('partner_applications')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []) as PartnerApplicationRecord[]
}

export async function approvePartnerApplication(
  applicationId: string,
  adminUser: User,
  input: PartnerApplicationReviewInput
) {
  const payload = partnerApplicationReviewSchema.parse(input)
  const supabase = createServiceRoleClient() as any

  const { data: application, error: applicationError } = await supabase
    .from('partner_applications')
    .select('*')
    .eq('id', applicationId)
    .single()

  if (applicationError || !application) {
    throw new Error('Partner application not found.')
  }

  const partnerApplication = application as PartnerApplicationRecord

  if (partnerApplication.status !== 'pending') {
    throw new Error('Only pending partner applications can be approved.')
  }

  const generatedPassword = createGeneratedPassword()
  const { data: createdUserData, error: createUserError } = await supabase.auth.admin.createUser({
    email: partnerApplication.email,
    password: generatedPassword,
    email_confirm: true,
    app_metadata: {
      role: 'partner',
    },
    user_metadata: {
      full_name: partnerApplication.contact_person_name,
      role: 'partner',
      account_type: 'partner',
      organization_name: partnerApplication.organization_name,
      city: partnerApplication.city,
      phone: partnerApplication.phone,
      applicant_type: partnerApplication.applicant_type,
      partner_application_id: partnerApplication.id,
    },
  })

  if (createUserError || !createdUserData.user) {
    throw new Error(createUserError?.message ?? 'Failed to create the partner account.')
  }

  const createdUserId = createdUserData.user.id

  const { error: profileError } = await supabase.from('partner_profiles').insert({
    user_id: createdUserId,
    application_id: partnerApplication.id,
    applicant_type: partnerApplication.applicant_type,
    organization_name: partnerApplication.organization_name,
    contact_person_name: partnerApplication.contact_person_name,
    email: partnerApplication.email,
    phone: partnerApplication.phone,
    address_line: partnerApplication.address_line,
    city: partnerApplication.city,
    province_or_region: partnerApplication.province_or_region,
    notes: partnerApplication.notes,
  })

  if (profileError) {
    await supabase.auth.admin.deleteUser(createdUserId)
    throw new Error(profileError.message)
  }

  const { error: updateError } = await supabase
    .from('partner_applications')
    .update({
      status: 'approved',
      reviewed_by: adminUser.id,
      reviewed_at: new Date().toISOString(),
      review_notes: normalizeOptionalText(payload.reviewNotes),
      approved_auth_user_id: createdUserId,
      approval_email_sent_at: null,
      approval_email_error: null,
    })
    .eq('id', partnerApplication.id)

  if (updateError) {
    await supabase.from('partner_profiles').delete().eq('user_id', createdUserId)
    await supabase.auth.admin.deleteUser(createdUserId)
    throw new Error(updateError.message)
  }

  return {
    email: partnerApplication.email,
    password: generatedPassword,
    organizationName: partnerApplication.organization_name,
    contactPersonName: partnerApplication.contact_person_name,
  }
}

export async function rejectPartnerApplication(
  applicationId: string,
  adminUser: User,
  input: PartnerApplicationReviewInput
) {
  const payload = partnerApplicationReviewSchema.parse(input)
  const supabase = createServiceRoleClient() as any

  const { data, error } = await supabase
    .from('partner_applications')
    .update({
      status: 'rejected',
      reviewed_by: adminUser.id,
      reviewed_at: new Date().toISOString(),
      review_notes: normalizeOptionalText(payload.reviewNotes),
    })
    .eq('id', applicationId)
    .eq('status', 'pending')
    .select('id')
    .single()

  if (error || !data) {
    throw new Error('Only pending partner applications can be rejected.')
  }
}
