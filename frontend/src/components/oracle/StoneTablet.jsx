import { useEffect, useRef } from "react";

const ENTRANCE_DURATION = 600;
const CARVE_LETTER_SPEED = 50;
const CARVE_WORD_GAP = 350;
const GLOW_SETTLE_TIME = 400;
const HOLD_DURATION = 1000;
const CRUMBLE_DURATION = 1500;

const TABLET_W = 460;
const TABLET_H = 520;
const TABLET_R = 16;

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function easeOut(t) {
  return 1 - (1 - t) * (1 - t);
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export default function StoneTablet({ words, onComplete }) {
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
    const tx = cx - TABLET_W / 2;
    const ty = cy - TABLET_H / 2;

    const FONT_SIZE = Math.min(34, W * 0.035);
    const LINE_HEIGHT = FONT_SIZE * 1.7;
    const FONT = `italic ${FONT_SIZE}px 'IM Fell English', Georgia, serif`;

    const noise = Array.from({ length: 2000 }, () => ({
      x: Math.random() * TABLET_W,
      y: Math.random() * TABLET_H,
      size: 0.5 + Math.random() * 2,
      brightness: -20 + Math.random() * 40,
    }));

    const wordTimings = [];
    let cursor = ENTRANCE_DURATION;
    for (const w of words) {
      const start = cursor;
      const duration = w.word.length * CARVE_LETTER_SPEED;
      wordTimings.push({ start, duration });
      cursor += duration + CARVE_WORD_GAP;
    }
    const carveEnd = cursor - CARVE_WORD_GAP;
    const crumbleStart = carveEnd + HOLD_DURATION;
    const totalDuration = crumbleStart + CRUMBLE_DURATION;

    const totalTextH = words.length * LINE_HEIGHT;
    const textStartY = (TABLET_H - totalTextH) / 2 + FONT_SIZE * 0.65;

    let crumbleParticles = null;

    function makeCrumbleParticles() {
      return Array.from({ length: 350 }, () => ({
        x: tx + Math.random() * TABLET_W,
        y: ty + Math.random() * TABLET_H,
        vx: (Math.random() - 0.5) * 180,
        vy: 60 + Math.random() * 200,
        rot: 0,
        rotV: (Math.random() - 0.5) * 4,
        size: 3 + Math.random() * 10,
        opacity: 0.5 + Math.random() * 0.5,
        delay: Math.random() * 0.4,
        r: 130 + Math.floor((Math.random() - 0.5) * 30),
        g: 118 + Math.floor((Math.random() - 0.5) * 30),
        b: 100 + Math.floor((Math.random() - 0.5) * 30),
      }));
    }

    const startTime = performance.now();
    let animId;

    function frame(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / totalDuration, 1);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      const entT = Math.min(elapsed / ENTRANCE_DURATION, 1);
      const crumT = elapsed >= crumbleStart
        ? Math.min((elapsed - crumbleStart) / CRUMBLE_DURATION, 1)
        : 0;

      const bgAlpha = crumT > 0
        ? 0.88 * (1 - easeOut(crumT))
        : 0.88 * easeOut(Math.min(entT * 1.8, 1));
      ctx.fillStyle = `rgba(0, 0, 0, ${bgAlpha})`;
      ctx.fillRect(0, 0, W, H);

      const flashAlpha = entT < 0.4 ? (1 - entT / 0.4) * 0.75 : 0;

      const tabletAlpha = crumT > 0
        ? 1 - easeOut(Math.min(crumT * 1.8, 1))
        : easeOut(Math.min(entT * 1.5, 1));
      const tabletScale = entT < 1
        ? lerp(0.92, 1, easeOut(entT))
        : crumT > 0
          ? lerp(1, 0.96, easeOut(crumT))
          : 1;

      if (tabletAlpha > 0.01) {
        ctx.save();
        ctx.globalAlpha = tabletAlpha;
        ctx.translate(cx, cy);
        ctx.scale(tabletScale, tabletScale);
        ctx.translate(-cx, -cy);

        // Tablet shadow
        ctx.save();
        ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
        ctx.shadowBlur = 40;
        ctx.shadowOffsetY = 10;
        roundRect(ctx, tx, ty, TABLET_W, TABLET_H, TABLET_R);
        ctx.fillStyle = "rgba(0, 0, 0, 0.01)";
        ctx.fill();
        ctx.restore();

        // Tablet body
        const grad = ctx.createLinearGradient(tx, ty, tx, ty + TABLET_H);
        grad.addColorStop(0, "rgb(160, 148, 128)");
        grad.addColorStop(0.3, "rgb(145, 132, 115)");
        grad.addColorStop(0.7, "rgb(135, 122, 105)");
        grad.addColorStop(1, "rgb(120, 108, 92)");
        roundRect(ctx, tx, ty, TABLET_W, TABLET_H, TABLET_R);
        ctx.fillStyle = grad;
        ctx.fill();

        // Border
        roundRect(ctx, tx, ty, TABLET_W, TABLET_H, TABLET_R);
        ctx.strokeStyle = "rgba(90, 78, 62, 0.6)";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Inner highlight
        roundRect(ctx, tx + 4, ty + 4, TABLET_W - 8, TABLET_H - 8, TABLET_R - 2);
        ctx.strokeStyle = "rgba(190, 175, 155, 0.2)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Noise texture (clipped to tablet)
        ctx.save();
        roundRect(ctx, tx, ty, TABLET_W, TABLET_H, TABLET_R);
        ctx.clip();
        for (const n of noise) {
          const r = 139 + n.brightness;
          const g = 125 + n.brightness;
          const b = 107 + n.brightness;
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.25)`;
          ctx.fillRect(tx + n.x, ty + n.y, n.size, n.size);
        }
        ctx.restore();

        // Carved words (clipped to tablet)
        if (elapsed >= ENTRANCE_DURATION) {
          ctx.save();
          roundRect(ctx, tx, ty, TABLET_W, TABLET_H, TABLET_R);
          ctx.clip();
          ctx.font = FONT;
          ctx.textBaseline = "middle";

          for (let wi = 0; wi < words.length; wi++) {
            const wt = wordTimings[wi];
            if (elapsed < wt.start) break;

            const word = words[wi].word;
            const wordElapsed = elapsed - wt.start;
            const wordY = ty + textStartY + wi * LINE_HEIGHT;
            const fullW = ctx.measureText(word).width;
            let charX = cx - fullW / 2;

            for (let ci = 0; ci < word.length; ci++) {
              const charStart = ci * CARVE_LETTER_SPEED;
              if (wordElapsed < charStart) break;

              const charAge = wordElapsed - charStart;
              const freshness = Math.max(0, 1 - charAge / GLOW_SETTLE_TIME);
              const charW = ctx.measureText(word[ci]).width;

              ctx.save();

              if (freshness > 0.3) {
                ctx.shadowColor = `rgba(245, 158, 11, ${freshness * 0.8})`;
                ctx.shadowBlur = 12 * freshness;
                ctx.fillStyle = `rgb(${Math.round(lerp(80, 245, freshness))}, ${Math.round(lerp(50, 158, freshness))}, ${Math.round(lerp(30, 11, freshness))})`;
              } else {
                ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
                ctx.shadowBlur = 1;
                ctx.shadowOffsetX = 1;
                ctx.shadowOffsetY = 1;
                ctx.fillStyle = "#3D2B1A";
              }

              ctx.fillText(word[ci], charX, wordY);
              ctx.restore();

              charX += charW;
            }
          }

          ctx.restore();
        }

        ctx.restore();
      }

      // Crumble particles
      if (crumT > 0) {
        if (!crumbleParticles) crumbleParticles = makeCrumbleParticles();

        for (const p of crumbleParticles) {
          const localT = Math.max(0, crumT - p.delay);
          if (localT <= 0) continue;

          const px = p.x + p.vx * localT;
          const py = p.y + p.vy * localT + 300 * localT * localT;
          const rot = p.rot + p.rotV * localT * 10;
          const alpha = p.opacity * Math.max(0, 1 - localT * 1.8);

          if (alpha <= 0.01) continue;

          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.translate(px, py);
          ctx.rotate(rot);
          ctx.fillStyle = `rgb(${p.r}, ${p.g}, ${p.b})`;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      }

      // Flash overlay (entrance from summoning burst)
      if (flashAlpha > 0) {
        ctx.fillStyle = `rgba(245, 200, 100, ${flashAlpha})`;
        ctx.fillRect(0, 0, W, H);
      }

      if (progress < 1) {
        animId = requestAnimationFrame(frame);
      } else {
        onCompleteRef.current();
      }
    }

    animId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animId);
  }, [words]);

  return (
    <div className="stone-tablet-overlay">
      <canvas ref={canvasRef} className="stone-tablet-canvas" />
    </div>
  );
}
