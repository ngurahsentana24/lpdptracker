
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
  Users
} from 'lucide-react';
import { Activity, ActivityCategory, ImpactMetric } from '../types';
import { getActivities } from '../services/storage';

interface LogActivityProps {
  onSave: (activities: Activity[]) => void;
}

const LogActivity: React.FC<LogActivityProps> = ({ onSave }) => {
  const navigate = useNavigate();
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addMetric = () => setMetrics([...metrics, { id: Date.now().toString(), label: '', value: 0, unit: '' }]);
  const updateMetric = (id: string, field: keyof ImpactMetric, value: string | number) => 
    setMetrics(metrics.map(m => m.id === id ? { ...m, [field]: value } : m));
  const removeMetric = (id: string) => setMetrics(metrics.filter(m => m.id !== id));

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => setPhotos(prev => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.location) {
        alert('Please fill in required fields');
        return;
    }

    if (activeTab === 'ngurah') {
      if (password !== 'lpdpngurah') {
        alert('Incorrect passkey for Ngurah. Data not saved.');
        return;
      }
    }

    setIsSubmitting(true);
    const isVerified = activeTab === 'ngurah' && password === 'lpdpngurah';
    
    const newActivity: Activity = {
      ...formData,
      id: Date.now().toString(),
      metrics: metrics.filter(m => m.label.trim() !== ''),
      photos,
      createdAt: Date.now(),
      status: isVerified ? 'accepted' : 'pending'
    };

    onSave([...getActivities(), newActivity]);
    
    setTimeout(() => {
        setIsSubmitting(false);
        if (isVerified) {
          alert('Success! Milestone accepted and published.');
        } else {
          alert('Submission successful! Your contribution has been added to the waiting list for Ngurah to review.');
        }
        navigate('/');
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Add Milestone</h2>
          <p className="text-slate-500">Log your community service impact</p>
        </div>
        <button onClick={() => navigate(-1)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full transition-colors">
          <X size={24} />
        </button>
      </div>

      {/* Mode Selection Tabs */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8 w-fit mx-auto md:mx-0">
        <button 
          onClick={() => setActiveTab('ngurah')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'ngurah' ? 'bg-lpdp-blue text-white shadow-lg' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <User size={16} />
          <span>Input Ngurah</span>
        </button>
        <button 
          onClick={() => setActiveTab('other')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'other' ? 'bg-lpdp-blue text-white shadow-lg' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Users size={16} />
          <span>Input Contributor</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center">
            <span className="w-8 h-8 rounded-full bg-lpdp-blue text-white flex items-center justify-center text-xs mr-3 font-black">1</span>
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Activity Title *</label>
              <input type="text" name="title" required value={formData.title} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-lpdp-blue outline-none" placeholder="e.g., Coastal Conservation" />
            </div>
            <div><label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Activity Date *</label><input type="date" name="date" required value={formData.date} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-lpdp-blue outline-none" /></div>
            <div><label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Location *</label><input type="text" name="location" required value={formData.location} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-lpdp-blue outline-none" placeholder="Venue Location" /></div>
          </div>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center"><span className="w-8 h-8 rounded-full bg-lpdp-blue text-white flex items-center justify-center text-xs mr-3 font-black">2</span>Impact Details</h3>
          <div className="space-y-6">
            <textarea name="detailedNarrative" rows={4} value={formData.detailedNarrative} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-lpdp-blue outline-none" placeholder="Brief summary of the results..." />
            <div className="space-y-4">
              <div className="flex items-center justify-between"><p className="text-xs font-black text-slate-400 uppercase tracking-widest">Measurable Outcomes</p><button type="button" onClick={addMetric} className="text-lpdp-blue text-xs font-bold flex items-center"><Plus size={14} className="mr-1"/> Add Metric</button></div>
              {metrics.map(m => (
                <div key={m.id} className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl">
                  <input placeholder="Label" value={m.label} onChange={e => updateMetric(m.id, 'label', e.target.value)} className="bg-transparent text-sm font-bold border-none outline-none" />
                  <input type="number" value={m.value} onChange={e => updateMetric(m.id, 'value', e.target.value)} className="bg-transparent text-sm font-bold border-none outline-none" />
                  <div className="flex items-center justify-between"><input placeholder="Unit" value={m.unit} onChange={e => updateMetric(m.id, 'unit', e.target.value)} className="bg-transparent text-sm font-bold border-none outline-none w-12" /><button type="button" onClick={() => removeMetric(m.id)} className="text-red-400"><Trash2 size={14}/></button></div>
                </div>
              ))}
            </div>
            
            <div className="space-y-4">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Photos</p>
              <div className="flex flex-wrap gap-3">
                {photos.map((p, i) => (
                  <div key={i} className="w-20 h-20 rounded-xl overflow-hidden border border-slate-200">
                    <img src={p} className="w-full h-full object-cover" />
                  </div>
                ))}
                <label className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center cursor-pointer hover:border-lpdp-blue text-slate-400">
                  <Camera size={24} />
                  <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              </div>
            </div>
          </div>
        </div>

        {activeTab === 'ngurah' && (
          <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100">
            <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center"><span className="w-8 h-8 rounded-full bg-lpdp-blue text-white flex items-center justify-center text-xs mr-3 font-black">3</span>Verification</h3>
            <div className="bg-lpdp-blue/5 p-6 rounded-2xl border border-lpdp-blue/10">
              <label className="block text-xs font-black text-lpdp-blue uppercase tracking-widest mb-3 flex items-center"><Lock size={14} className="mr-2"/> Ngurah Passkey</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-lpdp-blue/20 focus:ring-2 focus:ring-lpdp-blue outline-none" placeholder="Enter security passkey" />
              <p className="text-[10px] text-slate-400 mt-3 italic">Required to verify this entry as Ngurah Sentana's official record.</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end space-x-4 pt-4">
            <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 rounded-xl text-slate-400 font-black uppercase text-xs tracking-widest">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="bg-lpdp-blue text-white px-10 py-3 rounded-2xl font-black shadow-xl shadow-blue-900/20 hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center space-x-2">
                {isSubmitting ? <span>Processing...</span> : <><Save size={20} /> <span>{activeTab === 'ngurah' ? 'Verify & Save' : 'Submit for Review'}</span></>}
            </button>
        </div>
      </form>
    </div>
  );
};

export default LogActivity;
