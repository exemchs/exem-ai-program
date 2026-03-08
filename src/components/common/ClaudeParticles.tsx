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
    const LC = "255, 255, 255";
    const DC = "255, 255, 255";

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

    const GRAVITY = 0.4;
    const MAX_SLIDE_SPEED = 7.0;
    const MAX_FUNNEL_SPEED = 9.0;
    const MAX_FALL_SPEED = 12.0;
    const FUNNEL_PULL = 0.13;
    const NECK_THROUGHPUT = 1;
    const DRAIN_INTERVAL = 2; // 고정 간격 — 모든 행 동일 속도
    const PAUSE_DURATION = 0.8;
    const FADE_DURATION = 0.3;

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

    type ClumpState = "resting" | "sliding" | "settling" | "shifting" | "fading" | "funneling" | "falling" | "landed";

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
      // settling: 한 칸 아래로 내려갈 목표
      settleToY: number;
      settleToRow: number;
      // fading: edge 넘어간 덩어리 자연스럽게 사라짐
      fadeAlpha: number;
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
      posAlpha: number; // 위치 기반 opacity (상하단 진하고 중앙 옅음)
      alwaysBright: boolean; // true면 항상 최대 opacity
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
            settleToY: 0,
            settleToRow: 0,
            fadeAlpha: 1,
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
      // 간격: 알갱이 최대 반지름 ~5px → 직경 10px, 겹치지 않게
      const dotSpacing = 11;
      const totalH = hgH * 2;
      const steps = Math.floor(totalH / dotSpacing);
      // 3줄: 바깥으로 간격 11px씩 (겹치지 않게)
      const offsets = [0, 11, 22];

      for (let i = 0; i <= steps; i++) {
        const ny = -1 + (2 * i) / steps;
        const pw = hgProfile(ny) * hgW;
        const py = cy + ny * hgH;

        // 위치 기반 opacity: 중앙(ny=0) 가장 진하고, 상하단(ny=±1)으로 갈수록 옅어짐
        const posAlpha = 0.7 - Math.abs(ny) * 0.4; // 중앙 0.7 → 상하단 0.3

        // 끝 10% 구간(|ny| > 0.9)에서만 밀도 감소 → 라인 끝이 자연스럽게 사라짐
        const absNy = Math.abs(ny);
        const keepChance = absNy > 0.9
          ? 1.0 - (absNy - 0.9) / 0.1 * 0.8  // 0.9→1.0: 100%→20%
          : 1.0;

        // 가장자리로 갈수록 바깥 레이어 탈락 → 라인이 얇아짐
        // |ny| < 0.5: 3줄 모두, 0.5~0.8: 2줄, 0.8~1.0: 1줄
        const maxLayers = absNy > 0.8 ? 1 : absNy > 0.5 ? 2 : 3;

        for (let layer = 0; layer < Math.min(offsets.length, maxLayers); layer++) {
          if (Math.random() > keepChance) continue; // 가장자리 탈락
          const off = offsets[layer];
          const layerScale = 1 - layer * 0.15;
          const br = (2.5 + Math.random() * 2.5) * layerScale;
          const ph = Math.random() * PI2;
          const sp = 0.5 + Math.random() * 1.0;
          if (layer > 0 && Math.random() > 0.65) continue;

          // 러프한 위치 흔들림 (반지름 미만으로 제한 — 겹침 방지)
          const jitterX = (Math.random() - 0.5) * 4;
          const jitterY = (Math.random() - 0.5) * 3;

          // 약 25%는 항상 밝은 알갱이 (라인 가시성 확보)
          const bright = Math.random() < 0.25;

          edgeDots.push({ x: cx + pw + off + jitterX, y: py + jitterY, baseR: br, phase: ph, speed: sp, posAlpha, alwaysBright: bright });
          edgeDots.push({ x: cx - pw - off - jitterX, y: py + jitterY, baseR: br, phase: ph + 1, speed: sp, posAlpha, alwaysBright: bright });
        }
      }
    }

    function buildAmbient() {
      ambientDots = [];
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

    // ═══ 드레인 시스템 ═══
    //
    // 1. 중앙 덩어리가 빠짐 (sliding → funneling → falling)
    // 2. 빠지는 즉시 양쪽 전체가 중앙 방향으로 한 칸씩 밀림 (갭 없음)
    // 3. 다음 drain tick에서 새 중앙이 빠짐 → 반복
    // 4. 바닥행 전부 비면 → 윗줄 전체 settling (edge 밖은 fadeout)

    let currentBottomRow = -1;

    // 바닥행의 남은 덩어리를 cx 기준으로 갭 없이 재배치 (즉시 shifting)
    // hourglass bounds 밖으로 나가는 clump은 즉시 제거
    function compactRow(rowNum: number) {
      const rowClumps = clumps.filter(
        c => c.gridRow === rowNum && (c.state === "resting" || c.state === "shifting")
      );
      if (rowClumps.length === 0) return;

      // 현재 x 순서대로 정렬
      rowClumps.sort((a, b) => a.x - b.x);

      // cx 중심으로 빈틈 없이 재배치
      const totalWidth = (rowClumps.length - 1) * CLUMP_STEP;
      const startX = cx - totalWidth / 2;

      for (let i = 0; i < rowClumps.length; i++) {
        const newX = startX + i * CLUMP_STEP;
        if (Math.abs(rowClumps[i].x - newX) > 2) {
          gridMap.delete(gridKey(rowClumps[i].gridRow, rowClumps[i].gridCol));
          rowClumps[i].state = "shifting";
          rowClumps[i].targetX = newX;
          rowClumps[i].targetY = rowClumps[i].y;
          rowClumps[i].vx = 0;
        }
      }
    }

    function drainTick() {
      // settling/shifting 중이면 대기
      if (clumps.some(c => c.state === "settling" || c.state === "shifting")) return;

      const resting = clumps.filter(c => c.state === "resting");
      if (resting.length === 0) return;

      // 남은 resting이 2개 이하면 제자리에서 fadeout + 하단에 landed 채움
      if (resting.length <= 2) {
        for (const c of resting) {
          gridMap.delete(gridKey(c.gridRow, c.gridCol));
          c.state = "fading";
          c.fadeAlpha = 1;
          const slot = landingSlots.find(s => !s.taken);
          if (slot) {
            slot.taken = true;
            clumps.push({
              id: nextId++,
              x: slot.x, y: slot.y,
              homeX: slot.x, homeY: slot.y,
              targetX: slot.x, targetY: slot.y,
              vx: 0, vy: 0,
              state: "landed", landedAt: 0,
              trail: [], dots: makeSubDots(),
              gridRow: -1, gridCol: -1,
              settleToY: 0, settleToRow: 0, fadeAlpha: 1,
            });
          }
        }
        return;
      }

      if (currentBottomRow < 0) {
        currentBottomRow = resting.reduce((max, c) => Math.max(max, c.gridRow), 0);
      }

      const rowClumps = resting.filter(c => c.gridRow === currentBottomRow);

      if (rowClumps.length === 0) {
        // 바닥행 비었음 → 모든 resting 줄이 동시에 한 칸씩 내려옴
        if (resting.length === 0) return;

        for (const c of resting) {
          gridMap.delete(gridKey(c.gridRow, c.gridCol));
          c.state = "settling";
          c.settleToY = c.y + CLUMP_STEP;
          c.settleToRow = c.gridRow + 1;
          c.vy = 0;
        }

        // currentBottomRow 유지 — 클럼프들이 한 칸 내려와서 이 행을 채움
        return;
      }

      // 중앙에 가장 가까운 덩어리를 drain
      const sorted = [...rowClumps].sort(
        (a, b) => Math.abs(a.x - cx) - Math.abs(b.x - cx)
      );
      const center = sorted[0];
      center.state = "sliding";
      assignLandingSlot(center);
      gridMap.delete(gridKey(center.gridRow, center.gridCol));

      // 즉시 나머지를 중앙으로 compact — 갭 없음
      compactRow(currentBottomRow);
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

          case "settling": {
            // 한 칸 아래로 중력 낙하 → 도착하면 resting
            c.vy += GRAVITY * 0.8;
            c.vy = Math.min(c.vy, 7.0);
            c.y += c.vy;

            if (c.y >= c.settleToY) {
              c.y = c.settleToY;
              c.vy = 0;
              c.vx = 0;
              c.gridRow = c.settleToRow;
              c.homeY = c.settleToY;

              // bounds 밖이면 제거 + 하단에 landed 생성 (모래 보존)
              const maxXAtNewY = hgMaxXAtY(c.y) * 0.85;
              if (maxXAtNewY <= 0 || Math.abs(c.x - cx) > maxXAtNewY) {
                c.state = "fading";
                c.fadeAlpha = 1;
                // 하단에 대응하는 landed clump 생성
                const slot = landingSlots.find(s => !s.taken);
                if (slot) {
                  slot.taken = true;
                  const landed: SandClump = {
                    id: nextId++,
                    x: slot.x, y: slot.y,
                    homeX: slot.x, homeY: slot.y,
                    targetX: slot.x, targetY: slot.y,
                    vx: 0, vy: 0,
                    state: "landed",
                    landedAt: now,
                    trail: [],
                    dots: makeSubDots(),
                    gridRow: -1, gridCol: -1,
                    settleToY: 0, settleToRow: 0,
                    fadeAlpha: 1,
                  };
                  clumps.push(landed);
                }
              } else {
                c.state = "resting";
                gridMap.set(gridKey(c.gridRow, c.gridCol), c);
              }
            }
            break;
          }

          case "fading": {
            // edge 밖 덩어리 — 빠른 fadeout (~0.2초)
            c.fadeAlpha -= 0.08;
            if (c.fadeAlpha < 0) c.fadeAlpha = 0;
            break;
          }

          case "shifting": {
            // 중앙으로 빠르게 이동 (lerp — 진동 없음)
            const dx = c.targetX - c.x;
            c.x += dx * 0.35;

            if (Math.abs(dx) < 1.0) {
              c.x = c.targetX;
              c.vx = 0;
              c.state = "resting";
              c.homeX = c.x;
              gridMap.set(gridKey(c.gridRow, c.gridCol), c);
            }
            break;
          }

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

        // fading 상태: fadeAlpha 적용
        if (clump.state === "fading") {
          alpha *= Math.max(0, clump.fadeAlpha);
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

    // 배경 라인용 블루-화이트 틴트
    const BL = "178, 208, 243";

    function drawBackground(_t: number) {
      const maxR = Math.max(w, h) * 0.65;

      // 동심원
      for (const r of [0.12, 0.24, 0.38, 0.54, 0.72, 0.92]) {
        const fade = 0.16 * Math.pow(1 - r, 1.7);
        ctx.beginPath();
        ctx.arc(cx, cy, maxR * r, 0, PI2);
        ctx.strokeStyle = `rgba(${BL}, ${fade})`;
        ctx.lineWidth = r < 0.3 ? 1.3 : 1;
        ctx.stroke();
      }

      // 십자선
      ctx.lineWidth = 1;
      const crossGradV = ctx.createLinearGradient(cx, cy - maxR, cx, cy + maxR);
      crossGradV.addColorStop(0, `rgba(${BL}, 0)`);
      crossGradV.addColorStop(0.25, `rgba(${BL}, 0.025)`);
      crossGradV.addColorStop(0.5, `rgba(${BL}, 0.15)`);
      crossGradV.addColorStop(0.75, `rgba(${BL}, 0.025)`);
      crossGradV.addColorStop(1, `rgba(${BL}, 0)`);
      ctx.strokeStyle = crossGradV;
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, h);
      ctx.stroke();

      const crossGradH = ctx.createLinearGradient(cx - maxR, cy, cx + maxR, cy);
      crossGradH.addColorStop(0, `rgba(${BL}, 0)`);
      crossGradH.addColorStop(0.25, `rgba(${BL}, 0.025)`);
      crossGradH.addColorStop(0.5, `rgba(${BL}, 0.15)`);
      crossGradH.addColorStop(0.75, `rgba(${BL}, 0.025)`);
      crossGradH.addColorStop(1, `rgba(${BL}, 0)`);
      ctx.strokeStyle = crossGradH;
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(w, cy);
      ctx.stroke();
    }

    const EC = "255, 255, 255";

    function drawEdge(t: number) {
      for (const ed of edgeDots) {
        const breath = Math.sin(t * ed.speed + ed.phase) * 0.5 + 0.5;
        const r = ed.baseR * (0.15 + breath * 0.85);
        if (ed.alwaysBright) {
          // 밝은 알갱이: 더 밝은 색 + 높은 opacity
          const a = ed.posAlpha * (0.9 + breath * 0.1) * globalAlpha;
          if (a < 0.01) continue;
          ctx.beginPath();
          ctx.arc(ed.x, ed.y, r, 0, PI2);
          ctx.fillStyle = `rgba(${EC}, ${a})`;
          ctx.fill();
        } else {
          const a = ed.posAlpha * (0.5 + breath * 0.5) * globalAlpha;
          if (a < 0.01) continue;
          ctx.beginPath();
          ctx.arc(ed.x, ed.y, r, 0, PI2);
          ctx.fillStyle = `rgba(${DC}, ${a})`;
          ctx.fill();
        }
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
        if (drainCounter >= DRAIN_INTERVAL) {
          drainTick();
          drainCounter = 0;
        }
        updatePhysics(now);

        const allLanded = clumps.length > 0 && clumps.every(
          c => c.state === "landed" || (c.state === "fading" && c.fadeAlpha <= 0)
        );
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
          // 리셋 — 처음부터 완전 재생성
          buildClumps();
          currentBottomRow = -1;
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

      // hourglass 전체 clip — edge 밖 clump 안 보이게
      ctx.save();
      ctx.beginPath();
      const clipSteps = 60;
      // 왼쪽 edge (위→아래, ny: -1 to +1)
      for (let i = 0; i <= clipSteps; i++) {
        const ny = -1 + (2 * i / clipSteps);
        const px = cx - hgProfile(ny) * hgW;
        const py = cy + ny * hgH;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      // 오른쪽 edge (아래→위, ny: +1 to -1)
      for (let i = clipSteps; i >= 0; i--) {
        const ny = -1 + (2 * i / clipSteps);
        const px = cx + hgProfile(ny) * hgW;
        const py = cy + ny * hgH;
        ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.clip();

      for (const c of clumps) {
        if (c.state === "fading" && c.fadeAlpha <= 0) continue;
        renderClump(c, now, now);
      }

      ctx.restore();

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
      // 비율 고정: 화면 크기에 관계없이 일정한 비율 유지
      // 기준 해상도(1440×900)에서의 비율을 모든 화면에 적용
      const refScale = Math.min(w / 1440, h / 900);
      hgW = 380 * refScale;
      hgH = 380 * refScale;

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
