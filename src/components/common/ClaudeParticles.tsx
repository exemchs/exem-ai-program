import { useEffect, useRef } from "react";
import * as THREE from "three";

// Claude logo SVG path - we'll sample points from this
const CLAUDE_PATH =
  "m3.127 10.604 3.135-1.76.053-.153-.053-.085H6.11l-.525-.032-1.791-.048-1.554-.065-1.505-.08-.38-.081L0 7.832l.036-.234.32-.214.455.04 1.009.069 1.513.105 1.097.064 1.626.17h.259l.036-.105-.089-.065-.068-.064-1.566-1.062-1.695-1.121-.887-.646-.48-.327-.243-.306-.104-.67.435-.48.585.04.15.04.593.456 1.267.981 1.654 1.218.242.202.097-.068.012-.049-.109-.181-.9-1.626-.96-1.655-.428-.686-.113-.411a2 2 0 0 1-.068-.484l.496-.674L4.446 0l.662.089.279.242.411.94.666 1.48 1.033 2.014.302.597.162.553.06.17h.105v-.097l.085-1.134.157-1.392.154-1.792.052-.504.25-.605.497-.327.387.186.319.456-.045.294-.19 1.23-.37 1.93-.243 1.29h.142l.161-.16.654-.868 1.097-1.372.484-.545.565-.601.363-.287h.686l.505.751-.226.775-.707.895-.585.759-.839 1.13-.524.904.048.072.125-.012 1.897-.403 1.024-.186 1.223-.21.553.258.06.263-.218.536-1.307.323-1.533.307-2.284.54-.028.02.032.04 1.029.098.44.024h1.077l2.005.15.525.346.315.424-.053.323-.807.411-3.631-.863-.872-.218h-.12v.073l.726.71 1.331 1.202 1.667 1.55.084.383-.214.302-.226-.032-1.464-1.101-.565-.497-1.28-1.077h-.084v.113l.295.432 1.557 2.34.08.718-.112.234-.404.141-.444-.08-.911-1.28-.94-1.44-.759-1.291-.093.053-.448 4.821-.21.246-.484.186-.403-.307-.214-.496.214-.98.258-1.28.21-1.016.19-1.263.112-.42-.008-.028-.092.012-.953 1.307-1.448 1.957-1.146 1.227-.274.109-.477-.247.045-.44.266-.39 1.586-2.018.956-1.25.617-.723-.004-.105h-.036l-4.212 2.736-.75.096-.324-.302.04-.496.154-.162 1.267-.871z";

function samplePointsFromSVGPath(
  pathData: string,
  numPoints: number,
  scale: number,
  offsetX: number,
  offsetY: number,
): [number, number][] {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", pathData);
  svg.appendChild(path);
  document.body.appendChild(svg);

  const totalLength = path.getTotalLength();
  const points: [number, number][] = [];

  for (let i = 0; i < numPoints; i++) {
    const point = path.getPointAtLength((i / numPoints) * totalLength);
    points.push([
      (point.x - offsetX) * scale,
      -(point.y - offsetY) * scale, // flip Y for Three.js
    ]);
  }

  document.body.removeChild(svg);
  return points;
}

export default function ClaudeParticles() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<{
    scattered: boolean;
    progress: number;
    renderer: THREE.WebGLRenderer;
    dispose: () => void;
  } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const PARTICLE_COUNT = 800;
    const SCALE = 45;
    const OFFSET_X = 7;
    const OFFSET_Y = 5.5;

    // Sample points from Claude logo path
    const logoPoints = samplePointsFromSVGPath(
      CLAUDE_PATH,
      PARTICLE_COUNT,
      SCALE,
      OFFSET_X,
      OFFSET_Y,
    );

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      -container.clientWidth / 2,
      container.clientWidth / 2,
      container.clientHeight / 2,
      -container.clientHeight / 2,
      0.1,
      1000,
    );
    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Create particles
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const targetPositions = new Float32Array(PARTICLE_COUNT * 3);
    const scatteredPositions = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);
    const alphas = new Float32Array(PARTICLE_COUNT);

    const spread = Math.max(container.clientWidth, container.clientHeight) * 0.8;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Logo (target) positions
      targetPositions[i * 3] = logoPoints[i][0];
      targetPositions[i * 3 + 1] = logoPoints[i][1];
      targetPositions[i * 3 + 2] = 0;

      // Scattered positions
      const angle = Math.random() * Math.PI * 2;
      const radius = 100 + Math.random() * spread;
      scatteredPositions[i * 3] = Math.cos(angle) * radius;
      scatteredPositions[i * 3 + 1] = Math.sin(angle) * radius;
      scatteredPositions[i * 3 + 2] = 0;

      // Start at logo position
      positions[i * 3] = targetPositions[i * 3];
      positions[i * 3 + 1] = targetPositions[i * 3 + 1];
      positions[i * 3 + 2] = 0;

      sizes[i] = 1.5 + Math.random() * 2;
      alphas[i] = 0.4 + Math.random() * 0.6;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute("alpha", new THREE.BufferAttribute(alphas, 1));

    // Shader material for dots
    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uColor: { value: new THREE.Color("#d0f100") },
        uPixelRatio: { value: renderer.getPixelRatio() },
      },
      vertexShader: `
        attribute float size;
        attribute float alpha;
        varying float vAlpha;
        uniform float uPixelRatio;
        void main() {
          vAlpha = alpha;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * uPixelRatio * 2.0;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vAlpha;
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float strength = 1.0 - smoothstep(0.3, 0.5, dist);
          gl_FragColor = vec4(uColor, vAlpha * strength);
        }
      `,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Animation state
    let scattered = false;
    let progress = 0; // 0 = logo, 1 = scattered
    let animFrameId: number;

    const state = {
      scattered,
      progress,
      renderer,
      dispose: () => {},
    };
    animationRef.current = state;

    // Scroll handler
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const threshold = window.innerHeight * 0.3;
      state.scattered = scrollY > threshold;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // Animation loop
    const animate = () => {
      animFrameId = requestAnimationFrame(animate);

      const targetProgress = state.scattered ? 1 : 0;
      state.progress += (targetProgress - state.progress) * 0.03;

      const posAttr = geometry.getAttribute("position") as THREE.BufferAttribute;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        posAttr.array[i3] =
          targetPositions[i3] +
          (scatteredPositions[i3] - targetPositions[i3]) * state.progress;
        posAttr.array[i3 + 1] =
          targetPositions[i3 + 1] +
          (scatteredPositions[i3 + 1] - targetPositions[i3 + 1]) * state.progress;
      }

      posAttr.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.left = -w / 2;
      camera.right = w / 2;
      camera.top = h / 2;
      camera.bottom = -h / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    state.dispose = () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };

    return () => state.dispose();
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 pointer-events-none"
    />
  );
}
