import { useEffect, useRef } from "react";

const WORLD_HEIGHT = 31.5;
const PIXEL_BUDGET = 2.4e6;
const NUM_LAYER = 4;

const VERTEX = `#version 300 es
precision highp float;
layout(location = 0) in vec2 aCorner;
layout(location = 1) in vec2 aPosition;
layout(location = 2) in vec2 aStar;
layout(location = 3) in vec3 aColor;
uniform vec2 uSize;
out vec2 vLocal;
out float vFlare;
out vec3 vColor;

void main() {
  vec2 world = aPosition + aCorner * aStar.x;
  gl_Position = vec4(world.x / uSize.x * 2.0 - 1.0, 1.0 - world.y / uSize.y * 2.0, 0.0, 1.0);
  vLocal = aCorner;
  vFlare = aStar.y;
  vColor = aColor;
}`;

// Same star shape as the Galaxy background: soft glow plus cross flares on the biggest stars
const FRAGMENT = `#version 300 es
precision highp float;
uniform float uGlowIntensity;
in vec2 vLocal;
in float vFlare;
in vec3 vColor;
out vec4 fragColor;

#define MAT45 mat2(0.7071, -0.7071, 0.7071, 0.7071)

float Star(vec2 uv, float flare) {
  float d = length(uv);
  float m = (0.05 * uGlowIntensity) / d;
  float rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * flare * uGlowIntensity;
  uv *= MAT45;
  rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * 0.3 * flare * uGlowIntensity;
  m *= smoothstep(1.0, 0.2, d);
  return m;
}

void main() {
  vec3 col = Star(vLocal, vFlare) * vColor;
  float alpha = smoothstep(0.0, 0.3, length(col));
  if (alpha < 0.002) discard;
  fragColor = vec4(col * alpha, alpha);
}`;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const fract = (value) => value - Math.floor(value);
const smoothstep = (edge0, edge1, value) => {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
};
const trisn = (value) => 2 * (1 - smoothstep(0, 1, Math.abs(2 * fract(value) - 1))) - 1;

const seededRandom = (seed) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// Star color, using the same hue shift and saturation math as the Galaxy shader
const starColor = (rand, seed, hueShift, saturation) => {
  const red = smoothstep(0.2, 1, rand()) + 0.2;
  const blu = smoothstep(0.2, 1, rand()) + 0.2;
  const grn = Math.min(red, blu) * seed;
  const hue = fract(Math.atan2(grn - red, blu - red) / (2 * Math.PI) + 0.5 + hueShift / 360);
  const luma = red * 0.299 + grn * 0.587 + blu * 0.114;
  const sat = Math.hypot(red - luma, grn - luma, blu - luma) * saturation;
  const val = Math.max(red, grn, blu);
  return [1, 2 / 3, 1 / 3].map((k) => {
    const p = Math.abs(fract(hue + k) * 6 - 3);
    return val * (1 + (clamp(p - 1, 0, 1) - 1) * sat);
  });
};

// Compiles both shaders into one program, or returns null on failure
const createProgram = (gl) => {
  const compile = (type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
    console.error(gl.getShaderInfoLog(shader));
    return null;
  };
  const vertex = compile(gl.VERTEX_SHADER, VERTEX);
  const fragment = compile(gl.FRAGMENT_SHADER, FRAGMENT);
  if (!vertex || !fragment) return null;
  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (gl.getProgramParameter(program, gl.LINK_STATUS)) return program;
  console.error(gl.getProgramInfoLog(program));
  return null;
};

export default function StarField({
  density = 2,
  hueShift = 140,
  glowIntensity = 0.3,
  saturation = 0.2,
  twinkleIntensity = 0.1,
  rotationSpeed = 0.02,
  magnetRadius = 8,
  ringRadius = 6,
  waveSpeed = 0.4,
  waveAmplitude = 1,
  waveCount = 3,
  followSpeed = 0.05,
  fieldStrength = 10,
  className = "",
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const settingsRef = useRef(null);

  // Keeps the latest props available to the animation loop
  useEffect(() => {
    settingsRef.current = {
      density, hueShift, glowIntensity, saturation, twinkleIntensity, rotationSpeed, magnetRadius,
      ringRadius, waveSpeed, waveAmplitude, waveCount, followSpeed, fieldStrength,
    };
  });

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: true, antialias: false, depth: false });
    const program = gl && createProgram(gl);
    if (!program) return undefined;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const uSize = gl.getUniformLocation(program, "uSize");
    const uGlowIntensity = gl.getUniformLocation(program, "uGlowIntensity");

    // Buffers: one quad shared by every star, plus per-star position, size/flare and color
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const makeBuffer = (location, components, divisor) => {
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location, components, gl.FLOAT, false, 0, 0);
      gl.vertexAttribDivisor(location, divisor);
      return buffer;
    };
    const cornerBuffer = makeBuffer(0, 2, 0);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const positionBuffer = makeBuffer(1, 2, 1);
    const starBuffer = makeBuffer(2, 2, 1);
    const colorBuffer = makeBuffer(3, 3, 1);

    const size = { width: 1, height: 1 };
    const cursor = { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0, ready: false };
    const pointer = { inside: false, down: false };
    let field = null;
    let active = 0;
    let time = 0;
    let last = performance.now();
    let raf = 0;

    // Lays out stars in Galaxy's depth layers, covering the screen even while it rotates
    const buildField = (width, height) => {
      const s = settingsRef.current;
      const rand = seededRandom(1337);
      const span = Math.hypot(width, height);
      const list = [];
      for (let layer = 0; layer < NUM_LAYER; layer++) {
        const depth = layer / NUM_LAYER;
        const fade = depth * smoothstep(1, 0.9, depth);
        if (fade <= 0) continue;
        const scale = 20 * s.density + (0.5 * s.density - 20 * s.density) * depth;
        const cell = height / scale;
        const cells = Math.ceil(span / cell);
        for (let gy = 0; gy < cells; gy++) {
          for (let gx = 0; gx < cells; gx++) {
            const seed = rand();
            const brightness = fract(seed * 345.32);
            const twinkle = 1 + (trisn(seed * 6.2831) * 0.5 + 1 - 1) * s.twinkleIntensity;
            const color = starColor(rand, seed, s.hueShift, s.saturation).map((c) => c * brightness * fade * twinkle);
            list.push({
              bx: (gx + rand()) * cell - span / 2,
              by: (gy + rand()) * cell - span / 2,
              cell,
              flare: smoothstep(0.9, 1, brightness),
              color,
              depth: depth * 2 - 1,
            });
          }
        }
      }
      const total = list.length;
      const next = {
        total, width, height,
        baseX: new Float32Array(total), baseY: new Float32Array(total), depth: new Float32Array(total),
        band: new Float32Array(total), phase: new Float32Array(total), agility: new Float32Array(total),
        x: new Float32Array(total), y: new Float32Array(total),
        vx: new Float32Array(total), vy: new Float32Array(total),
        positions: new Float32Array(total * 2),
      };
      const stars = new Float32Array(total * 2);
      const colors = new Float32Array(total * 3);
      list.forEach((star, i) => {
        next.baseX[i] = star.bx;
        next.baseY[i] = star.by;
        next.x[i] = width / 2 + star.bx;
        next.y[i] = height / 2 + star.by;
        next.depth[i] = star.depth;
        next.band[i] = rand() * 2 - 1;
        next.phase[i] = rand() * Math.PI * 2;
        next.agility[i] = 0.75 + rand() * 0.5;
        stars.set([star.cell, star.flare], i * 2);
        colors.set(star.color, i * 3);
      });
      gl.bindBuffer(gl.ARRAY_BUFFER, starBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, stars, gl.STATIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, next.positions.byteLength, gl.DYNAMIC_DRAW);
      return next;
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const cssWidth = Math.max(1, rect.width);
      const cssHeight = Math.max(1, rect.height);
      const ratio = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(PIXEL_BUDGET / (cssWidth * cssHeight)));
      canvas.width = Math.round(cssWidth * ratio);
      canvas.height = Math.round(cssHeight * ratio);
      size.width = cssWidth;
      size.height = cssHeight;
      if (!cursor.ready) {
        cursor.x = cursor.tx = cssWidth / 2;
        cursor.y = cursor.ty = cssHeight / 2;
        cursor.ready = true;
      }
      if (!field || field.width !== cssWidth || field.height !== cssHeight) {
        field = buildField(cssWidth, cssHeight);
      }
    };

    // Slowly rotates star homes, and pulls nearby stars into a wavy ring around the cursor with spring physics
    const simulate = (s, dt) => {
      const unit = size.height / WORLD_HEIGHT;
      const ringPx = s.ringRadius * unit;
      const magnetPx = Math.max(s.magnetRadius * unit, 1);
      const spread = (5 / (s.fieldStrength + 0.1)) * unit;
      const wavePx = s.waveAmplitude * unit * 0.5;
      const omegaBase = 2.2 + clamp(s.followSpeed, 0.001, 1) * 80;
      const edge = magnetPx * 0.18;
      const centerX = size.width / 2;
      const centerY = size.height / 2;
      const angle0 = reduced ? 0 : time * s.rotationSpeed;
      const cos0 = Math.cos(angle0);
      const sin0 = Math.sin(angle0);
      const { baseX, baseY, depth, band, phase, agility, x, y, vx, vy, positions, total } = field;
      for (let i = 0; i < total; i++) {
        const hx = centerX + baseX[i] * cos0 - baseY[i] * sin0;
        const hy = centerY + baseX[i] * sin0 + baseY[i] * cos0;
        const parallax = 1 - depth[i] * 0.12;
        const cx = centerX + (cursor.x - centerX) * parallax;
        const cy = centerY + (cursor.y - centerY) * parallax;
        const dx = hx - cx;
        const dy = hy - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const capture = 1 - clamp((dist - (magnetPx - edge)) / (edge * 2), 0, 1);
        const ease = capture * capture * (3 - 2 * capture) * active;
        let tx = hx;
        let ty = hy;
        if (ease > 0) {
          const angle = Math.atan2(dy, dx);
          const wave =
            wavePx *
            (0.6 * Math.sin(angle * s.waveCount - time * s.waveSpeed * 2) +
              0.4 * Math.sin(phase[i] + time * s.waveSpeed * 1.3));
          const radius = dist + (ringPx + wave + band[i] * spread - dist) * ease;
          tx = cx + Math.cos(angle) * radius;
          ty = cy + Math.sin(angle) * radius;
        }
        const omega = omegaBase * agility[i];
        const damping = 1.64 * omega;
        const stiffness = omega * omega;
        const steps = Math.min(4, Math.max(1, Math.ceil(omega * dt * 2)));
        const h = dt / steps;
        for (let step = 0; step < steps; step++) {
          vx[i] += ((tx - x[i]) * stiffness - vx[i] * damping) * h;
          vy[i] += ((ty - y[i]) * stiffness - vy[i] * damping) * h;
          x[i] += vx[i] * h;
          y[i] += vy[i] * h;
        }
        positions[i * 2] = x[i];
        positions[i * 2 + 1] = y[i];
      }
    };

    // Kicks stars outward from the cursor on click
    const burst = () => {
      const s = settingsRef.current;
      const unit = size.height / WORLD_HEIGHT;
      const reach = Math.max(s.magnetRadius, s.ringRadius) * unit * 1.8;
      const { x, y, vx, vy, agility, total } = field;
      for (let i = 0; i < total; i++) {
        const dx = x[i] - cursor.x;
        const dy = y[i] - cursor.y;
        const dist = Math.sqrt(dx * dx + dy * dy) + 1e-3;
        const kick = unit * 50 * Math.exp(-((dist / reach) ** 2)) * agility[i];
        vx[i] += (dx / dist) * kick;
        vy[i] += (dy / dist) * kick;
      }
    };

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      const s = settingsRef.current;
      const dt = clamp((now - last) / 1000, 0, 1 / 30);
      last = now;
      time += dt;
      active += ((pointer.inside ? 1 : 0) - active) * (1 - Math.exp(-dt * 3));

      cursor.vx += ((cursor.tx - cursor.x) * 49 - cursor.vx * 14) * dt;
      cursor.vy += ((cursor.ty - cursor.y) * 49 - cursor.vy * 14) * dt;
      cursor.x += cursor.vx * dt;
      cursor.y += cursor.vy * dt;

      simulate(s, dt);

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.useProgram(program);
      gl.bindVertexArray(vao);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, field.positions);
      gl.uniform2f(uSize, size.width, size.height);
      gl.uniform1f(uGlowIntensity, s.glowIntensity);
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, field.total);
    };

    // Pointer tracking across the whole page
    const onPointerMove = (event) => {
      const rect = container.getBoundingClientRect();
      cursor.tx = event.clientX - rect.left;
      cursor.ty = event.clientY - rect.top;
      pointer.inside = true;
    };
    const onPointerDown = () => {
      pointer.down = true;
    };
    const onPointerUp = () => {
      if (pointer.down && pointer.inside) burst();
      pointer.down = false;
    };
    const onLeave = () => {
      pointer.inside = false;
      pointer.down = false;
    };
    if (!reduced) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerdown", onPointerDown, { passive: true });
      window.addEventListener("pointerup", onPointerUp, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      [cornerBuffer, positionBuffer, starBuffer, colorBuffer].forEach((buffer) => gl.deleteBuffer(buffer));
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <div ref={containerRef} className={`pointer-events-none ${className}`}>
      <canvas ref={canvasRef} aria-hidden="true" className="block size-full" />
    </div>
  );
}
