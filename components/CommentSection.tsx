import React, { useState } from 'react';
import { Comment } from '../types';
import { Button } from './Button';

interface CommentLabels {
  title: string;
  reply: string;
  placeholder: string;
  nickname: string;
  post: string;
  cancel: string;
  noComments: string;
}

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (text: string, author: string, parentId: string | null) => void;
  labels: CommentLabels;
}

const CommentForm: React.FC<{
  onSubmit: (text: string, author: string) => void;
  onCancel?: () => void;
  autoFocus?: boolean;
  labels: CommentLabels;
}> = ({ onSubmit, onCancel, autoFocus, labels }) => {
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !author.trim()) return;
    onSubmit(text, author);
    setText('');
    setAuthor('');
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      <div className="flex gap-3">
        <input
          type="text"
          placeholder={labels.nickname}
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-1 focus:ring-brand-500 outline-none w-1/3"
          required
        />
        <input
          type="text"
          placeholder={labels.placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
          autoFocus={autoFocus}
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-1 focus:ring-brand-500 outline-none flex-1"
          required
        />
      </div>
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} className="text-xs py-1 px-3">
            {labels.cancel}
          </Button>
        )}
        <Button type="submit" variant="primary" className="text-xs py-1 px-3">
          {labels.post}
        </Button>
      </div>
    </form>
  );
};

const CommentItem: React.FC<{
  comment: Comment;
  onReply: (text: string, author: string, parentId: string) => void;
  labels: CommentLabels;
  depth?: number;
}> = ({ comment, onReply, labels, depth = 0 }) => {
  const [isReplying, setIsReplying] = useState(false);

  return (
    <div className={`flex flex-col ${depth > 0 ? 'ml-4 pl-4 border-l-2 border-slate-700/50' : ''} mt-4`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="font-bold text-slate-300 text-sm">{comment.author}</span>
        <span className="text-slate-500 text-xs">
          {new Date(comment.timestamp).toLocaleDateString()}
        </span>
      </div>
      <p className="text-slate-300 text-sm mb-2 leading-relaxed">{comment.text}</p>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsReplying(!isReplying)}
          className="text-xs text-brand-400 hover:text-brand-300 font-medium flex items-center gap-1"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
          {labels.reply}
        </button>
      </div>

      {isReplying && (
        <div className="pl-4">
          <CommentForm 
            onSubmit={(text, author) => {
              onReply(text, author, comment.id);
              setIsReplying(false);
            }} 
            onCancel={() => setIsReplying(false)}
            autoFocus
            labels={labels}
          />
        </div>
      )}

      {comment.replies.length > 0 && (
        <div className="space-y-2">
          {comment.replies.map(reply => (
            <CommentItem 
              key={reply.id} 
              comment={reply} 
              onReply={onReply} 
              labels={labels}
              depth={depth + 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const CommentSection: React.FC<CommentSectionProps> = ({ comments, onAddComment, labels }) => {
  return (
    <div className="w-full bg-slate-900/50 p-6 rounded-xl border border-slate-700/50 mt-6">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        {labels.title} <span className="text-slate-500 text-sm font-normal">({comments.reduce((acc, c) => acc + 1 + countReplies(c), 0)})</span>
      </h3>
      
      <div className="mb-6">
        <CommentForm onSubmit={(text, author) => onAddComment(text, author, null)} labels={labels} />
      </div>

      <div className="space-y-1 divide-y divide-slate-800/50">
        {comments.map(comment => (
          <CommentItem 
            key={comment.id} 
            comment={comment} 
            onReply={onAddComment} 
            labels={labels}
          />
        ))}
        {comments.length === 0 && (
           <div className="text-center py-8 text-slate-500 text-sm">
             {labels.noComments}
           </div>
        )}
      </div>
    </div>
  );
};

// Helper to count nested comments
const countReplies = (comment: Comment): number => {
  if (!comment.replies) return 0;
  return comment.replies.length + comment.replies.reduce((acc, c) => acc + countReplies(c), 0);
};