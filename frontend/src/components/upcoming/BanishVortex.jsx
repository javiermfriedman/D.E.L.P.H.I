import { useEffect, useRef } from "react";

const DURATION = 2500;
const RING_RADIUS = 130;
const RING_PARTICLES = 120;
const EMBER_COUNT = 80;

function lerp(a, b, t) {
  return a + (b - a) * t;
}
function easeOut(t) {
  return 1 - (1 - t) * (1 - t);
}
function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

export default function BanishVortex({ word, onComplete }) {
  const canvasRef = useRef(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const W = window.innerWidth;
    const H = window.innerHeight;
    const cx = W / 2;
    const cy = H / 2;

    const ring = Array.from({ length: RING_PARTICLES }, (_, i) => ({
      angle:
        (Math.PI * 2 * i) / RING_PARTICLES + (Math.random() - 0.5) * 0.3,
      radiusOffset: (Math.random() - 0.5) * 30,
      speed: 0.5 + Math.random() * 0.9,
      size: 2 + Math.random() * 4,
      hue: 28 + Math.random() * 22,
      lightness: 58 + Math.random() * 30,
      flickerSpeed: 2 + Math.random() * 5,
      startDist: 350 + Math.random() * 250,
    }));

    const embers = Array.from({ length: EMBER_COUNT }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: RING_RADIUS + (Math.random() - 0.5) * 50,
      speed: 1 + Math.random() * 2.5,
      size: 0.6 + Math.random() * 1.8,
      drift: 0.1 + Math.random() * 0.5,
      opacity: 0.3 + Math.random() * 0.7,
      life: Math.random(),
    }));

    const start = performance.now();
    let animId;

    function frame(now) {
      const elapsed = now - start;
      const t = Math.min(elapsed / DURATION, 1);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      const summonT = Math.min(t / 0.2, 1);
      const burnT = t < 0.2 ? 0 : Math.min((t - 0.2) / 0.5, 1);
      const consumeT = t < 0.72 ? 0 : Math.min((t - 0.72) / 0.16, 1);
      const fadeT = t < 0.88 ? 0 : (t - 0.88) / 0.12;

      const globalAlpha = fadeT > 0 ? 1 - easeOut(fadeT) : easeOut(summonT);
      const ringScale =
        consumeT > 0 ? lerp(1, 0.02, easeInOut(consumeT)) : 1;
      const spinMul = consumeT > 0 ? 1 + consumeT * 5 : 1;

      ctx.fillStyle = `rgba(0, 0, 0, ${0.82 * globalAlpha})`;
      ctx.fillRect(0, 0, W, H);

      ctx.save();
      ctx.translate(cx, cy);

      const ambR = 280 * (consumeT > 0 ? ringScale * 4 : 1);
      const amb = ctx.createRadialGradient(0, 0, 0, 0, 0, ambR);
      amb.addColorStop(
        0,
        `rgba(245, 158, 11, ${0.18 * globalAlpha})`
      );
      amb.addColorStop(
        0.4,
        `rgba(220, 120, 0, ${0.06 * globalAlpha})`
      );
      amb.addColorStop(1, "transparent");
      ctx.fillStyle = amb;
      ctx.beginPath();
      ctx.arc(0, 0, ambR, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalCompositeOperation = "lighter";

      for (const p of ring) {
        p.angle += p.speed * 0.022 * spinMul;

        const targetR = (RING_RADIUS + p.radiusOffset) * ringScale;
        const r =
          summonT < 1 ? lerp(p.startDist, targetR, easeOut(summonT)) : targetR;

        const x = Math.cos(p.angle) * r;
        const y = Math.sin(p.angle) * r * 0.52;

        const flicker =
          0.65 +
          0.35 * Math.sin(elapsed * p.flickerSpeed * 0.001 + p.angle);
        const alpha = flicker * globalAlpha;
        const sz = p.size * (consumeT > 0 ? lerp(1, 0.2, consumeT) : 1);

        const pg = ctx.createRadialGradient(x, y, 0, x, y, sz * 4);
        pg.addColorStop(
          0,
          `hsla(${p.hue}, 100%, ${p.lightness}%, ${alpha * 0.9})`
        );
        pg.addColorStop(
          0.35,
          `hsla(${p.hue}, 100%, 50%, ${alpha * 0.35})`
        );
        pg.addColorStop(1, "transparent");
        ctx.fillStyle = pg;
        ctx.fillRect(x - sz * 4, y - sz * 4, sz * 8, sz * 8);

        ctx.beginPath();
        ctx.arc(x, y, sz, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, ${Math.min(p.lightness + 15, 95)}%, ${alpha})`;
        ctx.fill();
      }

      for (const e of embers) {
        e.angle += e.speed * 0.014 * spinMul;
        e.radius += e.drift * 0.25;
        e.life += 0.007;

        if (e.life > 1) {
          e.life = 0;
          e.radius = RING_RADIUS + (Math.random() - 0.5) * 35;
        }

        const r = e.radius * ringScale;
        const x = Math.cos(e.angle) * r;
        const y = Math.sin(e.angle) * r * 0.52 - e.life * 25;

        const alpha =
          e.opacity *
          (1 - e.life) *
          globalAlpha *
          (0.6 + 0.4 * Math.sin(elapsed * 0.006 + e.angle));

        ctx.beginPath();
        ctx.arc(x, y, e.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 175, 40, ${alpha})`;
        ctx.fill();
      }

      if (summonT > 0.4) {
        const strokeAlpha =
          globalAlpha *
          (consumeT > 0
            ? 1 - consumeT
            : Math.min((summonT - 0.4) / 0.6, 1));
        ctx.beginPath();
        ctx.ellipse(
          0,
          0,
          RING_RADIUS * ringScale,
          RING_RADIUS * 0.52 * ringScale,
          0,
          0,
          Math.PI * 2
        );
        ctx.strokeStyle = `rgba(245, 158, 11, ${strokeAlpha * 0.25})`;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = "rgba(245, 158, 11, 0.6)";
        ctx.shadowBlur = 18;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      if (globalAlpha > 0.3) {
        const coreAlpha = globalAlpha * (consumeT > 0 ? 1 - consumeT : 1);
        const corePulse =
          1 + 0.15 * Math.sin(elapsed * 0.004);
        const cg = ctx.createRadialGradient(0, 0, 0, 0, 0, 18 * corePulse);
        cg.addColorStop(
          0,
          `rgba(255, 220, 140, ${coreAlpha * 0.9})`
        );
        cg.addColorStop(
          0.5,
          `rgba(245, 158, 11, ${coreAlpha * 0.4})`
        );
        cg.addColorStop(1, "transparent");
        ctx.fillStyle = cg;
        ctx.beginPath();
        ctx.arc(0, 0, 18 * corePulse, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
      ctx.restore();

      if (burnT > 0 && globalAlpha > 0.1) {
        const textAlpha =
          globalAlpha *
          (consumeT > 0 ? 1 - consumeT : Math.min(burnT * 2.5, 1));
        const textScale =
          consumeT > 0
            ? lerp(1, 0.4, easeOut(consumeT))
            : lerp(0.75, 1, easeOut(Math.min(burnT * 2, 1)));

        ctx.save();
        ctx.globalAlpha = textAlpha;
        ctx.font = `italic ${2.8 * textScale}rem 'IM Fell English', Georgia, serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#F59E0B";
        ctx.shadowColor = "rgba(245, 158, 11, 0.8)";
        ctx.shadowBlur = 30;
        ctx.fillText(word, cx, cy);
        ctx.shadowBlur = 0;
        ctx.restore();
      }

      if (consumeT > 0 && consumeT < 0.35) {
        const flashAlpha = (1 - consumeT / 0.35) * 0.35;
        ctx.fillStyle = `rgba(255, 210, 100, ${flashAlpha})`;
        ctx.fillRect(0, 0, W, H);
      }

      if (t < 1) {
        animId = requestAnimationFrame(frame);
      } else {
        onCompleteRef.current();
      }
    }

    animId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animId);
  }, [word]);

  return (
    <div className="banish-overlay">
      <canvas ref={canvasRef} className="banish-canvas" />
    </div>
  );
}
