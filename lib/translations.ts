export type Language = 'en' | 'ar' | 'fr'

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
      aiReady: 'AI Recommendation Ready',
      iso7730Explanation: 'ISO 7730 is the international ergonomics standard for evaluating thermal comfort and workplace environmental stress (PMV/PPD index). ErgonoAI integrates ISO 7730 criteria to prevent physical discomfort and posture fatigue in real time.',
      companyHealthExplanation: 'The Company Health Index is ErgonoAI\'s real-time aggregate safety score. It tracks organization-wide MSD risk reduction, active posture improvements, and department compliance rates.',
      hoverForDetails: 'Hover for details',
      ergonoaiWord: 'ERGONOAI'
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
      privacyTitle: 'Privacy by design.',
      privacyDesc: 'Individual responses are never visible to HR or Safety Officers. Only anonymized aggregates are shared.',
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
      redirecting: 'Redirecting to your dashboard...',
      continueWithGoogle: 'Continue with Google',
      signUpWithGoogle: 'Sign up with Google',
      orContinueWithEmail: 'or continue with email'
    },
    dashboard: {
      title: 'DASHBOARD',
      overview: 'Overview',
      departments: 'Departments',
      hazardChecklist: 'Hazard Checklist',
      observations: 'Observations',
      recommendations: 'AI Recommendations',
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
      securityPassword: 'Security & Password',
      currentPassword: 'Current Password',
      newPassword: 'New Password',
      confirmNewPassword: 'Confirm New Password',
      updatePasswordBtn: 'Update Password',
      updating: 'Updating...',
      passwordUpdated: 'Password updated successfully!',
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
    },
    auth: {
      signInTitle: 'Sign in to your account',
      dontHaveAccount: "Don't have an account?",
      signUp: 'Sign up',
      emailAddress: 'Email address',
      forgotPassword: 'Forgot password?',
      password: 'Password',
      signIn: 'Sign in',
      backToLanding: 'Back to landing page',
      enterpriseErgonomics: 'Enterprise Workplace Ergonomics',
      heroSubtitle: 'Empower your workforce with intelligent ergonomic assessments, proactive risk management, and actionable wellbeing insights.',
      alreadySignedIn: 'Already signed in',
      signedInAs: 'You are currently signed in as',
      goDashboard: 'Go to Dashboard',
      completeOnboarding: 'Complete Onboarding',
      signOutAnother: 'Sign out / Use another account',
      continueWithGoogle: 'Continue with Google',
      orContinueWithEmail: 'or continue with email',
    },
    employee: {
      private: 'Private',
      logout: 'Log out',
      back: 'Back',
      personalProfile: 'Personal Profile',
      hi: 'Hi',
      completeProfileTitle: 'complete your profile to get started',
      updateProfileTitle: 'Update your profile details',
      profileIntroDesc: 'This information helps us contextualise your assessment results. It is stored privately and will never be shared with your employer in identifiable form.',
      fullName: 'Full Name',
      workPosition: 'Work Position',
      gender: 'Gender',
      maritalStatus: 'Marital Status',
      dateOfBirth: 'Date of Birth',
      placeOfBirth: 'Place of Birth',
      height: 'Height (cm)',
      weight: 'Weight (kg)',
      yearsWorking: 'Years in Current Role',
      workingHoursPerDay: 'Working Hours per Day',
      partTimeJobQuestion: 'Do you have a part-time job in addition to this one?',
      male: 'Male',
      female: 'Female',
      single: 'Single',
      married: 'Married',
      divorced: 'Divorced',
      widowed: 'Widowed',
      yes: 'Yes',
      no: 'No',
      saveChanges: 'Save Changes',
      completeProfileBtn: 'Complete Profile',
      namePlaceholder: 'e.g. Mohamed Ali',
      positionPlaceholder: 'e.g. Mechanical Engineer',
      birthPlacePlaceholder: 'e.g. Algiers',
      selectGender: 'Select gender',
      selectStatus: 'Select status',
      required: 'Required',
      assessmentReview: 'Assessment Review',
      readOnlyWarning: 'This form has been submitted. Answers are read-only and cannot be edited.',
      noDetailedAnswers: 'This is a historical mock form — detailed answers were not stored.',
      close: 'Close',
      submittedForm: 'Assessment Form',
      submittedStatus: 'Submitted',
      submittedAt: 'submitted at',
      questionsCount: 'questions',
      reviewBtn: 'Review',
      noteModalTitle: 'Report an Ergonomic Concern',
      noteModalDesc: 'Share any pain, discomfort, or safety observation directly with the system. Your comments will be processed anonymously.',
      notePlaceholder: 'Type your observation or concern here...',
      submitBtn: 'Submit Observation',
      welcomeGreeting: 'Welcome back,',
      ergonomicDashboard: 'Your Wellbeing & Ergonomic Dashboard',
      activeCampaignTitle: 'Ergonomic Assessment Required',
      activeCampaignDesc: 'An active wellbeing and safety assessment campaign has been launched by your HR Manager:',
      inProgressText: 'You have a questionnaire in progress.',
      resumeBtn: 'Resume Assessment',
      startBtn: 'Start Assessment',
      recentSubmissions: 'Recent Submissions',
      noSubmissionsYet: 'No assessments submitted yet. When you complete an assessment, it will show up here.',
      quickActions: 'Quick Actions',
      reportConcern: 'Report a Concern',
      reportConcernDesc: 'Report physical discomfort or workplace ergonomic issues.',
      myProfile: 'My Profile Settings',
      myProfileDesc: 'Manage your personal metrics and account settings.',
      privacyBanner: 'Privacy Notice',
      privacyBannerDesc: 'Your personal responses and raw questionnaire answers are strictly confidential. HR and safety management can only view anonymous aggregates and overall safety levels.',
      privacyGuaranteed: 'Privacy Guaranteed',
      privacyGuaranteedDesc: 'Individual answers are aggregated and kept completely anonymous.',
      requiredStep: 'Required Step',
      requiredStepDesc: 'Under company OSH guidelines, you must complete this assessment to access the feedback portal.',
      startAssessmentNow: 'Start Assessment Now',
      writeANote: 'Write a note',
      noActiveCampaigns: "No active assessment campaigns currently required. We'll notify you here when the next cycle begins!",
      pastAssessments: 'Past Assessments',
      noAssessmentsYet: 'No assessments yet',
      startFirstAssessment: 'Start your first assessment above.',
      notesSent: 'Notes Sent',
      sentAnonymously: 'Sent anonymously',
      previous: 'Previous',
      next: 'Next',
      reviewAnswers: 'Review Answers',
      addNote: 'Add note',
      page: 'Page',
      of: 'of',
      answered: 'answered',
      reviewTitle: 'Review your answers',
      reviewDesc: 'Check your responses below. You can edit any answer inline before submitting. Once submitted, answers cannot be changed.',
      backToQuestions: 'Back to Questions',
      edit: 'Edit',
      cancel: 'Cancel',
      save: 'Save',
      noteOptional: 'Note (optional)...',
      rating: 'Rating',
      submitAssessment: 'Submit Assessment'
    }
  },
  fr: {
    common: {
      backToSite: 'Retour au site',
      getStarted: 'Commencer',
      startFreeTrial: 'Essai gratuit',
      talkToSales: 'Contacter les ventes',
      watchDemo: 'Voir la démo',
      login: 'Connexion',
      logout: 'Déconnexion',
      features: 'Fonctionnalités',
      solutions: 'Solutions',
      pricing: 'Tarifs',
      ai: 'Intelligence Artificielle',
      privacyByDesign: 'Confidentialité dès la conception.',
      privacyNotice: 'Les réponses individuelles des employés ne sont jamais visibles par les RH, les responsables de sécurité ou le comité SST. Seuls les agrégats anonymisés sont partagés.'
    },
    navbar: {
      features: 'Fonctionnalités',
      solutions: 'Solutions',
      ai: 'IA',
      pricing: 'Tarifs',
      login: 'Connexion',
      getStarted: 'Commencer'
    },
    hero: {
      titleLine1: 'Votre environnement de travail s’exprime.',
      titleLine2: 'ErgonoAI vous aide à l’écouter.',
      subtitle: 'Créez des espaces de travail plus sains grâce à des évaluations ergonomiques intelligentes, des analyses de risques par IA et des recommandations concrètes.',
      companyHealth: 'Santé de l’entreprise',
      riskReduced: 'Risque réduit de 21% ↓',
      isoCompliant: 'Conforme ISO 7730',
      aiReady: 'Recommandations IA prêtes',
      iso7730Explanation: 'La norme ISO 7730 est le standard international d’évaluation du confort thermique et du stress environnemental au travail (indice PMV/PPD). ErgonoAI intègre les critères ISO 7730 pour prévenir l’inconfort physique et la fatigue posturale en temps réel.',
      companyHealthExplanation: 'L’indice de santé de l’entreprise est le score global de sécurité en temps réel d’ErgonoAI. Il mesure la réduction des risques de TMS, les améliorations posturales et le taux de conformité.',
      hoverForDetails: 'Survoler pour détails',
      ergonoaiWord: 'ERGONOAI'
    },
    standards: {
      title: 'Conformité aux normes ergonomiques internationales'
    },
    problem: {
      title: 'La plupart des entreprises ne découvrent les problèmes ergonomiques qu’après la survenue des blessures.',
      desc: 'L’ancienne méthode de gestion de l’ergonomie au travail est fragmentée, manuelle et purement réactive.',
      solutionTag: 'La Solution',
      meet: 'Découvrez ErgonoAI',
      items: [
        {
          title: 'Évaluations manuelles',
          desc: 'Formulaires papier et calculs manuels fastidieux qui prennent des heures et favorisent les erreurs.'
        },
        {
          title: 'Feuilles de calcul isolées',
          desc: 'Données cloisonnées dans des fichiers Excel rendant impossible la détection des tendances globales.'
        },
        {
          title: 'Absence d’analyse IA',
          desc: 'Longue attente d’experts pour interpréter les données au lieu de disposer de recommandations immédiates.'
        }
      ]
    },
    featuresSection: {
      items: [
        {
          title: 'Analyse ergonomique par IA',
          desc: 'Notre IA évalue la posture, les réponses aux questionnaires et les facteurs environnementaux pour cibler les risques avec précision.'
        },
        {
          title: 'Générateur d’évaluations',
          desc: 'Créez des évaluations conformes ISO, NMQ, REBA et personnalisées. Déployez-les instantanément auprès des collaborateurs.'
        },
        {
          title: 'Actions correctives',
          desc: 'Générez automatiquement des plans d’amélioration et suivez leur résolution directement sur la plateforme.'
        },
        {
          title: 'Analytique avancée',
          desc: 'Tableaux de bord dynamiques affichant les tendances historiques pour mesurer l’impact réel de vos interventions.'
        }
      ]
    },
    howItWorks: {
      title: 'Comment ça marche',
      steps: [
        { num: '1', title: 'Créer l’entreprise', desc: 'Configurez votre organisation, vos départements et vos sites.' },
        { num: '2', title: 'Inviter les employés', desc: 'Intégrez rapidement vos équipes avec des codes d’invitation personnalisés.' },
        { num: '3', title: 'Lancer les campagnes', desc: 'Déployez des évaluations ciblées selon les postes.' },
        { num: '4', title: 'Analyse par IA', desc: 'Notre moteur évalue immédiatement le score de risque et identifie les dangers.' },
        { num: '5', title: 'Améliorer l’espace', desc: 'Exécutez les actions correctives recommandées par l’IA.' }
      ]
    },
    aiSpotlight: {
      title: 'Découvrez votre Ergonome IA',
      desc: 'Posez des questions, obtenez des analyses instantanées et automatisez la détection des risques.',
      copilotTitle: 'Copilote ErgonoAI',
      userQuery: 'Afficher les départements présentant le risque ergonomique le plus élevé.',
      aiIntro: 'Voici les départements présentant les scores de risque ergonomique les plus élevés selon les récentes évaluations :',
      riskLabel: 'Risque 84%',
      issuesTitle: 'Ligne de Production A',
      primaryIssue: 'Problème principal',
      primaryIssueVal: 'Éclairage insuffisant',
      secondaryIssue: 'Problème secondaire',
      secondaryIssueVal: 'Flexion cervicale prolongée',
      impact: 'Impact',
      impactVal: 'Nombreux signalements de douleurs au cou',
      aiFooter: 'Des actions correctives recommandées ont été générées et sont en attente d’approbation dans le tableau de bord.'
    },
    dashboardPreview: {
      title: 'Analyses de niveau entreprise',
      desc: 'Supervisez l’ensemble de votre organisation depuis un tableau de bord unique et puissant.'
    },
    statistics: {
      items: [
        { label: 'Réduction moyenne des risques' },
        { label: 'Évaluations réalisées' },
        { label: 'Taux de confiance de l’IA' },
        { label: 'Clients Entreprises' }
      ]
    },
    pricing: {
      title: 'Une tarification simple et transparente',
      desc: 'Choisissez le forfait adapté aux besoins de votre entreprise.',
      mostPopular: 'Le plus populaire',
      period: '/mois',
      tiers: [
        {
          name: 'Gratuit',
          price: '0 €',
          desc: 'Idéal pour découvrir la plateforme.',
          features: ['Jusqu’à 10 employés', 'Évaluations standards (RULA, REBA)', 'Analyses de base', 'Support par email'],
          cta: 'Commencer'
        },
        {
          name: 'Professionnel',
          price: '49 €',
          desc: 'Tout le nécessaire pour les équipes en croissance.',
          features: ['Jusqu’à 100 employés', 'Analyse ergonomique IA', 'Générateur d’évaluations sur mesure', 'Suivi des actions correctives', 'Support prioritaire'],
          cta: 'Essai gratuit'
        },
        {
          name: 'Entreprise',
          price: 'Sur devis',
          desc: 'Sécurité et évolutivité avancées.',
          features: ['Employés illimités', 'Multi-sites et départements', 'Accès API & SSO', 'Gestionnaire de compte dédié', 'Entraînement IA personnalisé'],
          cta: 'Contacter les ventes'
        }
      ]
    },
    faq: {
      title: 'Questions fréquentes',
      items: [
        {
          q: 'Comment fonctionne l’évaluation par IA ?',
          a: 'Notre IA analyse les questionnaires soumis par les employés et les données environnementales pour calculer des scores de risque ergonomique conformes aux normes ISO 7730 et REBA.'
        },
        {
          q: 'Les données de nos employés sont-elles sécurisées ?',
          a: 'Oui. ErgonoAI est entièrement conforme au RGPD, utilise un chiffrement de bout en bout et n’utilise jamais vos données de santé privées pour entraîner des modèles publics.'
        },
        {
          q: 'Pouvons-nous intégrer nos outils RH existants ?',
          a: 'Les clients Entreprise peuvent utiliser notre API pour synchroniser les profils employés et les structures d’organisation avec Workday, BambooHR et d’autres SIRH majeurs.'
        },
        {
          q: 'Proposez-vous des évaluations sur mesure ?',
          a: 'Oui. Le générateur d’évaluations vous permet de créer des questionnaires entièrement personnalisés adaptés aux risques spécifiques de votre industrie.'
        }
      ]
    },
    footer: {
      ctaTitle: 'Prêt à bâtir un espace de travail plus sain ?',
      ctaSub: 'Rejoignez les entreprises innovantes qui utilisent l’IA pour protéger leur bien le plus précieux : leurs collaborateurs.',
      footerDesc: 'Ergonomie au travail propulsée par l’IA. Prévenez les troubles musculo-squelettiques avant leur apparition.',
      copyright: '© 2026 ErgonoAI, Inc. Tous droits réservés.',
      product: 'Produit',
      resources: 'Ressources',
      organization: 'Organisation',
      links: {
        features: 'Fonctionnalités',
        integrations: 'Intégrations',
        pricing: 'Tarifs',
        changelog: 'Mises à jour',
        documentation: 'Documentation',
        blog: 'Blog',
        standards: 'Normes ergonomiques',
        caseStudies: 'Études de cas',
        about: 'À propos',
        privacy: 'Politique de confidentialité',
        terms: 'Conditions d’utilisation',
        contact: 'Contact'
      }
    },
    login: {
      subtitle: 'Connectez-vous pour accéder à votre portail de santé au travail et ergonomie',
      destinationTitle: 'Sélectionnez votre espace pour vous connecter',
      employeePortal: 'Portail Employé',
      employeePortalDesc: 'Pour les collaborateurs. Accédez à vos auto-évaluations privées, suivez votre historique et signalez des risques ergonomiques.',
      orgPortal: 'Portail Organisation',
      orgPortalDesc: 'Pour les Responsables RH et Directeurs. Gérez les départements, auditez les listes de conformité et consultez les recommandations IA.',
      logIn: 'Se connecter',
      personalSpace: 'Espace Personnel',
      orgDashboard: 'Tableau de bord Organisation',
      dontHaveAccount: 'Vous n’avez pas de compte ?'
    },
    loginEmployee: {
      portal: 'Portail Employé',
      signInTitle: 'Connexion Employé',
      signInSubtitle: 'Accédez à vos auto-évaluations privées et à votre espace',
      emailAddress: 'Adresse email',
      password: 'Mot de passe',
      forgotPassword: 'Mot de passe oublié ?',
      rememberMe: 'Se souvenir de moi',
      signInButton: 'Se connecter',
      manageOrgNotice: 'Vous gérez une organisation ?',
    },
    loginOrg: {
      portal: 'Portail Organisation',
      signInTitle: 'Connexion Organisation',
      signInSubtitle: 'Gérez le bien-être et les listes de contrôle des risques',
      emailAddress: 'Adresse email',
      password: 'Mot de passe',
      forgotPassword: 'Mot de passe oublié ?',
      rememberMe: 'Se souvenir de moi',
      signInButton: 'Se connecter',
      employeeNotice: 'Vous êtes un employé ?',
    },
    roleSelect: {
      subtitle: 'Plateforme de santé au travail et ergonomie intelligente',
      title: 'Sélectionnez votre rôle pour continuer',
      employee: 'Employé',
      employeeDesc: 'Complétez vos auto-évaluations privées, suivez votre bien-être et signalez des observations.',
      hrManager: 'Organisation / RH',
      hrManagerDesc: 'Gérez les départements, auditez les données globales, les listes de risques et les recommandations IA.',
      employeeFeatures: [
        'Évaluation privée du bien-être',
        'Carte interactive du corps',
        'Historique personnel des scores',
        'Signalement des risques'
      ],
      hrFeatures: [
        'Vue d’ensemble globale de l’entreprise',
        'Liste de contrôle des risques du site',
        'Moteur de recommandations par IA',
        'Rapports d’audit exportables'
      ],
      privacyTitle: 'Confidentialité dès la conception.',
      privacyDesc: 'Les réponses individuelles ne sont jamais visibles par la direction. Seules les données globales agrégées sont partagées.',
    },
    signup: {
      createAccount: 'Créer votre compte',
      alreadyHaveAccount: 'Vous avez déjà un compte ?',
      orgReg: 'Inscription Organisation',
      orgRegDesc: 'Création d’un nouveau profil d’organisation et d’identifiants',
      empReg: 'Inscription Employé',
      empRegDesc: 'Rejoindre une organisation existante via un code d’invitation',
      switchToEmployee: 'Basculer vers Employé',
      switchToAdmin: 'Basculer vers Organisation',
      stepAdminDetails: '1. Identifiants Administrateur',
      stepOrgCredentials: '1. Identifiants du Compte',
      stepOrgIdentity: '2. Identité de l’Organisation',
      stepEmpDetails: '2. Détails de l’Employé',
      firstName: 'Prénom',
      lastName: 'Nom',
      email: 'Adresse email',
      password: 'Mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
      phone: 'Téléphone personnel',
      lang: 'Langue de l’interface',
      gdprNotice: 'En vous inscrivant, vous acceptez notre politique de données de santé conforme au RGPD. Vos scores individuels restent strictement privés.',
      nextOrgInfo: 'Suivant : Informations Organisation',
      nextEmpDetails: 'Suivant : Informations Employé',
      nextContactLocation: 'Suivant : Contact & Localisation',
      back: 'Retour',
      orgName: 'Nom de l’Organisation',
      orgNamePlaceholder: 'ex. Sonatrach, Renault, Total',
      orgDesc: 'Description de l’Organisation',
      orgDescPlaceholder: 'Présentation de votre activité...',
      foundedYear: 'Année de création',
      orgSize: 'Taille de l’Organisation',
      selectSize: 'Sélectionner la taille',
      bannerUrl: 'URL de la bannière',
      industry: 'Secteur d’activité',
      logoUrl: 'URL du logo',
      contactPhone: 'Téléphone de l’Organisation',
      wilaya: 'Région / Wilaya / Province',
      selectWilaya: 'Sélectionner la région',
      contactEmail: 'Email de contact',
      website: 'Site web',
      district: 'Ville / District',
      longitude: 'Longitude',
      latitude: 'Latitude',
      socialLinks: 'Réseaux sociaux',
      createAccountBtn: 'Créer le compte',
      employeeNumber: 'Matricule Employé',
      inviteCode: 'Code d’invitation',
      verifyInvite: 'Vérification du code...',
      inviteValid: 'Code d’invitation validé !',
      inviteInvalid: 'Code d’invitation invalide',
      selectDept: 'Sélectionner le département',
      accountCreated: 'Compte créé avec succès !',
      redirecting: 'Redirection vers votre tableau de bord...',
      continueWithGoogle: 'Continuer avec Google',
      signUpWithGoogle: 'S’inscrire avec Google',
      orContinueWithEmail: 'ou continuer par email'
    },
    dashboard: {
      title: 'TABLEAU DE BORD',
      overview: 'Vue d’ensemble',
      departments: 'Départements',
      hazardChecklist: 'Liste des Risques',
      observations: 'Observations',
      recommendations: 'Recommandations IA',
      reports: 'Rapports',
      myAccount: 'Mon Compte',
      logout: 'Déconnexion',
      onboardingTitle: 'GUIDE DE DÉMARRAGE',
      welcome: 'Bienvenue sur ErgonoAI',
      onboardingDesc: 'Configurez votre espace en trois étapes simples pour lancer vos premières évaluations et détecter les risques ergonomiques.',
      stepDeptsTitle: '1. Départements',
      stepDeptsDesc: 'Définissez les départements pour regrouper vos équipes.',
      stepDeptsAction: 'Configurer les espaces',
      stepInviteTitle: '2. Inviter les équipes',
      stepInviteDesc: 'Générez des codes d’invitation pour vos collaborateurs.',
      stepInviteAction: 'Inviter les employés',
      stepSurveyTitle: '3. Lancer une campagne',
      stepSurveyDesc: 'Démarrez une évaluation ergonomique conforme ISO.',
      stepSurveyAction: 'Lancer la campagne',
    },
    profile: {
      pageTitle: 'Paramètres & Profil de l’Organisation',
      pageSubtitle: 'Gérez les informations, les préférences et les invitations des collaborateurs',
      backToDashboard: 'Retour au tableau de bord',
      saveChanges: 'Enregistrer les modifications',
      saving: 'Enregistrement...',
      changesSaved: 'Modifications enregistrées',
      clickToUploadBanner: 'Cliquer pour modifier la bannière',
      changeBanner: 'Modifier la bannière',
      logoLabel: 'Logo',
      logoUrlBtn: 'URL du Logo',
      bannerUrlBtn: 'URL de la Bannière',
      noDescription: 'Aucune description renseignée.',
      enterLogoUrl: 'Entrez l’URL de l’image du logo :',
      enterBannerUrl: 'Entrez l’URL de l’image de la bannière :',
      tabIdentity: 'Identité',
      tabLocation: 'Localisation & Contact',
      tabAdmin: 'Administrateur & Réseaux',
      tabSettings: 'Inscriptions & Paramètres',
      orgName: 'Nom de l’Organisation *',
      description: 'Description',
      descPlaceholder: 'Décrivez l’activité et la mission de votre organisation...',
      industry: 'Secteur d’activité',
      industryPlaceholder: 'ex. Industrie, Logistique, Santé, Services',
      orgSize: 'Taille de l’Organisation',
      selectSize: 'Sélectionner la taille...',
      foundedYear: 'Année de création',
      contactEmail: 'Email de contact',
      contactPhone: 'Téléphone de contact',
      websiteUrl: 'Site Web',
      wilaya: 'Région / Wilaya *',
      selectWilaya: 'Sélectionner la région...',
      district: 'Ville / District *',
      coordPicker: 'Coordonnées géographiques',
      searchPlaceholder: 'Rechercher une adresse...',
      findBtn: 'Rechercher',
      latitude: 'Latitude',
      longitude: 'Longitude',
      adminProfile: 'Profil Administrateur',
      firstName: 'Prénom',
      lastName: 'Nom',
      adminPhone: 'Téléphone personnel',
      loginEmail: 'Email de connexion (Lecture seule)',
      preferredLanguage: 'Langue préférée',
      securityPassword: 'Sécurité & Mot de passe',
      currentPassword: 'Mot de passe actuel',
      newPassword: 'Nouveau mot de passe',
      confirmNewPassword: 'Confirmer le nouveau mot de passe',
      updatePasswordBtn: 'Mettre à jour le mot de passe',
      updating: 'Mise à jour...',
      passwordUpdated: 'Mot de passe mis à jour avec succès !',
      socialMedia: 'Liens réseaux sociaux',
      platformCustomization: 'Personnalisation de la plateforme',
      inviteSystem: 'Système d’invitations des équipes',
      inviteSystemDesc: 'Générez des codes d’invitation pour intégrer facilement vos collaborateurs dans leurs départements.',
      generateCode: 'Générer un code d’inscription',
      targetRole: 'Rôle cible',
      targetSite: 'Site cible (Optionnel)',
      allSites: 'Tous les sites',
      maxUses: 'Limite d’utilisations',
      expiryDate: 'Date d’expiration',
      generateBtn: 'Générer le code',
      activeCodes: 'Codes d’invitation actifs',
      noCodesYet: 'Aucun code d’invitation généré pour le moment.',
      dept: 'Dép.',
      site: 'Site',
      uses: 'Utilisations',
      expires: 'Expire le',
      all: 'Tous',
      copyCode: 'Copier le code',
      revokeCode: 'Révoquer le code',
      yourOrg: 'Votre Organisation',
    },
    auth: {
      signInTitle: 'Connexion à votre compte',
      dontHaveAccount: 'Vous n’avez pas de compte ?',
      signUp: 'S’inscrire',
      emailAddress: 'Adresse email',
      forgotPassword: 'Mot de passe oublié ?',
      password: 'Mot de passe',
      signIn: 'Se connecter',
      backToLanding: 'Retour à l’accueil',
      enterpriseErgonomics: 'Ergonomie au travail d’entreprise',
      heroSubtitle: 'Renforcez vos équipes avec des évaluations intelligentes, une gestion proactive des risques et des indicateurs de santé concrets.',
      alreadySignedIn: 'Déjà connecté',
      signedInAs: 'Vous êtes actuellement connecté en tant que',
      goDashboard: 'Accéder au tableau de bord',
      completeOnboarding: 'Compléter l’intégration',
      signOutAnother: 'Se déconnecter / Utiliser un autre compte',
      continueWithGoogle: 'Continuer avec Google',
      orContinueWithEmail: 'ou continuer par email',
    },
    employee: {
      private: 'Confidentiel',
      logout: 'Déconnexion',
      back: 'Retour',
      personalProfile: 'Profil Personnel',
      hi: 'Bonjour',
      completeProfileTitle: 'complétez votre profil pour commencer',
      updateProfileTitle: 'Mettre à jour vos informations de profil',
      profileIntroDesc: 'Ces informations nous permettent de contextualiser vos résultats d’évaluation ergonomique. Elles sont strictement confidentielles et ne sont jamais partagées de manière nominative avec votre employeur.',
      fullName: 'Nom et prénom',
      workPosition: 'Poste de travail',
      gender: 'Genre',
      maritalStatus: 'État civil',
      dateOfBirth: 'Date de naissance',
      placeOfBirth: 'Lieu de naissance',
      height: 'Taille (cm)',
      weight: 'Poids (kg)',
      yearsWorking: 'Années dans ce poste',
      workingHoursPerDay: 'Heures de travail par jour',
      partTimeJobQuestion: 'Avez-vous une autre activité professionnelle à temps partiel ?',
      male: 'Homme',
      female: 'Femme',
      single: 'Célibataire',
      married: 'Marié(e)',
      divorced: 'Divorcé(e)',
      widowed: 'Veuf / Veuve',
      yes: 'Oui',
      no: 'Non',
      saveChanges: 'Enregistrer les modifications',
      completeProfileBtn: 'Valider le profil',
      namePlaceholder: 'ex. Jean Dupont',
      positionPlaceholder: 'ex. Ingénieur de maintenance, Opérateur',
      birthPlacePlaceholder: 'ex. Paris, Alger, Lyon',
      selectGender: 'Sélectionner le genre',
      selectStatus: 'Sélectionner l’état civil',
      required: 'Obligatoire',
      assessmentReview: 'Récapitulatif de l’évaluation',
      readOnlyWarning: 'Ce formulaire a été soumis. Les réponses sont en lecture seule et ne peuvent plus être modifiées.',
      noDetailedAnswers: 'Formulaire archivé — les réponses détaillées ne sont pas disponibles.',
      close: 'Fermer',
      submittedForm: 'Formulaire d’évaluation',
      submittedStatus: 'Soumis',
      submittedAt: 'soumis le',
      questionsCount: 'questions',
      reviewBtn: 'Consulter',
      noteModalTitle: 'Signaler un inconfort ergonomique',
      noteModalDesc: 'Partagez toute douleur, inconfort ou observation liée à votre poste. Vos remarques seront traitées de manière totalement anonyme.',
      notePlaceholder: 'Écrivez votre observation ou remarque ici...',
      submitBtn: 'Envoyer l’observation',
      welcomeGreeting: 'Ravi de vous revoir,',
      ergonomicDashboard: 'Votre Espace Bien-être & Ergonomie',
      activeCampaignTitle: 'Évaluation ergonomique requise',
      activeCampaignDesc: 'Une campagne d’évaluation de la santé et du confort au poste a été lancée par votre organisation :',
      inProgressText: 'Vous avez un questionnaire en cours.',
      resumeBtn: 'Reprendre l’évaluation',
      startBtn: 'Démarrer l’évaluation',
      recentSubmissions: 'Soumissions récentes',
      noSubmissionsYet: 'Aucune évaluation soumise pour le moment. Lorsque vous en terminez une, elle apparaîtra ici.',
      quickActions: 'Actions rapides',
      reportConcern: 'Signaler un inconfort',
      reportConcernDesc: 'Signalez une gêne physique ou un problème ergonomique sur votre poste.',
      myProfile: 'Mon Profil',
      myProfileDesc: 'Gérez vos données personnelles et vos paramètres de compte.',
      privacyBanner: 'Garantie de confidentialité',
      privacyBannerDesc: 'Vos réponses individuelles et scores bruts sont strictement confidentiels. La direction RH ne consulte que des données agrégées anonymisées.',
      privacyGuaranteed: 'Confidentialité totale',
      privacyGuaranteedDesc: 'Vos réponses sont anonymisées et regroupées pour préserver votre vie privée.',
      requiredStep: 'Étape obligatoire',
      requiredStepDesc: 'Conformément aux directives de sécurité, veuillez compléter cette évaluation.',
      startAssessmentNow: 'Démarrer l’évaluation maintenant',
      writeANote: 'Ajouter une note',
      noActiveCampaigns: 'Aucune campagne d’évaluation n’est actuellement requise. Vous serez notifié ici lors du prochain cycle !',
      pastAssessments: 'Évaluations passées',
      noAssessmentsYet: 'Aucune évaluation pour l’instant',
      startFirstAssessment: 'Démarrez votre première évaluation ci-dessus.',
      notesSent: 'Remarques envoyées',
      sentAnonymously: 'Transmis anonymement',
      previous: 'Précédent',
      next: 'Suivant',
      reviewAnswers: 'Vérifier mes réponses',
      addNote: 'Ajouter une note',
      page: 'Page',
      of: 'sur',
      answered: 'répondu(es)',
      reviewTitle: 'Vérifiez vos réponses',
      reviewDesc: 'Relisez vos réponses ci-dessous. Vous pouvez modifier chaque réponse avant la soumission définitive.',
      backToQuestions: 'Retour aux questions',
      edit: 'Modifier',
      cancel: 'Annuler',
      save: 'Enregistrer',
      noteOptional: 'Remarque (optionnel)...',
      rating: 'Note',
      submitAssessment: 'Soumettre l’évaluation'
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
      aiReady: 'توصيات الذكاء الاصطناعي جاهزة',
      iso7730Explanation: 'معيار ISO 7730 هو المعيار الدولي للهندسة البشرية لتقييم الراحة الحرارية والإجهاد البيئي في مكان العمل (مؤشر PMV/PPD). يدمج إرجونو أيه آي معايير ISO 7730 لمنع الإجهاد البدني وإرهاق الجلسة في الوقت الفعلي.',
      companyHealthExplanation: 'مؤشر صحة الشركة هو نتيجة السلامة المجمعة والتراكمية في الوقت الفعلي. يتابع انخفاض مخاطر الجهاز العضلي الهيكلي، تحسينات وضعية الجلوس، ومعدلات امتثال الأقسام عبر المؤسسة.',
      hoverForDetails: 'حرك المؤشر للتفاصيل',
      ergonoaiWord: 'إرجونو أيه آي'
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
        { num: '1', title: 'إنشاء المؤسسة', desc: 'قم بإعداد شركتك، الأقسام، ومواقع العمل المختلفة.' },
        { num: '2', title: 'دعوة الموظفين', desc: 'أضف فريقك بسرعة باستخدام رموز دعوة مخصصة لكل قسم.' },
        { num: '3', title: 'بدء التقييمات', desc: 'أطلق استبيانات أرغونومية متخصصة ومبنية على الأدوار الوظيفية.' },
        { num: '4', title: 'تحليل الذكاء الاصطناعي', desc: 'يحسب محركنا فوراً درجات الخطورة ويكتشف نقاط الإجهاد.' },
        { num: '5', title: 'تحسين بيئة العمل', desc: 'نفّذ الإجراءات والتوصيات التصحيحية المقترحة بالذكاء الاصطناعي.' }
      ]
    },
    aiSpotlight: {
      title: 'تعرف على خبير الأرغونوميا بالذكاء الاصطناعي',
      desc: 'اطرح الأسئلة، واحصل على رؤى فورية، وأتمت عملية اكتشاف المخاطر.',
      copilotTitle: 'مساعد إرجونو أيه آي',
      userQuery: 'أظهر الأقسام التي تسجل أعلى مخاطر أرغونومية حالياً.',
      aiIntro: 'إليك الأقسام ذات أعلى درجات المخاطر الأرغونومية استناداً إلى أحدث التقييمات المكتملة:',
      riskLabel: 'المخاطر ٨٤٪',
      issuesTitle: 'خط الإنتاج أ',
      primaryIssue: 'المشكلة الأساسية',
      primaryIssueVal: 'إضاءة غير كافية ووهج بصري',
      secondaryIssue: 'المشكلة الثانوية',
      secondaryIssueVal: 'انحناء مستمر في الرقبة',
      impact: 'الأثر المترتب',
      impactVal: 'معدل بلاغات مرتفع عن آلام العنق',
      aiFooter: 'تمت صياغة الإجراءات التصحيحية الموصى بها وهي بانتظار موافقتك في لوحة الإجراءات.'
    },
    dashboardPreview: {
      title: 'رؤى متقدمة على مستوى المؤسسة',
      desc: 'راقب مؤسستك بالكامل من لوحة تحكم واحدة شاملة وسهلة الاستخدام.'
    },
    statistics: {
      items: [
        { label: 'متوسط خفض المخاطر' },
        { label: 'تقييمات مكتملة' },
        { label: 'دقة وتطابق الذكاء الاصطناعي' },
        { label: 'مؤسسات وشركات مستفيدة' }
      ]
    },
    pricing: {
      title: 'خطط أسعار واضحة ومرنة',
      desc: 'اختر الخطة التي تناسب احتياجات مؤسستك وحجم فريقك بدقة.',
      mostPopular: 'الأكثر طلباً',
      period: '/شهرياً',
      tiers: [
        {
          name: 'المجانية',
          price: '٠$',
          desc: 'مثالية لاستكشاف ميزات المنصة الأساسية.',
          features: ['حتى ١٠ موظفين', 'تقييمات قياسية (RULA, REBA)', 'تحليلات لوحة التحكم الأساسية', 'دعم عبر البريد الإلكتروني'],
          cta: 'ابدأ مجاناً'
        },
        {
          name: 'الاحترافية',
          price: '٤٩$',
          desc: 'كل ما تحتاجه للفرق والشركات المتنامية.',
          features: ['حتى ١٠٠ موظف', 'تحليلات بيئة العمل بالذكاء الاصطناعي', 'منشئ التقييمات المخصص', 'تتبع خطط الإجراءات التصحيحية', 'دعم فني ذو أولوية'],
          cta: 'ابدأ التجربة المجانية'
        },
        {
          name: 'المؤسسات الكبرى',
          price: 'مخصص',
          desc: 'أمان متقدم وتكامل واسع النطاق.',
          features: ['عدد موظفين غير محدود', 'مواقع وفروع وأقسام متعددة', 'واجهة API وتسجيل دخول موحد SSO', 'مدير حساب مخصص', 'تدريب مخصص لنموذج الذكاء الاصطناعي'],
          cta: 'تواصل مع المبيعات'
        }
      ]
    },
    faq: {
      title: 'الأسئلة الشائعة',
      items: [
        {
          q: 'كيف يعمل التقييم بالذكاء الاصطناعي؟',
          a: 'يقوم نظامنا بتحليل الاستبيانات المكتملة وعوامل الإضاءة والجلوس وحساب درجات المخاطر بدقة استناداً إلى المعايير العالمية مثل ISO 7730 و REBA.'
        },
        {
          q: 'هل بيانات موظفينا محمية وآمنة؟',
          a: 'نعم، إرجونو أيه آي متوافق بالكامل مع معايير حماية البيانات GDPR، ويعتمد التشفير الكامل، ولا يستخدم بياناتكم الصحية الخاصة لتدريب نماذج خارجية.'
        },
        {
          q: 'هل يمكننا الربط مع أنظمة الموارد البشرية الحالية؟',
          a: 'يمكن لعملاء خطة المؤسسات استخدام واجهة برمجة التطبيقات API لمزامنة هياكل الأقسام والموظفين مع برامج HRIS الرائدة مثل Workday و BambooHR.'
        },
        {
          q: 'هل توفرون تقييمات واستبيانات مخصصة؟',
          a: 'نعم، يتيح لك منشئ التقييمات تصميم استبيانات مخصصة ومنطق حساب درجات متوافق تماماً مع مخاطر بيئة العمل في قطاعك.'
        }
      ]
    },
    footer: {
      ctaTitle: 'جاهز لبناء بيئة عمل أكثر راحة وأماناً؟',
      ctaSub: 'انضم إلى الشركات الرائدة التي تستخدم الذكاء الاصطناعي لحماية أثمن أصولها — الموظفين.',
      footerDesc: 'هندسة بيئة العمل والسلامة المهنية المدعومة بالذكاء الاصطناعي. الوقاية من الإصابات قبل وقوعها.',
      copyright: '© ٢٠٢٦ إرجونو أيه آي، جميع الحقوق محفوظة.',
      product: 'المنتج',
      resources: 'المصادر',
      organization: 'المؤسسة',
      links: {
        features: 'المميزات',
        integrations: 'التكاملات',
        pricing: 'الأسعار',
        changelog: 'سجل التحديثات',
        documentation: 'التوثيق والدليل',
        blog: 'المدونة',
        standards: 'معايير الأرغونوميا',
        caseStudies: 'دراسات الحالة',
        about: 'من نحن',
        privacy: 'سياسة الخصوصية',
        terms: 'شروط الاستخدام',
        contact: 'اتصل بنا'
      }
    },
    login: {
      subtitle: 'سجل الدخول للوصول إلى بوابة الصحة والسلامة وبيئة العمل',
      destinationTitle: 'اختر بوابتك لتسجيل الدخول',
      employeePortal: 'بوابة الموظف',
      employeePortalDesc: 'لأعضاء الفريق والموظفين. الوصول إلى التقييمات الفردية الخاصة، متابعة السجل الصحي، وإرسال ملاحظات المخاطر.',
      orgPortal: 'بوابة المؤسسة',
      orgPortalDesc: 'لمدراء الموارد البشرية والإدارة. إدارة الأقسام، مراجعة قوائم التحقق، والاطلاع على تقارير وتحليلات الذكاء الاصطناعي.',
      logIn: 'تسجيل الدخول',
      personalSpace: 'المساحة الشخصية',
      orgDashboard: 'لوحة تحكم المؤسسة',
      dontHaveAccount: 'ليس لديك حساب بعد؟'
    },
    loginEmployee: {
      portal: 'بوابة الموظف',
      signInTitle: 'تسجيل الدخول كموظف',
      signInSubtitle: 'الوصول إلى تقييماتك الذاتية الخاصة ولوحة تحكمك',
      emailAddress: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      forgotPassword: 'نسيت كلمة المرور؟',
      rememberMe: 'تذكرني',
      signInButton: 'تسجيل الدخول',
      manageOrgNotice: 'هل تدير مؤسسة أو شركة؟',
    },
    loginOrg: {
      portal: 'بوابة المؤسسة',
      signInTitle: 'تسجيل الدخول لمؤسستك',
      signInSubtitle: 'إدارة بيئة العمل وقوائم التحقق والسلامة المهنية',
      emailAddress: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      forgotPassword: 'نسيت كلمة المرور؟',
      rememberMe: 'تذكرني',
      signInButton: 'تسجيل الدخول',
      employeeNotice: 'هل أنت موظف؟',
    },
    roleSelect: {
      subtitle: 'منصة الصحة المهنية وبيئة العمل الذكية لمؤسسات منطقة الشرق الأوسط وشمال إفريقيا',
      title: 'حدد دورك للمتابعة',
      employee: 'موظف',
      employeeDesc: 'أكمل تقييماتك الذاتية الخاصة، وتابع سلامتك البدنية، وأبلغ عن ملاحظات المخاطر.',
      hrManager: 'مؤسسة / موارد بشرية',
      hrManagerDesc: 'أدر مساحات الأقسام، وراجع بيانات الراحة العامة، وقوائم المخاطر، والتوصيات المقترحة بالذكاء الاصطناعي.',
      employeeFeatures: [
        'تقييم ذاتي خاص وسري',
        'خريطة جسدية تفاعلية',
        'سجل الدرجات الشخصي',
        'تقارير ملاحظات المخاطر'
      ],
      hrFeatures: [
        'نظرة شاملة على مستوى الشركة',
        'قائمة فحص مخاطر المنشأة والمواقع',
        'محرك التوصيات الذكية',
        'تقارير امتثال قابلة للتصدير'
      ],
      privacyTitle: 'الخصوصية بالتصميم.',
      privacyDesc: 'ردود الموظفين الفردية لا تظهر للإدارة أبداً. يتم مشاركة الإحصائيات المجمعة والمجهولة فقط.',
    },
    signup: {
      createAccount: 'إنشاء حساب جديد',
      alreadyHaveAccount: 'هل لديك حساب بالفعل؟',
      orgReg: 'تسجيل مؤسسة / شركة',
      orgRegDesc: 'إنشاء ملف تعريف جديد للمؤسسة وبيانات الدخول',
      empReg: 'تسجيل موظف',
      empRegDesc: 'الانضمام إلى مؤسسة موجودة عبر رمز الدعوة',
      switchToEmployee: 'التحويل إلى موظف',
      switchToAdmin: 'التحويل إلى مؤسسة',
      stepAdminDetails: '١. بيانات دخول المشرف',
      stepOrgCredentials: '١. بيانات حساب المؤسسة',
      stepOrgIdentity: '٢. هوية المؤسسة والنشاط',
      stepEmpDetails: '٢. بيانات الموظف',
      firstName: 'الاسم الأول',
      lastName: 'اسم العائلة',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      phone: 'رقم الهاتف الشخصي',
      lang: 'لغة الواجهة',
      gdprNotice: 'بالتسجيل، أنت توافق على سياسة بيانات الصحة المتوافقة مع GDPR. درجات راحتك الفردية تظل سرية تماماً.',
      nextOrgInfo: 'التالي: معلومات المؤسسة',
      nextEmpDetails: 'التالي: بيانات الموظف',
      nextContactLocation: 'التالي: الاتصال والموقع',
      back: 'رجوع',
      orgName: 'اسم المؤسسة',
      orgNamePlaceholder: 'مثال: سوناطراك، أوريدو',
      orgDesc: 'وصف المؤسسة',
      orgDescPlaceholder: 'نبذة موجزة عن المؤسسة ونشاطها...',
      foundedYear: 'سنة التأسيس',
      orgSize: 'حجم المؤسسة',
      selectSize: 'اختر الحجم',
      bannerUrl: 'رابط صورة الغلاف',
      industry: 'مجال العمل / القطاع',
      logoUrl: 'رابط الشعار',
      contactPhone: 'هاتف المؤسسة',
      wilaya: 'الولاية / المنطقة',
      selectWilaya: 'اختر الولاية',
      contactEmail: 'البريد الإلكتروني للمؤسسة',
      website: 'الموقع الإلكتروني',
      district: 'الدائرة / البلدية / المدينة',
      longitude: 'خط الطول',
      latitude: 'خط العرض',
      socialLinks: 'روابط التواصل الاجتماعي',
      createAccountBtn: 'إنشاء الحساب',
      employeeNumber: 'الرقم الوظيفي',
      inviteCode: 'رمز الدعوة',
      verifyInvite: 'جاري التحقق من الرمز...',
      inviteValid: 'تم التحقق من صحة رمز الدعوة!',
      inviteInvalid: 'رمز الدعوة غير صالح',
      selectDept: 'اختر القسم',
      accountCreated: 'تم إنشاء الحساب بنجاح!',
      redirecting: 'جاري توجيهك إلى لوحة التحكم...',
      continueWithGoogle: 'المتابعة باستخدام Google',
      signUpWithGoogle: 'التسجيل باستخدام Google',
      orContinueWithEmail: 'أو المتابعة بالبريد الإلكتروني'
    },
    dashboard: {
      title: 'لوحة التحكم',
      overview: 'نظرة عامة',
      departments: 'الأقسام والمساحات',
      hazardChecklist: 'قائمة فحص المخاطر',
      observations: 'الملاحظات والبلاغات',
      recommendations: 'توصيات الذكاء الاصطناعي',
      reports: 'التقارير والإحصاءات',
      myAccount: 'حسابي',
      logout: 'تسجيل الخروج',
      onboardingTitle: 'دليل البدء السريع',
      welcome: 'مرحباً بك في إرجونو أيه آي',
      onboardingDesc: 'قم بتهيئة مساحة عملك في ثلاث خطوات سهلة لبدء تحليل الراحة واكتشاف مؤشرات السلامة الأرغونومية.',
      stepDeptsTitle: '١. الأقسام والمساحات',
      stepDeptsDesc: 'أنشئ أقسام العمل المختلفة لتجميع الموظفين.',
      stepDeptsAction: 'تهيئة الأقسام',
      stepInviteTitle: '٢. دعوة الموظفين',
      stepInviteDesc: 'أنشئ المواقع وولد رموز الدعوة لفريقك.',
      stepInviteAction: 'دعوة الموظفين',
      stepSurveyTitle: '٣. إطلاق حملة التقييم',
      stepSurveyDesc: 'ابدأ تقييماً أرغونومياً متوافقاً مع معايير ISO.',
      stepSurveyAction: 'إطلاق الحملة',
    },
    profile: {
      pageTitle: 'إعدادات وملف تعريف المؤسسة',
      pageSubtitle: 'إدارة بيانات المؤسسة، تفضيلات المنصة، ورموز دعوة الموظفين',
      backToDashboard: 'العودة للوحة التحكم',
      saveChanges: 'حفظ التعديلات',
      saving: 'جاري الحفظ...',
      changesSaved: 'تم حفظ التعديلات',
      clickToUploadBanner: 'انقر لتعديل صورة الغلاف',
      changeBanner: 'تغيير الغلاف',
      logoLabel: 'الشعار',
      logoUrlBtn: 'رابط الشعار',
      bannerUrlBtn: 'رابط الغلاف',
      noDescription: 'لم يتم إضافة وصف بعد.',
      enterLogoUrl: 'أدخل رابط صورة الشعار:',
      enterBannerUrl: 'أدخل رابط صورة الغلاف:',
      tabIdentity: 'الهوية والنشاط',
      tabLocation: 'الموقع والاتصال',
      tabAdmin: 'المشرف والتواصل',
      tabSettings: 'الانضمام والإعدادات',
      orgName: 'اسم المؤسسة *',
      description: 'الوصف',
      descPlaceholder: 'صف رؤية ونشاط مؤسستك...',
      industry: 'مجال العمل',
      industryPlaceholder: 'مثال: التصنيع، الخدمات اللوجستية، التكنولوجيا',
      orgSize: 'حجم المؤسسة',
      selectSize: 'اختر الحجم...',
      foundedYear: 'سنة التأسيس',
      contactEmail: 'البريد الإلكتروني للاتصال',
      contactPhone: 'هاتف الاتصال',
      websiteUrl: 'الموقع الإلكتروني',
      wilaya: 'الولاية / المنطقة *',
      selectWilaya: 'اختر الولاية...',
      district: 'الدائرة / المدينة *',
      coordPicker: 'الإحداثيات وتحديد الموقع',
      searchPlaceholder: 'ابحث عن موقع على الخريطة...',
      findBtn: 'بحث',
      latitude: 'خط العرض',
      longitude: 'خط الطول',
      adminProfile: 'الملف الشخصي للمسؤول',
      firstName: 'الاسم الأول',
      lastName: 'اسم العائلة',
      adminPhone: 'الهاتف الشخصي للمسؤول',
      loginEmail: 'البريد الإلكتروني لتسجيل الدخول (للقراءة فقط)',
      preferredLanguage: 'اللغة المفضلة',
      securityPassword: 'الأمان وكلمة المرور',
      currentPassword: 'كلمة المرور الحالية',
      newPassword: 'كلمة المرور الجديدة',
      confirmNewPassword: 'تأكيد كلمة المرور الجديدة',
      updatePasswordBtn: 'تحديث كلمة المرور',
      updating: 'جاري التحديث...',
      passwordUpdated: 'تم تحديث كلمة المرور بنجاح!',
      socialMedia: 'روابط التواصل الاجتماعي',
      platformCustomization: 'تخصيص المنصة',
      inviteSystem: 'نظام الدعوات والانضمام',
      inviteSystemDesc: 'إنشاء رموز تسجيل للموظفين والإداريين للانضمام إلى مساحة عملك بسهولة.',
      generateCode: 'إنشاء رمز تسجيل جديد',
      targetRole: 'الدور المستهدف',
      targetSite: 'الموقع المستهدف (اختياري)',
      allSites: 'جميع المواقع',
      maxUses: 'الحد الأقصى للاستخدام',
      expiryDate: 'تاريخ انتهاء الصلاحية',
      generateBtn: 'توليد رمز الدعوة',
      activeCodes: 'رموز وروابط الدعوة النشطة',
      noCodesYet: 'لا توجد رموز دعوة نشطة حالياً.',
      dept: 'القسم',
      site: 'الموقع',
      uses: 'الاستخدام',
      expires: 'ينتهي في',
      all: 'الكل',
      copyCode: 'نسخ الرمز',
      revokeCode: 'إلغاء الرمز',
      yourOrg: 'مؤسستك',
    },
    auth: {
      signInTitle: 'تسجيل الدخول إلى حسابك',
      dontHaveAccount: 'ليس لديك حساب بعد؟',
      signUp: 'إنشاء حساب جديد',
      emailAddress: 'البريد الإلكتروني',
      forgotPassword: 'نسيت كلمة المرور؟',
      password: 'كلمة المرور',
      signIn: 'دخول',
      backToLanding: 'العودة للصفحة الرئيسية',
      enterpriseErgonomics: 'هندسة بيئة العمل وسلامة المؤسسات',
      heroSubtitle: 'ارتقِ ببيئة العمل من خلال التقييمات الذكية، الإدارة الوقائية للمخاطر، والرؤى الصحية الفعالة.',
      alreadySignedIn: 'أنت مسجل الدخول بالفعل',
      signedInAs: 'أنت مسجل الدخول حالياً باسم',
      goDashboard: 'الذهاب إلى لوحة التحكم',
      completeOnboarding: 'استكمال إعداد الحساب',
      signOutAnother: 'تسجيل الخروج / استخدام حساب آخر',
      continueWithGoogle: 'المتابعة باستخدام Google',
      orContinueWithEmail: 'أو المتابعة بالبريد الإلكتروني',
    },
    employee: {
      private: 'خاص وسري',
      logout: 'تسجيل الخروج',
      back: 'رجوع',
      personalProfile: 'الملف الشخصي',
      hi: 'مرحباً',
      completeProfileTitle: 'يرجى إكمال ملفك الشخصي للبدء',
      updateProfileTitle: 'تحديث بيانات ملفك الشخصي',
      profileIntroDesc: 'تساعدنا هذه المعلومات على فهم نتائج تقييمك بشكل أفضل. يتم تخزينها بأمان وسرية ولن تتم مشاركتها بشكل فردي مع صاحب العمل.',
      fullName: 'الاسم الكامل',
      workPosition: 'المسمى الوظيفي',
      gender: 'الجنس',
      maritalStatus: 'الحالة الاجتماعية',
      dateOfBirth: 'تاريخ الميلاد',
      placeOfBirth: 'مكان الميلاد',
      height: 'الطول (سم)',
      weight: 'الوزن (كغ)',
      yearsWorking: 'سنوات العمل في هذا الدور',
      workingHoursPerDay: 'ساعات العمل اليومية',
      partTimeJobQuestion: 'هل تعمل في وظيفة أخرى بدوام جزئي بالإضافة إلى هذه الوظيفة؟',
      male: 'ذكر',
      female: 'أنثى',
      single: 'أعزب / عزباء',
      married: 'متزوج / متزوجة',
      divorced: 'مطلق / مطلقة',
      widowed: 'أرمل / أرملة',
      yes: 'نعم',
      no: 'لا',
      saveChanges: 'حفظ التعديلات',
      completeProfileBtn: 'إكمال الملف والبدء',
      namePlaceholder: 'مثال: محمد علي',
      positionPlaceholder: 'مثال: مهندس صيانة، محاسب',
      birthPlacePlaceholder: 'مثال: الجزائر العاصمة',
      selectGender: 'اختر الجنس',
      selectStatus: 'اختر الحالة الاجتماعية',
      required: 'مطلوب',
      assessmentReview: 'مراجعة التقييم',
      readOnlyWarning: 'تم إرسال هذا النموذج بنجاح. الإجابات للقراءة فقط ولا يمكن تعديلها.',
      noDetailedAnswers: 'نموذج تاريخي — التفاصيل الدقيقة غير مخزنة.',
      close: 'إغلاق',
      submittedForm: 'نموذج التقييم',
      submittedStatus: 'تم الإرسال',
      submittedAt: 'تاريخ التقديم',
      questionsCount: 'سؤال',
      reviewBtn: 'مراجعة',
      noteModalTitle: 'إبلاغ عن انزعاج أو مشكلة أرغونومية',
      noteModalDesc: 'شارك أي ألم، إجهاد، أو ملاحظة حول بيئة عملك مباشرة. سيتم التعامل مع ملاحظاتك بسرية تامة دون كشف هويتك.',
      notePlaceholder: 'اكتب ملاحظتك أو استفسارك هنا...',
      submitBtn: 'إرسال الملاحظة',
      welcomeGreeting: 'أهلاً بك مجدداً،',
      ergonomicDashboard: 'لوحة متابعة الراحة والسلامة البدنية',
      activeCampaignTitle: 'تقييم بيئة العمل مطلوب',
      activeCampaignDesc: 'تم إطلاق حملة تقييم نشطة لبيئة العمل والسلامة من قِبل مسؤول الموارد البشرية:',
      inProgressText: 'لديك استبيان قيد الإنجاز حالياً.',
      resumeBtn: 'متابعة الاستبيان',
      startBtn: 'بدء التقييم',
      recentSubmissions: 'التقييمات المقدمة مؤخراً',
      noSubmissionsYet: 'لم تقم بتقديم أي تقييمات بعد. عند إكمال أول تقييم، سيظهر هنا.',
      quickActions: 'إجراءات سريعة',
      reportConcern: 'إبلاغ عن انزعاج',
      reportConcernDesc: 'أبلغ عن أي إجهاد عضلي أو مشاكل في تصميم مكان عملك.',
      myProfile: 'إعدادات ملفي الشخصي',
      myProfileDesc: 'إدارة القياسات البدنية وإعدادات الحساب.',
      privacyBanner: 'إشعار الخصوصية والأمان',
      privacyBannerDesc: 'إجاباتك الفردية سرية بالكامل. يمكن للإدارة الاطلاع على النتائج المجمعة والمجهولة فقط لتطوير بيئة العمل.',
      privacyGuaranteed: 'خصوصية مضمونة',
      privacyGuaranteedDesc: 'تُجمع الإجابات وتُعالج بسرية تامة دون الإفصاح عن هوية المجيب.',
      requiredStep: 'خطوة إلزامية',
      requiredStepDesc: 'وفقاً لإرشادات السلامة بالشركة، يرجى إكمال هذا التقييم للوصول لكافة الميزات.',
      startAssessmentNow: 'بدء التقييم الآن',
      writeANote: 'كتابة ملاحظة',
      noActiveCampaigns: 'لا توجد حملات تقييم مطلوبة منك حالياً. سنقوم بإشعارك هنا عند بدء الدورة القادمة!',
      pastAssessments: 'التقييمات السابقة',
      noAssessmentsYet: 'لا توجد تقييمات سابقة',
      startFirstAssessment: 'ابدأ تقييمك الأول من الأعلى.',
      notesSent: 'الملاحظات المرسلة',
      sentAnonymously: 'أُرسلت بصفة مجهولة',
      previous: 'السابق',
      next: 'التالي',
      reviewAnswers: 'مراجعة الإجابات',
      addNote: 'إضافة ملاحظة',
      page: 'صفحة',
      of: 'من',
      answered: 'تمت الإجابة',
      reviewTitle: 'راجع إجاباتك قبل الإرسال النهائي',
      reviewDesc: 'تحقق من إجاباتك أدناه. يمكنك تعديل أي إجابة مباشرة قبل الإرسال. بمجرد الإرسال، لا يمكن تعديل الإجابات.',
      backToQuestions: 'العودة للأسئلة',
      edit: 'تعديل',
      cancel: 'إلغاء',
      save: 'حفظ',
      noteOptional: 'ملاحظة (اختياري)...',
      rating: 'التقييم',
      submitAssessment: 'إرسال التقييم النهائي'
    }
  }
}

// ─── Body region translations ───────────────────────────────────────────────

export const bodyRegionMapTranslations: Record<string, Record<Language, string>> = {
  neck: { en: 'Neck', ar: 'العنق / الرقبة', fr: 'Cou / Nuque' },
  shoulders: { en: 'Shoulders', ar: 'الكتفين', fr: 'Épaules' },
  upper_back: { en: 'Upper Back', ar: 'أعلى الظهر', fr: 'Haut du dos' },
  'upper back': { en: 'Upper Back', ar: 'أعلى الظهر', fr: 'Haut du dos' },
  elbows: { en: 'Elbows', ar: 'المرفقين', fr: 'Coudes' },
  wrists_hands: { en: 'Wrists / Hands', ar: 'المعصمين / اليدين', fr: 'Poignets / Mains' },
  'wrists / hands': { en: 'Wrists / Hands', ar: 'المعصمين / اليدين', fr: 'Poignets / Mains' },
  lower_back: { en: 'Lower Back', ar: 'أسفل الظهر', fr: 'Bas du dos / Lombaires' },
  'lower back': { en: 'Lower Back', ar: 'أسفل الظهر', fr: 'Bas du dos / Lombaires' },
  hips_thighs: { en: 'Hips / Thighs', ar: 'الوركين / الفخذين', fr: 'Hanches / Cuisses' },
  'hips / thighs': { en: 'Hips / Thighs', ar: 'الوركين / الفخذين', fr: 'Hanches / Cuisses' },
  knees: { en: 'Knees', ar: 'الركبتين', fr: 'Genoux' },
  ankles_feet: { en: 'Ankles / Feet', ar: 'الكاحلين / القدمين', fr: 'Chevilles / Pieds' },
  'ankles / feet': { en: 'Ankles / Feet', ar: 'الكاحلين / القدمين', fr: 'Chevilles / Pieds' },
}

export function translateBodyRegion(regionKey: string, lang: Language): string {
  const normalized = (regionKey || '').toLowerCase()
  const entry = bodyRegionMapTranslations[normalized]
  if (entry) return entry[lang] || entry.en
  return regionKey
}

// ─── Question Text Translations (NMQ & ISO 7730) ───────────────────────────

export function translateQuestionText(code: string, text: string, category: string, lang: Language): string {
  if (lang === 'en') return text

  const regionAr = translateBodyRegion(category, 'ar')
  const regionFr = translateBodyRegion(category, 'fr')

  if (lang === 'ar') {
    if (code.startsWith('nmq_sum_')) {
      return `خلال الـ 12 شهراً الماضية، هل عانيت من أوجاع، آلام، أو انزعاج في ${regionAr}؟`
    }
    if (code.startsWith('nmq_det_1_')) return `هل سبق لك أن عانيت من أوجاع، آلام، أو انزعاج في ${regionAr}؟`
    if (code.startsWith('nmq_det_2_')) return `هل سبق لك أن أصبت في ${regionAr} نتيجة حادث؟`
    if (code.startsWith('nmq_det_3_')) return `هل اضطررت يوماً إلى تغيير وظيفتك أو مهام عملك بسبب مشاكل في ${regionAr}؟`
    if (code.startsWith('nmq_det_4_')) return `خلال الـ 12 شهراً الماضية، هل عانيت من مشاكل في ${regionAr}؟`
    if (code.startsWith('nmq_det_5_')) return `ما هي المدة الإجمالية التي عانيت فيها من مشاكل في ${regionAr} خلال الـ 12 شهراً الماضية؟`
    if (code.startsWith('nmq_det_6a_')) return `بسبب مشاكل في ${regionAr} خلال الـ 12 شهراً الماضية، هل اضطررت إلى تقليل نشاط عملك أو أنشطتك المنزلية المعتادة؟`
    if (code.startsWith('nmq_det_6b_')) return `بسبب مشاكل في ${regionAr} خلال الـ 12 شهراً الماضية، هل اضطررت إلى تقليل أنشطتك الترفيهية؟`
    if (code.startsWith('nmq_det_7_')) return `خلال الـ 12 شهراً الماضية، ما هي المدة التي منعتك فيها المشاكل في ${regionAr} من أداء أنشطتك المعتادة (العمل أو المنزل)؟`
    if (code.startsWith('nmq_det_8_')) return `خلال الـ 12 شهراً الماضية، هل استشرت طبيباً، معالجاً طبيعياً، أو أخصائي رعاية صحية آخر بسبب مشاكل في ${regionAr}؟`
    if (code.startsWith('nmq_det_9_')) return `هل عانيت من مشكلة في ${regionAr} في أي وقت خلال الـ 7 أيام الماضية؟`

    const isoMapAr: Record<string, string> = {
      iso_1: 'كيف تقيم الراحة الحرارية العامة في مكان عملك؟',
      iso_2: 'هل تشعر عادة بالراحة الحرارية أثناء العمل؟',
      iso_3: 'كم مرة تشعر بالحر الشديد أثناء عملك؟',
      iso_4: 'كم مرة تشعر بالبرد الشديد أثناء عملك؟',
      iso_5: 'هل تظل درجة الحرارة مريحة طوال فترة عملك؟',
      iso_6: 'هل تتغير درجة حرارة مكان العمل بشكل متكرر خلال اليوم؟',
      iso_7: 'كيف تشعر حالياً؟ (الإحساس الحراري)',
      iso_8: 'هل درجة حرارة الهواء مريحة لعملك؟',
      iso_9: 'هل مكان العمل عادة حار جداً؟',
      iso_10: 'هل مكان العمل عادة بارد جداً؟',
      iso_11: 'هل تغيرات درجة الحرارة تشتت انتباهك أثناء العمل؟',
      iso_12: 'هل تشعر بتيارات هوائية غير مرغوب فيها أثناء العمل؟',
      iso_13: 'هل الهواء المنبعث من المراوح أو مكيفات الهواء يسبب لك الإزعاج؟',
      iso_14: 'هل تشعر بالبرد بسبب حركة الهواء؟',
      iso_15: 'هل يصطدم تدفق الهواء بوجهك أو رقبتك بشكل متكرر؟',
      iso_16: 'هل يزعج تدفق الهواء تركيزك؟',
      iso_17: 'هل الهواء جاف جداً؟',
      iso_18: 'هل الهواء رطب جداً؟',
      iso_19: 'هل الرطوبة تسبب لك عدم الراحة؟',
      iso_20: 'هل تشعر بحرارة مفرطة من النوافذ أو أشعة الشمس؟',
      iso_21: 'هل تشعر بحرارة مفرطة من الآلات أو المعدات؟',
      iso_22: 'هل النوافذ أو الجدران الباردة تسبب لك عدم الراحة؟',
      iso_23: 'هل الأسقف أو الجدران الساخنة تسبب لك عدم الراحة؟',
      iso_24: 'هل قدماك أبرد من الجزء العلوي من جسمك؟',
      iso_25: 'هل رأسك أدفأ من قدميك؟',
      iso_26: 'هل تلاحظ فروقاً كبيرة في درجات الحرارة بين مستوى الأرض والرأس؟',
      iso_27: 'هل الأرضية باردة جداً؟',
      iso_28: 'هل الأرضية دافئة جداً؟',
      iso_29: 'هل تجعل درجة حرارة الأرضية الوقوف أو المشي غير مريح؟',
      iso_30: 'هل ملابس العمل المعتادة مناسبة لدرجة حرارة مكان العمل؟',
      iso_31: 'هل تحتاج إلى ملابس إضافية لأن مكان العمل بارد جداً؟',
      iso_32: 'هل تخلع بعض الملابس لأن مكان العمل حار جداً؟',
      iso_33: 'هل يجعلك نشاطك البدني تشعر بالحرارة المفرطة؟',
      iso_34: 'هل يتطلب عملك حركة متكررة تؤثر على راحتك الحرارية؟',
      iso_35: 'هل تتناسب درجة حرارة مكان العمل مع المجهود البدني المطلوب لوظيفتك؟',
      iso_36: 'هل البيئة الحرارية تقلل من تركيزك؟',
      iso_37: 'هل الانزعاج الحراري يقلل من إنتاجيتك؟',
      iso_38: 'هل احتجت يوماً إلى التوقف عن العمل بسبب الانزعاج الحراري؟',
      iso_39: 'بشكل عام، ما مدى رضاك عن البيئة الحرارية في مكان عملك؟',
      iso_40: 'ما هي التحسينات التي من شأنها تحسين راحتك الحرارية بشكل أفضل؟',
    }

    return isoMapAr[code] || text
  }

  if (lang === 'fr') {
    if (code.startsWith('nmq_sum_')) {
      return `Au cours des 12 derniers mois, avez-vous ressenti une gêne, une douleur ou un inconfort au niveau : ${regionFr} ?`
    }
    if (code.startsWith('nmq_det_1_')) return `Avez-vous déjà eu des douleurs, courbatures ou gênes au niveau : ${regionFr} ?`
    if (code.startsWith('nmq_det_2_')) return `Avez-vous déjà été blessé(e) au niveau : ${regionFr} lors d’un accident ?`
    if (code.startsWith('nmq_det_3_')) return `Avez-vous déjà dû changer d’emploi ou de poste en raison de problèmes au niveau : ${regionFr} ?`
    if (code.startsWith('nmq_det_4_')) return `Avez-vous eu des problèmes au niveau : ${regionFr} au cours des 12 derniers mois ?`
    if (code.startsWith('nmq_det_5_')) return `Quelle est la durée totale pendant laquelle vous avez souffert au niveau : ${regionFr} au cours des 12 derniers mois ?`
    if (code.startsWith('nmq_det_6a_')) return `Au cours des 12 derniers mois, les douleurs au niveau : ${regionFr} vous ont-elles contraint(e) à réduire votre activité professionnelle ou vos tâches quotidiennes ?`
    if (code.startsWith('nmq_det_6b_')) return `Au cours des 12 derniers mois, ces douleurs au niveau : ${regionFr} ont-elles limité vos activités de loisirs ?`
    if (code.startsWith('nmq_det_7_')) return `Au cours des 12 derniers mois, pendant combien de temps les douleurs au niveau : ${regionFr} vous ont-elles empêché(e) d’accomplir votre travail habituel ?`
    if (code.startsWith('nmq_det_8_')) return `Avez-vous consulté un médecin, kinésithérapeute ou autre professionnel de santé pour des problèmes au niveau : ${regionFr} au cours des 12 derniers mois ?`
    if (code.startsWith('nmq_det_9_')) return `Avez-vous ressenti une gêne ou douleur au niveau : ${regionFr} au cours des 7 derniers jours ?`

    const isoMapFr: Record<string, string> = {
      iso_1: 'Comment évaluez-vous le confort thermique global de votre espace de travail ?',
      iso_2: 'Vous sentez-vous généralement à l’aise avec la température pendant votre travail ?',
      iso_3: 'À quelle fréquence avez-vous trop chaud pendant vos heures de travail ?',
      iso_4: 'À quelle fréquence avez-vous trop froid pendant vos heures de travail ?',
      iso_5: 'La température reste-t-elle confortable tout au long de votre journée de travail ?',
      iso_6: 'La température de votre espace de travail varie-t-elle fréquemment au cours de la journée ?',
      iso_7: 'Que ressentez-vous actuellement ? (Sensation thermique)',
      iso_8: 'La température de l’air est-elle adaptée au type de travail que vous effectuez ?',
      iso_9: 'Votre espace de travail est-il habituellement trop chaud ?',
      iso_10: 'Votre espace de travail est-il habituellement trop froid ?',
      iso_11: 'Les fluctuations de température perturbent-elles votre concentration au travail ?',
      iso_12: 'Ressentez-vous des courants d’air indésirables pendant votre travail ?',
      iso_13: 'L’air provenant des ventilateurs ou de la climatisation vous dérange-t-il ?',
      iso_14: 'Ressentez-vous une sensation de froid due au déplacement de l’air ?',
      iso_15: 'Le flux d’air atteint-il fréquemment votre cou, tête ou visage ?',
      iso_16: 'La vitesse de l’air ou les courants d’air perturbent-ils votre concentration ?',
      iso_17: 'L’air intérieur vous semble-t-il trop sec ?',
      iso_18: 'L’air intérieur vous semble-t-il trop humide ou étouffant ?',
      iso_19: 'Le niveau d’humidité vous cause-t-il un inconfort physique ?',
      iso_20: 'Ressentez-vous une chaleur excessive provenant des fenêtres ou du soleil ?',
      iso_21: 'Ressentez-vous une chaleur excessive émise par les machines ou équipements ?',
      iso_22: 'Les parois ou fenêtres froides vous causent-elles un inconfort ?',
      iso_23: 'Les plafonds chauds ou surfaces tièdes provoquent-ils une gêne ?',
      iso_24: 'Vos pieds sont-ils sensiblement plus froids que le haut de votre corps ?',
      iso_25: 'Votre tête est-elle sensiblement plus chaude que le bas de votre corps ?',
      iso_26: 'Remarquez-vous un écart important de température entre le sol et le niveau de la tête ?',
      iso_27: 'Le sol vous semble-t-il inconfortablement froid ?',
      iso_28: 'Le sol vous semble-t-il inconfortablement chaud ?',
      iso_29: 'La température du sol rend-elle la station debout ou la marche inconfortable ?',
      iso_30: 'Votre tenue de travail habituelle est-elle adaptée à la température ambiante ?',
      iso_31: 'Devez-vous souvent ajouter des vêtements (veste, pull) car il fait trop froid ?',
      iso_32: 'Devez-vous souvent retirer des couches de vêtements car il fait trop chaud ?',
      iso_33: 'Votre niveau d’effort physique vous donne-t-il une sensation de surchauffe ?',
      iso_34: 'Votre travail exige-t-il des mouvements fréquents qui influencent votre confort thermique ?',
      iso_35: 'La température ambiante est-elle en adéquation avec l’activité physique requise ?',
      iso_36: 'L’environnement thermique diminue-t-il votre capacité de concentration ?',
      iso_37: 'L’inconfort thermique nuit-il à votre productivité quotidienne ?',
      iso_38: 'Avez-vous déjà dû faire des pauses ou interrompre votre travail en raison de la température ?',
      iso_39: 'Dans l’ensemble, quel est votre niveau de satisfaction concernant les conditions thermiques ?',
      iso_40: 'Quelles améliorations permettraient d’optimiser au mieux votre confort thermique au travail ?',
    }

    return isoMapFr[code] || text
  }

  return text
}

// ─── Options Text Translations ──────────────────────────────────────────────

export function translateOptionText(text: string, value: string, lang: Language): string {
  if (lang === 'en') return text

  const optMapAr: Record<string, string> = {
    'Yes': 'نعم',
    'No': 'لا',
    '0 days': '0 يوم',
    '1–7 days': '1-7 أيام',
    '1-7 days': '1-7 أيام',
    '8–30 days': '8-30 يوم',
    '8-30 days': '8-30 يوم',
    'More than 30 days': 'أكثر من 30 يوم',
    'More than 30 days (not daily)': 'أكثر من 30 يوم (ليس يومياً)',
    'Every day (daily)': 'كل يوم (يومياً)',
    'Never': 'أبداً',
    'Rarely': 'نادراً',
    'Sometimes': 'أحياناً',
    'Often': 'غالباً',
    'Always': 'دائماً',
    'Very Cold (-3)': 'بارد جداً (-3)',
    'Cold (-2)': 'بارد (-2)',
    'Slightly Cool (-1)': 'مائل للبرودة (-1)',
    'Neutral (0)': 'معتدل (0)',
    'Slightly Warm (+1)': 'مائل للدفء (+1)',
    'Warm (+2)': 'دافئ (+2)',
    'Very Hot (+3)': 'حار جداً (+3)',
  }

  const optMapFr: Record<string, string> = {
    'Yes': 'Oui',
    'No': 'Non',
    '0 days': '0 jour',
    '1–7 days': '1 à 7 jours',
    '1-7 days': '1 à 7 jours',
    '8–30 days': '8 à 30 jours',
    '8-30 days': '8 à 30 jours',
    'More than 30 days': 'Plus de 30 jours',
    'More than 30 days (not daily)': 'Plus de 30 jours (non quotidien)',
    'Every day (daily)': 'Tous les jours (quotidien)',
    'Never': 'Jamais',
    'Rarely': 'Rarement',
    'Sometimes': 'Parfois',
    'Often': 'Souvent',
    'Always': 'Toujours',
    'Very Cold (-3)': 'Très froid (-3)',
    'Cold (-2)': 'Froid (-2)',
    'Slightly Cool (-1)': 'Légèrement frais (-1)',
    'Neutral (0)': 'Neutre (0)',
    'Slightly Warm (+1)': 'Légèrement tiède (+1)',
    'Warm (+2)': 'Chaud (+2)',
    'Very Hot (+3)': 'Très chaud (+3)',
  }

  if (lang === 'ar') return optMapAr[text] || optMapAr[value] || text
  if (lang === 'fr') return optMapFr[text] || optMapFr[value] || text

  return text
}

// ─── Section Labels ─────────────────────────────────────────────────────────

export function translateSectionLabel(section: string, lang: Language): string {
  if (section === 'NMQ_summary') {
    if (lang === 'ar') return 'استبيان الشمال الأوروبي (NMQ) — ملخص'
    if (lang === 'fr') return 'Questionnaire Nordique (NMQ) — Résumé'
    return 'NMQ — Summary'
  }
  if (section === 'NMQ_detail') {
    if (lang === 'ar') return 'استبيان الشمال الأوروبي (NMQ) — تفصيلي'
    if (lang === 'fr') return 'Questionnaire Nordique (NMQ) — Détaillé'
    return 'NMQ — Detailed'
  }
  if (lang === 'ar') return 'معيار ISO 7730 — الراحة الحرارية'
  if (lang === 'fr') return 'Norme ISO 7730 — Confort thermique'
  return 'ISO 7730 — Thermal Comfort'
}

// ─── Scale Labels ───────────────────────────────────────────────────────────

export function translateScaleLabels(code: string, lang: Language): { lowLabel?: string; highLabel?: string } {
  if (code === 'iso_1') {
    if (lang === 'ar') return { lowLabel: 'سيء جداً', highLabel: 'ممتاز' }
    if (lang === 'fr') return { lowLabel: 'Très médiocre', highLabel: 'Excellent' }
    return { lowLabel: 'Very poor', highLabel: 'Excellent' }
  }
  if (code === 'iso_39') {
    if (lang === 'ar') return { lowLabel: 'غير راضٍ تماماً', highLabel: 'راضٍ تماماً' }
    if (lang === 'fr') return { lowLabel: 'Très insatisfait', highLabel: 'Très satisfait' }
    return { lowLabel: 'Very dissatisfied', highLabel: 'Very satisfied' }
  }
  return {}
}
