import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, Phone, Mail, MapPin, Clock, Send, 
  CheckCircle2, ArrowRight, ShieldCheck, Download, Award, Shield,
  Users, HelpCircle, Layers, Calendar, ChevronRight, Search, Filter,
  PhoneCall, Star, Quote, Eye, ArrowUpRight, Check, Sparkles, Sun, Moon, Menu, X,
  Lock, Scale, Video, ArrowLeft, WifiOff, AlertCircle, RefreshCw
} from 'lucide-react';

import { Project, Service, Testimonial, TeamMember, Certificate, CareerListing, QuoteRequest, ContactMessage, CareerApplication, Industry, PartnerCompany } from './types';
import { 
  INITIAL_PROJECTS, INITIAL_SERVICES, INITIAL_TESTIMONIALS, 
  INITIAL_TEAM, INITIAL_CERTIFICATES, INITIAL_CAREERS, INITIAL_SYSTEM_INFO, INITIAL_INDUSTRIES, INITIAL_PARTNERS
} from './data';

import { DynamicIcon } from './components/Icons';
import { ProjectDetailsPopup } from './components/ProjectDetailsPopup';
import { StatsCounter } from './components/StatsCounter';
import { QuoteForm } from './components/QuoteForm';
import { CareersSection } from './components/CareersSection';
import { AdminPanel } from './components/AdminPanel';
import { WebMediaManager } from './components/WebMediaManager';
import { AddTestimonialForm } from './components/AddTestimonialForm';
import { optimizeImage } from './utils/imageOptimizer';

// Firebase & Firestore sync layer
import { testConnection } from './lib/firebase';
import { 
  fetchCollectionFromFirestore, 
  saveItemToFirestore, 
  deleteItemFromFirestore, 
  saveAllCollectionToFirestore, 
  fetchSystemInfoFromFirestore, 
  saveSystemInfoToFirestore 
} from './lib/firestoreSync';

export default function App() {
  // Database connectivity mode
  const [dbMode, setDbMode] = useState<'connecting' | 'firebase' | 'local'>('connecting');

  // Theme state permanently set to light
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('light');

  // Multi-page navigation state
  const [activeTab, setActiveTab] = useState<string>('home');
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Core synchronized application state with initial local storage hydration to prevent paint flicker
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem('tasha_projects');
      return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  });
  const [services, setServices] = useState<Service[]>(() => {
    try {
      const saved = localStorage.getItem('tasha_services');
      const raw = saved ? JSON.parse(saved) : INITIAL_SERVICES;
      return raw.map((s: any) => {
        if (s.id === 's2' && (s.features.length === 4 || s.features.includes('Seismic and wind resistant steel frames'))) {
          return { ...s, features: INITIAL_SERVICES[1].features };
        }
        return s;
      });
    } catch {
      return INITIAL_SERVICES;
    }
  });
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    try {
      const saved = localStorage.getItem('tasha_testimonials');
      return saved ? JSON.parse(saved) : INITIAL_TESTIMONIALS;
    } catch {
      return INITIAL_TESTIMONIALS;
    }
  });
  const [team, setTeam] = useState<TeamMember[]>(() => {
    try {
      const saved = localStorage.getItem('tasha_team');
      return saved ? JSON.parse(saved) : INITIAL_TEAM;
    } catch {
      return INITIAL_TEAM;
    }
  });
  const [industries, setIndustries] = useState<Industry[]>(() => {
    try {
      const saved = localStorage.getItem('tasha_industries');
      return saved ? JSON.parse(saved) : INITIAL_INDUSTRIES;
    } catch {
      return INITIAL_INDUSTRIES;
    }
  });
  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    try {
      const saved = localStorage.getItem('tasha_certs');
      return saved ? JSON.parse(saved) : INITIAL_CERTIFICATES;
    } catch {
      return INITIAL_CERTIFICATES;
    }
  });
  const [careers, setCareers] = useState<CareerListing[]>(() => {
    try {
      const saved = localStorage.getItem('tasha_careers');
      return saved ? JSON.parse(saved) : INITIAL_CAREERS;
    } catch {
      return INITIAL_CAREERS;
    }
  });
  const [quotes, setQuotes] = useState<QuoteRequest[]>(() => {
    try {
      const saved = localStorage.getItem('tasha_quotes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [contacts, setContacts] = useState<ContactMessage[]>(() => {
    try {
      const saved = localStorage.getItem('tasha_contacts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [applications, setApplications] = useState<CareerApplication[]>(() => {
    try {
      const saved = localStorage.getItem('tasha_applications');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [systemInfo, setSystemInfo] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('tasha_system');
      const parsed = saved ? { ...INITIAL_SYSTEM_INFO, ...JSON.parse(saved) } : INITIAL_SYSTEM_INFO;
      if (parsed.logoUrl === 'https://res.cloudinary.com/dpxoxrnrd/image/upload/v1781280142/samples/radial.jpg' || 
          parsed.logoUrl === 'https://res.cloudinary.com/dpxoxrnrd/image/upload/v1781288451/samples/chair-and-coffee-table.png') {
        parsed.logoUrl = INITIAL_SYSTEM_INFO.logoUrl;
      }
      return parsed;
    } catch {
      return INITIAL_SYSTEM_INFO;
    }
  });
  const [partners, setPartners] = useState<PartnerCompany[]>(() => {
    try {
      const saved = localStorage.getItem('tasha_partners');
      return saved ? JSON.parse(saved) : INITIAL_PARTNERS;
    } catch {
      return INITIAL_PARTNERS;
    }
  });

  // Tab/Path mappings for professional clean URLs
  const TAB_TO_PATH: { [key: string]: string } = {
    home: '',
    about: 'about-tasha',
    services: 'our-services',
    projects: 'completed-projects',
    team: 'our-team',
    contact: 'get-in-touch',
    privacy: 'privacy-policy',
    terms: 'terms-of-service',
  };

  const PATH_TO_TAB: { [key: string]: string } = {
    '': 'home',
    'corporate-home': 'home',
    'home': 'home',
    'about-tasha': 'about',
    'about': 'about',
    'our-services': 'services',
    'services': 'services',
    'completed-projects': 'projects',
    'projects': 'projects',
    'our-team': 'team',
    'team': 'team',
    'get-in-touch': 'contact',
    'contact': 'contact',
    'privacy-policy': 'privacy',
    'privacy': 'privacy',
    'terms-of-service': 'terms',
    'terms': 'terms',
  };

  // Parse on initial load to support deep-linking
  useEffect(() => {
    let path = window.location.pathname.replace(/^\/|\/$/g, '');
    let hash = window.location.hash.replace(/^#\/?|#$/g, '');
    
    const routeSegment = path || hash;
    if (routeSegment) {
      const parts = routeSegment.split('/');
      const tabPath = parts[0];
      const serviceId = parts[1] || null;
      
      const targetTab = PATH_TO_TAB[tabPath];
      if (targetTab) {
        setActiveTab(targetTab);
        if (targetTab === 'services' && serviceId) {
          setActiveServiceId(serviceId);
        }
      }
    }
  }, []);

  // Synchronize browser Back/Forward (popstate) actions
  useEffect(() => {
    const handlePopState = () => {
      let path = window.location.pathname.replace(/^\/|\/$/g, '');
      let hash = window.location.hash.replace(/^#\/?|#$/g, '');
      
      const routeSegment = path || hash;
      if (!routeSegment) {
        setActiveTab('home');
        setActiveServiceId(null);
        return;
      }
      
      const parts = routeSegment.split('/');
      const tabPath = parts[0];
      const serviceId = parts[1] || null;
      
      const targetTab = PATH_TO_TAB[tabPath] || 'home';
      setActiveTab(targetTab);
      if (targetTab === 'services') {
        setActiveServiceId(serviceId);
      } else {
        setActiveServiceId(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Synchronize state updates back to browser URL / Address bar using safe Hash-Based Routing (avoids 404 on refresh)
  useEffect(() => {
    const tabPath = TAB_TO_PATH[activeTab];
    if (tabPath === undefined) return;

    let expectedHash = tabPath === '' ? '' : `#${tabPath}`;
    if (activeTab === 'services' && activeServiceId) {
      expectedHash = `#our-services/${activeServiceId}`;
    }

    const currentHash = window.location.hash;

    // Ensure the pathname is always "/" or the base directory of the app
    // to avoid 404 errors on browser page reloads.
    if (currentHash !== expectedHash) {
      window.history.pushState(
        { activeTab, activeServiceId },
        '',
        expectedHash || '/'
      );
    }
  }, [activeTab, activeServiceId]);

  // Dynamic SEO Title and Meta Description state manager based on navigation page and sub-services
  useEffect(() => {
    let title = "Construction Company in India | PEB, LGSF, Industrial & Turnkey Projects | Tasha Contracts India";
let description = "Tasha Contracts India is a leading construction company delivering PEB structures, LGSF buildings, warehouses, factories, commercial, industrial and turnkey construction projects across India. Serving Uttar Pradesh, Delhi NCR, Haryana and Uttarakhand.";
let keywords = "construction company in india, construction company in uttar pradesh, construction company in amroha, construction company in hasanpur, construction company in moradabad, construction company in sambhal, construction company in noida, construction company in delhi, construction company in haryana, construction company in uttarakhand, construction company near me, civil contractor, civil contractor amroha, civil contractor moradabad, industrial construction company, commercial construction company, warehouse construction company, factory construction company, PEB structure company, PEB construction company, LGSF construction company, steel building company, turnkey construction company, industrial shed construction, factory shed construction, warehouse builder, commercial builder, residential construction company";
    if (activeTab === 'home') {
    title = "Construction Company in India | PEB, LGSF, Warehouse & Factory Construction | Tasha Contracts India";
      description = "Tasha Contracts India is a trusted construction company in India specializing in PEB structures, LGSF buildings, warehouses, factories, commercial buildings, industrial construction and turnkey projects. We serve Amroha, Hasanpur, Moradabad, Sambhal, Noida, Delhi NCR, Haryana, Uttarakhand and all over India.";
   keywords = "construction company in india, construction company in uttar pradesh, construction company in amroha, construction company in hasanpur, construction company in moradabad, construction company in sambhal, construction company in noida, construction company in delhi, construction company in haryana, construction company in uttarakhand, construction company near me, civil contractor india, civil contractor uttar pradesh, industrial construction company, commercial construction company, warehouse construction company, factory construction company, peb structure company, peb building contractor, lgsf construction company, steel structure company, turnkey construction company, prefab building company";
    } else if (activeTab === 'about') {
      title = "About Us & Quality Assurance | Tasha Contracts India ";
      description = "Learn about Tasha Contracts India, founded in 2015 by Mr. Jackson. Read our mission, high compliance engineering standards, and vision for LGSF & civil construction.";
    } else if (activeTab === 'projects') {
      title = "Completed PEB & LGSF Construction Projects Gallery | Tasha Contracts";
      description = "Browse our engineering portfolio of completed and ongoing heavy-load LGSF structures, industrial facilities, power plants, and corporate hubs across India.";
    } else if (activeTab === 'team') {
      title = "Our Leadership, Engineers & Estimations Team | Tasha Contracts";
      description = "Meet the certified structural designers, civil engineers, safety managers, and directors of Tasha Contracts committed to punctual, ISO-compliant handovers.";
    } else if (activeTab === 'contact') {
      title = "Get a Quote & Building Estimate | Tasha Contracts India Contact";
      description = "Contact Tasha Contracts India. Submit your blueprints, drawings, budget, or land size, and get a professional engineering consultation and cost blueprint.";
    } else if (activeTab === 'privacy') {
      title = "Privacy Policy & Data Security Compliance | Tasha Contracts India";
      description = "Read our standard user privacy and data security declarations matching construction services guidelines.";
    } else if (activeTab === 'terms') {
      title = "Terms of Service & General Contracting Agreement | Tasha Contracts";
      description = "Review our contractual service declarations, safety regulations, and project warranty terms.";
    } else if (activeTab === 'services') {
      if (activeServiceId) {
        const selected = services.find(s => s.id === activeServiceId);
        if (selected) {
          title = selected.seoTitle || `${selected.name} | Tasha Contracts India`;
          description = selected.seoDescription || selected.description;
          keywords = `${selected.name}, ${keywords}`;
        }
      } else {
        title = "Our Turnkey Heavy Infrastructure & LGSF Services | Tasha Contracts India";
        description = "Discover our turnkey services including LGSF Construction, Industrial Facilities structures, Warehouses & Logistics Parks, Project Management, and specialized HR Services.";
      }
    }

    // Set Document Title
    document.title = title;

    // Dynamically update or create head meta tag helpers
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    
    // Add Open Graph & Twitter Card support for advanced optimization
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:url', window.location.href, true);
    updateMetaTag('og:type', 'website', true);
    updateMetaTag('og:image', 'https://res.cloudinary.com/dpxoxrnrd/image/upload/v1782569510/android-chrome-512x512_x9tzdr.png', true);
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', 'https://res.cloudinary.com/dpxoxrnrd/image/upload/v1782569510/android-chrome-512x512_x9tzdr.png');
  }, [activeTab, activeServiceId, services]);

  // Dynamic Construction Company JSON-LD Schema injection
  useEffect(() => {
    let scriptId = 'tasha-contracts-schema';
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    const servicesCatalog = services.map((s, index) => ({
      "@type": "Offer",
      "position": index + 1,
      "itemOffered": {
        "@type": "Service",
        "name": s.name,
        "description": s.description,
        "url": `https://tashacontractsindia.com/our-services/${s.id}`
      }
    }));

    const schemaData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://tashacontractsindia.com/#organization",
          "name": "Tasha Contracts India",
          "alternateName": "Tasha Contracts",
          "url": "https://tashacontractsindia.com/",
          "logo": {
            "@type": "ImageObject",
            "url": "https://res.cloudinary.com/dpxoxrnrd/image/upload/v1781458097/lwqggnzmuj3oaa18noat.jpg",
            "caption": "Tasha Contracts India Logo"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-94119-55562",
            "contactType": "customer service",
            "areaServed": "IN",
            "availableLanguage": ["en", "hi"]
          }
        },
        {
          "@type": "ConstructionBusiness",
          "@id": "https://tashacontractsindia.com/#localbusiness",
          "name": "Tasha Contracts India",
          "image": "https://res.cloudinary.com/dpxoxrnrd/image/upload/v1781458097/lwqggnzmuj3oaa18noat.jpg",
          "telephone": "+91-94119-55562",
          "email": "tashacontracts@gmail.com",
          "priceRange": "$$$",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Ground Floor Shop, Dhakka Amroha",
            "addressLocality": "Amroha",
            "addressRegion": "Uttar Pradesh",
            "postalCode": "244221",
            "addressCountry": "IN"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "28.9103",
            "longitude": "78.4716"
          },
          "url": "https://tashacontractsindia.com/",
          "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday"
            ],
            "opens": "09:00",
            "closes": "18:30"
          },
          "founder": {
            "@type": "Person",
            "name": "Mr. Jackson",
            "jobTitle": "Founder & Managing Director"
          },
          "knowsAbout": [
            "Light Gauge Steel Framing (LGSF)",
            "LGSF Construction",
            "Industrial Facilities Construction",
            "Warehouse Building",
            "Logistics Park Engineering",
            "Construction Project Management",
            "Workforce & HR Service Solutions",
            "Civil Construction",
            "Office Interior Fit-out & Renovation Works"
          ],
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "General & Pre-engineered Construction Services",
            "itemListElement": servicesCatalog
          }
        },
        {
          "@type": "FAQPage",
          "@id": "https://tashacontractsindia.com/#faq",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Why choose Tasha Contracts for Turnkey Construction in India?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Tasha Contracts India provides premium end-to-end turnkey construction services. We combine advanced Light Gauge Steel Framing (LGSF) technology, experienced civil engineers, transparent project management, and government approved safety standards to deliver projects up to 70% faster with maximum cost-efficiency."
              }
            },
            {
              "@type": "Question",
              "name": "Is Tasha Contracts a registered Government Contractor?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, Tasha Contracts India is a certified government contractor executing CPWD, PWD, and Public Sector civil construction projects under severe engineering compliance, structural safety regulations, and rigid ISO audit scopes."
              }
            },
            {
              "@type": "Question",
              "name": "What locations do you serve for commercial & industrial projects?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Our primary corporate office is located in Dhakka Amroha, Uttar Pradesh, and we operate active regional workshops in Hasanpur, Sambhal, and Noida. However, we deliver large-scale prefabricated steel factory systems, pre-engineered warehouses, and structural engineering works PAN India."
              }
            }
          ]
        }
      ]
    };

    script.textContent = JSON.stringify(schemaData, null, 2);
  }, [services]);

  // Search and filter states for projects
  const [projectFilterCategory, setProjectFilterCategory] = useState<string>('All');
  const [projectSearchQuery, setProjectSearchQuery] = useState<string>('');

  // active detail popup state
  const [activePopupProject, setActivePopupProject] = useState<Project | null>(null);

  // contact page simple message draft
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    mobile: '',
    subject: '',
    message: ''
  });
  const [contactStatus, setContactStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Loading, retry and error state management for initial-load data reliability
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [minLoadingPassed, setMinLoadingPassed] = useState<boolean>(false);

  // Enforce a minimum display time for the splash screen to avoid visual flicker
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinLoadingPassed(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, [retryCount]);

  // Sync state from Database (with LocalStorage fallback) on mount
  useEffect(() => {
    let isMounted = true;
    
    async function initializeApplicationData() {
      setIsLoading(true);
      setLoadingError(null);
      
      const maxRetries = 3;
      let attempt = 0;
      let success = false;
      
      while (attempt < maxRetries && !success && isMounted) {
        try {
          console.log(`Loading application data (Attempt ${attempt + 1}/${maxRetries})...`);
          
          // Check live Firestore connection with a small but safe timeout
          const isConnected = await testConnection();
          if (!isConnected) {
            throw new Error("Unable to establish connection to Firebase Firestore servers.");
          }
          
          if (!isMounted) return;
          setDbMode('firebase');
          
          // Seed values fallback to prevent missing documents
          const savedProjectsStr = localStorage.getItem('tasha_projects');
          const seedProjects = savedProjectsStr ? JSON.parse(savedProjectsStr) : INITIAL_PROJECTS;

          const savedServicesStr = localStorage.getItem('tasha_services');
          const seedServices = savedServicesStr ? JSON.parse(savedServicesStr) : INITIAL_SERVICES;

          const savedTestimonialsStr = localStorage.getItem('tasha_testimonials');
          const seedTestimonials = savedTestimonialsStr ? JSON.parse(savedTestimonialsStr) : INITIAL_TESTIMONIALS;

          const savedTeamStr = localStorage.getItem('tasha_team');
          const seedTeam = savedTeamStr ? JSON.parse(savedTeamStr) : INITIAL_TEAM;

          const savedCertsStr = localStorage.getItem('tasha_certs');
          const seedCerts = savedCertsStr ? JSON.parse(savedCertsStr) : INITIAL_CERTIFICATES;

          const savedCareersStr = localStorage.getItem('tasha_careers');
          const seedCareers = savedCareersStr ? JSON.parse(savedCareersStr) : INITIAL_CAREERS;

          const savedQuotesStr = localStorage.getItem('tasha_quotes');
          const seedQuotes = savedQuotesStr ? JSON.parse(savedQuotesStr) : [];

          const savedContactsStr = localStorage.getItem('tasha_contacts');
          const seedContacts = savedContactsStr ? JSON.parse(savedContactsStr) : [];

          const savedAppsStr = localStorage.getItem('tasha_applications');
          const seedApps = savedAppsStr ? JSON.parse(savedAppsStr) : [];

          const savedSysStr = localStorage.getItem('tasha_system');
          const seedSys = savedSysStr ? JSON.parse(savedSysStr) : INITIAL_SYSTEM_INFO;

          const savedIndustriesStr = localStorage.getItem('tasha_industries');
          const seedIndustries = savedIndustriesStr ? JSON.parse(savedIndustriesStr) : INITIAL_INDUSTRIES;

          const savedPartnersStr = localStorage.getItem('tasha_partners');
          const seedPartners = savedPartnersStr ? JSON.parse(savedPartnersStr) : INITIAL_PARTNERS;
          
          // Fetch all collections in parallel from Firestore
          const [
            liveProjects,
            liveServices,
            liveTestimonials,
            liveTeam,
            liveCerts,
            liveCareers,
            liveQuotes,
            liveContacts,
            liveApplications,
            liveSys,
            liveIndustries,
            livePartners
          ] = await Promise.all([
            fetchCollectionFromFirestore<Project>('projects', seedProjects),
            fetchCollectionFromFirestore<Service>('services', seedServices),
            fetchCollectionFromFirestore<Testimonial>('testimonials', seedTestimonials),
            fetchCollectionFromFirestore<TeamMember>('team', seedTeam),
            fetchCollectionFromFirestore<Certificate>('certs', seedCerts),
            fetchCollectionFromFirestore<CareerListing>('careers', seedCareers),
            fetchCollectionFromFirestore<QuoteRequest>('quotes', seedQuotes),
            fetchCollectionFromFirestore<ContactMessage>('contacts', seedContacts),
            fetchCollectionFromFirestore<CareerApplication>('applications', seedApps),
            fetchSystemInfoFromFirestore(seedSys),
            fetchCollectionFromFirestore<Industry>('industries', seedIndustries),
            fetchCollectionFromFirestore<PartnerCompany>('partners', seedPartners)
          ]);

          if (!isMounted) return;

          setProjects(liveProjects);
          
          // Auto-sync LGSF features to the newly specified 8 guarantees
          const syncedServices = liveServices.map(s => {
            if (s.id === 's2' && (s.features.length === 4 || s.features.includes('Seismic and wind resistant steel frames'))) {
              return { ...s, features: INITIAL_SERVICES[1].features };
            }
            return s;
          });
          setServices(syncedServices);
          setTestimonials(liveTestimonials);
          setTeam(liveTeam);
          setIndustries(liveIndustries);
          setCertificates(liveCerts);
          setCareers(liveCareers);
          setQuotes(liveQuotes);
          setContacts(liveContacts);
          setApplications(liveApplications);
          setPartners(livePartners);
          
          const parsed = { ...INITIAL_SYSTEM_INFO, ...liveSys };
          if (parsed.logoUrl === 'https://res.cloudinary.com/dpxoxrnrd/image/upload/v1781280142/samples/radial.jpg' || 
              parsed.logoUrl === 'https://res.cloudinary.com/dpxoxrnrd/image/upload/v1781288451/samples/chair-and-coffee-table.png') {
            parsed.logoUrl = INITIAL_SYSTEM_INFO.logoUrl;
          }
          setSystemInfo(parsed);

          // Update LocalStorage cache to ensure identical immediate paint on next refresh
          try {
            localStorage.setItem('tasha_projects', JSON.stringify(liveProjects));
            localStorage.setItem('tasha_services', JSON.stringify(syncedServices));
            localStorage.setItem('tasha_testimonials', JSON.stringify(liveTestimonials));
            localStorage.setItem('tasha_team', JSON.stringify(liveTeam));
            localStorage.setItem('tasha_industries', JSON.stringify(liveIndustries));
            localStorage.setItem('tasha_certs', JSON.stringify(liveCerts));
            localStorage.setItem('tasha_careers', JSON.stringify(liveCareers));
            localStorage.setItem('tasha_quotes', JSON.stringify(liveQuotes));
            localStorage.setItem('tasha_contacts', JSON.stringify(liveContacts));
            localStorage.setItem('tasha_applications', JSON.stringify(liveApplications));
            localStorage.setItem('tasha_system', JSON.stringify(parsed));
            localStorage.setItem('tasha_partners', JSON.stringify(livePartners));
          } catch (e) {
            console.warn("Failed to write live Firestore sync data to LocalStorage cache", e);
          }

          success = true;
          setIsLoading(false);
          console.log("Firebase Firestore data loaded successfully on initial visit!");
          return;
        } catch (err) {
          console.warn(`Attempt ${attempt + 1} failed:`, err);
          attempt++;
          if (attempt < maxRetries && isMounted) {
            await new Promise(resolve => setTimeout(resolve, 800));
          }
        }
      }

      if (!isMounted) return;

      // Fallback local storage state load if credentials/offline block
      console.warn("Firebase loading failed after all retries. Falling back to local storage offline mode.");
      setDbMode('local');
      try {
        const savedProjects = localStorage.getItem('tasha_projects');
        setProjects(savedProjects ? JSON.parse(savedProjects) : INITIAL_PROJECTS);

        const savedServices = localStorage.getItem('tasha_services');
        const parsedServices: Service[] = savedServices ? JSON.parse(savedServices) : INITIAL_SERVICES;
        const syncedLocalServices = parsedServices.map(s => {
          if (s.id === 's2' && (s.features.length === 4 || s.features.includes('Seismic and wind resistant steel frames'))) {
            return { ...s, features: INITIAL_SERVICES[1].features };
          }
          return s;
        });
        setServices(syncedLocalServices);

        const savedTestimonials = localStorage.getItem('tasha_testimonials');
        setTestimonials(savedTestimonials ? JSON.parse(savedTestimonials) : INITIAL_TESTIMONIALS);

        const savedTeam = localStorage.getItem('tasha_team');
        setTeam(savedTeam ? JSON.parse(savedTeam) : INITIAL_TEAM);

        const savedIndustries = localStorage.getItem('tasha_industries');
        setIndustries(savedIndustries ? JSON.parse(savedIndustries) : INITIAL_INDUSTRIES);

        const savedCerts = localStorage.getItem('tasha_certs');
        setCertificates(savedCerts ? JSON.parse(savedCerts) : INITIAL_CERTIFICATES);

        const savedCareers = localStorage.getItem('tasha_careers');
        setCareers(savedCareers ? JSON.parse(savedCareers) : INITIAL_CAREERS);

        const savedQuotes = localStorage.getItem('tasha_quotes');
        setQuotes(savedQuotes ? JSON.parse(savedQuotes) : []);

        const savedContacts = localStorage.getItem('tasha_contacts');
        setContacts(savedContacts ? JSON.parse(savedContacts) : []);

        const savedApps = localStorage.getItem('tasha_applications');
        setApplications(savedApps ? JSON.parse(savedApps) : []);

        const savedPartners = localStorage.getItem('tasha_partners');
        setPartners(savedPartners ? JSON.parse(savedPartners) : INITIAL_PARTNERS);

        const savedSys = localStorage.getItem('tasha_system');
        if (savedSys) {
          const parsed = { ...INITIAL_SYSTEM_INFO, ...JSON.parse(savedSys) };
          if (parsed.logoUrl === 'https://res.cloudinary.com/dpxoxrnrd/image/upload/v1781280142/samples/radial.jpg' || 
              parsed.logoUrl === 'https://res.cloudinary.com/dpxoxrnrd/image/upload/v1781288451/samples/chair-and-coffee-table.png') {
            parsed.logoUrl = INITIAL_SYSTEM_INFO.logoUrl;
          }
          setSystemInfo(parsed);
        } else {
          setSystemInfo(INITIAL_SYSTEM_INFO);
        }
        
        // If we have any cached data at all, we can proceed
        setIsLoading(false);
      } catch (e) {
        console.warn('LocalStorage error during fallback, using fresh defaults', e);
        setProjects(INITIAL_PROJECTS);
        setServices(INITIAL_SERVICES);
        setTestimonials(INITIAL_TESTIMONIALS);
        setTeam(INITIAL_TEAM);
        setIndustries(INITIAL_INDUSTRIES);
        setCertificates(INITIAL_CERTIFICATES);
        setCareers(INITIAL_CAREERS);
        setPartners(INITIAL_PARTNERS);
        setSystemInfo(INITIAL_SYSTEM_INFO);
        
        setLoadingError("Unable to load latest cloud data. Please check your internet connection.");
      }
    }

    initializeApplicationData();

    return () => {
      isMounted = false;
    };
  }, [retryCount]);

  // Hidden key shortcut to access admin panel securely without public footer link
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Secret key combination: Ctrl+Shift+A or Alt+Shift+A
      if ((e.ctrlKey || e.altKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setActiveTab('admin');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Scroll to top when the active page tab changes
  useEffect(() => {
    try {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    } catch (err) {
      window.scrollTo({ top: 0 });
    }
  }, [activeTab]);

  // Sync state helpers to update React memory + LocalStorage dynamically + Live Firestore (if connected)
  const updateProjects = (data: Project[]) => {
    setProjects(data);
    localStorage.setItem('tasha_projects', JSON.stringify(data));
    if (dbMode === 'firebase') {
      saveAllCollectionToFirestore('projects', data).catch(err => console.warn('Firestore sync failed', err));
    }
  };
  const updateServices = (data: Service[]) => {
    setServices(data);
    localStorage.setItem('tasha_services', JSON.stringify(data));
    if (dbMode === 'firebase') {
      saveAllCollectionToFirestore('services', data).catch(err => console.warn('Firestore sync failed', err));
    }
  };
  const updateTestimonials = (data: Testimonial[]) => {
    setTestimonials(data);
    localStorage.setItem('tasha_testimonials', JSON.stringify(data));
    if (dbMode === 'firebase') {
      saveAllCollectionToFirestore('testimonials', data).catch(err => console.warn('Firestore sync failed', err));
    }
  };
  const updateTeam = (data: TeamMember[]) => {
    setTeam(data);
    localStorage.setItem('tasha_team', JSON.stringify(data));
    if (dbMode === 'firebase') {
      saveAllCollectionToFirestore('team', data).catch(err => console.warn('Firestore sync failed', err));
    }
  };
  const updateIndustries = (data: Industry[]) => {
    setIndustries(data);
    localStorage.setItem('tasha_industries', JSON.stringify(data));
    if (dbMode === 'firebase') {
      saveAllCollectionToFirestore('industries', data).catch(err => console.warn('Firestore sync failed', err));
    }
  };
  const updateCertificates = (data: Certificate[]) => {
    setCertificates(data);
    localStorage.setItem('tasha_certs', JSON.stringify(data));
    if (dbMode === 'firebase') {
      saveAllCollectionToFirestore('certs', data).catch(err => console.warn('Firestore sync failed', err));
    }
  };
  const updateCareers = (data: CareerListing[]) => {
    setCareers(data);
    localStorage.setItem('tasha_careers', JSON.stringify(data));
    if (dbMode === 'firebase') {
      saveAllCollectionToFirestore('careers', data).catch(err => console.warn('Firestore sync failed', err));
    }
  };
  const updateQuotes = (data: QuoteRequest[]) => {
    setQuotes(data);
    localStorage.setItem('tasha_quotes', JSON.stringify(data));
    if (dbMode === 'firebase') {
      saveAllCollectionToFirestore('quotes', data).catch(err => console.warn('Firestore sync failed', err));
    }
  };
  const updateContacts = (data: ContactMessage[]) => {
    setContacts(data);
    localStorage.setItem('tasha_contacts', JSON.stringify(data));
    if (dbMode === 'firebase') {
      saveAllCollectionToFirestore('contacts', data).catch(err => console.warn('Firestore sync failed', err));
    }
  };
  const updateApplications = (data: CareerApplication[]) => {
    setApplications(data);
    localStorage.setItem('tasha_applications', JSON.stringify(data));
    if (dbMode === 'firebase') {
      saveAllCollectionToFirestore('applications', data).catch(err => console.warn('Firestore sync failed', err));
    }
  };
  const updateSystemInfo = (data: any) => {
    setSystemInfo(data);
    localStorage.setItem('tasha_system', JSON.stringify(data));
    if (dbMode === 'firebase') {
      saveSystemInfoToFirestore(data).catch(err => console.warn('Firestore system sync failed', err));
    }
  };
  const updatePartners = (data: PartnerCompany[]) => {
    setPartners(data);
    localStorage.setItem('tasha_partners', JSON.stringify(data));
    if (dbMode === 'firebase') {
      saveAllCollectionToFirestore('partners', data).catch(err => console.warn('Firestore sync failed', err));
    }
  };

  const forceUploadAllToCloud = async () => {
    if (dbMode !== 'firebase') {
      alert("Note: The application is currently running in Offline local storage mode because we could not establish a direct Cloud database connection. Make sure your Firebase settings are complete before trying to force sync.");
      return;
    }
    try {
      await Promise.all([
        saveAllCollectionToFirestore('projects', projects),
        saveAllCollectionToFirestore('services', services),
        saveAllCollectionToFirestore('testimonials', testimonials),
        saveAllCollectionToFirestore('team', team),
        saveAllCollectionToFirestore('certs', certificates),
        saveAllCollectionToFirestore('careers', careers),
        saveAllCollectionToFirestore('quotes', quotes),
        saveAllCollectionToFirestore('contacts', contacts),
        saveAllCollectionToFirestore('applications', applications),
        saveSystemInfoToFirestore(systemInfo),
        saveAllCollectionToFirestore('industries', industries),
        saveAllCollectionToFirestore('partners', partners),
      ]);
      alert("Success: All local browser modifications and configured datasets have been uploaded & successfully synchronized to your Live Cloud Firestore!");
    } catch (err) {
      console.error(err);
      alert("Error: Cloud Upload failed. Please check your Firestore security rules or web connection.");
    }
  };

  const forceDownloadAllFromCloud = async () => {
    if (dbMode !== 'firebase') {
      alert("Note: The application is currently running in Offline local storage mode because we could not establish a direct Cloud database connection.");
      return;
    }
    try {
      const [
        liveProjects,
        liveServices,
        liveTestimonials,
        liveTeam,
        liveCerts,
        liveCareers,
        liveQuotes,
        liveContacts,
        liveApplications,
        liveSys,
        liveIndustries,
        livePartners
      ] = await Promise.all([
        fetchCollectionFromFirestore<Project>('projects', INITIAL_PROJECTS),
        fetchCollectionFromFirestore<Service>('services', INITIAL_SERVICES),
        fetchCollectionFromFirestore<Testimonial>('testimonials', INITIAL_TESTIMONIALS),
        fetchCollectionFromFirestore<TeamMember>('team', INITIAL_TEAM),
        fetchCollectionFromFirestore<Certificate>('certs', INITIAL_CERTIFICATES),
        fetchCollectionFromFirestore<CareerListing>('careers', INITIAL_CAREERS),
        fetchCollectionFromFirestore<QuoteRequest>('quotes', []),
        fetchCollectionFromFirestore<ContactMessage>('contacts', []),
        fetchCollectionFromFirestore<CareerApplication>('applications', []),
        fetchSystemInfoFromFirestore(INITIAL_SYSTEM_INFO),
        fetchCollectionFromFirestore<Industry>('industries', INITIAL_INDUSTRIES),
        fetchCollectionFromFirestore<PartnerCompany>('partners', INITIAL_PARTNERS)
      ]);

      setProjects(liveProjects);
      localStorage.setItem('tasha_projects', JSON.stringify(liveProjects));
      setServices(liveServices);
      localStorage.setItem('tasha_services', JSON.stringify(liveServices));
      setTestimonials(liveTestimonials);
      localStorage.setItem('tasha_testimonials', JSON.stringify(liveTestimonials));
      setTeam(liveTeam);
      localStorage.setItem('tasha_team', JSON.stringify(liveTeam));
      setCertificates(liveCerts);
      localStorage.setItem('tasha_certs', JSON.stringify(liveCerts));
      setCareers(liveCareers);
      localStorage.setItem('tasha_careers', JSON.stringify(liveCareers));
      setQuotes(liveQuotes);
      localStorage.setItem('tasha_quotes', JSON.stringify(liveQuotes));
      setContacts(liveContacts);
      localStorage.setItem('tasha_contacts', JSON.stringify(liveContacts));
      setApplications(liveApplications);
      localStorage.setItem('tasha_applications', JSON.stringify(liveApplications));
      setSystemInfo(liveSys);
      localStorage.setItem('tasha_system', JSON.stringify(liveSys));
      setIndustries(liveIndustries);
      localStorage.setItem('tasha_industries', JSON.stringify(liveIndustries));
      setPartners(livePartners);
      localStorage.setItem('tasha_partners', JSON.stringify(livePartners));

      alert("Success: All live cloud data has been downloaded and has overwritten your browser local storage successfully!");
    } catch (err) {
      console.error(err);
      alert("Error: Cloud data download failed. Please verify database connectivity.");
    }
  // Submit quote request from the form page
  const handleQuoteSubmit = (quote: QuoteRequest) => {
    const updated = [quote, ...quotes];
    updateQuotes(updated);
  };

  // Submit career application from candidate page
  const handleCareerApply = (app: CareerApplication) => {
    const updated = [app, ...applications];
    updateApplications(updated);
  };

  // Submit general contact inquiry form
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      setContactStatus('error');
      return;
    }
    const newMsg: ContactMessage = {
      id: 'msg_' + Date.now(),
      name: contactForm.name,
      email: contactForm.email,
      mobile: contactForm.mobile,
      subject: contactForm.subject || 'General Contracting Inquiry',
      message: contactForm.message,
      submissionDate: new Date().toISOString(),
      status: 'New'
    };
    updateContacts([newMsg, ...contacts]);
    setContactStatus('success');
    setContactForm({ name: '', email: '', mobile: '', subject: '', message: '' });
  };

  // Filter projects by both category selection and search query
  const filteredProjects = projects.filter((p) => {
    const matchesCat = projectFilterCategory === 'All' || p.category === projectFilterCategory;
    const matchesSearch = p.title.toLowerCase().includes(projectSearchQuery.toLowerCase()) || 
                          p.location.toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
                          p.client.toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(projectSearchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const uniqueCategories = ['All', 'LGSF / Prefabricated', 'Civil Construction', 'Commercial', 'Residential', 'Interior Fit-Out'];
  const isDark = themeMode === 'dark';

 if (loadingError) {
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className={`min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-300 ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-800'} z-[9999]`}
      >
        <div className="max-w-md w-full flex flex-col items-center text-center">
          <motion.img 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            src={optimizeImage("https://res.cloudinary.com/dpxoxrnrd/image/upload/v1781470506/xi5glrd0y0orfruy70hm.png", 500)}
            alt="Tasha Contracts India"
            className="max-w-[280px] md:max-w-[360px] h-auto object-contain select-none mb-6"
          />
          
          {loadingError ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl w-full flex flex-col items-center gap-4"
            >
              <div className="p-3 bg-rose-50 text-rose-500 rounded-full">
                <WifiOff className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Synchronisation Failed</h3>
              <p className="text-sm text-slate-500">
                {loadingError}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
                <button
                  onClick={() => {
                    setLoadingError(null);
                    setRetryCount(prev => prev + 1);
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-xl transition shadow-md shadow-slate-950/10 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Retry Connection
                </button>
                <button
                  onClick={() => {
                    setLoadingError(null);
                    setIsLoading(false);
                    setMinLoadingPassed(true);
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-sm rounded-xl transition cursor-pointer"
                >
                  Load Offline Backup
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center gap-4 mt-8">
              {/* Sleek Minimalist Ring Loader */}
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-slate-800"></div>
                <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin"></div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${
      isDark 
        ? 'bg-[#050D1A] text-white' 
        : 'bg-slate-50/50 text-slate-800'
    }`}>
      
      {/* --- MAIN HEADER / NAVIGATION --- */}
      <header className="sticky top-0 z-40 bg-slate-50/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto pl-2 pr-4 sm:pl-4 sm:pr-6 lg:pl-4 lg:pr-8 h-20 flex items-center justify-between">
          
          {/* Majestic Company Logo & Brand wordmark */}
          <div 
            onClick={() => {
              setActiveTab('home');
              setMobileMenuOpen(false);
            }}
            className="flex flex-col items-center justify-center cursor-pointer group select-none shrink-0"
          >
            {systemInfo.logoUrl ? (
              <img 
                src={optimizeImage(systemInfo.logoUrl, 300) || undefined} 
                alt="Tasha Contracts Logo" 
                referrerPolicy="no-referrer"
                loading="eager"
                className="h-18 md:h-22 w-auto object-contain select-none"
              />
            ) : (
              /* Wordmark in gold */
              <div className="flex flex-col text-left leading-none">
                <span className="font-display text-[18px] md:text-[22px] font-black uppercase tracking-widest text-[#1e293b] font-sans">
                  TASHA
                </span>
                <span className="text-[8.5px] font-extrabold tracking-[0.22em] -mt-0.5 uppercase text-amber-600">
                  CONTRACTS
                </span>
              </div>
            )}
            <span 
              className="text-[10px] md:text-[11px] font-bold text-slate-600 normal-case tracking-normal -mt-[18px] md:-mt-[26px] z-10 font-sans"
            >
              {systemInfo.headerTagline || "Make Tomorrow With Us"}
            </span>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center gap-1.5">
            {[
              { id: 'home', label: 'Home' },
              { id: 'about', label: 'About Tasha' },
              { id: 'services', label: 'Our Services' },
              { id: 'projects', label: 'Completed & Ongoing' },
              { id: 'team', label: 'Our Team' },
              { id: 'contact', label: 'Get in Touch' }
            ].map((tab) => (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`px-3.5 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                    : 'hover:bg-slate-200/60 text-slate-700 hover:text-slate-950'
                }`}
              >
                {tab.label}
              </motion.button>
            ))}
          </nav>

          {/* CTA Header Button on Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => setActiveTab('contact')}
              className="hidden lg:flex px-4 py-2.5 bg-slate-900 text-white hover:bg-slate-800 transition-all font-bold text-xs uppercase tracking-wider rounded-lg shadow-md cursor-pointer"
            >
              Bid Request
            </button>
          </div>

          {/* Mobile Menu Icon on Mobile */}
          <div className="xl:hidden flex items-center gap-2.5">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg transition-colors border text-slate-700 hover:text-slate-950 border-slate-250 bg-slate-100"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </header>

      {/* --- MOBILE COLLAPSED MENU DRAWER --- */}
      {mobileMenuOpen && (
        <div className={`xl:hidden fixed inset-0 z-50 top-20 border-t flex flex-col p-6 animate-fade-in-up transition-colors ${
          isDark 
            ? 'bg-[#050D1A]/98 border-slate-800' 
            : 'bg-white/98 border-slate-200'
        }`}>
          <div className="flex flex-col gap-3 font-display">
            {[
              { id: 'home', label: 'Home' },
              { id: 'about', label: 'About Tasha' },
              { id: 'services', label: 'Our Services' },
              { id: 'projects', label: 'Completed & Ongoing' },
              { id: 'team', label: 'Our Team' },
              { id: 'contact', label: 'Get in Touch' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full py-3.5 px-4 rounded-xl text-left font-extrabold text-sm uppercase tracking-widest transition-all ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-slate-950 border border-amber-400/50'
                    : `bg-slate-800/10 hover:bg-slate-800/30 ${isDark ? 'text-gray-300' : 'text-slate-850'}`
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="mt-auto border-t border-slate-800/40 pt-6 space-y-4 text-center">
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Tasha Contracts India | Since 2015</p>
            <button
              onClick={() => {
                setActiveTab('contact');
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-widest rounded-xl shadow-md"
            >
              Apply for Contract
            </button>
          </div>
        </div>
      )}

      {/* --- CORE TAB WORKFLOW VIEWS --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <AnimatePresence mode="wait">
        
        {/* ==============================================
             1. HOME TAB VIEW 
           ============================================== */}
        {activeTab === 'home' && (
          <motion.div 
            key="home"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-20 animate-fade-in-up"
          >
            
            {/* HERO BANNER - High-Contrast Left-Aligned Premium Construction Layout with Video Backdrop */}
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative rounded-3xl overflow-hidden min-h-[520px] md:min-h-[620px] flex items-center justify-start text-left p-8 md:p-16 border border-slate-800/20 shadow-2xl transition-all"
            >
              {/* Construction/Site work background video */}
              <video 
                key={systemInfo.heroVideoUrl || "https://res.cloudinary.com/dpxoxrnrd/video/upload/v1781097285/po6wg43tokovftxnpxfa.mp4"}
                autoPlay 
                loop 
                muted 
                playsInline 
                preload="metadata"
                poster={optimizeImage(systemInfo.heroPosterUrl || "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1920", 1200)}
                className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity"
                src={systemInfo.heroVideoUrl || "https://res.cloudinary.com/dpxoxrnrd/video/upload/v1781097285/po6wg43tokovftxnpxfa.mp4"}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent"></div>
              
              {/* Vertical frame design accents */}
              <div className="absolute inset-0 grid grid-cols-6 pointer-events-none opacity-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="border-r border-amber-500 h-full"></div>
                ))}
              </div>

              <div className="relative z-10 max-w-2xl space-y-6 md:space-y-8">
                
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-[10px] font-extrabold uppercase tracking-widest"
                >
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping"></span>
                  Pioneering Prefabricated Systems (Since 2015)
                </motion.div>

                <motion.h1 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
                  className="text-4xl sm:text-5xl lg:text-6xl font-black font-display leading-[1.08] text-white"
                >
                  {systemInfo.slogan || "Leading Industrial, Commercial, PEB & LGSF Construction Company in India"}
                </motion.h1>

                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="text-sm md:text-base text-slate-300 leading-relaxed font-sans max-w-xl"
                >
                  {systemInfo.subheading || "Tasha Contracts India is a trusted industrial, commercial and civil construction company specializing in PEB structures, LGSF buildings, warehouses, factories, steel structures and turnkey construction projects across India. We deliver high-quality construction solutions for industrial, commercial and residential projects across Amroha, Hasanpur, Moradabad, Sambhal, Noida, Delhi NCR, Uttar Pradesh, Haryana, Uttarakhand and other major cities in India.."}
                </motion.p>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="flex flex-col sm:flex-row items-center gap-4 pt-4"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab('contact')}
                    className="w-full sm:w-auto px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black uppercase tracking-widest text-xs rounded-lg shadow-lg shadow-amber-500/10 border border-amber-400 cursor-pointer text-center"
                  >
                    Apply for Contract
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab('projects')}
                    className="w-full sm:w-auto px-8 py-3.5 bg-transparent hover:bg-white/10 text-white font-black uppercase tracking-widest text-xs rounded-lg border border-white/60 cursor-pointer text-center"
                  >
                    View Our Projects
                  </motion.button>
                </motion.div>

                {/* Status bar detailing the page metrics */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.8 }}
                  className="pt-8 border-t border-slate-800/60 flex flex-wrap gap-4 md:gap-8 text-[10px] text-gray-400 font-mono font-bold uppercase tracking-widest"
                >
                  <span>● LGSF SYSTEM EXPERTS</span>
                  <span>--- INDUSTRY COLLABORATORS ---</span>
                  <span>● GOVERNMENT COMPLIANCE</span>
                </motion.div>

              </div>
            </motion.section>

            {/* OUR SERVICES - Beautiful Glassmorphic Deep Blue Grid (MM Builders theme) */}
            <motion.section 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                visible: { transition: { staggerChildren: 0.1 } },
                hidden: {}
              }}
              className="space-y-8 pt-4"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
                  }}
                  className="space-y-2 text-left"
                >
                  <span className="text-[10px] font-extrabold uppercase text-amber-500 tracking-[0.2em] block">
                    INDUSTRIAL SPECIALTY
                  </span>
                  <h2 className={`text-3xl font-black font-display tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Our Services
                  </h2>
                </motion.div>
                <motion.button
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
                  }}
                  onClick={() => setActiveTab('services')}
                  className="text-xs font-black uppercase tracking-widest text-amber-500 hover:underline flex items-center gap-1.5 self-start cursor-pointer md:self-end"
                >
                  Explore All Capabilities <ChevronRight size={14} />
                </motion.button>
              </div>

              {/* Service Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.slice(0, 6).map((service, i) => (
                  <motion.div 
                    key={service.id || i}
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                    }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className={`p-6 md:p-8 rounded-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer shadow-xl border ${
                      isDark 
                        ? 'bg-[#141E30] border-slate-800/65 hover:border-amber-500/35 hover:bg-[#19253C]' 
                        : 'bg-white border-slate-200/80 hover:border-amber-500/40 hover:shadow-lg'
                    }`}
                    onClick={() => setActiveTab('services')}
                  >
                    <div className="space-y-4">
                      {/* White simple icon top of card */}
                      <div className={`w-12 h-12 flex items-center justify-center bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 ${
                        isDark ? 'text-white' : 'text-amber-600'
                      }`}>
                        <DynamicIcon name={service.iconName} size={22} />
                      </div>
                      <h3 className={`text-lg font-bold font-display group-hover:text-amber-500 transition-colors ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}>
                        {service.name}
                      </h3>
                      <p className={`text-xs leading-relaxed font-sans line-clamp-2 ${
                        isDark ? 'text-slate-300' : 'text-slate-600'
                      }`}>
                        {service.description}
                      </p>
                    </div>

                    <div className={`pt-4 mt-6 border-t flex items-center justify-between text-[11px] font-medium ${
                      isDark ? 'border-slate-800/60 text-slate-400' : 'border-slate-100 text-slate-500'
                    }`}>
                      <span>{service.features ? service.features[0] : 'High Quality Execution'}</span>
                      <span className="text-amber-500 font-extrabold group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* WHY CHOOSE US - High-Contrast Pristine Light-Slate Segment (Alternating Look) */}
            <motion.section 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="rounded-3xl bg-[#F8FAFC] border border-slate-200 text-slate-900 p-8 md:p-12 shadow-md transition-all"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
                
                {/* Left Side: Handsome Civil Engineer Blueprints Image (MM Builders style) */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="lg:col-span-5 relative h-80 md:h-[420px] rounded-2xl overflow-hidden shadow-lg border border-slate-300 bg-slate-200"
                >
                  <img 
                    src={optimizeImage("https://res.cloudinary.com/dpxoxrnrd/image/upload/v1781122254/r8abeqly5cbung126iay.jpg", 600)} 
                    alt="Pioneering Civil Engineer" 
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover mix-blend-normal hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent p-6 text-white text-left">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500 font-mono">TASHAS SUPERVISION</p>
                    <p className="text-xs font-bold leading-relaxed">{systemInfo.address || "Dhakka Road, Amroha (U.P) India"}</p>
                  </div>
                </motion.div>

                {/* Right Side: High-Contrast Value Cards (MM Builders Mock) */}
                <motion.div 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={{
                    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
                    hidden: {}
                  }}
                  className="lg:col-span-7 space-y-6 text-left"
                >
                  <motion.div 
                    variants={{
                      hidden: { opacity: 0, x: 20 },
                      visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
                    }}
                    className="space-y-2"
                  >
                    <span className="text-[10px] font-black uppercase text-amber-600 tracking-[0.25em] block">
                      WHY CHOOSE TASHA
                    </span>
                    <h3 className="text-3xl font-black font-display tracking-tight text-slate-900">
                      Building the Future With Advanced Technology
                    </h3>
                    <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
                      Since 2015, Tasha Contracts India has been delivering innovative LGSF construction solutions across residential, commercial and industrial sectors. Our expertise combines advanced engineering, precision manufacturing and turnkey project execution to create faster, stronger and more sustainable structures.
                    </p>
                  </motion.div>

                  {/* Vertically stacked high contrast badge list blocks */}
                  <div className="space-y-3">
                    
                    <motion.div 
                      variants={{
                        hidden: { opacity: 0, y: 15 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
                      }}
                      className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md hover:border-amber-400/50 transition-all shadow-sm"
                    >
                      <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-600">
                        <Award size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{systemInfo.chooseTitle1 || "10+ Years of Punctual Experience"}</h4>
                        <p className="text-[11px] text-slate-500 leading-normal">{systemInfo.chooseDesc1 || "Registered in 2015, operating with deep efficiency in complex Indian infrastructure circles."}</p>
                      </div>
                    </motion.div>

                    <motion.div 
                      variants={{
                        hidden: { opacity: 0, y: 15 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
                      }}
                      className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md hover:border-amber-400/50 transition-all shadow-sm"
                    >
                      <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-600">
                        <ShieldCheck size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{systemInfo.chooseTitle2 || "Licensed & Government Approved"}</h4>
                        <p className="text-[11px] text-slate-500 leading-normal">{systemInfo.chooseDesc2 || "Fully certified MSME, GST Registered with Class-A engineering safety and compliance ratios."}</p>
                      </div>
                    </motion.div>

                    <motion.div 
                      variants={{
                        hidden: { opacity: 0, y: 15 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
                      }}
                      className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md hover:border-amber-400/50 transition-all shadow-sm"
                    >
                      <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-600">
                        <Users size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{systemInfo.chooseTitle3 || "Skilled Expert Team"}</h4>
                        <p className="text-[11px] text-slate-500 leading-normal">{systemInfo.chooseDesc3 || "Dedicated engineers and trained installation teams ensure smooth execution, quality workmanship and timely project completion."}</p>
                      </div>
                    </motion.div>

                    <motion.div 
                      variants={{
                        hidden: { opacity: 0, y: 15 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
                      }}
                      className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md hover:border-amber-400/50 transition-all shadow-sm"
                    >
                      <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-600">
                        <Layers size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{systemInfo.chooseTitle4 || "Premium Grade LGSF Steel Framework"}</h4>
                        <p className="text-[11px] text-slate-500 leading-normal">{systemInfo.chooseDesc4 || "Precision-engineered steel framing designed for durability, seismic resistance, dimensional accuracy and long-term structural performance."}</p>
                      </div>
                    </motion.div>

                    <motion.div 
                      variants={{
                        hidden: { opacity: 0, y: 15 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
                      }}
                      className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md hover:border-amber-400/50 transition-all shadow-sm"
                    >
                      <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-600">
                        <Clock size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{systemInfo.chooseTitle5 || "Guaranteed On-Time Handover"}</h4>
                        <p className="text-[11px] text-slate-500 leading-normal">{systemInfo.chooseDesc5 || "Punctual execution that completes assemblies up to 70% faster than dynamic brick-and-mortar projects."}</p>
                      </div>
                    </motion.div>

                  </div>

                </motion.div>

              </div>
            </motion.section>

            {/* KEY METRICS AND COUNTERS */}
            <section className="space-y-6">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-[10px] font-extrabold uppercase text-amber-500 tracking-[0.2em] block">
                  STATISTICS
                </span>
                <h3 className={`text-3xl font-black font-display tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Engineering Growth In Numbers
                </h3>
              </div>
              <StatsCounter themeMode={themeMode} systemInfo={systemInfo} />
            </section>

            {/* OUR PROJECTS - Clean Horizontal Gallery cards with bottom title text overlays */}
            <motion.section 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                visible: { transition: { staggerChildren: 0.1 } },
                hidden: {}
              }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
                  }}
                  className="space-y-2 text-left"
                >
                  <span className="text-[10px] font-extrabold uppercase text-amber-500 tracking-[0.2em] block">
                    COMPLETED & ACTIVE MONUMENTS
                  </span>
                  <h2 className={`text-3xl font-black font-display tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Our Projects
                  </h2>
                </motion.div>
                <motion.button
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
                  }}
                  onClick={() => setActiveTab('projects')}
                  className="text-xs font-black uppercase tracking-widest text-amber-500 hover:underline flex items-center gap-1.5 self-start cursor-pointer md:self-end"
                >
                  View All Exhibits <ChevronRight size={14} />
                </motion.button>
              </div>

              {/* Grid with 4 beautiful columns featuring Tasha projects */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {projects.slice(0, 4).map((project, idx) => (
                  <motion.div 
                    key={project.id || idx}
                    variants={{
                      hidden: { opacity: 0, scale: 0.9, y: 20 },
                      visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5 } }
                    }}
                    onClick={() => {
                      setActiveTab('projects');
                      setActivePopupProject(project);
                      setTimeout(() => {
                        const targetEl = document.getElementById('main-content-anchor') || document.querySelector('main');
                        if (targetEl) {
                          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }, 100);
                    }}
                    className={`relative h-64 md:h-72 rounded-xl overflow-hidden cursor-pointer group shadow-xl border ${
                      isDark ? 'border-slate-800/40 bg-slate-900' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <img 
                      src={optimizeImage(project.image, 400) || undefined} 
                      alt={project.title} 
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-955 to-transparent"></div>
                    
                    <span className="absolute top-3 left-3 px-2 py-0.5 bg-slate-950/80 border border-slate-800 text-[8px] font-mono font-bold uppercase rounded-full text-amber-500">
                      {project.status === 'Completed' ? 'Completed Works' : 'Ongoing Site Work'}
                    </span>

                    <div className="absolute bottom-4 left-4 right-4 text-left">
                      <p className="text-[9px] text-amber-400 font-bold uppercase tracking-wider mb-0.5">{project.category}</p>
                      <h4 className="text-sm font-black text-white leading-snug drop-shadow-md truncate">
                        {project.title}
                      </h4>
                      <p className="text-[10px] text-slate-300 font-semibold flex items-center gap-1 mt-1 truncate">
                        <MapPin size={11} className="text-amber-500 shrink-0" />
                        {project.location}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Centered Outline Trigger Button */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
                }}
                className="text-center pt-2"
              >
                <button
                  onClick={() => setActiveTab('projects')}
                  className={`px-6 py-2.5 bg-transparent border font-bold uppercase tracking-widest text-[10px] rounded-lg cursor-pointer transition-all inline-flex items-center gap-2 ${
                    isDark 
                      ? 'border-slate-700 text-white hover:bg-white/5' 
                      : 'border-slate-300 text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  View All Projects <ChevronRight size={12} className="text-amber-500" />
                </button>
              </motion.div>
            </motion.section>

            {/* CLIENT TESTIMONIALS - Dynamic styling with Gold highlight strip */}
            <motion.section 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                visible: { transition: { staggerChildren: 0.1 } },
                hidden: {}
              }}
              className="space-y-8"
            >
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <motion.span 
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                  }}
                  className="text-[10px] font-extrabold uppercase text-amber-500 tracking-[0.2em] block"
                >
                  CLIENT SATISFACTION
                </motion.span>
                <motion.h3 
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1 } }
                  }}
                  className={`text-3xl font-black font-display tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}
                >
                  Client Testimonials
                </motion.h3>
              </div>

              {/* 3 cards side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.filter(t => t.approved !== false).slice(0, 6).map((testimonial, i) => (
                  <motion.div 
                    key={testimonial.id || i}
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
                    }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className={`p-6 md:p-8 rounded-xl text-left relative flex flex-col justify-between shadow-xl border ${
                      isDark 
                        ? 'bg-[#141E30] border-slate-800/80 text-white' 
                        : 'bg-white border-slate-200/80 text-slate-800'
                    }`}
                  >
                    <div className="space-y-4">
                      {/* Rating stars */}
                      <div className="flex gap-1 text-amber-400">
                        {[...Array(testimonial.rating || 5)].map((_, starIdx) => (
                          <Star key={starIdx} size={14} fill="currentColor" />
                        ))}
                      </div>

                      <p className={`text-xs leading-relaxed italic font-medium font-sans ${
                        isDark ? 'text-slate-300' : 'text-slate-600'
                      }`}>
                        "{testimonial.text}"
                      </p>
                    </div>

                    {/* Profile layout */}
                    <div className={`pt-6 mt-6 border-t ${isDark ? 'border-slate-800/60' : 'border-slate-100'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-amber-500 text-xs font-bold font-display uppercase border ${
                          isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                        }`}>
                          {testimonial.clientName.charAt(0) || 'E'}
                        </div>
                        <div>
                          <h4 className={`font-extrabold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{testimonial.clientName}</h4>
                          <p className="text-[10px] text-amber-500 font-bold tracking-wider uppercase font-mono mt-0.5">{testimonial.companyName || 'Corporate Client'}</p>
                        </div>
                      </div>

                      {/* Small Gold accent indicator bar sitting below profile details */}
                      <div className="h-1 w-12 bg-amber-500 rounded mt-4"></div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Share Experience Feedback Submission Panel */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
                }}
                className="pt-4 pb-2"
              >
                <AddTestimonialForm 
                  onAddTestimonial={(newTest) => updateTestimonials([newTest, ...testimonials])} 
                  isDark={themeMode === 'dark'} 
                />
              </motion.div>

              {/* Centered Trigger Button */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
                }}
                className="text-center pt-2"
              >
                <button
                  onClick={() => setActiveTab('contact')}
                  className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black uppercase tracking-widest text-xs rounded-lg transition-all shadow-lg hover:shadow-amber-500/20 border border-amber-400 cursor-pointer"
                >
                  Apply for Contract
                </button>
              </motion.div>
            </motion.section>

            {/* ==============================================
                 NEW: INDUSTRIES WE SERVED SECTION
               ============================================== */}
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="space-y-8 text-left"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold uppercase text-amber-500 tracking-[0.2em] block">
                    SECTORS & DOMAINS
                  </span>
                  <h2 className={`text-3xl font-black font-display tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Industries We Served
                  </h2>
                  <p className={`text-xs md:text-sm font-sans max-w-2xl ${isDark ? 'text-gray-400 font-light' : 'text-slate-600'}`}>
                    Providing custom-engineered structural foundations, high-speed prefabricated LGSF framing, and complete interior environments optimized for specialized requirements.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {industries.map((industry) => (
                  <motion.div
                    key={industry.id}
                    whileHover={{ y: -4 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between group h-full ${
                      isDark 
                        ? 'bg-slate-800/10 border-slate-750/50 hover:border-amber-500/40' 
                        : 'bg-white border-slate-200 shadow-md hover:shadow-lg hover:border-amber-500/40'
                    }`}
                  >
                    <div className="space-y-4">
                      <div className={`w-11 h-11 flex items-center justify-center rounded-xl p-2.5 border transition-colors ${
                        isDark 
                          ? 'bg-slate-900 border-slate-700 text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950' 
                          : 'bg-amber-50 border-amber-100 text-amber-600 group-hover:bg-amber-550 group-hover:text-slate-950 hover:scale-105 transition-transform'
                      }`}>
                        <DynamicIcon name={industry.iconName || 'Building2'} size={20} />
                      </div>

                      <div className="space-y-1.5">
                        <h4 className={`text-lg font-bold font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {industry.name}
                        </h4>
                        <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-400 font-light' : 'text-slate-650'}`}>
                          {industry.description}
                        </p>
                      </div>

                      {industry.points && industry.points.length > 0 && (
                        <div className={`pt-3 border-t border-dashed space-y-1.5 ${isDark ? 'border-slate-800/80' : 'border-slate-150'}`}>
                          {industry.points.map((pt, pIdx) => (
                            <div key={pIdx} className="flex items-start gap-1.5 text-[11px]">
                              <span className="text-amber-500 mt-0.5 select-none font-bold">✔</span>
                              <span className={isDark ? 'text-gray-300' : 'text-slate-650 font-sans'}>{pt}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* TRUSTED CLIENT SLIDER LOGOS FROM PDF PAGE 4 */}
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className={`p-8 rounded-2xl border text-center space-y-6 shadow-md transition-all duration-300 ${
                isDark ? 'border-slate-800/50 bg-[#0e1726]/60' : 'border-slate-200 bg-white'
              }`}
            >
              {(systemInfo.partnersTagline === undefined || systemInfo.partnersTagline.trim() !== '') && (
                <h4 className="text-[9px] uppercase font-black text-amber-500 tracking-[0.25em]">
                  {systemInfo.partnersTagline !== undefined ? systemInfo.partnersTagline : "PARTNERING WITH THE BEST IN INDUSTRY"}
                </h4>
              )}
              {partners.length > 0 ? (
                <div className={`grid gap-4 md:gap-6 items-center justify-items-center opacity-90 font-display ${
                  partners.length === 1 ? 'grid-cols-1 max-w-xs mx-auto' :
                  partners.length === 2 ? 'grid-cols-2 max-w-md mx-auto' :
                  partners.length === 3 ? 'grid-cols-3 max-w-lg mx-auto' :
                  partners.length === 4 ? 'grid-cols-2 md:grid-cols-4 max-w-2xl mx-auto' :
                  'grid-cols-2 md:grid-cols-5'
                }`}>
                  {partners.map((partner) => (
                    <div 
                      key={partner.id}
                      className={`p-4 border rounded-xl w-full text-center space-y-1 hover:border-amber-500/20 transition-all ${
                        isDark ? 'border-slate-700 bg-slate-800/90' : 'border-slate-300 bg-slate-100'
                      }`}
                    >
                      <p className={`text-xs font-black tracking-widest ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        {partner.name}
                      </p>
                      <span className={`text-[8.5px] block uppercase font-black font-mono tracking-tight ${partner.colorClass || 'text-slate-500'}`}>
                        {partner.subtitle}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic py-4">No companion corporations cataloged.</p>
              )}
            </motion.section>

            {/* COMPREHENSIVE SPECIALTY SOLUTIONS SECTION WITH STRATEGIC H2 HEADINGS */}
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="space-y-10 text-left"
            >
              <div className="space-y-2 border-b border-amber-500/15 pb-4">
                <span className="text-[10px] font-extrabold uppercase text-amber-500 tracking-[0.25em] block">
                  TASHA CORE CAPABILITIES
                </span>
                <h2 className={`text-2xl md:text-3.5xl font-black font-display tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Primary Construction &amp; Turnkey Project Solutions
                </h2>
                <p className={`text-xs md:text-sm font-sans max-w-3xl ${isDark ? 'text-gray-400 font-light' : 'text-slate-600 font-normal'}`}>
                  Serving Amroha, Hasanpur, Uttar Pradesh, and PAN India with advanced structural pre-engineered layouts and robust civil works.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* 1. Commercial Construction Services */}
                <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#0f172a]/40 border-slate-750/50' : 'bg-white border-slate-200 shadow-sm'} space-y-3`}>
                  <h3 className={`text-lg font-black font-display text-amber-500`}>
                    Commercial Construction Services
                  </h3>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-slate-650'}`}>
                    We engineer premium commercial building spaces, office complexes, shopping hubs, educational schools, and hospital buildings. From heavy foundation laying to custom partition facades.
                  </p>
                  <div className="text-[10.5px] font-semibold text-slate-500 flex flex-wrap gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/60 font-mono">
                    <span>#CommercialBuildingContractor</span>
                    <span>#OfficeBuildingConstruction</span>
                  </div>
                </div>

                {/* 2. Industrial Construction Solutions */}
                <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#0f172a]/40 border-slate-750/50' : 'bg-white border-slate-200 shadow-sm'} space-y-3`}>
                  <h3 className={`text-lg font-black font-display text-amber-500`}>
                    Industrial Construction Solutions
                  </h3>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-slate-650'}`}>
                    Pre-engineered PEB structures, manufacturing factories, warehouses, logistics parks, and high-strength industrial shed structures. Specialized in heavy structural steel and seismic-safe prefabrications.
                  </p>
                  <div className="text-[10.5px] font-semibold text-slate-500 flex flex-wrap gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/60 font-mono">
                    <span>#FactoryConstructionContractor</span>
                    <span>#PEBBuildingContractor</span>
                  </div>
                </div>

                {/* 3. Civil Engineering & Infrastructure Development */}
                <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#0f172a]/40 border-slate-750/50' : 'bg-white border-slate-200 shadow-sm'} space-y-3`}>
                  <h3 className={`text-lg font-black font-display text-amber-500`}>
                    Civil Engineering &amp; Infrastructure Development
                  </h3>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-slate-650'}`}>
                    Heavy public sector foundations, CPWD/PWD government civil works, road network layouts, bridge building, thermal power plant setups, and deep-soil structural reinforcements.
                  </p>
                  <div className="text-[10.5px] font-semibold text-slate-500 flex flex-wrap gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/60 font-mono">
                    <span>#InfrastructureContractor</span>
                    <span>#GovernmentCivilWork</span>
                  </div>
                </div>

                {/* 4. Interior Fit-Out & Renovation Services */}
                <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#0f172a]/40 border-slate-750/50' : 'bg-white border-slate-200 shadow-sm'} space-y-3`}>
                  <h3 className={`text-lg font-black font-display text-amber-500`}>
                    Interior Fit-Out &amp; Renovation Services
                  </h3>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-slate-655'}`}>
                    Premium interior designer configurations, fit-outs for workspace layouts, corporate aesthetics, acoustic division boards, and turnkey business refurbishments or remodeling operations.
                  </p>
                  <div className="text-[10.5px] font-semibold text-slate-500 flex flex-wrap gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/60 font-mono">
                    <span>#InteriorFitOutContractor</span>
                    <span>#BuildingRenovationServices</span>
                  </div>
                </div>

                {/* 5. Turnkey Project Management */}
                <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#0f172a]/40 border-slate-750/50' : 'bg-white border-slate-200 shadow-sm'} space-y-3`}>
                  <h3 className={`text-lg font-black font-display text-amber-500`}>
                    Turnkey Project Management
                  </h3>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-slate-655'}`}>
                    Complete design-and-build EPC solutions, timeline scheduling (digital Gantt models), class-A safety audits, resource optimization, and seamless multi-crew dynamic coordination.
                  </p>
                  <div className="text-[10.5px] font-semibold text-slate-500 flex flex-wrap gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/60 font-mono">
                    <span>#TurnkeyConstructionServices</span>
                    <span>#ProjectManagementCompany</span>
                  </div>
                </div>

                {/* 6. Local & Regional Uttar Pradesh Presence */}
                <div className={`p-6 rounded-2xl border ${isDark ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-500/5 border-amber-500/20 shadow-sm'} space-y-3`}>
                  <h3 className={`text-lg font-black font-display text-amber-500`}>
                    Local Engineering Presence
                  </h3>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                    Highly-rated construction contractor in Amroha, Hasanpur, Sambhal, and wider Uttar Pradesh. Fully equipped with on-site equipment, regional sand-reinforcements, and deep CPWD/PWD compliance credentials.
                  </p>
                  <div className="text-[10.5px] font-semibold text-amber-600 flex flex-wrap gap-2 pt-1 border-t border-amber-500/20 font-mono">
                    <span>#ConstructionCompanyInAmroha</span>
                    <span>#CivilContractorInHasanpur</span>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* PLANNING A CONSTRUCTION PROJECT? Full-width Sunset/Steel framework banner CTA */}
            <motion.section 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className="relative rounded-3xl overflow-hidden p-8 md:p-12 border border-slate-800/40 shadow-2xl bg-black"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity" 
                style={{ backgroundImage: `url('${systemInfo.ctaBgUrl || "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1200"}')` }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950 to-slate-950/60"></div>
              
              <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
                <h3 className="text-2xl md:text-3xl font-black font-display text-white">
                  Planning a Construction Project?
                </h3>
                <p className="text-xs leading-relaxed text-slate-300 font-sans max-w-lg mx-auto">
                  Let Tasha Contracts bring your engineering vision to active reality, optimized under governmental safety mandates and class-A steel tolerances.
                </p>
                <div className="pt-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab('contact')}
                    className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black uppercase tracking-widest text-xs rounded-lg transition-all shadow-md inline-block cursor-pointer"
                  >
                    Apply for Contract
                  </motion.button>
                </div>
              </div>
            </motion.section>

          </motion.div>
        )}

        {/* ==============================================
             2. ABOUT US TAB VIEW 
           ============================================== */}
        {activeTab === 'about' && (
          <motion.div 
            key="about"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-12 animate-fade-in-up"
          >
            
            {/* Header Slogan */}
            <div className="pb-5 max-w-4xl space-y-3 border-b border-slate-200">
              <span className="text-xs uppercase font-extrabold text-amber-600 tracking-wider flex items-center gap-1.5">
                <Sparkles size={12} /> {systemInfo.aboutSlogan || 'Pioneering Modern Construction Tech'}
              </span>
              <h2 className="text-3xl md:text-5xl font-black font-display tracking-tight text-slate-900 leading-tight">
                {systemInfo.aboutTitle || 'Building the Future with LGSF & Prefabricated Construction Solutions'}
              </h2>
            </div>

            {/* Main Overview Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Detailed Technical Content Left Column */}
              <div className="lg:col-span-7 space-y-8 text-left">
                
                {/* Introduction block */}
                <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-md space-y-4">
                  <h3 className="text-lg font-bold font-display border-l-4 border-amber-500 pl-3 text-slate-900">
                    {systemInfo.aboutIntroHeading || 'Trusted LGSF Engineering Since 2015'}
                  </h3>
                  <p className="text-sm md:text-base leading-relaxed text-slate-700 whitespace-pre-wrap">
                    {systemInfo.aboutDesc1 || 'Founded in 2015, Tasha Contracts India has emerged as a trusted name in modern construction technologies. We specialize in the design, manufacturing, and execution of prefabricated buildings and Light Gauge Steel Framing (LGSF) structures, delivering innovative, sustainable, and cost-effective building solutions across India.'}
                  </p>
                  {(systemInfo.aboutDesc2 || systemInfo.aboutDesc2 === undefined) && (
                    <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-wrap">
                      {systemInfo.aboutDesc2 !== undefined ? systemInfo.aboutDesc2 : 'With a dedicated team of engineers, project managers, and skilled professionals, we provide end-to-end solutions covering design, engineering, fabrication, installation, and project management.'}
                    </p>
                  )}
                </div>

                {/* Strengths Grid - 3 Columns */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-center">
                    <span className="text-2xl font-black text-amber-600 font-display block">
                      {systemInfo.aboutStat1Val || '10+ Years'}
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block">
                      {systemInfo.aboutStat1Lbl || 'Experience'}
                    </span>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-center">
                    <span className="text-2xl font-black text-amber-600 font-display block">
                      {systemInfo.aboutStat2Val || '200+ Sites'}
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block">
                      {systemInfo.aboutStat2Lbl || 'Delivered'}
                    </span>
                  </div>
                  <div className="col-span-2 sm:col-span-1 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-center">
                    <span className="text-xl font-bold text-slate-900 font-display block">
                      {systemInfo.aboutStat3Val || 'PAN India'}
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block">
                      {systemInfo.aboutStat3Lbl || 'Service Network'}
                    </span>
                  </div>
                </div>

                {/* Why Choose Us & Key Features section */}
                <div className="p-6 bg-amber-500/5 border border-amber-500/10 rounded-2xl space-y-4">
                  <h4 className="text-xs uppercase font-extrabold text-amber-700 tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-amber-600" /> Strategic Competitive Edge
                  </h4>
                  <h3 className="text-lg font-black font-display text-slate-900">
                    {systemInfo.aboutWhyChooseTitle || 'Why Choose Tasha Contracts'}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {((systemInfo.aboutWhyChoosePoints !== undefined ? systemInfo.aboutWhyChoosePoints : (INITIAL_SYSTEM_INFO.aboutWhyChoosePoints || '')) as string)
                      .split("\n")
                      .map((p: string) => p.trim())
                      .filter(Boolean)
                      .map((perk: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 bg-white/60 p-2.5 rounded-lg border border-slate-150 shadow-sm">
                          <span className="text-amber-500 text-sm">✔️</span>
                          <span className="font-semibold text-slate-800">{perk}</span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Our Strategic Targets */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm space-y-2">
                    <h4 className="font-extrabold text-amber-600 uppercase tracking-widest text-xs flex items-center gap-1">
                      🎯 Vision
                    </h4>
                    <p className="text-xs leading-relaxed text-slate-600 font-medium">
                      {systemInfo.aboutVision || "To become India's leading provider of innovative prefabricated and LGSF building solutions by delivering world-class quality, engineering excellence, and customer satisfaction."}
                    </p>
                  </div>
                  <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm space-y-2">
                    <h4 className="font-extrabold text-amber-600 uppercase tracking-widest text-xs flex items-center gap-1">
                      🚀 Mission
                    </h4>
                    <p className="text-xs leading-relaxed text-slate-600 font-medium">
                      {systemInfo.aboutMission || "To revolutionize the construction industry through modern technology, sustainable building practices, and efficient project execution while creating long-term value for our clients."}
                    </p>
                  </div>
                </div>

              </div>

              {/* MD Portrait / Corporate Card Right Column */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Dedicated founder panel */}
                {(systemInfo.founderName || systemInfo.founderRole || systemInfo.founderBio || systemInfo.founderLocation || systemInfo.founderImage) && (
                  <div className="border p-6 rounded-2xl text-center space-y-4 bg-white border-slate-200 shadow-md">
                    {/* Optimized Custom Portrait View Node */}
                    {systemInfo.founderImage && (
                      <div className={`relative mx-auto border border-amber-500/30 overflow-hidden flex items-center justify-center shadow-lg transition-all duration-300 ${
                        systemInfo.founderImageShape === 'portrait-card' 
                          ? 'w-38 h-48 rounded-2xl' 
                          : systemInfo.founderImageShape === 'squircle'
                          ? 'w-38 h-38 rounded-3xl'
                          : 'w-36 h-36 rounded-full'
                      } bg-slate-50`}>
                        <img 
                          src={optimizeImage(systemInfo.founderImage, 300) || undefined} 
                          alt={systemInfo.founderName || "Founder"}
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          decoding="async"
                          className={`w-full h-full transition-transform duration-300 ${
                            systemInfo.founderImageFit === 'contain' 
                              ? 'object-contain p-1.5' 
                              : systemInfo.founderImageFit === 'top'
                              ? 'object-cover object-top'
                              : 'object-cover object-center'
                          }`} 
                        />
                      </div>
                    )}
                    {(systemInfo.founderName || systemInfo.founderRole) && (
                      <div>
                        {systemInfo.founderName && (
                          <h4 className="font-display font-extrabold text-lg text-slate-900">
                            {systemInfo.founderName}
                          </h4>
                        )}
                        {systemInfo.founderRole && (
                          <p className="text-xs text-amber-600 uppercase font-bold">
                            {systemInfo.founderRole}
                          </p>
                        )}
                      </div>
                    )}
                    {systemInfo.founderBio && (
                      <p className="text-xs leading-relaxed text-slate-600 font-medium">
                        {systemInfo.founderBio}
                      </p>
                    )}
                    {systemInfo.founderLocation && (
                      <span className="block px-3 py-1.5 text-[10px] font-mono rounded-lg border bg-slate-50 border-slate-200 text-slate-600">
                        {systemInfo.founderLocation}
                      </span>
                    )}
                  </div>
                )}

                {/* Segment: Custom Solutions List / Our Expertise */}
                <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-md text-left space-y-4">
                  <h4 className="text-xs uppercase font-extrabold text-indigo-600 tracking-wider">
                    Our Areas of Expertise
                  </h4>
                  <p className="text-xs text-slate-500">
                    We provide complete engineering & installation solutions for the following spaces:
                  </p>
                  <div className="space-y-2">
                    {[
                      "Residential Villas & Farm Houses",
                      "Staff Accommodation Buildings",
                      "Labor Colonies & Site Offices",
                      "Schools & Educational Buildings",
                      "Hospitals & Healthcare Facilities",
                      "Commercial Buildings",
                      "Warehouses & Storage Structures",
                      "Portable Cabins & Modular Buildings",
                      "Industrial Facilities",
                      "Multi-Storey LGSF Structures"
                    ].map((domain, i) => (
                      <div key={i} className="flex items-center gap-2 hover:translate-x-1 transition-all duration-150">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                        <span className="text-xs font-semibold text-slate-700">{domain}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>



          </motion.div>
        )}

        {/* ==============================================
             3. SERVICES SEGMENT VIEW 
           ============================================== */}
        {activeTab === 'services' && (
          <div className="space-y-12">
            {!activeServiceId ? (
              <motion.div 
                key="services-list"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-12"
              >
                <div className={`pb-5 max-w-3xl space-y-3.5 border-b text-left ${isDark ? 'border-slate-850' : 'border-slate-200'}`}>
                  <span className="text-xs uppercase font-extrabold text-amber-600 tracking-wider">
                    Industrial Capabilities
                  </span>
                  <h2 className={`text-2xl md:text-4xl font-black font-display tracking-tight leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Turnkey Structural Contracting & Engineering
                  </h2>
                  <p className={`text-sm md:text-base leading-relaxed font-sans ${isDark ? 'text-gray-450 font-medium' : 'text-slate-650 font-medium'}`}>
                    From concept and approvals to manufacturing, erection and handover, we provide complete turnkey construction services under one roof. Click on any of our services to view its dedicated, SEO-optimized highlight page.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                  {services.map((service) => (
                    <div 
                      key={service.id} 
                      onClick={() => setActiveServiceId(service.id)}
                      className={`p-6 rounded-2xl space-y-4 hover:border-amber-500 transition-all duration-300 flex flex-col justify-between group border cursor-pointer ${
                        isDark 
                          ? 'bg-slate-800/10 border-slate-700/30' 
                          : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className={`w-12 h-12 flex items-center justify-center rounded-xl p-3 border transition-colors ${
                          isDark 
                            ? 'bg-slate-900 border-slate-700 text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950' 
                            : 'bg-amber-50 border-amber-100 text-amber-600 group-hover:bg-amber-500 group-hover:text-slate-950'
                        }`}>
                          <DynamicIcon name={service.iconName} size={22} />
                        </div>

                        <h3 className={`text-lg font-black font-display group-hover:text-amber-600 transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {service.name}
                        </h3>

                        <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-300' : 'text-slate-600 font-medium Line-clamp-3'}`}>
                          {service.description}
                        </p>

                        <div className={`p-3 rounded-lg border text-[11px] ${
                          isDark ? 'bg-slate-900/30 border-slate-800/50 text-gray-405' : 'bg-slate-50 border-slate-150 text-slate-600'
                        }`}>
                          <strong>Scope:</strong> {service.details}
                        </div>
                      </div>

                      <div className={`pt-4 border-t space-y-3 ${isDark ? 'border-slate-800/50' : 'border-slate-150'}`}>
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-extrabold text-amber-500 tracking-widest block">
                            Key Guarantees:
                          </span>
                          <ul className="space-y-1 text-xs">
                            {(service.features || []).slice(0, 3).map((feature, i) => (
                              <li key={i} className={`flex items-center gap-1.5 ${isDark ? 'text-gray-450' : 'text-slate-600 font-bold line-clamp-1'}`}>
                                <CheckCircle2 size={12} className="text-emerald-505" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="text-xs font-black uppercase text-amber-600 tracking-widest flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          View Detailed Service Page <ArrowRight size={13} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quote Request CTA section */}
                <div className={`p-8 text-center rounded-2xl max-w-3xl mx-auto space-y-4 border ${
                  isDark 
                    ? 'bg-slate-850/20 border-amber-500/10' 
                    : 'bg-white border-slate-205 shadow-md'
                }`}>
                  <h3 className={`text-lg font-bold font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>Require Custom CAD Design Estimations?</h3>
                  <p className={`text-xs leading-relaxed max-w-xl mx-auto ${isDark ? 'text-gray-400' : 'text-slate-650'}`}>
                    Tasha Contracts India implements deep compliance engineering audits. Let our Estimations Office review your blueprints and budget criteria to form a proposal.
                  </p>
                  <button
                    onClick={() => setActiveTab('contact')}
                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer shadow-sm transition-all"
                  >
                    Launch Estimate Builder
                  </button>
                </div>
              </motion.div>
            ) : (() => {
              const service = services.find(s => s.id === activeServiceId);
              if (!service) return null;
              
              // Filter related projects dynamically
              const relatedProjects = projects.filter(p => {
                const serviceWords = service.name.toLowerCase().split(' ');
                const hasMatchingWord = serviceWords.some(word => 
                  word.length > 3 && (p.title.toLowerCase().includes(word) || p.description.toLowerCase().includes(word))
                );
                if (hasMatchingWord) return true;
                if (service.name.toLowerCase().includes('lgsf') && (p.category === 'LGSF / Prefabricated')) return true;
                if (service.name.toLowerCase().includes('industrial') && (p.category === 'Civil Construction' || p.title.toLowerCase().includes('thermal') || p.title.toLowerCase().includes('power') || p.title.toLowerCase().includes('plant'))) return true;
                if (p.category.toLowerCase().split(' ')[0] === service.name.toLowerCase().split(' ')[0]) return true;
                return false;
              }).slice(0, 3);

              return (
                <motion.div 
                  key="service-detail"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-8 text-left animate-fade-in-up"
                >
                  {/* Floating Breadcrumb Header */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-205">
                    <button 
                      onClick={() => setActiveServiceId(null)}
                      className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-xs uppercase text-slate-700 tracking-wider transition-all cursor-pointer border border-slate-200"
                    >
                      <ArrowLeft size={14} /> Back to Services Catalog
                    </button>
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-500">
                      <span>Our Services</span>
                      <span>/</span>
                      <span className="text-amber-600 uppercase font-extrabold">{service.name}</span>
                    </div>
                  </div>

                  {/* Service Hero Badge container */}
                  <div className="relative p-8 md:p-12 rounded-3xl overflow-hidden border border-slate-200 bg-slate-950 text-white shadow-xl">
                    <div className="absolute top-0 right-0 p-8 opacity-10 text-amber-500 pointer-events-none">
                      <DynamicIcon name={service.iconName} size={150} />
                    </div>
                    <div className="max-w-3xl space-y-4 relative z-10">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-extrabold tracking-widest uppercase">
                        Service Highlight Page
                      </div>
                      <h1 className="text-3xl md:text-5xl font-black font-display tracking-tight text-white leading-tight">
                        {service.name}
                      </h1>
                      <p className="text-sm md:text-lg text-slate-300 leading-relaxed font-light">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  {/* Unique Page SEO Header Panel - transparently showing the optimized head changes to search bots & indexers */}
                  <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="text-[10px] uppercase font-extrabold text-amber-600 tracking-wider">Dynamic Meta Title:</div>
                      <div className="text-xs font-mono font-bold text-slate-800">{service.seoTitle || `${service.name} | Tasha Contracts India`}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] uppercase font-extrabold text-amber-600 tracking-wider">Dynamic Meta Description:</div>
                      <p className="text-xs font-sans text-slate-600 leading-relaxed">{service.seoDescription || service.description}</p>
                    </div>
                  </div>

                  {/* 2-Column Core Features grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                      <div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-205 shadow-xs space-y-4">
                        <h3 className="text-xl font-bold font-display text-slate-900 flex items-center gap-2">
                          <span className="w-1.5 h-6 bg-amber-500 rounded-full"></span> 
                          Core Structural Scope & Details
                        </h3>
                        <p className="text-sm text-slate-650 leading-relaxed font-sans whitespace-pre-line">
                          {service.details}
                        </p>
                      </div>

                      <div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-205 shadow-xs space-y-4">
                        <h3 className="text-lg font-bold font-display text-slate-900">
                          Standard Quality Guarantees & Certifications:
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(service.features || []).map((feature, i) => (
                            <div key={i} className="flex gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-150 items-start">
                              <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                              <div className="text-xs font-bold text-slate-700 leading-normal">{feature}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right side: Action CTAs and Estimation Inquiry */}
                    <div className="space-y-6 text-left">
                      <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-4 border border-slate-800 shadow-md">
                        <h4 className="text-md font-bold font-display text-amber-400">Request Project Estimate</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          We offer full CAD blueprints evaluation and dynamic feasibility calculations for {service.name} services. Let our direct estimations desk contact you in 24 hours.
                        </p>
                        <button
                          onClick={() => {
                            setContactForm({
                              ...contactForm,
                              subject: `Inquiry regarding ${service.name} services`
                            });
                            setActiveTab('contact');
                          }}
                          className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2 shadow-xs font-extrabold"
                        >
                          Launch Quote Builder <ArrowRight size={14} />
                        </button>
                      </div>

                      {/* Trust Badge Indicators */}
                      <div className="p-6 rounded-2xl bg-white border border-slate-205 shadow-sm space-y-4">
                        <h4 className="text-xs uppercase font-extrabold text-slate-505 tracking-wider">Compliance Matrix</h4>
                        <div className="space-y-3.5">
                          <div className="flex gap-3 items-start">
                            <Shield className="text-amber-500 mt-0.5 shrink-0" size={16} />
                            <div>
                              <div className="text-xs font-bold text-slate-900">Safety Compliant</div>
                              <p className="text-[11px] text-slate-550">ISO 45001 Standard safety audits applied to all project zones.</p>
                            </div>
                          </div>
                          <div className="flex gap-3 items-start">
                            <Award className="text-amber-500 mt-0.5 shrink-0" size={16} />
                            <div>
                              <div className="text-xs font-bold text-slate-900">Government Registered</div>
                              <p className="text-[11px] text-slate-550">All frameworks match NBC (National Building Code) parameters strictly.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Related Projects section */}
                  {relatedProjects.length > 0 && (
                    <div className="space-y-4 pt-6 text-left">
                      <h3 className="text-xl font-bold font-display text-slate-900 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-amber-500 rounded-full"></span> 
                        Sector Case Studies & Related Executions
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {relatedProjects.map((p) => (
                          <div 
                            key={p.id}
                            onClick={() => {
                              setActivePopupProject(p);
                            }}
                            className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm cursor-pointer hover:shadow-md transition-all h-64"
                          >
                            <img 
                              src={optimizeImage(p.image, 400) || undefined} 
                              alt={p.title}
                              loading="lazy"
                              decoding="async"
                              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                            <div className="absolute inset-x-0 bottom-0 p-5 text-white text-left space-y-1">
                              <span className="px-2 py-0.5 text-[9px] uppercase font-black bg-amber-500 text-slate-950 rounded">
                                {p.category}
                              </span>
                              <h4 className="font-bold text-sm tracking-tight line-clamp-1">{p.title}</h4>
                              <p className="text-[10px] text-slate-350 flex items-center gap-1 font-mono font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> {p.location}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })()}
          </div>
        )}

        {/* ==============================================
             4. PROJECTS GALLERY VIEW WITH DETAILED POPUP 
           ============================================== */}
        {activeTab === 'projects' && (
          <motion.div 
            key="projects"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-10 animate-fade-in-up"
          >
            
            <div className={`flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <div>
                <span className="text-xs uppercase font-extrabold text-amber-600 tracking-wider">
                  Site Portfolios
                </span>
                <h2 className={`text-3xl md:text-4xl font-extrabold font-display mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  National Construction Exhibits
                </h2>
                <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-slate-550'}`}>
                  Toggle completed or actual ongoing sites specified directly in the Tasha brochure
                </p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {uniqueCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setProjectFilterCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                      projectFilterCategory === cat 
                        ? 'bg-amber-500 text-slate-950 font-bold shadow' 
                        : isDark 
                          ? 'bg-slate-800/40 text-gray-400 hover:bg-slate-800'
                          : 'bg-white border border-slate-205 text-slate-700 hover:bg-slate-100 shadow-sm'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Search and Filters Segment */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:max-w-md">
                <input 
                  type="text" 
                  value={projectSearchQuery}
                  onChange={(e) => setProjectSearchQuery(e.target.value)}
                  placeholder="Search projects by name, location, or client..."
                  className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 ${
                    isDark 
                      ? 'bg-slate-900 border border-slate-700 text-white focus:border-amber-500' 
                      : 'bg-white border border-slate-205 text-slate-800 focus:border-amber-500 focus:bg-slate-50'
                  }`}
                />
                <Search size={14} className="absolute left-3.5 top-3.5 text-gray-400" />
              </div>

              <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                <span>Displaying <strong>{filteredProjects.length}</strong> of <strong>{projects.length}</strong> construction portfolios</span>
              </div>
            </div>

            {/* Main Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <div 
                  key={project.id}
                  onClick={() => setActivePopupProject(project)}
                  className={`rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 group flex flex-col justify-between border ${
                    isDark 
                      ? 'bg-slate-800/10 border-slate-700/20 hover:border-amber-500/30' 
                      : 'bg-white border-slate-205 hover:border-amber-500/40 shadow-md hover:shadow-lg'
                  }`}
                >
                  <div className="relative h-48 overflow-hidden bg-slate-900">
                    <img 
                      src={optimizeImage(project.image, 400) || undefined} 
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-350" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                    
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-slate-950/80 border border-slate-800 text-[9px] font-mono font-bold uppercase rounded-full text-amber-500">
                      {project.status === 'Completed' ? 'Completed' : 'Ongoing Site Work'}
                    </span>
                  </div>

                  <div className="p-5 space-y-3 flex-grow flex flex-col justify-between">
                    <div className="space-y-1">
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md ${
                        isDark ? 'text-amber-400 bg-amber-500/5' : 'text-amber-700 bg-amber-50 border border-amber-200/40'
                      }`}>
                        {project.category}
                      </span>
                      <h4 className={`text-lg font-bold font-display pt-1 line-clamp-1 ${isDark ? 'text-white' : 'text-slate-950 font-extrabold'}`}>
                        {project.title}
                      </h4>
                      <p className={`text-xs flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500 font-medium'}`}>
                        <MapPin size={12} className="text-amber-500" />
                        {project.location}
                      </p>
                    </div>

                    <p className={`text-xs pt-2 line-clamp-2 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {project.description}
                    </p>

                    <div className={`pt-3 border-t flex items-center justify-between text-[11px] ${
                      isDark ? 'border-slate-800/60' : 'border-slate-150'
                    }`}>
                      <div>
                        <span className={`block uppercase tracking-wider text-[9px] ${isDark ? 'text-gray-400' : 'text-slate-500 font-bold'}`}>Authority:</span>
                        <span className={`font-semibold truncate max-w-[120px] block ${isDark ? 'text-white' : 'text-slate-850'}`}>{project.client}</span>
                      </div>
                      
                      <span className={`font-extrabold group-hover:underline flex items-center gap-1 cursor-pointer ${
                        isDark ? 'text-amber-400' : 'text-amber-700'
                      }`}>
                        View Details
                        <ArrowUpRight size={13} />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Zero state matches */}
            {filteredProjects.length === 0 && (
              <div className={`p-12 text-center text-xs rounded-2xl max-w-lg mx-auto border ${
                isDark ? 'bg-slate-800/10 border-slate-800 text-gray-400' : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}>
                No projects matched your specified search query or category pills. Consider refreshing filter controls.
              </div>
            )}



          </motion.div>
        )}

        {/* ==============================================
             5. OUR TEAM VIEW - CORPORATE LEADERSHIP DIRECTORY
           ============================================== */}
        {activeTab === 'team' && (
          <motion.div 
            key="team"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-10 animate-fade-in-up"
          >
            {/* Beautiful Team Banner Poster block */}
            <div 
              className="relative w-full h-48 md:h-64 rounded-3xl overflow-hidden bg-cover bg-center flex items-end p-6 md:p-8 shadow-md"
              style={{ 
                backgroundImage: `url('${systemInfo.teamBgUrl || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200"}')` 
              }}
            >
              <div className="absolute inset-0 bg-slate-950/30 bg-gradient-to-t from-slate-950/85 via-slate-950/35 to-transparent"></div>
              <div className="relative z-10 text-left">
                <span className="text-xs uppercase font-extrabold text-amber-400 tracking-widest block font-sans">
                  Where Expertise Meets Excellence
                </span>
                <h2 className="text-2xl md:text-4xl font-extrabold font-display mt-1 text-white">
                  Our Team, Your Strength
                </h2>
                <p className="text-[11px] md:text-sm mt-1.5 font-sans text-slate-200 lg:max-w-3xl font-light leading-relaxed">
                  The technical planners, architectural structural modelers, and senior civil project managers executing high-performance modern steel framing formats safely.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map((member, idx) => {
                const displayName = /^\p{Emoji}/u.test(member.name) ? member.name : `👷 ${member.name}`;
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    key={member.id}
                    className={`border rounded-3xl p-6 md:p-8 hover:shadow-xl transition-all h-full flex flex-col justify-between text-left ${
                      isDark 
                        ? 'bg-slate-950/40 border-slate-800 hover:border-slate-700/60' 
                        : 'bg-white border-slate-200 hover:border-slate-350 shadow-sm'
                    }`}
                  >
                    <div>
                      {/* Top Orange Square Box with Icon */}
                      <div className="bg-amber-500 text-slate-950 rounded-2xl p-4 w-14 h-14 flex items-center justify-center mb-6 shadow-sm">
                        <DynamicIcon name={member.image || 'HardHat'} size={24} />
                      </div>

                      {/* Display Name with Work Emoji Prepended */}
                      <h3 className={`text-xl md:text-[22px] font-black font-display tracking-tight leading-snug mb-4 ${isDark ? 'text-amber-500' : 'text-amber-600'}`}>
                        {displayName}
                      </h3>

                      {/* Short Description (member.role) */}
                      <p className={`text-sm font-sans font-medium leading-relaxed mb-5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        {member.role}
                      </p>

                      {/* Scope Box */}
                      <div className={`border rounded-2xl p-5 mb-5 text-xs leading-relaxed ${
                        isDark 
                          ? 'bg-slate-900/30 border-slate-800/80 text-gray-400' 
                          : 'bg-slate-50 border-slate-200/60 text-slate-650'
                      }`}>
                        <p className="font-sans">
                          <strong className={`font-extrabold mr-1.5 ${isDark ? 'text-white' : 'text-slate-950'}`}>Scope:</strong>
                          {member.bio}
                        </p>
                      </div>

                      {/* Separator Line */}
                      <div className={`border-t my-5 ${isDark ? 'border-slate-850' : 'border-slate-150'}`} />

                      {/* Guarantees Section */}
                      <div className="space-y-3.5">
                        <span className="text-[10px] uppercase font-mono font-black tracking-widest text-amber-600 dark:text-amber-500 block">
                          Guarantees:
                        </span>
                        <ul className="space-y-3">
                          {(member.guarantees && member.guarantees.length > 0 
                            ? member.guarantees 
                            : [
                                "Premium curtain-wall structural glass",
                                "Optimized multi-escalator vertical elevators",
                                "High-end structural entrance lobbies",
                                "Smart energy conservation frameworks"
                              ]
                          ).map((guarantee, gIdx) => (
                            <li key={gIdx} className="flex items-start gap-2.5 text-xs font-sans font-bold text-slate-650 dark:text-slate-300">
                              <span className="text-emerald-500 shrink-0 mt-0.5">
                                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                  <circle cx="12" cy="12" r="10" stroke="currentColor" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                                </svg>
                              </span>
                              <span className={`${isDark ? 'text-gray-300' : 'text-slate-700'}`}>{guarantee}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className={`pt-4 mt-6 border-t flex items-center justify-between text-[10px] font-bold uppercase tracking-widest font-mono ${isDark ? 'border-slate-800 text-gray-500' : 'border-slate-150 text-slate-400'}`}>
                      <span>Tasha Contracts</span>
                      <span className="text-amber-500 font-sans font-black tracking-normal">★★★</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {team.length === 0 && (
              <div className={`p-16 text-center border rounded-2xl space-y-4 ${
                isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-205'
              }`}>
                <div className="text-amber-500 text-4xl font-mono">✦</div>
                <h4 className={`text-base font-bold font-display ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  No Live Executive Directories
                </h4>
                <p className={`text-xs max-w-sm mx-auto ${isDark ? 'text-gray-400' : 'text-slate-650'}`}>
                  Please utilize the administrator control system to publish registered corporate team executives.
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* ==============================================
             6. HR CAREER VACANCY PORTAL VIEW 
           ============================================== */}
        {activeTab === 'careers' && (
          <motion.div 
            key="careers"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-10 animate-fade-in-up"
          >
            
            <div className={`pb-5 max-w-3xl space-y-2 border-b ${isDark ? 'border-slate-850' : 'border-slate-200'}`}>
              <span className="text-xs uppercase font-extrabold text-amber-600 tracking-wider">
                Employment Center
              </span>
              <h2 className={`text-3xl md:text-4xl font-extrabold font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Join Tasha Contracts India Team
              </h2>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-550'}`}>
                Punctuality, respect, and mutual growth. Register your candidacy to direct future civil developments.
              </p>
            </div>

            <CareersSection careers={careers} onApply={handleCareerApply} themeMode={themeMode} />

          </motion.div>
        )}

        {/* ==============================================
             7. CONTACT US / WA / G-MAP PORTAL VIEW 
           ============================================== */}
        {activeTab === 'contact' && (
          <motion.div 
            key="contact"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-12 animate-fade-in-up"
          >
            
            <div className={`pb-5 max-w-3xl space-y-2 border-b ${isDark ? 'border-slate-850' : 'border-slate-200'}`}>
              <span className="text-xs uppercase font-extrabold text-amber-600 tracking-wider">
                Immediate Coordinates
              </span>
              <h2 className={`text-3xl md:text-4xl font-extrabold font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Let's Outline Your Structural Vision
              </h2>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-550'}`}>
                Whether a municipal bidding process or an eco-lodge project, our estimators are available.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Contact Information Cards Column */}
              <div className="lg:col-span-4 space-y-4">
                
                <div className={`p-5 border rounded-2xl space-y-3.5 ${
                  isDark ? 'bg-slate-800/10 border-slate-700/30' : 'bg-white border-slate-200 shadow-md'
                }`}>
                  <h3 className="text-sm font-black uppercase tracking-wider text-amber-600">Contact Channels</h3>
                  
                  <div className="space-y-3 text-xs">
                    <div className="flex items-start gap-2.5">
                      <MapPin size={16} className="text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <strong className={isDark ? 'text-white': 'text-slate-950 font-bold'}>Address (Brochure official):</strong>
                        <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-slate-600 font-medium'}`}>{systemInfo.address}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Mail size={16} className="text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <strong className={isDark ? 'text-white': 'text-slate-950 font-bold'}>Email Address:</strong>
                        <p className="text-amber-600 mt-0.5 font-bold hover:underline">
                          <a href={`mailto:${systemInfo.email}`}>{systemInfo.email}</a>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Phone size={16} className="text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <strong className={isDark ? 'text-white': 'text-slate-950 font-bold'}>Call Center:</strong>
                        <p className={`mt-0.5 font-bold ${isDark ? 'text-gray-300' : 'text-slate-800'}`}>{systemInfo.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Business operating hours */}
                <div className={`p-5 rounded-2xl text-xs space-y-2 border ${
                  isDark ? 'bg-slate-800/10 border-slate-800 text-white' : 'bg-white border-slate-200 shadow-md text-slate-805'
                }`}>
                  <h4 className={`font-bold uppercase font-display ${isDark ? 'text-white' : 'text-slate-950 text-sm'}`}>Operating Hours</h4>
                  <p className={isDark ? 'text-gray-400' : 'text-slate-650'}>{systemInfo.workingHours}</p>
                  <p className="text-[10px] text-gray-500 uppercase font-bold">{systemInfo.emergencySupport || "Emergency Support: 24/7 client hotline"}</p>
                </div>

                {/* Mock Google Map Simulator */}
                <div className={`p-4 rounded-2xl text-xs border space-y-3 ${
                  isDark ? 'bg-slate-800/10 border-slate-800Text' : 'bg-white border-slate-200 shadow-md'
                }`}>
                  <h4 className={`font-bold uppercase flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <MapPin size={14} className="text-amber-500" /> {systemInfo.mapHeader || "Ground Floor Shop, Dhakka Amroha, (Uttar Pradesh)"}
                  </h4>
                  
                  <div className={`h-44 border rounded-xl relative overflow-hidden flex items-center justify-center text-center p-4 ${
                    isDark ? 'bg-slate-900 border-slate-750' : 'bg-slate-100 border-slate-205'
                  }`}>
                    <div className="absolute inset-0 opacity-15 bg-cover" style={{ backgroundImage: `url('${systemInfo.mapMediaUrl || systemInfo.mapBgUrl || "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=400"}')` }}></div>
                    <div className="relative z-10 space-y-2">
                      <span className="px-2.5 py-0.5 bg-amber-500 text-slate-950 font-bold text-[9px] uppercase rounded">MAP SATELLITE</span>
                      <p className={`text-[10px] leading-relaxed ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                        {systemInfo.mapDescription || "Tasha Contracts Corporate Headquarters & Estimation Workshop. Near National Highway Transit, Uttar Pradesh, India."}
                      </p>
                      <button 
                        onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(systemInfo.address)}`, '_blank')}
                        className={`text-[10px] font-black uppercase hover:underline ${isDark ? 'text-amber-400' : 'text-indigo-600'}`}
                      >
                        Open In Google Maps External ↗
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Professional Inquiry Estimating Form Column */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* 1. Bid Estimator Quote form */}
                <QuoteForm onQuoteSubmit={handleQuoteSubmit} themeMode={themeMode} />

                {/* 2. Direct Support Email form */}
                <form onSubmit={handleContactSubmit} className={`p-6 border rounded-2xl space-y-4 text-left ${
                  isDark ? 'bg-slate-800/10 border-slate-800' : 'bg-white border-slate-200/80 shadow-md'
                }`}>
                  <h4 className={`text-sm font-bold font-display uppercase border-l-2 border-amber-500 pl-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Send General Email Message
                  </h4>

                  {contactStatus === 'success' && (
                    <div className="p-3 bg-emerald-500/15 text-emerald-350 text-xs rounded border border-emerald-500/35 flex items-center gap-2 font-bold">
                      <CheckCircle2 size={16} />
                      <span>Message sent! Our customer office will call or email you soon.</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      required
                      placeholder="Your Name *"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className={`w-full px-3.5 py-2.5 rounded text-xs transition-colors focus:ring-1 focus:ring-amber-500/20 focus:outline-none ${
                        isDark 
                          ? 'bg-slate-900 border border-slate-700 text-white focus:border-amber-500' 
                          : 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-amber-500 focus:bg-white'
                      }`}
                    />
                    <input 
                      type="email" 
                      required
                      placeholder="Email Address *"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className={`w-full px-3.5 py-2.5 rounded text-xs transition-colors focus:ring-1 focus:ring-amber-500/20 focus:outline-none ${
                        isDark 
                          ? 'bg-slate-900 border border-slate-700 text-white focus:border-amber-500' 
                          : 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-amber-500 focus:bg-white'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      placeholder="Mobile Number"
                      value={contactForm.mobile}
                      onChange={(e) => setContactForm({ ...contactForm, mobile: e.target.value })}
                      className={`w-full px-3.5 py-2.5 rounded text-xs transition-colors focus:ring-1 focus:ring-amber-500/20 focus:outline-none ${
                        isDark 
                          ? 'bg-slate-900 border border-slate-700 text-white focus:border-amber-500' 
                          : 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-amber-500 focus:bg-white'
                      }`}
                    />
                    <input 
                      type="text" 
                      placeholder="Subject / Work Area"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      className={`w-full px-3.5 py-2.5 rounded text-xs transition-colors focus:ring-1 focus:ring-amber-500/20 focus:outline-none ${
                        isDark 
                          ? 'bg-slate-900 border border-slate-700 text-white focus:border-amber-500' 
                          : 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-amber-500 focus:bg-white'
                      }`}
                    />
                  </div>

                  <textarea 
                    rows={2}
                    required
                    placeholder="Describe your message or questions *"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded text-xs transition-colors focus:ring-1 focus:ring-amber-500/20 focus:outline-none ${
                      isDark 
                        ? 'bg-slate-900 border border-slate-700 text-white focus:border-amber-500' 
                        : 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-amber-500 focus:bg-white'
                    }`}
                  />

                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold rounded uppercase tracking-wider cursor-pointer"
                  >
                    Send Email Message
                  </button>
                </form>

              </div>

            </div>

          </motion.div>
        )}

        {/* ==============================================
             8. ADMIN CONFIGURATION WORKFLOW VIEW
           ============================================== */}
        {activeTab === 'admin' && (
          <motion.div 
            key="admin"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="animate-fade-in-up"
          >
            <AdminPanel 
              projects={projects}
              services={services}
              testimonials={testimonials}
              team={team}
              industries={industries}
              certificates={certificates}
              careers={careers}
              quotes={quotes}
              contacts={contacts}
              applications={applications}
              systemInfo={systemInfo}
              partners={partners}
              onUpdateProjects={updateProjects}
              onUpdateServices={updateServices}
              onUpdateTestimonials={updateTestimonials}
              onUpdateTeam={updateTeam}
              onUpdateIndustries={updateIndustries}
              onUpdateCertificates={updateCertificates}
              onUpdateCareers={updateCareers}
              onUpdateQuotes={updateQuotes}
              onUpdateContacts={updateContacts}
              onUpdateSystemInfo={updateSystemInfo}
              onUpdatePartners={updatePartners}
              isDark={isDark}
              dbMode={dbMode}
              onForceUploadToCloud={forceUploadAllToCloud}
              onForceDownloadFromCloud={forceDownloadAllFromCloud}
            />
          </motion.div>
        )}

        {/* ==============================================
             WEB MANAGER (MEDIA) PORTAL VIEW
           ============================================== */}
        {activeTab === 'webmanager' && (
          <motion.div 
            key="webmanager"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="animate-fade-in-up"
          >
            <WebMediaManager 
              systemInfo={systemInfo}
              projects={projects}
              team={team}
              onUpdateSystemInfo={updateSystemInfo}
              onUpdateProjects={updateProjects}
              onUpdateTeam={updateTeam}
              isDark={isDark}
            />
          </motion.div>
        )}

        {/* ==============================================
             9. PRIVACY POLICY PAGE
           ============================================== */}
        {activeTab === 'privacy' && (
          <motion.div 
            key="privacy"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-12 animate-fade-in-up"
          >
            {/* Header Slogan */}
            <div className={`pb-6 max-w-3xl space-y-3 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <span className="text-xs uppercase font-extrabold text-amber-600 tracking-wider flex items-center gap-1.5">
                <Lock size={12} /> Confidentiality & Trust
              </span>
              <h2 className={`text-3xl md:text-5xl font-black font-display tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Privacy Policy
              </h2>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-slate-650'}`}>
                Last updated: June 2026. Tasha Contracts India is fully committed to safeguarding your private corporate blueprints, project inquiries, and personal details.
              </p>
            </div>

            {/* Grid of Key Information Collected and Used */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left column: Collected data points */}
              <div className="lg:col-span-7 space-y-6">
                <div className={`p-6 md:p-8 rounded-2xl border ${
                  isDark ? 'bg-[#0b1524]/60 border-slate-800' : 'bg-white border-slate-200 shadow-md shadow-slate-100/40'
                }`}>
                  <h3 className={`text-base font-bold font-display uppercase tracking-wider mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <span className="w-1.5 h-6 bg-amber-500 rounded-sm"></span>
                    What Information is Collected
                  </h3>
                  <p className={`text-xs mb-6 leading-relaxed ${isDark ? 'text-gray-400' : 'text-slate-600 font-medium'}`}>
                    When you submit drawings, apply for bids, register queries, or use Tasha estimator workflows, we compile specific client coordinates to authenticate and price projects accurately:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { title: "Personal Details", desc: "Full Name, Email addresses, and primary direct phone coordinates for persistent contract communications." },
                      { title: "Company Parameters", desc: "Corporate entity and business registration figures to match formal B2B invoicing standards." },
                      { title: "Project Blueprint data", desc: "CAD files, elevation drawings, structural specifications, site coordinates, and terrain surveys." },
                      { title: "Contract Request Specs", desc: "Bidding deadlines, budget allocations, material requirements (e.g. LGSF weight ratios), and timelines." }
                    ].map((item, idx) => (
                      <div key={idx} className={`p-4 rounded-xl border transition-colors ${
                        isDark ? 'bg-[#050D1A]/60 border-slate-800 hover:border-amber-500/20' : 'bg-slate-50 border-slate-150 hover:border-amber-500/30'
                      }`}>
                        <h4 className={`text-xs font-extrabold uppercase tracking-wider mb-1 text-amber-500`}>{item.title}</h4>
                        <p className={`text-[11px] leading-relaxed ${isDark ? 'text-gray-400' : 'text-slate-600 font-medium'}`}>{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`p-6 md:p-8 rounded-2xl border ${
                  isDark ? 'bg-[#0b1524]/60 border-slate-800' : 'bg-white border-slate-200 shadow-md shadow-slate-100/40'
                }`}>
                  <h3 className={`text-base font-bold font-display uppercase tracking-wider mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <span className="w-1.5 h-6 bg-amber-500 rounded-sm"></span>
                    How Your Information is Utilized
                  </h3>
                  <div className="space-y-4">
                    {[
                      { title: "Project Inquiries & Direct Consultation", desc: "Analyzing your terrain details and layout dimensions to coordinate expert engineering advice." },
                      { title: "Quotation & Estimatation Generation", desc: "Formatting highly precise, customized material takeoff sheets, labor projections, and pre-engineered blueprints." },
                      { title: "Contract Processing & Execution", desc: "Formulating formal engineering agreements, coordinating work orders, and executing structural steel panel installations." },
                      { title: "Client Support Operations", desc: "Answering design compliance inquiries and sending engineering updates via direct coordinates or WhatsApp." }
                    ].map((item, idx) => (
                      <div key={idx} className="flex gap-3">
                        <div className="mt-0.5"><CheckCircle2 size={15} className="text-emerald-500 shrink-0" /></div>
                        <div>
                          <h4 className={`text-xs font-extrabold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.title}</h4>
                          <p className={`text-[11px] leading-relaxed ${isDark ? 'text-gray-400' : 'text-slate-600 font-medium'}`}>{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right column: Data Protection & Legal Details */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Data Protection card */}
                <div className={`p-6 rounded-2xl border ${
                  isDark ? 'bg-amber-500/5 border-amber-500/10' : 'bg-amber-50/10 border-amber-500/25 shadow-md'
                }`}>
                  <div className="flex items-center gap-2.5 mb-3">
                    <ShieldCheck size={20} className="text-amber-500" />
                    <h3 className={`text-xs font-extrabold uppercase tracking-wider font-display ${isDark ? 'text-amber-400' : 'text-amber-800'}`}>
                      Strict Data Protection Policy
                    </h3>
                  </div>
                  <p className={`text-xs leading-relaxed mb-3 ${isDark ? 'text-gray-300' : 'text-slate-700 font-medium'}`}>
                    Tasha Contracts India enforces highly strict database security layouts. All submitted contract briefs, personal details, and architectural models are processed on highly secured cloud servers shielded behind strict security access tokens. 
                  </p>
                  <p className={`text-[11.5px] leading-relaxed ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                    We prevent unauthorized intrusions, data leaks, or layout breaches through standard active encryption keys (AES-256 equivalent standard protocols on production-grade infrastructure).
                  </p>
                </div>

                {/* Info Sharing card */}
                <div className={`p-6 rounded-2xl border ${
                  isDark ? 'bg-[#0b1524]/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}>
                  <h4 className={`text-xs font-black uppercase tracking-wider mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Third-Party Disclosure
                  </h4>
                  <p className={`text-[11px] leading-relaxed ${isDark ? 'text-gray-400' : 'text-slate-600 font-medium'}`}>
                    We guarantee absolute confidentiality of your design parameters. We **never sell, trade, rent, or lease** client coordinates or elevation blueprints to third-party marketing entities. Information is only shared with trusted engineering sub-contractors directly involved in your project realization under strict NDA agreements.
                  </p>
                </div>

                {/* Cookies card */}
                <div className={`p-6 rounded-2xl border ${
                  isDark ? 'bg-[#0b1524]/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}>
                  <h4 className={`text-xs font-black uppercase tracking-wider mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Cookies & Preferences
                  </h4>
                  <p className={`text-[11px] leading-relaxed ${isDark ? 'text-gray-400' : 'text-slate-600 font-medium'}`}>
                    Tasha website implements lightweight system cookies solely to remember user preferred parameters such as visual theme states (Light/Dark mode layouts) and estimator input history in your local storage buffer.
                  </p>
                </div>

                {/* Rights card */}
                <div className={`p-6 rounded-2xl border ${
                  isDark ? 'bg-[#0b1524]/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}>
                  <h4 className={`text-xs font-black uppercase tracking-wider mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Your Corporate Rights
                  </h4>
                  <ul className={`text-[11px] list-disc list-inside space-y-1.5 leading-relaxed ${isDark ? 'text-gray-400' : 'text-slate-600 font-semibold'}`}>
                    <li>Right to view collected project data sheets.</li>
                    <li>Right to request rapid corrections on estimates.</li>
                    <li>Right to request permanent deletion of your CAD entries.</li>
                  </ul>
                </div>

                {/* Helpline card */}
                <div className={`p-6 rounded-2xl border ${
                  isDark ? 'bg-[#050D1A]/60 border-slate-800' : 'bg-slate-100/75 border-slate-200'
                }`}>
                  <h4 className={`text-xs font-black uppercase tracking-wider mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Privacy Administration Office
                  </h4>
                  <p className={`text-[11px] leading-relaxed mb-2 ${isDark ? 'text-gray-400' : 'text-slate-600 font-medium'}`}>
                    Contact our administration desk to manage your corporate blueprints or request accounts deletion:
                  </p>
                  <div className="space-y-1 text-[11px] font-bold">
                    <p className="flex items-center gap-1.5 text-amber-600">
                      <Mail size={12} /> {systemInfo.email}
                    </p>
                    <p className="flex items-center gap-1.5 text-amber-600">
                      <Phone size={12} /> {systemInfo.phone}
                    </p>
                    <p className="text-slate-500 font-semibold text-[10px] mt-1">
                      Office: {systemInfo.address}
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </motion.div>
        )}

        {/* ==============================================
             10. TERMS & CONDITIONS PAGE
           ============================================== */}
        {activeTab === 'terms' && (
          <motion.div 
            key="terms"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-12 animate-fade-in-up"
          >
            {/* Header Slogan */}
            <div className={`pb-6 max-w-3xl space-y-3 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <span className="text-xs uppercase font-extrabold text-amber-600 tracking-wider flex items-center gap-1.5">
                <Scale size={12} /> Legal Binding Framework
              </span>
              <h2 className={`text-3xl md:text-5xl font-black font-display tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Terms & Conditions
              </h2>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-slate-655'}`}>
                Last updated: June 2026. Please read these terms carefully before submitting project bids or authorizing Tasha Contracts India to start structural steel panel fabrication.
              </p>
            </div>

            {/* Terms and Conditions structured details */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              <div className="lg:col-span-8 space-y-6">
                
                {[
                  {
                    title: "1. Acceptance of Terms",
                    content: "By accessing, browsing, submitting inquiries, or drafting estimate configurations on the Tasha Contracts India portal, you legally acknowledge and agree to comply with these Terms & Conditions. If you do not accept these parameters, you must refrain from utilizing our online estimators or bidding infrastructure."
                  },
                  {
                    title: "2. Scope of Services Offered",
                    content: "Tasha Contracts India provides engineering consultation, structural analysis, pre-engineered Light Gauge Steel Framing (LGSF) supply, prefabricated panel fabrication, civil concrete alignment, MEP laying, and turnkey contracting solutions. All designs generated online serve as preliminary estimates and are subject to physical on-site soil evaluations and CAD approval."
                  },
                  {
                    title: "3. Quotations, Pricing & Contracts",
                    content: "Online estimates are subject to material price fluctuations (steel, concrete, wiring). Formal binding quotations remain valid for precisely 15 calendar days from issuance. CRITICAL RULE: Physical site mobilization, raw material fabrication under custom measurements, and general project execution will ONLY initiate after a formal written mutual agreement is authorized, and contract approval is officially executed by representatives of both parties."
                  },
                  {
                    title: "4. User & Client Responsibilities",
                    content: "Our clients are solely responsible for ensuring that all submitted CAD drawings, elevation benchmarks, soil load-bearing certificates, and local planning coordinates are legally accurate and represent true parameters. Tasha Contracts India accepts no liability for structural modifications arising from faulty pre-submitted layout plans."
                  },
                  {
                    title: "5. Payment Terms & Milestone Invoicing",
                    content: "Payments must align strictly with the schedule specified in the mutually accepted written contract. Typical terms integrate mobilization advance percentages, milestone invoices synchronized with on-site LGSF panel erections, and final retention releases post inspection. Late payments grant Tasha the administrative authority to halt on-site fabrication to mitigate structural hazard indices."
                  },
                  {
                    title: "6. Project Timelines & Site Conditions",
                    content: "Tasha Contracts is highly dedicated to executing prefabricated structures on or ahead of schedule. However, timelines remain subject to Force Majeure parameters including extreme terrain weather, government labor restrictions, custom logistics halts, and client-side delay variables (delayed CAD approvals or payment milestones)."
                  },
                  {
                    title: "7. Intellectual Property & Drawings Protection",
                    content: "All structural blueprint catalogs, customized light gauge steel profiles, code modules, estimating equations, graphics, layouts, and system logic on this platform are the exclusive intellectual property of Tasha Contracts India. Unauthorized copying, reverse-engineering, or commercial duplication of our proprietary LGSF spacing templates is strictly prohibited."
                  },
                  {
                    title: "8. Limitation of Liability",
                    content: "Tasha Contracts India crafts buildings strictly under Indian Standards (IS), CPWD specifications, and relevant structural codes. We assume no liability for indirect, consequential, or accidental damages arising from unauthorized structural renovations carried out post occupancy delivery by client-appointed third-party workers."
                  },
                  {
                    title: "9. Cancellation Policy",
                    content: "Any cancellation request must be submitted formally in writing. In the event of contract termination, the client warrants immediate compensation for all customized steel panels fabricated up to that hour, standard material restocking costs, and mobilization/demobilization expenditures incurred by our engineering team."
                  }
                ].map((term, index) => (
                  <div key={index} className={`p-6 md:p-8 rounded-2xl border ${
                    isDark ? 'bg-[#0b1524]/60 border-slate-800' : 'bg-white border-slate-200 shadow-md shadow-slate-100/40'
                  }`}>
                    <h3 className={`text-sm md:text-base font-bold font-display uppercase tracking-wider mb-3 ${
                      isDark ? 'text-amber-500' : 'text-slate-900 border-l-3 border-amber-500 pl-3'
                    }`}>
                      {term.title}
                    </h3>
                    <p className={`text-xs md:text-xs leading-relaxed ${isDark ? 'text-gray-300' : 'text-slate-650 font-medium'}`}>
                      {term.content}
                    </p>
                  </div>
                ))}

              </div>

              {/* Sidebar: Compliance & Quick resolution Details */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Visual quote/banner */}
                <div className={`p-6 rounded-2xl border ${
                  isDark ? 'bg-amber-500/5 border-amber-500/10' : 'bg-amber-50/10 border-amber-500/25 shadow-sm'
                }`}>
                  <h4 className={`text-xs font-black uppercase tracking-wider mb-2 ${isDark ? 'text-amber-450' : 'text-amber-700 font-bold'}`}>
                    Mutual Commitment
                  </h4>
                  <p className={`text-xs leading-relaxed italic ${isDark ? 'text-gray-300' : 'text-slate-600 font-medium'}`}>
                    "Engineering excellence is sustained purely by architectural honesty, legal transparency, and mutual trust."
                  </p>
                  <p className="text-[10px] font-bold text-slate-500 mt-2 text-right">
                    — Talib Choudhary, MD
                  </p>
                </div>

                {/* Regulatory Jurisdiction */}
                <div className={`p-6 rounded-2xl border ${
                  isDark ? 'bg-[#0b1524]/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}>
                  <h4 className={`text-xs font-extrabold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <Scale size={13} className="text-amber-500" />
                    Governing Law
                  </h4>
                  <p className={`text-[11px] leading-relaxed mb-3 ${isDark ? 'text-gray-400' : 'text-slate-600 font-medium'}`}>
                    All contracts, transactions, estimations, and legal disputes arising from use of Tasha website services are strictly governed and construed in compliance with the laws of the Republic of India.
                  </p>
                  <p className={`text-[11px] leading-relaxed ${isDark ? 'text-gray-400' : 'text-slate-650'}`}>
                    Any judicial proceedings or mediation will fall under the jurisdiction of the competent courts of Amroha, Uttar Pradesh, India.
                  </p>
                </div>

                {/* Contact Helpdesk */}
                <div className={`p-6 rounded-2xl border ${
                  isDark ? 'bg-[#0b1524]/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}>
                  <h4 className={`text-xs font-extrabold uppercase tracking-wider mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Direct Contact for Disputes
                  </h4>
                  <p className={`text-[11px] leading-relaxed mb-4 ${isDark ? 'text-gray-400' : 'text-slate-600 font-medium'}`}>
                    For any questions regarding binding agreements, customs project clauses, steel grades, or invoice milestones, reach out directly to our corporate estimating desk:
                  </p>
                  <div className="space-y-2 text-[11px] font-semibold">
                    <div className="flex gap-2">
                      <Mail size={14} className="text-amber-500 shrink-0" />
                      <div>
                        <p className={`text-[9px] uppercase font-bold text-slate-500`}>Official Mail</p>
                        <a href={`mailto:${systemInfo.email}`} className="text-amber-600 font-bold hover:underline">{systemInfo.email}</a>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Phone size={14} className="text-amber-500 shrink-0" />
                      <div>
                        <p className={`text-[9px] uppercase font-bold text-slate-500`}>Calling Coordinates</p>
                        <a href={`tel:${systemInfo.phone}`} className="text-amber-600 font-bold hover:underline">{systemInfo.phone}</a>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </motion.div>
        )}

        </AnimatePresence>
      </main>

      {/* --- FOOTER COMPONENT --- */}
      <footer className={`border-t transition-colors pt-12 pb-6 text-xs ${
        isDark 
          ? 'bg-[#030911]/95 border-slate-800 text-slate-400' 
          : 'bg-slate-100 border-slate-200 text-slate-600'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Quick Contact Coordinates Strip (Requested by User) */}
          <div className={`flex flex-col md:flex-row justify-between items-center gap-4 pb-8 mb-8 border-b ${
            isDark ? 'border-slate-800/80' : 'border-slate-200/90'
          }`}>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-8 text-xs md:text-sm">
              <span className="flex items-center gap-2 hover:text-amber-550 transition-colors">
                <Mail size={15} className="text-amber-500" />
                <a href={`mailto:${systemInfo.email}`} className="font-bold transition-colors">{systemInfo.email}</a>
              </span>
              <span className="flex items-center gap-2 hover:text-amber-550 transition-colors">
                <Phone size={15} className="text-amber-500" />
                <a href={`tel:${systemInfo.phone}`} className="font-bold transition-colors">{systemInfo.phone}</a>
              </span>
              <span className="flex items-center gap-2">
                <Clock size={15} className="text-amber-500" />
                <span className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{systemInfo.workingHours}</span>
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded text-amber-600 font-bold uppercase tracking-wider">
                Since 2015
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {systemInfo.logoUrl ? (
                <div className="flex items-center justify-center bg-transparent">
                  <img 
                    src={systemInfo.logoUrl || null} 
                    alt="Tasha Contracts Logo Footer" 
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="h-18 md:h-22 w-auto object-contain select-none"
                  />
                </div>
              ) : (
                <span className={`font-display font-black text-base uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  TASHA CONTRACTS INDIA
                </span>
              )}
            </div>
            <p className="leading-relaxed font-medium">
              Established 2015. Trustworthy engineering corporate, specializing in fast, premium LGSF and structural Prefabricated solutions. Delivering excellence across national circles.
            </p>
            <div className="space-y-1">
              <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{systemInfo.hqLabel || 'Headquarters (Amroha):'}</p>
              <p className="text-[11px] font-medium">{systemInfo.address}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className={`font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900 text-sm'}`}>Quick Navigation</h4>
            <ul className="space-y-1.5 uppercase tracking-wide text-[11px] font-bold">
              <li><button onClick={() => setActiveTab('home')} className="hover:text-amber-600">Home</button></li>
              <li><button onClick={() => setActiveTab('about')} className="hover:text-amber-600">About Tasha</button></li>
              <li><button onClick={() => setActiveTab('services')} className="hover:text-amber-600">Service Catalogs</button></li>
              <li><button onClick={() => setActiveTab('projects')} className="hover:text-amber-600">Built Gallery</button></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className={`font-bold uppercase tracking-wider font-display ${isDark ? 'text-white' : 'text-slate-900 text-sm'}`}>Specialized Circles</h4>
            <ul className="space-y-1.5 text-[11px] font-semibold">
              <li>● Light Gauge Steel Framing (LGSF)</li>
              <li>● Turnkey Prefabricated Shells</li>
              <li>● High-voltage MEP wiring lines</li>
              <li>● Heavy Civil concrete laying</li>
              <li>● Modern corporate acoustic cabins</li>
            </ul>
          </div>

          <div className={`space-y-4 col-span-1 border-t md:border-t-0 pt-4 md:pt-0 ${isDark ? 'border-slate-800/85' : 'border-slate-200'}`}>
            <h4 className={`font-bold uppercase tracking-wider font-display ${isDark ? 'text-white' : 'text-slate-900 text-sm'}`}>Estimating Office</h4>
            <p className="leading-relaxed font-medium">
              Direct and granular bidding processes. Submit drawings, specifications, location terrain benchmarks, and CAD records online.
            </p>
            <button
              onClick={() => setActiveTab('contact')}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold uppercase tracking-wider text-[11px] rounded shadow-sm cursor-pointer transition-colors"
            >
              Apply for Contract
            </button>
          </div>

        </div>

        {/* COMPREHENSIVE WHITE-HAT CRAWLABLE SEO DIRECTORY & KEYWORD INDEX */}
        <div className={`mt-10 pt-6 border-t ${isDark ? 'border-slate-850' : 'border-slate-200/70'}`}>
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-extrabold uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Sitemap SEO Directory &amp; Keyword Index
              </span>
              <span className={`text-[9px] font-bold ${isDark ? 'text-emerald-500/80' : 'text-emerald-600/80'} bg-emerald-500/10 px-1.5 py-0.5 rounded uppercase tracking-wider`}>
                Search Bot Verified
              </span>
            </div>
            <p className={`text-[9.5px] leading-relaxed ${isDark ? 'text-slate-550' : 'text-slate-400'} border-b ${isDark ? 'border-slate-900' : 'border-slate-100'} pb-2`}>
              Tasha Contracts India maintains indexing tokens to enhance regional searchability on Google Search, Gemini, ChatGPT Search, and Copilot AI indexes across Uttar Pradesh, Delhi NCR, and nationwide:
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1.5 max-h-[140px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-800">
              {[
                "Construction Company India", "Civil Construction Contractor", "Turnkey Construction Services", "Building Construction Company", 
                "Industrial Construction Contractor", "Commercial Construction Services", "Residential Construction Services", "Infrastructure Development Company", 
                "Civil Engineering Services", "General Contractor India", "Project Management Services", "Construction Project Execution", 
                "EPC Contractor India", "Design and Build Contractor", "Construction Solutions Provider", "Factory Construction Contractor", 
                "Warehouse Construction Company", "Industrial Shed Construction", "Steel Structure Construction", "PEB Building Contractor", 
                "Manufacturing Plant Construction", "Commercial Building Contractor", "Office Building Construction", "Hospital Construction Company", 
                "School Construction Contractor", "Interior Fit Out Contractor", "Commercial Interior Contractor", "Office Interior Design and Build", 
                "Building Renovation Services", "Structural Repair Contractor", "Turnkey Interior Solutions", "Retail Store Interior Contractor", 
                "Government Contractor India", "CPWD Contractor", "PWD Contractor", "Infrastructure Contractor", "Public Sector Construction Projects", 
                "Government Civil Work Contractor", "Road Construction Contractor", "Bridge Construction Company", "Construction Company in Amroha", 
                "Civil Contractor in Hasanpur", "Building Contractor in Amroha", "Construction Services in Uttar Pradesh", 
                "Industrial Construction Company in Uttar Pradesh", "Commercial Construction Contractor in Amroha", "Turnkey Project Contractor in Hasanpur", 
                "Hire Construction Contractor", "Best Construction Company", "Turnkey Construction Company", "Commercial Building Contractor Near Me", 
                "Civil Contractor for Factory Construction", "Building Construction Services", "Construction Project Management Company", 
                "Building & Construction", "Building Material Supplier", "Construction Material", "TMT Bars", "Cement Supplier", 
                "Tiles Manufacturer", "PVC Pipe", "UPVC Windows", "Plywood Supplier", "Modular Kitchen", "Wall Panels", 
                "Roofing Sheets", "False Ceiling", "ACP Sheet", "Glass Partition", "Interior Designer", "Home Renovation", 
                "House Construction", "Commercial Construction", "Turnkey Construction", "Civil Contractor"
              ].map((keyword, index) => (
                <span 
                  key={index} 
                  className={`text-[9px] font-semibold select-all font-mono transition-colors border px-2 py-0.5 rounded cursor-default ${
                    isDark 
                      ? 'bg-slate-900/30 border-slate-800 text-slate-500 hover:text-amber-500 hover:border-amber-550/30' 
                      : 'bg-slate-200/30 border-slate-300/40 text-slate-500 hover:text-amber-600 hover:border-amber-500/35'
                  }`}
                  title={`${keyword} - Index Segment`}
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
        </div>

        {/* Dynamic Legal and Copyright notes matches user requested items */}
        <div className={`mt-8 border-t pt-6 text-center text-[10px] space-y-2 ${isDark ? 'border-slate-800/60 text-gray-500' : 'border-slate-200 text-slate-500'}`}>
          <p className="font-medium">
            © {new Date().getFullYear()} Tasha Contracts{' '}
            <button 
              onClick={() => setActiveTab('webmanager')}
              className="bg-transparent border-none p-0 inline m-0 hover:text-white transition-colors outline-none cursor-default"
            >
              India
            </button>. All Rights Reserved. Specialization in LGSF & Prefabs Since 2015
          </p>
          <p className="font-medium">
            <span 
              onClick={() => setActiveTab('admin')} 
              className="cursor-default select-none transition-all hover:opacity-90 active:scale-[0.98] inline-block"
              style={{ userSelect: 'none' }}
            >
              Disclaimer:
            </span>{' '}
            Images are representation references. Subject to Class-A governmental planning compliance.
          </p>
          <div className="flex justify-center flex-wrap gap-4 text-gray-400 font-bold">
            <button onClick={() => setActiveTab('privacy')} className={`hover:underline ${isDark ? 'text-gray-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>Privacy Policy</button>
            <span>|</span>
            <button onClick={() => setActiveTab('terms')} className={`hover:underline ${isDark ? 'text-gray-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>Terms & Conditions</button>
          </div>
        </div>
      </footer>

      {/* --- FLOATING INTUITIVE WHATSAPP MODULE FOR ACTIVE CLIENT LEADS --- */}
      {systemInfo.whatsapp && systemInfo.whatsapp.trim() !== '' && (
        <a 
          href={`https://wa.me/${systemInfo.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(systemInfo.whatsappMessage || 'Hello Tasha Contracts India, I am interested in a construction project.')}`}
          target="_blank" 
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 p-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center border border-emerald-400/25"
          title="Chat with Tasha MD via WhatsApp"
        >
          <img 
            src="https://res.cloudinary.com/dpxoxrnrd/image/upload/v1781643194/samples/cloudinary-icon.png"
            alt="WhatsApp Chat"
            className="w-7 h-7 object-contain"
            referrerPolicy="no-referrer"
          />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border border-white animate-ping"></span>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border border-white"></span>
        </a>
      )}

      {/* Project Details Modal Popup */}
      {activePopupProject && (
        <ProjectDetailsPopup 
          project={activePopupProject} 
          onClose={() => setActivePopupProject(null)} 
          themeMode={themeMode}
        />
      )}

    </div>
  );
}
