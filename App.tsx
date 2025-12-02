import React, { useState, useEffect } from 'react';
import { AppEntry, Category, Comment, AppRequest, RequestStatus, HelpRequest } from './types';
import { Button } from './components/Button';
import { AppCard } from './components/AppCard';
import { HelpCard } from './components/HelpCard';
import { RegisterModal } from './components/RegisterModal';
import { CreateHelpModal } from './components/CreateHelpModal';
import { CommentSection } from './components/CommentSection';
import { AICurator } from './components/AICurator';
import { RequestCard } from './components/RequestCard';
import { CreateRequestModal } from './components/CreateRequestModal';
import { CodeViewerModal } from './components/CodeViewerModal';
import { PriceVotingModal } from './components/PriceVotingModal';
import { AuthModal } from './components/AuthModal';
import { translations, categoryLabels } from './translations';
import { calculateValuation, formatCurrency } from './utils/valuation';
import * as SupabaseService from './services/supabaseService';
import * as AuthService from './services/authService';
import type { AuthUser } from './services/authService';

// Mock Data Initializer (Korean Default)
const INITIAL_APPS_KO: AppEntry[] = [
  {
    id: '1',
    name: 'NeonTasker',
    description: 'AI 인사이트와 사이버펑크 미학으로 삶을 정리해주는 미래형 생산성 도구입니다.',
    category: Category.PRODUCTIVITY,
    tags: ['React', 'Tailwind', 'AI'],
    thumbnailUrl: 'https://picsum.photos/seed/neontasker/500/500',
    demoUrl: '#',
    author: 'AlexCode',
    likes: 124,
    priceVotes: [10, 12, 12, 15, 9, 8, 25, 5, 12, 11],
    comments: [
      {
        id: 'c1',
        author: 'SarahDev',
        text: 'UI가 정말 멋지네요! 발광 효과는 어떻게 구현했나요?',
        timestamp: Date.now() - 86400000,
        replies: [
          {
             id: 'c1-r1',
             author: 'AlexCode',
             text: '감사합니다! Tailwind의 box-shadow를 활용했습니다.',
             timestamp: Date.now() - 80000000,
             replies: []
          }
        ]
      }
    ],
    createdAt: Date.now()
  },
  {
    id: '2',
    name: 'BeatSync VR',
    description: '브라우저에서 직접 실행되는 가상 현실 음악 시각화 도구입니다. 로컬 파일을 동기화하세요.',
    category: Category.ENTERTAINMENT,
    tags: ['WebXR', 'Three.js', 'AudioAPI'],
    thumbnailUrl: 'https://picsum.photos/seed/beatsync/500/500',
    demoUrl: '#',
    author: 'VibeMaster',
    likes: 89,
    priceVotes: [5, 5, 0, 10, 2],
    comments: [],
    createdAt: Date.now() - 100000
  },
  {
    id: '3',
    name: 'FinFlow',
    description: '단순 선형 회귀를 사용하여 저축 목표를 위한 예측 모델링을 제공하는 개인 금융 추적기입니다.',
    category: Category.FINANCE,
    tags: ['Python', 'Flask', 'Chart.js'],
    thumbnailUrl: 'https://picsum.photos/seed/finflow/500/500',
    demoUrl: '#',
    author: 'MoneyWizard',
    likes: 210,
    priceVotes: [20, 25, 22, 18, 20, 100, 0, 21], // Outliers 100 and 0 should be trimmed
    comments: [],
    createdAt: Date.now() - 200000
  }
];

const INITIAL_REQUESTS: AppRequest[] = [
  {
    id: 'r1',
    title: '자동 식단 관리 AI',
    description: '냉장고에 있는 재료 사진만 찍으면 자동으로 일주일 식단을 짜주고, 부족한 재료는 장바구니에 담아주는 앱이 있었으면 좋겠어요.',
    author: 'HealthLife',
    votes: 45,
    status: RequestStatus.PENDING,
    createdAt: Date.now() - 500000
  },
  {
    id: 'r2',
    title: '꿈 기록 & 해몽 저널',
    description: '매일 꿈을 음성으로 기록하면 텍스트로 변환해주고, AI가 프로이트 심리학 기반으로 해석해주는 앱 만들어주세요!',
    author: 'Dreamer',
    votes: 82,
    status: RequestStatus.IN_PROGRESS,
    createdAt: Date.now() - 1200000
  }
];

const INITIAL_HELP_REQUESTS: HelpRequest[] = [
  {
    id: 'h1',
    appName: 'WeatherVibe',
    description: '날씨 API를 연동했는데 비동기 처리 문제인지 데이터가 화면에 바로 렌더링되지 않습니다. useEffect 의존성 배열 문제일까요?',
    category: Category.UTILITIES,
    tags: ['React', 'API', 'Async'],
    thumbnailUrl: 'https://picsum.photos/seed/weatherbug/500/500',
    author: 'JuniorDev',
    codeSnippet: `useEffect(() => {
  const fetchData = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setWeather(data);
  };
  fetchData();
}, []); // 데이터가 갱신이 안됩니다 ㅠㅠ`,
    sourceUrl: 'https://github.com/example/weather-vibe',
    comments: [],
    createdAt: Date.now() - 300000
  },
  {
    id: 'h2',
    appName: 'RetroGame',
    description: '캔버스로 벽돌깨기 게임을 만들고 있는데 충돌 감지 로직에서 공이 가끔 벽돌을 통과해버리는 버그가 있습니다.',
    category: Category.ENTERTAINMENT,
    tags: ['HTML5 Canvas', 'JS', 'GameDev'],
    thumbnailUrl: 'https://picsum.photos/seed/retrogame/500/500',
    author: 'GameMaker',
    comments: [],
    createdAt: Date.now() - 600000
  }
];

const App: React.FC = () => {
  const [lang, setLang] = useState<'ko' | 'en'>('ko');
  const [activeTab, setActiveTab] = useState<'showcase' | 'help' | 'requests'>('showcase');
  
  // App Showcase State
  const [apps, setApps] = useState<AppEntry[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>(Category.ALL);
  const [selectedApp, setSelectedApp] = useState<AppEntry | null>(null);
  const [likedAppIds, setLikedAppIds] = useState<Set<string>>(new Set());

  // Voting State
  const [votingApp, setVotingApp] = useState<AppEntry | null>(null);

  // Help Me State
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [viewingCode, setViewingCode] = useState<HelpRequest | null>(null);

  // Request Board State
  const [requests, setRequests] = useState<AppRequest[]>([]);
  const [votedRequestIds, setVotedRequestIds] = useState<Set<string>>(new Set());
  const [showRequestModal, setShowRequestModal] = useState(false);

  // General State
  const [apiKey, setApiKey] = useState<string>('');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  
  // Auth State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const t = translations[lang];

  // Load data from Supabase on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load Apps
        const appsData = await SupabaseService.fetchApps();
        setApps(appsData);

        // Load Help Requests
        const helpData = await SupabaseService.fetchHelpRequests();
        setHelpRequests(helpData);

        // Load App Requests
        const requestsData = await SupabaseService.fetchAppRequests();
        setRequests(requestsData);

        // Load User Likes
        const likes = await SupabaseService.fetchUserLikes();
        setLikedAppIds(likes);

        // Load User Votes
        const votes = await SupabaseService.fetchUserRequestVotes();
        setVotedRequestIds(votes);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();

    // Load API Key from localStorage
    const storedKey = localStorage.getItem('vibeapp_api_key');
    if (storedKey) setApiKey(storedKey);

    // Initialize auth state
    AuthService.getCurrentUser().then(setCurrentUser);

    // Listen for auth changes
    const { data: authListener } = AuthService.onAuthStateChange((user) => {
      setCurrentUser(user);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const toggleLanguage = () => {
    setLang(prev => prev === 'ko' ? 'en' : 'ko');
  };

  const handleSignOut = async () => {
    const { error } = await AuthService.signOut();
    if (!error) {
      setCurrentUser(null);
    }
  };

  const handleRegisterApp = async (newApp: Omit<AppEntry, 'id' | 'likes' | 'createdAt'>) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    
    try {
      const appEntry = await SupabaseService.createApp(newApp);
      setApps([appEntry, ...apps]);
    } catch (error) {
      console.error('Error registering app:', error);
      alert('앱 등록 중 오류가 발생했습니다.');
    }
  };

  const handleCreateHelp = async (data: any) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    
    try {
      const newHelp = await SupabaseService.createHelpRequest(data);
      setHelpRequests([newHelp, ...helpRequests]);
    } catch (error) {
      console.error('Error creating help request:', error);
      alert('도움 요청 생성 중 오류가 발생했습니다.');
    }
  };

  const handleCreateRequest = async (title: string, description: string, author: string) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    
    try {
      const newRequest = await SupabaseService.createAppRequest({ title, description, author });
      setRequests([newRequest, ...requests]);
      
      const newVoted = new Set(votedRequestIds);
      newVoted.add(newRequest.id);
      setVotedRequestIds(newVoted);
    } catch (error) {
      console.error('Error creating request:', error);
      alert('요청 생성 중 오류가 발생했습니다.');
    }
  };

  const handleSaveKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('vibeapp_api_key', key);
    setShowKeyModal(false);
  };

  // Open the Price Voting Modal
  const handleOpenVote = (e: React.MouseEvent, app: AppEntry) => {
    e.stopPropagation();
    setVotingApp(app);
  };

  const handleSubmitVote = async (price: number) => {
    if (!votingApp) return;

    try {
      await SupabaseService.submitPriceVote(votingApp.id, price);
      
      setApps(prevApps => prevApps.map(a => {
        if (a.id === votingApp.id) {
          return { ...a, priceVotes: [...(a.priceVotes || []), price] };
        }
        return a;
      }));
      
      // Also update selectedApp if it's the same
      if (selectedApp && selectedApp.id === votingApp.id) {
          setSelectedApp(prev => prev ? { ...prev, priceVotes: [...(prev.priceVotes || []), price] } : null);
      }

      setVotingApp(null);
    } catch (error) {
      console.error('Error submitting vote:', error);
      alert('투표 중 오류가 발생했습니다.');
    }
  };

  const toggleVote = async (id: string) => {
    const isVoted = votedRequestIds.has(id);
    
    try {
      await SupabaseService.toggleRequestVote(id, isVoted);
      
      setRequests(prev => prev.map(r => {
        if (r.id === id) return { ...r, votes: isVoted ? r.votes - 1 : r.votes + 1 };
        return r;
      }));

      const newVotedIds = new Set(votedRequestIds);
      if (isVoted) newVotedIds.delete(id);
      else newVotedIds.add(id);

      setVotedRequestIds(newVotedIds);
    } catch (error) {
      console.error('Error toggling vote:', error);
    }
  };

  const addComment = async (text: string, author: string, parentId: string | null) => {
    if (!selectedApp) return;
    
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    try {
      const newComment = await SupabaseService.createComment(text, author, selectedApp.id, 'app', parentId);

      const updateComments = (comments: Comment[]): Comment[] => {
         if (parentId === null) return [newComment, ...comments];
         return comments.map(c => {
           if (c.id === parentId) return { ...c, replies: [newComment, ...c.replies] };
           if (c.replies.length > 0) return { ...c, replies: updateComments(c.replies) };
           return c;
         });
      };

      const updatedAppComments = updateComments(selectedApp.comments);
      
      setSelectedApp({ ...selectedApp, comments: updatedAppComments });

      setApps(prevApps => prevApps.map(a => {
        if (a.id === selectedApp.id) return { ...a, comments: updatedAppComments };
        return a;
      }));
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('댓글 추가 중 오류가 발생했습니다.');
    }
  };

  const filteredApps = selectedCategory === Category.ALL 
    ? apps 
    : apps.filter(app => app.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-brand-500 selection:text-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-40 glass-panel border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('showcase')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-brand-500/20">
              V
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">{t.nav.title}<span className="text-primary">{t.nav.titleSuffix}</span></span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button onClick={toggleLanguage} className="text-xs font-bold text-muted-foreground hover:text-foreground uppercase px-2 transition-colors">
               {lang === 'ko' ? 'EN' : 'KR'}
            </button>
            <button 
              onClick={() => setShowKeyModal(true)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all hidden sm:block ${apiKey ? 'border-green-500/30 text-green-400 bg-green-500/10' : 'border-border text-muted-foreground hover:text-foreground'}`}
            >
              {apiKey ? t.nav.apiKeyActive : t.nav.setApiKey}
            </button>
            
            {currentUser ? (
              <>
                <Button onClick={() => setShowRegisterModal(true)} icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                }>
                  {t.nav.submitApp}
                </Button>
                <div className="relative group">
                  <button className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-secondary border border-border hover:border-primary transition-colors">
                    {currentUser.avatarUrl ? (
                      <img src={currentUser.avatarUrl} alt={currentUser.displayName} className="w-6 h-6 rounded-full" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                        {currentUser.displayName?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                    <span className="text-sm font-medium text-foreground hidden md:block">{currentUser.displayName}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="p-3 border-b border-border">
                      <p className="text-sm font-medium text-foreground">{currentUser.displayName}</p>
                      <p className="text-xs text-muted-foreground truncate">{currentUser.email}</p>
                    </div>
                    <button 
                      onClick={handleSignOut}
                      className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-secondary transition-colors"
                    >
                      {lang === 'ko' ? '로그아웃' : 'Sign Out'}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <Button onClick={() => setShowAuthModal(true)}>
                {lang === 'ko' ? '로그인' : 'Sign In'}
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section & Tabs */}
      <div className="pt-32 pb-12 px-4 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-500">
          {t.hero.titlePrefix}<span className="text-white">{t.hero.titleHighlight}</span>{t.hero.titleSuffix}
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-700">
          {t.hero.subtitle}
        </p>

        {/* Main Tab Switcher */}
        <div className="flex justify-center mb-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
          <div className="bg-secondary p-1 rounded-full inline-flex border border-border">
             <button
               onClick={() => setActiveTab('showcase')}
               className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'showcase' ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
             >
               {t.hero.tabShowcase}
             </button>
             <button
               onClick={() => setActiveTab('help')}
               className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'help' ? 'bg-red-500 text-white shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
             >
               {t.hero.tabHelp}
             </button>
             <button
               onClick={() => setActiveTab('requests')}
               className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'requests' ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
             >
               {t.hero.tabRequests}
             </button>
          </div>
        </div>
        
        {/* Categories (Only visible in Showcase) */}
        {activeTab === 'showcase' && (
          <div className="flex flex-wrap justify-center gap-2 mt-2 animate-in fade-in duration-500">
            {Object.values(Category).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === cat 
                    ? 'bg-foreground text-background shadow-lg shadow-white/10' 
                    : 'bg-card border border-border text-muted-foreground hover:border-muted hover:text-foreground'
                }`}
              >
                {categoryLabels[lang][cat]}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        
        {/* Showcase View */}
        {activeTab === 'showcase' && (
          <div className="animate-in fade-in duration-500">
            {filteredApps.length === 0 ? (
              <div className="text-center py-20 opacity-50">
                <p className="text-xl">{t.hero.noApps}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredApps.map((app) => (
                  <AppCard 
                    key={app.id} 
                    app={app} 
                    onClick={(app) => setSelectedApp(app)} 
                    onLike={handleOpenVote}
                    isLiked={likedAppIds.has(app.id)}
                    likeLabel={t.card.likes}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Help Me View */}
        {activeTab === 'help' && (
          <div className="animate-in fade-in duration-500">
             <div className="flex justify-between items-end mb-8 border-b border-border pb-6">
                <div>
                   <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2"><span className="text-red-500">🆘</span> {t.help.title}</h2>
                   <p className="text-muted-foreground text-sm">{t.help.subtitle}</p>
                </div>
                <Button onClick={() => setShowHelpModal(true)} variant="secondary" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
                   {t.help.submit}
                </Button>
             </div>
             
             {helpRequests.length === 0 ? (
               <div className="text-center py-20 bg-card rounded-2xl border border-border border-dashed">
                 <p className="text-muted-foreground mb-4">{t.help.noRequests}</p>
               </div>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {helpRequests.map((req) => (
                   <HelpCard 
                     key={req.id} 
                     request={req} 
                     lang={lang}
                     onViewCode={(r) => setViewingCode(r)}
                   />
                 ))}
               </div>
             )}
          </div>
        )}

        {/* Requests View */}
        {activeTab === 'requests' && (
          <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
             <div className="flex justify-between items-end mb-8 border-b border-border pb-6">
                <div>
                   <h2 className="text-2xl font-bold text-foreground mb-2">{t.requests.title}</h2>
                   <p className="text-muted-foreground text-sm">{t.requests.subtitle}</p>
                </div>
                <Button onClick={() => setShowRequestModal(true)}>
                   {t.requests.submit}
                </Button>
             </div>

             <div className="space-y-4">
                {requests.length === 0 ? (
                  <div className="text-center py-20 bg-card rounded-2xl border border-border border-dashed">
                     <p className="text-muted-foreground mb-4">{t.requests.noRequests}</p>
                     <Button variant="secondary" onClick={() => setShowRequestModal(true)}>{t.requests.submit}</Button>
                  </div>
                ) : (
                  // Sort by votes (descending)
                  [...requests].sort((a, b) => b.votes - a.votes).map((request) => (
                    <RequestCard 
                       key={request.id}
                       request={request}
                       onVote={toggleVote}
                       isVoted={votedRequestIds.has(request.id)}
                       lang={lang}
                    />
                  ))
                )}
             </div>
          </div>
        )}

      </main>

      {/* AI Curator */}
      <AICurator 
        apps={apps} 
        apiKey={apiKey || null} 
        onOpenSettings={() => setShowKeyModal(true)} 
        lang={lang} 
      />

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
        }}
        lang={lang}
      />
      
      <RegisterModal 
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onRegister={handleRegisterApp}
        apiKey={apiKey || null}
        onOpenSettings={() => {
            setShowRegisterModal(false);
            setShowKeyModal(true);
        }}
        lang={lang}
      />
      
      <CreateRequestModal
         isOpen={showRequestModal}
         onClose={() => setShowRequestModal(false)}
         onSubmit={handleCreateRequest}
         lang={lang}
      />
      
      <CreateHelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        onSubmit={handleCreateHelp}
        apiKey={apiKey || null}
        onOpenSettings={() => {
            setShowHelpModal(false);
            setShowKeyModal(true);
        }}
        lang={lang}
      />

      <CodeViewerModal
         isOpen={!!viewingCode}
         onClose={() => setViewingCode(null)}
         code={viewingCode?.codeSnippet || ''}
         title={viewingCode?.appName || ''}
         lang={lang}
      />

      <PriceVotingModal 
         isOpen={!!votingApp}
         onClose={() => setVotingApp(null)}
         app={votingApp}
         onVote={handleSubmitVote}
         lang={lang}
      />

      {/* API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowKeyModal(false)} />
          <div className="relative bg-card p-6 rounded-2xl border border-border shadow-2xl w-full max-w-md">
            <h3 className="text-xl font-bold text-foreground mb-4">{t.keyModal.title}</h3>
            <p className="text-muted-foreground text-sm mb-4">
              {t.keyModal.desc}
            </p>
            <div className="space-y-4">
               <input 
                  type="password"
                  placeholder={t.keyModal.placeholder}
                  className="w-full bg-secondary border border-border rounded-lg px-4 py-2 text-foreground focus:ring-2 focus:ring-primary outline-none"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
               />
               <div className="flex justify-end space-x-3 pt-2">
                 <Button variant="ghost" onClick={() => setShowKeyModal(false)}>{t.keyModal.close}</Button>
                 <Button onClick={() => handleSaveKey(apiKey)}>{t.keyModal.save}</Button>
               </div>
               <div className="text-xs text-muted-foreground mt-2 text-center">
                 <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-primary hover:underline">{t.keyModal.linkText}</a>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* App Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setSelectedApp(null)} />
          <div className="relative bg-card rounded-2xl border border-border shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
            
            <button 
                onClick={() => setSelectedApp(null)}
                className="absolute top-4 right-4 z-10 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors"
            >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* Left Image Section */}
            <div className="w-full md:w-1/2 bg-black flex items-center justify-center p-4 md:p-0 relative">
               <img 
                 src={selectedApp.thumbnailUrl} 
                 alt={selectedApp.name} 
                 className="max-h-[50vh] md:max-h-full w-full object-contain md:object-cover"
               />
               <div className="absolute bottom-4 left-4">
                   <Button 
                      variant="secondary"
                      className="gap-2 bg-green-500/10 text-green-400 border-green-500/50"
                      onClick={(e) => handleOpenVote(e, selectedApp)}
                   >
                     <span className="font-bold">{formatCurrency(calculateValuation(selectedApp.priceVotes))}</span>
                     <span className="text-xs opacity-70">/mo</span>
                   </Button>
               </div>
            </div>

            {/* Right Content Section */}
            <div className="w-full md:w-1/2 p-8 overflow-y-auto bg-card flex flex-col custom-scrollbar">
              <div className="mb-6">
                 <div className="flex flex-wrap gap-2 mb-3">
                   <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded border border-primary/20">
                      {categoryLabels[lang][selectedApp.category]}
                   </span>
                   {selectedApp.tags.map((tag, idx) => (
                      <span key={idx} className="inline-block px-2 py-1 bg-secondary text-muted-foreground text-xs rounded border border-border">
                        #{tag}
                      </span>
                   ))}
                 </div>
                 <h2 className="text-3xl font-bold text-foreground mb-2">{selectedApp.name}</h2>
                 <p className="text-muted-foreground text-sm">{t.detail.by} {selectedApp.author} • {new Date(selectedApp.createdAt).toLocaleDateString()}</p>
              </div>

              <div className="prose prose-invert prose-slate mb-8">
                 <p className="text-slate-300 leading-relaxed">
                    {selectedApp.description}
                 </p>
              </div>

              <div className="mb-8">
                 <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                    <h4 className="text-sm font-semibold text-foreground mb-2">{t.detail.experience}</h4>
                    <p className="text-xs text-muted-foreground mb-4">
                      {t.detail.launchDesc}
                    </p>
                    <a 
                      href={selectedApp.demoUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="block w-full"
                    >
                      <Button className="w-full text-lg h-12">
                        {t.detail.launchBtn}
                      </Button>
                    </a>
                 </div>
              </div>

              {/* Comments Section */}
              <div className="border-t border-border pt-6">
                  <CommentSection 
                    comments={selectedApp.comments} 
                    onAddComment={addComment} 
                    labels={t.comments}
                  />
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;