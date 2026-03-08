import { useEffect, useRef } from "react";

export default function ClaudeParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio, 2);
    let w = 0, h = 0, animId: number;
    let cx = 0, cy = 0, hgW = 0, hgH = 0;

    function hgProfile(ny: number): number {
      const ay = Math.abs(ny);
      if (ay < 0.05) return 0.03 + ay * 0.35;
      const t = (ay - 0.05) / 0.95;
      const bulb = 0.05 + Math.pow(t, 0.55) * 0.95;
      if (ay > 0.85) return bulb * (1 - Math.pow((ay - 0.85) / 0.15, 2) * 0.15);
      return bulb;
    }

    function hgMaxX(py: number): number {
      const ny = (py - cy) / hgH;
      if (Math.abs(ny) > 1.02) return 0;
      return hgProfile(ny) * hgW;
    }

    function getDensity(px: number, py: number): number {
      const nx = (px - cx) / hgW;
      const ny = (py - cy) / hgH;
      if (Math.abs(ny) > 1.02) return 0;
      const pw = hgProfile(ny);
      const er = Math.abs(nx) / pw;
      if (er > 1.05) return 0;
      let edge = er > 0.75 ? 1 - (er - 0.75) / 0.3 : 1;
      edge = Math.max(0, edge);
      let sand: number;
      if (ny < -0.06) sand = 0.5 + 0.5 * (1 - er * 0.3);
      else if (ny > 0.06) { const p = (ny - 0.06) / 0.94; sand = 0.12 + 0.5 * p + 0.12 * (1 - er * 0.4); }
      else sand = er < 0.3 ? 0.35 : 0;
      return sand * edge;
    }

    // ── Each "sand clump" = a cell with a micro-grid of dots ──
    const CELL_SIZE = 36;  // macro grid spacing
    const SUB_COLS = 4;    // 4x4 micro grid inside each cell
    const SUB_ROWS = 4;
    const SUB_GAP = 7;     // spacing between sub-dots

    interface SubDot {
      lx: number; ly: number; // local offset from cell center
      baseR: number;
      phase: number;
      speed: number;
    }

    interface Cell {
      x: number;
      y: number;
      targetY: number;
      subDots: SubDot[];
      state: "resting" | "falling" | "dispersing";
      vy: number;
      alpha: number;
      disperseT: number;
    }

    let cells: Cell[] = [];
    let dropTimer = 0;

    function makeMicroGrid(density: number): SubDot[] {
      const dots: SubDot[] = [];
      const halfW = (SUB_COLS - 1) * SUB_GAP / 2;
      const halfH = (SUB_ROWS - 1) * SUB_GAP / 2;

      for (let row = 0; row < SUB_ROWS; row++) {
        for (let col = 0; col < SUB_COLS; col++) {
          // Probability of dot existing depends on density
          if (Math.random() > density * 0.7 + 0.15) continue;

          const lx = col * SUB_GAP - halfW;
          const ly = row * SUB_GAP - halfH;

          // Size: varies within cell, bigger toward center
          const distFromCenter = Math.hypot(lx, ly) / Math.hypot(halfW, halfH);
          const maxSize = 1.5 + (1 - distFromCenter) * 3.5 * density;
          const baseR = 0.4 + Math.random() * maxSize;

          dots.push({
            lx, ly,
            baseR: Math.min(baseR, 5),
            phase: Math.random() * Math.PI * 2,
            speed: 0.15 + Math.random() * 0.5,
          });
        }
      }
      return dots;
    }

    function buildCells() {
      cells = [];
      const startY = cy - hgH * 0.94;
      const endY = cy - hgH * 0.04;

      for (let gy = startY; gy < endY; gy += CELL_SIZE) {
        const maxX = hgMaxX(gy) * 0.88;
        if (maxX < CELL_SIZE / 2) continue;

        for (let gx = cx - maxX; gx <= cx + maxX; gx += CELL_SIZE) {
          const d = getDensity(gx, gy);
          if (d < 0.03) continue;

          cells.push({
            x: gx, y: gy, targetY: gy,
            subDots: makeMicroGrid(d),
            state: "resting",
            vy: 0, alpha: 1, disperseT: 0,
          });
        }
      }
    }

    // Ambient scattered cells outside
    let ambientDots: { x: number; y: number; r: number; phase: number; speed: number; alpha: number }[] = [];
    function buildAmbient() {
      ambientDots = [];
      for (let i = 0; i < 20; i++) {
        const a = Math.random() * Math.PI * 2;
        const d = 0.32 + Math.random() * 0.5;
        const ax = cx + Math.cos(a) * w * d;
        const ay = cy + Math.sin(a) * h * d * 0.45;
        for (let j = 0; j < 2 + Math.floor(Math.random() * 4); j++) {
          ambientDots.push({
            x: ax + (Math.random() - 0.5) * 45,
            y: ay + (Math.random() - 0.5) * 45,
            r: 0.5 + Math.random() * 2.5,
            phase: Math.random() * Math.PI * 2,
            speed: 0.15 + Math.random() * 0.3,
            alpha: 0.03 + Math.random() * 0.07,
          });
        }
      }
    }

    function resize() {
      const p = canvas.parentElement!;
      w = p.clientWidth; h = p.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = w / 2; cy = h * 0.46;
      hgW = Math.min(w * 0.36, 460);
      hgH = h * 0.44;
      buildCells();
      buildAmbient();
    }

    const LC = "95, 78, 38";
    const DC = "210, 192, 140";

    function draw() {
      const t = performance.now() / 1000;
      ctx.clearRect(0, 0, w, h);
      const maxR = Math.max(w, h) * 0.65;

      // ═══ BG: circles, axes, radar, outline ═══
      for (const r of [0.12, 0.24, 0.38, 0.54, 0.72, 0.92]) {
        ctx.beginPath(); ctx.arc(cx, cy, maxR * r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${LC}, ${r < 0.4 ? 0.13 : 0.075})`;
        ctx.lineWidth = r < 0.3 ? 1.3 : 1; ctx.stroke();
      }
      ctx.beginPath(); ctx.arc(cx + w * 0.17, cy - h * 0.14, maxR * 0.48, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${LC}, 0.06)`; ctx.lineWidth = 0.9; ctx.stroke();
      ctx.beginPath(); ctx.arc(cx - w * 0.12, cy + h * 0.19, maxR * 0.62, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${LC}, 0.04)`; ctx.lineWidth = 0.9; ctx.stroke();

      ctx.strokeStyle = `rgba(${LC}, 0.055)`; ctx.lineWidth = 0.6;
      ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke();
      ctx.strokeStyle = `rgba(${LC}, 0.04)`;
      ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke();
      for (const a of [0.5, -0.5, 1.1, -1.1]) {
        ctx.beginPath();
        ctx.moveTo(cx - Math.cos(a) * maxR * 1.2, cy - Math.sin(a) * maxR * 1.2);
        ctx.lineTo(cx + Math.cos(a) * maxR * 1.2, cy + Math.sin(a) * maxR * 1.2);
        ctx.strokeStyle = `rgba(${LC}, 0.025)`; ctx.lineWidth = 0.5; ctx.stroke();
      }
      for (let i = 0; i < 3; i++) {
        const cyc = ((t * 0.055 + i * 4) % 16) / 16;
        const r = cyc * maxR * 1.3;
        const a = 0.12 * Math.pow(1 - cyc, 2);
        if (a > 0.003) {
          ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(140, 118, 50, ${a})`; ctx.lineWidth = 1.4; ctx.stroke();
        }
      }

      // Hourglass outline
      ctx.beginPath();
      for (let i = 0; i <= 180; i++) {
        const ny = -1 + (2 * i) / 180;
        const pw = hgProfile(ny) * hgW;
        if (i === 0) ctx.moveTo(cx + pw, cy + ny * hgH);
        else ctx.lineTo(cx + pw, cy + ny * hgH);
      }
      for (let i = 180; i >= 0; i--) {
        const ny = -1 + (2 * i) / 180;
        ctx.lineTo(cx - hgProfile(ny) * hgW, cy + ny * hgH);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(120, 100, 45, 0.1)`; ctx.lineWidth = 1.2; ctx.stroke();

      // ═══ CELL PHYSICS ═══
      dropTimer++;
      if (dropTimer > 35) {
        dropTimer = 0;
        let lowestIdx = -1, lowestY = -Infinity;
        for (let i = 0; i < cells.length; i++) {
          if (cells[i].state === "resting" && cells[i].y > lowestY) {
            lowestY = cells[i].y; lowestIdx = i;
          }
        }
        if (lowestIdx >= 0) {
          cells[lowestIdx].state = "falling";
          cells[lowestIdx].vy = 0.3;
          for (const c of cells) {
            if (c.state === "resting") {
              c.targetY += CELL_SIZE * 0.2;
              const maxY = cy - hgH * 0.05;
              if (c.targetY > maxY) c.targetY = maxY;
            }
          }
          // Spawn new at top
          const topY = cy - hgH * 0.92;
          const topMaxX = hgMaxX(topY) * 0.85;
          const d = getDensity(cx, topY);
          cells.push({
            x: cx + (Math.random() - 0.5) * topMaxX * 2,
            y: topY, targetY: topY,
            subDots: makeMicroGrid(Math.max(d, 0.4)),
            state: "resting", vy: 0, alpha: 1, disperseT: 0,
          });
        }
      }

      for (let i = cells.length - 1; i >= 0; i--) {
        const c = cells[i];
        if (c.state === "resting") {
          c.y += (c.targetY - c.y) * 0.04;
          const maxX = hgMaxX(c.y) * 0.85;
          if (c.x > cx + maxX) c.x += (cx + maxX - c.x) * 0.1;
          if (c.x < cx - maxX) c.x += (cx - maxX - c.x) * 0.1;
        }
        if (c.state === "falling") {
          c.vy += 0.06;
          c.y += c.vy;
          // Follow hourglass curve
          const maxX = hgMaxX(c.y) * 0.7;
          if (maxX > 0) {
            const limit = Math.min(maxX, Math.abs(c.x - cx));
            const targetX = cx + Math.sign(c.x - cx) * limit;
            c.x += (targetX - c.x) * 0.12;
          }
          c.x += (cx - c.x) * 0.05;
          if (c.y > cy + hgH * 0.7) {
            c.state = "dispersing"; c.disperseT = 0; c.vy *= 0.25;
          }
        }
        if (c.state === "dispersing") {
          c.disperseT++;
          c.y += c.vy;
          c.vy *= 0.98; // smooth deceleration, no jitter
          c.alpha = Math.max(0, 1 - c.disperseT / 50);
          if (c.alpha <= 0) { cells.splice(i, 1); continue; }
        }
      }

      // ═══ DRAW CELLS (micro-grid dots) ═══
      for (const c of cells) {
        const spread = c.state === "dispersing" ? 1 + c.disperseT * 0.06 : 1;
        for (const d of c.subDots) {
          const breath = Math.sin(t * d.speed + d.phase);
          const r = d.baseR * (1 + breath * 0.3);
          if (r < 0.15) continue;
          const a = c.alpha * (0.2 + (d.baseR / 5) * 0.55) * (0.82 + breath * 0.18);
          ctx.beginPath();
          ctx.arc(c.x + d.lx * spread, c.y + d.ly * spread, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${DC}, ${a})`;
          ctx.fill();
        }
      }

      // ═══ AMBIENT ═══
      for (const d of ambientDots) {
        const breath = Math.sin(t * d.speed + d.phase);
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r * (1 + breath * 0.2), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${DC}, ${d.alpha * (0.8 + breath * 0.2)})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-[2] pointer-events-none" />;
}
