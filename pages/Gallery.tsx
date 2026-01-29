
import React, { useState } from 'react';
import { Activity } from '../types';
import { ImageIcon, X, Expand, MapPin, Calendar } from 'lucide-react';

interface GalleryProps {
  activities: Activity[];
}

const Gallery: React.FC<GalleryProps> = ({ activities }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<{url: string, title: string, date: string} | null>(null);

  const allPhotos = activities.flatMap(act => 
    act.photos.map(p => ({
      url: p,
      title: act.title,
      date: act.date,
      location: act.location,
      id: act.id
    }))
  ).reverse();

  if (allPhotos.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <ImageIcon size={64} className="text-slate-200 mb-4" />
          <h3 className="text-xl font-bold text-slate-700">No Photos Logged</h3>
          <p className="text-slate-400">Upload documentation in your activity logs to see them here.</p>
        </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Service Gallery</h2>
        <p className="text-slate-500">Visual proof of community engagement and impact</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {allPhotos.map((photo, index) => (
          <div 
            key={index} 
            className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all"
            onClick={() => setSelectedPhoto(photo)}
          >
            <img src={photo.url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <p className="text-white text-xs font-bold line-clamp-1">{photo.title}</p>
                <div className="flex items-center text-[10px] text-white/70 mt-1">
                    <Calendar size={10} className="mr-1" />
                    {new Date(photo.date).toLocaleDateString()}
                </div>
                <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md p-1.5 rounded-lg">
                    <Expand size={14} className="text-white" />
                </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col animate-in fade-in duration-300">
            <div className="p-6 flex justify-between items-center text-white">
                <div>
                    <h3 className="text-lg font-bold">{selectedPhoto.title}</h3>
                    <p className="text-sm text-white/60">{new Date(selectedPhoto.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                </div>
                <button onClick={() => setSelectedPhoto(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <X size={28} />
                </button>
            </div>
            
            <div className="flex-1 flex items-center justify-center p-4">
                <img src={selectedPhoto.url} alt="" className="max-w-full max-h-full object-contain shadow-2xl rounded-lg" />
            </div>
            
            <div className="p-8 text-center text-white/40 text-xs">
                Documentation of 2N+1 Public Service - Ngurah Sentana
            </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
