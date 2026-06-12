import React, { useState } from 'react';
import { Star, CheckCircle2, MessageSquarePlus, X } from 'lucide-react';
import { Testimonial } from '../types';

interface AddTestimonialFormProps {
  onAddTestimonial: (testimonial: Testimonial) => void;
  isDark?: boolean;
}

export const AddTestimonialForm: React.FC<AddTestimonialFormProps> = ({ onAddTestimonial, isDark = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [clientName, setClientName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!clientName.trim()) {
      setValidationError('Please enter your name.');
      return;
    }
    if (!text.trim()) {
      setValidationError('Please share your feedback text details.');
      return;
    }

    const newTestimonial: Testimonial = {
      id: 'usr-' + Date.now(),
      clientName: clientName.trim(),
      companyName: companyName.trim() || 'Independent Client',
      text: text.trim(),
      rating: rating,
      approved: false, // Moderated by default so admin can manage/approve it!
      date: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    };

    onAddTestimonial(newTestimonial);
    setIsSubmitted(true);
    
    // Clear form
    setClientName('');
    setCompanyName('');
    setText('');
    setRating(5);

    // Auto close success screen after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setIsOpen(false);
    }, 5000);
  };

  return (
    <div className="w-full text-center">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="px-6 py-2.5 bg-transparent hover:bg-amber-500/10 border border-amber-500 text-amber-500 font-bold uppercase tracking-widest text-[11px] rounded-lg cursor-pointer transition-all inline-flex items-center gap-2 shadow-sm"
        >
          <MessageSquarePlus size={14} /> Write A Testimonial
        </button>
      ) : (
        <div className={`mt-6 p-6 md:p-8 rounded-2xl border text-left max-w-xl mx-auto transition-all ${
          isDark 
            ? 'bg-slate-900/90 border-slate-800' 
            : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex justify-between items-center mb-4">
            <h4 className={`text-base font-bold font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Share Your Construction Experience
            </h4>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-slate-800/50 rounded-full transition-colors text-gray-400 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>

          {isSubmitted ? (
            <div className="py-6 text-center space-y-3">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full">
                <CheckCircle2 size={24} />
              </div>
              <h5 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>Testimonial Submitted!</h5>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                Thank you for your valuable feedback, <b className="text-amber-500">{clientName || 'Partner'}</b>! Your testimonial has been securely submitted for administrative moderation and will appear live once authorized by the Managing Director.
              </p>
              <button
                onClick={() => setIsOpen(false)}
                className="mt-2 text-xs text-amber-500 hover:underline font-bold"
              >
                Close Feedback Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {validationError && (
                <div className="p-2.5 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-400 font-medium">
                  {validationError}
                </div>
              )}

              {/* Form grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase tracking-wider font-extrabold text-gray-400">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Er. Rajesh Kumar"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950/40 border border-slate-800 text-xs text-white rounded focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase tracking-wider font-extrabold text-gray-400">Company / Organization</label>
                  <input
                    type="text"
                    placeholder="e.g. L&T Prefab Division"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950/40 border border-slate-800 text-xs text-white rounded focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Dynamic Interactive Stars */}
              <div className="space-y-1">
                <label className="block text-[10px] uppercase tracking-wider font-extrabold text-gray-400">Project Quality Rating</label>
                <div className="flex items-center gap-1.5 mt-1">
                  {[1, 2, 3, 4, 5].map((index) => {
                    const isLit = hoveredRating !== null ? index <= hoveredRating : index <= rating;
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setRating(index)}
                        onMouseEnter={() => setHoveredRating(index)}
                        onMouseLeave={() => setHoveredRating(null)}
                        className="p-1 hover:scale-110 transition-transform cursor-pointer text-amber-400"
                      >
                        <Star 
                          size={18} 
                          fill={isLit ? 'currentColor' : 'none'} 
                          className="transition-colors"
                        />
                      </button>
                    );
                  })}
                  <span className="text-[11px] font-mono font-bold text-amber-500 ml-2">
                    {rating === 5 ? 'Excellent 5/5' : rating === 4 ? 'Very Good 4/5' : rating === 3 ? 'Good 3/5' : rating === 2 ? 'Average 2/5' : 'Needs Improvement 1/5'}
                  </span>
                </div>
              </div>

              {/* Comments feedback */}
              <div className="space-y-1">
                <label className="block text-[10px] uppercase tracking-wider font-extrabold text-gray-400">Your Feedback Statement *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Share details about the structural safety, execution schedule speed, design engineering compliance, or prefabricated quality of Tasha Contracts..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950/40 border border-slate-800 text-xs text-white rounded focus:border-amber-500 focus:outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Controls */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-slate-800/40 hover:bg-slate-800 text-gray-400 hover:text-white rounded text-xs px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-xs shadow-md transition-colors uppercase tracking-wider"
                >
                  Post Feedback
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
