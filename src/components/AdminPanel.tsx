import React, { useState } from 'react';
import { 
  Project, Service, Testimonial, TeamMember, 
  Certificate, CareerListing, QuoteRequest, ContactMessage, CareerApplication 
} from '../types';
import { 
  Building2, Plus, Edit2, Trash2, CheckCircle, Clock, 
  Lock, Unlock, ShieldAlert, FileText, ChevronRight, Check, X, Download, Eye,
  Briefcase, Mail, Phone, MapPin, DollarSign, Award, Users, AlertCircle, RefreshCw, Star
} from 'lucide-react';

interface AdminPanelProps {
  projects: Project[];
  services: Service[];
  testimonials: Testimonial[];
  team: TeamMember[];
  certificates: Certificate[];
  careers: CareerListing[];
  quotes: QuoteRequest[];
  contacts: ContactMessage[];
  applications: CareerApplication[];
  systemInfo: any;
  onUpdateProjects: (projects: Project[]) => void;
  onUpdateServices: (services: Service[]) => void;
  onUpdateTestimonials: (testimonials: Testimonial[]) => void;
  onUpdateTeam: (team: TeamMember[]) => void;
  onUpdateCertificates: (certificates: Certificate[]) => void;
  onUpdateCareers: (careers: CareerListing[]) => void;
  onUpdateQuotes: (quotes: QuoteRequest[]) => void;
  onUpdateContacts: (contacts: ContactMessage[]) => void;
  onUpdateSystemInfo: (info: any) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  projects, services, testimonials, team, certificates, careers, quotes, contacts, applications, systemInfo,
  onUpdateProjects, onUpdateServices, onUpdateTestimonials, onUpdateTeam, onUpdateCertificates, onUpdateCareers,
  onUpdateQuotes, onUpdateContacts, onUpdateSystemInfo
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
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'projects' | 'services' | 'quotes' | 'careers' | 'contacts' | 'system' | 'security' | 'testimonials'>('overview');

  // Standard modal state for editing
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
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

    if (editingProject.id) {
      // Edit
      const updated = projects.map(p => p.id === editingProject.id ? (editingProject as Project) : p);
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
        afterImage: editingProject.afterImage
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

    if (editingService.id) {
      const updated = services.map(s => s.id === editingService.id ? (editingService as Service) : s);
      onUpdateServices(updated);
    } else {
      const newServ: Service = {
        id: 's_' + Date.now(),
        name: editingService.name,
        description: editingService.description,
        iconName: editingService.iconName || 'Building2',
        details: editingService.details || '',
        features: editingService.features || ['Custom premium execution']
      };
      onUpdateServices([...services, newServ]);
    }
    setEditingService(null);
  };

  const handleDeleteService = (id: string) => {
    // Non-blocking immediate execute for sandboxed iframe
    onUpdateServices(services.filter(s => s.id !== id));
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
      <div className="max-w-md mx-auto p-6 bg-slate-800/40 border border-amber-500/10 rounded-2xl shadow-xl mt-12 animate-fade-in-up">
        <div className="text-center space-y-3 mb-6">
          <div className="p-3.5 bg-slate-900 border border-slate-700 w-14 h-14 rounded-full flex items-center justify-center text-amber-500 mx-auto">
            <Lock size={24} />
          </div>
          <h3 className="text-xl font-bold font-display text-white">TASHA Executive Portal</h3>
          <p className="text-xs text-gray-400">
            Provide credentials to manage live project pipelines, quotes, or career applicants.
          </p>
        </div>

        {loginError && (
          <div className="p-3 bg-red-500/15 border border-red-500/30 rounded-lg text-red-300 text-xs text-left flex gap-2 items-center mb-4">
            <ShieldAlert size={16} className="shrink-0" />
            <span>{loginError}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div>
            <label className="block text-xs text-gray-400 font-semibold mb-1 uppercase tracking-wide">
              Username ID
            </label>
            <input 
              type="text" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 font-semibold mb-1 uppercase tracking-wide">
              Secure PIN / Password
            </label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500"
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
              className="text-amber-505 hover:text-amber-400 hover:underline font-bold transition-all cursor-pointer"
            >
              Forgot Password?
            </button>
            <span className="text-gray-500 text-[10px]">Secure Portal Node</span>
          </div>

          <div className="pt-2 text-center text-[11px] text-gray-400 font-medium">
            Authorization Demo Node: <span className="text-amber-500 font-semibold">admin</span> / <span className="text-amber-500 font-semibold">admin</span>
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
  }

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 md:p-8 space-y-6">
      
      {/* Admin Panel Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500 text-slate-950 rounded-xl">
            <Building2 size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold font-display text-white">Executive Control Center</h3>
            <p className="text-xs text-gray-400">Logged in as Administrator (Tasha Contracts Corporate)</p>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="px-4 py-1.5 bg-slate-800 text-gray-300 hover:text-white rounded-lg text-xs hover:bg-red-950/40 border border-slate-700"
        >
          Gate Lock (Logout)
        </button>
      </div>

      {/* Admin Menu Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800/40 pb-4">
        {[
          { id: 'overview', label: 'Overview Metrics' },
          { id: 'projects', label: 'Manage Projects' },
          { id: 'services', label: 'Service Categories' },
          { id: 'quotes', label: `Quotes (${quotes.length})` },
          { id: 'careers', label: 'Human Resources' },
          { id: 'contacts', label: 'Client Feedback' },
          { id: 'system', label: 'System Configuration' },
          { id: 'testimonials', label: `Testimonials (${testimonials?.length || 0})` },
          { id: 'security', label: 'Security & Password' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveSubTab(tab.id as any);
              setEditingProject(null);
              setEditingService(null);
              setEditingCareer(null);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeSubTab === tab.id 
                ? 'bg-amber-500 text-slate-950 shadow-md' 
                : 'bg-slate-800/50 text-gray-400 hover:bg-slate-800 hover:text-white'
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
            <div className="p-5 bg-slate-800/20 border border-slate-700/30 rounded-xl space-y-2">
              <span className="text-xs text-gray-400 block font-semibold uppercase tracking-wide">Ongoing Bids</span>
              <p className="text-3xl font-extrabold font-display text-amber-500">{quotes.filter(q => q.status === 'Pending').length} Pending</p>
              <span className="text-[10px] text-gray-500 uppercase">Total bidding value in review</span>
            </div>

            <div className="p-5 bg-slate-800/20 border border-slate-700/30 rounded-xl space-y-2">
              <span className="text-xs text-gray-400 block font-semibold uppercase tracking-wide">Dynamic Projects</span>
              <p className="text-3xl font-extrabold font-display text-white">{projects.length} Entries</p>
              <span className="text-[10px] text-gray-500 uppercase">{projects.filter(p => p.status === 'Ongoing').length} active site frameworks</span>
            </div>

            <div className="p-5 bg-slate-800/20 border border-slate-700/30 rounded-xl space-y-2">
              <span className="text-xs text-gray-400 block font-semibold uppercase tracking-wide">Open Vacancies</span>
              <p className="text-3xl font-extrabold font-display text-emerald-400">{careers.filter(c => c.active).length} Active</p>
              <span className="text-[10px] text-gray-500 uppercase">{applications.length} candidacies submitted</span>
            </div>

            <div className="p-5 bg-slate-800/20 border border-slate-700/30 rounded-xl space-y-2">
              <span className="text-xs text-gray-400 block font-semibold uppercase tracking-wide">Unread Messages</span>
              <p className="text-3xl font-extrabold font-display text-amber-500">{contacts.filter(c => c.status === 'New').length} New</p>
              <span className="text-[10px] text-gray-500">Awaiting contact call response</span>
            </div>
          </div>

          <div className="bg-amber-500/5 border border-amber-500/10 p-5 rounded-2xl space-y-2">
            <h4 className="text-sm font-bold text-amber-400 uppercase tracking-widest">Platform Sync Guide</h4>
            <p className="text-xs text-gray-300 leading-relaxed">
              Tasha Contracts India runs an instantaneous, LocalStorage state synchronization framework. Any revisions, projects, jobs, or pricing levels updated inside this executive portal are immediately rendered across the frontend visitor views in real time. Ideal for editing content during site audits!
            </p>
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
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-slate-800 text-gray-400 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Project Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Client</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {projects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/30">
                    <td className="p-3 text-white font-medium">{p.title}</td>
                    <td className="p-3">{p.category}</td>
                    <td className="p-3">{p.location}</td>
                    <td className="p-3 truncate max-w-[150px]">{p.client}</td>
                    <td className="p-3 text-white">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1.5">
                      <button 
                        onClick={() => setEditingProject(p)}
                        className="p-1 hover:text-amber-400"
                        title="Edit project properties"
                      >
                        <Edit2 size={14} className="inline" />
                      </button>
                      <button 
                        onClick={() => handleDeleteProject(p.id)}
                        className="p-1 hover:text-red-400"
                        title="Remove project from display"
                      >
                        <Trash2 size={14} className="inline" />
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
          <div className="flex justify-between items-center bg-slate-800/30 p-2.5 rounded-xl">
            <span className="text-xs text-gray-400">Manage Tasha Service Catalogs</span>
            <button
              onClick={() => setEditingService({})}
              className="px-3 py-1.5 bg-amber-500 text-slate-950 text-xs font-bold rounded flex items-center gap-1"
            >
              <Plus size={14} /> Add Core Service
            </button>
          </div>

          {editingService && (
            <form onSubmit={handleSaveService} className="p-5 bg-slate-800/30 border border-slate-700/60 rounded-xl space-y-4">
              <h4 className="text-xs font-bold text-amber-500 uppercase">
                {editingService.id ? 'Edit Service' : 'Add New Service category'}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Service Name *</label>
                  <input
                    type="text" required
                    value={editingService.name || ''}
                    onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-xs text-white rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Lucide Icon name (e.g. Shield, Layers, Building2, Wrench, Zap)</label>
                  <input
                    type="text"
                    value={editingService.iconName || ''}
                    onChange={(e) => setEditingService({ ...editingService, iconName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-xs text-white rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Short Description</label>
                <input
                  type="text"
                  value={editingService.description || ''}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-xs text-white rounded"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Comprehensive Details</label>
                <textarea
                  rows={2}
                  value={editingService.details || ''}
                  onChange={(e) => setEditingService({ ...editingService, details: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-xs text-white rounded"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-1 bg-slate-800 text-xs rounded"
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

          <div className="grid grid-cols-1 gap-3 text-xs text-gray-300">
            {services.map(s => (
              <div key={s.id} className="p-3 bg-slate-800/40 border border-slate-700/20 rounded-lg flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-white text-sm">{s.name}</h5>
                  <p className="text-gray-400 text-xs mt-1">{s.description}</p>
                </div>
                <div className="space-x-1.5 shrink-0 ml-4">
                  <button onClick={() => setEditingService(s)} className="p-1 hover:text-amber-400">
                    <Edit2 size={13} className="inline" />
                  </button>
                  <button onClick={() => handleDeleteService(s.id)} className="p-1 hover:text-red-400">
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
            <h4 className="text-sm font-bold text-amber-500 uppercase">Incoming Estimating & Bidding Requests</h4>
            <span className="text-xs bg-slate-800 px-2.5 py-1 rounded text-gray-400 uppercase font-mono">
              {quotes.length} requests logged
            </span>
          </div>

          <div className="space-y-4">
            {quotes.length === 0 ? (
              <div className="p-6 bg-slate-800/20 rounded-xl text-center text-xs text-gray-400">
                No client estimating requests have been submitted yet.
              </div>
            ) : (
              quotes.map((quote) => (
                <div 
                  key={quote.id} 
                  className={`p-5 rounded-2xl border ${
                    quote.status === 'Pending' 
                      ? 'border-amber-500/25 bg-amber-500/[0.02]' 
                      : 'border-slate-800 bg-slate-800/25'
                  } space-y-4`}
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                    <div>
                      <h5 className="text-base font-bold text-white">{quote.fullName}</h5>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {quote.companyName} | {quote.email} | {quote.mobileNumber}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-400 font-mono">
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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 bg-slate-900/60 p-3 rounded-lg text-xs">
                    <div>
                      <span className="text-gray-400">Bid Category:</span>{' '}
                      <span className="text-white font-medium">{quote.projectType}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Budget Level:</span>{' '}
                      <span className="text-amber-400 font-bold">{quote.budgetRange}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Site Location:</span>{' '}
                      <span className="text-white font-medium">{quote.location}</span>
                    </div>
                  </div>

                  {quote.message && (
                    <p className="text-xs text-gray-300 leading-relaxed bg-slate-900/10 p-3 rounded-lg">
                      <span className="text-[10px] uppercase font-bold text-amber-500 block mb-1">Client Specifications:</span>
                      {quote.message}
                    </p>
                  )}

                  {quote.fileName && (
                    <div className="space-y-4 pt-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-emerald-400 font-medium">
                        <FileText size={14} />
                        <span className="truncate max-w-xs">{quote.fileName}</span>
                        <span className="text-[9px] text-gray-500 uppercase">(Site Drawing Uploaded)</span>
                      </div>

                      {quote.fileData ? (
                        <div className="mt-2 group relative max-w-md rounded-xl overflow-hidden border border-slate-800 bg-slate-950/40 p-3 text-left">
                          {quote.fileData.startsWith('data:image/') || quote.fileName?.match(/\.(png|jpg|jpeg|gif|webp)$/i) ? (
                            <div className="space-y-2">
                              <span className="text-[10px] text-amber-500 uppercase font-black tracking-wider block">Image Attachment Preview:</span>
                              <div className="relative overflow-hidden rounded-lg bg-slate-900 min-h-[140px] max-h-[300px] flex items-center justify-center border border-slate-700/50">
                                <img 
                                  src={quote.fileData} 
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
                            <div className="flex items-center justify-between p-3 bg-slate-900/80 rounded-lg border border-slate-800">
                              <div className="flex items-center gap-2.5">
                                <FileText className="text-amber-500 shrink-0" size={20} />
                                <div className="min-w-0">
                                  <p className="text-xs text-white font-bold truncate max-w-[200px]">{quote.fileName}</p>
                                  <p className="text-[10px] text-gray-450 uppercase font-semibold">Document / CAD Design</p>
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
                        <div className="text-[10px] text-amber-501/70 bg-amber-500/5 border border-amber-500/10 p-2.5 rounded-lg max-w-sm">
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
          <div className="flex justify-between items-center bg-slate-800/30 p-2.5 rounded-xl">
            <span className="text-xs text-gray-400">Manage Candidate Vacancies</span>
            <button
              onClick={() => setEditingCareer({})}
              className="px-3 py-1.5 bg-emerald-500 text-slate-950 text-xs font-bold rounded flex items-center gap-1"
            >
              <Plus size={14} /> Publish Opening
            </button>
          </div>

          {editingCareer && (
            <form onSubmit={handleSaveCareer} className="p-5 bg-slate-800/30 border border-emerald-500/20 rounded-xl space-y-4">
              <h4 className="text-xs font-bold text-emerald-400 uppercase">
                {editingCareer.id ? 'Edit Posting' : 'Publish New Career Role'}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Job Title *</label>
                  <input
                    type="text" required
                    value={editingCareer.title || ''}
                    onChange={(e) => setEditingCareer({ ...editingCareer, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-xs text-white rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Department *</label>
                  <input
                    type="text" required
                    value={editingCareer.department || ''}
                    onChange={(e) => setEditingCareer({ ...editingCareer, department: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-xs text-white rounded"
                    placeholder="e.g. Estimations / Design"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Location Address</label>
                  <input
                    type="text"
                    value={editingCareer.location || ''}
                    onChange={(e) => setEditingCareer({ ...editingCareer, location: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-xs text-white rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Execution Type</label>
                  <select
                    value={editingCareer.type || 'Full-time'}
                    onChange={(e) => setEditingCareer({ ...editingCareer, type: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-xs text-white rounded"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Part-time">Part-time</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Work Responsibilities Summary</label>
                <textarea
                  rows={2}
                  value={editingCareer.description || ''}
                  onChange={(e) => setEditingCareer({ ...editingCareer, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-xs text-white rounded"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCareer(null)}
                  className="px-4 py-1.5 bg-slate-800 text-xs rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-emerald-500 text-slate-950 text-xs font-bold rounded"
                >
                  Publish Active Role
                </button>
              </div>
            </form>
          )}

          {/* Submitted Applications Feed */}
          <div className="space-y-4">
            <h5 className="text-xs font-bold text-amber-500 uppercase tracking-widest border-b border-slate-800 pb-2">
              Human Resource Applicants ({applications.length})
            </h5>
            
            {applications.length === 0 ? (
              <p className="text-xs text-gray-500 italic p-2.5">No resume submissions registered yet.</p>
            ) : (
              applications.map((app) => (
                <div key={app.id} className="p-4 bg-slate-800/30 border border-slate-700/30 rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <h6 className="font-bold text-white text-sm">{app.fullName}</h6>
                      <p className="text-emerald-400 font-semibold mt-0.5">Applied for: {app.careerTitle}</p>
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono">
                      {new Date(app.submissionDate).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-gray-300 leading-relaxed bg-slate-900/40 p-2.5 rounded">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-1">Applicant Note:</span>
                    {app.coverLetter || 'No cover letter attached'}
                  </p>

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 text-[11px] pt-2 border-t border-slate-900/60 mt-3">
                    <div className="flex gap-4">
                      <span>Email: <strong className="text-white">{app.email}</strong></span>
                      <span>Mobile: <strong className="text-white">{app.mobile}</strong></span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <FileText size={12} />
                        <span className="font-semibold">{app.fileName || 'resume_digital.pdf'}</span>
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
          <h4 className="text-sm font-bold text-amber-500 uppercase">General Inquiries & Client Emails</h4>

          <div className="space-y-4">
            {contacts.length === 0 ? (
              <div className="p-6 bg-slate-800/10 text-center text-xs text-gray-500">
                No feedback or messages registered in database logs.
              </div>
            ) : (
              contacts.map((msg) => (
                <div key={msg.id} className="p-4 bg-slate-800/20 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex justify-between items-start text-xs">
                    <div>
                      <h5 className="font-bold text-white text-sm">{msg.name}</h5>
                      <p className="text-gray-400">{msg.email} {msg.mobile && `| ${msg.mobile}`}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-500 font-mono">
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
                    <span className="text-gray-400 uppercase font-bold text-[9px] block">Subject: {msg.subject}</span>
                    <p className="text-gray-300 leading-relaxed bg-slate-900/30 p-2.5 rounded-lg border border-slate-800/60">
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
          <h4 className="text-sm font-bold text-amber-500 uppercase border-b border-slate-800 pb-2">
            Dynamic Branding & Contact Details Settings
          </h4>

          {systemUpdateSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-300 text-xs font-sans font-medium">
              {systemUpdateSuccess}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Company Executive Title</label>
              <input
                type="text"
                value={localSystemInfo.companyName}
                onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, companyName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-xs text-white rounded"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Email Coordinates</label>
              <input
                type="text"
                value={localSystemInfo.email}
                onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-xs text-white rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Phone Number Prefix</label>
              <input
                type="text"
                value={localSystemInfo.phone}
                onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, phone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-xs text-white rounded"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">WhatsApp QuickLink</label>
              <input
                type="text"
                value={localSystemInfo.whatsapp}
                onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, whatsapp: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-xs text-white rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Physical Corporate Headquarters (Matches PDF Address)</label>
            <input
              type="text"
              value={localSystemInfo.address}
              onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, address: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-xs text-white rounded"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Homepage Premium Banner Headline</label>
            <input
              type="text"
              value={localSystemInfo.slogan}
              onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, slogan: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-xs text-white rounded"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Corporate Subheading Slogan</label>
            <textarea
              rows={2}
              value={localSystemInfo.subheading}
              onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, subheading: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-xs text-white rounded"
            />
          </div>

          {/* Executive Founder Portrait Configuration card */}
          <div className="bg-slate-800/40 border border-slate-700/50 p-5 rounded-2xl space-y-4 shadow-xl mt-6">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-amber-500" />
              <h4 className="text-sm font-bold text-white uppercase tracking-wider font-display">Executive Founder Personal Profile</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Personalize the founder card displayed on the public "About Us" and "Strategic Partners" layouts. Changes reflect in real-time across your entire digital presence.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
              <div>
                <label className="block text-xs text-gray-400 mb-1 font-semibold">Founder Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Mohd Arshad"
                  value={localSystemInfo.founderName || ''}
                  onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, founderName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-xs text-white rounded focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1 font-semibold">Founder Executive Role / Title</label>
                <input
                  type="text"
                  placeholder="e.g. Managing Director & Founder"
                  value={localSystemInfo.founderRole || ''}
                  onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, founderRole: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-xs text-white rounded focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
              <div>
                <label className="block text-xs text-gray-400 mb-1 font-semibold">Location Circle / Geographic Boundaries</label>
                <input
                  type="text"
                  placeholder="e.g. Amroha Uttar Pradesh, India Circle"
                  value={localSystemInfo.founderLocation || ''}
                  onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, founderLocation: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-xs text-white rounded focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1 font-semibold">Founder Profile Portrait Image Resource Link</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Provide image URL link or use quick uploader"
                    value={localSystemInfo.founderImage || ''}
                    onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, founderImage: e.target.value })}
                    className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 text-xs text-white rounded focus:border-amber-500 focus:outline-none"
                  />
                  <CloudinaryUploadButton 
                    onSuccess={(url) => setLocalSystemInfo({ ...localSystemInfo, founderImage: url })}
                    label="Upload Portrait" 
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans bg-slate-950/20 p-3.5 rounded-xl border border-slate-700/30">
              <div>
                <label className="block text-xs text-amber-500/90 mb-1.5 font-bold uppercase tracking-wider">Portrait Fit & Visibility Strategy</label>
                <select
                  value={localSystemInfo.founderImageFit || 'cover'}
                  onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, founderImageFit: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-xs text-white rounded focus:border-amber-500 focus:outline-none font-medium"
                >
                  <option value="cover">Fill Circle / Cover Complete Area (Auto-Cropped)</option>
                  <option value="top">Avoid Cutoffs: Align to Top (Keep Hair/Head Fully Visible)</option>
                  <option value="contain">Contain Completely: Show Full Multi-aspect Image (No Crop)</option>
                </select>
                <p className="text-[10px] text-gray-400 mt-1 leading-normal">
                  💡 Choose <strong>Align to Top</strong> if the top of your hair/head is being cut off. Choose <strong>Contain</strong> to showcase 100% of the uploaded file borders intact.
                </p>
              </div>

              <div>
                <label className="block text-xs text-amber-500/90 mb-1.5 font-bold uppercase tracking-wider">Portrait Outline Frame Shape</label>
                <select
                  value={localSystemInfo.founderImageShape || 'circle'}
                  onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, founderImageShape: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-xs text-white rounded focus:border-amber-500 focus:outline-none font-medium"
                >
                  <option value="circle">Symmetric Circle Badge</option>
                  <option value="squircle">Modern Squircle (Rounded Bento Shape - Extra Space)</option>
                  <option value="portrait-card">Tall Executive Card Layout (Perfect for Portrait Aspect Ratios)</option>
                </select>
                <p className="text-[10px] text-gray-400 mt-1 leading-normal">
                  🚀 Switching from circle to <strong>Tall Executive Card</strong> or <strong>Squircle</strong> opens up a beautiful canvas space to appreciate the portrait clearly.
                </p>
              </div>
            </div>

            <div className="font-sans">
              <label className="block text-xs text-gray-400 mb-1 font-semibold">Founder Executive Bio Quote / Statement</label>
              <textarea
                rows={3}
                placeholder='e.g. "Establishing Tasha Contracts India in 2015 meant building an ethical construction collective..."'
                value={localSystemInfo.founderBio || ''}
                onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, founderBio: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-xs text-white rounded focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Corporate Statistics Counters Configuration Card */}
          <div className="bg-slate-800/40 border border-slate-700/50 p-5 rounded-2xl space-y-4 shadow-xl mt-6">
            <div className="flex items-center gap-2">
              <Award size={18} className="text-amber-500" />
              <h4 className="text-sm font-bold text-white uppercase tracking-wider font-display">Corporate Statistics Counters</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Modify the labels and numeric values for the live counters inside the corporate Statistics zone. These values animate live on scroll.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 font-sans pb-2">
              {/* Stat 1 */}
              <div className="space-y-2 bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-indigo-400 font-extrabold uppercase block tracking-wider">Stat 1 (Indigo)</span>
                <div>
                  <label className="block text-[9px] text-gray-450 uppercase mb-1 font-bold">Label</label>
                  <input
                    type="text"
                    value={localSystemInfo.statProjectsLabel || ''}
                    onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, statProjectsLabel: e.target.value })}
                    className="w-full px-2 py-1 bg-slate-900 border border-slate-700 text-xs text-white rounded focus:border-amber-500 focus:outline-none"
                    placeholder="Projects Completed"
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-gray-450 uppercase mb-1 font-bold">Value (Number)</label>
                  <input
                    type="number"
                    value={localSystemInfo.statProjectsCompleted !== undefined ? localSystemInfo.statProjectsCompleted : ''}
                    onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, statProjectsCompleted: e.target.value ? Number(e.target.value) : 0 })}
                    className="w-full px-2 py-1 bg-slate-900 border border-slate-700 text-xs text-white rounded focus:border-amber-500 focus:outline-none"
                    placeholder="85"
                  />
                </div>
              </div>

              {/* Stat 2 */}
              <div className="space-y-2 bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-emerald-400 font-extrabold uppercase block tracking-wider">Stat 2 (Emerald)</span>
                <div>
                  <label className="block text-[9px] text-gray-450 uppercase mb-1 font-bold">Label</label>
                  <input
                    type="text"
                    value={localSystemInfo.statHappyClientsLabel || ''}
                    onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, statHappyClientsLabel: e.target.value })}
                    className="w-full px-2 py-1 bg-slate-900 border border-slate-700 text-xs text-white rounded focus:border-amber-500 focus:outline-none"
                    placeholder="Happy Clients"
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-gray-450 uppercase mb-1 font-bold">Value (Number)</label>
                  <input
                    type="number"
                    value={localSystemInfo.statHappyClients !== undefined ? localSystemInfo.statHappyClients : ''}
                    onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, statHappyClients: e.target.value ? Number(e.target.value) : 0 })}
                    className="w-full px-2 py-1 bg-slate-900 border border-slate-700 text-xs text-white rounded focus:border-amber-500 focus:outline-none"
                    placeholder="50"
                  />
                </div>
              </div>

              {/* Stat 3 */}
              <div className="space-y-2 bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-violet-400 font-extrabold uppercase block tracking-wider">Stat 3 (Violet)</span>
                <div>
                  <label className="block text-[9px] text-gray-450 uppercase mb-1 font-bold">Label</label>
                  <input
                    type="text"
                    value={localSystemInfo.statYearsExperienceLabel || ''}
                    onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, statYearsExperienceLabel: e.target.value })}
                    className="w-full px-2 py-1 bg-slate-900 border border-slate-700 text-xs text-white rounded focus:border-amber-500 focus:outline-none"
                    placeholder="Years of Experience"
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-gray-450 uppercase mb-1 font-bold">Value (Number)</label>
                  <input
                    type="number"
                    value={localSystemInfo.statYearsExperience !== undefined ? localSystemInfo.statYearsExperience : ''}
                    onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, statYearsExperience: e.target.value ? Number(e.target.value) : 0 })}
                    className="w-full px-2 py-1 bg-slate-900 border border-slate-700 text-xs text-white rounded focus:border-amber-500 focus:outline-none"
                    placeholder="11"
                  />
                </div>
              </div>

              {/* Stat 4 */}
              <div className="space-y-2 bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-amber-500 font-extrabold uppercase block tracking-wider">Stat 4 (Orange)</span>
                <div>
                  <label className="block text-[9px] text-gray-450 uppercase mb-1 font-bold">Label</label>
                  <input
                    type="text"
                    value={localSystemInfo.statTeamMembersLabel || ''}
                    onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, statTeamMembersLabel: e.target.value })}
                    className="w-full px-2 py-1 bg-slate-900 border border-slate-700 text-xs text-white rounded focus:border-amber-500 focus:outline-none"
                    placeholder="Team Members"
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-gray-450 uppercase mb-1 font-bold">Value (Number)</label>
                  <input
                    type="number"
                    value={localSystemInfo.statTeamMembers !== undefined ? localSystemInfo.statTeamMembers : ''}
                    onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, statTeamMembers: e.target.value ? Number(e.target.value) : 0 })}
                    className="w-full px-2 py-1 bg-slate-900 border border-slate-700 text-xs text-white rounded focus:border-amber-500 focus:outline-none"
                    placeholder="120"
                  />
                </div>
              </div>

              {/* Stat 5 */}
              <div className="space-y-2 bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-purple-400 font-extrabold uppercase block tracking-wider">Stat 5 (Purple)</span>
                <div>
                  <label className="block text-[9px] text-gray-450 uppercase mb-1 font-bold">Label</label>
                  <input
                    type="text"
                    value={localSystemInfo.statCitiesServedLabel || ''}
                    onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, statCitiesServedLabel: e.target.value })}
                    className="w-full px-2 py-1 bg-slate-900 border border-slate-700 text-xs text-white rounded focus:border-amber-500 focus:outline-none"
                    placeholder="Cities Served"
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-gray-450 uppercase mb-1 font-bold">Value (Number)</label>
                  <input
                    type="number"
                    value={localSystemInfo.statCitiesServed !== undefined ? localSystemInfo.statCitiesServed : ''}
                    onChange={(e) => setLocalSystemInfo({ ...localSystemInfo, statCitiesServed: e.target.value ? Number(e.target.value) : 0 })}
                    className="w-full px-2 py-1 bg-slate-900 border border-slate-700 text-xs text-white rounded focus:border-amber-500 focus:outline-none"
                    placeholder="15"
                  />
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

      {/* --- Tab Content: Security & Password --- */}
      {activeSubTab === 'security' && (
        <div className="space-y-8 animate-fade-in-up">
          <div className="pb-4 border-b border-slate-800 space-y-1">
            <h4 className="text-lg font-bold font-display text-white">Security & Password Management</h4>
            <p className="text-xs text-gray-400">Update corporate portal access codes and set up automated self-service recovery challenges.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Form A: Change Password */}
            <div className="p-6 bg-slate-850/40 border border-slate-800 rounded-2xl space-y-4 text-left">
              <div className="flex items-center gap-2 text-amber-500 font-display">
                <Lock size={18} />
                <h5 className="text-xs uppercase font-extrabold tracking-wider">Change Administrator Password</h5>
              </div>

              {changePasswordSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-300 text-xs font-sans">
                  {changePasswordSuccess}
                </div>
              )}

              {changePasswordError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-xs font-sans">
                  {changePasswordError}
                </div>
              )}

              <form onSubmit={handleChangePasswordSubmit} className="space-y-4 font-sans">
                <div>
                  <label className="block text-[11px] text-gray-400 font-bold mb-1 uppercase tracking-wide">Current Passcode *</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter current password"
                    value={currentPasswordInput}
                    onChange={(e) => setCurrentPasswordInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-xs text-white rounded focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 font-bold mb-1 uppercase tracking-wide">New Passcode (At Least 4 Chars) *</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter new password"
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-xs text-white rounded focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 font-bold mb-1 uppercase tracking-wide">Confirm New Passcode *</label>
                  <input
                    type="password"
                    required
                    placeholder="Retype new password"
                    value={confirmPasswordInput}
                    onChange={(e) => setConfirmPasswordInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-xs text-white rounded focus:border-amber-500 focus:outline-none"
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
            <div className="p-6 bg-slate-850/40 border border-slate-800 rounded-2xl space-y-4 text-left">
              <div className="flex items-center gap-2 text-amber-500 font-display">
                <ShieldAlert size={18} />
                <h5 className="text-xs uppercase font-extrabold tracking-wider">Configure Security Challenge Question</h5>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed">
                Configure a custom security question and answer phrase. In case you forget your master password, you can reset it seamlessly near the lockscreen portal.
              </p>

              <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1.5 font-sans">
                <span className="text-[10px] text-gray-500 uppercase font-bold block">Current Challenge Parameters:</span>
                <p className="text-xs text-gray-300 font-semibold"><span className="text-amber-500">Q:</span> {securityQuestion}</p>
                <p className="text-xs text-gray-300 font-semibold"><span className="text-amber-500">A:</span> {securityAnswer}</p>
              </div>

              {securityUpdateSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-300 text-xs font-sans">
                  {securityUpdateSuccess}
                </div>
              )}

              <form onSubmit={handleUpdateSecurityQuestion} className="space-y-4 font-sans">
                <div>
                  <label className="block text-[11px] text-gray-400 font-bold mb-1 uppercase tracking-wide">Write Security Question *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. My primary high school name?"
                    value={customQuestionInput}
                    onChange={(e) => setCustomQuestionInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-xs text-white rounded focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 font-bold mb-1 uppercase tracking-wide">Challenge Answer Phrase *</label>
                  <input
                    type="text"
                    required
                    placeholder="Answer case-insensitive phrase"
                    value={customAnswerInput}
                    onChange={(e) => setCustomAnswerInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-xs text-white rounded focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-750 text-gray-300 hover:text-white border border-slate-700 text-xs font-black rounded-lg transition-colors cursor-pointer uppercase tracking-wider"
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
        <div className="space-y-6 animate-fade-in-up shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-800 gap-4">
            <div className="space-y-1">
              <h4 className="text-lg font-bold font-display text-white">Client Testimonial Moderation & Control</h4>
              <p className="text-xs text-gray-400 font-sans">View, moderate, toggle live visibility, delete, or insert client evaluations and recommendations safely.</p>
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
            <div className="p-6 bg-slate-850/60 border border-slate-800 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Plus size={16} className="text-amber-500" />
                <h5 className="text-sm font-bold text-white uppercase tracking-wider font-display">Manually Insert Testimonial</h5>
              </div>

              <form onSubmit={handleAddTestimonial} className="space-y-4 font-sans text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-wide">Client / Author Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mohd Arshad"
                      value={newTestimonialName}
                      onChange={(e) => setNewTestimonialName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-xs text-white rounded focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-wide">Company / Designation</label>
                    <input
                      type="text"
                      placeholder="e.g. Managing Director, Tasha Contracts"
                      value={newTestimonialCompany}
                      onChange={(e) => setNewTestimonialCompany(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-xs text-white rounded focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-wide">Rating (1 to 5 Stars)</label>
                    <select
                      value={newTestimonialRating}
                      onChange={(e) => setNewTestimonialRating(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-xs text-white rounded focus:border-amber-500 focus:outline-none"
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
                        className="w-4 h-4 rounded border-slate-700 bg-slate-900 accent-amber-500 focus:ring-0 cursor-pointer"
                      />
                      <span className="text-xs text-gray-300 font-medium font-sans">Verify & Approve Immediately (Vibe Check)</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-wide">Feedback Client Comment Statement *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Enter the full evaluation details, remarks, or prefabrication praises given by the client..."
                    value={newTestimonialText}
                    onChange={(e) => setNewTestimonialText(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-xs text-white rounded focus:border-amber-500 focus:outline-none resize-none leading-relaxed"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingTestimonial(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-gray-300 rounded text-xs uppercase font-extrabold tracking-wider"
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
            <div className="p-6 bg-slate-850/60 border border-slate-800 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Edit2 size={16} className="text-amber-500" />
                <h5 className="text-sm font-bold text-white uppercase tracking-wider font-display">Edit Client Testimonial</h5>
              </div>

              <form onSubmit={handleSaveEditTestimonial} className="space-y-4 font-sans text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-wide">Client / Author Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mohd Arshad"
                      value={editingTestimonial.clientName || ''}
                      onChange={(e) => setEditingTestimonial({ ...editingTestimonial, clientName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-xs text-white rounded focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-wide">Company / Designation</label>
                    <input
                      type="text"
                      placeholder="e.g. Managing Director, Tasha Contracts"
                      value={editingTestimonial.companyName || ''}
                      onChange={(e) => setEditingTestimonial({ ...editingTestimonial, companyName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-xs text-white rounded focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-wide">Rating (1 to 5 Stars)</label>
                    <select
                      value={editingTestimonial.rating || 5}
                      onChange={(e) => setEditingTestimonial({ ...editingTestimonial, rating: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-xs text-white rounded focus:border-amber-500 focus:outline-none"
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
                        className="w-4 h-4 rounded border-slate-700 bg-slate-900 accent-amber-500 focus:ring-0 cursor-pointer"
                      />
                      <span className="text-xs text-gray-300 font-medium font-sans">Verify & Approve Live Visibility</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-wide">Feedback Client Comment Statement *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Enter local evaluations given..."
                    value={editingTestimonial.text || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, text: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-xs text-white rounded focus:border-amber-500 focus:outline-none resize-none leading-relaxed"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingTestimonial(null)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-gray-300 rounded text-xs uppercase font-extrabold tracking-wider"
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
              <div className="p-8 border border-dashed border-slate-800 text-center rounded-xl bg-slate-900/10">
                <p className="text-xs text-gray-400 font-sans">No client testimonials saved yet. Try writing a review on the storefront or clicking 'Manually Insert' above!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testimonials.map((test) => {
                  const isApproved = test.approved !== false;
                  return (
                    <div key={test.id} className="p-5 rounded-xl bg-[#0d1625] border border-slate-800/80 flex flex-col justify-between space-y-4 shadow-lg text-left">
                      <div className="space-y-3 font-sans w-full">
                        <div className="flex justify-between items-start gap-4">
                          <div className="min-w-0">
                            <h6 className="font-extrabold text-white text-sm truncate">{test.clientName}</h6>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium truncate">{test.companyName || 'Independent Client'}</p>
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

                        <p className="text-xs text-gray-300 leading-relaxed italic break-words">
                          "{test.text}"
                        </p>
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-slate-800/60 font-sans w-full">
                        <span className="text-[9px] text-gray-500 shrink-0">{test.date || 'Historic Entry'}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleApproval(test.id)}
                            className={`p-1 rounded text-[10px] font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-1 cursor-pointer ${
                              isApproved 
                                ? 'text-amber-500 hover:text-amber-400 bg-amber-500/5 hover:bg-amber-500/10' 
                                : 'text-emerald-400 hover:text-emerald-300 bg-emerald-400/5 hover:bg-emerald-400/10'
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
                            className="p-1 hover:text-white text-gray-400 bg-slate-800/40 hover:bg-slate-800/90 rounded cursor-pointer"
                            title="Edit details"
                          >
                            <Edit2 size={12} />
                          </button>

                          <button
                            onClick={() => handleDeleteTestimonialId(test.id)}
                            className="p-1 hover:text-red-400 text-gray-500 bg-red-950/10 hover:bg-red-950/40 rounded cursor-pointer"
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

      {/* --- Tab Content: Web Manager (Dynamic Media Catalog) --- */}
      {/* Code has been moved out to allow standalone webmanager panel access via footer */}

    </div>
  );
};
