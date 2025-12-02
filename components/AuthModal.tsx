import React, { useState } from 'react';
import { Button } from './Button';
import * as AuthService from '../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  lang: 'ko' | 'en';
}

type AuthMode = 'signin' | 'signup';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess, lang }) => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = {
    ko: {
      signin: '로그인',
      signup: '회원가입',
      email: '이메일',
      password: '비밀번호',
      displayName: '이름',
      emailPlaceholder: 'example@email.com',
      passwordPlaceholder: '비밀번호 (최소 6자)',
      displayNamePlaceholder: '홍길동',
      signinBtn: '로그인',
      signupBtn: '가입하기',
      orContinueWith: '또는 다음으로 계속',
      googleBtn: 'Google로 계속하기',
      noAccount: '계정이 없으신가요?',
      hasAccount: '이미 계정이 있으신가요?',
      signupLink: '회원가입',
      signinLink: '로그인',
      cancel: '취소',
      emailRequired: '이메일을 입력해주세요.',
      passwordRequired: '비밀번호를 입력해주세요.',
      passwordMinLength: '비밀번호는 최소 6자 이상이어야 합니다.',
      displayNameRequired: '이름을 입력해주세요.',
      signupSuccess: '회원가입이 완료되었습니다! 이메일을 확인해주세요.',
      signinSuccess: '로그인 성공!',
      authError: '인증 오류가 발생했습니다.'
    },
    en: {
      signin: 'Sign In',
      signup: 'Sign Up',
      email: 'Email',
      password: 'Password',
      displayName: 'Name',
      emailPlaceholder: 'example@email.com',
      passwordPlaceholder: 'Password (min 6 chars)',
      displayNamePlaceholder: 'John Doe',
      signinBtn: 'Sign In',
      signupBtn: 'Sign Up',
      orContinueWith: 'Or continue with',
      googleBtn: 'Continue with Google',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      signupLink: 'Sign up',
      signinLink: 'Sign in',
      cancel: 'Cancel',
      emailRequired: 'Email is required.',
      passwordRequired: 'Password is required.',
      passwordMinLength: 'Password must be at least 6 characters.',
      displayNameRequired: 'Name is required.',
      signupSuccess: 'Sign up successful! Please check your email.',
      signinSuccess: 'Sign in successful!',
      authError: 'Authentication error occurred.'
    }
  };

  const text = t[lang];

  if (!isOpen) return null;

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!email) {
      setError(text.emailRequired);
      return;
    }
    if (!password) {
      setError(text.passwordRequired);
      return;
    }
    if (password.length < 6) {
      setError(text.passwordMinLength);
      return;
    }
    if (mode === 'signup' && !displayName) {
      setError(text.displayNameRequired);
      return;
    }

    setLoading(true);

    try {
      if (mode === 'signup') {
        const { user, error: authError } = await AuthService.signUpWithEmail(email, password, displayName);
        if (authError) {
          setError(authError.message);
        } else {
          alert(text.signupSuccess);
          onSuccess();
          handleClose();
        }
      } else {
        const { user, error: authError } = await AuthService.signInWithEmail(email, password);
        if (authError) {
          setError(authError.message);
        } else {
          onSuccess();
          handleClose();
        }
      }
    } catch (err) {
      setError(text.authError);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError(null);
    setLoading(true);

    try {
      const { error: authError } = await AuthService.signInWithGoogle();
      if (authError) {
        setError(authError.message);
        setLoading(false);
      }
      // Success will be handled by redirect
    } catch (err) {
      setError(text.authError);
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setDisplayName('');
    setError(null);
    setMode('signin');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-card p-8 rounded-2xl border border-border shadow-2xl w-full max-w-md">
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-foreground mb-6">
          {mode === 'signin' ? text.signin : text.signup}
        </h2>

        <form onSubmit={handleEmailAuth} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {text.displayName}
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={text.displayNamePlaceholder}
                className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {text.email}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={text.emailPlaceholder}
              className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {text.password}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={text.passwordPlaceholder}
              className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-12 text-base"
            disabled={loading}
          >
            {loading ? '처리 중...' : (mode === 'signin' ? text.signinBtn : text.signupBtn)}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-card text-muted-foreground">{text.orContinueWith}</span>
          </div>
        </div>

        <button
          onClick={handleGoogleAuth}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 hover:bg-gray-100 rounded-lg px-4 py-3 font-medium transition-colors border border-gray-300"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {text.googleBtn}
        </button>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">
            {mode === 'signin' ? text.noAccount : text.hasAccount}
          </span>
          {' '}
          <button
            onClick={() => {
              setMode(mode === 'signin' ? 'signup' : 'signin');
              setError(null);
            }}
            className="text-primary hover:underline font-medium"
          >
            {mode === 'signin' ? text.signupLink : text.signinLink}
          </button>
        </div>
      </div>
    </div>
  );
};

