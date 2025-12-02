import { Category, RequestStatus } from './types';

export const categoryLabels = {
  ko: {
    [Category.ALL]: '전체',
    [Category.PRODUCTIVITY]: '생산성',
    [Category.ENTERTAINMENT]: '엔터테인먼트',
    [Category.UTILITIES]: '유틸리티',
    [Category.AI_TOOLS]: 'AI 도구',
    [Category.FINANCE]: '금융',
    [Category.LIFESTYLE]: '라이프스타일'
  },
  en: {
    [Category.ALL]: 'All',
    [Category.PRODUCTIVITY]: 'Productivity',
    [Category.ENTERTAINMENT]: 'Entertainment',
    [Category.UTILITIES]: 'Utilities',
    [Category.AI_TOOLS]: 'AI Tools',
    [Category.FINANCE]: 'Finance',
    [Category.LIFESTYLE]: 'Lifestyle'
  }
};

export const statusLabels = {
  ko: {
    [RequestStatus.PENDING]: '대기중',
    [RequestStatus.IN_PROGRESS]: '개발중',
    [RequestStatus.COMPLETED]: '완료'
  },
  en: {
    [RequestStatus.PENDING]: 'Pending',
    [RequestStatus.IN_PROGRESS]: 'In Dev',
    [RequestStatus.COMPLETED]: 'Done'
  }
};

export const translations = {
  ko: {
    nav: {
      title: "바이브",
      titleSuffix: "쇼룸",
      setApiKey: "API 키 설정",
      apiKeyActive: "API 키 사용 중",
      submitApp: "앱 등록",
      language: "Language"
    },
    hero: {
      titlePrefix: "",
      titleHighlight: "바이브 코딩",
      titleSuffix: " 시대를 경험하세요",
      subtitle: "아이디어와 AI가 만나 탄생한 앱들의 쇼케이스. 당신의 창작물을 등록하고 전 세계와 공유하세요.",
      noApps: "이 카테고리에 등록된 앱이 없습니다.",
      tabShowcase: "앱 쇼룸",
      tabHelp: "도와주세요",
      tabRequests: "요청 게시판",
    },
    requests: {
      title: "앱 아이디어 요청",
      subtitle: "이런 앱이 있었으면 좋겠다! 아이디어를 공유하고 투표하세요.",
      submit: "아이디어 제안",
      vote: "투표",
      noRequests: "아직 등록된 요청이 없습니다. 첫 번째 아이디어를 제안해보세요!",
      createTitle: "앱 아이디어 제안하기",
      titleLabel: "제목",
      titlePlaceholder: "예: AI 식단 관리 앱",
      descLabel: "설명",
      descPlaceholder: "어떤 기능이 필요한지 자세히 설명해주세요...",
      authorLabel: "제안자",
      authorPlaceholder: "닉네임",
      submitBtn: "등록하기"
    },
    help: {
      title: "도와주세요",
      subtitle: "버그 수정부터 기능 구현까지, 동료 개발자들에게 도움을 요청하세요.",
      submit: "도움 요청하기",
      noRequests: "도움이 필요한 프로젝트가 없습니다.",
      createTitle: "도움 요청 등록",
      problemLabel: "문제 설명",
      problemPlaceholder: "어떤 부분이 잘 안되시나요? 구체적으로 적어주세요.",
      sourceUrlLabel: "소스 코드 URL (GitHub/Zip)",
      sourceUrlPlaceholder: "https://...",
      codeSnippetLabel: "코드 스니펫 (주요 문제 코드)",
      codeSnippetPlaceholder: "여기에 코드를 붙여넣으세요...",
      viewCode: "코드 보기",
      downloadSource: "소스 다운로드",
      copyCode: "코드 복사",
      copied: "복사됨!"
    },
    card: {
      likes: "좋아요",
      valuation: "시장 가치",
      vote: "평가하기"
    },
    valuation: {
      modalTitle: "이 앱의 가치는 얼마일까요?",
      desc: "이 서비스를 이용하기 위해 매월 지불할 의향이 있는 구독료를 투표해주세요. 극단적인 투표값(상/하위 2개)은 평균 계산에서 제외됩니다.",
      priceLabel: "월 구독료 (USD)",
      submit: "투표하기",
      currentAvg: "현재 시장 가치",
      votes: "표"
    },
    register: {
      title: "앱 등록하기",
      name: "앱 이름",
      namePlaceholder: "예: TaskMaster AI",
      category: "카테고리",
      tags: "태그 (쉼표로 구분)",
      tagsPlaceholder: "예: React, Gemini, Tailwind",
      demoUrl: "데모 / 프로젝트 URL",
      demoUrlPlaceholder: "https://...",
      author: "제작자 이름",
      authorPlaceholder: "당신의 이름",
      description: "설명",
      descriptionPlaceholder: "앱의 기능과 분위기를 설명해주세요...",
      thumbnail: "썸네일",
      noThumbnail: "썸네일 없음",
      generate: "AI로 생성하기",
      regenerate: "다시 생성",
      generating: "생성 중...",
      requiresKey: "API 키 필요",
      cancel: "취소",
      submit: "앱 등록",
      errorFill: "모든 필드를 입력해주세요.",
      errorDesc: "이름과 설명을 먼저 입력해주세요.",
      errorGen: "썸네일 생성 실패. API 키를 확인하세요."
    },
    comments: {
      title: "댓글",
      reply: "답글달기",
      placeholder: "댓글을 입력하세요...",
      nickname: "닉네임",
      post: "등록",
      cancel: "취소",
      noComments: "아직 댓글이 없습니다. 첫 번째 댓글을 남겨보세요!"
    },
    keyModal: {
      title: "Gemini API 설정",
      desc: "AI 썸네일 생성 및 AI 도슨트 기능을 위해 Gemini API 키가 필요합니다. 키는 브라우저에만 저장됩니다.",
      placeholder: "API 키를 입력하세요 (AIza...)",
      save: "저장",
      close: "닫기",
      linkText: "여기서 발급받으세요"
    },
    detail: {
      by: "제작:",
      experience: "체험하기",
      launchDesc: "앱을 실행하여 기능을 체험해보세요. API 키가 필요한 앱은 별도 입력이 필요할 수 있습니다.",
      launchBtn: "앱 실행하기 🚀"
    },
    curator: {
      title: "AI 도슨트",
      placeholder: "어떤 앱을 찾고 계신가요?",
      send: "전송",
      welcome: "안녕하세요! 저는 이 쇼룸의 AI 도슨트입니다. 기분이나 상황을 말씀해주시면 딱 맞는 앱을 추천해드릴게요.",
      errorKey: "AI 추천을 받으려면 상단 메뉴에서 API 키를 설정해주세요.",
      thinking: "앱을 찾는 중..."
    }
  },
  en: {
    nav: {
      title: "Vibe",
      titleSuffix: "Showroom",
      setApiKey: "Set API Key",
      apiKeyActive: "API Key Active",
      submitApp: "Submit App",
      language: "언어"
    },
    hero: {
      titlePrefix: "Discover the ",
      titleHighlight: "Vibe Coding",
      titleSuffix: " Era",
      subtitle: "A community showroom for applications built with speed, creativity, and AI. Explore, test, and share your creations in seconds.",
      noApps: "No apps found in this category.",
      tabShowcase: "App Showcase",
      tabHelp: "Help Me",
      tabRequests: "Request Board",
    },
    requests: {
      title: "App Requests",
      subtitle: "Share your app ideas and vote for the next big thing.",
      submit: "Submit Idea",
      vote: "Vote",
      noRequests: "No requests yet. Be the first to suggest an idea!",
      createTitle: "Submit App Idea",
      titleLabel: "Title",
      titlePlaceholder: "e.g., AI Diet Planner",
      descLabel: "Description",
      descPlaceholder: "Describe the features you need...",
      authorLabel: "Author",
      authorPlaceholder: "Nickname",
      submitBtn: "Submit"
    },
    help: {
      title: "Help Me",
      subtitle: "Stuck on a bug? Need code review? Ask the community.",
      submit: "Request Help",
      noRequests: "No help requests found.",
      createTitle: "Create Help Request",
      problemLabel: "Problem Description",
      problemPlaceholder: "Describe the issue in detail...",
      sourceUrlLabel: "Source Code URL (GitHub/Zip)",
      sourceUrlPlaceholder: "https://...",
      codeSnippetLabel: "Code Snippet",
      codeSnippetPlaceholder: "Paste your code here...",
      viewCode: "View Code",
      downloadSource: "Download Source",
      copyCode: "Copy Code",
      copied: "Copied!"
    },
    card: {
      likes: "Likes",
      valuation: "Market Value",
      vote: "Rate"
    },
    valuation: {
      modalTitle: "What is this app worth?",
      desc: "Vote on the monthly subscription price you would be willing to pay. Outliers (top/bottom 2) are removed from the average.",
      priceLabel: "Monthly Subscription (USD)",
      submit: "Submit Vote",
      currentAvg: "Current Market Value",
      votes: "votes"
    },
    register: {
      title: "Register Your App",
      name: "App Name",
      namePlaceholder: "e.g., TaskMaster AI",
      category: "Category",
      tags: "Tags (comma separated)",
      tagsPlaceholder: "e.g., React, Gemini, Tailwind",
      demoUrl: "Demo / Project URL",
      demoUrlPlaceholder: "https://...",
      author: "Author Name",
      authorPlaceholder: "Your Name",
      description: "Description",
      descriptionPlaceholder: "Describe your app features and vibe...",
      thumbnail: "Thumbnail",
      noThumbnail: "No thumbnail yet",
      generate: "Generate with AI",
      regenerate: "Regenerate",
      generating: "Generating...",
      requiresKey: "Requires API Key",
      cancel: "Cancel",
      submit: "Register App",
      errorFill: "All fields are required.",
      errorDesc: "Please fill in Name and Description first.",
      errorGen: "Failed to generate thumbnail. Check your API Key."
    },
    comments: {
      title: "Comments",
      reply: "Reply",
      placeholder: "Add a comment...",
      nickname: "Nickname",
      post: "Post",
      cancel: "Cancel",
      noComments: "No comments yet. Be the first to share your thoughts!"
    },
    keyModal: {
      title: "Gemini API Configuration",
      desc: "To use AI features like automatic thumbnail generation and AI Curator, please provide your Google Gemini API Key. The key is stored locally in your browser.",
      placeholder: "Paste your API Key here (starts with AIza...)",
      save: "Save Key",
      close: "Close",
      linkText: "Get one here"
    },
    detail: {
      by: "By",
      experience: "Experience",
      launchDesc: "Launch the application to explore its features. If the app requires an API key, you may need to provide your own within the app interface.",
      launchBtn: "Launch App 🚀"
    },
    curator: {
      title: "AI Curator",
      placeholder: "What kind of app are you looking for?",
      send: "Send",
      welcome: "Hi! I'm your AI Curator. Tell me how you're feeling or what you need, and I'll recommend the perfect app.",
      errorKey: "Please set your API Key in the top menu to use AI recommendations.",
      thinking: "Finding apps..."
    }
  }
};