#Firebase Studio
This is a NextJS starter in Firebase Studio.

## 폴더 구조 및 주요 파일

```
├── src
│   ├── app
│   │   ├── layout.tsx         # 전체 레이아웃 컴포넌트
│   │   ├── page.tsx           # 메인 페이지 컴포넌트
│   │   ├── favicon.ico        # 파비콘
│   │   └── globals.css        # 전역 스타일
│   ├── components
│   │   ├── ui/                # UI 공통 컴포넌트
│   │   ├── todo/              # Todo 관련 컴포넌트
│   │   ├── pomodoro/          # 뽀모도로 타이머 컴포넌트
│   │   ├── stats-display.tsx  # 통계 표시 컴포넌트
│   │   └── settings-dialog.tsx# 설정 다이얼로그
│   ├── hooks
│   │   ├── use-toast.ts       # 토스트 알림 훅
│   │   ├── use-pomodoro-store.ts # 뽀모도로 상태 관리 훅
│   │   └── use-mobile.tsx     # 모바일 감지 훅
│   ├── lib
│   │   └── utils.ts           # 유틸리티 함수
│   └── ai
│       ├── genkit.ts          # AI 관련 설정
│       └── dev.ts             # AI 개발용 진입점
├── docs
│   └── blueprint.md           # 설계 문서
├── .vscode
│   └── settings.json          # VSCode 설정
├── package.json               # 프로젝트 메타/의존성
├── tsconfig.json              # TypeScript 설정
├── tailwind.config.ts         # TailwindCSS 설정
├── next.config.ts             # Next.js 설정
├── postcss.config.mjs         # PostCSS 설정
└── README.md                  # 프로젝트 소개 및 구조
```

각 폴더와 파일에 대한 자세한 설명은 주석(#)을 참고하세요.

To get started, take a look at src/app/page.tsx.
