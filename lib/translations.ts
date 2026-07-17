export type Language = 'en' | 'ar'

export const translations = {
  en: {
    common: {
      backToSite: 'Back to Site',
      getStarted: 'Get Started',
      startFreeTrial: 'Start Free Trial',
      talkToSales: 'Talk to Sales',
      watchDemo: 'Watch Demo',
      login: 'Login',
      logout: 'Log Out',
      features: 'Features',
      solutions: 'Solutions',
      pricing: 'Pricing',
      ai: 'AI',
      privacyByDesign: 'Privacy by design.',
      privacyNotice: 'Individual employee responses are never visible to HR, Safety Officers, or the OSH Committee. Only anonymized aggregates above the configured threshold are shared.'
    },
    navbar: {
      features: 'Features',
      solutions: 'Solutions',
      ai: 'AI',
      pricing: 'Pricing',
      login: 'Login',
      getStarted: 'Get Started'
    },
    hero: {
      titleLine1: 'Your workplace is speaking.',
      titleLine2: 'ErgonoAI helps you listen.',
      subtitle: 'Build healthier workplaces with intelligent ergonomic assessments, AI-powered risk analysis, and actionable recommendations.',
      companyHealth: 'Company Health',
      riskReduced: 'Risk reduced 21% ↓',
      isoCompliant: 'ISO 7730 Compliant',
      aiReady: 'AI Recommendation Ready'
    },
    standards: {
      title: 'Supporting Global Ergonomic Standards'
    },
    problem: {
      title: 'Most organizations discover ergonomic problems only after injuries occur.',
      desc: 'The old way of managing workplace ergonomics is broken, scattered, and purely reactive.',
      solutionTag: 'The Solution',
      meet: 'Meet ErgonoAI',
      items: [
        {
          title: 'Manual Assessments',
          desc: 'Paper-based forms and manual scoring that takes hours and introduces human error.'
        },
        {
          title: 'Scattered Spreadsheets',
          desc: 'Data trapped in isolated Excel files making it impossible to spot organization-wide trends.'
        },
        {
          title: 'No AI Insights',
          desc: 'Waiting for experts to manually interpret data instead of getting real-time actionable recommendations.'
        }
      ]
    },
    featuresSection: {
      items: [
        {
          title: 'AI Ergonomic Analysis',
          desc: 'Our AI evaluates posture, questionnaire responses, and environmental factors to pinpoint risks with high precision.'
        },
        {
          title: 'Assessment Builder',
          desc: 'Create ISO, NMQ, REBA and custom assessments dynamically. Deploy them to workstations instantly.'
        },
        {
          title: 'Corrective Actions',
          desc: 'Automatically generate improvement plans and track them through resolution directly on the platform.'
        },
        {
          title: 'Analytics',
          desc: 'Beautiful dashboards with historical trends showing the exact impact of your ergonomic interventions.'
        }
      ]
    },
    howItWorks: {
      title: 'How it works',
      steps: [
        { num: '1', title: 'Create Company', desc: 'Set up your organization, departments, and worksites.' },
        { num: '2', title: 'Invite Employees', desc: 'Onboard your team quickly with custom invite codes.' },
        { num: '3', title: 'Run Assessments', desc: 'Deploy targeted ergonomic assessments based on roles.' },
        { num: '4', title: 'AI Analysis', desc: 'Our engine instantly scores risk and identifies hazards.' },
        { num: '5', title: 'Improve Workplace', desc: 'Execute AI-recommended corrective actions.' }
      ]
    },
    aiSpotlight: {
      title: 'Meet your AI Ergonomist',
      desc: 'Ask questions, get instant insights, and automate risk detection.',
      copilotTitle: 'ErgonoAI Copilot',
      userQuery: 'Show departments with the highest ergonomic risk.',
      aiIntro: 'Here are the departments with the highest ergonomic risk scores based on recent assessments:',
      riskLabel: 'Risk 84%',
      issuesTitle: 'Production Line A',
      primaryIssue: 'Primary Issue',
      primaryIssueVal: 'Poor Lighting',
      secondaryIssue: 'Secondary Issue',
      secondaryIssueVal: 'Sustained Neck Flexion',
      impact: 'Impact',
      impactVal: 'High reports of neck pain',
      aiFooter: 'Recommended actions have been drafted and are awaiting your approval in the Corrective Actions dashboard.'
    },
    dashboardPreview: {
      title: 'Enterprise-grade Insights',
      desc: 'Monitor your entire organization from a single, powerful dashboard.'
    },
    statistics: {
      items: [
        { label: 'Average risk reduction' },
        { label: 'Assessments completed' },
        { label: 'AI confidence rate' },
        { label: 'Enterprise clients' }
      ]
    },
    pricing: {
      title: 'Simple, transparent pricing',
      desc: 'Choose the plan that best fits your company\'s needs.',
      mostPopular: 'Most Popular',
      period: '/mo',
      tiers: [
        {
          name: 'Free',
          price: '$0',
          desc: 'Perfect for exploring the platform.',
          features: ['Up to 10 employees', 'Standard assessments (RULA, REBA)', 'Basic dashboard analytics', 'Email support'],
          cta: 'Get Started'
        },
        {
          name: 'Professional',
          price: '$49',
          desc: 'Everything you need for growing teams.',
          features: ['Up to 100 employees', 'AI Ergonomic Analysis', 'Custom Assessment Builder', 'Corrective Actions tracking', 'Priority support'],
          cta: 'Start Free Trial'
        },
        {
          name: 'Enterprise',
          price: 'Custom',
          desc: 'Advanced security and scalability.',
          features: ['Unlimited employees', 'Multiple sites & departments', 'API access & SSO', 'Dedicated account manager', 'Custom AI training'],
          cta: 'Contact Sales'
        }
      ]
    },
    faq: {
      title: 'Frequently Asked Questions',
      items: [
        {
          q: 'How does the AI assessment work?',
          a: 'Our AI processes video feeds, images, and user-submitted questionnaires to calculate precise ergonomic risk scores based on established standards like ISO 7730 and REBA.'
        },
        {
          q: 'Is our employee data secure?',
          a: 'Yes. ErgonoAI is GDPR compliant, uses end-to-end encryption, and never uses your company\'s private health data to train external models.'
        },
        {
          q: 'Can we integrate with our existing HR tools?',
          a: 'Enterprise customers can use our robust API to sync employee profiles and organizational structures with Workday, BambooHR, and other major HRIS platforms.'
        },
        {
          q: 'Do you offer custom assessments?',
          a: 'Yes. The Assessment Builder allows you to create completely custom questionnaires and scoring logic tailored to your specific industry hazards.'
        }
      ]
    },
    footer: {
      ctaTitle: 'Ready to build a healthier workplace?',
      ctaSub: 'Join the forward-thinking organizations using AI to protect their most valuable asset—their people.',
      footerDesc: 'AI-Powered Workplace Ergonomics. Prevent injuries before they happen.',
      copyright: '© 2026 ErgonoAI, Inc. All rights reserved.',
      product: 'Product',
      resources: 'Resources',
      organization: 'Organization',
      links: {
        features: 'Features',
        integrations: 'Integrations',
        pricing: 'Pricing',
        changelog: 'Changelog',
        documentation: 'Documentation',
        blog: 'Blog',
        standards: 'Ergonomic Standards',
        caseStudies: 'Case Studies',
        about: 'About',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
        contact: 'Contact'
      }
    },
    login: {
      subtitle: 'Sign in to access your occupational health & ergonomics portal',
      destinationTitle: 'Select your destination to sign in',
      employeePortal: 'Employee Portal',
      employeePortalDesc: 'For Staff & Team Members. Access your private assessments, track score histories, and report ergonomic hazard observations.',
      orgPortal: 'Organization Portal',
      orgPortalDesc: 'For HR Managers & Admin. Manage department spaces, review safety compliance checklists, and view AI recommendation telemetry.',
      logIn: 'Log in',
      personalSpace: 'Personal Space',
      orgDashboard: 'Organization Dashboard',
      dontHaveAccount: "Don't have an account?"
    },
    loginEmployee: {
      portal: 'Employee Portal',
      signInTitle: 'Sign in as Employee',
      signInSubtitle: 'Access your private self-assessments and dashboard',
      emailAddress: 'Email address',
      password: 'Password',
      forgotPassword: 'Forgot password?',
      rememberMe: 'Remember me',
      signInButton: 'Sign In',
      manageOrgNotice: 'Are you managing an organization?',
    },
    loginOrg: {
      portal: 'Organization Portal',
      signInTitle: 'Sign in to your organization',
      signInSubtitle: 'Manage workspace wellbeing and hazard checklists',
      emailAddress: 'Email address',
      password: 'Password',
      forgotPassword: 'Forgot password?',
      rememberMe: 'Remember me',
      signInButton: 'Sign In',
      employeeNotice: 'Are you an employee?',
    },
    roleSelect: {
      subtitle: 'Occupational health & ergonomics platform for MENA region workplaces',
      title: 'Select your role to continue',
      employee: 'Employee',
      employeeDesc: 'Complete private self-assessments, track your personal wellbeing, and report hazard observations.',
      hrManager: 'Organization',
      hrManagerDesc: 'Manage department spaces, review aggregated wellbeing data, hazard checklists, and AI-driven recommendations.',
      employeeFeatures: [
        'Private wellbeing assessment',
        'Interactive body map',
        'Personal score history',
        'Hazard observation reports'
      ],
      hrFeatures: [
        'Company-wide wellbeing overview',
        'Facility hazard checklist',
        'AI recommendations engine',
        'Exportable compliance reports'
      ],
    },
    signup: {
      createAccount: 'Create your account',
      alreadyHaveAccount: 'Already have an account?',
      orgReg: 'Organization Registration',
      orgRegDesc: 'Creating a new organization profile & credentials',
      empReg: 'Employee Registration',
      empRegDesc: 'Joining an existing organization with an invite code',
      switchToEmployee: 'Switch to Employee',
      switchToAdmin: 'Switch to Organization',
      stepAdminDetails: '1. Admin Login Details',
      stepOrgCredentials: '1. Account Credentials',
      stepOrgIdentity: '2. Organization Identity',
      stepEmpDetails: '2. Employee Details',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email address',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      phone: 'Personal Phone',
      lang: 'Interface Language',
      gdprNotice: 'By registering, you agree to our GDPR-compliant health data policy. Individual wellbeing scores remain strictly private.',
      nextOrgInfo: 'Next: Organization Info',
      nextEmpDetails: 'Next: Employee Details',
      nextContactLocation: 'Next: Contact & Location',
      back: 'Back',
      orgName: 'Organization Name',
      orgNamePlaceholder: 'e.g. Sonatrach',
      orgDesc: 'Organization Description',
      orgDescPlaceholder: 'Brief overview of the organization',
      foundedYear: 'Founded Year',
      orgSize: 'Organization Size',
      selectSize: 'Select Size',
      bannerUrl: 'Banner URL',
      industry: 'Industry',
      logoUrl: 'Logo URL',
      contactPhone: 'Organization Phone',
      wilaya: 'Wilaya (Province)',
      selectWilaya: 'Select Wilaya',
      contactEmail: 'Organization Email',
      website: 'Website',
      district: 'District (Daira / City)',
      longitude: 'Longitude',
      latitude: 'Latitude',
      socialLinks: 'Social Media Links',
      createAccountBtn: 'Create Account',
      employeeNumber: 'Employee Number',
      inviteCode: 'Invite Code',
      verifyInvite: 'Verifying invite...',
      inviteValid: 'Invite code verified!',
      inviteInvalid: 'Invalid invite code',
      selectDept: 'Select Department',
      accountCreated: 'Account created!',
      redirecting: 'Redirecting to your dashboard...'
    },
    dashboard: {
      title: 'DASHBOARD',
      overview: 'Overview',
      departments: 'Departments',
      hazardChecklist: 'Hazard Checklist',
      observations: 'Observations',
      recommendations: 'Recommendations',
      reports: 'Reports',
      myAccount: 'My Account',
      logout: 'Log Out',
      onboardingTitle: 'ONBOARDING CHECKLIST',
      welcome: 'Welcome to ErgonoAI',
      onboardingDesc: 'Configure your workspace in three simple steps to start analyzing ergonomic wellbeing and identifying hazard trends.',
      stepDeptsTitle: '1. Departments',
      stepDeptsDesc: 'Set up distinct workspaces to group employees.',
      stepDeptsAction: 'Configure Spaces',
      stepInviteTitle: '2. Invite Staff',
      stepInviteDesc: 'Create site locations and generate invite codes.',
      stepInviteAction: 'Invite Employees',
      stepSurveyTitle: '3. Launch Survey',
      stepSurveyDesc: 'Start an ISO-compliant ergonomics assessment.',
      stepSurveyAction: 'Launch Campaign',
    },
    profile: {
      pageTitle: 'Organization Settings & Profile',
      pageSubtitle: 'Manage organization details, platform preferences, and staff onboarding',
      backToDashboard: 'Back to Dashboard',
      saveChanges: 'Save Changes',
      saving: 'Saving...',
      changesSaved: 'Changes Saved',
      clickToUploadBanner: 'Click to upload banner image',
      changeBanner: 'Change Banner',
      logoLabel: 'Logo',
      logoUrlBtn: 'Logo URL',
      bannerUrlBtn: 'Banner URL',
      noDescription: 'No description provided yet.',
      enterLogoUrl: 'Enter Logo Image URL:',
      enterBannerUrl: 'Enter Banner Image URL:',
      tabIdentity: 'Identity',
      tabLocation: 'Location & Contact',
      tabAdmin: 'Admin Details & Socials',
      tabSettings: 'Registration & Settings',
      orgName: 'Organization Name *',
      description: 'Description',
      descPlaceholder: "Describe your organization's mission and setup...",
      industry: 'Industry',
      industryPlaceholder: 'e.g. Manufacturing, Logistics, Healthcare',
      orgSize: 'Organization Size',
      selectSize: 'Select size...',
      foundedYear: 'Founded Year',
      contactEmail: 'Contact Email',
      contactPhone: 'Contact Phone',
      websiteUrl: 'Website URL',
      wilaya: 'Wilaya *',
      selectWilaya: 'Select Wilaya...',
      district: 'District / Daira *',
      coordPicker: 'Physical Coordinates & Picker',
      searchPlaceholder: 'Search location to center map (e.g. Algiers Mall, Bab Ezzouar)...',
      findBtn: 'Find',
      latitude: 'Latitude',
      longitude: 'Longitude',
      adminProfile: 'Administrator Profile',
      firstName: 'First Name',
      lastName: 'Last Name',
      adminPhone: 'Admin Personal Phone',
      loginEmail: 'Login Email (Read-only)',
      preferredLanguage: 'Preferred Language',
      socialMedia: 'Social Media Links',
      platformCustomization: 'Platform Customization',
      inviteSystem: 'Invite & Onboarding System',
      inviteSystemDesc: 'Generate registration codes for employees and management staff to join your workspace.',
      generateCode: 'Generate Registration Code',
      targetRole: 'Target Registration Role',
      targetSite: 'Target Site (Optional)',
      allSites: 'All Sites',
      maxUses: 'Maximum Usage Limit',
      expiryDate: 'Expiration Date',
      generateBtn: 'Generate Invite Code',
      activeCodes: 'Active Invitation Links & Codes',
      noCodesYet: 'No active invite codes generated yet.',
      dept: 'Dept',
      site: 'Site',
      uses: 'Uses',
      expires: 'Expires',
      all: 'All',
      copyCode: 'Copy code',
      revokeCode: 'Revoke code',
      yourOrg: 'Your Organization',
    }
  },
  ar: {
    common: {
      backToSite: 'العودة للموقع',
      getStarted: 'ابدأ الآن',
      startFreeTrial: 'ابدأ تجربة مجانية',
      talkToSales: 'تحدث مع المبيعات',
      watchDemo: 'شاهد العرض التجريبي',
      login: 'تسجيل الدخول',
      logout: 'تسجيل الخروج',
      features: 'المميزات',
      solutions: 'الحلول',
      pricing: 'الأسعار',
      ai: 'الذكاء الاصطناعي',
      privacyByDesign: 'الخصوصية بالتصميم.',
      privacyNotice: 'ردود الموظفين الفردية غير مرئية على الإطلاق للموارد البشرية أو مسؤولي السلامة أو لجنة الصحة والسلامة المهنية. يتم مشاركة الإحصائيات العامة المجمعة والمجهولة فقط.'
    },
    navbar: {
      features: 'المميزات',
      solutions: 'الحلول',
      ai: 'الذكاء الاصطناعي',
      pricing: 'الأسعار',
      login: 'تسجيل الدخول',
      getStarted: 'ابدأ الآن'
    },
    hero: {
      titleLine1: 'بيئة عملك تتحدث.',
      titleLine2: 'إرجونو أيه آي تساعدك على الاستماع.',
      subtitle: 'قم ببناء بيئات عمل أكثر صحة وأماناً باستخدام تقييمات مريحة وذكية، وتحليلات المخاطر المدعومة بالذكاء الاصطناعي، وتوصيات عملية وقابلة للتنفيذ.',
      companyHealth: 'صحة الشركة',
      riskReduced: 'انخفضت المخاطر بنسبة ٢١٪ ↓',
      isoCompliant: 'متوافق مع مواصفات ISO 7730',
      aiReady: 'توصيات الذكاء الاصطناعي جاهزة'
    },
    standards: {
      title: 'دعم المعايير العالمية لبيئة العمل وصحة الموظفين'
    },
    problem: {
      title: 'تكتشف معظم الشركات المشاكل والاضطرابات الجسدية للموظفين فقط بعد وقوع الإصابة.',
      desc: 'الطرق القديمة لإدارة بيئة العمل وتصميمها مجزأة، ورقية، وردة فعل متأخرة دوماً.',
      solutionTag: 'الحل المثالي',
      meet: 'تعرف على إرجونو أيه آي',
      items: [
        {
          title: 'التقييمات اليدوية والورقية',
          desc: 'نماذج ورقية وحساب يدوي للدرجات يستغرق ساعات طويلة ويعرض النتائج للخطأ البشري.'
        },
        {
          title: 'جداول البيانات المبعثرة',
          desc: 'بيانات الموظفين محصورة في ملفات Excel معزولة، مما يجعل من الصعب تحديد الأنماط العامة للشركة.'
        },
        {
          title: 'غياب رؤى الذكاء الاصطناعي',
          desc: 'الانتظار الطويل لخبراء السلامة لتفسير البيانات يدوياً بدلاً من الحصول على توصيات فورية ودقيقة.'
        }
      ]
    },
    featuresSection: {
      items: [
        {
          title: 'تحليل بيئة العمل بالذكاء الاصطناعي',
          desc: 'يقيم نظامنا الجلسة، والردود على الاستبيانات، والعوامل البيئية لتحديد المخاطر بدقة متناهية.'
        },
        {
          title: 'منشئ التقييمات الديناميكي',
          desc: 'أنشئ تقييمات مخصصة أو عالمية (مثل ISO، NMQ، REBA). انشرها ورقمها لجميع محطات العمل فوراً.'
        },
        {
          title: 'الإجراءات التصحيحية الفعالة',
          desc: 'توليد خطط تحسين بيئية وجسدية وتتبع مسارها حتى اكتمال المعالجة مباشرة عبر المنصة.'
        },
        {
          title: 'لوحات التحليلات الذكية',
          desc: 'لوحات بيانات تفاعلية تعرض اتجاهات التحسن التاريخية لقياس الأثر الفعلي لتدخلاتك البيئية.'
        }
      ]
    },
    howItWorks: {
      title: 'كيف يعمل النظام؟',
      steps: [
        { num: '١', title: 'إنشاء حساب الشركة', desc: 'أدخل تفاصيل المنشأة وال أقسام والمكاتب أو مواقع العمل.' },
        { num: '٢', title: 'دعوة الموظفين للإنضمام', desc: 'أضف فريقك بسهولة وسرعة عبر أكواد ورموز دعوة مخصصة.' },
        { num: '٣', title: 'إرسال الاستبيانات والتقييمات', desc: 'أطلق استبيانات مريحة ومخصصة بناءً على طبيعة أدوارهم الوظيفية.' },
        { num: '٤', title: 'تحليل فوري بالذكاء الاصطناعي', desc: 'يقوم محركنا بحساب درجات المخاطر والكشف عن الأسباب فوراً.' },
        { num: '٥', title: 'تطوير وتحسين بيئة العمل', desc: 'طبق الإجراءات التصحيحية وحلول تحسين الراحة المقترحة بدقة.' }
      ]
    },
    aiSpotlight: {
      title: 'تعرف على مستشارك المريحي الذكي',
      desc: 'اطرح الأسئلة، واحصل على إحصائيات فورية، وأتمت عملية الكشف عن المخاطر.',
      copilotTitle: 'مساعد إرجونو أيه آي الذكي',
      userQuery: 'أظهر الأقسام التي بها أعلى نسبة مخاطر متعلقة ببيئة العمل والراحة الجسدية.',
      aiIntro: 'إليك الأقسام ذات درجات المخاطر الأعلى بناءً على أحدث التقييمات والاستبيانات المكتملة:',
      riskLabel: 'نسبة الخطر ٨٤٪',
      issuesTitle: 'خط الإنتاج أ',
      primaryIssue: 'المشكلة الأساسية',
      primaryIssueVal: 'ضعف الإضاءة',
      secondaryIssue: 'المشكلة الثانوية',
      secondaryIssueVal: 'انحناء الرقبة المستمر لفترات طويلة',
      impact: 'الأثر والشكوى',
      impactVal: 'تقارير متعددة عن آلام الرقبة والظهر',
      aiFooter: 'تمت صياغة الإجراءات التصحيحية الموصى بها مسبقاً وهي في انتظار مراجعتك واعتمادك في لوحة الإجراءات.'
    },
    dashboardPreview: {
      title: 'رؤى متطورة تناسب الشركات الكبرى',
      desc: 'راقب وحسن مؤشرات الراحة والسلامة في مؤسستك بالكامل من شاشة تحكم واحدة وقوية.'
    },
    statistics: {
      items: [
        { label: 'متوسط تقليل المخاطر والإصابات' },
        { label: 'استبيان وتقييم مكتمل' },
        { label: 'دقة وثقة توصيات الذكاء الاصطناعي' },
        { label: 'عملاء من فئة المؤسسات الكبرى' }
      ]
    },
    pricing: {
      title: 'باقات أسعار مرنة وواضحة',
      desc: 'اختر الخطة المناسبة لحجم ونشاط شركتك لتوفير بيئة عمل صحية.',
      mostPopular: 'الباقة الأكثر طلباً',
      period: '/شهرياً',
      tiers: [
        {
          name: 'المجانية',
          price: '$٠',
          desc: 'مثالية لتجربة المنصة واستكشافها.',
          features: ['حتى ١٠ موظفين', 'التقييمات القياسية (RULA, REBA)', 'تحليلات لوحة البيانات الأساسية', 'الدعم عبر البريد الإلكتروني'],
          cta: 'ابدأ مجاناً'
        },
        {
          name: 'الاحترافية',
          price: '$٤٩',
          desc: 'كل ما تحتاجه للفرق والشركات المتنامية.',
          features: ['حتى ١٠٠ موظف', 'تحليلات بيئة العمل بالذكاء الاصطناعي', 'منشئ التقييمات والاستبيانات المخصص', 'تتبع وإدارة الإجراءات التصحيحية', 'أولوية الحصول على الدعم'],
          cta: 'ابدأ تجربة مجانية'
        },
        {
          name: 'المؤسسات',
          price: 'مخصص',
          desc: 'ميزات متطورة للأمان والتحجيم الضخم.',
          features: ['عدد موظفين غير محدود', 'مواقع وفروع متعددة', 'تكامل برمجيات الـ API والربط الموحد SSO', 'مدير حساب مخصص لمنشأتك', 'تدريب مخصص لنماذج الذكاء الاصطناعي'],
          cta: 'اتصل بنا'
        }
      ]
    },
    faq: {
      title: 'الأسئلة الشائعة والمكررة',
      items: [
        {
          q: 'كيف يعمل تقييم الذكاء الاصطناعي؟',
          a: 'يقوم نظامنا بتحليل الاستبيانات المكتملة وعينات الصور أو الفيديو لتحديد زوايا الجسم وحساب درجات المخاطر وفق المعايير والبروتوكولات الطبية مثل ISO 7730 و REBA.'
        },
        {
          q: 'هل بيانات موظفينا محمية وآمنة؟',
          a: 'نعم بالكامل. إرجونو أيه آي متوافقة مع لوائح حماية البيانات العامة GDPR، وتعتمد تشفيراً تاماً لكافة البيانات، ولا تستخدم بيانات موظفينا الطبية لتدريب النماذج العامة.'
        },
        {
          q: 'هل يمكن الربط مع أدوات الموارد البشرية الحالية؟',
          a: 'نعم، يمكن لعملاء باقة المؤسسات استخدام واجهة برمجة التطبيقات API لمزامنة ملفات الموظفين والهياكل الإدارية مباشرة مع Workday و BambooHR والأنظمة الأخرى.'
        },
        {
          q: 'هل تتوفر تقييمات واستبيانات مخصصة؟',
          a: 'نعم. يتيح لك منشئ التقييمات الديناميكي بناء استبيانات مخصصة تماماً وتعيين درجات المخاطر بناءً على المخاطر الفريدة لطبيعة العمل في شركتك.'
        }
      ]
    },
    footer: {
      ctaTitle: 'هل أنت جاهز لتوفير بيئة عمل مريحة وصحية؟',
      ctaSub: 'انضم إلى الشركات الذكية التي تستخدم الذكاء الاصطناعي لحماية أغلى ما تملك - موظفيها.',
      footerDesc: 'إدارة وتصميم بيئة العمل مدعومة بالذكاء الاصطناعي. امنع الإصابات قبل حدوثها.',
      copyright: '© ٢٠٢٦ إرجونو أيه آي. جميع الحقوق محفوظة.',
      product: 'المنتج',
      resources: 'المصادر',
      organization: 'المنظمة',
      links: {
        features: 'المميزات',
        integrations: 'التكاملات والربط',
        pricing: 'الأسعار والباقات',
        changelog: 'تحديثات المنصة',
        documentation: 'التوثيق البرمجي',
        blog: 'المدونة',
        standards: 'معايير الراحة الجسدية',
        caseStudies: 'دراسات الحالة',
        about: 'من نحن',
        privacy: 'سياسة الخصوصية',
        terms: 'شروط الخدمة',
        contact: 'اتصل بنا'
      }
    },
    login: {
      subtitle: 'سجل الدخول للوصول إلى بوابة الصحة المهنية وبيئة العمل الخاصة بك',
      destinationTitle: 'اختر وجهتك لتسجيل الدخول',
      employeePortal: 'بوابة الموظف',
      employeePortalDesc: 'للموظفين وأعضاء الفريق. يمكنك الوصول إلى تقييماتك الخاصة، وتتبع سجل نتائجك، والإبلاغ عن ملاحظات مخاطر بيئة العمل.',
      orgPortal: 'بوابة المنشأة',
      orgPortalDesc: 'لمسؤولي الموارد البشرية والمديرين. يمكنك إدارة الأقسام، ومراجعة قوائم التحقق من السلامة، وعرض توصيات الذكاء الاصطناعي.',
      logIn: 'تسجيل الدخول',
      personalSpace: 'المساحة الشخصية',
      orgDashboard: 'لوحة تحكم المنشأة',
    },
    loginEmployee: {
      portal: 'بوابة الموظف',
      signInTitle: 'تسجيل الدخول كموظف',
      signInSubtitle: 'الوصول إلى تقييماتك الذاتية الخاصة ولوحة التحكم',
      emailAddress: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      forgotPassword: 'نسيت كلمة المرور؟',
      rememberMe: 'تذكرني',
      signInButton: 'تسجيل الدخول',
    },
    loginOrg: {
      portal: 'بوابة المنشأة',
      signInTitle: 'تسجيل الدخول إلى منشأتك',
      signInSubtitle: 'إدارة سلامة بيئة العمل وقوائم التحقق من المخاطر',
      emailAddress: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      forgotPassword: 'نسيت كلمة المرور؟',
      rememberMe: 'تذكرني',
      signInButton: 'تسجيل الدخول',
    },
    roleSelect: {
      subtitle: 'منصة الصحة المهنية وسلامة بيئة العمل لمواقع العمل في منطقة الشرق الأوسط وشمال إفريقيا',
      title: 'اختر دورك للمتابعة',
      employee: 'موظف',
      employeeDesc: 'إكمال التقييمات الذاتية الخاصة، وتتبع سلامتك الشخصية، والإبلاغ عن ملاحظات المخاطر.',
      hrManager: 'المنشأة',
      hrManagerDesc: 'إدارة الأقسام، ومراجعة بيانات السلامة المجمعة، وقوائم التحقق من المخاطر، والتوصيات المدعومة بالذكاء الاصطناعي.',
      employeeFeatures: [
        'تقييم السلامة والراحة الخاصة',
        'خريطة تفاعلية لأعضاء الجسم',
        'تتبع تاريخ الدرجات والنتائج الشخصية',
        'تقارير الإبلاغ عن ملاحظات المخاطر'
      ],
      hrFeatures: [
        'نظرة عامة على سلامة المنشأة بالكامل',
        'قائمة التحقق من مخاطر المنشأة',
        'محرك توصيات الذكاء الاصطناعي',
        'تقارير امتثال قابلة للتصدير'
      ],
    },
    signup: {
      createAccount: 'أنشئ حسابك',
      alreadyHaveAccount: 'لديك حساب بالفعل؟',
      orgReg: 'تسجيل المنشأة',
      orgRegDesc: 'إنشاء ملف تعريف منشأة جديد وبيانات الاعتماد',
      empReg: 'تسجيل الموظف',
      empRegDesc: 'الانضمام إلى منشأة موجودة باستخدام رمز الدعوة',
      switchToEmployee: 'التبديل إلى موظف',
      switchToAdmin: 'التبديل للمنشأة',
      stepAdminDetails: '١. تفاصيل تسجيل دخول المسؤول',
      stepOrgCredentials: '١. بيانات اعتماد المنشأة',
      stepOrgIdentity: '٢. هوية المنشأة',
      stepEmpDetails: '٢. تفاصيل الموظف',
      firstName: 'الاسم الأول',
      lastName: 'اللقب',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      phone: 'الهاتف الشخصي',
      lang: 'لغة الواجهة',
      gdprNotice: 'بالتسجيل، فإنك توافق على سياسة بيانات الصحة المتوافقة مع GDPR. تظل درجات الصحة والسلامة الشخصية سرية تماماً.',
      nextOrgInfo: 'التالي: معلومات المنشأة',
      nextEmpDetails: 'التالي: تفاصيل الموظف',
      nextContactLocation: 'التالي: الاتصال والموقع',
      back: 'رجوع',
      orgName: 'اسم المنشأة',
      orgNamePlaceholder: 'مثال: سوناطراك',
      orgDesc: 'وصف المنشأة',
      orgDescPlaceholder: 'نبذة مختصرة عن المنشأة',
      foundedYear: 'سنة التأسيس',
      orgSize: 'حجم المنشأة',
      selectSize: 'اختر الحجم',
      bannerUrl: 'رابط صورة الغلاف (Banner)',
      industry: 'القطاع / المجال',
      logoUrl: 'رابط الشعار (Logo)',
      contactPhone: 'هاتف المنشأة',
      wilaya: 'الولاية',
      selectWilaya: 'اختر الولاية',
      contactEmail: 'البريد الإلكتروني للمنشأة',
      website: 'الموقع الإلكتروني',
      district: 'الدائرة / البلدية / المدينة',
      longitude: 'خط الطول',
      latitude: 'خط العرض',
      socialLinks: 'روابط وسائل التواصل الاجتماعي',
      createAccountBtn: 'إنشاء الحساب',
      employeeNumber: 'الرقم الوظيفي',
      inviteCode: 'رمز الدعوة',
      verifyInvite: 'جاري التحقق من الرمز...',
      inviteValid: 'تم التحقق من الرمز بنجاح!',
      inviteInvalid: 'رمز الدعوة غير صالح',
      selectDept: 'اختر القسم',
      accountCreated: 'تم إنشاء الحساب بنجاح!',
      redirecting: 'جاري التوجيه إلى لوحة التحكم...'
    },
    dashboard: {
      title: 'لوحة التحكم',
      overview: 'نظرة عامة',
      departments: 'الأقسام',
      hazardChecklist: 'قائمة المخاطر',
      observations: 'الملاحظات المرصودة',
      recommendations: 'التوصيات',
      reports: 'التقارير',
      myAccount: 'حسابي',
      logout: 'تسجيل الخروج',
      onboardingTitle: 'قائمة مرجعية لتهيئة النظام',
      welcome: 'مرحباً بك في ErgonoAI',
      onboardingDesc: 'قم بتهيئة مساحة العمل الخاصة بك في ثلاث خطوات بسيطة لبدء تحليل السلامة المرفقية وتحديد اتجاهات المخاطر.',
      stepDeptsTitle: '١. الأقسام',
      stepDeptsDesc: 'قم بإعداد مساحات عمل متميزة لتجميع الموظفين.',
      stepDeptsAction: 'تهيئة المساحات',
      stepInviteTitle: '٢. دعوة الموظفين',
      stepInviteDesc: 'قم بإنشاء مواقع الفروع وتوليد رموز الدعوة.',
      stepInviteAction: 'دعوة الموظفين',
      stepSurveyTitle: '٣. إطلاق الاستبيان',
      stepSurveyDesc: 'ابدأ تقييماً متوافقاً مع معايير الأيزو لبيئة العمل.',
      stepSurveyAction: 'إطلاق الحملة',
    },
    profile: {
      pageTitle: 'إعدادات وملف المنشأة',
      pageSubtitle: 'إدارة تفاصيل المنشأة والتفضيلات وتأهيل الموظفين',
      backToDashboard: 'العودة للوحة التحكم',
      saveChanges: 'حفظ التغييرات',
      saving: 'جاري الحفظ...',
      changesSaved: 'تم الحفظ',
      clickToUploadBanner: 'انقر لرفع صورة الغلاف',
      changeBanner: 'تغيير الغلاف',
      logoLabel: 'الشعار',
      logoUrlBtn: 'رابط الشعار',
      bannerUrlBtn: 'رابط الغلاف',
      noDescription: 'لم يتم إضافة وصف بعد.',
      enterLogoUrl: 'أدخل رابط صورة الشعار:',
      enterBannerUrl: 'أدخل رابط صورة الغلاف:',
      tabIdentity: 'الهوية',
      tabLocation: 'الموقع والتواصل',
      tabAdmin: 'بيانات المسؤول ووسائل التواصل',
      tabSettings: 'التسجيل والإعدادات',
      orgName: 'اسم المنشأة *',
      description: 'الوصف',
      descPlaceholder: 'صِف مهمة منشأتك وهيكلها...',
      industry: 'القطاع / المجال',
      industryPlaceholder: 'مثال: تصنيع، لوجستيات، رعاية صحية',
      orgSize: 'حجم المنشأة',
      selectSize: 'اختر الحجم...',
      foundedYear: 'سنة التأسيس',
      contactEmail: 'البريد الإلكتروني للتواصل',
      contactPhone: 'رقم هاتف التواصل',
      websiteUrl: 'الموقع الإلكتروني',
      wilaya: 'الولاية *',
      selectWilaya: 'اختر الولاية...',
      district: 'الدائرة / البلدية *',
      coordPicker: 'الإحداثيات الجغرافية',
      searchPlaceholder: 'ابحث عن موقع لتحديد المركز (مثال: الجزائر العاصمة)...',
      findBtn: 'بحث',
      latitude: 'خط العرض',
      longitude: 'خط الطول',
      adminProfile: 'ملف المسؤول',
      firstName: 'الاسم الأول',
      lastName: 'اللقب',
      adminPhone: 'هاتف المسؤول الشخصي',
      loginEmail: 'البريد الإلكتروني (للقراءة فقط)',
      preferredLanguage: 'لغة الواجهة',
      socialMedia: 'روابط وسائل التواصل الاجتماعي',
      platformCustomization: 'تخصيص المنصة',
      inviteSystem: 'نظام الدعوة والتأهيل',
      inviteSystemDesc: 'أنشئ رموز تسجيل للموظفين وأعضاء الإدارة للانضمام إلى مساحة عملك.',
      generateCode: 'توليد رمز التسجيل',
      targetRole: 'دور التسجيل المستهدف',
      targetSite: 'الموقع المستهدف (اختياري)',
      allSites: 'جميع المواقع',
      maxUses: 'الحد الأقصى للاستخدام',
      expiryDate: 'تاريخ الانتهاء',
      generateBtn: 'توليد رمز الدعوة',
      activeCodes: 'روابط ورموز الدعوة النشطة',
      noCodesYet: 'لا توجد رموز دعوة نشطة بعد.',
      dept: 'القسم',
      site: 'الموقع',
      uses: 'الاستخدام',
      expires: 'ينتهي',
      all: 'الكل',
      copyCode: 'نسخ الرمز',
      revokeCode: 'إلغاء الرمز',
      yourOrg: 'منشأتك',
    }
  }
} as const
