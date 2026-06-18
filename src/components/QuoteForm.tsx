import React, { useState } from 'react';
import { QuoteRequest } from '../types';
import { FileText, Send, CheckCircle2, AlertCircle, Upload } from 'lucide-react';

interface QuoteFormProps {
  onQuoteSubmit: (quote: QuoteRequest) => void;
  themeMode?: 'light' | 'dark';
}

export const QuoteForm: React.FC<QuoteFormProps> = ({ onQuoteSubmit, themeMode }) => {
  const isDark = themeMode === 'dark';
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    mobileNumber: '',
    email: '',
    projectType: 'General Contracting',
    budgetRange: '₹10 Lakhs - ₹50 Lakhs',
    location: '',
    message: ''
  });

  const [file, setFile] = useState<File | null>(null);
  const [fileData, setFileData] = useState<string>('');
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const projectTypes = [
    'General Contracting',
    'LGSF / Prefabricated Building',
    'Civil Construction',
    'Interior Fit-Out Works',
    'Renovation & Remodeling',
    'MEP / Electrical Solutions',
    'Commercial Development',
    'Residential Custom Villa'
  ];

  const budgetRanges = [
    '₹10 Lakhs - ₹50 Lakhs',
    '₹50 Lakhs - ₹2 Crores',
    '₹2 Crores - ₹5 Crores',
    '₹5 Crores - ₹20 Crores',
    '₹20 Crores +'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileData(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileData(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName || !formData.mobileNumber || !formData.email || !formData.location) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      setError('Please provide a valid email address.');
      return;
    }

    const newQuote: QuoteRequest = {
      id: 'q_' + Date.now(),
      fullName: formData.fullName,
      companyName: formData.companyName || 'Individual',
      mobileNumber: formData.mobileNumber,
      email: formData.email,
      projectType: formData.projectType,
      budgetRange: formData.budgetRange,
      location: formData.location,
      message: formData.message,
      fileName: file ? file.name : undefined,
      fileData: file ? fileData : undefined,
      submissionDate: new Date().toISOString(),
      status: 'Pending'
    };

    onQuoteSubmit(newQuote);
    setIsSubmitted(true);
    
    // reset
    setFormData({
      fullName: '',
      companyName: '',
      mobileNumber: '',
      email: '',
      projectType: 'General Contracting',
      budgetRange: '₹10 Lakhs - ₹50 Lakhs',
      location: '',
      message: ''
    });
    setFile(null);
    setFileData('');
  };

  if (isSubmitted) {
    return (
      <div className={`border rounded-2xl p-8 text-center max-w-2xl mx-auto space-y-5 animate-fade-in-up ${
        isDark 
          ? 'bg-slate-800/40 border-emerald-500/20 text-white' 
          : 'bg-emerald-50/30 border-emerald-200 text-slate-900'
      }`}>
        <div className="mx-auto w-16 h-16 bg-emerald-500/10 text-emerald-550 flex items-center justify-center rounded-full border border-emerald-500/30">
          <CheckCircle2 size={36} />
        </div>
        <h3 className={`text-2xl font-bold font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>Quote Request Received!</h3>
        <p className={`text-sm md:text-base leading-relaxed ${isDark ? 'text-gray-350' : 'text-slate-600'}`}>
          Thank you for trusting **Tasha Contracts India** with your upcoming development. Our lead estimating engineer will review your drawings and specifications, and contact you via phone/email within **24 business hours**.
        </p>
        <button
          onClick={() => setIsSubmitted(false)}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-100 dark:text-slate-950 font-bold rounded-lg transition-colors cursor-pointer"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  const labelClass = `block text-xs font-bold mb-1.5 uppercase tracking-wide ${isDark ? 'text-slate-400' : 'text-slate-700'}`;
  const inputClass = `w-full px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all ${
    isDark 
      ? 'bg-slate-900 border border-slate-700 text-white focus:border-amber-500' 
      : 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-amber-500 focus:bg-white'
  }`;

  return (
    <form onSubmit={handleSubmit} className={`p-6 md:p-8 rounded-2xl space-y-6 border ${
      isDark 
        ? 'bg-slate-800/20 border-slate-700/40 text-white' 
        : 'bg-white border-slate-200/80 text-slate-800 shadow-md'
    }`}>
      <h3 className={`text-xl font-bold font-display border-l-4 border-amber-500 pl-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
        Estimate Your Project
      </h3>
      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
        Fill out the specifications below or upload site CAD files, and receive a granular cost and staging overview.
      </p>

      {error && (
        <div className={`flex items-center gap-2 p-3 rounded-lg text-xs text-left ${
          isDark 
            ? 'bg-red-500/15 border border-red-500/35 text-red-300' 
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>
            Full Name <span className="text-amber-500">*</span>
          </label>
          <input 
            type="text" 
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Mr. Jackson"
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>
            Company Name
          </label>
          <input 
            type="text" 
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="e.g. Everest Industries Limited"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>
            Mobile Number (India) <span className="text-amber-500">*</span>
          </label>
          <input 
            type="tel" 
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            placeholder="+91 94119 XXXXX"
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>
            Email Address <span className="text-amber-500">*</span>
          </label>
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="client@corporate.in"
            required
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>
            Project Category
          </label>
          <select 
            name="projectType"
            value={formData.projectType}
            onChange={handleChange}
            className={inputClass}
          >
            {projectTypes.map((t) => (
              <option key={t} value={t} className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>
            Budget Range
          </label>
          <select 
            name="budgetRange"
            value={formData.budgetRange}
            onChange={handleChange}
            className={inputClass}
          >
            {budgetRanges.map((b) => (
              <option key={b} value={b} className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>{b}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>
          Project Site Location <span className="text-amber-500">*</span>
        </label>
        <input 
          type="text" 
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="e.g. Noida Sector 62 / Ramban, Jammu"
          required
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>
          Detailed Message / Notes
        </label>
        <textarea 
          name="message"
          rows={3}
          value={formData.message}
          onChange={handleChange}
          placeholder="Describe your construction parameters, required materials, or custom timeframe targets..."
          className={inputClass}
        />
      </div>

      {/* File Upload Section */}
      <div className="space-y-2">
        <label className={labelClass}>
          Site Drawing / Structural CAD Files (Optional)
        </label>
        
        <div 
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-4 text-center transition-colors ${
            dragActive 
              ? 'border-amber-500 bg-amber-500/5' 
              : isDark
                ? 'border-slate-700/60 hover:border-amber-500/40 bg-slate-900/40'
                : 'border-slate-300 hover:border-amber-500/40 bg-slate-50/40'
          }`}
        >
          <input 
            type="file" 
            id="file-upload"
            onChange={handleFileChange}
            accept=".pdf,.png,.jpg,.jpeg,.dwg,.zip"
            className="hidden"
          />
          <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-1.5">
            <Upload className="text-amber-500 mb-1" size={24} />
            <span className={`text-xs font-bold underline ${isDark ? 'text-white hover:text-amber-400' : 'text-slate-800 hover:text-amber-600'}`}>
              {file ? 'Click to change file' : 'Drag & drop drawings or browse'}
            </span>
            <span className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
              Supports PDF, PNG, JPG, CAD (DWG), ZIP (Max 15MB)
            </span>
          </label>
        </div>

        {file && (
          <div className={`flex items-center gap-2 p-2 border rounded-lg ${
            isDark ? 'bg-slate-900 border-slate-700/60' : 'bg-slate-50 border-slate-205'
          }`}>
            <FileText size={16} className="text-amber-500" />
            <span className={`text-xs truncate max-w-[200px] ${isDark ? 'text-white' : 'text-slate-900'}`}>{file.name}</span>
            <span className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
            <button 
              type="button" 
              onClick={() => {
                setFile(null);
                setFileData('');
              }} 
              className="ml-auto text-red-500 hover:text-red-650 text-xs px-1.5 font-bold"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
      >
        <Send size={16} />
        Submit Estimating Bid Request
      </button>

    </form>
  );
};
