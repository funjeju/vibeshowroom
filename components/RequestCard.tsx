import React from 'react';
import { AppRequest, RequestStatus } from '../types';
import { Button } from './Button';
import { statusLabels } from '../translations';

interface RequestCardProps {
  request: AppRequest;
  onVote: (id: string) => void;
  isVoted: boolean;
  lang: 'ko' | 'en';
}

export const RequestCard: React.FC<RequestCardProps> = ({ request, onVote, isVoted, lang }) => {
  const statusColor = {
    [RequestStatus.PENDING]: 'bg-slate-700 text-slate-300',
    [RequestStatus.IN_PROGRESS]: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50',
    [RequestStatus.COMPLETED]: 'bg-green-500/20 text-green-500 border-green-500/50',
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-all flex flex-col md:flex-row gap-4 items-start md:items-center justify-between group shadow-sm hover:shadow-md">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-xs px-2 py-0.5 rounded border border-transparent ${statusColor[request.status]}`}>
            {statusLabels[lang][request.status]}
          </span>
          <span className="text-xs text-muted-foreground">• {new Date(request.createdAt).toLocaleDateString()} • {request.author}</span>
        </div>
        <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{request.title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{request.description}</p>
      </div>

      <div className="flex items-center gap-4 w-full md:w-auto mt-2 md:mt-0">
        <Button 
          variant={isVoted ? 'primary' : 'secondary'}
          onClick={() => onVote(request.id)}
          className={`flex flex-col items-center justify-center h-16 w-16 md:h-20 md:w-20 rounded-xl gap-1 ${isVoted ? 'ring-2 ring-offset-2 ring-primary ring-offset-background' : ''}`}
        >
           <svg className={`w-6 h-6 ${isVoted ? 'fill-white' : 'fill-none stroke-current'}`} viewBox="0 0 24 24" strokeWidth="2">
             <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
           </svg>
           <span className="text-lg font-bold">{request.votes}</span>
        </Button>
      </div>
    </div>
  );
};