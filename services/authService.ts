import { supabase } from '../lib/supabase';
import type { User, AuthError, Session } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string | undefined;
  displayName: string | undefined;
  avatarUrl: string | undefined;
}

// 현재 사용자 가져오기
export const getCurrentUser = async (): Promise<AuthUser | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  return {
    id: user.id,
    email: user.email,
    displayName: user.user_metadata?.full_name || user.email?.split('@')[0] || '사용자',
    avatarUrl: user.user_metadata?.avatar_url
  };
};

// 이메일로 회원가입
export const signUpWithEmail = async (email: string, password: string, displayName?: string): Promise<{ user: AuthUser | null; error: AuthError | null }> => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: displayName || email.split('@')[0]
      }
    }
  });
  
  if (error) return { user: null, error };
  if (!data.user) return { user: null, error: null };
  
  return {
    user: {
      id: data.user.id,
      email: data.user.email,
      displayName: data.user.user_metadata?.full_name || email.split('@')[0],
      avatarUrl: data.user.user_metadata?.avatar_url
    },
    error: null
  };
};

// 이메일로 로그인
export const signInWithEmail = async (email: string, password: string): Promise<{ user: AuthUser | null; error: AuthError | null }> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) return { user: null, error };
  if (!data.user) return { user: null, error: null };
  
  return {
    user: {
      id: data.user.id,
      email: data.user.email,
      displayName: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || '사용자',
      avatarUrl: data.user.user_metadata?.avatar_url
    },
    error: null
  };
};

// 구글로 로그인
export const signInWithGoogle = async (): Promise<{ error: AuthError | null }> => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}`
    }
  });
  
  return { error };
};

// 로그아웃
export const signOut = async (): Promise<{ error: AuthError | null }> => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// 인증 상태 변경 리스너
export const onAuthStateChange = (callback: (user: AuthUser | null) => void) => {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      callback({
        id: session.user.id,
        email: session.user.email,
        displayName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || '사용자',
        avatarUrl: session.user.user_metadata?.avatar_url
      });
    } else {
      callback(null);
    }
  });
};

