import React, { useState } from 'react';
import { Project } from '../types';
import { X, MapPin, Calendar, User, CheckCircle2, Clock } from 'lucide-react';

interface ProjectDetailsPopupProps {
  project: Project;
  onClose: () => void;
  themeMode?: 'light' | 'dark';
}

export const ProjectDetailsPopup: React.FC<ProjectDetailsPopupProps> = ({ project, onClose, themeMode }) => {
  const isDark = themeMode === 'dark';
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in-up">
      <div className={`border rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative transition-colors ${
        isDark 
          ? 'bg-slate-900 border-amber-500/20 text-white' 
          : 'bg-white border-slate-200 text-slate-800'
      }`}>
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className={`absolute top-4 right-4 z-10 p-2.5 rounded-full transition-all duration-200 ${
            isDark 
              ? 'bg-slate-800 hover:bg-amber-500 text-gray-300 hover:text-slate-950' 
              : 'bg-slate-100 hover:bg-amber-500 text-slate-700 hover:text-slate-950 border border-slate-200'
          }`}
          aria-label="Close Project Details"
        >
          <X size={18} />
        </button>

        {/* Modal Hero Banner */}
        <div className="relative h-64 md:h-80 overflow-hidden">
          <img 
            src={project.image} 
            alt={project.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
          
          <div className="absolute bottom-6 left-6 right-6">
            <span className="px-3 py-1 bg-amber-500 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-full">
              {project.category}
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold font-display mt-2 text-white">
              {project.title}
            </h2>
          </div>
        </div>

        {/* Modal Info Details */}
        <div className="p-6 md:p-8 space-y-6">
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-xl ${
            isDark 
              ? 'bg-slate-800/50 border-slate-700/50' 
              : 'bg-slate-50 border-slate-205'
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

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-bold font-display ${isDark ? 'text-amber-400' : 'text-amber-800'}`}>Project Overview</h3>
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                isDark ? 'bg-slate-850 border-slate-700' : 'bg-white border-slate-200'
              }`}>
                {project.status === 'Completed' ? (
                  <>
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    <span className="text-emerald-600">Completed Works</span>
                  </>
                ) : (
                  <>
                    <Clock size={14} className="text-amber-500" />
                    <span className="text-amber-700">Active / Ongoing</span>
                  </>
                )}
              </div>
            </div>
            
            <p className={`leading-relaxed text-sm md:text-base ${isDark ? 'text-gray-300' : 'text-slate-650'}`}>
              {project.description}
            </p>
          </div>

          {/* Interactive Before/After Component */}
          {project.beforeImage && (
            <div className="space-y-3">
              <h4 className={`text-base font-bold font-display ${isDark ? 'text-amber-400' : 'text-amber-800'}`}>
                Site Transformation Comparison
              </h4>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                Drag the center handle or tap to compare the raw site environment with the modern built infrastructure.
              </p>

              {project.afterImage ? (
                /* Interactive Draggable Split Slider */
                <div 
                  className={`relative h-64 md:h-80 w-full rounded-xl overflow-hidden cursor-ew-resize select-none border ${
                    isDark ? 'border-amber-500/10' : 'border-slate-205'
                  }`}
                  onMouseMove={handleMouseMove}
                  onTouchMove={handleTouchMove}
                  onMouseDown={() => setIsDragging(true)}
                  onTouchStart={() => setIsDragging(true)}
                  onMouseUp={() => setIsDragging(false)}
                  onTouchEnd={() => setIsDragging(false)}
                  onMouseLeave={() => setIsDragging(false)}
                >
                  {/* Before Image (Revealed Layer) */}
                  <img 
                    src={project.beforeImage} 
                    alt="Before transformation" 
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 bg-black/60 text-white font-mono text-xs px-2 py-1 rounded">
                    Site State (Before)
                  </div>

                  {/* After Image (Slide Cover Layer) */}
                  <div 
                    className="absolute inset-y-0 right-0 overflow-hidden" 
                    style={{ left: `${sliderPosition}%` }}
                  >
                    <img 
                      src={project.afterImage} 
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
                    <div className="absolute top-2 right-2 bg-amber-500 text-slate-950 font-mono font-bold text-xs px-2 py-1 rounded">
                      Tasha Built (After)
                    </div>
                  </div>

                  {/* Slit Slider Handle bar */}
                  <div 
                    className="absolute inset-y-0 w-1 bg-amber-500 cursor-ew-resize flex items-center justify-center"
                    style={{ left: `${sliderPosition}%` }}
                  >
                    <div className="w-8 h-8 rounded-full bg-amber-500 border-2 border-slate-900 text-slate-950 flex items-center justify-center font-bold text-lg shadow-lg">
                      ↔
                    </div>
                  </div>
                </div>
              ) : (
                /* Side by Side Backup */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`relative rounded-xl overflow-hidden border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                    <img 
                      src={project.beforeImage} 
                      alt="Raw site stage" 
                      className="w-full h-48 object-cover" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/70 text-gray-300 text-xs px-2 py-0.5 rounded">
                      Raw Site Stage
                    </div>
                  </div>
                  <div className={`relative rounded-xl overflow-hidden border ${isDark ? 'border-amber-500/20' : 'border-amber-500/40'}`}>
                    <img 
                      src={project.image} 
                      alt="Completed structure" 
                      className="w-full h-48 object-cover" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-2 left-2 bg-amber-500 text-slate-950 text-xs font-bold px-2 py-0.5 rounded">
                      Completed Framework
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className={`flex justify-end pt-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-150'}`}>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 hover:border-amber-400 font-bold rounded-lg transition-colors duration-200 cursor-pointer"
            >
              Back to Gallery
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
