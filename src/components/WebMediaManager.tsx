import React, { useState } from 'react';
import { Edit2, Check } from 'lucide-react';

interface WebMediaManagerProps {
  systemInfo: any;
  projects: any[];
  team: any[];
  onUpdateSystemInfo: (data: any) => void;
  onUpdateProjects: (data: any[]) => void;
  onUpdateTeam: (data: any[]) => void;
}

export const WebMediaManager: React.FC<WebMediaManagerProps> = ({
  systemInfo,
  projects,
  team,
  onUpdateSystemInfo,
  onUpdateProjects,
  onUpdateTeam
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
        <label className="text-[10px] uppercase font-bold tracking-wider px-3 py-2 border border-slate-700 hover:border-amber-500 hover:text-amber-500 rounded bg-slate-950 text-gray-400 select-none cursor-pointer flex items-center transition-all bg-opacity-70 group-hover:bg-slate-900 group-active:scale-95">
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
        <div className="space-y-8 animate-fade-in-up">
          <div className="pb-4 border-b border-slate-800 space-y-1">
            <h4 className="text-lg font-bold font-display text-white">Dynamic Website Media Manager</h4>
            <p className="text-xs text-gray-400">
              Directly rewrite, upload, or substitute video backdrops, CTA hero slots, map outlines, and individual project imagery in real-time.
            </p>
          </div>

          {webMediaSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-300 text-xs font-sans font-medium flex items-center justify-between">
              <span>{webMediaSuccess}</span>
              <button type="button" onClick={() => setWebMediaSuccess('')} className="hover:text-white font-bold text-xs font-sans select-none cursor-pointer">✕</button>
            </div>
          )}
          {uploadError && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs font-sans font-medium flex items-center justify-between">
              <span>{uploadError}</span>
              <button type="button" onClick={() => setUploadError('')} className="hover:text-white font-bold text-xs font-sans select-none cursor-pointer">✕</button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* COLUMN 1: LAYOUT VIDEO & HERO SLOTS (40%) */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <div className="p-6 bg-slate-850/40 border border-slate-800 rounded-2xl space-y-5">
                <div className="space-y-0.5 border-b border-slate-800 pb-3">
                  <h5 className="text-xs uppercase font-extrabold tracking-wider text-white">Hero Panel Background Video</h5>
                  <p className="text-[10px] text-gray-500">The primary structural background loop seen on the home portal.</p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">WebM or MP4 Vector Source</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      value={heroVideoUrl}
                      onChange={(e) => setHeroVideoUrl(e.target.value)}
                      className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 text-xs text-white rounded focus:border-amber-500 focus:outline-none"
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
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Static Poster Fallback</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      value={heroPosterUrl}
                      onChange={(e) => setHeroPosterUrl(e.target.value)}
                      className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 text-xs text-white rounded focus:border-amber-500 focus:outline-none"
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

              <div className="p-6 bg-slate-850/40 border border-slate-800 rounded-2xl space-y-5">
                <div className="space-y-0.5 border-b border-slate-800 pb-3">
                  <h5 className="text-xs uppercase font-extrabold tracking-wider text-white">Full-Width Segments & CTA Blocks</h5>
                  <p className="text-[10px] text-gray-500">Backdrop layers for specialized sub-portal areas.</p>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center justify-between">
                      Contact/Action Block Backdrop
                      {ctaBgUrl !== systemInfo.ctaBgUrl && (
                        <button type="button" onClick={() => handleSaveSystemParam('ctaBgUrl', ctaBgUrl)} className="text-emerald-400 font-bold hover:underline cursor-pointer">SAVE NOW</button>
                      )}
                    </label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={ctaBgUrl}
                        onChange={(e) => setCtaBgUrl(e.target.value)}
                        className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 text-xs text-white rounded focus:border-amber-500 focus:outline-none"
                      />
                      <CloudinaryUploadButton resourceType="image" label="Img" onSuccess={(url) => { setCtaBgUrl(url); handleSaveSystemParam('ctaBgUrl', url); }} />
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center justify-between">
                      Team Banner Poster (Admin)
                      {teamBgUrl !== systemInfo.teamBgUrl && (
                        <button type="button" onClick={() => handleSaveSystemParam('teamBgUrl', teamBgUrl)} className="text-emerald-400 font-bold hover:underline cursor-pointer">SAVE NOW</button>
                      )}
                    </label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={teamBgUrl}
                        onChange={(e) => setTeamBgUrl(e.target.value)}
                        className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 text-xs text-white rounded focus:border-amber-500 focus:outline-none"
                      />
                      <CloudinaryUploadButton resourceType="image" label="Img" onSuccess={(url) => { setTeamBgUrl(url); handleSaveSystemParam('teamBgUrl', url); }} />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5 pt-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center justify-between">
                      Contact Map Vector Layout
                      {mapMediaUrl !== systemInfo.mapMediaUrl && (
                         <button type="button" onClick={() => handleSaveSystemParam('mapMediaUrl', mapMediaUrl)} className="text-emerald-400 font-bold hover:underline cursor-pointer">SAVE NOW</button>
                      )}
                    </label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={mapMediaUrl}
                        onChange={(e) => setMapMediaUrl(e.target.value)}
                        className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 text-xs text-white rounded focus:border-amber-500 focus:outline-none"
                      />
                      <CloudinaryUploadButton resourceType="image" label="Img" onSuccess={(url) => { setMapMediaUrl(url); handleSaveSystemParam('mapMediaUrl', url); }} />
                    </div>
                  </div>
                </div>

                {/* Example live preview of the video */}
                <div className="h-28 w-full bg-slate-950 rounded-lg overflow-hidden relative border border-slate-800 shadow-inner group">
                  <video 
                    src={heroVideoUrl} 
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
              <div className="p-6 bg-slate-850/40 border border-slate-800 rounded-2xl space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <h5 className="text-xs uppercase font-extrabold tracking-wider text-amber-500">Dynamic Content Image Catalog</h5>
                    <p className="text-[10px] text-gray-455">Scan, preview, and substitute individual client images, team member profiles, and construction templates directly.</p>
                  </div>

                  <div className="flex bg-slate-900 border border-slate-700 rounded-lg p-0.5 text-[10px] uppercase font-bold shrink-0 self-start">
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
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>

                {/* MAIN INLINE ASSET EDITOR (SHOWS ONLY WHEN AN IMAGE IS BEING EDITED IN THE CATALOG) */}
                {catalogEditId && (
                  <div className="p-4 bg-slate-900 border border-amber-500/40 rounded-xl space-y-3 animate-fade-in-up">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 select-none font-display">
                        Substitute Media Link
                      </span>
                      <button 
                        type="button" 
                        onClick={() => setCatalogEditId(null)}
                        className="text-gray-400 hover:text-white text-xs font-bold select-none cursor-pointer"
                      >
                        ✕ Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      <div className="md:col-span-1 h-20 bg-slate-950 rounded-lg overflow-hidden border border-slate-800 relative flex items-center justify-center">
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
                            className="flex-1 px-2 py-1.5 bg-slate-850 border border-slate-700 text-xs text-white rounded focus:border-amber-500 focus:outline-none"
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
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-gray-300 text-[10px] uppercase font-bold rounded select-none cursor-pointer"
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
                      <div key={p.id} className="p-3 bg-slate-900/40 rounded-xl space-y-2.5 border border-slate-800/60">
                        <div className="flex items-center justify-between font-sans">
                          <div>
                            <span className="px-1.5 py-0.5 bg-indigo-500/10 text-indigo-400 text-[8px] font-bold uppercase rounded">
                              {p.category}
                            </span>
                            <h6 className="text-[11px] font-bold text-white mt-1">{p.title}</h6>
                          </div>
                          <span className="text-[9px] text-gray-400 uppercase font-bold">{p.status}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {assets.map((asset) => (
                            <div key={asset.field} className="relative group bg-slate-950 p-2 rounded-lg border border-slate-850 flex flex-col justify-between space-y-2 hover:border-slate-700 transition-all">
                              <span className="text-[8px] text-gray-400 uppercase font-black tracking-wider block">{asset.label}</span>
                              
                              <div className="h-20 w-full bg-slate-900 rounded overflow-hidden relative flex items-center justify-center">
                                {asset.url ? (
                                  <img 
                                    src={asset.url} 
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                                    alt={p.title} 
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <span className="text-[9px] text-gray-600 italic select-none">Unassigned</span>
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  setCatalogEditId(p.id);
                                  setCatalogEditField(asset.field);
                                  setCatalogEditValue(asset.url || '');
                                }}
                                className="w-full py-1 text-center bg-slate-800 hover:bg-slate-700 text-gray-300 text-[8px] uppercase font-bold rounded flex items-center justify-center gap-1 select-none cursor-pointer"
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
                    <div key={t.id} className="p-3 bg-slate-900/40 rounded-xl flex items-center justify-between border border-slate-800/60 font-sans">
                      <div className="flex items-center gap-3">
                        <div className="h-14 w-14 rounded-full overflow-hidden shrink-0 border border-slate-700 bg-slate-950">
                          <img 
                            src={t.image} 
                            alt={t.name}
                            className="w-full h-full object-cover" 
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-500 text-[8px] font-bold uppercase rounded font-display">Team Portrait</span>
                          <h6 className="text-xs font-bold text-white mt-1">{t.name}</h6>
                          <p className="text-[10px] text-gray-400">{t.role}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setCatalogEditId(t.id);
                          setCatalogEditField('image');
                          setCatalogEditValue(t.image);
                        }}
                        className="px-3 py-1.5 bg-slate-850 hover:bg-slate-800 text-gray-300 text-[10px] uppercase font-bold rounded flex items-center gap-1.5 cursor-pointer border border-slate-750 select-none"
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
