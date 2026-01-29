
import React, { useState } from 'react';
import { Activity, ActivityStatus } from '../types';
import { Trash2, MapPin, Calendar, ClipboardList, CheckCircle, Clock, BadgeCheck, XCircle, CheckSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ActivityListProps {
  activities: Activity[];
  onUpdate: (activities: Activity[]) => void;
}

const ActivityList: React.FC<ActivityListProps> = ({ activities, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<ActivityStatus>('pending');

  const handleDecline = (id: string) => {
    const pass = prompt('Enter Ngurah Verification Passkey to DECLINE this record:');
    if (pass === 'lpdpngurah') {
      onUpdate(activities.map(a => a.id === id ? { ...a, status: 'declined' } : a));
      alert('Activity marked as Declined.');
    } else if (pass !== null) {
      alert('Incorrect Password.');
    }
  };

  const handleAccept = (id: string) => {
    const pass = prompt('Enter Ngurah Verification Passkey to ACCEPT this milestone:');
    if (pass === 'lpdpngurah') {
      onUpdate(activities.map(a => a.id === id ? { ...a, status: 'accepted' } : a));
      alert('Success! Milestone Accepted and Published to Dashboard.');
    } else if (pass !== null) {
      alert('Incorrect Passkey. Access denied.');
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
          <p className="text-slate-500">Official registry management and status tracking</p>
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
            <p className="font-bold text-slate-400 italic">No {activeTab} logs found at this time.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Milestone Details</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">Registry Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(act => (
                  <tr key={act.id} className="hover:bg-slate-50/50 transition-colors group">
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
                      <div className="flex items-center space-x-2">
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
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end space-x-3">
                        <Link to={`/activity/${act.id}`} className="p-2 text-lpdp-blue hover:bg-lpdp-blue/5 rounded-xl transition-all border border-transparent hover:border-lpdp-blue/20" title="View Detail">
                          <CheckCircle size={20} />
                        </Link>
                        
                        {act.status === 'pending' ? (
                          <>
                            <button 
                              onClick={() => handleAccept(act.id)} 
                              className="flex items-center space-x-1.5 text-emerald-700 font-black text-[10px] uppercase tracking-widest bg-emerald-50 hover:bg-emerald-600 hover:text-white px-4 py-2 rounded-xl transition-all shadow-sm border border-emerald-200 hover:border-emerald-600 active:scale-95"
                            >
                              <CheckSquare size={14} />
                              <span>Accept</span>
                            </button>
                            <button 
                              onClick={() => handleDecline(act.id)} 
                              className="flex items-center space-x-1.5 text-red-700 font-black text-[10px] uppercase tracking-widest bg-red-50 hover:bg-red-600 hover:text-white px-4 py-2 rounded-xl transition-all shadow-sm border border-red-200 hover:border-red-600 active:scale-95"
                              title="Decline Milestone"
                            >
                              <Trash2 size={14} />
                              <span>Decline</span>
                            </button>
                          </>
                        ) : (
                          <div className="flex items-center space-x-2 text-slate-300">
                             <span className="text-[10px] font-black uppercase tracking-widest italic opacity-50">Already {act.status}</span>
                             <ShieldCheck size={14} />
                          </div>
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

const ShieldCheck = ({ size, className }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    <path d="m9 12 2 2 4-4"></path>
  </svg>
);

export default ActivityList;
