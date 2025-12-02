import React, { useState } from 'react';
import { AppEntry, Category } from '../types';
import { Button } from './Button';
import { generateAppThumbnail } from '../services/geminiService';
import { translations, categoryLabels } from '../translations';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (app: Omit<AppEntry, 'id' | 'likes' | 'createdAt'>) => void;
  apiKey: string | null;
  onOpenSettings: () => void;
  lang: 'ko' | 'en';
}

export const RegisterModal: React.FC<RegisterModalProps> = ({ 
  isOpen, 
  onClose, 
  onRegister,
  apiKey,
  onOpenSettings,
  lang
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>(Category.PRODUCTIVITY);
  const [tags, setTags] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [author, setAuthor] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = translations[lang].register;
  const cats = categoryLabels[lang];

  if (!isOpen) return null;

  const handleGenerateThumbnail = async () => {
    if (!apiKey) {
      onOpenSettings();
      return;
    }
    if (!description || !name) {
      setError(t.errorDesc);
      return;
    }
    setError(null);
    setIsGenerating(true);
    try {
      const url = await generateAppThumbnail(apiKey, name, description, category);
      setThumbnailUrl(url);
    } catch (err: any) {
      setError(t.errorGen);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !demoUrl || !author) {
      setError(t.errorFill);
      return;
    }
    
    // Use placeholder if generation failed or skipped
    const finalThumbnail = thumbnailUrl || `https://picsum.photos/seed/${name}/400/400`;
    
    // Process tags
    const tagList = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

    onRegister({
      name,
      description,
      category,
      tags: tagList,
      demoUrl,
      author,
      thumbnailUrl: finalThumbnail
    });
    
    // Reset form
    setName('');
    setDescription('');
    setCategory(Category.PRODUCTIVITY);
    setTags('');
    setDemoUrl('');
    setAuthor('');
    setThumbnailUrl('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-dark-card w-full max-w-2xl rounded-2xl border border-slate-700 shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-brand-500">✨</span> {t.title}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">{t.name}</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                  placeholder={t.namePlaceholder}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">{t.category}</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-brand-500 outline-none"
                >
                  {Object.values(Category).filter(c => c !== Category.ALL).map((cat) => (
                    <option key={cat} value={cat}>{cats[cat]}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">{t.tags}</label>
                <input 
                  type="text" 
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-brand-500 outline-none"
                  placeholder={t.tagsPlaceholder}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">{t.demoUrl}</label>
                <input 
                  type="url" 
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-brand-500 outline-none"
                  placeholder={t.demoUrlPlaceholder}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">{t.author}</label>
                <input 
                  type="text" 
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-brand-500 outline-none"
                  placeholder={t.authorPlaceholder}
                />
              </div>
            </div>

            <div className="space-y-4 flex flex-col">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">{t.description}</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-brand-500 outline-none h-24 resize-none"
                  placeholder={t.descriptionPlaceholder}
                />
              </div>

              <div className="flex-1 flex flex-col">
                <label className="block text-sm font-medium text-slate-300 mb-2">{t.thumbnail}</label>
                <div className="flex-1 bg-slate-800 rounded-lg border-2 border-dashed border-slate-600 flex flex-col items-center justify-center relative overflow-hidden group min-h-[160px]">
                  {thumbnailUrl ? (
                    <>
                      <img src={thumbnailUrl} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button type="button" variant="secondary" onClick={handleGenerateThumbnail} isLoading={isGenerating}>{t.regenerate}</Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-4">
                      <p className="text-slate-400 text-sm mb-3">{t.noThumbnail}</p>
                      <Button 
                        type="button" 
                        variant="primary" 
                        onClick={handleGenerateThumbnail}
                        isLoading={isGenerating}
                        className="text-xs"
                      >
                         {t.generate}
                      </Button>
                      {!apiKey && <p className="text-xs text-red-400 mt-2">{t.requiresKey}</p>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-700 flex justify-end space-x-3">
          <Button variant="ghost" onClick={onClose}>{t.cancel}</Button>
          <Button onClick={handleSubmit}>{t.submit}</Button>
        </div>
      </div>
    </div>
  );
};