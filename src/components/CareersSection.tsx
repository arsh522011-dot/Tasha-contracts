import React, { useState } from 'react';
import { CareerListing, CareerApplication } from '../types';
import { Briefcase, MapPin, Clock, FileText, Send, CheckCircle, ArrowRight } from 'lucide-react';

interface CareersSectionProps {
  careers: CareerListing[];
  onApply: (application: CareerApplication) => void;
  themeMode?: 'light' | 'dark';
}

export const CareersSection: React.FC<CareersSectionProps> = ({ careers, onApply, themeMode }) => {
  const isDark = themeMode === 'dark';
  const [selectedJob, setSelectedJob] = useState<CareerListing | null>(null);
  const [showApplyModal, setShowApplyModal] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    coverLetter: ''
  });
  const [resume, setResume] = useState<File | null>(null);
  const [resumeData, setResumeData] = useState<string>('');
  const [appliedJobId, setAppliedJobId] = useState<string | null>(null);

  const handleApplyClick = (job: CareerListing) => {
    setSelectedJob(job);
    setShowApplyModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setResume(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setResumeData(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    const newApplication: CareerApplication = {
      id: 'app_' + Date.now(),
      careerId: selectedJob.id,
      careerTitle: selectedJob.title,
      fullName: formData.fullName,
      email: formData.email,
      mobile: formData.mobile,
      coverLetter: formData.coverLetter,
      fileName: resume ? resume.name : 'resume_digital.pdf',
      fileData: resume ? resumeData : undefined,
      submissionDate: new Date().toISOString(),
      status: 'Pending'
    };

    onApply(newApplication);
    setAppliedJobId(selectedJob.id);
    
    // Reset form
    setFormData({ fullName: '', email: '', mobile: '', coverLetter: '' });
    setResume(null);
    setResumeData('');
    setShowApplyModal(false);
    setSelectedJob(null);
  };

  return (
    <div className="space-y-8">
      {appliedJobId && (
        <div className={`p-4 border rounded-xl flex items-center justify-between text-xs md:text-sm animate-fade-in-up ${
          isDark 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' 
            : 'bg-emerald-50 border-emerald-250 text-emerald-800 font-medium shadow-sm'
        }`}>
          <div className="flex items-center gap-2">
            <CheckCircle size={18} className="shrink-0 text-emerald-555" />
            <span>Success! Your resume and application have been submitted for review.</span>
          </div>
          <button 
            onClick={() => setAppliedJobId(null)}
            className={`uppercase tracking-wide text-[10px] font-bold hover:underline ${isDark ? 'text-white' : 'text-slate-800'}`}
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {careers.filter(c => c.active).map((job) => (
          <div 
            key={job.id}
            className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6 ${
              isDark 
                ? 'bg-slate-800/20 border-slate-700/40 hover:border-amber-500/30 text-white' 
                : 'bg-white border-slate-200/80 text-slate-800 shadow-md hover:shadow-lg hover:border-amber-500/40'
            }`}
          >
            <div className="space-y-3 max-w-2xl">
              <div className="flex flex-wrap gap-2">
                <span className={`px-2.5 py-0.5 border rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  isDark 
                    ? 'bg-slate-900 text-amber-400 border-slate-700' 
                    : 'bg-slate-100 text-indigo-700 border-slate-200/80 shadow-sm'
                }`}>
                  {job.department}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  isDark 
                    ? 'bg-amber-500/10 text-amber-500' 
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}>
                  {job.type}
                </span>
              </div>

              <h4 className={`text-xl font-extrabold font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {job.title}
              </h4>
              
              <div className={`flex flex-wrap gap-x-4 gap-y-2 text-xs ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                <span className="flex items-center gap-1 font-medium">
                  <MapPin size={14} className="text-amber-500" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <Clock size={14} className="text-amber-500" />
                  Immediate Opening
                </span>
              </div>

              <p className={`text-sm leading-relaxed pt-1 ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                {job.description}
              </p>

              <div className="pt-2">
                <h5 className={`text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
                  Requirements & Candidate Specs:
                </h5>
                <ul className={`list-disc list-inside space-y-1 text-xs pl-1 ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                  {job.requirements.map((req, index) => (
                    <li key={index} className="leading-relaxed">{req}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="md:self-center shrink-0">
              <button
                onClick={() => handleApplyClick(job)}
                className="w-full md:w-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 uppercase tracking-wider cursor-pointer"
              >
                Apply Online
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Online Application Modal */}
      {showApplyModal && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in-up">
          <div className={`border rounded-2xl max-w-xl w-full p-6 md:p-8 relative ${
            isDark 
              ? 'bg-slate-900 border-amber-500/20 text-white' 
              : 'bg-white border-slate-200 text-slate-800 shadow-2xl'
          }`}>
            <button 
              onClick={() => setShowApplyModal(false)}
              className="absolute top-4 right-4 p-2.5 text-gray-400 hover:text-red-500 transition-colors font-bold text-lg"
            >
              ✕
            </button>

            <div className="space-y-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-500 tracking-wider">
                  Apply for Position
                </span>
                <h3 className={`text-xl md:text-2xl font-bold font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {selectedJob.title}
                </h3>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                  {selectedJob.location} | {selectedJob.type}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                <div>
                  <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-gray-400' : 'text-slate-700'}`}>
                    Full Name <span className="text-amber-500">*</span>
                  </label>
                  <input 
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Mr. Jackson"
                    className={`w-full px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 ${
                      isDark 
                        ? 'bg-slate-900 border border-slate-700 text-white focus:border-amber-500' 
                        : 'bg-slate-50 border border-slate-205 text-slate-900 focus:border-amber-500 focus:bg-white'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-gray-400' : 'text-slate-700'}`}>
                      Email Address <span className="text-amber-500">*</span>
                    </label>
                    <input 
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@email.com"
                      className={`w-full px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 ${
                        isDark 
                          ? 'bg-slate-900 border border-slate-700 text-white focus:border-amber-500' 
                          : 'bg-slate-50 border border-slate-205 text-slate-900 focus:border-amber-500 focus:bg-white'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-gray-400' : 'text-slate-700'}`}>
                      Mobile Number <span className="text-amber-500">*</span>
                    </label>
                    <input 
                      type="tel"
                      required
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      placeholder="+91 94119 XXXXX"
                      className={`w-full px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 ${
                        isDark 
                          ? 'bg-slate-900 border border-slate-700 text-white focus:border-amber-500' 
                          : 'bg-slate-50 border border-slate-205 text-slate-900 focus:border-amber-500 focus:bg-white'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-gray-400' : 'text-slate-700'}`}>
                    Brief Statement / Cover Letter
                  </label>
                  <textarea 
                    rows={3}
                    value={formData.coverLetter}
                    onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                    placeholder="Highlight your previous construction project experience or specializations..."
                    className={`w-full px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 ${
                      isDark 
                        ? 'bg-slate-900 border border-slate-700 text-white focus:border-amber-500' 
                        : 'bg-slate-50 border border-slate-205 text-slate-900 focus:border-amber-500 focus:bg-white'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-gray-400' : 'text-slate-700'}`}>
                    Attach Professional Resume <span className="text-amber-500">*</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="file"
                      id="resume-upload"
                      required
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label 
                      htmlFor="resume-upload" 
                      className={`px-4 py-2 border text-xs rounded-lg cursor-pointer font-bold transition-all ${
                        isDark 
                          ? 'bg-slate-850 hover:bg-slate-750 border-slate-700 text-gray-300' 
                          : 'bg-slate-100 hover:bg-slate-200 border-slate-250 text-slate-700'
                      }`}
                    >
                      Choose File
                    </label>
                    <span className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                      {resume ? resume.name : 'No file selected (.pdf, .doc)'}
                    </span>
                  </div>
                </div>

                <div className={`pt-4 flex justify-end gap-3 border-t ${isDark ? 'border-slate-800' : 'border-slate-150'}`}>
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className={`px-4 py-2 text-xs font-bold rounded-lg ${
                      isDark 
                        ? 'bg-slate-800 hover:bg-slate-700 text-white' 
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
                  >
                    <Send size={12} />
                    Send Application
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
