export interface Project {
  id: string;
  title: string;
  category: 'LGSF / Prefabricated' | 'Civil Construction' | 'Commercial' | 'Residential' | 'Interior Fit-Out';
  location: string;
  completionDate: string;
  image: string;
  status: 'Completed' | 'Ongoing';
  description: string;
  client: string;
  beforeImage?: string;
  afterImage?: string;
  galleryImages?: string[];
}

export interface Service {
  id: string;
  name: string;
  description: string;
  iconName: string; // Lucide icon identifier
  details: string;
  features: string[];
}

export interface Testimonial {
  id: string;
  clientName: string;
  companyName: string;
  text: string;
  rating: number;
  approved?: boolean;
  date?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  guarantees?: string[];
}

export interface Certificate {
  id: string;
  title: string;
  regNo: string;
  issuer: string;
  status: 'Approved' | 'Registered' | 'Active';
  fileUrl?: string;
}

export interface CareerListing {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Contract' | 'Part-time';
  description: string;
  requirements: string[];
  active: boolean;
}

export interface QuoteRequest {
  id: string;
  fullName: string;
  companyName: string;
  mobileNumber: string;
  email: string;
  projectType: string;
  budgetRange: string;
  location: string;
  message: string;
  fileName?: string;
  fileData?: string;
  submissionDate: string;
  status: 'Pending' | 'Reviewed' | 'Contacted';
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  subject: string;
  message: string;
  submissionDate: string;
  status: 'New' | 'Read' | 'Replied';
}

export interface CareerApplication {
  id: string;
  careerId: string;
  careerTitle: string;
  fullName: string;
  email: string;
  mobile: string;
  coverLetter: string;
  fileName?: string;
  fileData?: string;
  submissionDate: string;
  status: 'Pending' | 'Shortlisted' | 'Rejected';
}

export interface Industry {
  id: string;
  name: string;
  description: string;
  iconName: string; // Lucide icon name
  points: string[]; // key details or segments served in this industry
}

export interface PartnerCompany {
  id: string;
  name: string;
  subtitle: string;
  colorClass: string; // e.g. text-red-500, text-amber-500, etc.
}


