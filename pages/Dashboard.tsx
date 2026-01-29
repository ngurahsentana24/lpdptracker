
import React, { useMemo } from 'react';
import { Activity, ActivityCategory } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line
} from 'recharts';
import { 
  Users, 
  ClipboardCheck, 
  TrendingUp, 
  MapPin,
  Calendar,
  ArrowRight,
  Award
} from 'lucide-react';

const COLORS = ['#002D56', '#F8B100', '#003d75', '#d49700', '#001a33', '#ffcc33'];

interface DashboardProps {
  activities: Activity[];
}

const StatCard = ({ title, value, icon: Icon, colorClass, isGold }: { title: string, value: string | number, icon: any, colorClass: string, isGold?: boolean }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest mb-2">{title}</p>
      <h3 className="text-3xl font-black text-slate-900 leading-none">{value}</h3>
    </div>
    <div className={`p-3 rounded-xl ${colorClass}`}>
      <Icon size={24} className={isGold ? "text-lpdp-blue" : "text-white"} />
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ activities }) => {
  const stats = useMemo(() => {
    const totalActivities = activities.length;
    
    let totalBeneficiaries = 0;
    activities.forEach(activity => {
      const benMetric = activity.metrics.find(m => m.label.toLowerCase().includes('beneficiaries'));
      if (benMetric) totalBeneficiaries += Number(benMetric.value);
    });

    const catMap: Record<string, number> = {};
    Object.values(ActivityCategory).forEach(cat => catMap[cat] = 0);
    activities.forEach(a => {
      catMap[a.category] = (catMap[a.category] || 0) + 1;
    });
    const categoryData = Object.entries(catMap)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({ name, value }));

    const sortedActivities = [...activities].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const timelineData = sortedActivities.reduce((acc: any[], act) => {
        const month = new Date(act.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        const existing = acc.find(item => item.date === month);
        if (existing) {
            existing.count += 1;
        } else {
            acc.push({ date: month, count: 1 });
        }
        return acc;
    }, []);

    const impactAgg: Record<string, { total: number, unit: string }> = {};
    activities.forEach(act => {
        act.metrics.forEach(m => {
            const key = m.label.toLowerCase();
            if (impactAgg[key]) {
                impactAgg[key].total += Number(m.value);
            } else {
                impactAgg[key] = { total: Number(m.value), unit: m.unit };
            }
        });
    });

    return {
      totalActivities,
      totalBeneficiaries,
      categoryData,
      timelineData,
      impactAgg
    };
  }, [activities]);

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="bg-slate-100 p-8 rounded-full mb-6">
          <ClipboardCheck size={64} className="text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Impact Data Pending</h2>
        <p className="text-slate-500 max-w-md">There are no verified activities in the portfolio yet. Verified milestones from Ngurah Sentana will appear here.</p>
        <a href="#/log" className="mt-6 bg-lpdp-blue text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all">
          Contribute First Log
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Welcome Banner - Blue decorative shapes requested */}
      <div className="bg-lpdp-blue rounded-[2.5rem] p-8 md:p-14 text-white relative overflow-hidden shadow-2xl shadow-blue-900/20 border border-white/5">
        {/* Blue decorative shapes */}
        <div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[300px] h-[300px] bg-blue-400/10 rounded-full blur-[80px] pointer-events-none"></div>
        
        <div className="relative z-10 max-w-2xl">
            <span className="inline-block px-4 py-1.5 bg-blue-800 text-blue-100 text-[10px] font-black uppercase tracking-[0.2em] mb-6 rounded-full border border-blue-700">Official Dashboard</span>
            <h1 className="text-3xl md:text-5xl font-black mb-6 leading-tight tracking-tight">Documenting Social Contribution & Impact</h1>
            <p className="text-blue-50 text-lg font-medium leading-relaxed opacity-90 max-w-xl">
                A transparent record of Ngurah Sentana's community service during the LPDP 2N+1 period. Focused on measurable outcomes and sustainable change.
            </p>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-10">
            <Award size={220} className="text-white" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Verified Milestones" 
          value={stats.totalActivities} 
          icon={ClipboardCheck} 
          colorClass="bg-blue-600" 
        />
        <StatCard 
          title="Lives Impacted" 
          value={stats.totalBeneficiaries.toLocaleString()} 
          icon={Users} 
          colorClass="bg-blue-700" 
        />
        <StatCard 
          title="Project Sites" 
          value={new Set(activities.map(a => a.location)).size} 
          icon={MapPin} 
          colorClass="bg-lpdp-gold" 
          isGold
        />
        <StatCard 
          title="Growth Velocity" 
          value={(stats.totalActivities * 1.5).toFixed(1)} 
          icon={TrendingUp} 
          colorClass="bg-lpdp-gold/80" 
          isGold
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-black text-slate-800 mb-8 border-l-4 border-lpdp-blue pl-4">Sector Distribution</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12, fontWeight: 600, fill: '#002D56' }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={24}>
                  {stats.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-black text-slate-800 mb-8 border-l-4 border-lpdp-gold pl-4">Service Frequency</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.timelineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fontWeight: 500, fill: '#002D56' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fontWeight: 500, fill: '#002D56' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#002D56" 
                    strokeWidth={4} 
                    dot={{ r: 6, fill: '#002D56', strokeWidth: 2, stroke: '#fff' }} 
                    activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center">
            <span className="w-2 h-8 bg-lpdp-gold rounded-full mr-4"></span>
            Cumulative Impact Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(stats.impactAgg).map(([key, data], idx) => (
                <div key={key} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100/50 transition-colors">
                    <p className="text-[10px] font-black text-lpdp-blue uppercase tracking-widest mb-2 opacity-70">{key}</p>
                    <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-black text-lpdp-blue">{data.total.toLocaleString()}</span>
                        <span className="text-sm font-bold text-slate-600">{data.unit}</span>
                    </div>
                </div>
            ))}
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-800">Recent Service Activity</h3>
            <a href="#/timeline" className="text-lpdp-blue text-sm font-black hover:underline flex items-center">
                Full Journey <ArrowRight size={16} className="ml-1" />
            </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activities.slice(-3).reverse().map((act) => (
                <a key={act.id} href={`#/activity/${act.id}`} className="flex flex-col p-4 rounded-2xl bg-slate-50 hover:bg-white border border-transparent hover:border-lpdp-blue/20 hover:shadow-xl hover:shadow-blue-900/5 transition-all group">
                    <div className="aspect-video rounded-xl bg-slate-200 mb-4 overflow-hidden shadow-inner border border-slate-100">
                        {act.photos.length > 0 ? (
                            <img src={act.photos[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <Calendar size={24} />
                            </div>
                        )}
                    </div>
                    <div className="px-1">
                        <span className="text-[10px] font-bold text-lpdp-blue uppercase tracking-widest">{act.category}</span>
                        <h4 className="font-black text-slate-800 mt-1 line-clamp-1 group-hover:text-blue-700 transition-colors">{act.title}</h4>
                        <p className="text-xs text-slate-500 mt-1 flex items-center">
                            <MapPin size={10} className="mr-1 text-lpdp-gold" /> {act.location}
                        </p>
                    </div>
                </a>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
