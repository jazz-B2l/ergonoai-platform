// ─── Types ────────────────────────────────────────────────────────────────────

export type Role = 'hr' | 'employee'

export type HazardCategory =
  | 'Physical'
  | 'Chemical'
  | 'Mechanical'
  | 'Biological'
  | 'Fire'
  | 'Negative/Passive'

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'

export interface Department {
  id: string
  name: string
  site: string
  headcount: number
  responseRate: number
  anonymizationThreshold: number
  responseThreshold: number
  cadence: 'monthly' | 'quarterly' | 'biannual'
  lastAssessment: string
  overallScore: number
  trend: number // positive = improved
}

export interface HazardItem {
  id: string
  category: HazardCategory
  item: string
  status: 'compliant' | 'non-compliant' | 'needs-review' | 'not-applicable'
  notes: string
  lastChecked: string
  riskLevel: RiskLevel
}

export interface HazardObservation {
  id: string
  title: string
  description: string
  category: HazardCategory
  location: string
  reportedBy: string
  anonymous: boolean
  date: string
  status: 'open' | 'in-progress' | 'resolved'
  riskLevel: RiskLevel
}

export interface AIRecommendation {
  id: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  department: string
  category: string
  affectedEmployees: number
  action: string
}

export interface AssessmentQuestion {
  id: string
  category: 'musculoskeletal' | 'environment'
  question: string
  bodyRegion?: string
  scale: [number, number]
  lowLabel: string
  highLabel: string
}

export interface EmployeeAssessmentResult {
  questionId: string
  score: number
}

export interface WellbeingTrendPoint {
  month: string
  musculoskeletal: number
  environment: number
  overall: number
}

export interface DepartmentScore {
  category: string
  score: number
  benchmark: number
}

// ─── Departments ──────────────────────────────────────────────────────────────

export const departments: Department[] = [
  {
    id: 'd1',
    name: 'Engineering',
    site: 'Floor 3 — HQ',
    headcount: 42,
    responseRate: 78,
    anonymizationThreshold: 5,
    responseThreshold: 60,
    cadence: 'quarterly',
    lastAssessment: '2026-04-10',
    overallScore: 6.8,
    trend: +0.4,
  },
  {
    id: 'd2',
    name: 'Operations',
    site: 'Warehouse A',
    headcount: 87,
    responseRate: 65,
    anonymizationThreshold: 5,
    responseThreshold: 60,
    cadence: 'quarterly',
    lastAssessment: '2026-04-12',
    overallScore: 5.1,
    trend: -0.3,
  },
  {
    id: 'd3',
    name: 'Finance & Admin',
    site: 'Floor 2 — HQ',
    headcount: 18,
    responseRate: 92,
    anonymizationThreshold: 5,
    responseThreshold: 60,
    cadence: 'quarterly',
    lastAssessment: '2026-04-08',
    overallScore: 7.4,
    trend: +0.9,
  },
  {
    id: 'd4',
    name: 'Production Line',
    site: 'Factory Floor B',
    headcount: 120,
    responseRate: 58,
    anonymizationThreshold: 10,
    responseThreshold: 60,
    cadence: 'monthly',
    lastAssessment: '2026-04-15',
    overallScore: 4.3,
    trend: -0.1,
  },
  {
    id: 'd5',
    name: 'Customer Support',
    site: 'Floor 1 — HQ',
    headcount: 31,
    responseRate: 84,
    anonymizationThreshold: 5,
    responseThreshold: 60,
    cadence: 'quarterly',
    lastAssessment: '2026-04-11',
    overallScore: 7.1,
    trend: +0.6,
  },
]

// ─── Hazard Checklist ─────────────────────────────────────────────────────────

export const hazardChecklist: HazardItem[] = [
  // Physical
  {
    id: 'h1',
    category: 'Physical',
    item: 'Noise levels measured and below regulatory limit',
    status: 'compliant',
    notes: 'Last measurement: 72 dB(A)',
    lastChecked: '2026-03-20',
    riskLevel: 'low',
  },
  {
    id: 'h2',
    category: 'Physical',
    item: 'Adequate lighting (≥ 300 lux for office, ≥ 200 lux for warehouse)',
    status: 'needs-review',
    notes: 'Warehouse A spot readings at 185 lux in two aisles',
    lastChecked: '2026-03-20',
    riskLevel: 'medium',
  },
  {
    id: 'h3',
    category: 'Physical',
    item: 'Thermal comfort controls operational (HVAC / ventilation)',
    status: 'non-compliant',
    notes: 'Factory Floor B cooling unit offline since March 28',
    lastChecked: '2026-04-01',
    riskLevel: 'high',
  },
  {
    id: 'h4',
    category: 'Physical',
    item: 'Anti-vibration measures in place for high-vibration equipment',
    status: 'compliant',
    notes: '',
    lastChecked: '2026-03-15',
    riskLevel: 'low',
  },
  // Chemical
  {
    id: 'h5',
    category: 'Chemical',
    item: 'All chemical containers labeled (GHS/SDS compliant)',
    status: 'non-compliant',
    notes: '3 unlabeled containers found in storage room C',
    lastChecked: '2026-04-05',
    riskLevel: 'critical',
  },
  {
    id: 'h6',
    category: 'Chemical',
    item: 'SDS documents accessible at point of use',
    status: 'needs-review',
    notes: 'Binder present but some sheets outdated',
    lastChecked: '2026-04-05',
    riskLevel: 'medium',
  },
  {
    id: 'h7',
    category: 'Chemical',
    item: 'Adequate ventilation in chemical storage areas',
    status: 'compliant',
    notes: '',
    lastChecked: '2026-03-20',
    riskLevel: 'low',
  },
  // Mechanical
  {
    id: 'h8',
    category: 'Mechanical',
    item: 'Machine guards in place and functional',
    status: 'non-compliant',
    notes: 'Press machine #4 guard missing — flagged by employee',
    lastChecked: '2026-04-10',
    riskLevel: 'critical',
  },
  {
    id: 'h9',
    category: 'Mechanical',
    item: 'Maintenance schedule current for all heavy machinery',
    status: 'compliant',
    notes: 'Last PM: April 2026',
    lastChecked: '2026-04-02',
    riskLevel: 'low',
  },
  {
    id: 'h10',
    category: 'Mechanical',
    item: 'PPE available and in good condition',
    status: 'compliant',
    notes: '',
    lastChecked: '2026-04-02',
    riskLevel: 'low',
  },
  // Biological
  {
    id: 'h11',
    category: 'Biological',
    item: 'Hygiene facilities (handwashing stations) adequate and stocked',
    status: 'compliant',
    notes: '',
    lastChecked: '2026-04-10',
    riskLevel: 'low',
  },
  {
    id: 'h12',
    category: 'Biological',
    item: 'Waste disposal protocols followed (especially food / organic)',
    status: 'compliant',
    notes: '',
    lastChecked: '2026-04-10',
    riskLevel: 'low',
  },
  // Fire
  {
    id: 'h13',
    category: 'Fire',
    item: 'Fire extinguishers present, correctly typed, and in-date',
    status: 'needs-review',
    notes: '2 extinguishers expired in Warehouse A',
    lastChecked: '2026-04-08',
    riskLevel: 'high',
  },
  {
    id: 'h14',
    category: 'Fire',
    item: 'Evacuation routes clear and signposted',
    status: 'non-compliant',
    notes: 'Exit B blocked by stored pallets',
    lastChecked: '2026-04-08',
    riskLevel: 'critical',
  },
  {
    id: 'h15',
    category: 'Fire',
    item: 'Flammable materials stored in designated fire-safe cabinets',
    status: 'compliant',
    notes: '',
    lastChecked: '2026-03-20',
    riskLevel: 'low',
  },
  // Negative/Passive
  {
    id: 'h16',
    category: 'Negative/Passive',
    item: 'First-aid kits stocked and accessible',
    status: 'compliant',
    notes: 'Checked by nurse April 6',
    lastChecked: '2026-04-06',
    riskLevel: 'low',
  },
  {
    id: 'h17',
    category: 'Negative/Passive',
    item: 'Rescue / emergency equipment present and accessible',
    status: 'needs-review',
    notes: 'AED unit battery indicator light amber',
    lastChecked: '2026-04-06',
    riskLevel: 'medium',
  },
  {
    id: 'h18',
    category: 'Negative/Passive',
    item: 'Housekeeping standards maintained (aisles, spill response)',
    status: 'non-compliant',
    notes: 'Ongoing spill near Pump Station 2',
    lastChecked: '2026-04-14',
    riskLevel: 'high',
  },
]

// ─── Hazard Observations ──────────────────────────────────────────────────────

export const hazardObservations: HazardObservation[] = [
  {
    id: 'o1',
    title: 'Missing machine guard on Press #4',
    description:
      'The guard panel on Press #4 on the production floor has been removed and not replaced. Workers operating the press are exposed to moving parts.',
    category: 'Mechanical',
    location: 'Factory Floor B — Station 4',
    reportedBy: 'Ahmed K.',
    anonymous: false,
    date: '2026-04-09',
    status: 'in-progress',
    riskLevel: 'critical',
  },
  {
    id: 'o2',
    title: 'Blocked fire exit (Exit B)',
    description:
      'Stacked pallets are blocking Exit B in Warehouse A, making the door impossible to open in an emergency.',
    category: 'Fire',
    location: 'Warehouse A — East Wing',
    reportedBy: 'Anonymous',
    anonymous: true,
    date: '2026-04-07',
    status: 'open',
    riskLevel: 'critical',
  },
  {
    id: 'o3',
    title: 'Chemical spill near Pump Station 2',
    description:
      'A small but persistent spill of hydraulic fluid near Pump Station 2. No signage. Floor is slippery.',
    category: 'Chemical',
    location: 'Pump Station 2',
    reportedBy: 'Sara M.',
    anonymous: false,
    date: '2026-04-13',
    status: 'open',
    riskLevel: 'high',
  },
  {
    id: 'o4',
    title: 'Insufficient lighting in Warehouse A aisle 3',
    description:
      'Two overhead lights in aisle 3 have been out for 2 weeks. Difficult to read labels and maneuver forklifts.',
    category: 'Physical',
    location: 'Warehouse A — Aisle 3',
    reportedBy: 'Khalid R.',
    anonymous: false,
    date: '2026-04-05',
    status: 'resolved',
    riskLevel: 'medium',
  },
]

// ─── AI Recommendations ───────────────────────────────────────────────────────

export const aiRecommendations: AIRecommendation[] = [
  {
    id: 'r1',
    title: 'Restore cooling in Factory Floor B urgently',
    description:
      'Self-report data from Production Line employees shows elevated heat-stress symptoms (avg 7.2/10) — the highest in the company. Cross-referenced with the facility checklist: the HVAC cooling unit on Factory Floor B has been offline since March 28.',
    priority: 'high',
    department: 'Production Line',
    category: 'Physical / Heat Stress',
    affectedEmployees: 120,
    action: 'Repair or replace HVAC unit within 72 hours. Consider temporary evaporative cooling.',
  },
  {
    id: 'r2',
    title: 'Address missing machine guard on Press #4',
    description:
      'A critical mechanical hazard has been reported and confirmed. Machine guarding is required by OSH regulations. Continued operation without the guard creates immediate injury risk.',
    priority: 'high',
    department: 'Production Line',
    category: 'Mechanical',
    affectedEmployees: 15,
    action: 'Halt operation of Press #4 until guard is reinstalled. Contact maintenance immediately.',
  },
  {
    id: 'r3',
    title: 'Re-label unlabeled chemical containers in Storage Room C',
    description:
      'GHS/SDS labeling compliance gaps create legal exposure and safety risk. 3 containers are currently unlabeled.',
    priority: 'high',
    department: 'Operations',
    category: 'Chemical / Compliance',
    affectedEmployees: 87,
    action: 'Identify contents, create GHS-compliant labels, and update the SDS binder. Engage safety professional.',
  },
  {
    id: 'r4',
    title: 'Ergonomic workstation adjustments for Engineering',
    description:
      'Self-reports indicate elevated neck discomfort (avg 6.4/10) and screen-position complaints (avg 6.8/10) across Engineering. These are consistent with monitors positioned below eye level.',
    priority: 'medium',
    department: 'Engineering',
    category: 'Musculoskeletal / Ergonomics',
    affectedEmployees: 42,
    action: 'Provide monitor risers or adjustable arms. Run a workstation ergonomics workshop.',
  },
  {
    id: 'r5',
    title: 'Replace expired fire extinguishers in Warehouse A',
    description:
      '2 fire extinguishers in Warehouse A have passed their service date. This creates both a safety gap and a regulatory compliance gap.',
    priority: 'medium',
    department: 'Operations',
    category: 'Fire Safety',
    affectedEmployees: 87,
    action: 'Service or replace both extinguishers this week. Book annual inspection for all units.',
  },
]

// ─── Employee Personal Data ───────────────────────────────────────────────────

export interface PersonalData {
  fullName: string
  workPosition: string
  gender: 'male' | 'female' | 'other' | ''
  dateOfBirth: string
  placeOfBirth: string
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed' | ''
  height: string
  weight: string
  yearsWorking: string
  workingHoursPerDay: string
  hasPartTimeJob: boolean | null
}

// ─── NMQ Body Regions ─────────────────────────────────────────────────────────

export const NMQ_BODY_REGIONS = [
  'Neck',
  'Shoulders',
  'Upper Back',
  'Elbows',
  'Wrists / Hands',
  'Lower Back',
  'Hips / Thighs',
  'Knees',
  'Ankles / Feet',
] as const

export type NMQBodyRegion = (typeof NMQ_BODY_REGIONS)[number]

// ─── Questionnaire Question Types ─────────────────────────────────────────────

export type AnswerType = 'yesno' | 'scale' | 'duration' | 'radio' | 'text'

export interface QuestionOption {
  value: string
  label: string
}

export interface Question {
  id: string
  section: 'NMQ_summary' | 'NMQ_detail' | 'ISO7730'
  bodyRegion?: NMQBodyRegion
  text: string
  answerType: AnswerType
  options?: QuestionOption[]
  scaleMin?: number
  scaleMax?: number
  scaleLowLabel?: string
  scaleHighLabel?: string
}

// ─── NMQ Questions (per body region) ─────────────────────────────────────────

function nmqSummaryQuestions(region: NMQBodyRegion): Question[] {
  return [
    {
      id: `nmq_sum_1_${region}`,
      section: 'NMQ_summary',
      bodyRegion: region,
      text: `During the last 12 months, have you had aches, pain, or discomfort in your ${region.toLowerCase()}?`,
      answerType: 'yesno',
    },
    {
      id: `nmq_sum_2_${region}`,
      section: 'NMQ_summary',
      bodyRegion: region,
      text: `During the last 12 months, did this problem in your ${region.toLowerCase()} prevent you from doing your normal work?`,
      answerType: 'yesno',
    },
    {
      id: `nmq_sum_3_${region}`,
      section: 'NMQ_summary',
      bodyRegion: region,
      text: `Have you had a problem in your ${region.toLowerCase()} at any time during the last 7 days?`,
      answerType: 'yesno',
    },
  ]
}

function nmqDetailQuestions(region: NMQBodyRegion): Question[] {
  return [
    {
      id: `nmq_det_1_${region}`,
      section: 'NMQ_detail',
      bodyRegion: region,
      text: `Have you ever experienced aches, pain, or discomfort in your ${region.toLowerCase()}?`,
      answerType: 'yesno',
    },
    {
      id: `nmq_det_2_${region}`,
      section: 'NMQ_detail',
      bodyRegion: region,
      text: `Have you ever injured your ${region.toLowerCase()} in an accident?`,
      answerType: 'yesno',
    },
    {
      id: `nmq_det_3_${region}`,
      section: 'NMQ_detail',
      bodyRegion: region,
      text: `Have you ever had to change your job or work tasks because of problems in your ${region.toLowerCase()}?`,
      answerType: 'yesno',
    },
    {
      id: `nmq_det_4_${region}`,
      section: 'NMQ_detail',
      bodyRegion: region,
      text: `During the last 12 months, have you had problems in your ${region.toLowerCase()}?`,
      answerType: 'yesno',
    },
    {
      id: `nmq_det_5_${region}`,
      section: 'NMQ_detail',
      bodyRegion: region,
      text: `What was the total duration of your problems in your ${region.toLowerCase()} during the last 12 months?`,
      answerType: 'radio',
      options: [
        { value: '0_days', label: '0 days' },
        { value: '1_7_days', label: '1–7 days' },
        { value: '8_30_days', label: '8–30 days' },
        { value: 'more_30_days', label: 'More than 30 days (not daily)' },
        { value: 'daily', label: 'Every day' },
      ],
    },
    {
      id: `nmq_det_6a_${region}`,
      section: 'NMQ_detail',
      bodyRegion: region,
      text: `Because of problems in your ${region.toLowerCase()} during the last 12 months, were you forced to reduce your usual work or household activities?`,
      answerType: 'yesno',
    },
    {
      id: `nmq_det_6b_${region}`,
      section: 'NMQ_detail',
      bodyRegion: region,
      text: `Because of problems in your ${region.toLowerCase()} during the last 12 months, were you forced to reduce your leisure activities?`,
      answerType: 'yesno',
    },
    {
      id: `nmq_det_7_${region}`,
      section: 'NMQ_detail',
      bodyRegion: region,
      text: `During the last 12 months, for how long did problems in your ${region.toLowerCase()} prevent you from performing your usual activities (work or home)?`,
      answerType: 'radio',
      options: [
        { value: '0_days', label: '0 days' },
        { value: '1_7_days', label: '1–7 days' },
        { value: '8_30_days', label: '8–30 days' },
        { value: 'more_30_days', label: 'More than 30 days' },
      ],
    },
    {
      id: `nmq_det_8_${region}`,
      section: 'NMQ_detail',
      bodyRegion: region,
      text: `During the last 12 months, have you consulted a physician, physiotherapist, chiropractor, or other healthcare professional because of problems in your ${region.toLowerCase()}?`,
      answerType: 'yesno',
    },
    {
      id: `nmq_det_9_${region}`,
      section: 'NMQ_detail',
      bodyRegion: region,
      text: `Have you experienced a problem in your ${region.toLowerCase()} at any time during the last 7 days?`,
      answerType: 'yesno',
    },
  ]
}

// ─── ISO 7730 Questions ───────────────────────────────────────────────────────

export const iso7730Questions: Question[] = [
  // Overall Comfort
  { id: 'iso_1', section: 'ISO7730', text: 'How would you rate the overall thermal comfort of your workplace?', answerType: 'scale', scaleMin: 1, scaleMax: 5, scaleLowLabel: 'Very poor', scaleHighLabel: 'Excellent' },
  { id: 'iso_2', section: 'ISO7730', text: 'Do you usually feel thermally comfortable while working?', answerType: 'yesno' },
  { id: 'iso_3', section: 'ISO7730', text: 'How often do you feel too hot during your work?', answerType: 'radio', options: [{ value: 'never', label: 'Never' }, { value: 'rarely', label: 'Rarely' }, { value: 'sometimes', label: 'Sometimes' }, { value: 'often', label: 'Often' }, { value: 'always', label: 'Always' }] },
  { id: 'iso_4', section: 'ISO7730', text: 'How often do you feel too cold during your work?', answerType: 'radio', options: [{ value: 'never', label: 'Never' }, { value: 'rarely', label: 'Rarely' }, { value: 'sometimes', label: 'Sometimes' }, { value: 'often', label: 'Often' }, { value: 'always', label: 'Always' }] },
  { id: 'iso_5', section: 'ISO7730', text: 'Does the temperature remain comfortable throughout your work shift?', answerType: 'yesno' },
  { id: 'iso_6', section: 'ISO7730', text: 'Does the workplace temperature frequently change during the day?', answerType: 'yesno' },
  // Thermal Sensation (PMV)
  { id: 'iso_7', section: 'ISO7730', text: 'How do you currently feel? (Thermal Sensation)', answerType: 'radio', options: [{ value: '-3', label: 'Very Cold (-3)' }, { value: '-2', label: 'Cold (-2)' }, { value: '-1', label: 'Slightly Cool (-1)' }, { value: '0', label: 'Neutral (0)' }, { value: '1', label: 'Slightly Warm (+1)' }, { value: '2', label: 'Warm (+2)' }, { value: '3', label: 'Very Hot (+3)' }] },
  // Air Temperature
  { id: 'iso_8', section: 'ISO7730', text: 'Is the air temperature comfortable for your work?', answerType: 'yesno' },
  { id: 'iso_9', section: 'ISO7730', text: 'Is the workplace usually too hot?', answerType: 'yesno' },
  { id: 'iso_10', section: 'ISO7730', text: 'Is the workplace usually too cold?', answerType: 'yesno' },
  { id: 'iso_11', section: 'ISO7730', text: 'Are temperature changes distracting while working?', answerType: 'yesno' },
  // Air Movement
  { id: 'iso_12', section: 'ISO7730', text: 'Do you feel unwanted air drafts while working?', answerType: 'yesno' },
  { id: 'iso_13', section: 'ISO7730', text: 'Does air from fans or air conditioners make you uncomfortable?', answerType: 'yesno' },
  { id: 'iso_14', section: 'ISO7730', text: 'Do you feel cold because of moving air?', answerType: 'yesno' },
  { id: 'iso_15', section: 'ISO7730', text: 'Does airflow frequently hit your face or neck?', answerType: 'yesno' },
  { id: 'iso_16', section: 'ISO7730', text: 'Does airflow disturb your concentration?', answerType: 'yesno' },
  // Humidity
  { id: 'iso_17', section: 'ISO7730', text: 'Is the air too dry?', answerType: 'yesno' },
  { id: 'iso_18', section: 'ISO7730', text: 'Is the air too humid?', answerType: 'yesno' },
  { id: 'iso_19', section: 'ISO7730', text: 'Does the humidity make you uncomfortable?', answerType: 'yesno' },
  // Radiant Heat
  { id: 'iso_20', section: 'ISO7730', text: 'Do you feel excessive heat from windows?', answerType: 'yesno' },
  { id: 'iso_21', section: 'ISO7730', text: 'Do you feel excessive heat from machinery or equipment?', answerType: 'yesno' },
  { id: 'iso_22', section: 'ISO7730', text: 'Do cold windows or walls make you uncomfortable?', answerType: 'yesno' },
  { id: 'iso_23', section: 'ISO7730', text: 'Do hot ceilings or walls make you uncomfortable?', answerType: 'yesno' },
  // Vertical Temperature Difference
  { id: 'iso_24', section: 'ISO7730', text: 'Are your feet colder than your upper body?', answerType: 'yesno' },
  { id: 'iso_25', section: 'ISO7730', text: 'Is your head warmer than your feet?', answerType: 'yesno' },
  { id: 'iso_26', section: 'ISO7730', text: 'Do you notice large temperature differences between the floor and head level?', answerType: 'yesno' },
  // Floor Temperature
  { id: 'iso_27', section: 'ISO7730', text: 'Is the floor too cold?', answerType: 'yesno' },
  { id: 'iso_28', section: 'ISO7730', text: 'Is the floor too warm?', answerType: 'yesno' },
  { id: 'iso_29', section: 'ISO7730', text: 'Does the floor temperature make standing or walking uncomfortable?', answerType: 'yesno' },
  // Clothing
  { id: 'iso_30', section: 'ISO7730', text: 'Is your usual work clothing suitable for the workplace temperature?', answerType: 'yesno' },
  { id: 'iso_31', section: 'ISO7730', text: 'Do you need extra clothing because the workplace is too cold?', answerType: 'yesno' },
  { id: 'iso_32', section: 'ISO7730', text: 'Do you remove clothing because the workplace is too hot?', answerType: 'yesno' },
  // Work Activity
  { id: 'iso_33', section: 'ISO7730', text: 'Does your physical activity make you feel excessively hot?', answerType: 'yesno' },
  { id: 'iso_34', section: 'ISO7730', text: 'Does your work require frequent movement that affects your thermal comfort?', answerType: 'yesno' },
  { id: 'iso_35', section: 'ISO7730', text: 'Does the workplace temperature match the physical effort required for your job?', answerType: 'yesno' },
  // Productivity
  { id: 'iso_36', section: 'ISO7730', text: 'Does the thermal environment reduce your concentration?', answerType: 'yesno' },
  { id: 'iso_37', section: 'ISO7730', text: 'Does thermal discomfort reduce your productivity?', answerType: 'yesno' },
  { id: 'iso_38', section: 'ISO7730', text: 'Have you ever needed to stop working because of thermal discomfort?', answerType: 'yesno' },
  // Overall Satisfaction
  { id: 'iso_39', section: 'ISO7730', text: 'Overall, how satisfied are you with the thermal environment of your workplace?', answerType: 'scale', scaleMin: 1, scaleMax: 5, scaleLowLabel: 'Very dissatisfied', scaleHighLabel: 'Very satisfied' },
  { id: 'iso_40', section: 'ISO7730', text: 'What improvements would most improve your thermal comfort?', answerType: 'text' },
]

// ─── Full Question List ────────────────────────────────────────────────────────

export function buildFullQuestionList(): Question[] {
  const nmq: Question[] = []
  for (const region of NMQ_BODY_REGIONS) {
    nmq.push(...nmqSummaryQuestions(region))
    nmq.push(...nmqDetailQuestions(region))
  }
  return [...nmq, ...iso7730Questions]
}

// Groups iso7730 into pages of 4
export function buildISO7730Pages(): Question[][] {
  const pages: Question[][] = []
  for (let i = 0; i < iso7730Questions.length; i += 4) {
    pages.push(iso7730Questions.slice(i, i + 4))
  }
  return pages
}

// ─── Submitted Forms (mock history) ──────────────────────────────────────────

export interface ActiveAssessment {
  id: string
  title: string
  createdAt: string
}

export interface SubmittedForm {
  id: string
  assessmentId?: string
  submittedAt: string
  questionCount: number
  answeredCount: number
  sections: string[]
  answers: Record<string, string>
  notes: Record<string, string>
}

export interface StandaloneNote {
  id: string
  text: string
  department: string
  submittedAt: string
}

export const mockSubmittedForms: SubmittedForm[] = [
  {
    id: 'form_1',
    submittedAt: '2026-01-14T10:22:00',
    questionCount: 118,
    answeredCount: 118,
    sections: ['NMQ Summary', 'NMQ Detail', 'ISO 7730'],
    answers: {},
    notes: {},
  },
  {
    id: 'form_2',
    submittedAt: '2026-04-08T09:05:00',
    questionCount: 118,
    answeredCount: 118,
    sections: ['NMQ Summary', 'NMQ Detail', 'ISO 7730'],
    answers: {},
    notes: {},
  },
]

export const mockStandaloneNotes: StandaloneNote[] = [
  {
    id: 'note_1',
    text: 'The break room ventilation has been noisy for weeks now. It makes it hard to relax during breaks.',
    department: 'Engineering',
    submittedAt: '2026-03-22T14:30:00',
  },
]

// ─── Assessment Questions (legacy, kept for HR side) ─────────────────────────

export const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: 'q1',
    category: 'musculoskeletal',
    question: 'By the end of a typical work day, how much neck discomfort do you feel?',
    bodyRegion: 'neck',
    scale: [0, 10],
    lowLabel: 'No discomfort',
    highLabel: 'Severe discomfort',
  },
  {
    id: 'q2',
    category: 'musculoskeletal',
    question: 'How would you rate the support your chair gives your lower back?',
    bodyRegion: 'back',
    scale: [0, 10],
    lowLabel: 'Poor support',
    highLabel: 'Excellent support',
  },
  {
    id: 'q3',
    category: 'musculoskeletal',
    question: 'How often is your screen below eye level during the day?',
    bodyRegion: 'neck',
    scale: [0, 10],
    lowLabel: 'Never',
    highLabel: 'All the time',
  },
  {
    id: 'q4',
    category: 'musculoskeletal',
    question: 'How much wrist or shoulder tension do you notice during your tasks?',
    bodyRegion: 'shoulder',
    scale: [0, 10],
    lowLabel: 'No tension',
    highLabel: 'Constant tension',
  },
  {
    id: 'q5',
    category: 'environment',
    question: 'How disruptive is ambient noise in your workspace?',
    scale: [0, 10],
    lowLabel: 'Not disruptive',
    highLabel: 'Very disruptive',
  },
  {
    id: 'q6',
    category: 'environment',
    question: 'How comfortable is the temperature in your workspace?',
    scale: [0, 10],
    lowLabel: 'Very uncomfortable',
    highLabel: 'Very comfortable',
  },
  {
    id: 'q7',
    category: 'environment',
    question: 'How would you rate humidity and air quality in your workspace?',
    scale: [0, 10],
    lowLabel: 'Very poor',
    highLabel: 'Excellent',
  },
  {
    id: 'q8',
    category: 'environment',
    question: 'How much glare or eye strain do you experience from lighting?',
    scale: [0, 10],
    lowLabel: 'No eye strain',
    highLabel: 'Severe eye strain',
  },
  {
    id: 'q9',
    category: 'environment',
    question:
      'By the end of a shift, how noticeable are symptoms like fatigue, headache, or dizziness?',
    scale: [0, 10],
    lowLabel: 'Not noticeable',
    highLabel: 'Very noticeable',
  },
  {
    id: 'q10',
    category: 'musculoskeletal',
    question: 'How much hand or arm vibration do you experience from tools or machinery?',
    bodyRegion: 'wrist',
    scale: [0, 10],
    lowLabel: 'None',
    highLabel: 'Constant vibration',
  },
]

// ─── Employee history ──────────────────────────────────────────────────────────

export const employeeWellbeingHistory: WellbeingTrendPoint[] = [
  { month: 'Oct', musculoskeletal: 5.2, environment: 6.1, overall: 5.7 },
  { month: 'Nov', musculoskeletal: 5.5, environment: 6.4, overall: 5.9 },
  { month: 'Dec', musculoskeletal: 5.0, environment: 5.8, overall: 5.4 },
  { month: 'Jan', musculoskeletal: 5.8, environment: 6.6, overall: 6.2 },
  { month: 'Feb', musculoskeletal: 6.2, environment: 6.9, overall: 6.6 },
  { month: 'Mar', musculoskeletal: 6.5, environment: 7.1, overall: 6.8 },
  { month: 'Apr', musculoskeletal: 6.8, environment: 7.3, overall: 7.1 },
]

export const companyWellbeingTrend: WellbeingTrendPoint[] = [
  { month: 'Oct', musculoskeletal: 4.8, environment: 5.5, overall: 5.1 },
  { month: 'Nov', musculoskeletal: 4.9, environment: 5.7, overall: 5.3 },
  { month: 'Dec', musculoskeletal: 4.6, environment: 5.3, overall: 4.9 },
  { month: 'Jan', musculoskeletal: 5.1, environment: 5.9, overall: 5.5 },
  { month: 'Feb', musculoskeletal: 5.4, environment: 6.2, overall: 5.8 },
  { month: 'Mar', musculoskeletal: 5.6, environment: 6.5, overall: 6.0 },
  { month: 'Apr', musculoskeletal: 5.9, environment: 6.7, overall: 6.3 },
]

export const departmentScores: DepartmentScore[] = [
  { category: 'Neck', score: 6.4, benchmark: 7.0 },
  { category: 'Back', score: 5.8, benchmark: 7.0 },
  { category: 'Shoulders', score: 6.1, benchmark: 7.0 },
  { category: 'Wrists', score: 6.9, benchmark: 7.0 },
  { category: 'Noise', score: 5.2, benchmark: 7.0 },
  { category: 'Temperature', score: 4.3, benchmark: 7.0 },
  { category: 'Lighting', score: 6.7, benchmark: 7.0 },
  { category: 'Air Quality', score: 6.2, benchmark: 7.0 },
]
