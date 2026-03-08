import { useEffect, useRef } from "react";

export default function ClaudeParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio, 2);
    const PI2 = Math.PI * 2;
    let w = 0, h = 0, animId: number;
    let cx = 0, cy = 0, hgW = 0, hgH = 0;

    // ═══ 색상 ═══
    const LC = "95, 78, 38";
    const DC = "210, 192, 140";

    // ═══ 상수 ═══
    // 덩어리(clump) = 4×4 도트 그리드, 간격 10px → 덩어리 크기 30×30px
    const DOT_SPACING = 10;      // 덩어리 내 도트 간격
    const CLUMP_DOTS = 4;        // 4×4
    const CLUMP_SIZE = DOT_SPACING * (CLUMP_DOTS - 1); // 30px
    const CLUMP_GAP = 8;         // 덩어리 간 여백
    const CLUMP_STEP = CLUMP_SIZE + CLUMP_GAP; // 38px — 격자 간격
    const DOT_RADIUS_MIN = 1.8;
    const DOT_RADIUS_MAX = 3.0;
    const MAX_RADIUS = DOT_SPACING * 0.45;

    const GRAVITY = 0.12;
    const MAX_SLIDE_SPEED = 2.5;
    const MAX_FUNNEL_SPEED = 3.5;
    const MAX_FALL_SPEED = 5.5;
    const FUNNEL_PULL = 0.04;
    const NECK_THROUGHPUT = 1; // 한 번에 1 덩어리
    const DRAIN_INTERVAL_MIN = 12;
    const DRAIN_INTERVAL_MAX = 22;
    const PAUSE_DURATION = 1.5;
    const FADE_DURATION = 0.6;

    // ═══ 모래시계 실루엣 ═══
    function hgProfile(ny: number): number {
      const ay = Math.abs(ny);
      if (ay < 0.05) return 0.03 + ay * 0.35;
      const t = (ay - 0.05) / 0.95;
      return 0.05 + Math.pow(t, 0.55) * 0.95;
    }

    function hgMaxXAtY(py: number): number {
      const ny = (py - cy) / hgH;
      if (Math.abs(ny) > 1.02) return 0;
      return hgProfile(ny) * hgW;
    }

    // ═══ 데이터 구조: 덩어리(Clump) 기반 ═══
    //
    // 각 clump는 4×4 도트 배열을 가짐
    //   E E E E
    //   E C C E    ← C = core (안정적, 크고 진함)
    //   E C C E    ← E = edge (유동적, 작고 옅음)
    //   E E E E
    //
    // clump가 통째로 state 전이: resting → sliding → funneling → falling → landed

    type ClumpState = "resting" | "sliding" | "funneling" | "falling" | "landed";

    interface SubDot {
      lx: number;  // clump 중심 기준 로컬 x
      ly: number;  // clump 중심 기준 로컬 y
      radius: number;
      phase: number;
      speed: number;
      isCore: boolean;
    }

    interface SandClump {
      id: number;
      x: number;         // 현재 중심 x
      y: number;         // 현재 중심 y
      homeX: number;
      homeY: number;
      targetX: number;
      targetY: number;
      vx: number;
      vy: number;
      state: ClumpState;
      landedAt: number;
      trail: { x: number; y: number }[];
      dots: SubDot[];
      // 그리드 좌표 (clump 단위)
      gridRow: number;
      gridCol: number;
    }

    interface LandingSlot {
      x: number;
      y: number;
      taken: boolean;
    }

    interface EdgeDot {
      x: number;
      y: number;
      baseR: number;
      phase: number;
      speed: number;
    }

    interface AmbientDot {
      x: number;
      y: number;
      r: number;
      phase: number;
      speed: number;
      alpha: number;
    }

    let clumps: SandClump[] = [];
    let landingSlots: LandingSlot[] = [];
    let edgeDots: EdgeDot[] = [];
    let ambientDots: AmbientDot[] = [];
    let gridMap: Map<string, SandClump> = new Map();
    let drainCounter = 0;
    let nextDrainAt = DRAIN_INTERVAL_MIN + Math.random() * (DRAIN_INTERVAL_MAX - DRAIN_INTERVAL_MIN);
    // 이미 빠진 격자 위치 추적 — V자 갭 판정에 사용
    let drainedPositions: Set<string> = new Set();
    let cycleState: "running" | "paused" | "fadeout" | "fadein" = "running";
    let cycleTimer = 0;
    let globalAlpha = 1;
    let lastTime = 0;
    let nextId = 0;

    function gridKey(row: number, col: number): string {
      return `${row},${col}`;
    }

    function makeSubDots(): SubDot[] {
      const dots: SubDot[] = [];
      const half = (CLUMP_DOTS - 1) * DOT_SPACING / 2; // 15
      for (let r = 0; r < CLUMP_DOTS; r++) {
        for (let c = 0; c < CLUMP_DOTS; c++) {
          // 간헐적으로 빈 칸 (자연스러움)
          if (Math.random() > 0.85) continue;
          const lx = c * DOT_SPACING - half;
          const ly = r * DOT_SPACING - half;
          const isCore = r >= 1 && r <= 2 && c >= 1 && c <= 2;
          dots.push({
            lx, ly,
            radius: DOT_RADIUS_MIN + Math.random() * (DOT_RADIUS_MAX - DOT_RADIUS_MIN),
            phase: Math.random() * PI2,
            speed: 2.0 + Math.random() * 3.0,
            isCore,
          });
        }
      }
      return dots;
    }

    function buildClumps() {
      clumps = [];
      landingSlots = [];
      gridMap.clear();
      nextId = 0;

      // 상단 (ny: -0.95 ~ -0.06)
      const topStartY = cy - hgH * 0.95;
      const topEndY = cy - hgH * 0.06;
      let row = 0;

      for (let py = topStartY; py <= topEndY; py += CLUMP_STEP) {
        const maxX = hgMaxXAtY(py) * 0.85;
        if (maxX < CLUMP_SIZE) continue;
        let col = 0;

        for (let px = cx - maxX; px <= cx + maxX; px += CLUMP_STEP) {
          if (Math.abs(px - cx) > maxX) continue;

          const clump: SandClump = {
            id: nextId++,
            x: px, y: py,
            homeX: px, homeY: py,
            targetX: 0, targetY: 0,
            vx: 0, vy: 0,
            state: "resting",
            landedAt: 0,
            trail: [],
            dots: makeSubDots(),
            gridRow: row,
            gridCol: col,
          };

          clumps.push(clump);
          gridMap.set(gridKey(row, col), clump);
          col++;
        }
        row++;
      }

      // 하단 landing slots (ny: +0.06 ~ +0.95), 바닥부터 위로, 중앙부터 바깥
      const bottomStartY = cy + hgH * 0.95;
      const bottomEndY = cy + hgH * 0.06;

      for (let py = bottomStartY; py >= bottomEndY; py -= CLUMP_STEP) {
        const maxX = hgMaxXAtY(py) * 0.85;
        if (maxX < CLUMP_SIZE) continue;

        const positions: number[] = [];
        for (let px = cx; px <= cx + maxX; px += CLUMP_STEP) {
          positions.push(px);
          if (Math.abs(px - cx) > CLUMP_STEP * 0.5) positions.push(cx - (px - cx));
        }
        positions.sort((a, b) => Math.abs(a - cx) - Math.abs(b - cx));

        for (const px of positions) {
          landingSlots.push({ x: px, y: py, taken: false });
        }
      }
    }

    function buildEdgeDots() {
      edgeDots = [];
      const steps = 120;
      for (let i = 0; i <= steps; i++) {
        const ny = -1 + (2 * i) / steps;
        const pw = hgProfile(ny) * hgW;
        const py = cy + ny * hgH;
        const br = 1.0 + Math.random() * 0.8;
        const ph = Math.random() * PI2;
        const sp = 0.3 + Math.random() * 0.6;
        edgeDots.push({ x: cx + pw, y: py, baseR: br, phase: ph, speed: sp });
        edgeDots.push({ x: cx - pw, y: py, baseR: br, phase: ph + 1, speed: sp });
      }
    }

    function buildAmbient() {
      ambientDots = [];
      for (let i = 0; i < 20; i++) {
        const a = Math.random() * PI2;
        const d = 0.32 + Math.random() * 0.5;
        const ax = cx + Math.cos(a) * w * d;
        const ay = cy + Math.sin(a) * h * d * 0.45;
        for (let j = 0; j < 2 + Math.floor(Math.random() * 4); j++) {
          ambientDots.push({
            x: ax + (Math.random() - 0.5) * 45,
            y: ay + (Math.random() - 0.5) * 45,
            r: 0.5 + Math.random() * 2.5,
            phase: Math.random() * PI2,
            speed: 0.15 + Math.random() * 0.3,
            alpha: 0.03 + Math.random() * 0.07,
          });
        }
      }
    }

    // ═══ Step 2+3: 물리 + 가장자리 슬라이드 ═══
    function clamp(v: number, min: number, max: number): number {
      return v < min ? min : v > max ? max : v;
    }

    function isNearNeck(py: number): boolean {
      const ny = (py - cy) / hgH;
      return ny > -0.15 && ny < 0;
    }

    function assignLandingSlot(clump: SandClump): boolean {
      const slot = landingSlots.find(s => !s.taken);
      if (slot) {
        slot.taken = true;
        clump.targetX = slot.x;
        clump.targetY = slot.y;
        return true;
      }
      return false;
    }

    // ═══ 행 단위 드레인 시스템 ═══
    //
    // 1) 현재 바닥행(currentDrainRow)에서 좌/우 교대로 1개씩 빠짐
    // 2) 바닥행이 텅 비면 → 윗줄이 한 칸 내려옴 (settle)
    //    - hourglass 안에 들어가는 것만 내려옴
    //    - 안 들어가는 건 funneling으로 빠짐
    // 3) 내려온 행이 새 바닥행 → 다시 1)

    let nextSide: "left" | "right" = "left";
    let currentDrainRow = -1; // 초기화 시 설정

    function initDrain() {
      // 가장 아래(gridRow가 큰) resting 행을 찾음
      const resting = clumps.filter(c => c.state === "resting");
      if (resting.length === 0) return;
      currentDrainRow = resting.reduce((max, c) => Math.max(max, c.gridRow), 0);
      nextSide = "left";
    }

    function getRowClumps(row: number): SandClump[] {
      return clumps.filter(c => c.state === "resting" && c.gridRow === row);
    }

    // 바닥행이 빠지는 중인지 / 윗줄이 내려오는 중인지
    let phase: "draining" | "settling" = "draining";
    let settleSourceRow = -1; // settle 중: 어느 행에서 내려오는지

    function drainTick() {
      if (currentDrainRow < 0) initDrain();

      if (phase === "draining") {
        // ── 바닥행에서 좌/우 교대로 1개씩 빠짐 ──
        const rowClumps = getRowClumps(currentDrainRow);

        if (rowClumps.length === 0) {
          // 바닥행 완전히 비었으면 → settle 단계로
          phase = "settling";
          settleSourceRow = currentDrainRow - 1;
          nextSide = "left";
          // 바로 settle 시작 (이번 tick에서)
          drainTick();
          return;
        }

        pickAndDrain(rowClumps);

      } else {
        // ── settle: 윗줄에서 1개씩 교대로 내려옴 ──
        const sourceClumps = getRowClumps(settleSourceRow);

        if (sourceClumps.length === 0) {
          // 윗줄도 비었으면 → 그 위를 찾아서 다시 draining
          const resting = clumps.filter(c => c.state === "resting");
          if (resting.length === 0) return;
          currentDrainRow = resting.reduce((max, c) => Math.max(max, c.gridRow), 0);
          phase = "draining";
          nextSide = "left";
          return;
        }

        // 1개씩 교대로 내려보냄
        const targetY = sourceClumps[0].y + CLUMP_STEP;
        const maxXAtTarget = hgMaxXAtY(targetY) * 0.85;

        // 좌/우 교대 선택
        const leftClumps = sourceClumps
          .filter(c => c.x < cx)
          .sort((a, b) => b.x - a.x);
        const rightClumps = sourceClumps
          .filter(c => c.x >= cx)
          .sort((a, b) => a.x - b.x);

        let picked: SandClump | null = null;

        if (nextSide === "left" && leftClumps.length > 0) {
          picked = leftClumps[0];
          nextSide = "right";
        } else if (nextSide === "right" && rightClumps.length > 0) {
          picked = rightClumps[0];
          nextSide = "left";
        } else if (leftClumps.length > 0) {
          picked = leftClumps[0];
          nextSide = "right";
        } else if (rightClumps.length > 0) {
          picked = rightClumps[0];
          nextSide = "left";
        }

        if (picked) {
          gridMap.delete(gridKey(picked.gridRow, picked.gridCol));

          // hourglass 안에 들어가는지
          if (maxXAtTarget > CLUMP_SIZE && Math.abs(picked.x - cx) <= maxXAtTarget) {
            // 한 칸 아래로 sliding
            picked.state = "sliding";
            assignLandingSlot(picked);
          } else {
            // 밖이면 funneling으로 빠짐
            picked.state = "funneling";
            assignLandingSlot(picked);
          }
        }

        // 윗줄 다 내려왔으면 → 새 바닥행에서 draining 재개
        if (getRowClumps(settleSourceRow).length === 0) {
          currentDrainRow = settleSourceRow;
          phase = "draining";
          nextSide = "left";
        }
      }
    }

    // 행에서 좌/우 교대로 1개 선택 → sliding
    function pickAndDrain(rowClumps: SandClump[]) {
      const leftClumps = rowClumps
        .filter(c => c.x < cx)
        .sort((a, b) => b.x - a.x);
      const rightClumps = rowClumps
        .filter(c => c.x >= cx)
        .sort((a, b) => a.x - b.x);

      let picked: SandClump | null = null;

      if (nextSide === "left" && leftClumps.length > 0) {
        picked = leftClumps[0];
        nextSide = "right";
      } else if (nextSide === "right" && rightClumps.length > 0) {
        picked = rightClumps[0];
        nextSide = "left";
      } else if (leftClumps.length > 0) {
        picked = leftClumps[0];
        nextSide = "right";
      } else if (rightClumps.length > 0) {
        picked = rightClumps[0];
        nextSide = "left";
      }

      if (picked) {
        picked.state = "sliding";
        assignLandingSlot(picked);
        const key = gridKey(picked.gridRow, picked.gridCol);
        gridMap.delete(key);
        drainedPositions.add(key);
      }
    }

    function updatePhysics(now: number) {
      for (const c of clumps) {
        // trail
        if (c.state === "funneling" || c.state === "falling") {
          c.trail.unshift({ x: c.x, y: c.y });
          if (c.trail.length > 3) c.trail.pop();
        }

        switch (c.state) {
          case "resting":
            break;

          case "sliding": {
            // 아래+중앙 방향으로 미끄러짐
            c.vy += GRAVITY * 0.5;
            c.vy = Math.min(c.vy, MAX_SLIDE_SPEED);

            const dxToCenter = cx - c.x;
            c.vx += dxToCenter * FUNNEL_PULL * 0.5;
            c.vx *= 0.92;

            c.x += c.vx;
            c.y += c.vy;

            // 벽면 충돌
            const maxX = hgMaxXAtY(c.y) * 0.85;
            if (maxX > 0) {
              c.x = clamp(c.x, cx - maxX, cx + maxX);
            }

            // 목 근처 도달 → funneling
            const ny = (c.y - cy) / hgH;
            if (ny > -0.08) {
              c.state = "funneling";
            }
            break;
          }

          case "funneling": {
            const dxToNeck = cx - c.x;
            c.vx += dxToNeck * 0.15;
            c.vx *= 0.85;
            c.vy += GRAVITY * 0.8;
            c.vy = Math.min(c.vy, MAX_FUNNEL_SPEED);
            c.x += c.vx;
            c.y += c.vy;

            const nyF = (c.y - cy) / hgH;
            if (nyF > 0.02) {
              c.state = "falling";
            }
            break;
          }

          case "falling": {
            c.vy += GRAVITY;
            c.vy = Math.min(c.vy, MAX_FALL_SPEED);
            c.x += Math.sin(now * 3 + (c.dots[0]?.phase || 0)) * 0.5;
            c.y += c.vy;

            const maxXF = hgMaxXAtY(c.y) * 0.85;
            if (maxXF > 0) {
              c.x = clamp(c.x, cx - maxXF, cx + maxXF);
            }

            if (c.y >= c.targetY) {
              c.y = c.targetY;
              c.x = c.targetX;
              c.state = "landed";
              c.vy = 0;
              c.vx = 0;
              c.landedAt = now;
              c.trail = [];
            }
            break;
          }

          case "landed":
            break;
        }
      }
    }

    // ═══ 렌더링 ═══
    function renderClump(clump: SandClump, t: number, now: number) {
      for (const dot of clump.dots) {
        const breath = Math.sin(t * dot.speed + dot.phase) * 0.5 + 0.5;

        let radius: number, alpha: number;
        if (dot.isCore) {
          radius = dot.radius * (0.85 + breath * 0.15);
          alpha = 0.6 + breath * 0.2;
        } else {
          radius = dot.radius * 0.6 * (0.3 + breath * 0.7);
          alpha = 0.2 + breath * 0.2;
        }
        radius = Math.min(radius, MAX_RADIUS);

        // funneling squeeze
        if (clump.state === "funneling") {
          const neckDist = Math.abs(clump.y - cy) / (hgH * 0.1);
          const neckProx = Math.max(0, 1 - neckDist);
          radius *= 0.6 + 0.4 * (1 - neckProx);
        }

        // landed 착지 펄스
        if (clump.state === "landed") {
          const timeSinceLanding = now - clump.landedAt;
          const landPulse = Math.max(0, 1 - timeSinceLanding / 1.0);
          alpha += landPulse * 0.4;
        }

        alpha *= globalAlpha;
        if (alpha < 0.01 || radius < 0.1) continue;

        const dx = clump.x + dot.lx;
        const dy = clump.y + dot.ly;

        // falling stretch
        if (clump.state === "falling") {
          const stretchY = radius * (1 + Math.min(clump.vy * 0.05, 0.8));
          ctx.beginPath();
          ctx.ellipse(dx, dy, radius, stretchY, 0, 0, PI2);
        } else {
          ctx.beginPath();
          ctx.arc(dx, dy, radius, 0, PI2);
        }
        ctx.fillStyle = `rgba(${DC}, ${alpha})`;
        ctx.fill();
      }

      // trail (덩어리 전체의 잔상)
      if (clump.state === "funneling" || clump.state === "falling") {
        for (let i = 0; i < clump.trail.length; i++) {
          const tr = clump.trail[i];
          const trailAlpha = 0.12 * (1 - i / clump.trail.length) * globalAlpha;
          if (trailAlpha < 0.01) continue;
          // trail은 core dot만 간략히
          for (const dot of clump.dots) {
            if (!dot.isCore) continue;
            const trailR = dot.radius * 0.5 * (1 - i / clump.trail.length);
            if (trailR < 0.1) continue;
            ctx.beginPath();
            ctx.arc(tr.x + dot.lx, tr.y + dot.ly, trailR, 0, PI2);
            ctx.fillStyle = `rgba(${DC}, ${trailAlpha})`;
            ctx.fill();
          }
        }
      }
    }

    function drawBackground(t: number) {
      const maxR = Math.max(w, h) * 0.65;
      for (const r of [0.12, 0.24, 0.38, 0.54, 0.72, 0.92]) {
        ctx.beginPath();
        ctx.arc(cx, cy, maxR * r, 0, PI2);
        ctx.strokeStyle = `rgba(${LC}, ${r < 0.4 ? 0.13 : 0.075})`;
        ctx.lineWidth = r < 0.3 ? 1.3 : 1;
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(cx + w * 0.17, cy - h * 0.14, maxR * 0.48, 0, PI2);
      ctx.strokeStyle = `rgba(${LC}, 0.06)`;
      ctx.lineWidth = 0.9;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx - w * 0.12, cy + h * 0.19, maxR * 0.62, 0, PI2);
      ctx.strokeStyle = `rgba(${LC}, 0.04)`;
      ctx.lineWidth = 0.9;
      ctx.stroke();

      ctx.strokeStyle = `rgba(${LC}, 0.055)`;
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, h);
      ctx.stroke();
      ctx.strokeStyle = `rgba(${LC}, 0.04)`;
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(w, cy);
      ctx.stroke();

      for (const a of [0.5, -0.5, 1.1, -1.1]) {
        ctx.beginPath();
        ctx.moveTo(cx - Math.cos(a) * maxR * 1.2, cy - Math.sin(a) * maxR * 1.2);
        ctx.lineTo(cx + Math.cos(a) * maxR * 1.2, cy + Math.sin(a) * maxR * 1.2);
        ctx.strokeStyle = `rgba(${LC}, 0.025)`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      for (let i = 0; i < 3; i++) {
        const cyc = ((t * 0.055 + i * 4) % 16) / 16;
        const r = cyc * maxR * 1.3;
        const a = 0.12 * Math.pow(1 - cyc, 2);
        if (a > 0.003) {
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, PI2);
          ctx.strokeStyle = `rgba(140, 118, 50, ${a})`;
          ctx.lineWidth = 1.4;
          ctx.stroke();
        }
      }
    }

    function drawEdge(t: number) {
      for (const ed of edgeDots) {
        const breath = Math.sin(t * ed.speed + ed.phase) * 0.5 + 0.5;
        const r = ed.baseR * (0.7 + breath * 0.3);
        const a = (0.3 + breath * 0.15) * globalAlpha;
        if (a < 0.01) continue;
        ctx.beginPath();
        ctx.arc(ed.x, ed.y, r, 0, PI2);
        ctx.fillStyle = `rgba(${DC}, ${a})`;
        ctx.fill();
      }
    }

    function drawAmbient(t: number) {
      for (const d of ambientDots) {
        const breath = Math.sin(t * d.speed + d.phase);
        const a = d.alpha * (0.8 + breath * 0.2) * globalAlpha;
        if (a < 0.01) continue;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r * (1 + breath * 0.2), 0, PI2);
        ctx.fillStyle = `rgba(${DC}, ${a})`;
        ctx.fill();
      }
    }

    // ═══ Step 6: 사이클 루프 + 메인 루프 ═══
    function draw(timestamp: number) {
      const now = timestamp / 1000;
      const dt = lastTime ? now - lastTime : 1 / 60;
      lastTime = now;

      ctx.clearRect(0, 0, w, h);

      if (cycleState === "running") {
        drainCounter++;
        if (drainCounter >= nextDrainAt) {
          drainTick();
          drainCounter = 0;
          nextDrainAt = DRAIN_INTERVAL_MIN + Math.random() * (DRAIN_INTERVAL_MAX - DRAIN_INTERVAL_MIN);
        }
        updatePhysics(now);

        const allLanded = clumps.length > 0 && clumps.every(c => c.state === "landed");
        if (allLanded) {
          cycleState = "paused";
          cycleTimer = 0;
        }
      } else if (cycleState === "paused") {
        cycleTimer += dt;
        if (cycleTimer >= PAUSE_DURATION) {
          cycleState = "fadeout";
          cycleTimer = 0;
        }
      } else if (cycleState === "fadeout") {
        cycleTimer += dt;
        globalAlpha = Math.max(0, 1 - cycleTimer / FADE_DURATION);
        if (globalAlpha <= 0) {
          // 리셋
          clumps.forEach(c => {
            c.x = c.homeX;
            c.y = c.homeY;
            c.state = "resting";
            c.vx = 0;
            c.vy = 0;
            c.trail = [];
            c.landedAt = 0;
          });
          // gridMap 재구축
          gridMap.clear();
          for (const c of clumps) {
            gridMap.set(gridKey(c.gridRow, c.gridCol), c);
          }
          landingSlots.forEach(s => s.taken = false);
          drainedPositions.clear();
          currentDrainRow = -1;
          drainCounter = 0;
          cycleState = "fadein";
          cycleTimer = 0;
        }
      } else if (cycleState === "fadein") {
        cycleTimer += dt;
        globalAlpha = Math.min(1, cycleTimer / FADE_DURATION);
        if (globalAlpha >= 1) {
          globalAlpha = 1;
          cycleState = "running";
        }
      }

      drawBackground(now);
      drawEdge(now);

      for (const c of clumps) {
        renderClump(c, now, now);
      }

      drawAmbient(now);
      animId = requestAnimationFrame(draw);
    }

    function resize() {
      const p = canvas.parentElement!;
      w = p.clientWidth;
      h = p.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = w / 2;
      cy = h * 0.46;
      hgW = Math.min(w * 0.36, 460);
      hgH = h * 0.44;

      buildClumps();
      buildEdgeDots();
      buildAmbient();

      cycleState = "running";
      globalAlpha = 1;
      drainCounter = 0;
      lastTime = 0;
    }

    resize();
    animId = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-[2] pointer-events-none" />;
}
