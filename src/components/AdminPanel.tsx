import React, { useState, useRef } from 'react';
import { 
  Project, Service, Testimonial, TeamMember, 
  Certificate, CareerListing, QuoteRequest, ContactMessage, CareerApplication, Industry, PartnerCompany 
} from '../types';
import { 
  Building2, Plus, Edit2, Trash2, CheckCircle, Clock, 
  Lock, Unlock, ShieldAlert, FileText, ChevronRight, Check, X, Download, Eye,
  Briefcase, Mail, Phone, MapPin, DollarSign, Award, Users, AlertCircle, RefreshCw, Star, Sparkles
} from 'lucide-react';
import { DynamicIcon } from './Icons';

interface AdminPanelProps {
  projects: Project[];
  services: Service[];
  testimonials: Testimonial[];
  team: TeamMember[];
  industries: Industry[];
  certificates: Certificate[];
  careers: CareerListing[];
  quotes: QuoteRequest[];
  contacts: ContactMessage[];
  applications: CareerApplication[];
  systemInfo: any;
  partners: PartnerCompany[];
  onUpdateProjects: (projects: Project[]) => void;
  onUpdateServices: (services: Service[]) => void;
  onUpdateTestimonials: (testimonials: Testimonial[]) => void;
  onUpdateTeam: (team: TeamMember[]) => void;
  onUpdateIndustries: (industries: Industry[]) => void;
  onUpdateCertificates: (certificates: Certificate[]) => void;
  onUpdateCareers: (careers: CareerListing[]) => void;
  onUpdateQuotes: (quotes: QuoteRequest[]) => void;
  onUpdateContacts: (contacts: ContactMessage[]) => void;
  onUpdateSystemInfo: (info: any) => void;
  onUpdatePartners: (partners: PartnerCompany[]) => void;
  isDark?: boolean;
  dbMode?: 'connecting' | 'firebase' | 'local';
  onForceUploadToCloud?: () => void;
  onForceDownloadFromCloud?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  projects, services, testimonials, team, industries, certificates, careers, quotes, contacts, applications, systemInfo, partners,
  onUpdateProjects, onUpdateServices, onUpdateTestimonials, onUpdateTeam, onUpdateIndustries, onUpdateCertificates, onUpdateCareers,
  onUpdateQuotes, onUpdateContacts, onUpdateSystemInfo, onUpdatePartners,
  isDark = true,
  dbMode = 'local',
  onForceUploadToCloud,
  onForceDownloadFromCloud
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  // Password persistence state
  const [storedPassword, setStoredPassword] = useState<string>(() => {
    return localStorage.getItem('tasha_admin_password') || 'admin';
  });

  // Forgot password states
  const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false);
  const [securityQuestion, setSecurityQuestion] = useState<string>(() => {
    return localStorage.getItem('tasha_security_question') || 'Year of Tasha Contracts India Establishment?';
  });
  const [securityAnswer, setSecurityAnswer] = useState<string>(() => {
    return localStorage.getItem('tasha_security_answer') || '2015';
  });

  const [forgotEmail, setForgotEmail] = useState<string>('');
  const [forgotAnswer, setForgotAnswer] = useState<string>('');
  const [forgotNewPassword, setForgotNewPassword] = useState<string>('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState<string>('');
  const [forgotError, setForgotError] = useState<string>('');
  const [forgotSuccess, setForgotSuccess] = useState<string>('');
  const [recoveryMethod, setRecoveryMethod] = useState<'question' | 'email'>('question');

  // Change Password states (for authenticated admin)
  const [currentPasswordInput, setCurrentPasswordInput] = useState<string>('');
  const [newPasswordInput, setNewPasswordInput] = useState<string>('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState<string>('');
  const [changePasswordError, setChangePasswordError] = useState<string>('');
  const [changePasswordSuccess, setChangePasswordSuccess] = useState<string>('');

  // Custom question update states (in security tab)
  const [customQuestionInput, setCustomQuestionInput] = useState<string>('');
  const [customAnswerInput, setCustomAnswerInput] = useState<string>('');
  const [securityUpdateSuccess, setSecurityUpdateSuccess] = useState<string>('');

  // Active admin sub-tab
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'projects' | 'services' | 'quotes' | 'careers' | 'contacts' | 'system' | 'security' | 'testimonials' | 'team' | 'industries' | 'partners'>('overview');

  // Partners states
  const [editingPartner, setEditingPartner] = useState<Partial<PartnerCompany> | null>(null);
  const [isAddingPartner, setIsAddingPartner] = useState<boolean>(false);
  const [newPartnerName, setNewPartnerName] = useState<string>('');
  const [newPartnerSubtitle, setNewPartnerSubtitle] = useState<string>('');
  const [newPartnerColorClass, setNewPartnerColorClass] = useState<string>('text-amber-500 font-mono');

  // Standard modal state for editing
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [newGalleryImageUrl, setNewGalleryImageUrl] = useState<string>('');
  const [galleryUrlError, setGalleryUrlError] = useState<boolean>(false);
  const optionBFileInputRef = useRef<HTMLInputElement>(null);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [editingCareer, setEditingCareer] = useState<Partial<CareerListing> | null>(null);
  const [editingCertificate, setEditingCertificate] = useState<Partial<Certificate> | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<Testimonial> | null>(null);
  const [isAddingTestimonial, setIsAddingTestimonial] = useState<boolean>(false);
  const [newTestimonialName, setNewTestimonialName] = useState<string>('');
  const [newTestimonialCompany, setNewTestimonialCompany] = useState<string>('');
  const [newTestimonialRating, setNewTestimonialRating] = useState<number>(5);
  const [newTestimonialText, setNewTestimonialText] = useState<string>('');
  const [newTestimonialApproved, setNewTestimonialApproved] = useState<boolean>(true);

  // Team member state for editing
  const [editingTeamMember, setEditingTeamMember] = useState<Partial<TeamMember> | null>(null);
  const [isAddingTeamMember, setIsAddingTeamMember] = useState<boolean>(false);
  const [newTeamMemberName, setNewTeamMemberName] = useState<string>('');
  const [newTeamMemberRole, setNewTeamMemberRole] = useState<string>('');
  const [newTeamMemberImage, setNewTeamMemberImage] = useState<string>('');
  const [newTeamMemberBio, setNewTeamMemberBio] = useState<string>('');
  const [newTeamMemberGuarantees, setNewTeamMemberGuarantees] = useState<string>('');

  // Industries states
  const [editingIndustry, setEditingIndustry] = useState<Partial<Industry> | null>(null);
  const [newPoint, setNewPoint] = useState<string>('');
  
  // Local system state
  const [localSystemInfo, setLocalSystemInfo] = useState({ ...systemInfo });
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>('');
  const [systemUpdateSuccess, setSystemUpdateSuccess] = useState<string>('');

  // Web Manager Media inputs state
  const [webLogoUrl, setWebLogoUrl] = useState<string>(systemInfo.logoUrl || '');
  const [webHeroVideo, setWebHeroVideo] = useState<string>(systemInfo.heroVideoUrl || 'https://res.cloudinary.com/dpxoxrnrd/video/upload/v1781097285/po6wg43tokovftxnpxfa.mp4');
  const [webHeroPoster, setWebHeroPoster] = useState<string>(systemInfo.heroPosterUrl || 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1920');
  const [webCtaBg, setWebCtaBg] = useState<string>(systemInfo.ctaBgUrl || 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1200');
  const [webMapBg, setWebMapBg] = useState<string>(systemInfo.mapBgUrl || 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=400');
  const [webMediaSuccess, setWebMediaSuccess] = useState<string>('');

  // Sorter / Filter for media catalog
  const [catalogFilter, setCatalogFilter] = useState<'all' | 'projects' | 'team'>('all');
  const [catalogEditId, setCatalogEditId] = useState<string | null>(null);
  const [catalogEditField, setCatalogEditField] = useState<'image' | 'beforeImage' | 'afterImage'>('image');
  const [catalogEditValue, setCatalogEditValue] = useState<string>('');

  React.useEffect(() => {
    if (systemInfo) {
      setWebLogoUrl(systemInfo.logoUrl || '');
      setWebHeroVideo(systemInfo.heroVideoUrl || 'https://res.cloudinary.com/dpxoxrnrd/video/upload/v1781097285/po6wg43tokovftxnpxfa.mp4');
      setWebHeroPoster(systemInfo.heroPosterUrl || 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1920');
      setWebCtaBg(systemInfo.ctaBgUrl || 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1200');
      setWebMapBg(systemInfo.mapBgUrl || 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=400');
      setLocalSystemInfo({ ...systemInfo });
    }
  }, [systemInfo]);

  const handleSaveWebMedia = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...systemInfo,
      logoUrl: webLogoUrl,
      heroVideoUrl: webHeroVideo,
      heroPosterUrl: webHeroPoster,
      ctaBgUrl: webCtaBg,
      mapBgUrl: webMapBg
    };
    onUpdateSystemInfo(updated);
    setWebMediaSuccess('Layout company logo, background video and banner images successfully updated in real-time!');
    setTimeout(() => {
      setWebMediaSuccess('');
    }, 5000);
  };

  const handleSaveCatalogItem = (itemId: string, field: 'image' | 'beforeImage' | 'afterImage', newValue: string) => {
    const isTeam = team.some(t => t.id === itemId);
    const isProj = projects.some(p => p.id === itemId);

    if (isTeam) {
      const updated = team.map(t => t.id === itemId ? { ...t, image: newValue } : t);
      onUpdateTeam(updated);
      setWebMediaSuccess(`Successfully updated team member's portrait photo.`);
    } else if (isProj) {
      const updated = projects.map(p => {
        if (p.id === itemId) {
          return { ...p, [field]: newValue };
        }
        return p;
      });
      onUpdateProjects(updated);
      setWebMediaSuccess(`Successfully updated project structural media asset.`);
    }
    
    setCatalogEditId(null);
    setCatalogEditValue('');
    setTimeout(() => {
      setWebMediaSuccess('');
    }, 4000);
  };

  const CloudinaryUploadButton: React.FC<{
    onSuccess: (url: string) => void;
    label?: string;
    resourceType?: 'image' | 'video';
  }> = ({ onSuccess, label = 'Upload to Cloudinary', resourceType = 'image' }) => {
    const cloudName = localSystemInfo.cloudinaryCloudName || systemInfo.cloudinaryCloudName;
    const uploadPreset = localSystemInfo.cloudinaryUploadPreset || systemInfo.cloudinaryUploadPreset;

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const cn = cloudName || '';
      const up = uploadPreset || '';

      if (!cn.trim() || !up.trim()) {
        setUploadError("Please set your Cloudinary 'Cloud Name' and 'Upload Preset' first in 'System Configuration'.");
        return;
      }

      setIsUploading(true);
      setUploadError('');

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', up);

        const uploadEndpointRef = resourceType === 'video' ? 'video' : 'image';
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cn}/${uploadEndpointRef}/upload`, {
          method: 'POST',
          body: formData
        });

        if (!res.ok) {
          throw new Error(`Upload failed. Make sure your Upload Preset is configured as Unsigned in Cloudinary.`);
        }

        const data = await res.json();
        if (data.secure_url) {
          onSuccess(data.secure_url);
        } else {
          throw new Error("No URL returned from Cloudinary response.");
        }
      } catch (err: any) {
        console.error(err);
        setUploadError(err.message || 'Check your internet connection, Cloud Name, and Preset settings.');
      } finally {
        setIsUploading(false);
      }
    };

    return (
      <div className="relative inline-block shrink-0">
        <label className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold rounded text-xs cursor-pointer select-none transition-colors shadow-sm">
          {isUploading ? (
            <RefreshCw size={13} className="animate-spin" />
          ) : (
            <Plus size={13} />
          )}
          {isUploading ? 'Uploading...' : label}
          <input 
            type="file" 
            accept={resourceType === 'video' ? 'video/*' : 'image/*'} 
            className="hidden" 
            disabled={isUploading}
            onChange={handleFileChange} 
          />
        </label>
        {uploadError && (
          <div className="absolute top-full left-0 mt-1 bg-red-950 border border-red-500/40 text-red-400 text-[10px] p-2 rounded z-50 shadow-lg min-w-[200px] flex justify-between items-center whitespace-normal">
            <span>{uploadError}</span>
            <button type="button" onClick={() => setUploadError('')} className="ml-2 hover:text-white font-bold font-sans cursor-pointer">✕</button>
          </div>
        )}
      </div>
    );
  };

  const handleOptionBFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const cloudName = localSystemInfo.cloudinaryCloudName || systemInfo.cloudinaryCloudName;
    const uploadPreset = localSystemInfo.cloudinaryUploadPreset || systemInfo.cloudinaryUploadPreset;

    const cn = cloudName || '';
    const up = uploadPreset || '';

    if (!cn.trim() || !up.trim()) {
      setUploadError("Please set your Cloudinary 'Cloud Name' and 'Upload Preset' first in 'System Configuration'.");
      return;
    }

    setIsUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', up);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cn}/image/upload`, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        throw new Error(`Upload failed. Make sure your Upload Preset is configured as Unsigned in Cloudinary.`);
      }

      const data = await res.json();
      if (data.secure_url) {
        if (editingProject) {
          const current = editingProject.galleryImages || [];
          setEditingProject({
            ...editingProject,
            galleryImages: [...current, data.secure_url]
          });
        }
        setNewGalleryImageUrl('');
        setGalleryUrlError(false);
      } else {
        throw new Error("No URL returned from Cloudinary response.");
      }
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || 'Check your internet connection, Cloud Name, and Preset settings.');
    } finally {
      setIsUploading(false);
      if (optionBFileInputRef.current) {
        optionBFileInputRef.current.value = '';
      }
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().toLowerCase() === 'admin' && password === storedPassword) {
      setIsAuthenticated(true);
      setLoginError('');
      // Reset inputs
      setPassword('');
    } else {
      setLoginError(`Invalid Username or Password. Hint: Default is admin/admin. If changed, please use your new passcode, or recover it using the 'Forgot Password' link below.`);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  const handleSecurityQuestionReset = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    if (forgotAnswer.trim().toLowerCase() !== securityAnswer.trim().toLowerCase()) {
      setForgotError('Incorrect security answer or challenge phrase verification failed.');
      return;
    }

    if (!forgotNewPassword || forgotNewPassword.length < 4) {
      setForgotError('New Password must be at least 4 characters long.');
      return;
    }

    if (forgotNewPassword !== forgotConfirmPassword) {
      setForgotError('Confirm password does not match.');
      return;
    }

    // Save
    localStorage.setItem('tasha_admin_password', forgotNewPassword);
    setStoredPassword(forgotNewPassword);
    setForgotSuccess('Success! Your Tasha Corporate Administrator passcode has been reset successfully.');
    
    // reset form fields
    setForgotAnswer('');
    setForgotNewPassword('');
    setForgotConfirmPassword('');
  };

  const handleEmailReset = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    if (!forgotEmail.includes('@')) {
      setForgotError('Please enter a valid administrator email address.');
      return;
    }

    if (!forgotNewPassword || forgotNewPassword.length < 4) {
      setForgotError('New Password must be at least 4 characters long.');
      return;
    }

    if (forgotNewPassword !== forgotConfirmPassword) {
      setForgotError('Confirm password does not match.');
      return;
    }

    // Save
    localStorage.setItem('tasha_admin_password', forgotNewPassword);
    setStoredPassword(forgotNewPassword);
    setForgotSuccess(`Verification simulated securely to ${forgotEmail}. Your administrator password has been reset to your chosen value successfully.`);
    
    // reset form fields
    setForgotEmail('');
    setForgotNewPassword('');
    setForgotConfirmPassword('');
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setChangePasswordError('');
    setChangePasswordSuccess('');

    if (currentPasswordInput !== storedPassword) {
      setChangePasswordError('Incorrect current administrator password.');
      return;
    }

    if (!newPasswordInput || newPasswordInput.length < 4) {
      setChangePasswordError('New passcode must be at least 4 characters long.');
      return;
    }

    if (newPasswordInput !== confirmPasswordInput) {
      setChangePasswordError('Confirmation password does not match.');
      return;
    }

    // Save
    localStorage.setItem('tasha_admin_password', newPasswordInput);
    setStoredPassword(newPasswordInput);
    setChangePasswordSuccess('Password updated successfully. Remember to use this new passcode for future logins.');
    
    // Clear
    setCurrentPasswordInput('');
    setNewPasswordInput('');
    setConfirmPasswordInput('');
  };

  const handleUpdateSecurityQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityUpdateSuccess('');

    if (!customQuestionInput.trim() || !customAnswerInput.trim()) {
      setSecurityUpdateSuccess('Error: Question and Answer challenge parameters cannot be empty.');
      return;
    }

    localStorage.setItem('tasha_security_question', customQuestionInput);
    localStorage.setItem('tasha_security_answer', customAnswerInput);

    setSecurityQuestion(customQuestionInput);
    setSecurityAnswer(customAnswerInput);

    setSecurityUpdateSuccess('Security recovery challenge updated successfully.');
    
    // Clear
    setCustomQuestionInput('');
    setCustomAnswerInput('');
  };

  // Status changers for client submissions
  const handleQuoteStatusChange = (id: string, newStatus: 'Pending' | 'Reviewed' | 'Contacted') => {
    const updated = quotes.map(q => q.id === id ? { ...q, status: newStatus } : q);
    onUpdateQuotes(updated);
  };

  const handleContactStatusChange = (id: string, newStatus: 'New' | 'Read' | 'Replied') => {
    const updated = contacts.map(c => c.id === id ? { ...c, status: newStatus } : c);
    onUpdateContacts(updated);
  };

  // --- CRUD Projects ---
  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.title || !editingProject.category) return;

    const processedGallery = (editingProject.galleryImages || [])
      .map(img => img.trim())
      .filter(Boolean);

    if (editingProject.id) {
      // Edit
      const updated = projects.map(p => p.id === editingProject.id ? {
        ...(editingProject as Project),
        galleryImages: processedGallery
      } : p);
      onUpdateProjects(updated);
    } else {
      // Create
      const newProj: Project = {
        id: 'p_' + Date.now(),
        title: editingProject.title,
        category: editingProject.category as any,
        location: editingProject.location || 'India',
        completionDate: editingProject.completionDate || 'Ongoing',
        image: editingProject.image || 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800',
        status: editingProject.status || 'Ongoing',
        description: editingProject.description || '',
        client: editingProject.client || 'Tasha Partner',
        beforeImage: editingProject.beforeImage,
        afterImage: editingProject.afterImage,
        galleryImages: processedGallery
      };
      onUpdateProjects([newProj, ...projects]);
    }
    setEditingProject(null);
  };

  const handleDeleteProject = (id: string) => {
    // Non-blocking immediate execute for sandboxed iframe
    onUpdateProjects(projects.filter(p => p.id !== id));
  };

  // --- CRUD Services ---
  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService?.name || !editingService.description) return;

    const processedFeatures = (editingService.features || [])
      .map(f => f.trim())
      .filter(Boolean);

    if (editingService.id) {
      const updated = services.map(s => s.id === editingService.id ? {
        ...editingService,
        features: processedFeatures.length > 0 ? processedFeatures : s.features
      } as Service : s);
      onUpdateServices(updated);
    } else {
      const newServ: Service = {
        id: 's_' + Date.now(),
        name: editingService.name,
        description: editingService.description,
        iconName: editingService.iconName || 'Building2',
        details: editingService.details || '',
        features: processedFeatures.length > 0 ? processedFeatures : ['Custom premium execution']
      };
      onUpdateServices([...services, newServ]);
    }
    setEditingService(null);
  };

  const handleDeleteService = (id: string) => {
    // Non-blocking immediate execute for sandboxed iframe
    onUpdateServices(services.filter(s => s.id !== id));
  };

  // --- CRUD Partner Brands ---
  const handleAddPartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartnerName.trim() || !newPartnerSubtitle.trim()) return;

    const freshPartner: PartnerCompany = {
      id: 'partner-' + Date.now(),
      name: newPartnerName.trim(),
      subtitle: newPartnerSubtitle.trim(),
      colorClass: newPartnerColorClass.trim() || 'text-amber-500 font-mono'
    };

    onUpdatePartners([...partners, freshPartner]);

    // Reset fields
    setNewPartnerName('');
    setNewPartnerSubtitle('');
    setNewPartnerColorClass('text-amber-500 font-mono');
    setIsAddingPartner(false);
  };

  const handleSavePartnerEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPartner || !editingPartner.id || !editingPartner.name?.trim() || !editingPartner.subtitle?.trim()) return;

    const updated = partners.map(p => {
      if (p.id === editingPartner.id) {
        return {
          id: editingPartner.id!,
          name: editingPartner.name!.trim(),
          subtitle: editingPartner.subtitle!.trim(),
          colorClass: editingPartner.colorClass || 'text-amber-500 font-mono'
        };
      }
      return p;
    });

    onUpdatePartners(updated);
    setEditingPartner(null);
  };

  const handleDeletePartner = (id: string) => {
    onUpdatePartners(partners.filter(p => p.id !== id));
  };

  // --- CRUD Testimonials ---
  const handleAddTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestimonialName.trim() || !newTestimonialText.trim()) return;

    const fresh: Testimonial = {
      id: 'adm-' + Date.now(),
      clientName: newTestimonialName.trim(),
      companyName: newTestimonialCompany.trim() || 'Corporate Partner',
      rating: newTestimonialRating,
      text: newTestimonialText.trim(),
      approved: newTestimonialApproved,
      date: new Date().toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric'
      })
    };

    onUpdateTestimonials([fresh, ...testimonials]);

    // Reset fields
    setNewTestimonialName('');
    setNewTestimonialCompany('');
    setNewTestimonialRating(5);
    setNewTestimonialText('');
    setNewTestimonialApproved(true);
    setIsAddingTestimonial(false);
  };

  const handleDeleteTestimonialId = (id: string) => {
    // Non-blocking immediate execute for sandboxed iframe
    const updated = testimonials.filter(t => t.id !== id);
    onUpdateTestimonials(updated);
  };

  const handleToggleApproval = (id: string) => {
    const updated = testimonials.map(t => {
      if (t.id === id) {
        return { ...t, approved: t.approved === false ? true : false };
      }
      return t;
    });
    onUpdateTestimonials(updated);
  };

  const handleSaveEditTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial || !editingTestimonial.clientName?.trim() || !editingTestimonial.text?.trim()) return;

    const updated = testimonials.map(t => {
      if (t.id === editingTestimonial.id) {
        return {
          ...t,
          clientName: editingTestimonial.clientName || '',
          companyName: editingTestimonial.companyName || '',
          rating: editingTestimonial.rating || 5,
          text: editingTestimonial.text || '',
          approved: editingTestimonial.approved !== false
        };
      }
      return t;
    });

    onUpdateTestimonials(updated);
    setEditingTestimonial(null);
  };

  // --- CRUD Team Members ---
  const handleAddTeamMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamMemberName.trim() || !newTeamMemberRole.trim()) return;

    const processedGuarantees = newTeamMemberGuarantees
      .split('\n')
      .map(g => g.trim())
      .filter(Boolean);

    const fresh: TeamMember = {
      id: 'tm-' + Date.now(),
      name: newTeamMemberName.trim(),
      role: newTeamMemberRole.trim(),
      image: newTeamMemberImage.trim() || 'HardHat',
      bio: newTeamMemberBio.trim() || 'Experienced professional at Tasha Contracts delivering top-tier structural LGSF and civil projects.',
      guarantees: processedGuarantees.length > 0 ? processedGuarantees : undefined,
    };

    onUpdateTeam([...team, fresh]);

    // Reset fields
    setNewTeamMemberName('');
    setNewTeamMemberRole('');
    setNewTeamMemberImage('');
    setNewTeamMemberBio('');
    setNewTeamMemberGuarantees('');
    setIsAddingTeamMember(false);
  };

  const handleDeleteTeamMember = (id: string) => {
    const updated = team.filter(t => t.id !== id);
    onUpdateTeam(updated);
  };

  const handleSaveEditTeamMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeamMember || !editingTeamMember.name?.trim() || !editingTeamMember.role?.trim()) return;

    const processedGuarantees = (editingTeamMember.guarantees || [])
      .map(g => g.trim())
      .filter(Boolean);

    const updated = team.map(t => {
      if (t.id === editingTeamMember.id) {
        return {
          ...t,
          name: editingTeamMember.name || '',
          role: editingTeamMember.role || '',
          image: editingTeamMember.image?.trim() || 'HardHat',
          bio: editingTeamMember.bio || '',
          guarantees: processedGuarantees,
        };
      }
      return t;
    });

    onUpdateTeam(updated);
    setEditingTeamMember(null);
  };

  // --- CRUD Industries Served ---
  const handleSaveIndustry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingIndustry?.name?.trim() || !editingIndustry.description?.trim()) return;

    if (editingIndustry.id) {
      // Edit existing
      const updated = industries.map(ind => ind.id === editingIndustry.id ? (editingIndustry as Industry) : ind);
      onUpdateIndustries(updated);
    } else {
      // Create new
      const fresh: Industry = {
        id: 'ind-' + Date.now(),
        name: editingIndustry.name.trim(),
        description: editingIndustry.description.trim(),
        iconName: editingIndustry.iconName || 'Building2',
        points: editingIndustry.points || []
      };
      onUpdateIndustries([...industries, fresh]);
    }
    setEditingIndustry(null);
  };

  const handleDeleteIndustry = (id: string) => {
    const updated = industries.filter(ind => ind.id !== id);
    onUpdateIndustries(updated);
  };

  // --- CRUD Careers ---
  const handleSaveCareer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCareer?.title || !editingCareer.department) return;

    if (editingCareer.id) {
      const updated = careers.map(c => c.id === editingCareer.id ? (editingCareer as CareerListing) : c);
      onUpdateCareers(updated);
    } else {
      const newCareer: CareerListing = {
        id: 'j_' + Date.now(),
        title: editingCareer.title,
        department: editingCareer.department,
        location: editingCareer.location || 'India',
        type: (editingCareer.type as any) || 'Full-time',
        description: editingCareer.description || '',
        requirements: editingCareer.requirements || ['Immediate Availability'],
        active: true
      };
      onUpdateCareers([...careers, newCareer]);
    }
    setEditingCareer(null);
  };

  const handleDeleteCareer = (id: string) => {
    // Non-blocking immediate execute for sandboxed iframe
    onUpdateCareers(careers.filter(c => c.id !== id));
  };

  const handleUpdateSystem = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSystemInfo(localSystemInfo);
    setSystemUpdateSuccess('Corporate branding information synchronized successfully in real-time!');
    setTimeout(() => {
      setSystemUpdateSuccess('');
    }, 5000);
  };

  // Lockscreen template
  if (!isAuthenticated) {
    if (showForgotPassword) {
      return (
        <div className="max-w-md mx-auto p-6 bg-slate-800/40 border border-amber-500/10 rounded-2xl shadow-xl mt-12 animate-fade-in-up">
          <div className="text-center space-y-3 mb-6">
            <div className="p-3.5 bg-slate-900 border border-slate-700 w-14 h-14 rounded-full flex items-center justify-center text-amber-500 mx-auto">
              <Lock size={24} />
            </div>
            <h3 className="text-xl font-bold font-display text-white">Reset Secure Code</h3>
            <p className="text-xs text-gray-400">
              Restore admin credential bindings via physical security parameters.
            </p>
          </div>

          {/* Success Alert */}
          {forgotSuccess && (
            <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-lg text-emerald-300 text-xs text-left mb-4 font-sans">
              <p className="font-bold mb-1 text-emerald-400">Passcode Restored</p>
              <p>{forgotSuccess}</p>
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotSuccess('');
                  setForgotError('');
                }}
                className="mt-3 w-full py-2 text-xs font-black uppercase text-slate-950 bg-amber-500 rounded hover:bg-amber-400 transition-colors cursor-pointer"
              >
                Return to Lockscreen Page
              </button>
            </div>
          )}

          {/* Error Alert */}
          {forgotError && (
            <div className="p-3 bg-red-500/15 border border-red-500/30 rounded-lg text-red-300 text-xs text-left flex gap-2 items-center mb-4">
              <ShieldAlert size={16} className="shrink-0" />
              <span>{forgotError}</span>
            </div>
          )}

          {!forgotSuccess && (
            <div className="space-y-4">
              {/* Tab switch for recovery modes */}
              <div className="flex gap-2 p-1 bg-slate-900 rounded-lg border border-slate-700">
                <button
                  type="button"
                  onClick={() => {
                    setRecoveryMethod('question');
                    setForgotError('');
                  }}
                  className={`flex-1 py-1.5 text-center text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                    recoveryMethod === 'question' ? 'bg-amber-500 text-slate-950 shadow' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Security Question
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRecoveryMethod('email');
                    setForgotError('');
                  }}
                  className={`flex-1 py-1.5 text-center text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                    recoveryMethod === 'email' ? 'bg-amber-500 text-slate-950 shadow' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Registered Email
                </button>
              </div>

              {recoveryMethod === 'question' ? (
                <form onSubmit={handleSecurityQuestionReset} className="space-y-4 text-left">
                  <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-lg">
                    <span className="text-[10px] uppercase text-amber-500 font-black block mb-1">Challenge Question:</span>
                    <span className="text-xs text-gray-300 font-medium">{securityQuestion}</span>
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-450 font-bold mb-1 uppercase tracking-wider">YOUR ANSWER *</label>
                    <input
                      type="text"
                      required
                      placeholder="Provide configured security phrase"
                      value={forgotAnswer}
                      onChange={(e) => setForgotAnswer(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                    <span className="text-[10px] text-gray-500 mt-1 block">Hint: Default is "2015" matching the company setup year.</span>
                  </div>

                  <div className="border-t border-slate-800/80 pt-3 space-y-3 font-sans">
                    <div>
                      <label className="block text-[10px] text-gray-450 font-bold mb-1 uppercase tracking-wider">NEW ACCESS CODE *</label>
                      <input
                        type="password"
                        required
                        placeholder="At least 4 characters"
                        value={forgotNewPassword}
                        onChange={(e) => setForgotNewPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-450 font-bold mb-1 uppercase tracking-wider">CONFIRM NEW ACCESS CODE *</label>
                      <input
                        type="password"
                        required
                        placeholder="Retype password"
                        value={forgotConfirmPassword}
                        onChange={(e) => setForgotConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded text-xs uppercase tracking-wider transition-all flex justify-center items-center gap-1.5 cursor-pointer mt-4"
                  >
                    <Check size={14} /> Reset Passcode
                  </button>
                </form>
              ) : (
                <form onSubmit={handleEmailReset} className="space-y-4 text-left">
                  <div>
                    <label className="block text-[10px] text-gray-450 font-bold mb-1 uppercase tracking-wider">ADMIN REGISTERED EMAIL *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. admin@tashacontracts.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                    <span className="text-[10px] text-gray-500 mt-1 block">Instructions will be simulated using these active coordinates.</span>
                  </div>

                  <div className="border-t border-slate-800/80 pt-3 space-y-3 font-sans">
                    <div>
                      <label className="block text-[10px] text-gray-450 font-bold mb-1 uppercase tracking-wider">NEW ACCESS CODE *</label>
                      <input
                        type="password"
                        required
                        placeholder="At least 4 characters"
                        value={forgotNewPassword}
                        onChange={(e) => setForgotNewPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-450 font-bold mb-1 uppercase tracking-wider">CONFIRM NEW ACCESS CODE *</label>
                      <input
                        type="password"
                        required
                        placeholder="Retype password"
                        value={forgotConfirmPassword}
                        onChange={(e) => setForgotConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded text-xs uppercase tracking-wider transition-all flex justify-center items-center gap-1.5 cursor-pointer mt-4"
                  >
                    <Check size={14} /> Securely Reset Passcode
                  </button>
                </form>
              )}

              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotError('');
                  setForgotSuccess('');
                }}
                className="w-full py-2 bg-slate-800 text-gray-400 hover:text-white rounded text-xs font-semibold hover:bg-slate-750 transition-all cursor-pointer mt-2"
              >
                Cancel & Return
              </button>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className={`max-w-md mx-auto p-6 rounded-2xl shadow-xl mt-12 animate-fade-in-up border transition-colors ${
        isDark ? 'bg-slate-800/40 border-amber-500/10' : 'bg-white border-slate-205'
      }`}>
        <div className="text-center space-y-3 mb-6">
          <div className={`p-3.5 w-14 h-14 rounded-full flex items-center justify-center text-amber-500 mx-auto border transition-colors ${
            isDark ? 'bg-slate-900 border-slate-705' : 'bg-slate-100 border-slate-200 shadow-inner'
          }`}>
            <Lock size={24} />
          </div>
          <h3 className={`text-xl font-bold font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>TASHA Executive Portal</h3>
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
            Provide credentials to manage live project pipelines, quotes, or career applicants.
          </p>
        </div>

        {loginError && (
          <div className={`p-3 border rounded-lg text-xs text-left flex gap-2 items-center mb-4 transition-colors ${
            isDark ? 'bg-red-500/15 border-red-500/30 text-red-350' : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <ShieldAlert size={16} className="shrink-0" />
            <span>{loginError}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div>
            <label className={`block text-xs font-semibold mb-1 uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-slate-700'}`}>
              Username ID
            </label>
            <input 
              type="text" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              className={`w-full px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-amber-500 border transition-colors ${
                isDark 
                  ? 'bg-slate-900 border-slate-700 text-white' 
                  : 'bg-slate-50 border-slate-300 text-slate-950 focus:bg-white'
              }`}
            />
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1 uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-slate-700'}`}>
              Secure PIN / Password
            </label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className={`w-full px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-amber-500 border transition-colors ${
                isDark 
                  ? 'bg-slate-900 border-slate-700 text-white' 
                  : 'bg-slate-50 border-slate-300 text-slate-950 focus:bg-white'
              }`}
            />
          </div>

          <div className="flex justify-between items-center text-xs mt-1 px-1">
            <button
              type="button"
              onClick={() => {
                setShowForgotPassword(true);
                setLoginError('');
                setForgotError('');
                setForgotSuccess('');
              }}
              className="text-amber-500 hover:text-amber-400 hover:underline font-bold transition-all cursor-pointer"
            >
              Forgot Password?
            </button>
            <span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>Secure Portal Node</span>
          </div>

          <div className={`p-2.5 rounded-lg text-center text-[11px] font-medium transition-colors border ${
            isDark ? 'bg-slate-900/40 border-slate-800 text-gray-400' : 'bg-amber-50/30 border-amber-500/10 text-slate-650'
          }`}>
            Authorization Demo Credentials: <span className="text-amber-500 font-semibold font-mono">admin</span> / <span className="text-amber-500 font-semibold font-mono">admin</span>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs uppercase tracking-wider transition-all flex justify-center items-center gap-2 cursor-pointer"
          >
            <Unlock size={14} />
            Unlock Dashboard
          </button>
        </form>
      </div>
    );
  }  const inputClass = isDark 
    ? "w-full px-3 py-2 bg-slate-900 border border-slate-700 text-xs text-white rounded focus:border-amber-500 focus:outline-none" 
    : "w-full px-3 py-2 bg-slate-50 border border-slate-300 text-xs text-slate-950 rounded focus:bg-white focus:border-amber-500 focus:outline-none";

  const textareaClass = isDark 
    ? "w-full px-3 py-2 bg-slate-900 border border-slate-700 text-xs text-white rounded focus:border-amber-500 focus:outline-none resize-none leading-relaxed" 
    : "w-full px-3 py-2 bg-slate-50 border border-slate-300 text-xs text-slate-950 rounded focus:bg-white focus:border-amber-500 focus:outline-none resize-none leading-relaxed";

  const selectClass = isDark 
    ? "w-full px-3 py-2 bg-slate-900 border border-slate-700 text-xs text-white rounded focus:border-amber-500 focus:outline-none" 
    : "w-full px-3 py-2 bg-slate-50 border border-slate-300 text-xs text-slate-950 rounded focus:bg-white focus:border-amber-500 focus:outline-none";

  const labelClass = isDark 
    ? "block text-xs text-gray-400 mb-1 font-semibold" 
    : "block text-xs text-slate-600 mb-1 font-semibold";

  const smallInputClass = isDark 
    ? "w-full px-2 py-1 bg-slate-900 border border-slate-700 text-xs text-white rounded focus:border-amber-500 focus:outline-none" 
    : "w-full px-2 py-1 bg-slate-50 border border-slate-300 text-xs text-slate-950 rounded focus:bg-white focus:border-amber-500 focus:outline-none";

  return (
    <div className={`transition-colors p-4 md:p-8 space-y-6 border rounded-2xl ${
      isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm text-slate-800'
    }`}>
      
      {/* Admin Panel Header */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5 ${
        isDark ? 'border-slate-800' : 'border-slate-200/80'
      }`}>
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500 text-slate-950 rounded-xl">
            <Building2 size={24} />
          </div>
          <div>
            <h3 className={`text-2xl font-bold font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>Executive Control Center</h3>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-550'}`}>Logged in as Administrator (Tasha Contracts Corporate)</p>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className={`px-4 py-1.5 rounded-lg text-xs transition-colors border select-none cursor-pointer ${
            isDark 
              ? 'bg-slate-800 text-gray-300 hover:text-white hover:bg-slate-700 border-slate-700' 
              : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300 shadow-xs'
          }`}
        >
          Gate Lock (Logout)
        </button>
      </div>

      {/* Admin Menu Tabs */}
      <div className={`flex flex-wrap gap-2 border-b pb-4 ${isDark ? 'border-slate-800/40' : 'border-slate-200'}`}>
        {[
          { id: 'overview', label: 'Overview Metrics' },
          { id: 'projects', label: 'Manage Projects' },
          { id: 'services', label: 'Service Categories' },
          { id: 'quotes', label: `Quotes (${quotes.length})` },
          { id: 'contacts', label: 'Client Feedback' },
          { id: 'system', label: 'System Configuration' },
          { id: 'testimonials', label: `Testimonials (${testimonials?.length || 0})` },
          { id: 'team', label: `Our Team (${team?.length || 0})` },
          { id: 'industries', label: `Industries Served (${industries?.length || 0})` },
          { id: 'partners', label: `Partner Brands (${partners?.length || 0})` },
          { id: 'security', label: 'Security & Password' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveSubTab(tab.id as any);
              setEditingProject(null);
              setEditingService(null);
              setEditingCareer(null);
              setEditingIndustry(null);
              setEditingPartner(null);
              setIsAddingPartner(false);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none border ${
              activeSubTab === tab.id 
                ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm' 
                : isDark 
                  ? 'bg-slate-800/50 text-gray-400 hover:bg-slate-800 hover:text-white border-slate-750'
                  : 'bg-slate-100 text-slate-650 hover:bg-slate-200 hover:text-slate-900 border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* --- Tab Content: Overview --- */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6 animate-fade-in-up">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className={`p-5 rounded-xl space-y-2 border transition-colors ${
              isDark ? 'bg-slate-800/20 border-slate-700/30' : 'bg-slate-50/70 border-slate-200/80 shadow-xs'
            }`}>
              <span className={`text-xs block font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Ongoing Bids</span>
              <p className="text-3xl font-extrabold font-display text-amber-500">{quotes.filter(q => q.status === 'Pending').length} Pending</p>
              <span className={`text-[10px] uppercase ${isDark ? 'text-gray-550' : 'text-slate-400'}`}>Total bidding value in review</span>
            </div>

            <div className={`p-5 rounded-xl space-y-2 border transition-colors ${
              isDark ? 'bg-slate-800/20 border-slate-700/30' : 'bg-slate-50/70 border-slate-200/80 shadow-xs'
            }`}>
              <span className={`text-xs block font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Dynamic Projects</span>
              <p className={`text-3xl font-extrabold font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>{projects.length} Entries</p>
              <span className={`text-[10px] uppercase ${isDark ? 'text-gray-550' : 'text-slate-400'}`}>{projects.filter(p => p.status === 'Ongoing').length} active site frameworks</span>
            </div>

            <div className={`p-5 rounded-xl space-y-2 border transition-colors ${
              isDark ? 'bg-slate-800/20 border-slate-700/30' : 'bg-slate-50/70 border-slate-200/80 shadow-xs'
            }`}>
              <span className={`text-xs block font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Open Vacancies</span>
              <p className="text-3xl font-extrabold font-display text-emerald-555">{careers.filter(c => c.active).length} Active</p>
              <span className={`text-[10px] uppercase ${isDark ? 'text-gray-550' : 'text-slate-400'}`}>{applications.length} candidacies submitted</span>
            </div>

            <div className={`p-5 rounded-xl space-y-2 border transition-colors ${
              isDark ? 'bg-slate-800/20 border-slate-700/30' : 'bg-slate-50/70 border-slate-200/80 shadow-xs'
            }`}>
              <span className={`text-xs block font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Unread Messages</span>
              <p className="text-3xl font-extrabold font-display text-amber-500">{contacts.filter(c => c.status === 'New').length} New</p>
              <span className={`text-[10px] uppercase ${isDark ? 'text-gray-555' : 'text-slate-410'}`}>Awaiting contact response</span>
            </div>
          </div>

          <div className={`p-5 rounded-2xl space-y-2 border transition-colors ${
            isDark ? 'bg-amber-500/5 border-amber-500/10' : 'bg-amber-50/40 border-amber-500/15'
          }`}>
            <h4 className="text-sm font-bold text-amber-500 uppercase tracking-widest">Platform Sync Guide</h4>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
              Tasha Contracts India runs an instantaneous, LocalStorage state synchronization framework with fallback capabilities. Any revisions, projects, jobs, or pricing levels updated inside this executive portal are immediately rendered across the frontend visitor views in real time.
            </p>
          </div>

          <div className={`p-6 rounded-2xl border transition-all ${
            isDark ? 'bg-slate-850/40 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className={`text-sm font-bold font-display uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Cloud Database Sync & Recovery Suite
                  </h4>
                  {dbMode === 'firebase' ? (
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/25 rounded-full text-[10px] font-mono leading-none flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Live Cloud Active
                    </span>
                  ) : dbMode === 'connecting' ? (
                    <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 border border-amber-500/25 rounded-full text-[10px] font-mono leading-none flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" /> Checking Connection...
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-rose-500/10 text-rose-500 border border-rose-500/25 rounded-full text-[10px] font-mono leading-none flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" /> Offline Local Storage Mode
                    </span>
                  )}
                </div>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-slate-650'}`}>
                  Ensure your local browser edits match the Live Cloud Firestore database so your changes are securely stored.
                </p>
              </div>

              {dbMode === 'firebase' && (
                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  <button
                    type="button"
                    onClick={onForceUploadToCloud}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg uppercase tracking-wider select-none cursor-pointer flex items-center gap-1.5 transition-colors"
                  >
                    <RefreshCw size={12} className="animate-spin-slow animate-pulse" /> Push Local Data to Cloud
                  </button>
                  <button
                    type="button"
                    onClick={onForceDownloadFromCloud}
                    className="px-4 py-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold rounded-lg select-none cursor-pointer flex items-center gap-1.5 transition-all"
                  >
                    <Download size={12} /> Pull Cloud Data
                  </button>
                </div>
              )}
            </div>

            <div className={`p-4 rounded-xl text-left border ${
              isDark ? 'bg-slate-900/60 border-slate-800 text-gray-300' : 'bg-slate-50 border-slate-150 text-slate-650'
            }`}>
              <h5 className="text-xs font-bold uppercase text-amber-500 mb-1.5">Where is my data?</h5>
              <p className="text-xs leading-relaxed">
                If you have previously filled in many pages/forms of custom information, but see the standard defaults: 
                Your edits are safely stored in your browser's local cache. Simply click <strong>"Push Local Data to Cloud"</strong> above to instantly upload and lock your customizations into the central Firestore database!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* --- Tab Content: Projects --- */}
      {activeSubTab === 'projects' && (
        <div className="space-y-6 animate-fade-in-up">
          <div className="flex justify-between items-center bg-slate-800/30 p-3.5 rounded-xl">
            <span className="text-xs text-gray-300 font-semibold">{projects.length} total designs on display</span>
            <button
              onClick={() => setEditingProject({})}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1 uppercase tracking-wide cursor-pointer"
            >
              <Plus size={14} /> Add Project
            </button>
          </div>

          {/* Project Edit/Add Form Context */}
          {editingProject && (
            <form onSubmit={handleSaveProject} className="p-5 bg-slate-800/30 border border-amber-500/20 rounded-xl space-y-4">
              <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wide">
                {editingProject.id ? 'Edit Selected Project' : 'Register New Project'}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Project Name *</label>
                  <input
                    type="text" required
                    value={editingProject.title || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-xs text-white rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Category Category *</label>
                  <select
                    value={editingProject.category || 'Civil Construction'}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-xs text-white rounded"
                  >
                    <option value="LGSF / Prefabricated">LGSF / Prefabricated</option>
                    <option value="Civil Construction">Civil Construction</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Residential">Residential</option>
                    <option value="Interior Fit-Out">Interior Fit-Out</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Location State/City</label>
                  <input
                    type="text"
                    value={editingProject.location || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-xs text-white rounded"
                    placeholder="e.g. Sarojini Nagar, Delhi"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Completion/ETA Date</label>
                  <input
                    type="text"
                    value={editingProject.completionDate || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, completionDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-xs text-white rounded"
                    placeholder="e.g. Estimated Oct 2026"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Client Authority</label>
                  <input
                    type="text"
                    value={editingProject.client || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-xs text-white rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Status</label>
                  <select
                    value={editingProject.status || 'Ongoing'}
                    onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-xs text-white rounded"
                  >
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Image URL (Unsplash or direct URL)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editingProject.image || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value })}
                      className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 text-xs text-white rounded"
                    />
                    <CloudinaryUploadButton 
                      onSuccess={(url) => setEditingProject({ ...editingProject, image: url })}
                      label="Upload Image"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Before & After Comparatives (Optional)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editingProject.beforeImage || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, beforeImage: e.target.value })}
                      placeholder="Raw Site Image URL"
                      className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 text-xs text-white rounded hover:border-slate-600 focus:border-amber-500"
                    />
                    <CloudinaryUploadButton 
                      onSuccess={(url) => setEditingProject({ ...editingProject, beforeImage: url })}
                      label="Before"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editingProject.afterImage || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, afterImage: e.target.value })}
                      placeholder="Completed Building Image URL (Same angle)"
                      className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 text-xs text-white rounded hover:border-slate-600 focus:border-amber-500"
                    />
                    <CloudinaryUploadButton 
                      onSuccess={(url) => setEditingProject({ ...editingProject, afterImage: url })}
                      label="After"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Project Technical Description</label>
                <textarea
                  rows={3}
                  value={editingProject.description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-xs text-white rounded"
                />
              </div>

              {/* PORTFOLIO GALLERY IMAGES */}
              <div className="border border-slate-700/60 bg-slate-900/40 rounded-xl p-4.5 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-700/60 pb-2">
                  <div>
                    <h5 className="text-xs font-extrabold text-amber-500 uppercase tracking-widest flex items-center gap-1.5">
                      <Star size={14} className="fill-amber-500 text-amber-500 animate-pulse" /> Portfolio Gallery Photos
                    </h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Upload minimum 8+ high-resolution photos. First image is default cover, or select any photo below as cover.
                    </p>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded font-mono text-[10px]">
                    {(editingProject.galleryImages || []).length} Photos
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 bg-slate-950/40 p-3 rounded-lg border border-slate-800">
                  {/* Photo addition - Upload option */}
                  <div className="space-y-1.5">
                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Option A: Upload Image</span>
                    <CloudinaryUploadButton 
                      onSuccess={(url) => {
                        if (url) {
                          const current = editingProject.galleryImages || [];
                          setEditingProject({
                            ...editingProject,
                            galleryImages: [...current, url]
                          });
                        }
                      }}
                      label="Upload Photo to Portfolio"
                    />
                  </div>

                  {/* Photo addition - Input URL option */}
                  <div className="space-y-1.5 font-sans">
                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider flex justify-between items-center">
                      <span>Option B: Link URL or click "Add Photo" to Upload File</span>
                      {galleryUrlError && (
                        <span className="text-red-400 text-[9px] font-medium lowercase animate-pulse tracking-normal">
                          * Please enter a valid URL or choose a file
                        </span>
                      )}
                    </span>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        placeholder="Paste image URL..."
                        value={newGalleryImageUrl}
                        disabled={isUploading}
                        onChange={(e) => {
                          setNewGalleryImageUrl(e.target.value);
                          if (galleryUrlError) setGalleryUrlError(false);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (newGalleryImageUrl.trim()) {
                              const current = editingProject.galleryImages || [];
                              setEditingProject({
                                ...editingProject,
                                galleryImages: [...current, newGalleryImageUrl.trim()]
                              });
                              setNewGalleryImageUrl('');
                              setGalleryUrlError(false);
                            } else {
                              optionBFileInputRef.current?.click();
                            }
                          }
                        }}
                        className={`flex-1 px-2.5 py-1.5 bg-slate-900 border text-[11px] text-white rounded focus:border-amber-500 focus:outline-none transition-all ${
                          galleryUrlError ? 'border-red-500 placeholder-red-400/50 bg-red-950/20' : 'border-slate-700'
                        }`}
                      />
                      <input 
                        type="file" 
                        ref={optionBFileInputRef}
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleOptionBFileChange} 
                        disabled={isUploading}
                      />
                      <button
                        type="button"
                        disabled={isUploading}
                        onClick={() => {
                          if (newGalleryImageUrl.trim()) {
                            const current = editingProject.galleryImages || [];
                            setEditingProject({
                              ...editingProject,
                              galleryImages: [...current, newGalleryImageUrl.trim()]
                            });
                            setNewGalleryImageUrl('');
                            setGalleryUrlError(false);
                          } else {
                            // Trigger local folder/file browser dialog direct!
                            optionBFileInputRef.current?.click();
                          }
                        }}
                        className={`px-3 py-1.5 text-slate-950 font-black text-[11px] rounded transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                          isUploading ? 'bg-amber-400/50 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-400'
                        }`}
                      >
                        {isUploading ? (
                          <>
                            <RefreshCw size={11} className="animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          'Add Photo'
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Grid of gallery thumbs */}
                {(editingProject.galleryImages && editingProject.galleryImages.length > 0) ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {editingProject.galleryImages.map((imgUrl, index) => {
                      const isCover = editingProject.image === imgUrl;
                      return (
                        <div 
                          key={index} 
                          className={`group relative rounded-lg overflow-hidden border transition-all aspect-video ${
                            isCover ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-800 bg-slate-950/60'
                          }`}
                        >
                          <img 
                            src={imgUrl} 
                            alt={`Preview ${index + 1}`} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                          
                          {/* Image Hover Controls */}
                          <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-1.5">
                            {/* Top action row */}
                            <div className="flex justify-between items-center w-full">
                              <span className="text-[9px] font-mono font-bold bg-slate-900 px-1 py-0.5 rounded text-gray-400">
                                #{index + 1}
                              </span>
                              
                              <button
                                type="button"
                                onClick={() => {
                                  const current = editingProject.galleryImages || [];
                                  const updated = current.filter((_, idx) => idx !== index);
                                  setEditingProject({
                                    ...editingProject,
                                    galleryImages: updated
                                  });
                                }}
                                className="p-1 bg-red-600/90 hover:bg-red-500 text-white rounded transition-colors"
                                title="Remove Image"
                              >
                                <Trash2 size={10} />
                              </button>
                            </div>

                            {/* Middle Title/Status if featured */}
                            <div className="text-center">
                              {isCover ? (
                                <span className="bg-amber-500 text-slate-950 text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wider flex items-center gap-0.5 justify-center">
                                  ★ COVER
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingProject({
                                      ...editingProject,
                                      image: imgUrl
                                    });
                                  }}
                                  className="mx-auto text-[8px] bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-400 font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wide transition-all border border-slate-700/60"
                                >
                                  Set Cover
                                </button>
                              )}
                            </div>

                            {/* Reordering bottom buttons row */}
                            <div className="flex justify-center items-center gap-1.5 w-full">
                              <button
                                type="button"
                                disabled={index === 0}
                                onClick={() => {
                                  if (index === 0) return;
                                  const current = [...(editingProject.galleryImages || [])];
                                  const temp = current[index];
                                  current[index] = current[index - 1];
                                  current[index - 1] = temp;
                                  setEditingProject({
                                    ...editingProject,
                                    galleryImages: current
                                  });
                                }}
                                className="p-1 px-1.5 bg-slate-800 hover:bg-amber-500 text-gray-300 hover:text-slate-950 rounded text-[9px] font-bold disabled:opacity-30 disabled:hover:bg-slate-800 disabled:hover:text-gray-300"
                                title="Move Earlier"
                              >
                                ◀
                              </button>
                              <span className="text-[10px] font-bold text-gray-400 font-mono">Order</span>
                              <button
                                type="button"
                                disabled={index === (editingProject.galleryImages || []).length - 1}
                                onClick={() => {
                                  const current = editingProject.galleryImages || [];
                                  if (index === current.length - 1) return;
                                  const updated = [...current];
                                  const temp = updated[index];
                                  updated[index] = updated[index + 1];
                                  updated[index + 1] = temp;
                                  setEditingProject({
                                    ...editingProject,
                                    galleryImages: updated
                                  });
                                }}
                                className="p-1 px-1.5 bg-slate-800 hover:bg-amber-500 text-gray-300 hover:text-slate-950 rounded text-[9px] font-bold disabled:opacity-30 disabled:hover:bg-slate-800 disabled:hover:text-gray-300"
                                title="Move Later"
                              >
                                ▶
                              </button>
                            </div>
                          </div>

                          {/* Default Static Overlay Indicators (when not hovered) */}
                          <div className="absolute bottom-1 right-1 pointer-events-none transition-opacity duration-200 group-hover:opacity-0">
                            {isCover && (
                              <span className="bg-amber-500 border border-slate-950 text-slate-950 text-[8px] font-extrabold uppercase px-1 py-0.2 rounded shadow-md">
                                ★ COVER
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6 border border-dashed border-slate-700/60 rounded-xl bg-slate-900/10">
                    <p className="text-xs text-slate-400">No project portfolio gallery photos uploaded yet.</p>
                    <p className="text-[10px] text-slate-500 mt-1">Upload at least 8+ project images using Option A or B above.</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-1.5 bg-slate-800 text-xs rounded text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-500 text-slate-950 text-xs font-bold rounded"
                >
                  Save Project Blueprint
                </button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto">
            <table className={`w-full text-left text-xs border-collapse transition-colors ${
              isDark ? 'text-gray-300' : 'text-slate-700'
            }`}>
              <thead className={`uppercase text-[10px] tracking-wider transition-colors ${
                isDark ? 'bg-slate-805 text-gray-400' : 'bg-slate-100 text-slate-700 border-b border-slate-205'
              }`}>
                <tr>
                  <th className="p-3 font-extrabold">Project Title</th>
                  <th className="p-3 font-extrabold">Category</th>
                  <th className="p-3 font-extrabold">Location</th>
                  <th className="p-3 font-extrabold">Client</th>
                  <th className="p-3 font-extrabold">Status</th>
                  <th className="p-3 text-right font-extrabold">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y transition-colors ${
                isDark ? 'divide-slate-800' : 'divide-slate-200'
              }`}>
                {projects.map((p) => (
                  <tr key={p.id} className={`transition-colors ${
                    isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'
                  }`}>
                    <td className={`p-3 font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{p.title}</td>
                    <td className="p-3">{p.category}</td>
                    <td className="p-3">{p.location}</td>
                    <td className="p-3 truncate max-w-[150px]">{p.client}</td>
                    <td className="p-3 font-medium">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.status === 'Completed' 
                          ? isDark ? 'bg-emerald-500/20 text-emerald-305' : 'bg-emerald-100 text-emerald-800'
                          : isDark ? 'bg-amber-500/20 text-amber-305' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                      <button 
                        onClick={() => setEditingProject(p)}
                        className={`p-1 transition-colors ${isDark ? 'text-gray-400 hover:text-amber-400' : 'text-slate-500 hover:text-amber-500'}`}
                        title="Edit project properties"
                      >
                        <Edit2 size={13} className="inline animate-fade-in" />
                      </button>
                      <button 
                        onClick={() => handleDeleteProject(p.id)}
                        className={`p-1 transition-colors ${isDark ? 'text-gray-400 hover:text-red-400' : 'text-slate-500 hover:text-red-650'}`}
                        title="Remove project from display"
                      >
                        <Trash2 size={13} className="inline animate-fade-in" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- Tab Content: Services --- */}
      {activeSubTab === 'services' && (
        <div className="space-y-6 animate-fade-in-up">
          <div className={`flex justify-between items-center p-2.5 rounded-xl border transition-colors ${
            isDark ? 'bg-slate-800/30 border-transparent' : 'bg-slate-100 border-slate-205'
          }`}>
            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-600 font-semibold'}`}>Manage Tasha Service Catalogs</span>
            <button
              onClick={() => setEditingService({})}
              className="px-3 py-1.5 bg-amber-500 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1 hover:bg-amber-400 transition-colors"
            >
              <Plus size={14} /> Add Core Service
            </button>
          </div>

          {editingService && (
            <form onSubmit={handleSaveService} className={`p-5 rounded-xl space-y-4 border transition-colors ${
              isDark ? 'bg-slate-800/30 border-slate-700/60' : 'bg-white border-slate-205 shadow-sm'
            }`}>
              <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider">
                {editingService.id ? 'Edit Service' : 'Add New Service category'}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-slate-650 font-medium'}`}>Service Name *</label>
                  <input
                    type="text" required
                    value={editingService.name || ''}
                    onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                    className={`w-full px-3 py-2 text-xs rounded border transition-colors ${
                      isDark 
                        ? 'bg-slate-900 border-slate-700 text-white focus:border-amber-500' 
                        : 'bg-slate-50 border-slate-300 text-slate-950 focus:bg-white focus:border-amber-500'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-slate-650 font-medium'}`}>Lucide Icon name (e.g. Shield, Layers, Building2, Wrench, Zap)</label>
                  <input
                    type="text"
                    value={editingService.iconName || ''}
                    onChange={(e) => setEditingService({ ...editingService, iconName: e.target.value })}
                    className={`w-full px-3 py-2 text-xs rounded border transition-colors ${
                      isDark 
                        ? 'bg-slate-900 border-slate-700 text-white focus:border-amber-500' 
                        : 'bg-slate-50 border-slate-300 text-slate-950 focus:bg-white focus:border-amber-500'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-slate-650 font-medium'}`}>Short Description</label>
                <input
                  type="text"
                  value={editingService.description || ''}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  className={`w-full px-3 py-2 text-xs rounded border transition-colors ${
                    isDark 
                      ? 'bg-slate-900 border-slate-700 text-white focus:border-amber-500' 
                      : 'bg-slate-50 border-slate-300 text-slate-950 focus:bg-white focus:border-amber-500'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-slate-650 font-medium'}`}>Comprehensive Details</label>
                <textarea
                  rows={2}
                  value={editingService.details || ''}
                  onChange={(e) => setEditingService({ ...editingService, details: e.target.value })}
                  className={`w-full px-3 py-2 text-xs rounded border transition-colors ${
                    isDark 
                      ? 'bg-slate-900 border-slate-700 text-white focus:border-amber-500' 
                      : 'bg-slate-50 border-slate-300 text-slate-950 focus:bg-white focus:border-amber-500'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-slate-650 font-medium'}`}>Service Guarantees / Key Features (One per line)</label>
                <textarea
                  rows={4}
                  placeholder="e.g.&#10;High-resistance reinforcement concrete&#10;Accurate computer-aided land surveying&#10;Industrial grade retaining structures"
                  value={(editingService.features || []).join('\n')}
                  onChange={(e) => setEditingService({ 
                    ...editingService, 
                    features: e.target.value.split('\n')
                  })}
                  className={`w-full px-3 py-2 text-xs rounded border transition-colors ${
                    isDark 
                      ? 'bg-slate-900 border-slate-700 text-white focus:border-amber-500' 
                      : 'bg-slate-50 border-slate-300 text-slate-950 focus:bg-white focus:border-amber-500'
                  }`}
                />
                <p className="text-[10px] text-slate-500 mt-1">Provide custom lists that will display as tick marks under Guarantees on this service card.</p>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className={`px-4 py-1 text-xs rounded ${isDark ? 'bg-slate-800 text-gray-300' : 'bg-slate-200 text-slate-700 hover:bg-slate-250 font-medium'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 bg-amber-500 text-slate-950 text-xs font-bold rounded"
                >
                  Save Service
                </button>
              </div>
            </form>
          )}

          <div className={`grid grid-cols-1 gap-3 text-xs transition-colors ${isDark ? 'text-gray-305' : 'text-slate-700'}`}>
            {services.map(s => (
              <div key={s.id} className={`p-4 border rounded-xl flex items-center justify-between transition-colors ${
                isDark ? 'bg-slate-800/40 border-slate-700/20' : 'bg-white border-slate-205 hover:bg-slate-50/50 shadow-sm'
              }`}>
                <div>
                  <h5 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{s.name}</h5>
                  <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>{s.description}</p>
                </div>
                <div className="space-x-1.5 shrink-0 ml-4">
                  <button onClick={() => setEditingService(s)} className={`p-1 hover:text-amber-500 transition-colors ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                    <Edit2 size={13} className="inline" />
                  </button>
                  <button onClick={() => handleDeleteService(s.id)} className={`p-1 hover:text-red-500 transition-colors ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                    <Trash2 size={13} className="inline" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- Tab Content: Quotes --- */}
      {activeSubTab === 'quotes' && (
        <div className="space-y-6 animate-fade-in-up">
          <div className="flex justify-between items-center whitespace-normal">
            <h4 className={`text-sm font-bold uppercase ${isDark ? 'text-amber-500' : 'text-amber-600'}`}>Incoming Estimating & Bidding Requests</h4>
            <span className={`text-[10px] px-2.5 py-1 rounded uppercase font-mono font-bold tracking-wide ${
              isDark ? 'bg-slate-800 text-gray-400' : 'bg-slate-100 text-slate-700 border border-slate-200'
            }`}>
              {quotes.length} requests logged
            </span>
          </div>

          <div className="space-y-4">
            {quotes.length === 0 ? (
              <div className={`p-6 text-center text-xs rounded-xl border ${
                isDark ? 'bg-slate-800/20 border-transparent text-gray-400' : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}>
                No client estimating requests have been submitted yet.
              </div>
            ) : (
              quotes.map((quote) => (
                <div 
                  key={quote.id} 
                  className={`p-5 rounded-2xl border transition-colors ${
                    quote.status === 'Pending' 
                      ? isDark ? 'border-amber-500/25 bg-amber-500/[0.02]' : 'border-amber-500/40 bg-amber-500/[0.02]'
                      : isDark ? 'border-slate-800 bg-slate-800/25' : 'border-slate-200 bg-white shadow-sm'
                  } space-y-4`}
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                    <div>
                      <h5 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{quote.fullName}</h5>
                      <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-400' : 'text-slate-600 font-medium'}`}>
                        {quote.companyName} | {quote.email} | {quote.mobileNumber}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                        {new Date(quote.submissionDate).toLocaleString()}
                      </span>
                      <select
                        value={quote.status}
                        onChange={(e) => handleQuoteStatusChange(quote.id, e.target.value as any)}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                          quote.status === 'Pending' 
                            ? 'bg-amber-500 text-slate-950' 
                            : quote.status === 'Reviewed' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-emerald-500 text-slate-950'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="Contacted">Contacted</option>
                      </select>
                    </div>
                  </div>

                  <div className={`grid grid-cols-1 md:grid-cols-3 gap-2 p-3 rounded-lg text-xs border ${
                    isDark ? 'bg-slate-900/60 border-transparent' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}>
                    <div>
                      <span className={`${isDark ? 'text-gray-400' : 'text-slate-500 font-medium'}`}>Bid Category:</span>{' '}
                      <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{quote.projectType}</span>
                    </div>
                    <div>
                      <span className={`${isDark ? 'text-gray-400' : 'text-slate-500 font-medium'}`}>Budget Level:</span>{' '}
                      <span className="text-amber-600 font-extrabold">{quote.budgetRange}</span>
                    </div>
                    <div>
                      <span className={`${isDark ? 'text-gray-400' : 'text-slate-500 font-medium'}`}>Site Location:</span>{' '}
                      <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{quote.location}</span>
                    </div>
                  </div>

                  {quote.message && (
                    <p className={`text-xs leading-relaxed p-3 rounded-lg border ${
                      isDark ? 'bg-slate-900/20 border-transparent text-gray-300' : 'bg-slate-50/50 border-slate-150 text-slate-750'
                    }`}>
                      <span className="text-[10px] uppercase font-bold text-amber-600 block mb-1">Client Specifications:</span>
                      {quote.message}
                    </p>
                  )}

                  {quote.fileName && (
                    <div className="space-y-4 pt-2">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                        isDark ? 'bg-slate-900 border-slate-700 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      }`}>
                        <FileText size={14} />
                        <span className="truncate max-w-xs">{quote.fileName}</span>
                        <span className="text-[9px] text-gray-500 uppercase">(Site Drawing Uploaded)</span>
                      </div>

                      {quote.fileData ? (
                        <div className={`mt-2 group relative max-w-md rounded-xl overflow-hidden border p-3 text-left ${
                          isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-200 bg-slate-50/60'
                        }`}>
                          {quote.fileData.startsWith('data:image/') || quote.fileName?.match(/\.(png|jpg|jpeg|gif|webp)$/i) ? (
                            <div className="space-y-2">
                              <span className="text-[10px] text-amber-600 uppercase font-black tracking-wider block">Image Attachment Preview:</span>
                              <div className={`relative overflow-hidden rounded-lg min-h-[140px] max-h-[300px] flex items-center justify-center border ${
                                isDark ? 'bg-slate-900 border-slate-700/50' : 'bg-white border-slate-200 shadow-inner'
                              }`}>
                                <img 
                                  src={quote.fileData || null} 
                                  alt={quote.fileName} 
                                  referrerPolicy="no-referrer"
                                  className="object-contain max-h-[280px] w-full rounded-lg transition-transform duration-300 group-hover:scale-[1.01]"
                                />
                                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                  <a 
                                    href={quote.fileData} 
                                    download={quote.fileName || 'uploaded_image'}
                                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-150 dark:text-slate-950 text-xs font-black rounded-lg shadow-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                                  >
                                    <Download size={14} /> Download File
                                  </a>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const win = window.open();
                                      if (win) {
                                        win.document.write(`<div style="display:flex;align-items:center;justify-content:center;background:#0d1527;min-height:100vh;margin:0;"><img src="${quote.fileData}" style="max-width:100%;max-height:100vh;object-fit:contain;border-radius:8px;box-shadow:0 10px 30px rgba(0,0,0,0.5);" /></div>`);
                                      }
                                    }}
                                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg shadow-lg flex items-center gap-1.5 border border-slate-600 transition-colors cursor-pointer"
                                  >
                                    <Eye size={14} /> Open Fullscreen
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className={`flex items-center justify-between p-3 rounded-lg border ${
                              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                            }`}>
                              <div className="flex items-center gap-2.5">
                                <FileText className="text-amber-500 shrink-0" size={20} />
                                <div className="min-w-0">
                                  <p className={`text-xs font-bold truncate max-w-[200px] ${isDark ? 'text-white' : 'text-slate-900'}`}>{quote.fileName}</p>
                                  <p className={`text-[10px] uppercase font-semibold ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Document / CAD Design</p>
                                </div>
                              </div>
                              <a 
                                href={quote.fileData} 
                                download={quote.fileName || 'document'}
                                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-150 dark:text-slate-950 text-[11px] font-black rounded-lg shadow flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <Download size={12} /> Download
                              </a>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className={`text-[10px] p-2.5 rounded-lg max-w-sm border ${
                          isDark ? 'text-amber-400/80 bg-amber-500/5 border-amber-500/10' : 'text-amber-850 bg-amber-50/70 border-amber-500/30'
                        }`}>
                          💡 <span className="font-bold">File Content Stored Remotely or Completed as Offline Metadata: </span> Since this quote submission is from a past trial session, the full image binary is not stored in your local browser state. New submissions upload the image perfectly!
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* --- Tab Content: Careers HR --- */}
      {activeSubTab === 'careers' && (
        <div className="space-y-6 animate-fade-in-up">
          <div className={`flex justify-between items-center p-2.5 rounded-xl border transition-colors ${
            isDark ? 'bg-slate-800/30 border-transparent' : 'bg-slate-100 border-slate-205'
          }`}>
            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-605 font-semibold'}`}>Manage Candidate Vacancies</span>
            <button
              onClick={() => setEditingCareer({})}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Plus size={14} /> Publish Opening
            </button>
          </div>

          {editingCareer && (
            <form onSubmit={handleSaveCareer} className={`p-5 rounded-xl space-y-4 border transition-colors ${
              isDark ? 'bg-slate-800/30 border-emerald-500/20' : 'bg-white border-slate-205 shadow-sm'
            }`}>
              <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                {editingCareer.id ? 'Edit Posting' : 'Publish New Career Role'}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-slate-655 font-medium'}`}>Job Title *</label>
                  <input
                    type="text" required
                    value={editingCareer.title || ''}
                    onChange={(e) => setEditingCareer({ ...editingCareer, title: e.target.value })}
                    className={`w-full px-3 py-2 text-xs rounded border transition-colors ${
                      isDark 
                        ? 'bg-slate-900 border-slate-700 text-white focus:border-amber-500' 
                        : 'bg-slate-50 border-slate-300 text-slate-950 focus:bg-white focus:border-amber-500'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-slate-655 font-medium'}`}>Department *</label>
                  <input
                    type="text" required
                    value={editingCareer.department || ''}
                    onChange={(e) => setEditingCareer({ ...editingCareer, department: e.target.value })}
                    className={`w-full px-3 py-2 text-xs rounded border transition-colors ${
                      isDark 
                        ? 'bg-slate-900 border-slate-700 text-white focus:border-amber-500' 
                        : 'bg-slate-50 border-slate-300 text-slate-950 focus:bg-white focus:border-amber-550'
                    }`}
                    placeholder="e.g. Estimations / Design"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-slate-655 font-medium'}`}>Location Address</label>
                  <input
                    type="text"
                    value={editingCareer.location || ''}
                    onChange={(e) => setEditingCareer({ ...editingCareer, location: e.target.value })}
                    className={`w-full px-3 py-2 text-xs rounded border transition-colors ${
                      isDark 
                        ? 'bg-slate-900 border-slate-700 text-white focus:border-amber-500' 
                        : 'bg-slate-50 border-slate-300 text-slate-950 focus:bg-white focus:border-amber-550'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-slate-655 font-medium'}`}>Execution Type</label>
                  <select
                    value={editingCareer.type || 'Full-time'}
                    onChange={(e) => setEditingCareer({ ...editingCareer, type: e.target.value as any })}
                    className={`w-full px-3 py-2 text-xs rounded border transition-colors ${
                      isDark 
                        ? 'bg-slate-900 border-slate-700 text-white focus:border-amber-500' 
                        : 'bg-slate-50 border-slate-300 text-slate-950 focus:bg-white focus:border-amber-550'
                    }`}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Part-time">Part-time</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={`block text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-slate-655 font-medium'}`}>Work Responsibilities Summary</label>
                <textarea
                  rows={2}
                  value={editingCareer.description || ''}
                  onChange={(e) => setEditingCareer({ ...editingCareer, description: e.target.value })}
                  className={`w-full px-3 py-2 text-xs rounded border transition-colors ${
                    isDark 
                      ? 'bg-slate-900 border-slate-700 text-white focus:border-amber-500' 
                      : 'bg-slate-50 border-slate-300 text-slate-950 focus:bg-white focus:border-amber-550'
                  }`}
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCareer(null)}
                  className={`px-4 py-1.5 text-xs rounded ${isDark ? 'bg-slate-800 text-gray-300' : 'bg-slate-205 text-slate-700 hover:bg-slate-250 font-medium'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded"
                >
                  Publish Active Role
                </button>
              </div>
            </form>
          )}

          {/* Submitted Applications Feed */}
          <div className="space-y-4">
            <h5 className={`text-xs font-bold text-amber-600 uppercase tracking-widest border-b pb-2 ${
              isDark ? 'border-slate-800' : 'border-slate-200'
            }`}>
              Human Resource Applicants ({applications.length})
            </h5>
            
            {applications.length === 0 ? (
              <p className={`text-xs italic p-3 rounded-lg border ${
                isDark ? 'text-gray-500 border-transparent' : 'text-slate-550 bg-slate-50 border-slate-200'
              }`}>No resume submissions registered yet.</p>
            ) : (
              applications.map((app) => (
                <div key={app.id} className={`p-4 border rounded-xl space-y-2 text-xs transition-colors ${
                  isDark ? 'bg-slate-800/30 border-slate-700/30' : 'bg-white border-slate-205 shadow-sm'
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h6 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{app.fullName}</h6>
                      <p className={`font-semibold mt-0.5 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>Applied for: {app.careerTitle}</p>
                    </div>
                    <span className={`text-[10px] font-mono ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>
                      {new Date(app.submissionDate).toLocaleString()}
                    </span>
                  </div>

                  <p className={`p-2.5 rounded border transition-colors ${
                    isDark ? 'bg-slate-900/40 border-transparent text-gray-300' : 'bg-slate-50 border-slate-150 text-slate-700 font-normal leading-relaxed'
                  }`}>
                    <span className={`text-[10px] font-bold uppercase tracking-wide block mb-1 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Applicant Note:</span>
                    {app.coverLetter || 'No cover letter attached'}
                  </p>

                  <div className={`flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 text-[11px] pt-2 border-t mt-3 ${
                    isDark ? 'border-slate-900/60' : 'border-slate-150'
                  }`}>
                    <div className="flex gap-4">
                      <span>Email: <strong className={isDark ? 'text-white' : 'text-slate-900'}>{app.email}</strong></span>
                      <span>Mobile: <strong className={isDark ? 'text-white' : 'text-slate-900'}>{app.mobile}</strong></span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className={`flex items-center gap-1.5 font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                        <FileText size={12} />
                        <span>{app.fileName || 'resume_digital.pdf'}</span>
                      </div>
                      {app.fileData ? (
                        <a 
                          href={app.fileData} 
                          download={app.fileName || 'resume_digital.pdf'}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 hover:text-white text-slate-100 font-bold rounded flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Download size={10} /> Download Resume
                        </a>
                      ) : (
                        <span className="text-[10px] text-gray-500 italic">(Legacy Resume Template)</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* --- Tab Content: Contacts Feedback --- */}
      {activeSubTab === 'contacts' && (
        <div className="space-y-6 animate-fade-in-up">
          <h4 className={`text-sm font-bold uppercase ${isDark ? 'text-amber-500' : 'text-amber-600'}`}>General Inquiries & Client Emails</h4>

          <div className="space-y-4">
            {contacts.length === 0 ? (
              <div className={`p-6 text-center text-xs rounded-xl border ${
                isDark ? 'bg-slate-800/10 border-transparent text-gray-500' : 'bg-slate-50 border-slate-200 text-slate-550'
              }`}>
                No feedback or messages registered in database logs.
              </div>
            ) : (
              contacts.map((msg) => (
                <div key={msg.id} className={`p-4 border rounded-xl space-y-3 transition-colors ${
                  isDark ? 'bg-slate-800/20 border-slate-800' : 'bg-white border-slate-205 shadow-sm'
                }`}>
                  <div className="flex justify-between items-start text-xs">
                    <div>
                      <h5 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{msg.name}</h5>
                      <p className={isDark ? 'text-gray-400' : 'text-slate-655'}>{msg.email} {msg.mobile && `| ${msg.mobile}`}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>
                        {new Date(msg.submissionDate).toLocaleDateString()}
                      </span>
                      <select 
                        value={msg.status}
                        onChange={(e) => handleContactStatusChange(msg.id, e.target.value as any)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          msg.status === 'New' ? 'bg-amber-500 text-slate-950' : 'bg-slate-700 text-gray-300'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Read">Read</option>
                        <option value="Replied">Replied</option>
                      </select>
                    </div>
                  </div>

                  <div className="text-xs space-y-1">
                    <span className={`uppercase font-bold text-[9px] block ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Subject: {msg.subject}</span>
                    <p className={`leading-relaxed p-2.5 rounded-lg border transition-colors ${
                      isDark ? 'bg-slate-900/30 border-slate-800/60 text-gray-300' : 'bg-slate-50 border-slate-150 text-slate-700 font-normal'
                    }`}>
                      {msg.message}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* --- Tab Content: System Info Config --- */}
      {activeSubTab === 'system' && (
        <form onSubmit={handleUpdateSystem} className="space-y-5 animate-fade-in-up">
          <h4 className={`text-sm font-bold uppercase border-b pb-2 ${
            isDark ? 'text-amber-500 border-slate-800' : 'text-amber-600 border-slate-200'
          }`}>
            Dynamic Branding & Contact Details Settings
          </h4>

          {systemUpdateSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-600 text-xs font-sans font-medium">
              {systemUpdateSuccess}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Company Executive Title</label>
              <input
                type="text"
                value={localSystemInfo.companyName}
                onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, companyName: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Email Coordinates</label>
              <input
                type="text"
                value={localSystemInfo.email}
                onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, email: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Phone Number Prefix</label>
              <input
                type="text"
                value={localSystemInfo.phone}
                onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, phone: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>WhatsApp QuickLink (Full Phone Number with Country Code)</label>
              <input
                type="text"
                placeholder="e.g. +919411955562"
                value={localSystemInfo.whatsapp}
                onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, whatsapp: e.target.value })}
                className={inputClass}
              />
              <p className="text-[10px] text-slate-500 mt-1 dark:text-gray-400">
                To hide the floating green WhatsApp widget entirely from the website, clear this field. Entering a phone number here will show it on the site.
              </p>
            </div>
          </div>

          <div>
            <label className={labelClass}>WhatsApp Pre-filled Greeting Message</label>
            <input
              type="text"
              placeholder="e.g. Hello Tasha Contracts India, I am interested in a construction project."
              value={localSystemInfo.whatsappMessage || ''}
              onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, whatsappMessage: e.target.value })}
              className={inputClass}
            />
            <p className="text-[10px] text-slate-500 mt-1 dark:text-gray-400">
              The automated message loaded in the visitor's WhatsApp composer when they click the WhatsApp button.
            </p>
          </div>

          <div>
            <label className={labelClass}>Physical Corporate Headquarters (Matches PDF Address)</label>
            <input
              type="text"
              value={localSystemInfo.address}
              onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, address: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Homepage Premium Banner Headline</label>
            <input
              type="text"
              value={localSystemInfo.slogan}
              onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, slogan: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Corporate Logo Tagline (Header Tagline)</label>
            <input
              type="text"
              value={localSystemInfo.headerTagline || ''}
              onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, headerTagline: e.target.value })}
              className={inputClass}
              placeholder="e.g. Make Tomorrow With Us"
            />
          </div>

          <div>
            <label className={labelClass}>Partner Brands Section Tagline</label>
            <input
              type="text"
              value={localSystemInfo.partnersTagline !== undefined ? localSystemInfo.partnersTagline : 'PARTNERING WITH THE BEST IN INDUSTRY'}
              onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, partnersTagline: e.target.value })}
              className={inputClass}
              placeholder="e.g. PARTNERING WITH THE BEST IN INDUSTRY (Clear block to delete/hide)"
            />
            <p className="text-[10px] text-slate-400/80 mt-1">
              Customize the uppercase headline shown above the partner/client logos on the homepage. Delete/clear this text block entirely to hide the headline from visitors.
            </p>
          </div>

          <div>
            <label className={labelClass}>Corporate Subheading Slogan</label>
            <textarea
              rows={2}
              value={localSystemInfo.subheading}
              onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, subheading: e.target.value })}
              className={textareaClass}
            />
          </div>

          {/* Executive Founder Portrait Configuration card */}
          <div className={`p-5 rounded-2xl space-y-4 border transition-colors shadow-sm mt-6 ${
            isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white border-slate-205'
          }`}>
            <div className="flex items-center gap-2">
              <Users size={18} className="text-amber-500" />
              <h4 className={`text-sm font-bold uppercase tracking-wider font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>Executive Founder Personal Profile</h4>
            </div>
            <p className={`text-xs leading-relaxed font-sans ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Personalize the founder card displayed on the public "About Us" and "Strategic Partners" layouts. Changes reflect in real-time across your entire digital presence.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
              <div>
                <label className={labelClass}>Founder Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Mohd Arshad"
                  value={localSystemInfo.founderName || ''}
                  onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, founderName: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Founder Executive Role / Title</label>
                <input
                  type="text"
                  placeholder="e.g. Managing Director & Founder"
                  value={localSystemInfo.founderRole || ''}
                  onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, founderRole: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
              <div>
                <label className={labelClass}>Location Circle / Geographic Boundaries</label>
                <input
                  type="text"
                  placeholder="e.g. Amroha Uttar Pradesh, India Circle"
                  value={localSystemInfo.founderLocation || ''}
                  onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, founderLocation: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Founder Profile Portrait Image Resource Link</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Provide image URL link or use quick uploader"
                    value={localSystemInfo.founderImage || ''}
                    onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, founderImage: e.target.value })}
                    className={inputClass}
                  />
                  <CloudinaryUploadButton 
                    onSuccess={(url) => setLocalSystemInfo({ ...localSystemInfo, founderImage: url })}
                    label="Upload Portrait" 
                  />
                </div>
              </div>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 font-sans p-3.5 rounded-xl border transition-colors ${
              isDark ? 'bg-slate-950/20 border-slate-700/30' : 'bg-slate-50 border-slate-205'
            }`}>
              <div>
                <label className={`block text-xs mb-1.5 font-bold uppercase tracking-wider ${isDark ? 'text-amber-500/90' : 'text-amber-600'}`}>Portrait Fit & Visibility Strategy</label>
                <select
                  value={localSystemInfo.founderImageFit || 'cover'}
                  onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, founderImageFit: e.target.value })}
                  className={selectClass}
                >
                  <option value="cover">Fill Circle / Cover Complete Area (Auto-Cropped)</option>
                  <option value="top">Avoid Cutoffs: Align to Top (Keep Hair/Head Fully Visible)</option>
                  <option value="contain">Contain Completely: Show Full Multi-aspect Image (No Crop)</option>
                </select>
                <p className={`text-[10px] mt-1 leading-normal ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                  💡 Choose <strong>Align to Top</strong> if the top of your hair/head is being cut off. Choose <strong>Contain</strong> to showcase 100% of the uploaded file borders intact.
                </p>
              </div>

              <div>
                <label className={`block text-xs mb-1.5 font-bold uppercase tracking-wider ${isDark ? 'text-amber-500/90' : 'text-amber-600'}`}>Portrait Outline Frame Shape</label>
                <select
                  value={localSystemInfo.founderImageShape || 'circle'}
                  onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, founderImageShape: e.target.value })}
                  className={selectClass}
                >
                  <option value="circle">Symmetric Circle Badge</option>
                  <option value="squircle">Modern Squircle (Rounded Bento Shape - Extra Space)</option>
                  <option value="portrait-card">Tall Executive Card Layout (Perfect for Portrait Aspect Ratios)</option>
                </select>
                <p className={`text-[10px] mt-1 leading-normal ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                  🚀 Switching from circle to <strong>Tall Executive Card</strong> or <strong>Squircle</strong> opens up a beautiful canvas space to appreciate the portrait clearly.
                </p>
              </div>
            </div>

            <div className="font-sans">
              <label className={labelClass}>Founder Executive Bio Quote / Statement</label>
              <textarea
                rows={3}
                placeholder='e.g. "Establishing Tasha Contracts India in 2015 meant building an ethical construction collective..."'
                value={localSystemInfo.founderBio || ''}
                onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, founderBio: e.target.value })}
                className={textareaClass}
              />
            </div>
          </div>

          {/* Corporate Statistics Counters Configuration Card */}
          <div className={`p-5 rounded-2xl space-y-4 border transition-colors shadow-sm mt-6 ${
            isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white border-slate-205'
          }`}>
            <div className="flex items-center gap-2">
              <Award size={18} className="text-amber-500" />
              <h4 className={`text-sm font-bold uppercase tracking-wider font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>Corporate Statistics Counters</h4>
            </div>
            <p className={`text-xs leading-relaxed font-sans ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Modify the labels and numeric values for the live counters inside the corporate Statistics zone. These values animate live on scroll.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 font-sans pb-2">
              {/* Stat 1 */}
              <div className={`space-y-2 p-3 rounded-xl border transition-colors ${
                isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}>
                <span className="text-[10px] text-indigo-500 font-extrabold uppercase block tracking-wider">Stat 1 (Indigo)</span>
                <div>
                  <label className="block text-[9px] text-slate-500 uppercase mb-1 font-semibold">Label</label>
                  <input
                    type="text"
                    value={localSystemInfo.statProjectsLabel || ''}
                    onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, statProjectsLabel: e.target.value })}
                    className={smallInputClass}
                    placeholder="Projects Completed"
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-slate-500 uppercase mb-1 font-semibold">Value (Number)</label>
                  <input
                    type="number"
                    value={localSystemInfo.statProjectsCompleted !== undefined ? localSystemInfo.statProjectsCompleted : ''}
                    onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, statProjectsCompleted: e.target.value ? Number(e.target.value) : 0 })}
                    className={smallInputClass}
                    placeholder="85"
                  />
                </div>
              </div>

              {/* Stat 2 */}
              <div className={`space-y-2 p-3 rounded-xl border transition-colors ${
                isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}>
                <span className="text-[10px] text-emerald-600 font-extrabold uppercase block tracking-wider">Stat 2 (Emerald)</span>
                <div>
                  <label className="block text-[9px] text-slate-500 uppercase mb-1 font-semibold">Label</label>
                  <input
                    type="text"
                    value={localSystemInfo.statHappyClientsLabel || ''}
                    onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, statHappyClientsLabel: e.target.value })}
                    className={smallInputClass}
                    placeholder="Happy Clients"
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-slate-500 uppercase mb-1 font-semibold">Value (Number)</label>
                  <input
                    type="number"
                    value={localSystemInfo.statHappyClients !== undefined ? localSystemInfo.statHappyClients : ''}
                    onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, statHappyClients: e.target.value ? Number(e.target.value) : 0 })}
                    className={smallInputClass}
                    placeholder="50"
                  />
                </div>
              </div>

              {/* Stat 3 */}
              <div className={`space-y-2 p-3 rounded-xl border transition-colors ${
                isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}>
                <span className="text-[10px] text-violet-600 font-extrabold uppercase block tracking-wider">Stat 3 (Violet)</span>
                <div>
                  <label className="block text-[9px] text-slate-500 uppercase mb-1 font-semibold">Label</label>
                  <input
                    type="text"
                    value={localSystemInfo.statYearsExperienceLabel || ''}
                    onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, statYearsExperienceLabel: e.target.value })}
                    className={smallInputClass}
                    placeholder="Years of Experience"
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-slate-500 uppercase mb-1 font-semibold">Value (Number)</label>
                  <input
                    type="number"
                    value={localSystemInfo.statYearsExperience !== undefined ? localSystemInfo.statYearsExperience : ''}
                    onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, statYearsExperience: e.target.value ? Number(e.target.value) : 0 })}
                    className={smallInputClass}
                    placeholder="11"
                  />
                </div>
              </div>

              {/* Stat 4 */}
              <div className={`space-y-2 p-3 rounded-xl border transition-colors ${
                isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}>
                <span className="text-[10px] text-amber-600 font-extrabold uppercase block tracking-wider">Stat 4 (Orange)</span>
                <div>
                  <label className="block text-[9px] text-slate-500 uppercase mb-1 font-semibold">Label</label>
                  <input
                    type="text"
                    value={localSystemInfo.statTeamMembersLabel || ''}
                    onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, statTeamMembersLabel: e.target.value })}
                    className={smallInputClass}
                    placeholder="Team Members"
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-slate-500 uppercase mb-1 font-semibold">Value (Number)</label>
                  <input
                    type="number"
                    value={localSystemInfo.statTeamMembers !== undefined ? localSystemInfo.statTeamMembers : ''}
                    onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, statTeamMembers: e.target.value ? Number(e.target.value) : 0 })}
                    className={smallInputClass}
                    placeholder="120"
                  />
                </div>
              </div>

              {/* Stat 5 */}
              <div className={`space-y-2 p-3 rounded-xl border transition-colors ${
                isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}>
                <span className="text-[10px] text-purple-600 font-extrabold uppercase block tracking-wider">Stat 5 (Purple)</span>
                <div>
                  <label className="block text-[9px] text-slate-500 uppercase mb-1 font-semibold">Label</label>
                  <input
                    type="text"
                    value={localSystemInfo.statCitiesServedLabel || ''}
                    onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, statCitiesServedLabel: e.target.value })}
                    className={smallInputClass}
                    placeholder="Cities Served"
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-slate-500 uppercase mb-1 font-semibold">Value (Number)</label>
                  <input
                    type="number"
                    value={localSystemInfo.statCitiesServed !== undefined ? localSystemInfo.statCitiesServed : ''}
                    onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, statCitiesServed: e.target.value ? Number(e.target.value) : 0 })}
                    className={smallInputClass}
                    placeholder="15"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* About Tasha Custom manual section settings */}
          <div className={`p-5 rounded-2xl space-y-4 border transition-colors shadow-sm ${
            isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-amber-500" />
              <h4 className={`text-sm font-bold uppercase tracking-wider font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>"About Tasha" Section Manager</h4>
            </div>
            <p className={`text-xs leading-relaxed font-sans ${isDark ? 'text-slate-300' : 'text-slate-655'}`}>
              Manually write, edit, and manage the full description, bullet perks/points, stats, and strategic statements rendered under the public <strong>"About Tasha"</strong> view tab.
            </p>

            <div className="space-y-4 font-sans text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Top Mini Slogan</label>
                  <input
                    type="text"
                    value={localSystemInfo.aboutSlogan || ''}
                    onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, aboutSlogan: e.target.value })}
                    className={inputClass}
                    placeholder="Pioneering Modern Construction Tech"
                  />
                </div>
                <div>
                  <label className={labelClass}>Main Bold Title</label>
                  <input
                    type="text"
                    value={localSystemInfo.aboutTitle || ''}
                    onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, aboutTitle: e.target.value })}
                    className={inputClass}
                    placeholder="Building the Future with LGSF & Prefabricated Construction Solutions"
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Introduction Subheading</label>
                <input
                  type="text"
                  value={localSystemInfo.aboutIntroHeading || ''}
                  onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, aboutIntroHeading: e.target.value })}
                  className={inputClass}
                  placeholder="Trusted LGSF Engineering Since 2015"
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className={labelClass}>Description Paragraph 1</label>
                  <textarea
                    rows={4}
                    value={localSystemInfo.aboutDesc1 || ''}
                    onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, aboutDesc1: e.target.value })}
                    className={inputClass}
                    placeholder="First detailed overview paragraph..."
                  />
                </div>
                <div>
                  <label className={labelClass}>Description Paragraph 2 (Optional)</label>
                  <textarea
                    rows={3}
                    value={localSystemInfo.aboutDesc2 || ''}
                    onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, aboutDesc2: e.target.value })}
                    className={inputClass}
                    placeholder="Second detailed overview paragraph (Leave empty to hide)..."
                  />
                </div>
              </div>

              {/* Dynamic stats values and labels */}
              <div className={`p-4 rounded-xl border space-y-3 ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <span className="font-bold text-amber-500 uppercase tracking-widest text-[9px] block">About Section Key Stats</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className={labelClass}>Stat 1 (Value | Label)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={localSystemInfo.aboutStat1Val || ''}
                        onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, aboutStat1Val: e.target.value })}
                        className={smallInputClass}
                        placeholder="10+ Years"
                      />
                      <input
                        type="text"
                        value={localSystemInfo.aboutStat1Lbl || ''}
                        onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, aboutStat1Lbl: e.target.value })}
                        className={smallInputClass}
                        placeholder="Experience"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Stat 2 (Value | Label)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={localSystemInfo.aboutStat2Val || ''}
                        onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, aboutStat2Val: e.target.value })}
                        className={smallInputClass}
                        placeholder="200+ Sites"
                      />
                      <input
                        type="text"
                        value={localSystemInfo.aboutStat2Lbl || ''}
                        onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, aboutStat2Lbl: e.target.value })}
                        className={smallInputClass}
                        placeholder="Delivered"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Stat 3 (Value | Label)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={localSystemInfo.aboutStat3Val || ''}
                        onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, aboutStat3Val: e.target.value })}
                        className={smallInputClass}
                        placeholder="PAN India"
                      />
                      <input
                        type="text"
                        value={localSystemInfo.aboutStat3Lbl || ''}
                        onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, aboutStat3Lbl: e.target.value })}
                        className={smallInputClass}
                        placeholder="Service Network"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Strategic Goals & Competitive Perks List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Competitive Perks Header (Why Choose Us Title)</label>
                  <input
                    type="text"
                    value={localSystemInfo.aboutWhyChooseTitle || ''}
                    onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, aboutWhyChooseTitle: e.target.value })}
                    className={inputClass}
                    placeholder="Why Choose Tasha Contracts"
                  />
                  
                  <label className={`${labelClass} mt-3`}>Competitive Perks List (One item per line - e.g. "Eco-Friendly Construction")</label>
                  <textarea
                    rows={8}
                    value={localSystemInfo.aboutWhyChoosePoints || ''}
                    onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, aboutWhyChoosePoints: e.target.value })}
                    className={inputClass}
                    placeholder="Enter one highlight per line..."
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>🎯 Brand Vision Statement</label>
                    <textarea
                      rows={4}
                      value={localSystemInfo.aboutVision || ''}
                      onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, aboutVision: e.target.value })}
                      className={inputClass}
                      placeholder="To become India's leading provider..."
                    />
                  </div>

                  <div>
                    <label className={labelClass}>🚀 Brand Mission Statement</label>
                    <textarea
                      rows={4}
                      value={localSystemInfo.aboutMission || ''}
                      onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, aboutMission: e.target.value })}
                      className={inputClass}
                      placeholder="To revolutionize the construction..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Why Choose Us / Advantage Points Edit Card */}
          <div className={`p-5 rounded-2xl space-y-4 border transition-colors shadow-sm mt-6 ${
            isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center gap-2">
              <Award size={18} className="text-amber-500" />
              <h4 className={`text-sm font-bold uppercase tracking-wider font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>Value Propositions (“Why Choose Tasha”)</h4>
            </div>
            <p className={`text-xs leading-relaxed font-sans ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Customize the titles and descriptions of the five value highlights shown under the "Why Choose Us" section on the homepage.
            </p>

            <div className="space-y-4 font-sans text-xs">
              {/* Point 1 */}
              <div className={`p-3 border border-dashed rounded-xl space-y-2 ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
                <span className="font-bold text-amber-500 uppercase tracking-widest text-[9px]">Card #1 (Default Icon: Badge/Award)</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Heading / Title</label>
                    <input
                      type="text"
                      value={localSystemInfo.chooseTitle1 || ''}
                      onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, chooseTitle1: e.target.value })}
                      className={inputClass}
                      placeholder="10+ Years of Punctual Experience"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Description Text</label>
                    <input
                      type="text"
                      value={localSystemInfo.chooseDesc1 || ''}
                      onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, chooseDesc1: e.target.value })}
                      className={inputClass}
                      placeholder="Registered in 2015, operating with deep efficiency..."
                    />
                  </div>
                </div>
              </div>

              {/* Point 2 */}
              <div className={`p-3 border border-dashed rounded-xl space-y-2 ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
                <span className="font-bold text-amber-500 uppercase tracking-widest text-[9px]">Card #2 (Default Icon: Shield/Approved)</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Heading / Title</label>
                    <input
                      type="text"
                      value={localSystemInfo.chooseTitle2 || ''}
                      onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, chooseTitle2: e.target.value })}
                      className={inputClass}
                      placeholder="Licensed & Government Approved"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Description Text</label>
                    <input
                      type="text"
                      value={localSystemInfo.chooseDesc2 || ''}
                      onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, chooseDesc2: e.target.value })}
                      className={inputClass}
                      placeholder="Fully certified MSME, GST Registered..."
                    />
                  </div>
                </div>
              </div>

              {/* Point 3 */}
              <div className={`p-3 border border-dashed rounded-xl space-y-2 ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
                <span className="font-bold text-amber-500 uppercase tracking-widest text-[9px]">Card #3 (Default Icon: Team/Users)</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Heading / Title</label>
                    <input
                      type="text"
                      value={localSystemInfo.chooseTitle3 || ''}
                      onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, chooseTitle3: e.target.value })}
                      className={inputClass}
                      placeholder="Skilled Expert Team"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Description Text</label>
                    <input
                      type="text"
                      value={localSystemInfo.chooseDesc3 || ''}
                      onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, chooseDesc3: e.target.value })}
                      className={inputClass}
                      placeholder="Dedicated engineers and trained installation teams..."
                    />
                  </div>
                </div>
              </div>

              {/* Point 4 */}
              <div className={`p-3 border border-dashed rounded-xl space-y-2 ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
                <span className="font-bold text-amber-500 uppercase tracking-widest text-[9px]">Card #4 (Default Icon: Steel/Layers)</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Heading / Title</label>
                    <input
                      type="text"
                      value={localSystemInfo.chooseTitle4 || ''}
                      onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, chooseTitle4: e.target.value })}
                      className={inputClass}
                      placeholder="Premium Grade LGSF Steel Framework"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Description Text</label>
                    <input
                      type="text"
                      value={localSystemInfo.chooseDesc4 || ''}
                      onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, chooseDesc4: e.target.value })}
                      className={inputClass}
                      placeholder="Precision-engineered steel framing designed for..."
                    />
                  </div>
                </div>
              </div>

              {/* Point 5 */}
              <div className={`p-3 border border-dashed rounded-xl space-y-2 ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
                <span className="font-bold text-amber-500 uppercase tracking-widest text-[9px]">Card #5 (Default Icon: Handover/Clock)</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Heading / Title</label>
                    <input
                      type="text"
                      value={localSystemInfo.chooseTitle5 || ''}
                      onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, chooseTitle5: e.target.value })}
                      className={inputClass}
                      placeholder="Guaranteed On-Time Handover"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Description Text</label>
                    <input
                      type="text"
                      value={localSystemInfo.chooseDesc5 || ''}
                      onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, chooseDesc5: e.target.value })}
                      className={inputClass}
                      placeholder="Punctual execution that completes assemblies up to..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
          >
            Update Live Corporate Content
          </button>
        </form>
      )}

      {/* --- Tab Content: Team Members Management --- */}
      {activeSubTab === 'team' && (
        <div className="space-y-6 animate-fade-in-up text-left">
          <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b gap-4 ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}>
            <div className="space-y-1">
              <h4 className={`text-lg font-bold font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>Corporate Team Member Directory Control</h4>
              <p className={`text-xs font-sans ${isDark ? 'text-gray-400' : 'text-slate-650'}`}>Hire, remove, edit profile biographies, role titles, and specify portrait pictures for Tasha's leadership and active field engineers.</p>
            </div>
            {!isAddingTeamMember && !editingTeamMember && (
              <button
                onClick={() => {
                  setIsAddingTeamMember(true);
                  setEditingTeamMember(null);
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-lg transition-all flex items-center gap-1.5 cursor-pointer uppercase tracking-wider font-sans whitespace-nowrap"
              >
                <Plus size={14} /> Add Team Member
              </button>
            )}
          </div>

          {/* ADD TEAM MEMBER FORM */}
          {isAddingTeamMember && (
            <div className={`p-6 border rounded-2xl space-y-4 transition-all ${
              isDark ? 'bg-slate-850/60 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className={`flex items-center gap-2 border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                <Plus size={16} className="text-amber-500" />
                <h5 className={`text-sm font-bold uppercase tracking-wider font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>Add New Team Member</h5>
              </div>

              <form onSubmit={handleAddTeamMember} className="space-y-4 font-sans text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Job Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mohd Arshad or Safety Incharge / Supervisor"
                      value={newTeamMemberName}
                      onChange={(e) => setNewTeamMemberName(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Icon Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Shield, HardHat, Wrench, Briefcase, Users, Hammer"
                      value={newTeamMemberImage}
                      onChange={(e) => setNewTeamMemberImage(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Short Description *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lead Safety Supervisor or Managing Director"
                    value={newTeamMemberRole}
                    onChange={(e) => setNewTeamMemberRole(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Comprehensive Detail *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Provide detailed description / bio about this team member/role..."
                    value={newTeamMemberBio}
                    onChange={(e) => setNewTeamMemberBio(e.target.value)}
                    className={textareaClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Guarantees / Selling Points (One per line)</label>
                  <textarea
                    rows={4}
                    placeholder="e.g.&#10;Premium curtain-wall structural glass&#10;Optimized multi-escalator vertical elevators&#10;High-end structural entrance lobbies"
                    value={newTeamMemberGuarantees}
                    onChange={(e) => setNewTeamMemberGuarantees(e.target.value)}
                    className={textareaClass}
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Leave empty to auto-assign default corporate guarantees.</p>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Save & Publish
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingTeamMember(false)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                      isDark 
                        ? 'bg-slate-800 text-gray-300 hover:bg-slate-700 border-slate-700' 
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* EDIT TEAM MEMBER FORM */}
          {editingTeamMember && (
            <div className={`p-6 border rounded-2xl space-y-4 transition-all ${
              isDark ? 'bg-slate-850/60 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className={`flex items-center gap-2 border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                <Edit2 size={16} className="text-amber-500" />
                <h5 className={`text-sm font-bold uppercase tracking-wider font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>Edit Team Member: {editingTeamMember.name}</h5>
              </div>

              <form onSubmit={handleSaveEditTeamMember} className="space-y-4 font-sans text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Job Name *</label>
                    <input
                      type="text"
                      required
                      value={editingTeamMember.name || ''}
                      onChange={(e) => setEditingTeamMember({ ...editingTeamMember, name: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Icon Name *</label>
                    <input
                      type="text"
                      required
                      value={editingTeamMember.image || ''}
                      onChange={(e) => setEditingTeamMember({ ...editingTeamMember, image: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Short Description *</label>
                  <input
                    type="text"
                    required
                    value={editingTeamMember.role || ''}
                    onChange={(e) => setEditingTeamMember({ ...editingTeamMember, role: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Comprehensive Detail *</label>
                  <textarea
                    required
                    rows={3}
                    value={editingTeamMember.bio || ''}
                    onChange={(e) => setEditingTeamMember({ ...editingTeamMember, bio: e.target.value })}
                    className={textareaClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Guarantees / Selling Points (One per line)</label>
                  <textarea
                    rows={4}
                    placeholder="e.g.&#10;Premium curtain-wall structural glass&#10;Optimized multi-escalator vertical elevators"
                    value={(editingTeamMember.guarantees || []).join('\n')}
                    onChange={(e) => setEditingTeamMember({ 
                      ...editingTeamMember, 
                      guarantees: e.target.value.split('\n')
                    })}
                    className={textareaClass}
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Provide custom lists that will display as tick marks on their site profile card.</p>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Apply Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingTeamMember(null)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                      isDark 
                        ? 'bg-slate-800 text-gray-300 hover:bg-slate-700 border-slate-700' 
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TEAM MEMBERS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {team.map((member) => {
              const displayName = /^\p{Emoji}/u.test(member.name) ? member.name : `👷 ${member.name}`;
              return (
                <div 
                  key={member.id}
                  className={`border rounded-3xl p-6 transition-all flex flex-col justify-between h-full relative group ${
                    isDark ? 'bg-slate-950/40 border-slate-800 hover:border-slate-700/80' : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <div>
                    {/* Header bar with controls */}
                    <div className="flex items-center justify-between mb-5">
                      {/* Top Orange Square Box with Icon */}
                      <div className="bg-amber-500 text-slate-950 rounded-2xl p-3 w-12 h-12 flex items-center justify-center shadow-xs">
                        <DynamicIcon name={member.image || 'HardHat'} size={20} />
                      </div>
                      
                      {/* Action buttons */}
                      <div className="flex gap-1.5 z-10">
                        <button
                          onClick={() => {
                            setEditingTeamMember(member);
                            setIsAddingTeamMember(false);
                          }}
                          title="Edit portrait biography"
                          className="p-1 px-2.5 bg-slate-900 hover:bg-slate-950 dark:bg-slate-800 dark:hover:bg-slate-700 text-white hover:text-amber-400 rounded-lg transition-colors border border-slate-200/10 flex items-center gap-1 cursor-pointer"
                        >
                          <Edit2 size={11} />
                          <span className="text-[10px] font-bold uppercase">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteTeamMember(member.id)}
                          title="Terminate from directory"
                          className="p-1 px-2.5 bg-red-950 hover:bg-red-900 text-red-100 hover:text-white rounded-lg transition-all border border-red-900/35 flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 size={11} />
                          <span className="text-[10px] font-bold uppercase">Delete</span>
                        </button>
                      </div>
                    </div>

                    {/* Display Name with Work Emoji Prepended */}
                    <h5 className={`text-base font-bold font-display tracking-tight mb-2.5 ${isDark ? 'text-amber-500' : 'text-amber-600'}`}>
                      {displayName}
                    </h5>

                    {/* Short Description */}
                    <p className={`text-xs font-sans font-medium leading-relaxed mb-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {member.role || "Executive Team"}
                    </p>

                    {/* Scope Box */}
                    <div className={`border rounded-xl p-4 mb-4 text-[11px] leading-relaxed ${
                      isDark 
                        ? 'bg-slate-900/30 border-slate-800/80 text-gray-400' 
                        : 'bg-slate-50 border-slate-200/60 text-slate-650'
                    }`}>
                      <p className="font-sans">
                        <strong className={`font-extrabold mr-1 ${isDark ? 'text-white' : 'text-slate-950'}`}>Scope:</strong>
                        {member.bio}
                      </p>
                    </div>

                    {/* Separator line */}
                    <div className={`border-t my-4 ${isDark ? 'border-slate-850' : 'border-slate-150'}`} />

                    {/* Guarantees Section */}
                    <div className="space-y-2.5">
                      <span className="text-[9px] uppercase font-mono font-black tracking-widest text-amber-600 dark:text-amber-500 block">
                        Guarantees:
                      </span>
                      <ul className="space-y-2">
                        {(member.guarantees && member.guarantees.length > 0 
                          ? member.guarantees 
                          : [
                              "Premium curtain-wall structural glass",
                              "Optimized multi-escalator vertical elevators",
                              "High-end structural entrance lobbies",
                              "Smart energy conservation frameworks"
                            ]
                        ).map((guarantee, gIdx) => (
                          <li key={gIdx} className="flex items-start gap-2 text-[11px] font-sans font-bold text-slate-650 dark:text-slate-300">
                            <span className="text-emerald-500 shrink-0 mt-0.5">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
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

                  <div className={`pt-3 mt-4 border-t flex items-center justify-between text-[9px] font-bold uppercase tracking-widest font-mono ${isDark ? 'border-slate-800 text-gray-550' : 'border-slate-200 text-slate-400'}`}>
                    <span>Tasha Contracts</span>
                    <span className="text-amber-500 font-sans font-black tracking-normal">★★★</span>
                  </div>
                </div>
              );
            })}
          </div>

          {team.length === 0 && (
            <div className={`p-10 text-center rounded-2xl border ${
              isDark ? 'bg-slate-850/20 border-slate-800 text-gray-550' : 'bg-slate-100 border-slate-200 text-slate-500'
            }`}>
              <Users size={40} className="mx-auto mb-3 opacity-40 text-amber-500" />
              <p className="text-xs font-medium uppercase tracking-widest font-mono">No team members setup in local list.</p>
              <p className="text-xs font-sans mt-1">Click top-right to register new executives and operatives.</p>
            </div>
          )}
        </div>
      )}

      {/* --- Tab Content: Industries Served --- */}
      {activeSubTab === 'industries' && (
        <div className="space-y-6 animate-fade-in-up text-left">
          <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b gap-4 ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}>
            <div className="space-y-1">
              <h4 className={`text-lg font-bold font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>Industries We Served Section Management</h4>
              <p className={`text-xs font-sans ${isDark ? 'text-gray-400' : 'text-slate-650'}`}>
                Add, remove, or modify custom industry sectors, service descriptions, Lucide icon references, and key execution segments served under Tasha Contracts.
              </p>
            </div>
            {!editingIndustry && (
              <button
                onClick={() => setEditingIndustry({
                  id: '',
                  name: '',
                  description: '',
                  iconName: 'Building2',
                  points: []
                })}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-md active:scale-95 select-none"
              >
                <Plus size={14} /> Add Industry Sector
              </button>
            )}
          </div>

          {editingIndustry && (
            <form onSubmit={handleSaveIndustry} className={`p-6 rounded-2xl space-y-4 border transition-colors ${
              isDark ? 'bg-slate-850/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex justify-between items-center pb-2 border-b border-slate-800/40">
                <h5 className="text-xs font-extrabold text-amber-500 uppercase tracking-widest font-mono">
                  {editingIndustry.id ? 'Edit Industry Details' : 'Register New Industry Sector'}
                </h5>
                <button
                  type="button"
                  onClick={() => setEditingIndustry(null)}
                  className={`p-1 rounded-md transition-colors ${isDark ? 'text-gray-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
                >
                  <X size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className={`block text-xs font-bold ${isDark ? 'text-gray-400' : 'text-slate-655 font-medium'}`}>Industry Sector Name *</label>
                  <input
                    type="text"
                    required
                    value={editingIndustry.name || ''}
                    onChange={(e) => setEditingIndustry({ ...editingIndustry, name: e.target.value })}
                    placeholder="e.g., Commercial Offices, Educational"
                    className={`w-full p-2.5 rounded-lg border text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                      isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className={`block text-xs font-bold ${isDark ? 'text-gray-400' : 'text-slate-655 font-medium'}`}>Lucide Icon Name *</label>
                  <input
                    type="text"
                    required
                    value={editingIndustry.iconName || 'Building2'}
                    onChange={(e) => setEditingIndustry({ ...editingIndustry, iconName: e.target.value })}
                    placeholder="Lucide icons e.g. Building2, GraduationCap, Shield"
                    className={`w-full p-2.5 rounded-lg border text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                      isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                  <span className="text-[10px] text-gray-550 font-medium block">
                    Use any valid Lucide icon name (e.g. Building2, GraduationCap, Home, Shield, HeartPulse, Palmtree). Default is Building2.
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className={`block text-xs font-bold ${isDark ? 'text-gray-400' : 'text-slate-655 font-medium'}`}>Short Description *</label>
                <textarea
                  required
                  rows={3}
                  value={editingIndustry.description || ''}
                  onChange={(e) => setEditingIndustry({ ...editingIndustry, description: e.target.value })}
                  placeholder="Summarize the prebuilt structural LGSF or civil framing services supplied for this field..."
                  className={`w-full p-2.5 rounded-lg border text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                    isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              {/* Point management */}
              <div className={`p-4 rounded-xl border space-y-3 ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <span className={`block text-xs font-black uppercase tracking-wider text-amber-500 font-mono`}>Key served points / execution segments</span>
                
                {editingIndustry.points && editingIndustry.points.length > 0 ? (
                  <div className="space-y-1.5 max-h-44 overflow-y-auto pr-2">
                    {editingIndustry.points.map((pt, idx) => (
                      <div 
                        key={idx} 
                        className={`flex justify-between items-center gap-2 p-2 rounded border ${
                          isDark 
                            ? 'bg-slate-800/20 border-slate-800/60' 
                            : 'bg-slate-100 border-slate-200'
                        }`}
                      >
                        <span className={`text-xs font-semibold truncate ${
                          isDark ? 'text-slate-300' : 'text-slate-800'
                        }`}>
                          {pt}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const updatedPts = (editingIndustry.points || []).filter((_, i) => i !== idx);
                            setEditingIndustry({ ...editingIndustry, points: updatedPts });
                          }}
                          className={`p-1 transition-colors rounded ${
                            isDark 
                              ? 'text-gray-400 hover:text-red-400 hover:bg-slate-800/50' 
                              : 'text-slate-500 hover:text-red-650 hover:bg-slate-205/50'
                          }`}
                          title="Remove point"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={`text-[11px] italic ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>No key points added yet to this industry sector.</p>
                )}

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newPoint}
                    onChange={(e) => setNewPoint(e.target.value)}
                    placeholder="Enter custom point e.g. High energy-efficiency walls"
                    className={`flex-1 p-2 rounded border text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                      isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-205 text-slate-900'
                    }`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newPoint.trim()) {
                          const currentPts = editingIndustry.points || [];
                          setEditingIndustry({ ...editingIndustry, points: [...currentPts, newPoint.trim()] });
                          setNewPoint('');
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newPoint.trim()) {
                        const currentPts = editingIndustry.points || [];
                        setEditingIndustry({ ...editingIndustry, points: [...currentPts, newPoint.trim()] });
                        setNewPoint('');
                      }
                    }}
                    className={`px-3 text-xs font-bold rounded transition-colors ${
                      isDark 
                        ? 'bg-slate-800 hover:bg-slate-700 text-amber-400' 
                        : 'bg-amber-500 hover:bg-amber-650 text-slate-950'
                    }`}
                  >
                    Add Point
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingIndustry(null)}
                  className={`px-4 py-2 border rounded-lg text-xs font-bold transition-all ${
                    isDark 
                      ? 'border-slate-800 text-gray-400 hover:text-white hover:bg-slate-850' 
                      : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-all shadow-md"
                >
                  Save Sector
                </button>
              </div>
            </form>
          )}

          {/* List existing industries serving */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries && industries.map((industry) => (
              <div
                key={industry.id}
                className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between group border ${
                  isDark ? 'bg-slate-850/45 border-slate-800' : 'bg-white border-slate-205 shadow-sm'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className={`w-10 h-10 flex items-center justify-center rounded-lg p-2 border ${
                      isDark ? 'bg-slate-900 border-slate-700 text-amber-400' : 'bg-amber-50 border-amber-100 text-amber-600'
                    }`}>
                      <DynamicIcon name={industry.iconName} size={18} />
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setEditingIndustry(industry)}
                        className={`p-1.5 border rounded-md transition-all ${
                          isDark ? 'border-slate-800 hover:border-amber-500/40 text-gray-400 hover:text-amber-400 bg-slate-900' : 'border-slate-200 hover:border-amber-500/40 text-slate-500 hover:text-amber-500 bg-slate-50'
                        }`}
                        title="Edit sector text and indicators"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDeleteIndustry(industry.id)}
                        className={`p-1.5 border rounded-md transition-all ${
                          isDark ? 'border-slate-800 hover:border-red-500/40 text-gray-400 hover:text-red-400 bg-slate-900' : 'border-slate-200 hover:border-red-500/40 text-slate-500 hover:text-red-650 bg-slate-50'
                        }`}
                        title="Delete sector"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <h5 className={`text-base font-bold font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>{industry.name}</h5>
                    <p className={`text-xs leading-relaxed font-sans ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>{industry.description}</p>
                  </div>

                  {industry.points && industry.points.length > 0 && (
                    <div className={`pt-3 border-t border-dashed space-y-1 ${isDark ? 'border-slate-800' : 'border-slate-150'}`}>
                      {industry.points.map((pt, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-[10px]">
                          <span className="text-amber-500 select-none">✔</span>
                          <span className={isDark ? 'text-gray-300' : 'text-slate-650'}>{pt}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {(!industries || industries.length === 0) && (
            <div className={`text-center p-8 rounded-2xl border ${
              isDark ? 'bg-slate-850/20 border-slate-800 text-gray-400' : 'bg-slate-100 border-slate-200 text-slate-500'
            }`}>
              <Building2 size={40} className="mx-auto mb-3 opacity-40 text-amber-500" />
              <p className="text-xs font-medium uppercase tracking-widest font-mono">No industries configured.</p>
              <p className="text-xs font-sans mt-0.5">Click the top-right button to configure industry categories.</p>
            </div>
          )}
        </div>
      )}

      {/* --- Tab Content: Security & Password --- */}
      {activeSubTab === 'security' && (
        <div className="space-y-8 animate-fade-in-up">
          <div className={`pb-4 border-b space-y-1 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <h4 className={`text-lg font-bold font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>Security & Password Management</h4>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-650'}`}>Update corporate portal access codes and set up automated self-service recovery challenges.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Form A: Change Password */}
            <div className={`p-6 rounded-2xl space-y-4 text-left border transition-colors ${
              isDark ? 'bg-slate-850/40 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center gap-2 text-amber-500 font-display">
                <Lock size={18} />
                <h5 className="text-xs uppercase font-extrabold tracking-wider">Change Administrator Password</h5>
              </div>

              {changePasswordSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-650 text-xs font-sans">
                  {changePasswordSuccess}
                </div>
              )}

              {changePasswordError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-650 text-xs font-sans">
                  {changePasswordError}
                </div>
              )}

              <form onSubmit={handleChangePasswordSubmit} className="space-y-4 font-sans">
                <div>
                  <label className={labelClass}>Current Passcode *</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter current password"
                    value={currentPasswordInput}
                    onChange={(e) => setCurrentPasswordInput(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>New Passcode (At Least 4 Chars) *</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter new password"
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Confirm New Passcode *</label>
                  <input
                    type="password"
                    required
                    placeholder="Retype new password"
                    value={confirmPasswordInput}
                    onChange={(e) => setConfirmPasswordInput(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-lg transition-colors cursor-pointer uppercase tracking-wider"
                >
                  Save New Password
                </button>
              </form>
            </div>

            {/* Form B: Security Recovery Question */}
            <div className={`p-6 rounded-2xl space-y-4 text-left border transition-colors ${
              isDark ? 'bg-slate-850/40 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center gap-2 text-amber-500 font-display">
                <ShieldAlert size={18} />
                <h5 className="text-xs uppercase font-extrabold tracking-wider">Configure Security Challenge Question</h5>
              </div>

              <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-300' : 'text-slate-650'}`}>
                Configure a custom security question and answer phrase. In case you forget your master password, you can reset it seamlessly near the lockscreen portal.
              </p>

              <div className={`p-3.5 rounded-xl space-y-1.5 font-sans border transition-colors ${
                isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-205'
              }`}>
                <span className={`text-[10px] uppercase font-bold block ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>Current Challenge Parameters:</span>
                <p className={`text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-slate-700'}`}><span className={isDark ? 'text-amber-500' : 'text-amber-600 font-bold'}>Q:</span> {securityQuestion}</p>
                <p className={`text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-slate-700'}`}><span className={isDark ? 'text-amber-500' : 'text-amber-600 font-bold'}>A:</span> {securityAnswer}</p>
              </div>

              {securityUpdateSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-650 text-xs font-sans">
                  {securityUpdateSuccess}
                </div>
              )}

              <form onSubmit={handleUpdateSecurityQuestion} className="space-y-4 font-sans">
                <div>
                  <label className={labelClass}>Write Security Question *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. My primary high school name?"
                    value={customQuestionInput}
                    onChange={(e) => setCustomQuestionInput(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Challenge Answer Phrase *</label>
                  <input
                    type="text"
                    required
                    placeholder="Answer case-insensitive phrase"
                    value={customAnswerInput}
                    onChange={(e) => setCustomAnswerInput(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <button
                  type="submit"
                  className={`px-5 py-2.5 text-xs font-black rounded-lg transition-colors cursor-pointer uppercase tracking-wider border ${
                    isDark 
                      ? 'bg-slate-800 hover:bg-slate-750 text-gray-300 hover:text-white border-slate-700' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 hover:text-slate-950 border-slate-300'
                  }`}
                >
                  Update Parameters
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

      {/* --- Tab Content: Testimonial Moderation --- */}
      {activeSubTab === 'testimonials' && (
        <div className="space-y-6 animate-fade-in-up">
          <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b gap-4 ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}>
            <div className="space-y-1">
              <h4 className={`text-lg font-bold font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>Client Testimonial Moderation & Control</h4>
              <p className={`text-xs font-sans ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>View, moderate, toggle live visibility, delete, or insert client evaluations and recommendations safely.</p>
            </div>
            {!isAddingTestimonial && !editingTestimonial && (
              <button
                onClick={() => {
                  setIsAddingTestimonial(true);
                  setEditingTestimonial(null);
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-lg transition-all flex items-center gap-1.5 cursor-pointer uppercase tracking-wider font-sans"
              >
                <Plus size={14} /> Manually Insert Testimonial
              </button>
            )}
          </div>

          {/* ADD TESTIMONIAL FORM */}
          {isAddingTestimonial && (
            <div className={`p-6 border rounded-2xl space-y-4 transition-all ${
              isDark ? 'bg-slate-850/60 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className={`flex items-center gap-2 border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                <Plus size={16} className="text-amber-500" />
                <h5 className={`text-sm font-bold uppercase tracking-wider font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>Manually Insert Testimonial</h5>
              </div>

              <form onSubmit={handleAddTestimonial} className="space-y-4 font-sans text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Client / Author Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mohd Arshad"
                      value={newTestimonialName}
                      onChange={(e) => setNewTestimonialName(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Company / Designation</label>
                    <input
                      type="text"
                      placeholder="e.g. Managing Director, Tasha Contracts"
                      value={newTestimonialCompany}
                      onChange={(e) => setNewTestimonialCompany(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Rating (1 to 5 Stars)</label>
                    <select
                      value={newTestimonialRating}
                      onChange={(e) => setNewTestimonialRating(Number(e.target.value))}
                      className={selectClass}
                    >
                      <option value="5">⭐⭐⭐⭐⭐ 5 Stars (Excellent)</option>
                      <option value="4">⭐⭐⭐⭐ 4 Stars (Very Good)</option>
                      <option value="3">⭐⭐⭐ 3 Stars (Good)</option>
                      <option value="2">⭐⭐ 2 Stars (Average)</option>
                      <option value="1">⭐ 1 Star (Requires Work)</option>
                    </select>
                  </div>
                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={newTestimonialApproved}
                        onChange={(e) => setNewTestimonialApproved(e.target.checked)}
                        className={`w-4 h-4 rounded accent-amber-500 focus:ring-0 cursor-pointer ${
                          isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-300 bg-slate-50'
                        }`}
                      />
                      <span className={`text-xs font-semibold font-sans ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>Verify & Approve Immediately (Vibe Check)</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Feedback Client Comment Statement *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Enter the full evaluation details, remarks, or prefabrication praises given by the client..."
                    value={newTestimonialText}
                    onChange={(e) => setNewTestimonialText(e.target.value)}
                    className={textareaClass}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingTestimonial(false)}
                    className={`px-4 py-2 rounded text-xs uppercase font-extrabold tracking-wider border transition-colors ${
                      isDark 
                        ? 'bg-slate-800 hover:bg-slate-750 text-gray-300 border-transparent' 
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded text-xs uppercase tracking-wider"
                  >
                    Save & Post Testimonial
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* EDIT TESTIMONIAL FORM */}
          {editingTestimonial && (
            <div className={`p-6 border rounded-2xl space-y-4 transition-all ${
              isDark ? 'bg-slate-850/60 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className={`flex items-center gap-2 border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                <Edit2 size={16} className="text-amber-500" />
                <h5 className={`text-sm font-bold uppercase tracking-wider font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>Edit Client Testimonial</h5>
              </div>

              <form onSubmit={handleSaveEditTestimonial} className="space-y-4 font-sans text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Client / Author Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mohd Arshad"
                      value={editingTestimonial.clientName || ''}
                      onChange={(e) => setEditingTestimonial({ ...editingTestimonial, clientName: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Company / Designation</label>
                    <input
                      type="text"
                      placeholder="e.g. Managing Director, Tasha Contracts"
                      value={editingTestimonial.companyName || ''}
                      onChange={(e) => setEditingTestimonial({ ...editingTestimonial, companyName: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Rating (1 to 5 Stars)</label>
                    <select
                      value={editingTestimonial.rating || 5}
                      onChange={(e) => setEditingTestimonial({ ...editingTestimonial, rating: Number(e.target.value) })}
                      className={selectClass}
                    >
                      <option value="5">⭐⭐⭐⭐⭐ 5 Stars (Excellent)</option>
                      <option value="4">⭐⭐⭐⭐ 4 Stars (Very Good)</option>
                      <option value="3">⭐⭐⭐ 3 Stars (Good)</option>
                      <option value="2">⭐⭐ 2 Stars (Average)</option>
                      <option value="1">⭐ 1 Star (Requires Work)</option>
                    </select>
                  </div>
                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={editingTestimonial.approved !== false}
                        onChange={(e) => setEditingTestimonial({ ...editingTestimonial, approved: e.target.checked })}
                        className={`w-4 h-4 rounded accent-amber-500 focus:ring-0 cursor-pointer ${
                          isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-300 bg-slate-50'
                        }`}
                      />
                      <span className={`text-xs font-semibold font-sans ${isDark ? 'text-gray-300' : 'text-slate-705'}`}>Verify & Approve Live Visibility</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Feedback Client Comment Statement *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Enter local evaluations given..."
                    value={editingTestimonial.text || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, text: e.target.value })}
                    className={textareaClass}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingTestimonial(null)}
                    className={`px-4 py-2 rounded text-xs uppercase font-extrabold tracking-wider border transition-colors ${
                      isDark 
                        ? 'bg-slate-800 hover:bg-slate-750 text-gray-300 border-transparent' 
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded text-xs uppercase tracking-wider"
                  >
                    Update Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* LISTING */}
          <div className="space-y-4">
            <h5 className="text-xs uppercase font-extrabold text-amber-500 tracking-wider font-display">Recorded Testimonials ({testimonials.length})</h5>
            
            {testimonials.length === 0 ? (
              <div className={`p-8 border border-dashed text-center rounded-xl transition-colors ${
                isDark ? 'border-slate-800 bg-slate-900/10' : 'border-slate-200 bg-slate-50/50'
              }`}>
                <p className={`text-xs font-sans ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>No client testimonials saved yet. Try writing a review on the storefront or clicking 'Manually Insert' above!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testimonials.map((test) => {
                  const isApproved = test.approved !== false;
                  return (
                    <div key={test.id} className={`p-5 rounded-xl border flex flex-col justify-between space-y-4 shadow-lg text-left transition-all ${
                      isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50/50 border-slate-205'
                    }`}>
                      <div className="space-y-3 font-sans w-full">
                        <div className="flex justify-between items-start gap-4">
                          <div className="min-w-0">
                            <h6 className={`font-extrabold text-sm truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{test.clientName}</h6>
                            <p className={`text-[10px] uppercase tracking-wide font-medium truncate ${isDark ? 'text-gray-400' : 'text-slate-505'}`}>{test.companyName || 'Independent Client'}</p>
                          </div>
                          <span className={`shrink-0 px-2 py-0.5 rounded-full text-[8px] font-extrabold uppercase tracking-widest ${
                            isApproved 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                              : 'bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse'
                          }`}>
                            {isApproved ? 'Approved / Live' : 'Pending Verification'}
                          </span>
                        </div>

                        <div className="flex gap-0.5 text-amber-400">
                          {[...Array(5)].map((_, idx) => (
                            <Star key={idx} size={11} fill={idx < (test.rating || 5) ? "currentColor" : "none"} className="stroke-current" />
                          ))}
                        </div>

                        <p className={`text-xs leading-relaxed italic break-words ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                          "{test.text}"
                        </p>
                      </div>

                      <div className={`flex justify-between items-center pt-3 border-t font-sans w-full ${isDark ? 'border-slate-800/60' : 'border-slate-200'}`}>
                        <span className="text-[9px] text-gray-500 shrink-0">{test.date || 'Historic Entry'}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleApproval(test.id)}
                            className={`p-1 rounded text-[10px] font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-1 cursor-pointer ${
                              isApproved 
                                ? 'text-amber-500 hover:text-amber-400 bg-amber-500/5 hover:bg-amber-500/10' 
                                : 'text-emerald-500 hover:text-emerald-450 bg-emerald-550/5 hover:bg-emerald-550/10'
                            }`}
                            title={isApproved ? "Revoke Visibility" : "Activate Live Visibility"}
                          >
                            {isApproved ? <X size={12} /> : <Check size={12} />}
                            {isApproved ? 'Revoke' : 'Approve'}
                          </button>
                          
                          <button
                            onClick={() => {
                              setEditingTestimonial(test);
                              setIsAddingTestimonial(false);
                            }}
                            className={`p-1 rounded cursor-pointer transition-colors ${
                              isDark 
                                ? 'text-gray-400 hover:text-white bg-slate-800/40 hover:bg-slate-800' 
                                : 'text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
                            }`}
                            title="Edit details"
                          >
                            <Edit2 size={12} />
                          </button>

                          <button
                            onClick={() => handleDeleteTestimonialId(test.id)}
                            className={`p-1 rounded cursor-pointer transition-colors ${
                              isDark 
                                ? 'text-red-400 hover:text-red-300 bg-red-950/10 hover:bg-red-950/40' 
                                : 'text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100'
                            }`}
                            title="Delete permanently"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- Tab Content: Partner Brands --- */}
      {activeSubTab === 'partners' && (
        <div className="space-y-6 animate-fade-in-up">
          <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b gap-4 ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}>
            <div className="space-y-1">
              <h4 className={`text-lg font-bold font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>Partner & Associate Brands</h4>
              <p className={`text-xs font-sans ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>Manage, insert, customize or delete partner/client brands showcased on the landing page slider.</p>
            </div>
            {!isAddingPartner && !editingPartner && (
              <button
                onClick={() => {
                  setIsAddingPartner(true);
                  setEditingPartner(null);
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-lg transition-all flex items-center gap-1.5 cursor-pointer uppercase tracking-wider font-sans"
              >
                <Plus size={14} /> Add Companion Brand
              </button>
            )}
          </div>

          {/* ADD PARTNER FORM */}
          {isAddingPartner && (
            <div className={`p-6 border rounded-2xl space-y-4 transition-all ${
              isDark ? 'bg-slate-850/60 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className={`flex items-center gap-2 border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                <Plus size={16} className="text-amber-500" />
                <h5 className={`text-sm font-bold uppercase tracking-wider font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>Add Companion Brand</h5>
              </div>

              <form onSubmit={handleAddPartner} className="space-y-4 font-sans text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Brand Name * (Uppercase short logo)</label>
                    <input
                      type="text"
                      required
                      value={newPartnerName}
                      onChange={(e) => setNewPartnerName(e.target.value)}
                      className={inputClass}
                      placeholder="e.g. EVEREST"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Subheading / Legal Name *</label>
                    <input
                      type="text"
                      required
                      value={newPartnerSubtitle}
                      onChange={(e) => setNewPartnerSubtitle(e.target.value)}
                      className={inputClass}
                      placeholder="e.g. Everest Industries"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Color Branding Theme Style</label>
                  <select
                    value={newPartnerColorClass}
                    onChange={(e) => setNewPartnerColorClass(e.target.value)}
                    className={inputClass}
                  >
                    <option value="text-red-500 font-mono">Red Mono (e.g. Everest)</option>
                    <option value="text-amber-600 font-mono">Amber Mono (e.g. Ahluwalia)</option>
                    <option value="text-cyan-500 font-mono">Cyan Mono (e.g. Epack)</option>
                    <option value="text-emerald-500 font-mono">Emerald Mono (e.g. Nest-In)</option>
                    <option value="text-yellow-600 font-mono">Yellow Mono (e.g. PASA)</option>
                    <option value="text-blue-500 font-mono">Blue Mono Accent</option>
                    <option value="text-indigo-500 font-mono">Indigo Mono Accent</option>
                    <option value="text-violet-500 font-mono">Violet Mono Accent</option>
                    <option value="text-slate-500 font-mono">Slate Mono Standard</option>
                  </select>
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingPartner(false)}
                    className={`px-4 py-2 text-xs font-bold rounded-lg cursor-pointer ${
                      isDark ? 'bg-slate-800 text-gray-300 hover:bg-slate-705' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-550 text-white text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1"
                  >
                    <Check size={14} /> Insert Brand Info
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* EDIT PARTNER FORM */}
          {editingPartner && (
            <div className={`p-6 border rounded-2xl space-y-4 transition-all ${
              isDark ? 'bg-slate-850/60 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className={`flex items-center gap-2 border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                <Edit2 size={16} className="text-amber-500" />
                <h5 className={`text-sm font-bold uppercase tracking-wider font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>Edit Companion Brand Profile</h5>
              </div>

              <form onSubmit={handleSavePartnerEdit} className="space-y-4 font-sans text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Brand Name * (Uppercase short logo)</label>
                    <input
                      type="text"
                      required
                      value={editingPartner.name || ''}
                      onChange={(e) => setEditingPartner({ ...editingPartner, name: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Subheading / Legal Name *</label>
                    <input
                      type="text"
                      required
                      value={editingPartner.subtitle || ''}
                      onChange={(e) => setEditingPartner({ ...editingPartner, subtitle: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Color Branding Theme Style</label>
                  <select
                    value={editingPartner.colorClass || 'text-amber-500 font-mono'}
                    onChange={(e) => setEditingPartner({ ...editingPartner, colorClass: e.target.value })}
                    className={inputClass}
                  >
                    <option value="text-red-500 font-mono">Red Mono (e.g. Everest)</option>
                    <option value="text-amber-600 font-mono">Amber Mono (e.g. Ahluwalia)</option>
                    <option value="text-cyan-500 font-mono">Cyan Mono (e.g. Epack)</option>
                    <option value="text-emerald-500 font-mono">Emerald Mono (e.g. Nest-In)</option>
                    <option value="text-yellow-600 font-mono">Yellow Mono (e.g. PASA)</option>
                    <option value="text-blue-500 font-mono">Blue Mono Accent</option>
                    <option value="text-indigo-500 font-mono">Indigo Mono Accent</option>
                    <option value="text-violet-500 font-mono">Violet Mono Accent</option>
                    <option value="text-slate-500 font-mono">Slate Mono Standard</option>
                  </select>
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingPartner(null)}
                    className={`px-4 py-2 text-xs font-bold rounded-lg cursor-pointer ${
                      isDark ? 'bg-slate-800 text-gray-300 hover:bg-slate-705' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-550 text-white text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1"
                  >
                    <Check size={14} /> Save Brand Ref
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* LIST OF PARTNERS */}
          <div className="space-y-3">
            {partners.length === 0 ? (
              <div className={`p-8 border rounded-2xl text-center font-sans ${
                isDark ? 'bg-slate-900/40 border-slate-800 text-gray-400' : 'bg-slate-50 border-slate-201 text-slate-505'
              }`}>
                <AlertCircle className="mx-auto text-amber-500 mb-2" size={24} />
                No companion brand logos registered. Click the "Add Companion Brand" button above to insert.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {partners.map((partner) => {
                  return (
                    <div 
                      key={partner.id}
                      className={`p-4 border rounded-2xl flex flex-col justify-between items-start gap-4 transition-all hover:shadow-sm ${
                        isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50/50 border-slate-205'
                      }`}
                    >
                      <div className="space-y-1 font-sans w-full">
                        <div className="flex gap-3 items-center justify-between">
                          <h6 className={`font-extrabold text-sm truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{partner.name}</h6>
                          <span className={`shrink-0 px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase font-mono tracking-tight ${partner.colorClass || 'text-slate-500'}`}>
                            {partner.colorClass?.split(' ')[0] || 'Accent'}
                          </span>
                        </div>
                        <p className={`text-[10.5px] truncate ${isDark ? 'text-gray-400' : 'text-slate-650'}`}>{partner.subtitle}</p>
                      </div>

                      <div className={`flex justify-end gap-2 pt-3 border-t font-sans w-full ${isDark ? 'border-slate-800/60' : 'border-slate-200'}`}>
                        <button
                          onClick={() => {
                            setEditingPartner(partner);
                            setIsAddingPartner(false);
                          }}
                          className={`p-1 px-2.5 rounded text-[10px] font-extrabold uppercase tracking-wide cursor-pointer transition-colors inline-flex items-center gap-1 ${
                            isDark 
                              ? 'text-gray-300 hover:text-white bg-slate-800 hover:bg-slate-700' 
                              : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
                          }`}
                        >
                          <Edit2 size={11} /> Edit
                        </button>
                        
                        <button
                          onClick={() => handleDeletePartner(partner.id)}
                          className={`p-1 px-2.5 rounded text-[10px] font-extrabold uppercase tracking-wide cursor-pointer transition-colors inline-flex items-center gap-1 ${
                            isDark 
                              ? 'text-red-400 hover:text-red-300 bg-red-950/10 hover:bg-red-950/30' 
                              : 'text-red-650 hover:text-red-700 bg-red-50 hover:bg-red-100'
                          }`}
                        >
                          <Trash2 size={11} /> Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- Tab Content: Web Manager (Dynamic Media Catalog) --- */}
      {/* Code has been moved out to allow standalone webmanager panel access via footer */}

    </div>
  );
};
