export enum Category {
  ALL = 'All',
  PRODUCTIVITY = 'Productivity',
  ENTERTAINMENT = 'Entertainment',
  UTILITIES = 'Utilities',
  AI_TOOLS = 'AI Tools',
  FINANCE = 'Finance',
  LIFESTYLE = 'Lifestyle'
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: number;
  replies: Comment[];
}

export interface AppEntry {
  id: string;
  name: string;
  description: string;
  category: Category;
  tags: string[]; // Tech stack or keywords
  thumbnailUrl: string;
  demoUrl: string; // URL to the hosted app
  author: string;
  likes: number; // Kept for legacy or general popularity (can be derived from votes length)
  priceVotes: number[]; // Array of price votes
  comments: Comment[];
  createdAt: number;
}

export enum RequestStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed'
}

export interface AppRequest {
  id: string;
  title: string;
  description: string;
  author: string;
  votes: number;
  status: RequestStatus;
  createdAt: number;
}

export interface HelpRequest {
  id: string;
  appName: string;
  description: string; // The specific problem
  category: Category;
  tags: string[];
  thumbnailUrl: string;
  author: string;
  sourceUrl?: string; // Link to zip or repo
  codeSnippet?: string; // Text content of code
  comments: Comment[];
  createdAt: number;
}

export interface AppState {
  apps: AppEntry[];
  apiKey: string | null;
}