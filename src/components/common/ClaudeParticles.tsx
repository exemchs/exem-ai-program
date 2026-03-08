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

    // ═══ 그리드/물리 상수 ═══
    const GRID_SPACING = 10;
    const DOT_RADIUS_MIN = 1.8;
    const DOT_RADIUS_MAX = 3.0;
    const MAX_RADIUS = GRID_SPACING * 0.45; // 겹침 방지: 4.5px

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

    // ═══ Step 1: SandDot + 덩어리(Clump) 시스템 ═══
    //
    // 계획서 Phase 3-1:
    //   4×4 덩어리 기준
    //   E E E E
    //   E C C E    ← C = core (4개)
    //   E C C E    ← E = edge
    //   E E E E
    //
    // isCore = clump 내부 중심 2×2 → 크고 진하고 안정적
    // !isCore = clump 가장자리 → 작고 옅고 유동적

    type DotState = "resting" | "sliding" | "funneling" | "falling" | "landed";

    interface SandDot {
      id: number;
      x: number;
      y: number;
      homeX: number;
      homeY: number;
      targetX: number;
      targetY: number;
      vx: number;
      vy: number;
      radius: number;
      phase: number;
      speed: number;
      state: DotState;
      isCore: boolean;
      landedAt: number;
      trail: { x: number; y: number }[];
      // 그리드 좌표 (행/열 인덱스) — 이웃 탐색용
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

    let dots: SandDot[] = [];
    let landingSlots: LandingSlot[] = [];
    let edgeDots: EdgeDot[] = [];
    let ambientDots: AmbientDot[] = [];
    // gridMap: gridRow,gridCol → dot (빠른 이웃 탐색)
    let gridMap: Map<string, SandDot> = new Map();
    let nextId = 0;

    function gridKey(row: number, col: number): string {
      return `${row},${col}`;
    }

    function rebuildGridMap() {
      gridMap.clear();
      for (const d of dots) {
        if (d.state === "resting") {
          gridMap.set(gridKey(d.gridRow, d.gridCol), d);
        }
      }
    }

    // 덩어리 내 위치 판정: 4×4 블록에서 중심 2×2 = core
    function isCorePosition(localRow: number, localCol: number): boolean {
      return localRow >= 1 && localRow <= 2 && localCol >= 1 && localCol <= 2;
    }

    function buildDots() {
      dots = [];
      landingSlots = [];
      gridMap.clear();
      nextId = 0;

      // 상단 그리드 (ny: -0.95 ~ -0.06)
      const topStartY = cy - hgH * 0.95;
      const topEndY = cy - hgH * 0.06;

      // 그리드 행/열 인덱스 계산
      const baseRow = Math.floor(topStartY / GRID_SPACING);
      const baseColCenter = Math.floor(cx / GRID_SPACING);

      for (let py = topStartY; py <= topEndY; py += GRID_SPACING) {
        const maxX = hgMaxXAtY(py) * 0.88;
        if (maxX < GRID_SPACING) continue;
        const row = Math.round((py - topStartY) / GRID_SPACING);

        for (let px = cx - maxX; px <= cx + maxX; px += GRID_SPACING) {
          // 실루엣 내부만
          if (Math.abs(px - cx) > maxX) continue;

          const col = Math.round((px - cx) / GRID_SPACING);
          // 4×4 clump 내 로컬 위치
          const localRow = ((row % 4) + 4) % 4;
          const localCol = ((col % 4) + 4) % 4;
          const isCore = isCorePosition(localRow, localCol);

          const dot: SandDot = {
            id: nextId++,
            x: px,
            y: py,
            homeX: px,
            homeY: py,
            targetX: 0,
            targetY: 0,
            vx: 0,
            vy: 0,
            radius: DOT_RADIUS_MIN + Math.random() * (DOT_RADIUS_MAX - DOT_RADIUS_MIN),
            phase: Math.random() * PI2,
            speed: 2.0 + Math.random() * 3.0,
            state: "resting",
            isCore,
            landedAt: 0,
            trail: [],
            gridRow: row,
            gridCol: col,
          };

          dots.push(dot);
          gridMap.set(gridKey(row, col), dot);
        }
      }

      // 하단 landing slots (ny: +0.06 ~ +0.95), 바닥부터 위로, 중앙부터 바깥으로
      const bottomStartY = cy + hgH * 0.95;
      const bottomEndY = cy + hgH * 0.06;

      for (let py = bottomStartY; py >= bottomEndY; py -= GRID_SPACING) {
        const maxX = hgMaxXAtY(py) * 0.88;
        if (maxX < GRID_SPACING) continue;

        const positions: number[] = [];
        for (let px = cx; px <= cx + maxX; px += GRID_SPACING) {
          positions.push(px);
          if (px !== cx) positions.push(cx - (px - cx));
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

    // ═══ Step 2: 기본 물리 — funneling + falling + 착지 ═══
    const GRAVITY = 0.12;
    const MAX_FUNNEL_SPEED = 3.5;
    const MAX_FALL_SPEED = 5.5;
    const NECK_THROUGHPUT = 2;
    const DRAIN_INTERVAL_MIN = 3;
    const DRAIN_INTERVAL_MAX = 7;
    let drainCounter = 0;
    let nextDrainAt = DRAIN_INTERVAL_MIN + Math.random() * (DRAIN_INTERVAL_MAX - DRAIN_INTERVAL_MIN);

    function clamp(v: number, min: number, max: number): number {
      return v < min ? min : v > max ? max : v;
    }

    function isNearNeck(py: number): boolean {
      const ny = (py - cy) / hgH;
      return ny > -0.12 && ny < 0;
    }

    function assignLandingSlot(dot: SandDot): boolean {
      const slot = landingSlots.find(s => !s.taken);
      if (slot) {
        slot.taken = true;
        dot.targetX = slot.x;
        dot.targetY = slot.y;
        return true;
      }
      return false;
    }

    // 목 근처 resting → funneling (Step 2 한정: 가장자리 슬라이드 없이 목 근처만)
    function drainTick() {
      const neckDots = dots.filter(d =>
        d.state === "resting" && isNearNeck(d.y)
      );
      neckDots.sort((a, b) => b.y - a.y);
      const toFunnel = neckDots.slice(0, NECK_THROUGHPUT);
      for (const d of toFunnel) {
        d.state = "funneling";
        assignLandingSlot(d);
        gridMap.delete(gridKey(d.gridRow, d.gridCol));
      }
    }

    function updatePhysics(now: number) {
      for (const dot of dots) {
        // trail 기록
        if (dot.state === "funneling" || dot.state === "falling") {
          dot.trail.unshift({ x: dot.x, y: dot.y });
          if (dot.trail.length > 3) dot.trail.pop();
        }

        switch (dot.state) {
          case "resting":
            break;

          case "funneling": {
            const dxToNeck = cx - dot.x;
            dot.vx += dxToNeck * 0.15;
            dot.vx *= 0.85;
            dot.vy += GRAVITY * 0.8;
            dot.vy = Math.min(dot.vy, MAX_FUNNEL_SPEED);
            dot.x += dot.vx;
            dot.y += dot.vy;

            const nyF = (dot.y - cy) / hgH;
            if (nyF > 0.02) {
              dot.state = "falling";
            }
            break;
          }

          case "falling": {
            dot.vy += GRAVITY;
            dot.vy = Math.min(dot.vy, MAX_FALL_SPEED);
            dot.x += Math.sin(now * 3 + dot.phase) * 0.5;
            dot.y += dot.vy;

            const maxXF = hgMaxXAtY(dot.y) * 0.88;
            if (maxXF > 0) {
              dot.x = clamp(dot.x, cx - maxXF, cx + maxXF);
            }

            if (dot.y >= dot.targetY) {
              dot.y = dot.targetY;
              dot.x = dot.targetX;
              dot.state = "landed";
              dot.vy = 0;
              dot.vx = 0;
              dot.landedAt = now;
              dot.trail = [];
            }
            break;
          }

          case "landed":
            break;
        }
      }
    }

    // ═══ 렌더링 ═══
    let globalAlpha = 1;

    function renderDot(dot: SandDot, t: number, now: number) {
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
      if (dot.state === "funneling") {
        const neckDist = Math.abs(dot.y - cy) / (hgH * 0.1);
        const neckProx = Math.max(0, 1 - neckDist);
        radius *= 0.6 + 0.4 * (1 - neckProx);
      }

      // landed 착지 펄스
      if (dot.state === "landed") {
        const timeSinceLanding = now - dot.landedAt;
        const landPulse = Math.max(0, 1 - timeSinceLanding / 1.0);
        alpha += landPulse * 0.4;
      }

      alpha *= globalAlpha;
      if (alpha < 0.01 || radius < 0.1) return;

      // falling stretch
      if (dot.state === "falling") {
        const stretchY = radius * (1 + Math.min(dot.vy * 0.05, 0.8));
        ctx.beginPath();
        ctx.ellipse(dot.x, dot.y, radius, stretchY, 0, 0, PI2);
        ctx.fillStyle = `rgba(${DC}, ${alpha})`;
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, radius, 0, PI2);
        ctx.fillStyle = `rgba(${DC}, ${alpha})`;
        ctx.fill();
      }

      // trail
      if (dot.state === "funneling" || dot.state === "falling") {
        for (let i = 0; i < dot.trail.length; i++) {
          const tr = dot.trail[i];
          const trailAlpha = 0.15 * (1 - i / dot.trail.length) * globalAlpha;
          const trailR = radius * 0.6 * (1 - i / dot.trail.length);
          if (trailAlpha < 0.01 || trailR < 0.1) continue;
          ctx.beginPath();
          ctx.arc(tr.x, tr.y, trailR, 0, PI2);
          ctx.fillStyle = `rgba(${DC}, ${trailAlpha})`;
          ctx.fill();
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
        const a = 0.3 + breath * 0.15;
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
        const a = d.alpha * (0.8 + breath * 0.2);
        if (a < 0.01) continue;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r * (1 + breath * 0.2), 0, PI2);
        ctx.fillStyle = `rgba(${DC}, ${a})`;
        ctx.fill();
      }
    }

    // ═══ 메인 루프 ═══
    function draw(timestamp: number) {
      const now = timestamp / 1000;
      ctx.clearRect(0, 0, w, h);

      // 드레인 tick
      drainCounter++;
      if (drainCounter >= nextDrainAt) {
        drainTick();
        drainCounter = 0;
        nextDrainAt = DRAIN_INTERVAL_MIN + Math.random() * (DRAIN_INTERVAL_MAX - DRAIN_INTERVAL_MIN);
      }

      updatePhysics(now);

      drawBackground(now);
      drawEdge(now);

      for (const dot of dots) {
        renderDot(dot, now, now);
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

      buildDots();
      buildEdgeDots();
      buildAmbient();
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
