
import React, { useState } from 'react';
import { Activity, ActivityStatus } from '../types';
import { Trash2, MapPin, Calendar, ClipboardList, CheckCircle, Clock, BadgeCheck, XCircle, CheckSquare, ShieldCheck, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { upsertActivity, deleteActivityFromCloud } from '../services/supabase';

interface ActivityListProps {
  activities: Activity[];
  onUpdate: (activities: Activity[]) => void;
}

const ActivityList: React.FC<ActivityListProps> = ({ activities, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<ActivityStatus>('pending');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const handleStatusUpdate = async (id: string, newStatus: ActivityStatus) => {
    const pass = prompt(`Enter Ngurah Verification Passkey to mark as ${newStatus.toUpperCase()}:`);
    if (pass === 'lpdpngurah') {
      setIsProcessing(id);
      try {
        const activity = activities.find(a => a.id === id);
        if (activity) {
          const updatedActivity = { ...activity, status: newStatus };
          await upsertActivity(updatedActivity);
          // Update parent state
          onUpdate(activities.map(a => a.id === id ? updatedActivity : a));
          alert(`Milestone successfully ${newStatus === 'accepted' ? 'Accepted' : 'Declined'} in Supabase.`);
        }
      } catch (err) {
        console.error(err);
        alert("Failed to update status on Cloud Database. Check your connection.");
      } finally {
        setIsProcessing(null);
      }
    } else if (pass !== null) {
      alert('Incorrect Password. Authorization denied.');
    }
  };

  const handleDelete = async (id: string) => {
    const pass = prompt('Enter Ngurah Verification Passkey to PERMANENTLY DELETE this record from Cloud:');
    if (pass === 'lpdpngurah') {
      if (window.confirm('Are you sure? This will remove the record and all associated photos from Supabase forever.')) {
        setIsProcessing(id);
        try {
          await deleteActivityFromCloud(id);
          onUpdate(activities.filter(a => a.id !== id));
          alert('Activity successfully purged from registry.');
        } catch (err) {
          console.error(err);
          alert("Cloud deletion failed.");
        } finally {
          setIsProcessing(null);
        }
      }
    } else if (pass !== null) {
      alert('Incorrect Password.');
    }
  };

  const filtered = activities
    .filter(a => a.status === activeTab)
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Milestone Registry</h2>
          <p className="text-slate-500">Manage cloud-stored milestones and verification status</p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-xl shadow-inner border border-slate-200 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('pending')} 
            className={`flex items-center space-x-2 px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all relative whitespace-nowrap ${activeTab === 'pending' ? 'bg-white shadow-sm text-lpdp-blue' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Clock size={14} />
            <span>Pending</span>
            {activities.filter(a => a.status === 'pending').length > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-white"></span>}
          </button>
          <button 
            onClick={() => setActiveTab('accepted')} 
            className={`flex items-center space-x-2 px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'accepted' ? 'bg-white shadow-sm text-lpdp-blue' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <BadgeCheck size={14} />
            <span>Accepted</span>
          </button>
          <button 
            onClick={() => setActiveTab('declined')} 
            className={`flex items-center space-x-2 px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'declined' ? 'bg-white shadow-sm text-lpdp-blue' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <XCircle size={14} />
            <span>Declined</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-20 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <ClipboardList size={32} className="text-slate-300" />
            </div>
            <p className="font-bold text-slate-400 italic">No {activeTab} records found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Details</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(act => (
                  <tr key={act.id} className={`hover:bg-slate-50/50 transition-colors group ${isProcessing === act.id ? 'opacity-50' : ''}`}>
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex-shrink-0 overflow-hidden shadow-inner border border-slate-200">
                          {act.photos.length > 0 ? <img src={act.photos[0]} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><Calendar size={18} /></div>}
                        </div>
                        <div>
                          <p className="font-black text-slate-800 leading-tight mb-1 text-lg group-hover:text-lpdp-blue transition-colors">{act.title}</p>
                          <p className="text-xs text-slate-500 font-bold flex items-center">
                            <MapPin size={10} className="mr-1 text-lpdp-gold" /> {act.location} • {new Date(act.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center border ${
                        act.status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                        act.status === 'declined' ? 'bg-red-50 text-red-700 border-red-200' : 
                        'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {act.status === 'accepted' ? <BadgeCheck size={12} className="mr-1.5" /> : 
                         act.status === 'declined' ? <XCircle size={12} className="mr-1.5" /> : 
                         <Clock size={12} className="mr-1.5" />}
                        {act.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end space-x-3">
                        <Link to={`/activity/${act.id}`} className="p-2 text-lpdp-blue hover:bg-lpdp-blue/5 rounded-xl transition-all" title="View Detail">
                          <CheckCircle size={20} />
                        </Link>
                        
                        {act.status === 'pending' ? (
                          <>
                            <button 
                              onClick={() => handleStatusUpdate(act.id, 'accepted')} 
                              disabled={!!isProcessing}
                              className="flex items-center space-x-1.5 text-emerald-700 font-black text-[10px] uppercase tracking-widest bg-emerald-50 hover:bg-emerald-600 hover:text-white px-4 py-2 rounded-xl transition-all border border-emerald-200"
                            >
                              {isProcessing === act.id ? <Loader2 size={14} className="animate-spin" /> : <CheckSquare size={14} />}
                              <span>Accept</span>
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(act.id, 'declined')} 
                              disabled={!!isProcessing}
                              className="flex items-center space-x-1.5 text-red-700 font-black text-[10px] uppercase tracking-widest bg-red-50 hover:bg-red-600 hover:text-white px-4 py-2 rounded-xl transition-all border border-red-200"
                            >
                              <XCircle size={14} />
                              <span>Decline</span>
                            </button>
                          </>
                        ) : (
                          <button 
                            onClick={() => handleDelete(act.id)}
                            disabled={!!isProcessing}
                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            title="Delete Permanently from Cloud"
                          >
                            <Trash2 size={20} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityList;
