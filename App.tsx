
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  Image as ImageIcon, 
  Award,
  Calendar,
  ShieldCheck,
  FileDown,
  ListChecks,
  Menu,
  BookOpen,
  Lightbulb
} from 'lucide-react';

import Dashboard from './pages/Dashboard';
import LogActivity from './pages/LogActivity';
import Timeline from './pages/Timeline';
import Gallery from './pages/Gallery';
import ActivityDetail from './pages/ActivityDetail';
import ActivityList from './pages/ActivityList';
import UserGuide from './pages/UserGuide';
import Essay from './pages/Essay';

import { Activity } from './types';
import { getActivities, saveActivities } from './services/storage';
import { exportToPDF } from './services/pdfExport';

const App: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setActivities(getActivities());
  }, []);

  const handleUpdateActivities = (newActivities: Activity[]) => {
    setActivities(newActivities);
    saveActivities(newActivities);
  };

  const acceptedActivities = activities.filter(a => a.status === 'accepted');

  const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
      <Link
        to={to}
        onClick={() => setIsSidebarOpen(false)}
        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
          isActive 
            ? 'bg-lpdp-gold text-lpdp-blue font-bold shadow-md' 
            : 'text-white/80 hover:bg-white/10 hover:text-white'
        }`}
      >
        <Icon size={20} />
        <span className="flex-1">{label}</span>
      </Link>
    );
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex bg-slate-50">
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />
        )}

        <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-lpdp-blue text-white transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 flex flex-col`}>
          <div className="p-6 flex flex-col h-full">
            <div className="flex items-center space-x-3 mb-10">
              <div className="bg-lpdp-gold p-2 rounded-lg">
                <Award className="text-lpdp-blue" size={24} />
              </div>
              <div>
                <h1 className="text-lg font-black leading-tight tracking-tighter">LPDP 2N+1</h1>
                <p className="text-[10px] text-lpdp-gold font-bold uppercase tracking-widest">Ngurah Sentana</p>
              </div>
            </div>

            <nav className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-4 mb-2">Showcase</div>
              <NavItem to="/" icon={LayoutDashboard} label="Impact Dashboard" />
              <NavItem to="/essay" icon={Lightbulb} label="Impact Vision" />
              <NavItem to="/timeline" icon={History} label="Service Timeline" />
              <NavItem to="/gallery" icon={ImageIcon} label="Photo Gallery" />
              
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-4 mb-2 mt-8">Contribution</div>
              <NavItem to="/log" icon={PlusCircle} label="Add Activity" />
              <NavItem to="/activities" icon={ListChecks} label="Waiting List" />
              
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-4 mb-2 mt-8">Resources</div>
              <NavItem to="/guide" icon={BookOpen} label="User Guide" />
              <button 
                onClick={() => exportToPDF(acceptedActivities)}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-all"
              >
                <FileDown size={20} />
                <span className="text-left flex-1">Download Report</span>
              </button>
            </nav>

            <div className="mt-auto pt-6 border-t border-white/10">
               <div className="flex items-center space-x-3 text-white/60 px-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">NS</div>
                  <span className="text-xs font-medium">Ngurah Sentana</span>
               </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="bg-white border-b h-16 flex items-center justify-between px-6 sticky top-0 z-30">
            <button className="md:hidden text-slate-600 p-2 hover:bg-slate-100 rounded-lg" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="flex-1 md:flex-none">
                <h2 className="text-xl font-black text-slate-800 tracking-tight">
                   Official Impact Record
                </h2>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/log" className="bg-lpdp-blue text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-opacity-90 transition-all flex items-center space-x-2 shadow-lg shadow-blue-900/10">
                 <PlusCircle size={16} />
                 <span className="hidden sm:inline">Add Milestone</span>
              </Link>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <Routes>
              <Route path="/" element={<Dashboard activities={acceptedActivities} />} />
              <Route path="/essay" element={<Essay />} />
              <Route path="/log" element={<LogActivity onSave={handleUpdateActivities} />} />
              <Route path="/activities" element={<ActivityList activities={activities} onUpdate={handleUpdateActivities} />} />
              <Route path="/timeline" element={<Timeline activities={acceptedActivities} />} />
              <Route path="/gallery" element={<Gallery activities={acceptedActivities} />} />
              <Route path="/guide" element={<UserGuide />} />
              <Route path="/activity/:id" element={<ActivityDetail activities={activities} onUpdate={handleUpdateActivities} />} />
            </Routes>
          </div>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
