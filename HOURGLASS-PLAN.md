# Hourglass Particle Animation 구현 계획서

## 목표
레퍼런스 이미지처럼 **실제로 모래가 위에서 아래로 흘러내리며 쌓이는** 도트 매트릭스 모래시계 구현

## 현재 문제 요약
- 상단 모래가 줄어들지 않음 (정적 breathing만)
- 하단 모래가 쌓이지 않음 (sin파 flickering)
- 낙하 알갱이가 상단과 연결되지 않음 (허공에서 스폰)
- 시간 진행(progression) 개념 자체가 없음

---

## 구현 방식: Canvas 2D (현행 유지)

Three.js 전환 불필요. 현재 Canvas 2D가 이 효과에 더 적합함.
- 2D 도트 그리드 → Canvas 2D로 충분
- Three.js는 3D 깊이/조명이 필요할 때만 가치 있음
- 성능도 Canvas 2D가 이 케이스에서 우월

---

## 핵심 물리 모델: 실제 모래시계처럼 동작

### 절대 원칙: "허공 스폰 금지"

모든 모래 알갱이는 **물리적으로 연속된 개체**다.
상단에 있던 도트가 **그 자체로** 목을 통과해서 하단에 쌓인다.
"사라졌다가 다른 곳에서 생성"이 아니라, **같은 도트가 위치를 이동**한다.

### 실제 모래시계 물리 원리

```
1. 목(neck) 바로 위 도트가 아래에 빈 공간이 있으므로 중력으로 빠짐
2. 그 도트가 빠지면 바로 위 도트가 아래로 밀려 내려옴
3. 이 연쇄가 위로 전파됨 → 상단 표면이 서서히 내려감
4. 목을 통과한 도트는 하단에서 쌓임
```

핵심: **목 근처에서 빨려 들어가며 위쪽이 따라 내려오는** 느낌.
수위선이 내려가는 게 아니라, 목 근처부터 도트가 하나씩 빠지고 위가 무너져 내리는 것.

---

## Phase 1: 도트 시스템 설계

### 1-1. 모래시계 형태 (Silhouette)

현재 `hgProfile()` 함수 기본 형태 유지하되 조정:

```
ny = -1 (상단 끝) → 넓은 폭
ny = 0  (목/waist) → 최소 폭 (도트 1~2개 통과 가능)
ny = +1 (하단 끝) → 넓은 폭
```

프로파일 함수:
- |ny| < 0.05: 목 부분, 좁은 통로 (도트 1~2개 폭)
- |ny| > 0.05: 급격히 확장 → `pow(t, 0.55)` 곡선

### 1-2. 도트 구조 (통합 — 상단/하단 구분 없음)

```typescript
interface SandDot {
  id: number;
  x: number;          // 현재 x 위치 (실시간 변경됨)
  y: number;          // 현재 y 위치 (실시간 변경됨)
  homeX: number;      // 그리드 원래 x (상단 기준)
  homeY: number;      // 그리드 원래 y (상단 기준)
  targetX: number;    // 하단 착지 목표 x
  targetY: number;    // 하단 착지 목표 y
  vx: number;         // x 속도
  vy: number;         // y 속도
  radius: number;
  phase: number;      // breathing 위상
  speed: number;      // breathing 속도
  state: 'resting'    // 상단에서 대기 중
       | 'sliding'    // 목 방향으로 미끄러져 내려가는 중
       | 'funneling'  // 목으로 빨려 들어가는 중
       | 'falling'    // 목 통과 후 자유낙하
       | 'landed';    // 하단에 착지 완료
}
```

**모든 도트는 하나의 배열에서 관리.** 상단/하단 분리 배열 없음.
도트가 상단에 있다가 → 미끄러지고 → 목을 통과하고 → 하단에 착지.
**동일 개체가 전체 여정을 수행.**

### 1-3. 초기 배치

```
GRID_SPACING = 10px (도트 간격)
DOT_RADIUS = 2~3px (기본 크기)
```

**상단 영역** (ny: -0.95 ~ -0.06):
- 격자 좌표마다 도트 생성, 모래시계 실루엣 내부만
- state = 'resting'
- (x, y) = (homeX, homeY)

**하단 착지 좌표 사전 계산:**
- 하단 영역 (ny: +0.06 ~ +0.95)에도 동일한 격자 좌표 생성
- 이 좌표들을 "착지 슬롯(landing slots)" 배열로 관리
- 바닥부터 순서대로 배정됨 (아래 행 → 위 행)

---

## Phase 2: 물리 기반 모래 흐름

### 2-1. 드레인 순서 결정 (어떤 도트가 먼저 빠지나)

실제 모래시계에서 모래는 **목에 가장 가까운 알갱이**부터 빠진다.
그리고 그 빈 자리를 위의 알갱이가 채운다.

```
드레인 우선순위:
1. 목(ny=0) 바로 위에 있는 resting 도트 → 가장 먼저 funneling 진입
2. 그 위 행의 도트 → sliding 상태로 아래 빈자리 방향 이동
3. 연쇄적으로 위쪽까지 전파
```

**구현 방식 — 간소화된 물리:**

매 프레임(또는 일정 tick 간격)마다:
```typescript
// 1. 목 바로 위 도트 중 resting인 것 → funneling으로 전환
//    (한 번에 1~2개씩, 목 폭 제한)
const neckDots = dots.filter(d =>
  d.state === 'resting' && isNearNeck(d.y)
);
// 가장 아래(y가 큰)부터 선택
neckDots.sort((a, b) => b.y - a.y);
const toFunnel = neckDots.slice(0, NECK_THROUGHPUT); // 1~2개
toFunnel.forEach(d => d.state = 'funneling');

// 2. funneling 도트 위에 빈 공간 생김 → 바로 위 도트가 sliding
//    "아래에 빈 자리가 있는 resting 도트" 찾기
for (each resting dot, bottom-up) {
  if (아래 인접 칸이 비어있음) {
    dot.state = 'sliding';
    dot.targetY = 아래 빈 칸 y;
  }
}
```

### 2-2. 상태별 물리 동작

#### `resting` (상단 대기)
```
- 위치 고정 (homeX, homeY)
- breathing 애니메이션만 적용
- 주변이 비면 sliding으로 전환 대기
```

#### `sliding` (아래로 밀려 내려감)
```
- 목 방향(아래)으로 서서히 이동
- 속도: 느림 (0.3~0.8 px/frame)
- 모래시계 벽면을 따라 기울어지며 내려옴
  → x도 목 중심 방향으로 수렴
- 목 근처(ny ≈ -0.08) 도달 시 → funneling으로 전환
```

핵심 — **sliding은 자유낙하가 아님**:
실제 모래시계에서 모래 덩어리는 마찰 때문에 천천히 미끄러진다.
"쏟아지는" 게 아니라 "밀려 내려가는" 느낌.

```typescript
// sliding 물리
dot.vy += GRAVITY * 0.3;  // 약한 중력 (마찰 반영)
dot.vy = Math.min(dot.vy, MAX_SLIDE_SPEED);  // 속도 제한

// x는 목 중심으로 수렴
const dxToCenter = cx - dot.x;
dot.vx += dxToCenter * FUNNEL_PULL;  // 약한 수평 끌림
dot.vx *= 0.95;  // 감쇠

dot.x += dot.vx;
dot.y += dot.vy;

// 모래시계 벽면 충돌 — 벽 밖으로 나가지 않도록
const maxX = hgMaxX(dot.y);
dot.x = clamp(dot.x, cx - maxX, cx + maxX);
```

#### `funneling` (목으로 빨려 들어감)
```
- 목 중심(cx, cy)으로 강하게 수렴
- x: 중심으로 빠르게 수렴 (좁은 통로니까)
- y: 가속하며 아래로
- 도트 크기가 살짝 줄어듦 (squeeze 효과)
- 목 통과 (ny > 0.02) → falling으로 전환
```

```typescript
// funneling 물리
const dxToNeck = cx - dot.x;
dot.vx += dxToNeck * 0.15;  // 강한 수평 수렴
dot.vx *= 0.85;  // 빠른 감쇠 → 중심 수렴

dot.vy += GRAVITY * 0.8;  // 더 강한 중력
dot.vy = Math.min(dot.vy, MAX_FUNNEL_SPEED);

dot.x += dot.vx;
dot.y += dot.vy;

// 렌더링 시 squeeze
const neckProximity = 1 - Math.abs(dot.y - cy) / (hgH * 0.1);
dot.renderRadius = dot.radius * (0.6 + 0.4 * (1 - neckProximity));
```

#### `falling` (자유낙하 — 목 통과 후)
```
- 중력 가속 (실제 자유낙하 느낌)
- 약간의 좌우 wobble (공기저항/난류)
- 하단 착지 슬롯의 y에 도달 → landed로 전환
```

```typescript
// falling 물리
dot.vy += GRAVITY;  // 풀 중력
dot.vy = Math.min(dot.vy, MAX_FALL_SPEED);

// wobble
dot.x += Math.sin(time * 3 + dot.phase) * 0.8;
dot.y += dot.vy;

// 착지 판정
if (dot.y >= dot.targetY) {
  dot.y = dot.targetY;
  dot.x = dot.targetX;
  dot.state = 'landed';
  dot.vy = 0;
  dot.vx = 0;
}
```

#### `landed` (하단 착지)
```
- 위치 고정 (targetX, targetY)
- breathing 애니메이션 재개
- 착지 순간 alpha 펄스 (밝아졌다 안정)
- 착지 시간 기록 → 펄스 감쇠에 사용
```

```typescript
// 착지 직후 1초간 밝은 펄스
const timeSinceLanding = now - dot.landedAt;
const landPulse = Math.max(0, 1 - timeSinceLanding / 1.0);
dot.renderAlpha = dot.baseAlpha + landPulse * 0.4;
```

### 2-3. 착지 슬롯(Landing Slot) 배정

하단 격자 좌표를 미리 생성하고, 아래 행부터 순서대로 배정:

```typescript
// 하단 슬롯 생성 (초기화 시)
const landingSlots: { x: number; y: number; taken: boolean }[] = [];
// ny: +0.95(바닥) → +0.06(목 바로 아래) 순서로
for (let row = bottomRow; row >= topRow; row--) {
  for (each grid position in row) {
    landingSlots.push({ x, y, taken: false });
  }
}

// 도트가 falling 상태 진입 시 슬롯 배정
function assignLandingSlot(dot: SandDot) {
  const slot = landingSlots.find(s => !s.taken);
  if (slot) {
    slot.taken = true;
    dot.targetX = slot.x;
    dot.targetY = slot.y;
  }
}
```

**쌓이는 순서:** 바닥 중앙 → 바닥 가장자리 → 한 행 위 중앙 → ... (피라미드처럼)

---

## Phase 3: 시각 효과 레이어

### 3-1. 덩어리(Clump) 내부 구조 — 중심/가장자리 차등

각 도트는 단독이 아니라 **덩어리(clump) 단위**로 인식되어야 함.
격자 내에서 인접한 도트들이 하나의 덩어리를 형성.

**중심 도트 (clump 내부, ~4개):**
- 크기: baseRadius × 1.0 (최대)
- opacity: 0.6~0.8 (진함)
- breathing 진폭: 작음 (0.85~1.0 범위, 안정적)
- 역할: 덩어리의 "핵"

**가장자리 도트 (clump 외곽):**
- 크기: baseRadius × 0.5~0.7 (작음)
- opacity: 0.2~0.4 (옅음)
- breathing 진폭: 큼 (0.3~1.0 범위, 거의 사라졌다 나타남)
- 역할: 덩어리 주변의 "먼지/안개" 느낌

```typescript
// 각 도트 생성 시 clump 내 위치 판정
interface SandDot {
  // ... 기존 필드
  isCore: boolean;  // true = 중심 4개, false = 가장자리
}

// 격자 생성 시: 2×2 중심 영역 = core, 나머지 = edge
// 예: 4×4 덩어리 기준
//   E E E E
//   E C C E    ← C = core (4개)
//   E C C E    ← E = edge
//   E E E E
```

### 3-1-1. 겹침 방지 (절대 규칙)

**도트가 breathing으로 커져도 인접 도트와 겹쳐서는 안 됨.**

```typescript
// 최대 반지름 제한
const MAX_RADIUS = GRID_SPACING * 0.45;
// GRID_SPACING = 10px → MAX_RADIUS = 4.5px
// 인접 도트 간 최소 간격 = 10 - 4.5*2 = 1px (겹침 없음)

// breathing 시 반지름 계산
const breathedRadius = dot.baseRadius * (minScale + breath * amplitude);
const clampedRadius = Math.min(breathedRadius, MAX_RADIUS);
```

이렇게 하면 아무리 커져도 격자 간격의 90%를 넘지 않으므로 겹침 불가.

### 3-1-2. 도트 렌더링

```typescript
function renderDot(dot: SandDot, t: number) {
  const breath = sin(t * dot.speed + dot.phase) * 0.5 + 0.5;

  let radius, alpha;
  if (dot.isCore) {
    // 중심: 안정적, 크고 진함
    radius = dot.baseRadius * (0.85 + breath * 0.15);
    alpha = 0.6 + breath * 0.2;
  } else {
    // 가장자리: 유동적, 작고 옅음
    radius = dot.baseRadius * 0.6 * (0.3 + breath * 0.7);
    alpha = 0.2 + breath * 0.2;
  }

  // 겹침 방지
  radius = Math.min(radius, MAX_RADIUS);

  // 상태별 시각 변형
  if (dot.state === 'funneling') {
    radius *= 0.6 + 0.4 * neckDistance;  // squeeze
  }
  if (dot.state === 'falling') {
    // 세로 스트레치 (잔상)
    drawEllipse(dot.x, dot.y, radius, radius * (1 + dot.vy * 0.05));
  }
  if (dot.state === 'landed') {
    alpha += landPulse * 0.4;  // 착지 펄스
  }

  ctx.arc(dot.x, dot.y, radius, 0, PI2);
  ctx.fillStyle = rgba(DC, alpha);
}
```

### 3-2. 목 통과 스트림 강조

목 부근에 미세한 trail 효과:
- funneling/falling 도트의 이전 위치 2~3개를 작고 투명하게 렌더
- 연속적인 "모래 줄기"처럼 보이게 함

```typescript
// 각 도트에 trail 기록
interface SandDot {
  // ... 기존 필드
  trail: { x: number; y: number }[];  // 최근 3프레임 위치
}

// 렌더링 시
if (dot.state === 'funneling' || dot.state === 'falling') {
  for (let i = 0; i < dot.trail.length; i++) {
    const t = dot.trail[i];
    const trailAlpha = 0.15 * (1 - i / dot.trail.length);
    const trailR = dot.radius * 0.6 * (1 - i / dot.trail.length);
    ctx.arc(t.x, t.y, trailR, 0, PI2);
    ctx.fillStyle = rgba(DC, trailAlpha);
  }
}
```

### 3-3. 윤곽선 (Edge Outline)

현재 edgeDots 방식 유지하되 개선:
- 점선 간격 균일하게 (현재 80 steps → 120+)
- 목 부근 점이 더 밀집
- breathing 속도를 본체 도트보다 느리게

### 3-4. 배경 장식

현재 구현된 동심원/십자선/대각선 유지 (잘 되어 있음):
- 동심원 6개 + 오프셋 원 2개
- 중심 십자선
- 대각 보조선 4개
- 확장 펄스 3개

### 3-5. 앰비언트 파티클

현재 ambient dots 유지:
- 모래시계 바깥 궤도를 도는 느낌
- alpha 범위: 0.02~0.08

---

## Phase 4: 가장자리 슬라이드 시스템 (핵심 난이도)

이 파트가 "실제 모래시계처럼 보이느냐"를 결정함.

### 4-1. 핵심 원리: 양쪽 경사면 가장자리만 움직인다

실제 모래시계를 관찰하면:
- 중앙 도트는 목 바로 위에 있으므로 **수직으로 바로 빠짐**
- 양쪽 경사면에 있는 도트는 **경사를 따라 굴러 내려옴**
- **가장자리(표면) 도트만 움직이고, 내부 도트는 그 위에 얹혀 있을 뿐**

모든 도트가 동시에 연쇄 sliding하면 복잡하고 시각적 노이즈가 생김.
대신 **V자 표면의 좌측 끝 + 우측 끝 도트만 하나씩** 밀려 내려오게 한다.

### 4-2. 상단 모래 형태 변화

```
시간 0:    ████████████████    ← 가득 참
시간 1:    ███████  ███████    ← 중앙 목 위 도트 먼저 빠짐
시간 2:    ██████    ██████    ← V자 형성
시간 3:    █████  ↙  ↘  █████  ← 양쪽 끝 도트가 경사면 타고 하나씩 내려옴
시간 4:    ████        ████
...
시간 N:    ██            ██    ← 양 끝 꼭대기만 남음 → 이것도 결국 빠짐
```

### 4-3. 드레인 로직 (단순화)

**매 tick마다 수행하는 작업:**

```typescript
// STEP 1: 목 바로 위 도트 → 바로 funneling (중앙 수직 낙하)
// 이 도트들은 경사면 이동 없이 바로 빠짐
const centerDots = findRestingDotsNearNeck();
centerDots.forEach(d => { d.state = 'funneling'; });

// STEP 2: V자 경사면의 표면 도트(가장자리) 탐색
// "현재 표면"이란 = 해당 열(column)에서 가장 아래에 있는 resting 도트
// V자 좌측: 표면 도트 중 가장 오른쪽(중앙에 가까운) 것
// V자 우측: 표면 도트 중 가장 왼쪽(중앙에 가까운) 것

const leftEdgeDot = findLeftSurfaceEdge();   // V자 왼편 끝
const rightEdgeDot = findRightSurfaceEdge(); // V자 오른편 끝

// STEP 3: 가장자리 도트 하나를 sliding으로 전환
// 교대로 또는 양쪽 동시에 (자연스러움에 따라 조정)
if (leftEdgeDot) leftEdgeDot.state = 'sliding';
if (rightEdgeDot) rightEdgeDot.state = 'sliding';
```

**"표면 가장자리" 찾기 알고리즘:**

```typescript
function findSurfaceEdgeDots(): SandDot[] {
  // 1. 모든 resting 도트를 행(y)별로 그룹화
  // 2. V자 빈 공간(중앙)에 인접한 도트 = 표면 도트
  // 3. 그 중 가장 아래 행에서 좌측 끝 / 우측 끝 선택

  // 간소화 버전:
  // V자의 "내부 경사면"에 있는 도트 = x가 중앙에 가까운 resting 도트 중
  // 바로 아래가 비어있는 도트
  return dots.filter(d =>
    d.state === 'resting' &&
    아래_인접_위치가_비어있음(d) &&  // 경사면 = 아래가 빈 곳
    Math.abs(d.x - cx) < threshold  // 중앙 근처 (V자 내부면)
  );
}
```

### 4-4. Sliding 경로 — 경사면 따라 내려가기

가장자리 도트는 **수직 낙하가 아님**. 모래시계 내벽 경사를 따라 미끄러짐:

```typescript
// sliding 도트의 이동 경로
// 1. 경사면 기울기 계산 (현재 y에서의 모래시계 프로파일 기울기)
// 2. 기울기 방향으로 이동 (아래 + 중앙 방향)
// 3. 목 근처 도달 시 funneling으로 전환

dot.vy += GRAVITY * 0.3;  // 약한 중력
dot.vy = Math.min(dot.vy, MAX_SLIDE_SPEED);

// 중앙(목) 방향으로 부드럽게 수렴
const pullToCenter = (cx - dot.x) * FUNNEL_PULL * 0.5;
dot.vx += pullToCenter;
dot.vx *= 0.92;  // 감쇠 — 급격히 꺾이지 않게

dot.x += dot.vx;
dot.y += dot.vy;
```

**시각적 효과:**
마치 모래 알갱이가 경사면을 또르르 굴러 내려가는 느낌.
한 번에 하나씩이므로 개별 도트의 이동이 뚜렷하게 보임.

### 4-5. 쓰루풋 제어 + 속도감

**중요: 느릿느릿하면 안 된다.**
이 페이지에서 사용자가 오래 멈춰있지 않으므로 유동적이고 빠른 느낌이 필요.

```
DRAIN_TICK = 매 3~5 프레임마다 1회 (60fps 기준 ~12~20회/초)
가장자리 도트: 좌1~2 + 우1~2 = 2~4개/tick
중앙 수직 도트: 1~2개/tick

총 ~4~6개/tick × 15tick/초 = ~60~90개/초
상단 도트 총 ~200개 → ~2.5~3.5초 사이클 (빠름!)
```

**속도 튜닝 가이드라인:**
- 전체 사이클: **8~12초** 정도가 적절 (너무 빠르면 정신없고, 너무 느리면 지루)
- sliding 속도: 1.5~3.0 px/frame (현재 0.3~0.8은 너무 느림)
- falling 속도: 3.0~6.0 px/frame (체감 가속도)
- funneling: 2.0~4.0 px/frame
- breathing 속도: 빠르게 (speed: 2.0~5.0) → 살아있는 느낌

**"유동적" 느낌 만들기:**
- 정적인 resting 도트도 breathing이 활발해야 함
- 한 번에 여러 도트가 동시에 움직여야 흐름이 느껴짐
- sliding + funneling + falling이 동시에 여러 개 진행 중이어야 함

### 4-6. 자연스러움을 위한 디테일

- **tick 간격에 약간의 랜덤성** 추가 (8~12 프레임 사이 변동)
- **좌우 교대가 완벽히 대칭이면 기계적** → 가끔 한쪽이 2개 연속 빠지기도
- **같은 행에 도트가 여러 개면** 가장 안쪽(중앙에 가까운) 것부터 빠짐
- **마지막 몇 개 도트**: 양 끝 꼭대기에 고립된 도트 → 직접 sliding 없이 resting에서 바로 funneling (더 이상 경사면이 없으므로)

---

## Phase 5: 루프 & 리셋

### 전체 사이클:
```
1. 시작: 모든 도트 resting (상단), 하단 슬롯 비어있음
2. 진행: ~8~12초에 걸쳐 전체 이동 (빠르고 유동적)
3. 완료: 모든 도트 landed (하단)
4. 대기: 1.5초 유지
5. 리셋: 전체 alpha fade out (0.6초) → 위치 리셋 → fade in (0.6초)
6. 반복
```

### 리셋 로직:
```typescript
if (allDotsLanded && pauseTimer > PAUSE_DURATION) {
  // fade out
  globalAlpha -= 0.02;
  if (globalAlpha <= 0) {
    // 위치 리셋
    dots.forEach(d => {
      d.x = d.homeX;
      d.y = d.homeY;
      d.state = 'resting';
      d.vy = 0; d.vx = 0;
    });
    landingSlots.forEach(s => s.taken = false);
    // fade in
    fadingIn = true;
  }
}
```

---

## Phase 6: 성능 최적화

### 렌더링
- Canvas 2D `arc()` 사용
- 도트 수: ~200개 + 엣지 ~240개 + 앰비언트 ~50개 = ~490개
- trail 포함해도 ~600 draw call — Canvas 2D에서 60fps 여유

### 최적화 포인트
- `fillStyle` 변경 최소화: alpha를 4~5단계로 양자화
- 같은 alpha 도트를 하나의 path에 모아서 한 번에 fill
- DPR 제한: max 2

---

## 구현 순서 (작업 단계)

### Step 1: 도트 시스템 재구성
- [ ] SandDot 인터페이스 정의 (state machine 포함)
- [ ] 상단 그리드 생성 (모래시계 실루엣 내부)
- [ ] 하단 landing slots 생성
- [ ] 기존 Cell/SubDot/BottomClump 구조 전부 제거

### Step 2: 기본 물리 — 빠짐 + 낙하
- [ ] 목 근처 resting 도트 → funneling 전환
- [ ] funneling 물리 (목 중심 수렴 + 하방 가속)
- [ ] falling 물리 (자유낙하 + wobble)
- [ ] 착지 판정 + landed 전환

### Step 3: 가장자리 슬라이드
- [ ] V자 표면 가장자리 도트 탐색 로직
- [ ] 좌/우 가장자리 도트만 sliding 전환
- [ ] 경사면 따라 미끄러지는 물리 (아래+중앙 방향)
- [ ] 중앙 수직 도트는 바로 funneling
- [ ] tick 간격 랜덤성 + 좌우 비대칭

### Step 4: 하단 쌓임
- [ ] landing slot 배정 로직
- [ ] 바닥부터 차곡차곡 쌓이는 순서
- [ ] 착지 alpha 펄스

### Step 5: 시각 효과
- [ ] trail 렌더링 (funneling/falling 도트)
- [ ] funneling squeeze 효과
- [ ] falling stretch 효과
- [ ] edge dots + background 유지

### Step 6: 루프 + 폴리싱
- [ ] 사이클 완료 감지 + 리셋
- [ ] fade out/in 트랜지션
- [ ] breathing 미세조정
- [ ] 모바일 반응형

---

## 파일 구조

```
src/components/common/ClaudeParticles.tsx  ← 이 파일만 전면 재작성
```

별도 파일 분리 불필요. 단일 컴포넌트 내에서 모든 로직 처리.
HeroSection.tsx는 수정 불필요.

---

## 레퍼런스 대조 체크리스트

- [ ] 상단 모래가 **목 근처부터** 빠지며 역V자로 줄어드는가
- [ ] 개별 도트가 **직접 이동**하여 목을 통과하는가 (허공 스폰 없음)
- [ ] 위 도트가 빈자리를 채우며 **연쇄적으로 밀려 내려오는가**
- [ ] 목 통과 시 squeeze + 가속이 느껴지는가
- [ ] 하단에 **바닥부터 차곡차곡** 쌓이는가
- [ ] 목을 통과하는 모래 줄기(trail)가 연속적으로 보이는가
- [ ] 도트 매트릭스(점 그리드) 스타일이 유지되는가
- [ ] 전체 사이클이 자연스럽게 반복되는가
- [ ] 배경 동심원/가이드라인이 유지되는가
- [ ] 텍스트 배치 (모래시계 양옆)와 충돌 없는가
