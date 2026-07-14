'use client'

import { useState } from 'react'
import { Save, Building2, Lock, Bell } from 'lucide-react'

export function HRSettings() {
  const [minHeadcount, setMinHeadcount] = useState(5)
  const [minResponse, setMinResponse] = useState(60)
  const [cadence, setCadence] = useState('quarterly')
  const [pulseCheck, setPulseCheck] = useState(true)
  const [allowAnonymousObs, setAllowAnonymousObs] = useState(true)
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure company-wide defaults for anonymization, assessment cadence, and privacy
        </p>
      </div>

      {/* Company info */}
      <Section title="Company Profile" icon={Building2}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Company Name">
            <input
              defaultValue="Al-Nasser Industries"
              className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-brand/50"
            />
          </Field>
          <Field label="Country / Region">
            <select className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-brand/50">
              <option>Egypt</option>
              <option>Saudi Arabia</option>
              <option>UAE</option>
              <option>Jordan</option>
              <option>Morocco</option>
            </select>
          </Field>
          <Field label="Industry">
            <select className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-brand/50">
              <option>Manufacturing / Industrial</option>
              <option>Office / Services</option>
              <option>Healthcare</option>
              <option>Logistics / Warehouse</option>
              <option>Construction</option>
            </select>
          </Field>
          <Field label="OSH Committee Enabled">
            <div className="flex items-center gap-3 py-2">
              <Toggle value={true} />
              <span className="text-xs text-muted-foreground">Committee access granted to designated members</span>
            </div>
          </Field>
        </div>
      </Section>

      {/* Anonymization */}
      <Section title="Anonymization & Privacy" icon={Lock}>
        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
          These thresholds apply to the employee self-report module only. Aggregated scores are shown to HR and the OSH Committee only when both thresholds are met. Spaces below threshold are rolled up to the company aggregate.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label={`Minimum headcount threshold: ${minHeadcount} employees`}>
            <input
              type="range"
              min={3}
              max={20}
              value={minHeadcount}
              onChange={(e) => setMinHeadcount(Number(e.target.value))}
              className="w-full accent-brand"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>3</span><span>20</span>
            </div>
          </Field>
          <Field label={`Minimum response rate threshold: ${minResponse}%`}>
            <input
              type="range"
              min={40}
              max={90}
              step={5}
              value={minResponse}
              onChange={(e) => setMinResponse(Number(e.target.value))}
              className="w-full accent-brand"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>40%</span><span>90%</span>
            </div>
          </Field>
          <Field label="Allow anonymous hazard observations">
            <div className="flex items-center gap-3 py-2">
              <Toggle value={allowAnonymousObs} onChange={setAllowAnonymousObs} />
              <span className="text-xs text-muted-foreground">Employees may choose to submit observations without their name</span>
            </div>
          </Field>
        </div>
      </Section>

      {/* Assessment cadence */}
      <Section title="Assessment Cadence" icon={Bell}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Full assessment cadence">
            <div className="flex items-center gap-2 flex-wrap">
              {['monthly', 'quarterly', 'biannual'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setCadence(opt)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
                    cadence === opt
                      ? 'bg-brand text-brand-foreground'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Monthly pulse check (2–3 questions)">
            <div className="flex items-center gap-3 py-2">
              <Toggle value={pulseCheck} onChange={setPulseCheck} />
              <span className="text-xs text-muted-foreground">Short check between full assessment cycles</span>
            </div>
          </Field>
        </div>
      </Section>

      {/* Save */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand text-brand-foreground text-sm font-medium hover:opacity-90 transition-all"
        >
          <Save className="w-4 h-4" />
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
        {saved && <span className="text-xs text-success">Settings saved successfully</span>}
      </div>
    </div>
  )
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon: React.ElementType
  children: React.ReactNode
}) {
  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-7 h-7 rounded-lg bg-brand/10 flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-brand" />
        </div>
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-2">{label}</label>
      {children}
    </div>
  )
}

function Toggle({ value, onChange }: { value: boolean; onChange?: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange?.(!value)}
      className={`relative w-10 h-5 rounded-full transition-colors ${value ? 'bg-brand' : 'bg-muted-foreground/30'}`}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`}
      />
    </button>
  )
}
