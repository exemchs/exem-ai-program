# 디자인 리뉴얼 구현 계획

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 랜딩페이지의 Hero를 그래디언트 스크롤 효과로 교체하고, 카피를 압축하고, 디자인 톤을 업그레이드한다.

**Architecture:** Unicorn Studio 임베드를 제거하고 순수 CSS 그래디언트 + scroll 이벤트 기반 애니메이션으로 Hero를 재구성. 각 섹션 카피를 MUJI+현대카드 톤으로 교체. 여백/타이포/카드 스타일 전체 조정.

**Tech Stack:** React, Tailwind CSS 4, Motion (framer-motion), Vite

---

### Task 1: Unicorn Studio 제거 + CSS 정리

**Files:**
- Delete: `src/components/common/UnicornEmbed.tsx`
- Modify: `src/components/sections/HeroSection.tsx` (UnicornEmbed import/사용 제거)
- Modify: `src/index.css` (Unicorn Studio 관련 CSS 제거)

**Step 1: HeroSection에서 UnicornEmbed 제거**

`src/components/sections/HeroSection.tsx`에서:
- `import UnicornEmbed from "../common/UnicornEmbed"` 제거
- `<UnicornEmbed />` JSX 제거
- `{/* Watermark Cover */}` div 제거

**Step 2: index.css 정리**

`src/index.css`에서:
- `/* Hide Unicorn Studio Logo */` 블록 제거
- `.light-theme [data-us-project]` 블록 제거

**Step 3: UnicornEmbed.tsx 파일 삭제**

**Step 4: 빌드 확인**

Run: `pnpm build`
Expected: 에러 없이 빌드 성공

**Step 5: 커밋**

```
정리(Hero): Unicorn Studio 임베드 제거
```

---

### Task 2: Hero 그래디언트 스크롤 효과 구현

**Files:**
- Modify: `src/components/sections/HeroSection.tsx` (전체 재작성)

**Step 1: HeroSection을 그래디언트 스크롤 방식으로 재작성**

구현 사양:
- 외부 컨테이너: `h-[240vh]` relative
- 내부 sticky 컨테이너: `h-screen sticky top-0` — 화면에 고정
- `useEffect`로 scroll 이벤트 리스너 등록, scrollY 기반으로 progress (0~1) 계산
- progress에 따라 CSS `background` 그래디언트 색상 보간:
  - 0%: `#1a0a00` (짙은 다크)
  - 50%: `#8b4513 → #e67e22` (오렌지 전환)
  - 100%: `#fef9f0` (밝은 크림)
- 텍스트 opacity: progress 0~0.7에서 1, 0.7~1에서 fade out
- 배지, 타이틀, 서브카피는 기존 구조 유지
- 서브카피 변경: "Claude Code, 같이 시작하면 됩니다."
- 다크/라이트 토글 유지

**Step 2: 브라우저에서 스크롤 동작 확인**

Run: `pnpm dev`
확인: 스크롤 시 그래디언트가 어두운 오렌지 → 밝은 크림으로 전환, 텍스트 sticky 고정

**Step 3: 커밋**

```
기능(Hero): 그래디언트 스크롤 효과 구현
```

---

### Task 3: 카피 압축 — WhyNow, WhatWeLearn

**Files:**
- Modify: `src/components/sections/WhyNowSection.tsx`
- Modify: `src/components/sections/WhatWeLearnSection.tsx`

**Step 1: WhyNowSection 카피 교체**

카드 desc 변경:
- "매일 기술을 만드는 사람들" → desc: "기술을 만드는 사람이, 도구를 가장 잘 압니다."
- "앱 채팅을 넘어서는 시점" → desc: "채팅은 해봤습니다. 그 다음이 궁금한 시점입니다."
- "미루면 격차가 됩니다" → desc: "도구는 미루는 순간, 거리가 됩니다."

**Step 2: WhatWeLearnSection 카피 교체**

- SectionHeading 아래 첫 번째 `<p>`: "코드가 아니라, 일하는 방식을 바꾸는 겁니다."
- 두 번째 `<p>`: "하고 싶은 일을 말로 전하면 됩니다."

**Step 3: 브라우저에서 확인**

**Step 4: 커밋**

```
개선(카피): WhyNow, WhatWeLearn 섹션 카피 압축
```

---

### Task 4: 카피 압축 — OneMoreThing, Footer, FAQ

**Files:**
- Modify: `src/components/sections/OneMoreThingSection.tsx`
- Modify: `src/components/sections/FooterSection.tsx`
- Modify: `src/components/sections/FAQSection.tsx`

**Step 1: OneMoreThingSection 카피 압축**

- SectionHeading: "하나를 익히면, 그 다음은 스스로 찾게 됩니다."
- 에이전트 팀 카드 `<p>`: "여러 Claude Code를 동시에 띄워, 각각 다른 역할을 맡깁니다."
- 자동화 파이프라인 카드 `<p>`: "Skill, MCP, CLAUDE.md를 조합해 반복 업무를 자동화합니다."

**Step 2: FooterSection 카피 교체**

- 서브카피 `<p>`: "처음이라 같이 합니다. 그래서 쉬워집니다."

**Step 3: FAQSection 답변 압축**

- 결제: "Cursor는 무료입니다. Claude Pro($20/월) 구독이 필요합니다."
- 코딩: "코딩 지식 없이, 한국어로 진행됩니다."
- 막힘: "에러 메시지를 Claude에게 보여주면 됩니다. 그래도 어려우면 조현서 그룹장에게 문의하세요."
- Windows: "가능합니다. '사전 세팅'에서 Windows 탭을 확인해주세요."

**Step 4: 브라우저에서 확인**

**Step 5: 커밋**

```
개선(카피): OneMoreThing, Footer, FAQ 카피 압축
```

---

### Task 5: 디자인 톤 업그레이드 — 여백, 타이포, 카드

**Files:**
- Modify: `src/components/common/SectionHeading.tsx`
- Modify: `src/components/sections/WhyNowSection.tsx`
- Modify: `src/components/sections/WhatWeLearnSection.tsx`
- Modify: `src/components/sections/OneMoreThingSection.tsx`
- Modify: `src/components/sections/FAQSection.tsx`
- Modify: `src/components/sections/CurriculumSection.tsx`
- Modify: `src/components/sections/ShortcutsSection.tsx`
- Modify: `src/index.css`

**Step 1: 섹션 여백 확대**

모든 섹션: `py-32` → `py-40`

**Step 2: SectionHeading 타이포 조정**

- `tracking-tight` → `tracking-tighter`
- `mb-16 md:mb-24` → `mb-20 md:mb-28`

**Step 3: 카드 스타일 통일**

WhyNow, OneMoreThing 카드:
- `border-white/5` → `border-white/[0.04]`
- hover glow: `rgba(249,115,22,0.15)` → `rgba(249,115,22,0.08)`

**Step 4: light-theme 제거**

Unicorn Studio가 없으므로 light theme의 invert 핵이 불필요. `index.css`에서 `.light-theme` 관련 전부 제거. `App.tsx`에서 isDarkMode state와 토글 로직 제거. HeroSection에서 isDarkMode prop과 라이트 그래디언트 분기 제거.

**Step 5: 브라우저에서 전체 확인**

**Step 6: 커밋**

```
개선(디자인): 여백, 타이포, 카드 스타일 업그레이드
```

---

### Task 6: 최종 빌드 + 배포

**Step 1: 빌드 확인**

Run: `pnpm build`
Expected: 에러 없이 성공

**Step 2: 커밋 + 푸시**

```
git push origin main
```

Vercel 자동 배포 확인.
