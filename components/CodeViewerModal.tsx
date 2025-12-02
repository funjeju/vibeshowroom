import React, { useState } from 'react';
import { Button } from './Button';
import { translations } from '../translations';

interface CodeViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  title: string;
  lang: 'ko' | 'en';
}

export const CodeViewerModal: React.FC<CodeViewerModalProps> = ({ isOpen, onClose, code, title, lang }) => {
  const [copied, setCopied] = useState(false);
  const t = translations[lang].help;

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#1e1e1e] w-full max-w-4xl rounded-xl border border-slate-700 shadow-2xl flex flex-col h-[80vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#252526] border-b border-[#333]">
          <span className="text-sm font-mono text-slate-300 flex items-center gap-2">
            <svg className="w-4 h-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            {title}
          </span>
          <div className="flex gap-2">
            <Button variant="ghost" className="h-8 text-xs" onClick={handleCopy}>
              {copied ? t.copied : t.copyCode}
            </Button>
            <button onClick={onClose} className="text-slate-400 hover:text-white">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Code Area */}
        <div className="flex-1 overflow-auto p-4 custom-scrollbar bg-[#1e1e1e]">
          <pre className="text-sm font-mono text-slate-200 leading-relaxed whitespace-pre-wrap break-all">
            <code>{code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};