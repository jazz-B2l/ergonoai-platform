'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Save, User, Phone, Mail, ArrowLeft, Loader2, Check, Building2, MapPin, Share2, Camera, Link2, UploadCloud, Search, Key, Plus, Trash2, Copy, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { WILAYAS } from '@/lib/constants'
import { useApp } from '@/lib/app-context'
import { translations } from '@/lib/translations'
import { authService } from '@/lib/auth/service'

// Dynamically import MapPicker with SSR disabled to prevent Leaflet window errors
const MapPicker = dynamic(() => import('@/components/map-picker'), {
  ssr: false,
  loading: () => <div className="h-64 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400">Loading map...</div>
})

export default function OrgProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'location' | 'admin' | 'settings'>('profile')

  const logoInputRef = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [searchingLocation, setSearchingLocation] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  // Auth User context
  const [userId, setUserId] = useState<string | null>(null)

  // User Profile fields
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('') 
  const [phone, setPhone] = useState('')
  const { language, setLanguage: setGlobalLanguage } = useApp()
  const t = translations[language].profile

  // Organization fields
  const [organizationId, setOrganizationId] = useState<string | null>(null)
  const [orgName, setOrgName] = useState('')
  const [orgDescription, setOrgDescription] = useState('')
  const [orgIndustry, setOrgIndustry] = useState('')
  const [orgSize, setOrgSize] = useState('')
  const [orgFounded, setOrgFounded] = useState('')
  const [orgLogo, setOrgLogo] = useState('')
  const [orgBanner, setOrgBanner] = useState('')
  const [orgEmail, setOrgEmail] = useState('')
  const [orgPhone, setOrgPhone] = useState('')
  const [orgWebsite, setOrgWebsite] = useState('')
  const [orgDistrict, setOrgDistrict] = useState('')
  const [orgWilaya, setOrgWilaya] = useState('')
  const [orgLat, setOrgLat] = useState(36.752887)
  const [orgLng, setOrgLng] = useState(3.042048)

  // Social Links
  const [socialLinkedin, setSocialLinkedin] = useState('')
  const [socialTwitter, setSocialTwitter] = useState('')
  const [socialFacebook, setSocialFacebook] = useState('')

  // Invite Codes State
  const [inviteCodes, setInviteCodes] = useState<any[]>([])
  const [depts, setDepts] = useState<any[]>([])
  const [sites, setSites] = useState<any[]>([])
  const [roles, setRoles] = useState<any[]>([])

  // New Invite Code form
  const [selectedRole, setSelectedRole] = useState('')
  const [selectedDept, setSelectedDept] = useState('')
  const [selectedSite, setSelectedSite] = useState('')
  const [maxUses, setMaxUses] = useState(10)
  const [expiryDate, setExpiryDate] = useState('')
  const [generatingCode, setGeneratingCode] = useState(false)
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null)

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [updatingPassword, setUpdatingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  // Password Visibility States
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  async function handleLocationSearch() {
    if (!searchQuery.trim()) return
    setSearchingLocation(true)
    setSearchError(null)
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`)
      const data = await res.json()
      if (data && data.length > 0) {
        const item = data[0]
        setOrgLat(parseFloat(item.lat))
        setOrgLng(parseFloat(item.lon))
      } else {
        setSearchError('Location not found. Please try another search term.')
      }
    } catch (err) {
      console.error('Error searching location:', err)
      setSearchError('Failed to search location. Please check your network.')
    } finally {
      setSearchingLocation(false)
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault()
    setUpdatingPassword(true)
    setPasswordError(null)
    setPasswordSuccess(false)

    try {
      if (!currentPassword || !newPassword || !confirmNewPassword) {
        throw new Error(language === 'ar' ? 'يرجى ملء جميع حقول كلمة المرور' : 'Please fill in all password fields')
      }

      if (newPassword !== confirmNewPassword) {
        throw new Error(language === 'ar' ? 'كلمات المرور الجديدة غير متطابقة' : 'New passwords do not match')
      }
      
      await authService.updatePassword({
        currentPassword,
        newPassword,
        confirmNewPassword
      })
      
      setPasswordSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
    } catch (err: any) {
      console.error('Error updating password:', err)
      setPasswordError(err.message || 'Failed to update password')
    } finally {
      setUpdatingPassword(false)
    }
  }

  async function fetchInviteCodes(orgId: string) {
    const { data: codes, error: codesError } = await supabase
      .from('invite_codes')
      .select('id, code, max_uses, used_count, expires_at, department_id, site_id, role_id')
      .eq('organization_id', orgId)
      .order('created_at', { ascending: false })

    if (codesError) {
      console.error('Error fetching invite codes:', codesError)
      return
    }

    setInviteCodes(codes || [])
  }

  useEffect(() => {
    async function loadData() {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
          router.push('/login')
          return
        }
        setUserId(user.id)
        setEmail(user.email || '')

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profile) {
          setFirstName(profile.first_name || '')
          setLastName(profile.last_name || '')
          setPhone(profile.phone || '')
          setGlobalLanguage(profile.language === 'ar' ? 'ar' : 'en')
        }

        const { data: member } = await supabase
          .from('organization_members')
          .select('organization_id')
          .eq('profile_id', user.id)
          .eq('is_active', true)
          .limit(1)
          .single()

        if (member?.organization_id) {
          const orgId = member.organization_id
          setOrganizationId(orgId)
          
          const { data: org } = await supabase
            .from('organizations')
            .select('*')
            .eq('id', orgId)
            .single()

          if (org) {
            setOrgName(org.name || '')
            setOrgDescription(org.description || '')
            setOrgIndustry(org.industry || '')
            setOrgSize(org.organization_size || '')
            setOrgFounded(org.founded_year ? org.founded_year.toString() : '')
            setOrgLogo(org.logo_url || '')
            setOrgBanner(org.banner_url || '')
            setOrgEmail(org.contact_email || '')
            setOrgPhone(org.contact_phone || '')
            setOrgWebsite(org.website || '')
            setOrgDistrict(org.district || '')
            setOrgWilaya(org.wilaya || '')
            setOrgLat(org.location_lat || 36.752887)
            setOrgLng(org.location_lng || 3.042048)

            const social = org.social_media || {}
            setSocialLinkedin(social.linkedin || '')
            setSocialTwitter(social.twitter || '')
            setSocialFacebook(social.facebook || '')
          }

          // Fetch organization settings (theme, language)
          const { data: settings } = await supabase
            .from('organization_settings')
            .select('language, theme')
            .eq('organization_id', orgId)
            .maybeSingle()

          if (settings) {
            setGlobalLanguage(settings.language === 'ar' ? 'ar' : 'en')
          }

          // Fetch invite codes, departments, sites, and roles
          await fetchInviteCodes(orgId)

          const { data: deptData } = await supabase.from('departments').select('*').eq('organization_id', orgId)
          setDepts(deptData || [])

          const { data: siteData } = await supabase.from('sites').select('*').eq('organization_id', orgId)
          setSites(siteData || [])

          const { data: roleData } = await supabase.from('roles').select('*')
          setRoles(roleData || [])
          if (roleData && roleData.length > 0) {
            const employeeRole = roleData.find(r => r.name.toUpperCase() === 'EMPLOYEE')
            setSelectedRole(employeeRole ? employeeRole.id : roleData[0].id)
          }
        }
      } catch (err: any) {
        console.error('Error loading profile data:', err)
        setError('Failed to load profile details.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 1.5 * 1024 * 1024) {
      setError('Image size should be less than 1.5MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (type === 'logo') {
        setOrgLogo(reader.result as string)
      } else {
        setOrgBanner(reader.result as string)
      }
    }
    reader.readAsDataURL(file)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          user_id: user.id,
          first_name: firstName,
          last_name: lastName,
          phone: phone || null,
          language: language,
          updated_at: new Date().toISOString()
        })

      if (profileError) throw profileError

      if (organizationId) {
        const { error: organizationError } = await supabase
          .from('organizations')
          .update({
            name: orgName,
            description: orgDescription,
            industry: orgIndustry,
            organization_size: orgSize,
            founded_year: orgFounded ? parseInt(orgFounded) : null,
            logo_url: orgLogo,
            banner_url: orgBanner,
            contact_email: orgEmail,
            contact_phone: orgPhone,
            website: orgWebsite,
            district: orgDistrict,
            wilaya: orgWilaya,
            location_lat: orgLat,
            location_lng: orgLng,
            social_media: {
              linkedin: socialLinkedin,
              twitter: socialTwitter,
              facebook: socialFacebook
            },
            updated_at: new Date().toISOString()
          })
          .eq('id', organizationId)

        if (organizationError) throw organizationError

        // Upsert organization settings (theme, language)
        const { error: settingsError } = await supabase
          .from('organization_settings')
          .upsert({
            organization_id: organizationId,
            language: language,
            updated_at: new Date().toISOString(),
            updated_by: user.id
          }, {
            onConflict: 'organization_id'
          })

        if (settingsError) throw settingsError
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      console.error('Error saving profile:', err)
      setError(err.message || 'Failed to save changes.')
    } finally {
      setSaving(false)
    }
  }

  async function handleGenerateInvite() {
    if (!organizationId || !userId || !selectedRole) {
      console.warn('Cannot generate invite code: missing context.', { organizationId, userId, selectedRole })
      setError(`Cannot generate invite: missing context (Org: ${organizationId || 'missing'}, User: ${userId || 'missing'}, Role: ${selectedRole || 'missing'}).`)
      return
    }
    setGeneratingCode(true)
    setError(null)
    setSuccess(false)

    const randomStr = 'ORG-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase()

    try {
      const { error: inviteError } = await supabase
        .from('invite_codes')
        .insert({
          organization_id: organizationId,
          role_id: selectedRole,
          department_id: selectedDept || null,
          site_id: selectedSite || null,
          code: randomStr,
          expires_at: expiryDate ? new Date(expiryDate).toISOString() : null,
          max_uses: maxUses,
          created_by: userId
        })

      if (inviteError) throw inviteError

      await fetchInviteCodes(organizationId)
      
      setSelectedSite('')
      setMaxUses(10)
      setExpiryDate('')
    } catch (err: any) {
      console.error('Error generating invite:', err)
      setError(err.message || 'Failed to generate invite code.')
    } finally {
      setGeneratingCode(false)
    }
  }

  async function handleDeleteInvite(id: string) {
    if (!confirm('Are you sure you want to delete/revoke this invite code?')) return
    setError(null)
    setSuccess(false)

    try {
      const { error: deleteError } = await supabase
        .from('invite_codes')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      setInviteCodes(prev => prev.filter(code => code.id !== id))
    } catch (err: any) {
      console.error('Error deleting invite code:', err)
      setError('Failed to revoke invite code.')
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCodeId(id)
    setTimeout(() => setCopiedCodeId(null), 2000)
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto bg-background text-foreground pb-20">
      <input type="file" ref={logoInputRef} accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'logo')} />
      <input type="file" ref={bannerInputRef} accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'banner')} />

      <form onSubmit={handleSave} className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        <div className="flex items-center justify-between border-b border-border pb-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{t.pageTitle}</h1>
            <p className="text-sm text-muted-foreground mt-1">{t.pageSubtitle}</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/org"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-border bg-card hover:bg-muted/50 text-foreground text-sm font-semibold transition-all shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" /> {t.backToDashboard}
            </Link>
            {success && (
              <span className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 animate-in fade-in duration-200">
                <Check className="w-4 h-4" /> {t.changesSaved}
              </span>
            )}
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand text-brand-foreground text-sm font-semibold hover:bg-brand/90 transition-all cursor-pointer disabled:opacity-50 shadow-sm"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? t.saving : t.saveChanges}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-danger/10 border border-danger/20 rounded-xl p-4 text-sm text-danger font-medium">
            {error}
          </div>
        )}

        {/* Header Banner & Logo Section */}
        <div className="bg-card text-card-foreground rounded-2xl border border-border overflow-hidden shadow-sm relative">
          <div 
            className="h-48 w-full relative bg-cover bg-center group overflow-hidden bg-muted/40 border-b border-border flex items-center justify-center cursor-pointer transition-all hover:bg-muted/60"
            style={{ backgroundImage: orgBanner ? `url(${orgBanner})` : 'none' }}
            onClick={() => bannerInputRef.current?.click()}
          >
            {!orgBanner && (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <UploadCloud className="w-8 h-8" />
                <span className="text-sm font-medium">{t.clickToUploadBanner}</span>
              </div>
            )}
            {orgBanner && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-all duration-200">
                <Camera className="w-6 h-6 text-white" />
                <span className="text-sm font-medium text-white">{t.changeBanner}</span>
              </div>
            )}
          </div>

          <div className="px-6 pb-6 pt-12 relative flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div 
              onClick={() => logoInputRef.current?.click()}
              className="w-24 h-24 rounded-2xl border-4 border-card bg-card absolute -top-12 left-6 overflow-hidden group/logo cursor-pointer shadow-md transition-all duration-300 hover:border-border flex items-center justify-center"
            >
              {orgLogo ? (
                <img src={orgLogo} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground flex-col gap-1">
                  <Camera className="w-6 h-6" />
                  <span className="text-[10px] font-medium">{t.logoLabel}</span>
                </div>
              )}
              {orgLogo && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/logo:opacity-100 flex items-center justify-center transition-opacity duration-200">
                  <Camera className="w-5 h-5 text-white" />
                </div>
              )}
            </div>

            <div className="ml-0 md:ml-28">
              <h2 className="text-xl font-bold tracking-tight text-foreground">{orgName || t.yourOrg}</h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-xl truncate">{orgDescription || t.noDescription}</p>
            </div>
            
            <div className="flex gap-2 text-xs">
              <button 
                type="button" 
                onClick={() => {
                  const url = prompt(t.enterLogoUrl, orgLogo)
                  if (url !== null) setOrgLogo(url)
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border text-foreground hover:bg-muted/50 transition-all cursor-pointer font-medium"
              >
                <Link2 className="w-3.5 h-3.5" /> {t.logoUrlBtn}
              </button>
              <button 
                type="button" 
                onClick={() => {
                  const url = prompt(t.enterBannerUrl, orgBanner)
                  if (url !== null) setOrgBanner(url)
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border text-foreground hover:bg-muted/50 transition-all cursor-pointer font-medium"
              >
                <Link2 className="w-3.5 h-3.5" /> {t.bannerUrlBtn}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-border">
          {[
            { id: 'profile', label: t.tabIdentity, icon: Building2 },
            { id: 'location', label: t.tabLocation, icon: MapPin },
            { id: 'admin', label: t.tabAdmin, icon: User },
            { id: 'settings', label: t.tabSettings, icon: Key },
          ].map((tab) => {
            const Icon = tab.icon
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold transition-all cursor-pointer border-b-2 ${
                  active 
                    ? 'border-brand text-brand font-bold' 
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab Contents */}
        <div className="bg-card text-card-foreground rounded-2xl border border-border p-6 shadow-sm">
          
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="orgName" className="block text-sm font-medium text-foreground mb-1.5">{t.orgName}</label>
                  <input
                    id="orgName" type="text" required value={orgName} onChange={(e) => setOrgName(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground dark:bg-muted/20 focus:outline-none focus:ring-2 focus:ring-brand transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="orgDesc" className="block text-sm font-medium text-foreground mb-1.5">{t.description}</label>
                  <textarea
                    id="orgDesc" rows={4} value={orgDescription} onChange={(e) => setOrgDescription(e.target.value)}
                    placeholder={t.descPlaceholder}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground dark:bg-muted/20 focus:outline-none focus:ring-2 focus:ring-brand transition-all resize-none"
                  />
                </div>

                <div>
                  <label htmlFor="orgIndustry" className="block text-sm font-medium text-foreground mb-1.5">{t.industry}</label>
                  <input
                    id="orgIndustry" type="text" value={orgIndustry} onChange={(e) => setOrgIndustry(e.target.value)}
                    placeholder={t.industryPlaceholder}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground dark:bg-muted/20 focus:outline-none focus:ring-2 focus:ring-brand transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="orgSize" className="block text-sm font-medium text-foreground mb-1.5">{t.orgSize}</label>
                  <select
                    id="orgSize" value={orgSize} onChange={(e) => setOrgSize(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground dark:bg-muted/20 focus:outline-none focus:ring-2 focus:ring-brand transition-all appearance-none"
                  >
                    <option value="">{t.selectSize}</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="501+">501+ employees</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="orgFounded" className="block text-sm font-medium text-foreground mb-1.5">{t.foundedYear}</label>
                  <input
                    id="orgFounded" type="number" min="1800" max={new Date().getFullYear()} value={orgFounded} onChange={(e) => setOrgFounded(e.target.value)}
                    placeholder="e.g. 2018"
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground dark:bg-muted/20 focus:outline-none focus:ring-2 focus:ring-brand transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'location' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="orgEmail" className="block text-sm font-medium text-foreground mb-1.5">{t.contactEmail}</label>
                  <input
                    id="orgEmail" type="email" value={orgEmail} onChange={(e) => setOrgEmail(e.target.value)}
                    placeholder="info@org.com"
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground dark:bg-muted/20 focus:outline-none focus:ring-2 focus:ring-brand transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="orgPhone" className="block text-sm font-medium text-foreground mb-1.5">{t.contactPhone}</label>
                  <input
                    id="orgPhone" type="tel" value={orgPhone} onChange={(e) => setOrgPhone(e.target.value)}
                    placeholder="+213..."
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground dark:bg-muted/20 focus:outline-none focus:ring-2 focus:ring-brand transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="orgWebsite" className="block text-sm font-medium text-foreground mb-1.5">{t.websiteUrl}</label>
                  <input
                    id="orgWebsite" type="url" value={orgWebsite} onChange={(e) => setOrgWebsite(e.target.value)}
                    placeholder="https://your-org.com"
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground dark:bg-muted/20 focus:outline-none focus:ring-2 focus:ring-brand transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="orgWilaya" className="block text-sm font-medium text-foreground mb-1.5">{t.wilaya}</label>
                  <select
                    id="orgWilaya"
                    required
                    value={orgWilaya}
                    onChange={(e) => {
                      const selWilayaName = e.target.value
                      setOrgWilaya(selWilayaName)
                      
                      // Auto-center coordinates based on selected wilaya
                      const matched = WILAYAS.find(w => w.french === selWilayaName || w.arabic === selWilayaName)
                      if (matched) {
                        setOrgLat(matched.latitude)
                        setOrgLng(matched.longitude)
                      }
                    }}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground dark:bg-muted/20 focus:outline-none focus:ring-2 focus:ring-brand transition-all appearance-none"
                  >
                    <option value="">{t.selectWilaya}</option>
                    {WILAYAS.map((w) => (
                      <option key={w.id} value={w.french}>
                        {w.id} - {w.french} ({w.arabic})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="orgDistrict" className="block text-sm font-medium text-foreground mb-1.5">{t.district}</label>
                  <input
                    id="orgDistrict" type="text" required value={orgDistrict} onChange={(e) => setOrgDistrict(e.target.value)}
                    placeholder="e.g. Dar El Beïda"
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground dark:bg-muted/20 focus:outline-none focus:ring-2 focus:ring-brand transition-all"
                  />
                </div>

                {/* Map Picker Search bar */}
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-medium text-foreground">{t.coordPicker}</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={t.searchPlaceholder}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleLocationSearch()
                        }
                      }}
                      className="flex-1 bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground dark:bg-muted/20 focus:outline-none focus:ring-2 focus:ring-brand transition-all"
                    />
                    <button
                      type="button"
                      onClick={handleLocationSearch}
                      disabled={searchingLocation}
                      className="px-4 py-2.5 rounded-xl bg-brand hover:bg-brand/90 text-brand-foreground font-semibold text-sm transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50 shrink-0 shadow-sm"
                    >
                      {searchingLocation ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                      {t.findBtn}
                    </button>
                  </div>
                  {searchError && <p className="text-xs text-danger font-medium">{searchError}</p>}
                </div>

                {/* Leaflet Map Frame */}
                <div className="md:col-span-2">
                  <div className="rounded-2xl border border-border overflow-hidden shadow-sm">
                    <MapPicker
                      lat={orgLat}
                      lng={orgLng}
                      onChange={(lat, lng) => {
                        setOrgLat(lat)
                        setOrgLng(lng)
                      }}
                    />
                  </div>
                  <div className="flex gap-4 mt-2.5 text-xs text-muted-foreground font-mono">
                    <span>{t.latitude}: {orgLat.toFixed(6)}</span>
                    <span>{t.longitude}: {orgLng.toFixed(6)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'admin' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h3 className="text-base font-bold text-foreground mb-4 border-b border-border pb-2">{t.adminProfile}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-1.5">{t.firstName}</label>
                    <input
                      id="firstName" type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground dark:bg-muted/20 focus:outline-none focus:ring-2 focus:ring-brand transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-1.5">{t.lastName}</label>
                    <input
                      id="lastName" type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground dark:bg-muted/20 focus:outline-none focus:ring-2 focus:ring-brand transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1.5">{t.adminPhone}</label>
                    <input
                      id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground dark:bg-muted/20 focus:outline-none focus:ring-2 focus:ring-brand transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">{t.loginEmail}</label>
                    <input
                      type="email" disabled value={email}
                      className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-sm text-muted-foreground cursor-not-allowed opacity-80"
                    />
                  </div>

                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-foreground mb-4 border-b border-border pb-2">{t.socialMedia}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="socialLinkedin" className="block text-sm font-medium text-foreground mb-1.5">LinkedIn</label>
                    <input
                      id="socialLinkedin" type="url" value={socialLinkedin} onChange={(e) => setSocialLinkedin(e.target.value)}
                      placeholder="https://linkedin.com/..."
                      className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground dark:bg-muted/20 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="socialTwitter" className="block text-sm font-medium text-foreground mb-1.5">Twitter (X)</label>
                    <input
                      id="socialTwitter" type="url" value={socialTwitter} onChange={(e) => setSocialTwitter(e.target.value)}
                      placeholder="https://twitter.com/..."
                      className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground dark:bg-muted/20 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="socialFacebook" className="block text-sm font-medium text-foreground mb-1.5">Facebook</label>
                    <input
                      id="socialFacebook" type="url" value={socialFacebook} onChange={(e) => setSocialFacebook(e.target.value)}
                      placeholder="https://facebook.com/..."
                      className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground dark:bg-muted/20 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border mt-6">
                <h3 className="text-base font-bold text-foreground mb-4 border-b border-border pb-2">{t.securityPassword}</h3>
                
                {passwordError && (
                  <div className="mb-4 bg-danger/10 border border-danger/20 rounded-xl p-4 text-sm text-danger font-medium">
                    {passwordError}
                  </div>
                )}
                
                {passwordSuccess && (
                  <div className="mb-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                    {t.passwordUpdated}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-foreground mb-1.5">{t.currentPassword}</label>
                    <div className="relative">
                      <input
                        id="currentPassword" type={showCurrentPassword ? 'text' : 'password'} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-background border border-border rounded-xl pl-4 pr-10 py-2.5 text-sm text-foreground dark:bg-muted/20 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-foreground mb-1.5">{t.newPassword}</label>
                    <div className="relative">
                      <input
                        id="newPassword" type={showNewPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-background border border-border rounded-xl pl-4 pr-10 py-2.5 text-sm text-foreground dark:bg-muted/20 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-foreground mb-1.5">{t.confirmNewPassword}</label>
                    <div className="relative">
                      <input
                        id="confirmNewPassword" type={showConfirmPassword ? 'text' : 'password'} value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-background border border-border rounded-xl pl-4 pr-10 py-2.5 text-sm text-foreground dark:bg-muted/20 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handlePasswordChange}
                    disabled={updatingPassword}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand text-brand-foreground text-sm font-semibold hover:bg-brand/90 transition-all cursor-pointer disabled:opacity-50 shadow-sm"
                  >
                    {updatingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {updatingPassword ? t.updating : t.updatePasswordBtn}
                  </button>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              <div>
                <h3 className="text-base font-bold text-foreground mb-4 border-b border-border pb-2">{t.platformCustomization}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="orgLanguage" className="block text-sm font-medium text-foreground mb-1.5">{t.preferredLanguage}</label>
                    <select
                      id="orgLanguage"
                      value={language}
                      onChange={(e) => setGlobalLanguage(e.target.value as 'en' | 'ar')}
                      className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground dark:bg-muted/20 focus:outline-none focus:ring-2 focus:ring-brand transition-all appearance-none"
                    >
                      <option value="en">English (US)</option>
                      <option value="ar">Arabic (العربية)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Registration & Invite Codes Generator */}
              <div className="pt-4 border-t border-border space-y-6">
                <div>
                  <h3 className="text-base font-bold text-foreground mb-1 font-sora">{t.inviteSystem}</h3>
                  <p className="text-xs text-muted-foreground">{t.inviteSystemDesc}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  
                  {/* Generate form */}
                  <div className="lg:col-span-1 bg-muted/30 rounded-2xl border border-border p-5 space-y-4">
                    <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">{t.generateCode}</h4>
                    
                    <div className="space-y-3">
                      <div>
                        <label htmlFor="inviteRole" className="block text-xs font-semibold text-foreground mb-1">{t.targetRole}</label>
                        <select
                          id="inviteRole"
                          value={selectedRole}
                          onChange={(e) => setSelectedRole(e.target.value)}
                          className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground dark:bg-muted/20 focus:outline-none focus:ring-2 focus:ring-brand appearance-none"
                        >
                          {roles.map(r => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="inviteSite" className="block text-xs font-semibold text-foreground mb-1">{t.targetSite}</label>
                        <select
                          id="inviteSite"
                          value={selectedSite}
                          onChange={(e) => setSelectedSite(e.target.value)}
                          className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground dark:bg-muted/20 focus:outline-none focus:ring-2 focus:ring-brand appearance-none"
                        >
                          <option value="">{t.allSites}</option>
                          {sites.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="inviteMaxUses" className="block text-xs font-semibold text-foreground mb-1">{t.maxUses}</label>
                        <input
                          id="inviteMaxUses"
                          type="number"
                          min="1"
                          max="1000"
                          value={maxUses}
                          onChange={(e) => setMaxUses(parseInt(e.target.value) || 10)}
                          className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground dark:bg-muted/20 focus:outline-none focus:ring-2 focus:ring-brand"
                        />
                      </div>

                      <div>
                        <label htmlFor="inviteExpiry" className="block text-xs font-semibold text-foreground mb-1">{t.expiryDate}</label>
                        <input
                          id="inviteExpiry"
                          type="date"
                          value={expiryDate}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) => setExpiryDate(e.target.value)}
                          className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground dark:bg-muted/20 focus:outline-none focus:ring-2 focus:ring-brand"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleGenerateInvite}
                        disabled={generatingCode}
                        className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-brand text-brand-foreground text-xs font-semibold hover:bg-brand/90 transition-all shadow cursor-pointer disabled:opacity-50"
                      >
                        {generatingCode ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                        {t.generateBtn}
                      </button>
                    </div>
                  </div>

                  {/* Codes List */}
                  <div className="lg:col-span-2 space-y-3">
                    <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">{t.activeCodes}</h4>
                    
                    {inviteCodes.length === 0 ? (
                      <div className="text-center py-10 bg-muted/20 border border-dashed border-border rounded-2xl text-muted-foreground">
                        <Key className="w-6 h-6 mx-auto mb-1.5 opacity-50" />
                        <p className="text-xs">{t.noCodesYet}</p>
                      </div>
                    ) : (
                      <div className="bg-muted/20 border border-dashed border-border rounded-2xl p-5 space-y-3 max-h-[480px] overflow-y-auto">
                        {inviteCodes.map((code) => {
                          const isExpired = code.expires_at && new Date(code.expires_at) < new Date()
                          const isMaxed = code.used_count >= code.max_uses

                          return (
                            <div key={code.id} className="flex items-center justify-between p-3.5 bg-card border border-border rounded-xl shadow-sm animate-in fade-in duration-150">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-bold text-xs text-foreground bg-muted px-2 py-0.5 rounded border border-border flex items-center gap-1.5">
                                    {code.code}
                                    <button
                                      type="button"
                                      onClick={() => copyToClipboard(code.code, code.id)}
                                      className="text-muted-foreground hover:text-foreground transition-colors p-0.5"
                                      title={t.copyCode}
                                    >
                                      {copiedCodeId === code.id ? (
                                        <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                      ) : (
                                        <Copy className="w-3 h-3" />
                                      )}
                                    </button>
                                  </span>
                                  <span className="text-[10px] font-semibold text-brand bg-brand/10 px-2 py-0.5 rounded border border-brand/20">
                                    {roles.find(r => r.id === code.role_id)?.name || 'User'}
                                  </span>
                                </div>
                                <div className="text-[10px] text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1">
                                  <span>{t.dept}: <strong className="text-foreground">{depts.find(d => d.id === code.department_id)?.name || t.all}</strong></span>
                                  <span>•</span>
                                  <span>{t.site}: <strong className="text-foreground">{sites.find(s => s.id === code.site_id)?.name || t.all}</strong></span>
                                  <span>•</span>
                                  <span>{t.uses}: <strong className={isMaxed ? 'text-danger font-bold' : 'text-foreground'}>{code.used_count}/{code.max_uses}</strong></span>
                                  {code.expires_at && (
                                    <>
                                      <span>•</span>
                                      <span className={isExpired ? 'text-danger font-semibold' : ''}>
                                        {t.expires}: {new Date(code.expires_at).toLocaleDateString()}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                              
                              <button
                                type="button"
                                onClick={() => handleDeleteInvite(code.id)}
                                className="p-2 rounded-xl text-muted-foreground hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer border border-transparent hover:border-danger/20 shrink-0 ml-4"
                                title={t.revokeCode}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>

                </div>
              </div>

            </div>
          )}
        </div>
      </form>
    </div>
  )
}
