import { Project, Service, Testimonial, TeamMember, Certificate, CareerListing, Industry, PartnerCompany } from './types';

export const INITIAL_SERVICES: Service[] = [
  {
    id: 's1',
    name: 'General Contracting',
    description: 'End-to-end responsibility for executing medium to scale-level infrastructure and civil projects across India with premium quality standards.',
    iconName: 'Shield',
    details: 'Our general contracting service undertakes raw site development, material procurement, team mobilization, and execution oversight. We synchronize multidisciplinary sub-teams under direct Tasha leadership.',
    features: ['Single-point accountability', 'Rigorous quality engineering', 'Strict site safety frameworks', 'Procurement efficiency & optimization'],
    seoTitle: 'General Civil Contracting Services India | Tasha Contracts India',
    seoDescription: 'Premium end-to-end general contracting solutions for infrastructure, structural steel, and civil constructions under a single-point accountability framework.'
  },
  {
    id: 's2',
    name: 'LGSF Construction',
    description: 'Expertise in floor-to-ceiling prefabricated building solutions featuring high structural stability, rapid delivery, and eco-friendly raw materials.',
    iconName: 'Layers',
    details: 'As seen in our project records, we are premier practitioners of high-strength LGSF. Ideal for quick, sustainable layouts ranging from multi-story residential blocks to high-altitude transit shelter facilities.',
    features: [
      'Up to 70% Faster Construction',
      'Earthquake Resistant Structures',
      'Fire Resistant Design',
      'Energy Efficient Buildings',
      'Lightweight Yet High Strength',
      'Sustainable & Eco-Friendly Materials',
      'Minimal Site Wastage',
      'Long Service Life'
    ],
    seoTitle: 'LGSF Construction Services | Prefabricated Steel Buildings India',
    seoDescription: 'Leading Light Gauge Steel Framing (LGSF) construction company in India. Advanced, eco-friendly, fast, and earthquake-resistant pre-engineered structures.'
  },
  {
    id: 's3',
    name: 'Industrial Facilities',
    description: 'Heavy foundation laying, factory workshop construction, and robust structural engineering tailored for industrial production lines.',
    iconName: 'Building2',
    details: 'We build state-of-the-art power plants, cement factory bases, refinery foundations, and chemical plant structural setups. Equipped with high heat and weight resistant designs.',
    features: [
      'High-tolerance equipment foundations',
      'Heavy-duty overhead crane steel gantries',
      'Industrial flooring and concrete stabilization',
      'Rigorous dynamic load resistance auditing'
    ],
    seoTitle: 'Industrial Facilities Construction Specialists | Tasha Contracts India',
    seoDescription: 'Expert structural civil engineering for industrial facilities, power plants, manufacturing plants, and heavy pre-engineered machinery bases in India.'
  },
  {
    id: 's4',
    name: 'Warehouses & Logistics Parks',
    description: 'Designing and building super-span heavy warehousing systems, advanced logistic hubs, cold storage spaces, and freight corridors.',
    iconName: 'Store',
    details: 'Leveraging structural pre-engineered steel frames (PEB) to achieve spans with zero column interruptions, maximizing storage density and multi-truck loading dock efficiencies.',
    features: [
      'Super-span columnless storage halls',
      'Laser-screed super flat wear-resistant flooring',
      'Automatic loading dock ramps configuration',
      'Integrated solar roof panel frameworks'
    ],
    seoTitle: 'Warehouses & Logistics Parks Construction Company | Tasha Contracts',
    seoDescription: 'Premium turnkey builders for large-scale logistics parks, heavy-duty warehouse depots, distribution centers, and cold-storage facilities in India.'
  },
  {
    id: 's5',
    name: 'Project Management',
    description: 'Systematic supervision, timeline scheduling, budget management, safety compliance auditing, and digital progress tracking from layout to handover.',
    iconName: 'Briefcase',
    details: 'Deploying modern digital Gantt systems and on-site expert engineers to bypass resource blockages, maintain budgets, and protect build schedules.',
    features: [
      'Real-time timeline tracking dashboards',
      'Active cost-containment & optimization checks',
      'Strict quality assurance & safety audits',
      'Seamless multi-contractor synchronization'
    ],
    seoTitle: 'Construction Project Management Services India | Tasha Contracts',
    seoDescription: 'Professional construction project management for civil and industrial mega-projects. Optimize timelines, control costs, and ensure absolute compliance.'
  },
  {
    id: 's6',
    name: 'HR Services',
    description: 'Contractual workforce supply, skilled and semi-skilled labor management, construction site management recruitment, and HR auditing.',
    iconName: 'Users',
    details: 'Powering heavy projects with skilled fitters, welders, certified safety supervisors, civil site engineers, LGSF installers, and specialized mechanics.',
    features: [
      'Pre-vetted certified skilled technicians',
      'Compliant provident fund & welfare management',
      'Rapid workforce mobilization on demand',
      'Comprehensive on-site safety induction training'
    ],
    seoTitle: 'Construction HR & Manpower Workforce Solutions | Tasha Contracts',
    seoDescription: 'Reliable HR manpower contracting services for construction projects. We deploy pre-vetted skilled labor, welders, safety in-charges, and engineers.'
  },
  {
    id: 's7',
    name: 'Civil Construction',
    description: 'Reinforced concrete structures, institutional buildings, corporate headquarters, and high-altitude heavy foundation works.',
    iconName: 'Building',
    details: 'Heavy reinforced concrete construction incorporating structural engineering. We deliver durable housing wings, commercial layouts, and corporate centers.',
    features: [
      'Premium grade concrete mix execution',
      'Bespoke foundational water-proofing locks',
      'High-grade steel bar reinforcement mesh',
      'Full compliance with Indian Standard Codes (IS)'
    ],
    seoTitle: 'Civil Construction Company India | Commercial & Infrastructure Works',
    seoDescription: 'Trusted civil construction contractors for corporate, institutional, and infrastructure projects across India using premium grade materials.'
  },
  {
    id: 's8',
    name: 'Interior Fit-Out Works',
    description: 'High-end turnkey interior layouts, luxurious corporate workspace fit-outs, acoustic partition management, and micro design alignments.',
    iconName: 'LayoutGrid',
    details: 'Turnkey interior architecture for corporate setups. We build acoustics-optimized ceilings, bespoke partitions, premium glass panelings, and custom flooring.',
    features: [
      'Acoustic soundproof partitions',
      'Contemporary premium glass & wood panels',
      'Custom ceiling reflection configurations',
      'High-durability commercial flooring layout'
    ],
    seoTitle: 'Corporate Office Interior Fit-Out Contractors | Tasha Contracts',
    seoDescription: 'Turnkey interior fit-out constructions for corporate offices, luxury workspaces, commercial halls, and advanced acoustic partitions.'
  },
  {
    id: 's9',
    name: 'MEP Solutions & Electricals',
    description: 'Mechanical, Electrical, and Plumbing engineering including commercial HVAC, high-voltage substations, and smart water drainage systems.',
    iconName: 'Zap',
    details: 'Fully cohesive Mechanical, Electrical, and Plumbing design and maintenance services suitable for mega factories, colleges, and medical complexes.',
    features: [
      'High-tension industrial power line setups',
      'Energy-efficient HVAC distribution ducts',
      'Underground civil drainage and water loops',
      'Advanced automation safety alarm systems'
    ],
    seoTitle: 'Turnkey MEP & Electrical Engineering Services | Tasha Contracts',
    seoDescription: 'Comprehensive mechanical, electrical, plumbing (MEP) integrations and high-voltage power installations for industrial facilities & commercial grids.'
  }
];

export const INITIAL_PROJECTS: Project[] = [
  // Ongoing Projects from PDF page 3
  {
    id: 'p1',
    title: 'SJVN Thermal Power Plant',
    category: 'Civil Construction',
    location: 'Buxar, Bihar',
    completionDate: 'Estimated Dec 2026',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800&auto=format&fit=crop',
    status: 'Ongoing',
    description: 'Executing foundational civil works, structural scaffolding, and cooling tower system integrations for the prestigious super-thermal power generating unit under extreme compliance and safety environments.',
    client: 'SJVN Limited (Govt. of India Enterprise)',
    beforeImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581094794329-c8112a89fe12?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1428360905655-1137022f1ad0?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=800&auto=format&fit=crop'
    ]
  },
  {
    id: 'p2',
    title: 'Tata Medical College',
    category: 'Interior Fit-Out',
    location: 'Tatanagar, Jharkhand',
    completionDate: 'Estimated Oct 2026',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop',
    status: 'Ongoing',
    description: 'Developing high-sterile specialized laboratories, acoustic administrative zones, class floorings, and clinical fit-out works tailored for highly specialized medical academic operations.',
    client: 'Tata Medical Group',
    beforeImage: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?q=80&w=800&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1541746972996-4e0b0f43e01a?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=800&auto=format&fit=crop'
    ]
  },
  {
    id: 'p3',
    title: 'Amarnath Yatri Bhawan',
    category: 'LGSF / Prefabricated',
    location: 'Ramban, Jammu & Kashmir',
    completionDate: 'Estimated Aug 2026',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
    status: 'Ongoing',
    description: 'Constructing high-altitude modular transit shelters using Light Gauge Steel Framing (LGSF) technology. Designed to withstand intensive seismic activity, strong alpine winds, and heavy sub-zero snowfall workloads.',
    client: 'J&K Tourism Ministry',
    beforeImage: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?q=80&w=800&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1413143521251.jpg?q=80&w=800',
      'https://images.unsplash.com/photo-1521207418485-99c705420785?q=80&w=800',
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800',
      'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=800',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800'
    ]
  },
  {
    id: 'p4',
    title: 'Central Vista Project (KG Marg)',
    category: 'Civil Construction',
    location: 'KG Marg, New Delhi',
    completionDate: 'Estimated Nov 2026',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop',
    status: 'Ongoing',
    description: 'Proud civil partner in India\'s historic administrative redesign project. Building prestigious concrete infrastructures, perimeter defenses, and underground communication corridors.',
    client: 'CPWD, Government of India',
    galleryImages: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800',
      'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?q=80&w=800',
      'https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?q=80&w=800',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800',
      'https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=800'
    ]
  },
  {
    id: 'p5',
    title: 'Central Vista Project (Sarojini Nagar)',
    category: 'Commercial',
    location: 'Sarojini Nagar, New Delhi',
    completionDate: 'Estimated Mar 2027',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop',
    status: 'Ongoing',
    description: 'Developing multi-tier institutional office complexes, sustainable rainwater capture systems, and state-of-the-art administrative plazas representing national architectural vision.',
    client: 'Government of India Dept. of Works',
    galleryImages: [
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800',
      'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?q=80&w=800',
      'https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?q=80&w=800',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800',
      'https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=800'
    ]
  },
  // Completed Projects based on PDF clients
  {
    id: 'p6',
    title: 'Everest LGSF Modular Warehouse Unit',
    category: 'LGSF / Prefabricated',
    location: 'Kashipur, Uttarakhand',
    completionDate: 'Completed May 2024',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop',
    status: 'Completed',
    description: 'Turnkey fabrication and erection of an 85,000 sq ft industrial warehousing facility using smart pre-engineered light gauge panels under rapid schedule rules.',
    client: 'Everest Industries Limited',
    beforeImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581094794329-c8112a89fe12?q=80&w=800',
      'https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?q=80&w=800',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800',
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800',
      'https://images.unsplash.com/photo-1428360905655-1137022f1ad0?q=80&w=800',
      'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=800'
    ]
  },
  {
    id: 'p7',
    title: 'Nest-In Premium Prefabricated Villas Block',
    category: 'Residential',
    location: 'Dehradun, Uttarakhand',
    completionDate: 'Completed Nov 2023',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
    status: 'Completed',
    description: 'Constructing premium luxury eco-friendly holiday residences featuring high resistance thermal insulation and fast assembly steel chassis systems.',
    client: 'Nest-In (Tata Steel Construction Solutions)',
    beforeImage: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?q=80&w=800&auto=format&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800',
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800',
      'https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?q=80&w=800',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800',
      'https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=800'
    ]
  },
  {
    id: 'p8',
    title: 'Metro Transit Corporate Office Remodel',
    category: 'Interior Fit-Out',
    location: 'Noida, Uttar Pradesh',
    completionDate: 'Completed Jan 2024',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop',
    status: 'Completed',
    description: 'High-end commercial fit-outs including custom glass walls, soundboards, MEP wiring, central power back-ups, and contemporary executive chambers.',
    client: 'Ahluwalia Contracts (India) Limited',
    galleryImages: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1541746972996-4e0b0f43e01a?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800',
      'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?q=80&w=800',
      'https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?q=80&w=800',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800',
      'https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=800'
    ]
  }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    clientName: 'Er. Sandeep Pathak',
    companyName: 'Ahluwalia Contracts (India) Limited',
    text: 'Tasha Contracts India possesses unparalleled efficiency in executing structural partitioning, thermal roofing, and floor-to-ceiling prefabricated elements. Their field-level punctuality and safety measures are absolutely stellar.',
    rating: 5,
    approved: true
  },
  {
    id: 't2',
    clientName: 'Mr. Arvind Gupta',
    companyName: 'Everest Industries Limited',
    text: 'Having partnered with them on multiple prefab projects in North India, their specialization in Light Gauge Steel Framing (LGSF) is second to none. They understand complex site drawings with precision and solve problems actively.',
    rating: 5,
    approved: true
  },
  {
    id: 't3',
    clientName: 'Director of Procurement',
    companyName: 'Nest-In (Tata Steel Construction)',
    text: 'Tasha Contracts managed tight scheduling requirements on our Uttarakhand modern eco-villa projects with strict engineering compliance and high-performance quality guarantees.',
    rating: 5,
    approved: true
  }
];

export const INITIAL_TEAM: TeamMember[] = [
  {
    id: 'tm1',
    name: 'Mr. Jackson',
    role: 'Managing Director & Strategic Planner',
    image: 'Award',
    bio: 'Pioneered Tasha Contracts India in 2015 with a vision to democratize sustainable, heavy-load structural Light Gauge Steel Framing (LGSF) and high-quality Civil contracting solutions across India.',
    guarantees: [
      "Direct authority and on-time completions",
      "100% structural framing load guarantees",
      "Precision engineering and cost control",
      "Uncompromising safety standards compliance"
    ]
  },
  {
    id: 'tm2',
    name: 'Irshad Ahmed',
    role: 'Chief MEP & Operations Director',
    image: 'Wrench',
    bio: 'Oversees complex pipeline installations, mechanical frameworks, sub-station electrical layouts, and safety compliance configurations across mega projects.',
    guarantees: [
      "Optimized heavy machinery pipelines configuration",
      "Pre-aligned industrial electrical systems layout",
      "Zero-risk operations with safe scaffoldings",
      "Premium high-grade non-corrosive metals"
    ]
  },
  {
    id: 'tm3',
    name: 'Vipul Malhotra',
    role: 'Principal Structural Architect',
    image: 'HardHat',
    bio: 'Specialist in 3D frame stress analysis, laser steel modeling, and CPWD/Government compliance drafting for national infrastructure works.',
    guarantees: [
      "Advanced 3D frame stress simulations reports",
      "Govt-approved CPWD layouts drafting standard",
      "Ultra-precise cold-rolled steel alignment",
      "Innovative eco-villa architectural foundations"
    ]
  }
];

export const INITIAL_CERTIFICATES: Certificate[] = [
  {
    id: 'c1',
    title: 'GST Identification Registration',
    regNo: 'GSTIN: 09AAACT9832K1ZP',
    issuer: 'Government of India Ministry of Finance',
    status: 'Approved'
  },
  {
    id: 'c2',
    title: 'MSME Enterprise Registration',
    regNo: 'UDYAM-UP-08-0129481',
    issuer: 'Ministry of Micro, Small & Medium Enterprises',
    status: 'Registered'
  },
  {
    id: 'c3',
    title: 'ISO 9001:2015 (Quality management)',
    regNo: 'ISO-9001-IND-2024-934',
    issuer: 'International Quality Certification Services',
    status: 'Active'
  },
  {
    id: 'c4',
    title: 'ISO 45001:2018 (Occupational Health & Safety)',
    regNo: 'ISO-45001-OHS-2281',
    issuer: 'Universal Assessment Body',
    status: 'Active'
  },
  {
    id: 'c5',
    title: 'Grade-A Government Approved Civil Contractor',
    regNo: 'CPWD-A-CIVIL-2018-9922',
    issuer: 'Central Public Works Department (Delhi Circle)',
    status: 'Approved'
  }
];

export const INITIAL_CAREERS: CareerListing[] = [
  {
    id: 'j1',
    title: 'Site Civil Engineer (LGSF Speciality)',
    department: 'Operations',
    location: 'Ramban, Jammu & Kashmir (Site-based)',
    type: 'Full-time',
    description: 'Seeking an experienced Civil Engineer with explicit hands-on background in managing Light Gauge Steel Framing (LGSF) structures, structural scaffolding, and layout validation.',
    requirements: [
      'B.Tech / Diploma in Civil Engineering with 3+ years experience',
      'Strong capability to interpret structural laser blueprints',
      'Familiarity with CPWD and industrial quality benchmarks',
      'Fluency in coordinating contractor labor teams under tight timelines'
    ],
    active: true
  },
  {
    id: 'j2',
    title: 'Senior MEP Coordinator',
    department: 'Execution',
    location: 'Noida Corporate Office (with site transit)',
    type: 'Full-time',
    description: 'Responsible for drafting, auditing, and executing complete Mechanical, Electrical, and Plumbing (MEP) layouts for heavy industrial structures and medical complexes.',
    requirements: [
      'B.E. in Electrical/Mechanical Engineering with 4+ years exposure',
      'Expertise in HVAC configuration and commercial plumbing grids',
      'Proven site problem-solving record under safety compliance',
      'Solid command over AutoCAD or Revit software tools'
    ],
    active: true
  },
  {
    id: 'j3',
    title: 'Structural CAD Drafter',
    department: 'Planning & Design',
    location: 'Amroha, Uttar Pradesh (Headquarters)',
    type: 'Full-time',
    description: 'Translating concepts and specifications into production-ready LGSF 3D frame calculations and detail designs.',
    requirements: [
      'Proficiency in FrameCAD, Vertex BD, or structural Tekla',
      '1+ years specialized training in light gauge structural designs',
      'High level of accuracy regarding geometric tolerances',
      'Ability to thrive under parallel client demands'
    ],
    active: true
  }
];

export const INITIAL_SYSTEM_INFO = {
  companyName: 'Tasha Contracts India',
  establishedYear: '2015',
  email: 'tashacontracts@gmail.com',
  address: 'Ground Floor Shop, Dhakka Amroha, (Uttar Pradesh) - 244221, India',
  hqLabel: 'Headquarters (Amroha):',
  phone: '+91 94119 55562', // valid representative phone sample
  whatsapp: '+919411955562',
  whatsappMessage: 'Hello Tasha Contracts India, I am interested in a construction project.',
  workingHours: 'Monday - Saturday: 9:00 AM - 6:30 PM',
  emergencySupport: 'Emergency Support: 24/7 client hotline',
  mapHeader: 'Ground Floor Shop, Dhakka Amroha, (Uttar Pradesh)',
  mapDescription: 'Tasha Contracts Corporate Headquarters & Estimation Workshop. Near National Highway Transit, Uttar Pradesh, India.',
  slogan: 'Leading Construction & Turnkey Project Company in India',
  headerTagline: 'Make Tomorrow With Us',
  subheading: 'Professional Turnkey Construction Services, Civil Engineering works, and LGSF Prefabricated solutions across Amroha, Hasanpur, Uttar Pradesh, and PAN India.',
  cloudinaryCloudName: 'dpxoxrnrd', // Extracted from user's provided link!
  cloudinaryUploadPreset: 'TASHA CONTRACTS',
  logoUrl: 'https://res.cloudinary.com/dpxoxrnrd/image/upload/v1781468947/squjiyig325m8hrjt8sm.png', // Dynamic company logo url
  heroVideoUrl: 'https://res.cloudinary.com/dpxoxrnrd/video/upload/v1781097285/po6wg43tokovftxnpxfa.mp4',
  heroPosterUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1920&auto=format&fit=crop',
  ctaBgUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1200',
  mapBgUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=400',
  founderName: 'Mr. Jackson',
  founderRole: 'Managing Director & Founder',
  founderImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400',
  founderBio: '"Establishing Tasha Contracts India in 2015 meant building an ethical construction collective respect for labor, punctuality, and pioneering state-of-the-art pre-engineered structural steel foundations."',
  founderLocation: 'Amroha Uttar Pradesh, India Circle',
  founderImageFit: 'top', // Align to top by default to keep face/hair perfectly visible!
  founderImageShape: 'circle', // Circular silhouette by default
  statProjectsCompleted: 85,
  statHappyClients: 50,
  statYearsExperience: 11,
  statTeamMembers: 120,
  statCitiesServed: 15,
  statProjectsLabel: 'Projects Completed',
  statHappyClientsLabel: 'Happy Clients',
  statYearsExperienceLabel: 'Years of Experience',
  statTeamMembersLabel: 'Team Members',
  statCitiesServedLabel: 'Cities Served',
  chooseTitle1: '10+ Years of Punctual Experience',
  chooseDesc1: 'Registered in 2015, operating with deep efficiency in complex Indian infrastructure circles.',
  chooseTitle2: 'Licensed & Government Approved',
  chooseDesc2: 'Fully certified MSME, GST Registered with Class-A engineering safety and compliance ratios.',
  chooseTitle3: 'Skilled Expert Team',
  chooseDesc3: 'Dedicated engineers and trained installation teams ensure smooth execution, quality workmanship and timely project completion.',
  chooseTitle4: 'Premium Grade LGSF Steel Framework',
  chooseDesc4: 'Precision-engineered steel framing designed for durability, seismic resistance, dimensional accuracy and long-term structural performance.',
  chooseTitle5: 'Guaranteed On-Time Handover',
  chooseDesc5: 'Punctual execution that completes assemblies up to 70% faster than dynamic brick-and-mortar projects.',
  partnersTagline: 'PARTNERING WITH THE BEST IN INDUSTRY',
  aboutSlogan: 'Pioneering Modern Construction Tech',
  aboutTitle: 'Building the Future with LGSF & Prefabricated Construction Solutions',
  aboutIntroHeading: 'Trusted LGSF Engineering Since 2015',
  aboutDesc1: 'Founded in 2015, Tasha Contracts India has emerged as a trusted name in modern construction technologies. We specialize in the design, manufacturing, and execution of prefabricated buildings and Light Gauge Steel Framing (LGSF) structures, delivering innovative, sustainable, and cost-effective building solutions across India.',
  aboutDesc2: 'With a dedicated team of engineers, project managers, and skilled professionals, we provide end-to-end solutions covering design, engineering, fabrication, installation, and project management.',
  aboutStat1Val: '10+ Years',
  aboutStat1Lbl: 'Experience',
  aboutStat2Val: '200+ Sites',
  aboutStat2Lbl: 'Delivered',
  aboutStat3Val: 'PAN India',
  aboutStat3Lbl: 'Service Network',
  aboutWhyChooseTitle: 'Why Choose Tasha Contracts',
  aboutWhyChoosePoints: 'Advanced LGSF Technology\nFaster Construction Time\nEarthquake Resistant Structures\nLightweight & Durable Buildings\nEco-Friendly Construction\nCost Effective Solutions\nTurnkey Project Execution\nExperienced Technical Team\nStrict Quality Control\nOn-Time Project Delivery',
  aboutVision: "To become India's leading provider of innovative prefabricated and LGSF building solutions by delivering world-class quality, engineering excellence, and customer satisfaction.",
  aboutMission: "To revolutionize the construction industry through modern technology, sustainable building practices, and efficient project execution while creating long-term value for our clients."
};

export const INITIAL_INDUSTRIES: Industry[] = [
  {
    id: 'ind-1',
    name: 'Commercial & Corporate Offices',
    description: 'High-speed construction of premium executive offices, modern IT hubs, and business parks.',
    iconName: 'Building2',
    points: ['Flexible layout configurations', 'Advanced acoustics management', 'Fast-track prefabricated partitions']
  },
  {
    id: 'ind-2',
    name: 'Educational Institutions',
    description: 'Constructing safe, durable, and thermal-regulating school classrooms, hostels, and college libraries.',
    iconName: 'GraduationCap',
    points: ['Eco-friendly non-toxic materials', 'Rapid construction during summer/winter breaks', 'Seismic-safe classrooms']
  },
  {
    id: 'ind-3',
    name: 'Residential Complexes & Villas',
    description: 'Bespoke high-end modern villas, rapid housing estates, and eco-friendly structural LGSF homes.',
    iconName: 'Home',
    points: ['Luxury finish compatible', 'High energy-efficiency walls', 'Quick floor additions (extensibility)']
  },
  {
    id: 'ind-4',
    name: 'Defense & Transit Shelters',
    description: 'Ultra-tough pre-engineered shelters capable of withstanding heavy snow load and extreme sub-zero climates.',
    iconName: 'Shield',
    points: ['Rapid military deployments', 'High altitude load tested', 'Corrosion-proof materials']
  },
  {
    id: 'ind-5',
    name: 'Healthcare & Diagnostic Labs',
    description: 'Premium layouts tailored for heavy medical equipment, noise dampening, and clean sanitation workflows.',
    iconName: 'HeartPulse',
    points: ['Hygienic and bacterial-resistant boards', 'Vibration-free heavy foundations', 'Lead-shielding partition capability']
  },
  {
    id: 'ind-6',
    name: 'Hospitality & Eco-Tourism',
    description: 'Prebuilt hill resorts, lightweight eco-cottages, and modular glass cafe frameworks.',
    iconName: 'Palmtree',
    points: ['Minimal ecological on-site impact', 'Custom rustic or ultra-modern aesthetics', 'Rapid modular resort assembly']
  }
];

export const INITIAL_PARTNERS: PartnerCompany[] = [
  {
    id: 'partner-1',
    name: 'EVEREST',
    subtitle: 'Everest Industries',
    colorClass: 'text-red-500 font-mono'
  },
  {
    id: 'partner-2',
    name: 'AHLUWALIA',
    subtitle: 'Contracts (India) Ltd',
    colorClass: 'text-amber-600 font-mono'
  },
  {
    id: 'partner-3',
    name: 'EPACK',
    subtitle: 'Prefab QuickBuild',
    colorClass: 'text-cyan-500 font-mono'
  },
  {
    id: 'partner-4',
    name: 'NEST-IN',
    subtitle: 'Tata Steel Tech',
    colorClass: 'text-emerald-500 font-mono'
  },
  {
    id: 'partner-5',
    name: 'PASA',
    subtitle: 'Bonding Precision',
    colorClass: 'text-yellow-600 font-mono'
  }
];

