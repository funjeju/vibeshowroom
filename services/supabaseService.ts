import { supabase, getUserSession } from '../lib/supabase';
import { AppEntry, Comment, AppRequest, HelpRequest, Category, RequestStatus } from '../types';

// Helper function to convert DB row to AppEntry
const dbToAppEntry = (row: any): AppEntry => ({
  id: row.id,
  name: row.name,
  description: row.description,
  category: row.category as Category,
  tags: row.tags || [],
  thumbnailUrl: row.thumbnail_url,
  demoUrl: row.demo_url,
  author: row.author,
  likes: row.likes || 0,
  priceVotes: [],
  comments: [],
  createdAt: new Date(row.created_at).getTime()
});

// Helper function to convert DB row to AppRequest
const dbToAppRequest = (row: any): AppRequest => ({
  id: row.id,
  title: row.title,
  description: row.description,
  author: row.author,
  votes: row.votes || 0,
  status: row.status as RequestStatus,
  createdAt: new Date(row.created_at).getTime()
});

// Helper function to convert DB row to HelpRequest
const dbToHelpRequest = (row: any): HelpRequest => ({
  id: row.id,
  appName: row.app_name,
  description: row.description,
  category: row.category as Category,
  tags: row.tags || [],
  thumbnailUrl: row.thumbnail_url,
  author: row.author,
  sourceUrl: row.source_url,
  codeSnippet: row.code_snippet,
  comments: [],
  createdAt: new Date(row.created_at).getTime()
});

// Helper function to convert DB row to Comment
const dbToComment = (row: any): Comment => ({
  id: row.id,
  author: row.author,
  text: row.text,
  timestamp: new Date(row.timestamp).getTime(),
  replies: []
});

// ============ APPS ============

export const fetchApps = async (): Promise<AppEntry[]> => {
  const { data, error } = await supabase
    .from('apps')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  const apps = data.map(dbToAppEntry);
  
  // Fetch price votes and comments for each app
  await Promise.all(apps.map(async (app) => {
    const votes = await fetchPriceVotes(app.id);
    const comments = await fetchComments(app.id, 'app');
    app.priceVotes = votes;
    app.comments = comments;
  }));
  
  return apps;
};

export const createApp = async (app: Omit<AppEntry, 'id' | 'likes' | 'createdAt' | 'priceVotes' | 'comments'>): Promise<AppEntry> => {
  const { data, error } = await supabase
    .from('apps')
    .insert({
      name: app.name,
      description: app.description,
      category: app.category,
      tags: app.tags,
      thumbnail_url: app.thumbnailUrl,
      demo_url: app.demoUrl,
      author: app.author
    })
    .select()
    .single();
  
  if (error) throw error;
  
  return dbToAppEntry(data);
};

// ============ APP REQUESTS ============

export const fetchAppRequests = async (): Promise<AppRequest[]> => {
  const { data, error } = await supabase
    .from('app_requests')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  return data.map(dbToAppRequest);
};

export const createAppRequest = async (request: { title: string; description: string; author: string }): Promise<AppRequest> => {
  const { data, error } = await supabase
    .from('app_requests')
    .insert(request)
    .select()
    .single();
  
  if (error) throw error;
  
  // Auto-vote for the creator
  await toggleRequestVote(data.id, true);
  
  return dbToAppRequest(data);
};

// ============ HELP REQUESTS ============

export const fetchHelpRequests = async (): Promise<HelpRequest[]> => {
  const { data, error } = await supabase
    .from('help_requests')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  const helpRequests = data.map(dbToHelpRequest);
  
  // Fetch comments for each help request
  await Promise.all(helpRequests.map(async (req) => {
    const comments = await fetchComments(req.id, 'help');
    req.comments = comments;
  }));
  
  return helpRequests;
};

export const createHelpRequest = async (request: any): Promise<HelpRequest> => {
  const { data, error } = await supabase
    .from('help_requests')
    .insert({
      app_name: request.appName,
      description: request.description,
      category: request.category,
      tags: request.tags,
      thumbnail_url: request.thumbnailUrl,
      author: request.author,
      source_url: request.sourceUrl,
      code_snippet: request.codeSnippet
    })
    .select()
    .single();
  
  if (error) throw error;
  
  return dbToHelpRequest(data);
};

// ============ COMMENTS ============

export const fetchComments = async (parentEntityId: string, type: 'app' | 'help'): Promise<Comment[]> => {
  const column = type === 'app' ? 'app_id' : 'help_request_id';
  
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq(column, parentEntityId)
    .is('parent_id', null)
    .order('timestamp', { ascending: false });
  
  if (error) throw error;
  
  const comments = data.map(dbToComment);
  
  // Recursively fetch replies
  await Promise.all(comments.map(async (comment) => {
    comment.replies = await fetchReplies(comment.id);
  }));
  
  return comments;
};

const fetchReplies = async (parentId: string): Promise<Comment[]> => {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('parent_id', parentId)
    .order('timestamp', { ascending: false });
  
  if (error) throw error;
  
  const replies = data.map(dbToComment);
  
  // Recursively fetch nested replies
  await Promise.all(replies.map(async (reply) => {
    reply.replies = await fetchReplies(reply.id);
  }));
  
  return replies;
};

export const createComment = async (
  text: string,
  author: string,
  parentEntityId: string,
  type: 'app' | 'help',
  parentCommentId: string | null = null
): Promise<Comment> => {
  const column = type === 'app' ? 'app_id' : 'help_request_id';
  
  const { data, error } = await supabase
    .from('comments')
    .insert({
      text,
      author,
      [column]: parentEntityId,
      parent_id: parentCommentId
    })
    .select()
    .single();
  
  if (error) throw error;
  
  return dbToComment(data);
};

// ============ PRICE VOTES ============

export const fetchPriceVotes = async (appId: string): Promise<number[]> => {
  const { data, error } = await supabase
    .from('price_votes')
    .select('price')
    .eq('app_id', appId);
  
  if (error) throw error;
  
  return data.map(row => parseFloat(row.price));
};

export const submitPriceVote = async (appId: string, price: number): Promise<void> => {
  const sessionId = getUserSession();
  
  const { error } = await supabase
    .from('price_votes')
    .insert({
      app_id: appId,
      price,
      user_session: sessionId
    });
  
  if (error) throw error;
};

// ============ LIKES ============

export const fetchUserLikes = async (): Promise<Set<string>> => {
  const sessionId = getUserSession();
  
  const { data, error } = await supabase
    .from('likes')
    .select('app_id')
    .eq('user_session', sessionId);
  
  if (error) throw error;
  
  return new Set(data.map(row => row.app_id));
};

export const toggleLike = async (appId: string, isLiked: boolean): Promise<void> => {
  const sessionId = getUserSession();
  
  if (isLiked) {
    // Unlike
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('app_id', appId)
      .eq('user_session', sessionId);
    
    if (error) throw error;
    
    // Decrement likes count
    await supabase.rpc('decrement_app_likes', { app_id: appId });
  } else {
    // Like
    const { error } = await supabase
      .from('likes')
      .insert({
        app_id: appId,
        user_session: sessionId
      });
    
    if (error && error.code !== '23505') throw error; // Ignore unique constraint violation
    
    // Increment likes count
    await supabase.rpc('increment_app_likes', { app_id: appId });
  }
};

// ============ REQUEST VOTES ============

export const fetchUserRequestVotes = async (): Promise<Set<string>> => {
  const sessionId = getUserSession();
  
  const { data, error } = await supabase
    .from('request_votes')
    .select('request_id')
    .eq('user_session', sessionId);
  
  if (error) throw error;
  
  return new Set(data.map(row => row.request_id));
};

export const toggleRequestVote = async (requestId: string, isVoted: boolean): Promise<void> => {
  const sessionId = getUserSession();
  
  if (isVoted) {
    // Remove vote
    const { error } = await supabase
      .from('request_votes')
      .delete()
      .eq('request_id', requestId)
      .eq('user_session', sessionId);
    
    if (error) throw error;
    
    // Decrement votes count
    await supabase.rpc('decrement_request_votes', { req_id: requestId });
  } else {
    // Add vote
    const { error } = await supabase
      .from('request_votes')
      .insert({
        request_id: requestId,
        user_session: sessionId
      });
    
    if (error && error.code !== '23505') throw error; // Ignore unique constraint violation
    
    // Increment votes count
    await supabase.rpc('increment_request_votes', { req_id: requestId });
  }
};

