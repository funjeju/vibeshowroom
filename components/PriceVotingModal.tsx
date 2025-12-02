import React, { useState } from 'react';
import { Button } from './Button';
import { translations } from '../translations';
import { AppEntry } from '../types';
import { calculateValuation, formatCurrency } from '../utils/valuation';

interface PriceVotingModalProps {
  isOpen: boolean;
  onClose: () => void;
  app: AppEntry | null;
  onVote: (price: number) => void;
  lang: 'ko' | 'en';
}

export const PriceVotingModal: React.FC<PriceVotingModalProps> = ({ isOpen, onClose, app, onVote, lang }) => {
  const [price, setPrice] = useState<string>('5');
  const t = translations[lang].valuation;

  if (!isOpen || !app) return null;

  const currentValuation = calculateValuation(app.priceVotes);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numPrice = parseFloat(price);
    if (!isNaN(numPrice) && numPrice >= 0) {
      onVote(numPrice);
      setPrice('5'); // Reset to default
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card w-full max-w-sm rounded-2xl border border-border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">{t.modalTitle}</h2>
            <p className="text-sm text-muted-foreground">{t.desc}</p>
          </div>

          <div className="bg-secondary/50 rounded-lg p-4 mb-6 text-center border border-border">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{t.currentAvg}</p>
            <div className="text-3xl font-bold text-brand-400">
              {formatCurrency(currentValuation)}<span className="text-sm text-muted-foreground font-normal">/mo</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{app.priceVotes.length} {t.votes}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">{t.priceLabel}</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">$</span>
                <input 
                  type="number" 
                  step="0.5"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-xl pl-8 pr-4 py-3 text-white text-lg font-bold focus:ring-2 focus:ring-brand-500 outline-none"
                  autoFocus
                />
              </div>
              <input 
                type="range" 
                min="0" 
                max="50" 
                step="0.5"
                value={price} 
                onChange={(e) => setPrice(e.target.value)}
                className="w-full mt-3 accent-brand-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>Free</span>
                <span>$25</span>
                <span>$50+</span>
              </div>
            </div>

            <div className="flex gap-3">
               <Button type="button" variant="ghost" onClick={onClose} className="flex-1">{translations[lang].register.cancel}</Button>
               <Button type="submit" className="flex-1">{t.submit}</Button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};