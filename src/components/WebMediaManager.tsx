import React, { useState } from 'react';
import { Edit2, Check } from 'lucide-react';
import { DynamicIcon } from './Icons';

interface WebMediaManagerProps {
  systemInfo: any;
  projects: any[];
  team: any[];
  onUpdateSystemInfo: (data: any) => void;
  onUpdateProjects: (data: any[]) => void;
  onUpdateTeam: (data: any[]) => void;
  isDark?: boolean;
}

export const WebMediaManager: React.FC<WebMediaManagerProps> = ({
  systemInfo,
  projects,
  team,
  onUpdateSystemInfo,
  onUpdateProjects,
  onUpdateTeam,
  isDark = true
}) => {
  const [webMediaSuccess, setWebMediaSuccess] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  
  // Form fields for system level media
  const [heroVideoUrl, setHeroVideoUrl] = useState(systemInfo.heroVideoUrl || '');
  const [heroPosterUrl, setHeroPosterUrl] = useState(systemInfo.heroPosterUrl || '');
  const [ctaBgUrl, setCtaBgUrl] = useState(systemInfo.ctaBgUrl || '');
  const [teamBgUrl, setTeamBgUrl] = useState(systemInfo.teamBgUrl || '');
  const [mapMediaUrl, setMapMediaUrl] = useState(systemInfo.mapMediaUrl || '');
  
  // Catalog states
  const [catalogFilter, setCatalogFilter] = useState<'all' | 'projects' | 'team'>('all');
  const [catalogEditId, setCatalogEditId] = useState<string | null>(null);
  const [catalogEditField, setCatalogEditField] = useState<'image' | 'beforeImage' | 'afterImage'>('image');
  const [catalogEditValue, setCatalogEditValue] = useState<string>('');

  const CloudinaryUploadButton: React.FC<{
    onSuccess: (url: string) => void;
    label?: string;
    resourceType?: 'image' | 'video';
  }> = ({ onSuccess, label = 'Upload to Cloudinary', resourceType = 'image' }) => {
    const cloudName = systemInfo.cloudinaryCloudName;
    const uploadPreset = systemInfo.cloudinaryUploadPreset;

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const cn = cloudName || '';
      const up = uploadPreset || '';

      if (!cn.trim() || !up.trim()) {
        setUploadError("Please set your Cloudinary 'Cloud Name' and 'Upload Preset' first in Admin System Configuration.");
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

        if (!res.ok) throw new Error('Upload failed. Check preset config.');
        
        const data = await res.json();
        onSuccess(data.secure_url);
      } catch (err: any) {
        setUploadError(err.message || 'Upload failed');
      } finally {
        setIsUploading(false);
        e.target.value = '';
      }
    };

    return (
      <div className="relative overflow-hidden group">
        <label className={`text-[10px] uppercase font-bold tracking-wider px-3 py-2 border rounded select-none cursor-pointer flex items-center transition-all group-active:scale-95 ${
          isDark 
            ? 'border-slate-705 hover:border-amber-500 hover:text-amber-500 bg-slate-950 text-gray-400 bg-opacity-70 group-hover:bg-slate-900' 
            : 'border-slate-300 hover:border-amber-600 hover:text-amber-600 bg-slate-100 text-slate-700 hover:bg-slate-200'
        }`}>
          <input 
            type="file" 
            accept={resourceType === 'image' ? 'image/*' : 'video/*'} 
            onChange={handleFileChange} 
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" 
            disabled={isUploading}
          />
          <span className="relative z-0">
            {isUploading ? 'Syncing...' : label}
          </span>
        </label>
      </div>
    );
  };

  const handleSaveSystemParam = (key: string, value: string) => {
    onUpdateSystemInfo({ ...systemInfo, [key]: value });
    setWebMediaSuccess(`Successfully updated ${key} media.`);
    setTimeout(() => setWebMediaSuccess(''), 3000);
  };

  const handleSaveCatalogItem = (id: string, field: 'image' | 'beforeImage' | 'afterImage', value: string) => {
    if (catalogFilter === 'team' || team.some(t => t.id === id)) {
      onUpdateTeam(team.map((t: any) => t.id === id ? { ...t, [field]: value } : t));
    } else {
      onUpdateProjects(projects.map((p: any) => p.id === id ? { ...p, [field]: value } : p));
    }
    setCatalogEditId(null);
    setWebMediaSuccess('Successfully synced dynamic media substitute.');
    setTimeout(() => setWebMediaSuccess(''), 3000);
  };

  return (
        <div className={`space-y-8 animate-fade-in-up ${isDark ? 'text-white' : 'text-slate-800'}`}>
          <div className={`pb-4 border-b space-y-1 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <h4 className={`text-lg font-bold font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>Dynamic Website Media Manager</h4>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-650'}`}>
              Directly rewrite, upload, or substitute video backdrops, CTA hero slots, map outlines, and individual project imagery in real-time.
            </p>
          </div>

          {webMediaSuccess && (
            <div className={`p-3 border rounded-lg text-xs font-sans font-medium flex items-center justify-between ${
              isDark ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}>
              <span>{webMediaSuccess}</span>
              <button type="button" onClick={() => setWebMediaSuccess('')} className="hover:text-amber-500 font-bold text-xs font-sans select-none cursor-pointer">✕</button>
            </div>
          )}
          {uploadError && (
            <div className={`p-3 border rounded-lg text-xs font-sans font-medium flex items-center justify-between ${
              isDark ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <span>{uploadError}</span>
              <button type="button" onClick={() => setUploadError('')} className="hover:text-amber-500 font-bold text-xs font-sans select-none cursor-pointer">✕</button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* COLUMN 1: LAYOUT VIDEO & HERO SLOTS (40%) */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <div className={`p-6 border rounded-2xl space-y-5 transition-colors ${
                isDark ? 'bg-slate-850/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className={`space-y-0.5 border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                  <h5 className={`text-xs uppercase font-extrabold tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>Hero Panel Background Video</h5>
                  <p className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>The primary structural background loop seen on the home portal.</p>
                </div>
                
                <div className="space-y-2">
                  <label className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>WebM or MP4 Vector Source</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      value={heroVideoUrl}
                      onChange={(e) => setHeroVideoUrl(e.target.value)}
                      className={`flex-1 px-3 py-2 text-xs rounded focus:border-amber-500 focus:outline-none border transition-colors ${
                        isDark 
                          ? 'bg-slate-900 border-slate-700 text-white' 
                          : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white'
                      }`}
                    />
                    <CloudinaryUploadButton 
                      resourceType="video"
                      label="Upload Video" 
                      onSuccess={(url) => {
                        setHeroVideoUrl(url); 
                        handleSaveSystemParam('heroVideoUrl', url);
                      }} 
                    />
                    {heroVideoUrl !== systemInfo.heroVideoUrl && (
                      <button type="button" onClick={() => handleSaveSystemParam('heroVideoUrl', heroVideoUrl)} className="px-3 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-500 font-bold text-[10px] uppercase select-none cursor-pointer">Save</button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>Static Poster Fallback</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      value={heroPosterUrl}
                      onChange={(e) => setHeroPosterUrl(e.target.value)}
                      className={`flex-1 px-3 py-2 text-xs rounded focus:border-amber-500 focus:outline-none border transition-colors ${
                        isDark 
                          ? 'bg-slate-900 border-slate-700 text-white' 
                          : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white'
                      }`}
                    />
                    <CloudinaryUploadButton 
                      resourceType="image"
                      label="Img" 
                      onSuccess={(url) => {
                        setHeroPosterUrl(url); 
                        handleSaveSystemParam('heroPosterUrl', url);
                      }} 
                    />
                    {heroPosterUrl !== systemInfo.heroPosterUrl && (
                      <button type="button" onClick={() => handleSaveSystemParam('heroPosterUrl', heroPosterUrl)} className="px-3 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-500 font-bold text-[10px] uppercase select-none cursor-pointer">Save</button>
                    )}
                  </div>
                </div>
              </div>

              <div className={`p-6 border rounded-2xl space-y-5 transition-colors ${
                isDark ? 'bg-slate-850/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className={`space-y-0.5 border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                  <h5 className={`text-xs uppercase font-extrabold tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>Full-Width Segments & CTA Blocks</h5>
                  <p className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>Backdrop layers for specialized sub-portal areas.</p>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className={`text-[10px] font-bold uppercase tracking-widest flex items-center justify-between ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                      Contact/Action Block Backdrop
                      {ctaBgUrl !== systemInfo.ctaBgUrl && (
                        <button type="button" onClick={() => handleSaveSystemParam('ctaBgUrl', ctaBgUrl)} className="text-emerald-500 font-bold hover:underline cursor-pointer">SAVE NOW</button>
                      )}
                    </label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={ctaBgUrl}
                        onChange={(e) => setCtaBgUrl(e.target.value)}
                        className={`flex-1 px-3 py-2 text-xs rounded focus:border-amber-500 focus:outline-none border transition-colors ${
                          isDark 
                            ? 'bg-slate-900 border-slate-700 text-white' 
                            : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white'
                        }`}
                      />
                      <CloudinaryUploadButton resourceType="image" label="Img" onSuccess={(url) => { setCtaBgUrl(url); handleSaveSystemParam('ctaBgUrl', url); }} />
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <label className={`text-[10px] font-bold uppercase tracking-widest flex items-center justify-between ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                      Team Banner Poster (Admin)
                      {teamBgUrl !== systemInfo.teamBgUrl && (
                        <button type="button" onClick={() => handleSaveSystemParam('teamBgUrl', teamBgUrl)} className="text-emerald-500 font-bold hover:underline cursor-pointer">SAVE NOW</button>
                      )}
                    </label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={teamBgUrl}
                        onChange={(e) => setTeamBgUrl(e.target.value)}
                        className={`flex-1 px-3 py-2 text-xs rounded focus:border-amber-500 focus:outline-none border transition-colors ${
                          isDark 
                            ? 'bg-slate-900 border-slate-700 text-white' 
                            : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white'
                        }`}
                      />
                      <CloudinaryUploadButton resourceType="image" label="Img" onSuccess={(url) => { setTeamBgUrl(url); handleSaveSystemParam('teamBgUrl', url); }} />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5 pt-2">
                    <label className={`text-[10px] font-bold uppercase tracking-widest flex items-center justify-between ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                      Contact Map Vector Layout
                      {mapMediaUrl !== systemInfo.mapMediaUrl && (
                         <button type="button" onClick={() => handleSaveSystemParam('mapMediaUrl', mapMediaUrl)} className="text-emerald-500 font-bold hover:underline cursor-pointer">SAVE NOW</button>
                      )}
                    </label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={mapMediaUrl}
                        onChange={(e) => setMapMediaUrl(e.target.value)}
                        className={`flex-1 px-3 py-2 text-xs rounded focus:border-amber-500 focus:outline-none border transition-colors ${
                          isDark 
                            ? 'bg-slate-900 border-slate-700 text-white' 
                            : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white'
                        }`}
                      />
                      <CloudinaryUploadButton resourceType="image" label="Img" onSuccess={(url) => { setMapMediaUrl(url); handleSaveSystemParam('mapMediaUrl', url); }} />
                    </div>
                  </div>
                </div>

                {/* Example live preview of the video */}
                <div className={`h-28 w-full bg-slate-950 rounded-lg overflow-hidden relative shadow-inner group border ${
                  isDark ? 'border-slate-800' : 'border-slate-200'
                }`}>
                  <video 
                    src={heroVideoUrl || undefined} 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover opacity-75 group-hover:opacity-100 transition-opacity" 
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-emerald-500 text-slate-950 text-[9px] font-black uppercase rounded shadow-md animate-pulse animate-duration-1000">
                    Live Broadcast Feed
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 2: INTEGRATED DYNAMIC IMAGE CATALOGUE (60%) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className={`p-6 border rounded-2xl space-y-5 transition-colors ${
                isDark ? 'bg-slate-850/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <h5 className="text-xs uppercase font-extrabold tracking-wider text-amber-500">Dynamic Content Image Catalog</h5>
                    <p className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>Scan, preview, and substitute individual client images, team member profiles, and construction templates directly.</p>
                  </div>

                  <div className={`flex border rounded-lg p-0.5 text-[10px] uppercase font-bold shrink-0 self-start ${
                    isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-100 border-slate-200'
                  }`}>
                    {(['all', 'projects', 'team'] as const).map((filter) => (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => {
                          setCatalogFilter(filter);
                          setCatalogEditId(null);
                        }}
                        className={`px-3 py-1 rounded transition-all cursor-pointer select-none ${
                          catalogFilter === filter 
                            ? 'bg-amber-500 text-slate-950 font-black' 
                            : isDark ? 'text-gray-400 hover:text-white' : 'text-slate-650 hover:text-slate-950 font-medium'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>

                {/* MAIN INLINE ASSET EDITOR (SHOWS ONLY WHEN AN IMAGE IS BEING EDITED IN THE CATALOG) */}
                {catalogEditId && (
                  <div className={`p-4 border rounded-xl space-y-3 animate-fade-in-up ${
                    isDark ? 'bg-slate-900 border-amber-500/40' : 'bg-amber-50/50 border-amber-500/30'
                  }`}>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5 select-none font-display">
                        Substitute Media Link
                      </span>
                      <button 
                        type="button" 
                        onClick={() => setCatalogEditId(null)}
                        className={`text-xs font-bold select-none cursor-pointer ${isDark ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'}`}
                      >
                        ✕ Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      <div className={`md:col-span-1 h-20 rounded-lg overflow-hidden relative flex items-center justify-center border ${
                        isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
                      }`}>
                        {catalogEditValue ? (
                          <img 
                            src={catalogEditValue} 
                            alt="Substitute Preview" 
                            className="w-full h-full object-cover" 
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <span className="text-[9px] text-gray-500 uppercase select-none">No URL value</span>
                        )}
                      </div>

                      <div className="md:col-span-3 space-y-2">
                        <div className="flex justify-between items-center gap-2">
                          <input 
                            type="text" 
                            value={catalogEditValue}
                            onChange={(e) => setCatalogEditValue(e.target.value)}
                            className={`flex-1 px-2 py-1.5 text-xs rounded focus:border-amber-500 focus:outline-none border ${
                              isDark 
                                ? 'bg-slate-850 border-slate-705 text-white' 
                                : 'bg-white border-slate-305 text-slate-900 focus:bg-white'
                            }`}
                            placeholder="Enter absolute image URL..."
                          />
                          <CloudinaryUploadButton 
                            resourceType="image"
                            label="Upload" 
                            onSuccess={(url) => setCatalogEditValue(url)} 
                          />
                        </div>

                        <div className="flex justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setCatalogEditId(null)}
                            className={`px-2.5 py-1 text-[10px] uppercase font-bold rounded select-none cursor-pointer transition-colors ${
                              isDark ? 'bg-slate-800 hover:bg-slate-700 text-gray-300' : 'bg-slate-200 hover:bg-slate-300 text-slate-705'
                            }`}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveCatalogItem(catalogEditId!, catalogEditField as any, catalogEditValue)}
                            className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[10px] uppercase font-bold rounded flex items-center gap-1 select-none cursor-pointer"
                          >
                            <Check size={11} /> Confirm Asset Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* THE COMPLETE MEDIA LISTINGS */}
                <div className="space-y-3.5 max-h-[580px] overflow-y-auto pr-2 custom-scrollbar">
                  {/* Dynamic projects mapper */}
                  {(catalogFilter === 'all' || catalogFilter === 'projects') && projects.map((p) => {
                    // Collect up to three images for each project (Main, Before, After)
                    const assets = [
                      { field: 'image' as const, label: 'Front Display Card', url: p.image },
                      { field: 'beforeImage' as const, label: 'Past Before State', url: p.beforeImage },
                      { field: 'afterImage' as const, label: 'Remodeled After State', url: p.afterImage }
                    ].filter(asset => asset.field === 'image' || asset.url); // Show before/after only if present or being initialized

                    return (
                      <div key={p.id} className={`p-3 rounded-xl space-y-2.5 border transition-colors ${
                        isDark ? 'bg-slate-900/40 border-slate-800/60' : 'bg-slate-50/60 border-slate-200/70 shadow-sm'
                      }`}>
                        <div className="flex items-center justify-between font-sans">
                          <div>
                            <span className="px-1.5 py-0.5 bg-indigo-500/10 text-indigo-500 text-[8px] font-bold uppercase rounded">
                              {p.category}
                            </span>
                            <h6 className={`text-[11px] font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{p.title}</h6>
                          </div>
                          <span className={`text-[9px] uppercase font-bold ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>{p.status}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {assets.map((asset) => (
                            <div key={asset.field} className={`relative group p-2 rounded-lg border flex flex-col justify-between space-y-2 transition-all ${
                              isDark ? 'bg-slate-950 border-slate-850 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                            }`}>
                              <span className={`text-[8px] uppercase font-black tracking-wider block ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>{asset.label}</span>
                              
                              <div className={`h-20 w-full rounded overflow-hidden relative flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`}>
                                {asset.url ? (
                                  <img 
                                    src={asset.url} 
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                                    alt={p.title} 
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <span className={`text-[9px] italic select-none ${isDark ? 'text-gray-600' : 'text-slate-400'}`}>Unassigned</span>
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  setCatalogEditId(p.id);
                                  setCatalogEditField(asset.field);
                                  setCatalogEditValue(asset.url || '');
                                }}
                                className={`w-full py-1 text-center text-[8px] uppercase font-bold rounded flex items-center justify-center gap-1 select-none cursor-pointer transition-colors ${
                                  isDark 
                                    ? 'bg-slate-850 hover:bg-slate-800 text-gray-300 border-slate-750' 
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-250'
                                }`}
                              >
                                <Edit2 size={9} /> Swap image
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}

                  {/* Dynamic team mapper */}
                  {(catalogFilter === 'all' || catalogFilter === 'team') && team.map((t) => (
                    <div key={t.id} className={`p-3 rounded-xl flex items-center justify-between border font-sans transition-colors ${
                      isDark ? 'bg-slate-900/40 border-slate-800/60' : 'bg-slate-50 /50 border-slate-200 shadow-sm'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`h-14 w-14 rounded-full overflow-hidden shrink-0 border flex items-center justify-center ${isDark ? 'border-slate-700 bg-slate-950' : 'border-slate-200 bg-white shadow-sm'}`}>
                          {t.image && (t.image.startsWith('http://') || t.image.startsWith('https://') || t.image.startsWith('data:image/')) ? (
                            <img 
                              src={t.image} 
                              alt={t.name}
                              className="w-full h-full object-cover" 
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <DynamicIcon name={t.image || 'HardHat'} size={24} className="text-amber-500" />
                          )}
                        </div>
                        <div>
                          <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-500 text-[8px] font-bold uppercase rounded font-display">Team Portrait</span>
                          <h6 className={`text-xs font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.name}</h6>
                          <p className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-slate-550'}`}>{t.role}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setCatalogEditId(t.id);
                          setCatalogEditField('image');
                          setCatalogEditValue(t.image);
                        }}
                        className={`px-3 py-1.5 text-[10px] uppercase font-bold rounded flex items-center gap-1.5 cursor-pointer border select-none transition-colors ${
                          isDark 
                            ? 'bg-slate-855 hover:bg-slate-800 text-gray-300 border-slate-750' 
                            : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-250 shadow-sm'
                        }`}
                      >
                        <Edit2 size={10} /> Swap Photo
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
  );
};
