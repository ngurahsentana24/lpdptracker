
import React from 'react';
import { Activity } from '../types';
import { Calendar, MapPin, ChevronRight, History } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TimelineProps {
  activities: Activity[];
}

const Timeline: React.FC<TimelineProps> = ({ activities }) => {
  const sortedActivities = [...activities].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <History size={64} className="text-slate-300 mb-4" />
        <h3 className="text-xl font-bold text-slate-700">Timeline is Empty</h3>
        <p className="text-slate-500">Your service journey will appear here as you log activities.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-slate-900">Journey Timeline</h2>
        <p className="text-slate-500 mt-2">Chronological record of your 2N+1 community service</p>
      </div>

      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-lpdp-blue via-lpdp-gold to-slate-300 transform md:-translate-x-1/2"></div>

        <div className="space-y-16">
          {sortedActivities.map((act, index) => {
            const isLeft = index % 2 === 0;
            return (
              <div key={act.id} className={`relative flex items-center ${isLeft ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
                {/* Timeline Dot */}
                <div className="absolute left-4 md:left-1/2 w-8 h-8 bg-white border-4 border-lpdp-blue rounded-full z-10 transform -translate-x-1/2 shadow-lg flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-lpdp-blue rounded-full"></div>
                </div>

                {/* Content Card */}
                <div className={`ml-12 md:ml-0 md:w-1/2 ${isLeft ? 'md:pr-12' : 'md:pl-12'}`}>
                  <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 hover:shadow-xl transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black px-3 py-1 bg-lpdp-blue text-white rounded-full uppercase tracking-wider">
                            {act.category}
                        </span>
                        <span className="text-xs font-bold text-slate-500 flex items-center">
                            <Calendar size={12} className="mr-1 text-lpdp-blue" />
                            {new Date(act.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                    </div>

                    {act.photos.length > 0 && (
                        <div className="mb-4 overflow-hidden rounded-xl h-40 shadow-inner">
                            <img src={act.photos[0]} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                    )}

                    <h3 className="text-xl font-black text-slate-900 mb-2">{act.title}</h3>
                    <div className="flex items-center text-sm font-bold text-slate-600 mb-4">
                        <MapPin size={14} className="mr-1 text-lpdp-gold" />
                        {act.location}
                    </div>
                    
                    <p className="text-slate-600 text-sm line-clamp-2 mb-4 leading-relaxed font-medium">
                        {act.shortDescription || act.detailedNarrative}
                    </p>

                    <Link 
                        to={`/activity/${act.id}`}
                        className="flex items-center text-lpdp-blue font-black text-sm hover:translate-x-1 transition-transform"
                    >
                        <span>See Detailed Impact</span>
                        <ChevronRight size={16} className="ml-1" />
                    </Link>
                  </div>
                </div>

                {/* Spacer for the other side */}
                <div className="hidden md:block md:w-1/2"></div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-20 text-center">
        <div className="inline-flex items-center px-4 py-2 bg-lpdp-blue text-lpdp-gold rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
            Service Commenced: {new Date(sortedActivities[sortedActivities.length - 1]?.date).getFullYear() || 'N/A'}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
