
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Activity } from '../types';
import { 
    Calendar, 
    MapPin, 
    ArrowLeft, 
    Share2, 
    MessageSquare, 
    Target,
    Map,
    Info,
    Trash2
} from 'lucide-react';

interface ActivityDetailProps {
  activities: Activity[];
  onUpdate: (activities: Activity[]) => void;
}

const ActivityDetail: React.FC<ActivityDetailProps> = ({ activities, onUpdate }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const activity = activities.find(a => a.id === id);

  const handleDelete = () => {
    const pass = prompt('Enter Ngurah Verification Passkey to delete:');
    if (pass === 'lpdpngurah') {
        if (window.confirm('Delete this record? This action is permanent.')) {
            onUpdate(activities.filter(a => a.id !== id));
            navigate('/activities');
        }
    } else if (pass !== null) {
        alert('Incorrect passkey. Deletion aborted.');
    }
  };

  if (!activity) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h2 className="text-2xl font-bold text-slate-800">Activity Not Found</h2>
            <button onClick={() => navigate('/')} className="mt-4 text-lpdp-blue font-bold">Return Home</button>
        </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom-6 duration-500 pb-20">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <button 
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-slate-500 hover:text-slate-800 transition-colors group"
        >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-xs uppercase tracking-widest">Back</span>
        </button>
        <div className="flex items-center space-x-3">
            <button 
              onClick={handleDelete}
              className="p-2.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
              title="Delete Activity (Passkey Required)"
            >
              <Trash2 size={20} />
            </button>
            <button className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-500 hover:text-lpdp-blue transition-colors">
                <Share2 size={20} />
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
            {/* Main Info Card */}
            <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-slate-100">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                    <span className="px-4 py-1.5 bg-lpdp-gold/10 text-lpdp-blue text-[10px] font-black rounded-full uppercase tracking-[0.2em] border border-lpdp-gold/20">
                        {activity.category}
                    </span>
                    <span className="text-slate-400 text-xs font-bold flex items-center uppercase tracking-widest">
                        <Calendar size={14} className="mr-2 text-slate-300" />
                        {new Date(activity.date).toLocaleDateString('en-US', { dateStyle: 'long' })}
                    </span>
                    <span className={`px-4 py-1.5 text-[10px] font-black rounded-full uppercase tracking-[0.2em] border ${
                        activity.status === 'accepted' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                        activity.status === 'declined' ? 'bg-red-50 text-red-600 border-red-100' : 
                        'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                        {activity.status}
                    </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight tracking-tight">{activity.title}</h1>
                <div className="flex items-center text-slate-500 mb-10 pb-10 border-b border-slate-50">
                    <MapPin size={20} className="text-lpdp-gold mr-3 shrink-0" />
                    <span className="font-semibold text-lg">{activity.location}</span>
                </div>

                <div className="prose prose-slate max-w-none">
                    <div className="mb-12">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center">
                            <Info className="mr-2 text-lpdp-blue" size={16} />
                            Milestone Summary
                        </h3>
                        <p className="text-xl text-slate-600 leading-relaxed font-medium">
                            {activity.shortDescription || "No executive summary available."}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center">
                            <MessageSquare className="mr-2 text-lpdp-blue" size={16} />
                            Full Report & Narrative
                        </h3>
                        <div className="text-slate-600 leading-loose text-lg whitespace-pre-wrap bg-slate-50 p-8 rounded-3xl border border-slate-100">
                            {activity.detailedNarrative || "This milestone documentation does not yet contain a detailed narrative report."}
                        </div>
                    </div>
                </div>
            </div>

            {/* Photo Section */}
            {activity.photos.length > 0 && (
                <div className="space-y-6">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-2">Verification Documentation</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {activity.photos.map((photo, i) => (
                            <div key={i} className="rounded-3xl overflow-hidden shadow-xl aspect-video bg-slate-100 group">
                                <img src={photo} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>

        {/* Sidebar Analytics */}
        <div className="space-y-8">
            {/* Impact Metrics Card */}
            <div className="bg-lpdp-blue text-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-blue-900/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-lpdp-gold/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                <h3 className="text-xl font-black mb-8 flex items-center relative z-10">
                    <Target className="mr-3 text-lpdp-gold" size={24} />
                    Verified Results
                </h3>
                {activity.metrics.length > 0 ? (
                    <div className="space-y-8 relative z-10">
                        {activity.metrics.map((m, i) => (
                            <div key={i} className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                                <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{m.label}</p>
                                <div className="flex items-baseline space-x-2">
                                    <span className="text-4xl font-black text-lpdp-gold tracking-tight">{m.value.toLocaleString()}</span>
                                    <span className="text-xs font-bold text-white/60 uppercase tracking-widest">{m.unit}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 opacity-30">
                        <Target size={48} className="mx-auto mb-4" />
                        <p className="italic text-sm">Quantifiable data pending</p>
                    </div>
                )}
                
                <div className="mt-12 pt-8 border-t border-white/10 relative z-10">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-lpdp-gold to-yellow-600 flex items-center justify-center text-lpdp-blue font-black text-sm shadow-lg">
                            NS
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-white/40 tracking-widest mb-1">Scholar Record</p>
                            <p className="text-md font-black">Ngurah Sentana</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Strategic Location */}
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center">
                    <Map className="mr-2 text-lpdp-gold" size={16} />
                    Site Focus
                </h3>
                <div className="bg-slate-50 h-48 rounded-[1.5rem] flex items-center justify-center text-slate-400 border border-slate-100 shadow-inner group overflow-hidden">
                    <div className="text-center p-6 relative z-10">
                        <MapPin size={32} className="mx-auto mb-4 text-lpdp-gold opacity-50 group-hover:scale-110 transition-transform" />
                        <p className="text-sm font-black text-slate-800 uppercase tracking-widest leading-relaxed">
                            {activity.location}
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetail;
