import React from 'react';
import { HelpRequest } from '../types';
import { Button } from './Button';
import { translations } from '../translations';

interface HelpCardProps {
  request: HelpRequest;
  onViewCode: (request: HelpRequest) => void;
  lang: 'ko' | 'en';
}

export const HelpCard: React.FC<HelpCardProps> = ({ request, onViewCode, lang }) => {
  const t = translations[lang].help;
  
  return (
    <div className="group bg-dark-card rounded-xl border border-red-900/30 overflow-hidden hover:border-red-500/50 hover:shadow-2xl hover:shadow-red-900/20 transition-all duration-300 flex flex-col h-full">
      
      {/* Thumbnail with SOS Badge */}
      <div className="relative aspect-video overflow-hidden bg-slate-800 border-b border-slate-700/50">
        <img 
          src={request.thumbnailUrl} 
          alt={request.appName} 
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute top-2 left-2">
           <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-lg animate-pulse">
             SOS
           </div>
        </div>
        <div className="absolute bottom-3 left-4 right-4">
           <h3 className="text-lg font-bold text-white mb-0.5 shadow-sm">{request.appName}</h3>
           <p className="text-xs text-slate-300 flex items-center gap-1">
             <span className="w-2 h-2 rounded-full bg-red-500"></span>
             {request.author}
           </p>
        </div>
      </div>

      {/* Problem Description Area */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">Help Needed</h4>
          <p className="text-sm text-slate-300 line-clamp-3 leading-relaxed bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
            {request.description}
          </p>
        </div>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-1 mb-4">
          {request.tags.slice(0, 3).map((tag, idx) => (
             <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-700/50 text-slate-400 text-[10px] border border-slate-600">
               {tag}
             </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-auto pt-4 border-t border-slate-700/50 grid grid-cols-2 gap-2">
          {request.sourceUrl && (
            <a 
              href={request.sourceUrl} 
              target="_blank" 
              rel="noreferrer"
              className="col-span-1"
            >
              <Button variant="secondary" className="w-full text-xs h-9">
                {t.downloadSource}
              </Button>
            </a>
          )}
          {request.codeSnippet && (
            <Button 
              variant="primary" 
              className={`text-xs h-9 ${!request.sourceUrl ? 'col-span-2' : ''}`}
              onClick={() => onViewCode(request)}
            >
              {t.viewCode}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};