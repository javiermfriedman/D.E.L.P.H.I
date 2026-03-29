import { useEffect, useRef } from "react";

const WORDS = [
  "ephemeral",
  "mellifluous",
  "perspicacious",
  "loquacious",
  "soliloquy",
  "verbose",
  "quixotic",
  "tenuous",
  "elucidate",
  "sanguine",
  "obfuscate",
  "sesquipedalian",
  "laconic",
  "truculent",
  "sycophant",
  "ennui",
  "serendipity",
  "petrichor",
  "hiraeth",
  "sonder",
  "ineffable",
  "logorrhea",
  "lexicon",
  "palimpsest",
];

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

export default function WordParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
    let particles = [];

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function spawnParticle() {
      const side = Math.random() > 0.5 ? "left" : "right";
      return {
        word: WORDS[Math.floor(Math.random() * WORDS.length)],
        x:
          side === "left"
            ? randomBetween(-200, 0)
            : randomBetween(canvas.width, canvas.width + 200),
        y: randomBetween(0, canvas.height),
        vx:
          side === "left" ? randomBetween(0.1, 0.4) : randomBetween(-0.4, -0.1),
        vy: randomBetween(-0.15, 0.15),
        alpha: randomBetween(0.04, 0.18),
        size: randomBetween(10, 22),
        life: 0,
        maxLife: randomBetween(600, 1200),
      };
    }

    function init() {
      particles = Array.from({ length: 22 }, () => {
        const p = spawnParticle();
        p.x = randomBetween(0, canvas.width);
        p.life = randomBetween(0, p.maxLife);
        return p;
      });
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        const lifeRatio = p.life / p.maxLife;
        let alpha = p.alpha;
        if (lifeRatio < 0.1) alpha *= lifeRatio / 0.1;
        if (lifeRatio > 0.85) alpha *= (1 - lifeRatio) / 0.15;

        ctx.save();
        ctx.font = `${p.size}px "IM Fell English", Georgia, serif`;
        ctx.fillStyle = `rgba(180, 117, 23, ${alpha})`;
        ctx.fillText(p.word, p.x, p.y);
        ctx.restore();

        if (p.life >= p.maxLife) {
          particles[i] = spawnParticle();
        }
      });

      animId = requestAnimationFrame(draw);
    }

    resize();
    init();
    draw();

    window.addEventListener("resize", () => {
      resize();
      init();
    });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}
