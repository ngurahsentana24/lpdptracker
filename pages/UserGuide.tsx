
import React from 'react';
import { 
  BookOpen, 
  FileDown, 
  LayoutDashboard, 
  PlusCircle, 
  ListChecks, 
  History, 
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { exportManualToPDF } from '../services/manualExport';

const UserGuide: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header Banner */}
      <div className="bg-lpdp-blue p-10 md:p-16 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden border border-white/5">
        {/* Decorative Blue Shapes behind content */}
        <div className="absolute top-[-10%] right-[-5%] w-80 h-80 bg-blue-600/20 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-64 h-64 bg-blue-400/10 rounded-full blur-[60px] pointer-events-none"></div>
        
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <BookOpen size={220} className="text-blue-200" />
        </div>

        <div className="relative z-10">
          <div className="relative inline-block mb-6">
            {/* Decorative shape directly behind the title text */}
            <div className="absolute -left-6 -top-4 w-20 h-20 bg-blue-500/30 rounded-full blur-2xl -z-10"></div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none relative">
              Application Guide
            </h1>
          </div>

          <p className="text-white text-lg font-medium opacity-100 max-w-xl leading-relaxed">
            A comprehensive manual for managing, visualizing, and reporting your service milestones. Designed to streamline your scholarship accountability.
          </p>
          
          <div className="mt-10 flex flex-wrap gap-4">
            <Link 
              to="/"
              className="flex items-center space-x-3 bg-lpdp-gold text-lpdp-blue px-8 py-4 rounded-2xl font-black shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 transition-all group border-2 border-transparent"
            >
              <span>Enter Platform</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <button 
              onClick={exportManualToPDF}
              className="flex items-center space-x-3 bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-black shadow-lg hover:shadow-xl hover:bg-white/20 transition-all group border border-white/20"
            >
              <FileDown size={20} className="group-hover:animate-bounce" />
              <span>Download Manual (PDF)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <GuideSection 
          icon={LayoutDashboard} 
          title="Impact Dashboard"
          description="Your real-time visual analytics hub. Track beneficiary reach, sectoral distribution, and service velocity through automated charts and KPI cards."
        />
        <GuideSection 
          icon={PlusCircle} 
          title="Milestone Logging"
          description="Document your service activities. 'Input Ngurah' provides instant verification, while 'Contributor' entries allow third-party submissions to your registry."
        />
        <GuideSection 
          icon={ListChecks} 
          title="Registry Management"
          description="Centralized control of all logged data. Audit, verify, or remove entries through the waiting list using your secure passkey to ensure data fidelity."
        />
        <GuideSection 
          icon={History} 
          title="Visual Storytelling"
          description="Experience your journey chronologically via the Timeline or explore documentation through the high-resolution Gallery grid."
        />
      </div>
    </div>
  );
};

const GuideSection = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="bg-white p-8 md:p-10 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 group">
    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 text-lpdp-blue group-hover:bg-lpdp-blue group-hover:text-white transition-colors border border-slate-200 group-hover:border-lpdp-blue shadow-sm">
      <Icon size={28} />
    </div>
    <h3 className="text-xl font-black text-slate-900 mb-4">{title}</h3>
    <p className="text-slate-600 text-sm leading-relaxed font-semibold">{description}</p>
  </div>
);

export default UserGuide;
