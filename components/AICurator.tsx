import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { AppEntry } from '../types';
import { Button } from './Button';
import { translations } from '../translations';

interface AICuratorProps {
  apps: AppEntry[];
  apiKey: string | null;
  onOpenSettings: () => void;
  lang: 'ko' | 'en';
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const AICurator: React.FC<AICuratorProps> = ({ apps, apiKey, onOpenSettings, lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const t = translations[lang].curator;

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ role: 'model', text: t.welcome }]);
    }
  }, [isOpen, lang, messages.length, t.welcome]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    if (!apiKey) {
      setMessages(prev => [...prev, { role: 'user', text: input }]);
      setTimeout(() => {
         setMessages(prev => [...prev, { role: 'model', text: t.errorKey }]);
      }, 500);
      setInput('');
      return;
    }

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsThinking(true);

    try {
      const ai = new GoogleGenAI({ apiKey });
      
      // Prepare context about apps
      const appsContext = apps.map(app => 
        `- Name: ${app.name}, Category: ${app.category}, Desc: ${app.description}, Tags: ${app.tags.join(', ')}, Likes: ${app.likes}`
      ).join('\n');

      const prompt = `
        You are an AI Curator for an app showroom. 
        Current User Language: ${lang === 'ko' ? 'Korean' : 'English'}.
        
        Here is the list of available apps:
        ${appsContext}

        User Request: "${userMsg}"

        Task: Recommend the most suitable apps from the list based on the user's request. 
        If the user asks for something not in the list, suggest the closest match or say you don't have it.
        Keep the response concise, friendly, and engaging. 
        Format your response as a helpful assistant.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      setMessages(prev => [...prev, { role: 'model', text: response.text || "Sorry, I couldn't generate a response." }]);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "Error connecting to AI." }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-r from-brand-500 to-purple-600 rounded-full shadow-lg shadow-brand-500/30 flex items-center justify-center text-white hover:scale-105 transition-transform"
      >
        {isOpen ? (
           <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
           </svg>
        ) : (
           <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
           </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-80 md:w-96 h-96 bg-dark-card border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
            <h3 className="font-bold text-white flex items-center gap-2">
               <span className="text-xl">🤖</span> {t.title}
            </h3>
            {!apiKey && (
              <button onClick={onOpenSettings} className="text-xs text-red-400 hover:text-red-300 underline">
                API Key?
              </button>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-dark-bg/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                    msg.role === 'user' 
                      ? 'bg-brand-600 text-white rounded-tr-none' 
                      : 'bg-slate-700 text-slate-200 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isThinking && (
              <div className="flex justify-start">
                <div className="bg-slate-700 text-slate-400 rounded-2xl rounded-tl-none px-4 py-2 text-xs italic">
                  {t.thinking}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-slate-800 border-t border-slate-700">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex gap-2"
            >
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.placeholder}
                className="flex-1 bg-dark-bg border border-slate-600 rounded-full px-4 py-2 text-sm text-white focus:ring-1 focus:ring-brand-500 outline-none"
              />
              <Button type="submit" variant="primary" className="rounded-full w-10 h-10 p-0 flex items-center justify-center" disabled={isThinking || !input.trim()}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};