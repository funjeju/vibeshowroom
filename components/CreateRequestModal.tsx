import React, { useState } from 'react';
import { Button } from './Button';
import { translations } from '../translations';
import { RequestStatus } from '../types';

interface CreateRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, description: string, author: string) => void;
  lang: 'ko' | 'en';
}

export const CreateRequestModal: React.FC<CreateRequestModalProps> = ({ isOpen, onClose, onSubmit, lang }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const t = translations[lang].requests;

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && description.trim() && author.trim()) {
      onSubmit(title, description, author);
      setTitle('');
      setDescription('');
      setAuthor('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card w-full max-w-md rounded-2xl border border-border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h2 className="text-xl font-bold text-foreground">{t.createTitle}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">{t.titleLabel}</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-secondary border border-border rounded-lg px-4 py-2 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder={t.titlePlaceholder}
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">{t.descLabel}</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-secondary border border-border rounded-lg px-4 py-2 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none h-32 resize-none"
              placeholder={t.descPlaceholder}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">{t.authorLabel}</label>
            <input 
              type="text" 
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full bg-secondary border border-border rounded-lg px-4 py-2 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder={t.authorPlaceholder}
            />
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
             <Button type="button" variant="ghost" onClick={onClose}>{translations[lang].register.cancel}</Button>
             <Button type="submit">{t.submitBtn}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};