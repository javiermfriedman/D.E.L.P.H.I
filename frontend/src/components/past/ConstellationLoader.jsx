import { useEffect, useRef } from "react";

const CONSTELLATIONS = [
  {
    // Orion
    stars: [
      [0.50, 0.06],
      [0.33, 0.26],
      [0.67, 0.26],
      [0.40, 0.48],
      [0.50, 0.48],
      [0.60, 0.48],
      [0.28, 0.82],
      [0.72, 0.82],
      [0.48, 0.60],
      [0.50, 0.68],
    ],
    edges: [
      [0, 1], [0, 2],
      [1, 3], [2, 5],
      [3, 4], [4, 5],
      [3, 6], [5, 7],
      [4, 8], [8, 9],
    ],
    sizes: [1.2, 1.8, 1.4, 1.2, 1.3, 1.2, 1.5, 1.8, 0.9, 0.9],
  },
  {
    // Ursa Major (Big Dipper)
    stars: [
      [0.15, 0.28],
      [0.28, 0.42],
      [0.42, 0.44],
      [0.56, 0.36],
      [0.68, 0.28],
      [0.72, 0.52],
      [0.54, 0.58],
    ],
    edges: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3],
    ],
    sizes: [1.4, 1.1, 1.2, 1.5, 1.3, 1.1, 1.2],
  },
  {
    // Cassiopeia
    stars: [
      [0.15, 0.52],
      [0.32, 0.22],
      [0.50, 0.52],
      [0.68, 0.22],
      [0.85, 0.52],
    ],
    edges: [
      [0, 1], [1, 2], [2, 3], [3, 4],
    ],
    sizes: [1.3, 1.6, 1.2, 1.5, 1.3],
  },
  {
    // Lyra
    stars: [
      [0.50, 0.10],
      [0.40, 0.32],
      [0.60, 0.32],
      [0.35, 0.58],
      [0.65, 0.58],
      [0.40, 0.78],
      [0.60, 0.78],
    ],
    edges: [
      [0, 1], [0, 2], [1, 2], [1, 3], [2, 4], [3, 5], [4, 6], [5, 6],
    ],
    sizes: [2.0, 1.2, 1.2, 1.1, 1.1, 1.0, 1.0],
  },
];

const W = 320;
const H = 260;
const PAD = 35;
const BG_STAR_COUNT = 90;
const STAR_STAGGER = 130;
const FLASH_DUR = 420;
const LINE_OFFSET = 180;
const LINE_DUR = 320;

export default function ConstellationLoader() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const c =
      CONSTELLATIONS[Math.floor(Math.random() * CONSTELLATIONS.length)];
    const drawW = W - PAD * 2;
    const drawH = H - PAD * 2;

    const bgStars = Array.from({ length: BG_STAR_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      size: 0.3 + Math.random() * 0.9,
      speed: 1 + Math.random() * 3,
      phase: Math.random() * Math.PI * 2,
    }));

    const start = performance.now();
    let animId;

    function frame(now) {
      const elapsed = now - start;
      ctx.clearRect(0, 0, W, H);

      for (const s of bgStars) {
        const a =
          0.15 +
          0.25 * (0.5 + 0.5 * Math.sin(elapsed * 0.001 * s.speed + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 200, 180, ${a})`;
        ctx.fill();
      }

      for (const [a, b] of c.edges) {
        const later = Math.max(a, b);
        const lineStart = later * STAR_STAGGER + LINE_OFFSET;
        const lt = Math.min(Math.max((elapsed - lineStart) / LINE_DUR, 0), 1);
        if (lt <= 0) continue;

        const sx = PAD + c.stars[a][0] * drawW;
        const sy = PAD + c.stars[a][1] * drawH;
        const ex = sx + (PAD + c.stars[b][0] * drawW - sx) * lt;
        const ey = sy + (PAD + c.stars[b][1] * drawH - sy) * lt;
        const lineAlpha = Math.min(lt * 2, 1);

        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex, ey);
        ctx.strokeStyle = `rgba(245, 158, 11, ${0.1 * lineAlpha})`;
        ctx.lineWidth = 3.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex, ey);
        ctx.strokeStyle = `rgba(245, 158, 11, ${0.32 * lineAlpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      c.stars.forEach(([nx, ny], i) => {
        const t = Math.max(0, (elapsed - i * STAR_STAGGER) / FLASH_DUR);
        if (t <= 0) return;

        const baseSize = 2.5 * (c.sizes[i] || 1);
        let scale, alpha;

        if (t < 0.25) {
          const f = t / 0.25;
          scale = f * 2.4;
          alpha = f;
        } else if (t < 0.55) {
          const f = (t - 0.25) / 0.3;
          scale = 2.4 - 1.4 * f;
          alpha = 1;
        } else {
          scale = 1 + 0.12 * Math.sin(elapsed * 0.003 + i * 1.1);
          alpha = 0.8 + 0.2 * Math.sin(elapsed * 0.002 + i * 0.7);
        }

        const px = PAD + nx * drawW;
        const py = PAD + ny * drawH;
        const r = baseSize * scale;

        const glow = ctx.createRadialGradient(px, py, 0, px, py, r * 5);
        glow.addColorStop(0, `rgba(255, 210, 100, ${alpha * 0.55})`);
        glow.addColorStop(0.4, `rgba(245, 158, 11, ${alpha * 0.15})`);
        glow.addColorStop(1, "transparent");
        ctx.fillStyle = glow;
        ctx.fillRect(px - r * 5, py - r * 5, r * 10, r * 10);

        if (scale > 0.5) {
          const gl = r * 3.5;
          const ga = alpha * 0.3;
          ctx.strokeStyle = `rgba(255, 230, 170, ${ga})`;
          ctx.lineWidth = 0.5;

          ctx.beginPath();
          ctx.moveTo(px - gl, py);
          ctx.lineTo(px + gl, py);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(px, py - gl);
          ctx.lineTo(px, py + gl);
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 235, 180, ${alpha})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(frame);
    }

    animId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="constellation-loader">
      <canvas ref={canvasRef} className="constellation-canvas" />
      <span className="oracle-text">
        Revealing prophecies of the past
        <span className="oracle-dots">
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </span>
      </span>
    </div>
  );
}
