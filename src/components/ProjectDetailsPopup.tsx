import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import { 
  X, MapPin, Calendar, User, CheckCircle2, Clock, 
  ChevronLeft, ChevronRight, Maximize2 
} from 'lucide-react';
import { optimizeImage } from '../utils/imageOptimizer';

interface ProjectDetailsPopupProps {
  project: Project;
  onClose: () => void;
  themeMode?: 'light' | 'dark';
}

export const ProjectDetailsPopup: React.FC<ProjectDetailsPopupProps> = ({ project, onClose, themeMode }) => {
  const isDark = themeMode === 'dark';
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  
  // Set up all dynamic images for portfolio gallery
  const allImages: string[] = [];
  if (project.image) allImages.push(project.image);
  
  if (project.galleryImages && project.galleryImages.length > 0) {
    project.galleryImages.forEach(img => {
      if (img && !allImages.includes(img)) {
        allImages.push(img);
      }
    });
  }

  // Fallbacks using before & after if we don't have enough images
  if (project.beforeImage && !allImages.includes(project.beforeImage)) {
    allImages.push(project.beforeImage);
  }
  if (project.afterImage && !allImages.includes(project.afterImage)) {
    allImages.push(project.afterImage);
  }

  // Absolute fallback placeholder
  if (allImages.length === 0) {
    allImages.push('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800');
  }

  const [activeImgIndex, setActiveImgIndex] = useState<number>(0);
  const [lightboxImageIndex, setLightboxImageIndex] = useState<number | null>(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        if (lightboxImageIndex !== null) {
          setLightboxImageIndex((prev) => (prev! + 1) % allImages.length);
        } else {
          setActiveImgIndex((prev) => (prev + 1) % allImages.length);
        }
      } else if (e.key === 'ArrowLeft') {
        if (lightboxImageIndex !== null) {
          setLightboxImageIndex((prev) => (prev! - 1 + allImages.length) % allImages.length);
        } else {
          setActiveImgIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
        }
      } else if (e.key === 'Escape') {
        if (lightboxImageIndex !== null) {
          setLightboxImageIndex(null);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxImageIndex, allImages.length, onClose]);

  const handleNextPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveImgIndex((prev) => (prev + 1) % allImages.length);
  };

  const handlePrevPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveImgIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  return (
    <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in-up">
      <div className={`border rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative transition-colors ${
        isDark 
          ? 'bg-slate-900 border-amber-500/20 text-white' 
          : 'bg-white border-slate-200 text-slate-800'
      }`}>
        
        {/* Header Ribbon bar */}
        <div className={`sticky top-0 z-30 flex items-center justify-between p-4 border-b ${
          isDark 
            ? 'bg-slate-950/95 border-slate-850 text-white' 
            : 'bg-white/95 border-slate-150 text-slate-950'
        } backdrop-blur`}>
          <div>
            <span className="px-2.5 py-0.5 bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-widest rounded">
              {project.category}
            </span>
            <h2 className="text-lg md:text-xl font-black font-display text-inherit mt-1 leading-tight">
              {project.title}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className={`p-2 rounded-full transition-all duration-200 shrink-0 ${
              isDark 
                ? 'bg-slate-800 hover:bg-amber-500 text-gray-300 hover:text-slate-950' 
                : 'bg-slate-100 hover:bg-amber-500 text-slate-700 hover:text-slate-950 border border-slate-200'
            }`}
            aria-label="Close Project Details"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 md:p-7 space-y-6">

          {/* ACTIVE PORTFOLIO SLIDER / GALLERY */}
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <span className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-amber-400' : 'text-amber-800'}`}>
                Project Portfolio Showcase
              </span>
              <span className={`text-[11px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Photo {activeImgIndex + 1} of {allImages.length}
              </span>
            </div>

            {/* Viewport container */}
            <div className={`group relative h-72 md:h-96 w-full rounded-xl overflow-hidden border bg-slate-950 flex shadow-md ${
              isDark ? 'border-slate-800' : 'border-slate-200'
            }`}>
              {/* Main Active image */}
              <img 
                src={optimizeImage(allImages[activeImgIndex], 800) || undefined} 
                alt={`${project.title} gallery showcase`}
                referrerPolicy="no-referrer"
                loading="eager"
                onClick={() => setLightboxImageIndex(activeImgIndex)}
                className="w-full h-full object-cover cursor-zoom-in group-hover:scale-[1.015] transition-transform duration-550 select-none" 
              />
              
              {/* Darkening bottom mask */}
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

              {/* Slider Left Arrow button */}
              <button
                type="button"
                onClick={handlePrevPhoto}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-950/60 hover:bg-amber-500 text-white hover:text-slate-950 backdrop-blur transition-all shadow-lg hover:scale-105 active:scale-95"
                title="Previous Photo"
              >
                <ChevronLeft size={18} />
              </button>

              {/* Slider Right Arrow button */}
              <button
                type="button"
                onClick={handleNextPhoto}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-950/60 hover:bg-amber-500 text-white hover:text-slate-950 backdrop-blur transition-all shadow-lg hover:scale-105 active:scale-95"
                title="Next Photo"
              >
                <ChevronRight size={18} />
              </button>

              {/* Maximize zoom-in click indicator */}
              <button
                type="button"
                onClick={() => setLightboxImageIndex(activeImgIndex)}
                className="absolute bottom-3 right-3 p-2 rounded-lg bg-black/60 hover:bg-amber-500 text-white hover:text-slate-950 backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider"
              >
                <Maximize2 size={12} /> Live Zoom
              </button>
            </div>

            {/* Slider Thumbnail previews row */}
            {allImages.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1.5 pt-0.5 justify-start scrollbar-thin scrollbar-thumb-slate-700 select-none">
                {allImages.map((imgUrl, index) => {
                  const isActive = index === activeImgIndex;
                  return (
                    <button
                      key={index}
                      onClick={() => setActiveImgIndex(index)}
                      className={`relative h-14 w-20 md:h-16 md:w-24 shrink-0 rounded-lg overflow-hidden border transition-all ${
                        isActive 
                          ? 'border-amber-500 ring-2 ring-amber-500/30 opacity-100 scale-95 animate-pulse-once' 
                          : 'border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img 
                        src={optimizeImage(imgUrl, 160) || undefined} 
                        alt="Thumbnail" 
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Stats Grid */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-xl ${
            isDark 
              ? 'bg-slate-800/40 border-slate-700/50' 
              : 'bg-slate-50 border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center gap-3">
              <MapPin className="text-amber-500 shrink-0" size={20} />
              <div>
                <p className={`text-xs capitalize ${isDark ? 'text-gray-400' : 'text-slate-500 font-medium'}`}>Location</p>
                <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-950'}`}>{project.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="text-amber-500 shrink-0" size={20} />
              <div>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-500 font-medium'}`}>Timeline</p>
                <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-950'}`}>{project.completionDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User className="text-amber-500 shrink-0" size={20} />
              <div>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-500 font-medium'}`}>Client / Partner</p>
                <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-950'}`}>{project.client || 'Corporate Client'}</p>
              </div>
            </div>
          </div>

          {/* Project Technical overview */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-sm font-extrabold uppercase tracking-widest ${isDark ? 'text-amber-400' : 'text-amber-800'}`}>
                Project Overview
              </h3>
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                isDark ? 'bg-slate-800/40 border-slate-705 text-slate-300' : 'bg-white border-slate-200 text-slate-705'
              }`}>
                {project.status === 'Completed' ? (
                  <>
                    <CheckCircle2 size={13} className="text-emerald-500" />
                    <span className="text-emerald-600 font-bold">Completed Works</span>
                  </>
                ) : (
                  <>
                    <Clock size={13} className="text-amber-500" />
                    <span className="text-amber-700 font-bold">Active / Ongoing</span>
                  </>
                )}
              </div>
            </div>
            
            <p className={`leading-relaxed text-sm md:text-base ${isDark ? 'text-gray-300' : 'text-slate-650'}`}>
              {project.description}
            </p>
          </div>

          {/* Interactive Before/After Split comparison (kept if beforeImage exists) */}
          {project.beforeImage && (
            <div className="space-y-3 pt-2 border-t border-slate-800/40">
              <h4 className={`text-sm font-extrabold uppercase tracking-widest ${isDark ? 'text-amber-400' : 'text-amber-800'}`}>
                Site Transformation Comparison
              </h4>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                Drag the center vertical divider bar to compare the direct raw environment with modern Tasha Contractors outcome.
              </p>

              {project.afterImage ? (
                /* Beautiful Sliding Drag bar */
                <div 
                  className={`relative h-64 md:h-80 w-full rounded-xl overflow-hidden cursor-ew-resize select-none border ${
                    isDark ? 'border-slate-800' : 'border-slate-200'
                  }`}
                  onMouseMove={handleMouseMove}
                  onTouchMove={handleTouchMove}
                  onMouseDown={() => setIsDragging(true)}
                  onTouchStart={() => setIsDragging(true)}
                  onMouseUp={() => setIsDragging(false)}
                  onTouchEnd={() => setIsDragging(false)}
                  onMouseLeave={() => setIsDragging(false)}
                >
                  <img 
                    src={optimizeImage(project.beforeImage, 800) || undefined} 
                    alt="Before transformation" 
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-black/75 text-white font-mono text-[10px] px-2 py-1 rounded shadow">
                    Raw Site Stage (Before)
                  </div>

                  <div 
                    className="absolute inset-y-0 right-0 overflow-hidden" 
                    style={{ left: `${sliderPosition}%` }}
                  >
                    <img 
                      src={optimizeImage(project.afterImage, 800) || undefined} 
                      alt="After transformation" 
                      className="absolute inset-y-0 right-0 w-full h-full object-cover pointer-events-none"
                      style={{ 
                        width: '100%', 
                        maxWidth: 'none', 
                        height: '100%',
                        transform: `translateX(-${sliderPosition}%)`
                      }} 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2.5 right-2.5 bg-amber-500 text-slate-950 font-mono font-black text-[10px] px-2 py-1 rounded shadow">
                      Tasha Built (After)
                    </div>
                  </div>

                  {/* Handle Slider Line */}
                  <div 
                    className="absolute inset-y-0 w-1 bg-amber-500 cursor-ew-resize flex items-center justify-center pointer-events-none"
                    style={{ left: `${sliderPosition}%` }}
                  >
                    <div className="w-8 h-8 rounded-full bg-amber-500 border-2 border-slate-900 text-slate-950 flex items-center justify-center font-bold text-base shadow-xl shrink-0">
                      ↔
                    </div>
                  </div>
                </div>
              ) : (
                /* Side-by-Side backup grid */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`relative rounded-xl overflow-hidden border ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                    <img 
                      src={optimizeImage(project.beforeImage, 600) || undefined} 
                      alt="Raw site stage" 
                      className="w-full h-48 object-cover" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-2.5 left-2.5 bg-black/75 text-gray-300 text-[10px] px-2 py-1 rounded">
                      Raw Site Stage
                    </div>
                  </div>
                  <div className={`relative rounded-xl overflow-hidden border ${isDark ? 'border-amber-500/20' : 'border-amber-500/40'}`}>
                    <img 
                      src={optimizeImage(project.image, 600) || undefined} 
                      alt="Completed structure" 
                      className="w-full h-48 object-cover" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-2.5 left-2.5 bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-1 rounded">
                      Completed Framework
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer Backstop Action Button */}
          <div className={`flex justify-end pt-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-150'}`}>
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-lg transition-colors duration-205 cursor-pointer shadow-sm text-xs uppercase tracking-wider font-display"
            >
              Back to Gallery
            </button>
          </div>

        </div>
      </div>

      {/* FULL SCREEN LIGHTBOX DIALOG OVERLAY */}
      {lightboxImageIndex !== null && (
        <div 
          className="fixed inset-0 z-55 bg-black/95 flex flex-col justify-between p-4 animate-fade-in select-none"
          onClick={() => setLightboxImageIndex(null)}
        >
          {/* Controls Bar */}
          <div className="flex justify-between items-center w-full max-w-5xl mx-auto pt-2 pb-4">
            <span className="text-white font-mono text-xs font-bold bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
              Photo {lightboxImageIndex + 1} of {allImages.length}
            </span>
            <button 
              onClick={() => setLightboxImageIndex(null)}
              className="p-2.5 bg-slate-900 text-white hover:text-amber-500 rounded-full hover:scale-105 active:scale-95 transition-all outline-none border border-slate-850"
              title="Close Full Screen"
            >
              <X size={18} />
            </button>
          </div>

          {/* Lightbox main frame */}
          <div className="relative flex-1 flex items-center justify-center max-w-5xl mx-auto w-full group">
            {/* Left controller */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxImageIndex((prev) => (prev! - 1 + allImages.length) % allImages.length);
              }}
              className="absolute left-2 z-10 p-3 bg-slate-900/80 hover:bg-amber-500 text-white hover:text-slate-950 rounded-full shrink-0 border border-slate-800/60 shadow-lg hover:scale-105 transition-all"
              title="Previous Photo"
            >
              <ChevronLeft size={22} />
            </button>

            {/* Display container */}
            <div className="relative max-h-[75vh] max-w-full overflow-hidden flex items-center justify-center p-2 rounded-xl">
              <img 
                src={optimizeImage(allImages[lightboxImageIndex], 1200) || undefined} 
                alt="Lightbox View" 
                referrerPolicy="no-referrer"
                className="max-h-[75vh] max-w-full rounded-lg object-contain shadow-2xl transition-all duration-350 pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Right controller */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxImageIndex((prev) => (prev! + 1) % allImages.length);
              }}
              className="absolute right-2 z-10 p-3 bg-slate-900/80 hover:bg-amber-500 text-white hover:text-slate-950 rounded-full shrink-0 border border-slate-800/60 shadow-lg hover:scale-105 transition-all"
              title="Next Photo"
            >
              <ChevronRight size={22} />
            </button>
          </div>

          {/* Quick instructions and index indicator */}
          <div className="w-full text-center py-4 bg-transparent">
            <p className="text-[10px] text-gray-500 tracking-widest uppercase font-bold">
              Tip: Press ← or → arrows via physical keyboard, or click black boundaries to dismiss zoom
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
