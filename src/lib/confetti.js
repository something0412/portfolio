const COLORS = ["#26ccff", "#a25afd", "#ff5e7e", "#88ff5a", "#fcff42", "#ffa62d", "#ff36ff"];
const STEP = 1000 / 60;

const toRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

// Builds one piece of confetti with the same starting spread, speed and wobble as canvas-confetti
function makePiece(x, y, { angle, spread, startVelocity, decay, gravity, ticks, scalar }) {
  const rad = (angle * Math.PI) / 180;
  const radSpread = (spread * Math.PI) / 180;
  return {
    x,
    y,
    wobble: Math.random() * 10,
    wobbleSpeed: Math.min(0.11, Math.random() * 0.1 + 0.05),
    velocity: startVelocity * 0.5 + Math.random() * startVelocity,
    angle2D: -rad + (0.5 * radSpread - Math.random() * radSpread),
    tiltAngle: (Math.random() * 0.5 + 0.25) * Math.PI,
    color: toRgb(COLORS[Math.floor(Math.random() * COLORS.length)]),
    circle: Math.random() < 0.5,
    tick: 0,
    totalTicks: ticks,
    decay,
    gravity: gravity * 3,
    scalar,
  };
}

// Advances a piece by one 60fps step: drift along its angle, fall, slow down, wobble and tilt
function updatePiece(p) {
  p.x += Math.cos(p.angle2D) * p.velocity;
  p.y += Math.sin(p.angle2D) * p.velocity + p.gravity;
  p.velocity *= p.decay;
  p.wobble += p.wobbleSpeed;
  p.tiltAngle += 0.1;
  p.tick += 1;
  return p.tick < p.totalTicks;
}

// Draws a piece as a twisting square or circle that fades out over its life
function drawPiece(ctx, p) {
  const wobbleX = p.x + 10 * p.scalar * Math.cos(p.wobble);
  const wobbleY = p.y + 10 * p.scalar * Math.sin(p.wobble);
  const random = Math.random() + 2;
  const x1 = p.x + random * Math.cos(p.tiltAngle);
  const y1 = p.y + random * Math.sin(p.tiltAngle);
  const x2 = wobbleX + random * Math.cos(p.tiltAngle);
  const y2 = wobbleY + random * Math.sin(p.tiltAngle);

  ctx.fillStyle = `rgba(${p.color.join(",")},${1 - p.tick / p.totalTicks})`;
  ctx.beginPath();
  if (p.circle) {
    ctx.ellipse(p.x, p.y, Math.abs(x2 - x1) * 0.6, Math.abs(y2 - y1) * 0.6, (Math.PI / 10) * p.wobble, 0, 2 * Math.PI);
  } else {
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(wobbleX, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x1, wobbleY);
  }
  ctx.closePath();
  ctx.fill();
}

// Pops a burst of confetti from a screen point on a temporary full-screen canvas
export function fireConfetti(x, y, options = {}) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const settings = {
    particleCount: 100,
    angle: 90,
    spread: 70,
    startVelocity: 45,
    decay: 0.9,
    gravity: 1,
    ticks: 200,
    scalar: 1,
    ...options,
  };

  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText = "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:100";
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.scale(dpr, dpr);

  let pieces = Array.from({ length: settings.particleCount }, () => makePiece(x, y, settings));
  let last = 0;
  let carry = 0;

  // Keeps the physics at 60 steps per second on any refresh rate, drawing once per screen frame
  const frame = (now) => {
    carry += last ? Math.min(now - last, 100) : STEP;
    last = now;
    while (carry >= STEP && pieces.length) {
      carry -= STEP;
      pieces = pieces.filter(updatePiece);
    }
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    pieces.forEach((p) => drawPiece(ctx, p));
    if (pieces.length) requestAnimationFrame(frame);
    else canvas.remove();
  };
  requestAnimationFrame(frame);
}
