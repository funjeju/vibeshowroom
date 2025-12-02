import React from 'react';
import { AppEntry } from '../types';
import { calculateValuation, formatCurrency } from '../utils/valuation';

interface AppCardProps {
  app: AppEntry;
  onClick: (app: AppEntry) => void;
  onLike: (e: React.MouseEvent, app: AppEntry) => void; // Now acts as onVote
  isLiked: boolean; // Kept for interface compatibility but not used for red heart anymore
  likeLabel: string; // "Market Value"
}

export const AppCard: React.FC<AppCardProps> = ({ app, onClick, onLike, isLiked, likeLabel }) => {
  // Hot is now defined by number of votes (activity)
  const isHot = app.priceVotes.length >= 10;
  const valuation = calculateValuation(app.priceVotes);

  return (
    <div 
      onClick={() => onClick(app)}
      className="group bg-dark-card rounded-xl border border-slate-700 overflow-hidden hover:border-brand-500/50 hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-300 cursor-pointer flex flex-col h-full"
    >
      <div className="relative aspect-video overflow-hidden bg-slate-800">
        <img 
          src={app.thumbnailUrl} 
          alt={app.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          {isHot && (
             <div className="bg-orange-500/90 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-white shadow-lg flex items-center gap-1 animate-pulse-slow">
               🔥 HOT
             </div>
          )}
          <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-medium text-white border border-white/10">
            {app.category}
          </div>
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-white group-hover:text-brand-400 transition-colors line-clamp-1">
            {app.name}
          </h3>
        </div>
        
        <p className="text-slate-400 text-sm mb-4 line-clamp-2 flex-1">
          {app.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {app.tags.slice(0, 3).map((tag, idx) => (
             <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-700/50 text-slate-300 text-[10px] border border-slate-600">
               #{tag}
             </span>
          ))}
          {app.tags.length > 3 && (
            <span className="px-1.5 py-0.5 text-slate-500 text-[10px]">+ {app.tags.length - 3}</span>
          )}
        </div>
        
        <div className="flex items-center justify-between text-xs text-slate-500 mt-auto pt-4 border-t border-slate-700/50">
          <div className="flex items-center space-x-2">
            <span className="w-5 h-5 rounded-full bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center text-[10px] text-white font-bold">
              {app.author.charAt(0).toUpperCase()}
            </span>
            <span>{app.author}</span>
          </div>
          
          <button 
            onClick={(e) => onLike(e, app)}
            className="flex items-center space-x-1 transition-all z-10 px-2 py-1 rounded-md bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 hover:border-green-500/50"
          >
            <span className="font-bold text-sm">{formatCurrency(valuation)}</span>
            <span className="text-[10px] opacity-70">/mo</span>
          </button>
        </div>
      </div>
    </div>
  );
};