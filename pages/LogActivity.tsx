
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Plus, 
  Trash2, 
  Save, 
  Camera,
  Lock,
  User,
  Users,
  Loader2,
  MapPin,
  Calendar,
  Type,
  FileText
} from 'lucide-react';
import { Activity, ActivityCategory, ImpactMetric } from '../types';
import { upsertActivity, uploadPhoto, getSupabaseConfig } from '../services/supabase';

interface LogActivityProps {
  onSave: (activities: Activity[]) => void;
}

const LogActivity: React.FC<LogActivityProps> = ({ onSave }) => {
  const navigate = useNavigate();
  const config = getSupabaseConfig();
  const [activeTab, setActiveTab] = useState<'ngurah' | 'other'>('ngurah');
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    category: ActivityCategory.SOCIAL,
    shortDescription: '',
    detailedNarrative: ''
  });
  const [password, setPassword] = useState('');
  const [metrics, setMetrics] = useState<ImpactMetric[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addMetric = () => setMetrics([...metrics, { id: Date.now().toString(), label: '', value: 0, unit: '' }]);
  const updateMetric = (id: string, field: keyof ImpactMetric, value: string | number) => 
    setMetrics(metrics.map(m => m.id === id ? { ...m, [field]: value } : m));
  const removeMetric = (id: string) => setMetrics(metrics.filter(m => m.id !== id));

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    try {
        const uploadPromises = Array.from(files).map(file => uploadPhoto(file));
        const urls = await Promise.all(uploadPromises);
        setPhotos(prev => [...prev, ...urls]);
    } catch (e: any) {
        console.error("Upload process error:", e);
        const msg = e.message || "Unknown error";
        alert(`Photo upload failed: ${msg}. \n\nEnsure you have created a PUBLIC bucket named 'milestone-photos' in Supabase.`);
    } finally {
        setIsUploading(false);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.location) {
        alert('Please fill in required fields');
        return;
    }

    if (activeTab === 'ngurah' && password !== 'lpdpngurah') {
        alert('Incorrect passkey for Ngurah. Data not saved.');
        return;
    }

    setIsSubmitting(true);
    const isVerified = activeTab === 'ngurah' && password === 'lpdpngurah';
    
    const newActivity: Activity = {
      ...formData,
      id: crypto.randomUUID(),
      metrics: metrics.filter(m => m.label.trim() !== ''),
      photos,
      createdAt: Date.now(),
      status: isVerified ? 'accepted' : 'pending'
    };

    try {
        await upsertActivity(newActivity);
        alert(isVerified ? "Milestone verified and published!" : "Entry submitted for review.");
        navigate('/');
    } catch (err: any) {
        console.error("Submit Error:", err);
        alert(`Failed to save: ${err.message || "Database connection error"}`);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Log New Milestone</h2>
        <p className="text-slate-500">Document your community service and impact metrics</p>
      </div>

      <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8 w-fit shadow-inner">
        <button 
          type="button"
          onClick={() => setActiveTab('ngurah')}
          className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'ngurah' ? 'bg-lpdp-blue text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <User size={16} />
          <span>Scholar Entry</span>
        </button>
        <button 
          type="button"
          onClick={() => setActiveTab('other')}
          className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'other' ? 'bg-lpdp-gold text-lpdp-blue shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Users size={16} />
          <span>Contributor</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center">
                <Type size={12} className="mr-2" /> Milestone Title *
              </label>
              <input 
                name="title" 
                value={formData.title} 
                onChange={handleInputChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-lpdp-blue/20 outline-none"
                placeholder="Ex: Literacy Workshop"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center">
                <Calendar size={12} className="mr-2" /> Date *
              </label>
              <input 
                type="date"
                name="date" 
                value={formData.date} 
                onChange={handleInputChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-lpdp-blue/20 outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center">
                <MapPin size={12} className="mr-2" /> Location *
              </label>
              <input 
                name="location" 
                value={formData.location} 
                onChange={handleInputChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-lpdp-blue/20 outline-none"
                placeholder="City/Village Name"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sector Category</label>
              <select 
                name="category" 
                value={formData.category} 
                onChange={handleInputChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-lpdp-blue/20 outline-none"
              >
                {Object.values(ActivityCategory).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center">
              <FileText size={12} className="mr-2" /> Executive Summary
            </label>
            <textarea 
              name="shortDescription" 
              value={formData.shortDescription} 
              onChange={handleInputChange}
              rows={2}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-lpdp-blue/20 outline-none"
              placeholder="Brief summary for the timeline"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Detailed Narrative Report</label>
            <textarea 
              name="detailedNarrative" 
              value={formData.detailedNarrative} 
              onChange={handleInputChange}
              rows={5}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-lpdp-blue/20 outline-none"
              placeholder="Full description of impact..."
            />
          </div>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900 flex items-center">
              <Users className="mr-3 text-lpdp-gold" size={20} />
              Impact Metrics
            </h3>
            <button 
              type="button" 
              onClick={addMetric}
              className="text-lpdp-blue font-black text-xs uppercase bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 hover:bg-blue-100 transition-all"
            >
              + Add Metric
            </button>
          </div>
          
          <div className="space-y-4">
            {metrics.map((metric) => (
              <div key={metric.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="md:col-span-2">
                  <input 
                    placeholder="Metric Label" 
                    value={metric.label}
                    onChange={(e) => updateMetric(metric.id, 'label', e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold"
                  />
                </div>
                <div>
                  <input 
                    type="number" 
                    placeholder="Value" 
                    value={metric.value}
                    onChange={(e) => updateMetric(metric.id, 'value', Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    placeholder="Unit" 
                    value={metric.unit}
                    onChange={(e) => updateMetric(metric.id, 'unit', e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold"
                  />
                  <button type="button" onClick={() => removeMetric(metric.id)} className="text-red-400 hover:text-red-600">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center">
              <Camera className="mr-3 text-lpdp-gold" size={20} />
              Documentation
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {photos.map((url, idx) => (
                    <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden shadow-md group">
                        <img src={url} className="w-full h-full object-cover" />
                        <button 
                            type="button" 
                            onClick={() => removePhoto(idx)}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}
                <label className={`aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-lpdp-blue hover:bg-slate-50 transition-all ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                    {isUploading ? <Loader2 className="animate-spin text-lpdp-blue" /> : <Plus className="text-slate-300" />}
                    <span className="text-[10px] font-black uppercase mt-2 text-slate-400">Upload</span>
                    <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
            </div>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
           {activeTab === 'ngurah' && (
              <div className="mb-8 space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 flex items-center">
                    <Lock size={12} className="mr-2" /> Verification Passkey
                 </label>
                 <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-lpdp-blue/5 border border-lpdp-blue/10 rounded-xl px-4 py-3 font-bold"
                    placeholder="Enter passkey to verify entry"
                 />
              </div>
           )}
           
           <div className="flex items-center space-x-4">
                <button 
                    type="submit" 
                    disabled={isSubmitting || isUploading}
                    className="flex-1 bg-lpdp-blue text-white py-4 rounded-2xl font-black shadow-xl flex items-center justify-center space-x-3 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                    <span>{activeTab === 'ngurah' ? 'Verify & Publish' : 'Submit for Review'}</span>
                </button>
                <button 
                    type="button" 
                    onClick={() => navigate(-1)}
                    className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all"
                >
                    Cancel
                </button>
           </div>
        </div>
      </form>
    </div>
  );
};

export default LogActivity;
