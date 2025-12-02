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
      kakaoBtn: '카카오로 계속하기',
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
      kakaoBtn: 'Continue with Kakao',
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
          // 에러 메시지를 한국어로 번역
          console.error('Signup error:', authError);
          let errorMessage = authError.message;
          
          if (authError.message.includes('User already registered') || 
              authError.message.includes('already been registered')) {
            errorMessage = lang === 'ko' 
              ? '이미 등록된 이메일입니다. 로그인을 시도해주세요.' 
              : 'Email already registered. Please try logging in.';
          } else if (authError.message.includes('Password should be')) {
            errorMessage = lang === 'ko'
              ? '비밀번호는 최소 6자 이상이어야 합니다.'
              : 'Password should be at least 6 characters.';
          }
          
          setError(errorMessage);
        } else {
          alert(text.signupSuccess);
          onSuccess();
          handleClose();
        }
      } else {
        const { user, error: authError } = await AuthService.signInWithEmail(email, password);
        if (authError) {
          // 에러 메시지를 한국어로 번역
          console.error('Login error:', authError);
          let errorMessage = authError.message;
          
          if (authError.message.includes('Invalid login credentials') || 
              authError.message.includes('Invalid email or password')) {
            errorMessage = lang === 'ko' 
              ? '이메일 또는 비밀번호가 올바르지 않습니다.' 
              : 'Invalid email or password.';
          } else if (authError.message.includes('Email not confirmed')) {
            errorMessage = lang === 'ko'
              ? '이메일 인증이 완료되지 않았습니다. 이메일을 확인해주세요.'
              : 'Email not confirmed. Please check your email.';
          } else if (authError.message.includes('User not found')) {
            errorMessage = lang === 'ko'
              ? '등록되지 않은 이메일입니다. 회원가입을 먼저 진행해주세요.'
              : 'Email not registered. Please sign up first.';
          }
          
          setError(errorMessage);
        } else if (!user) {
          setError(lang === 'ko' 
            ? '등록되지 않은 이메일입니다. 회원가입을 먼저 진행해주세요.' 
            : 'Email not registered. Please sign up first.');
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

  const handleKakaoAuth = async () => {
    setError(null);
    setLoading(true);

    try {
      const { error: authError } = await AuthService.signInWithKakao();
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
          onClick={handleKakaoAuth}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-[#FEE500] text-[#000000] hover:bg-[#FDD835] rounded-lg px-4 py-3 font-medium transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3C6.48 3 2 6.58 2 11c0 2.78 1.826 5.228 4.574 6.625-.195.714-.674 2.42-.767 2.796-.113.456.168.45.355.327.143-.093 2.325-1.548 3.268-2.163C10.19 18.796 11.087 19 12 19c5.52 0 10-3.58 10-8s-4.48-8-10-8z"/>
          </svg>
          {text.kakaoBtn}
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

