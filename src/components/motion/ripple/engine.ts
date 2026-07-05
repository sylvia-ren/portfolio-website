/*
 * the water above the type. a hand-written webgl engine, ~zero idle cost:
 * it renders only while a disturbance is alive, then the loop stops and
 * the canvas holds a static frame identical to the printed text.
 *
 * the model is optical, not decorative: each pointer movement drops a
 * microscopic disturbance; expanding rings displace the sampling of the
 * text texture the way light bends through a lens of water. critically
 * damped — ripples die, they never oscillate forever.
 */

const MAX_DROPS = 16;
const MAX_AGE = 2.4; // seconds a drop is allowed to live

const VERTEX = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAGMENT = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uRes;
uniform float uNow;
uniform float uAmp;
uniform vec3 uDrops[${MAX_DROPS}];

const float SPEED = 130.0;    /* wavefront speed, px/s */
const float WAVELEN = 30.0;   /* px between crests */
const float SIGMA = 11.0;     /* width of the ring envelope, px */
const float DECAY = 1.5;      /* temporal damping, 1/s */
const float MAX_AGE = ${MAX_AGE.toFixed(1)};

void main() {
  vec2 frag = vUv * uRes;
  vec2 offset = vec2(0.0);

  for (int i = 0; i < ${MAX_DROPS}; i++) {
    vec3 drop = uDrops[i];
    if (drop.z < 0.0) continue;
    float t = uNow - drop.z;
    if (t <= 0.0 || t > MAX_AGE) continue;

    vec2 to = frag - drop.xy;
    float r = max(length(to), 0.001);
    float x = r - SPEED * t;
    float envelope = exp(-x * x / (2.0 * SIGMA * SIGMA));
    float spread = 1.0 / (1.0 + 0.02 * r);
    float amp = uAmp * envelope * exp(-DECAY * t) * spread;
    offset += (to / r) * amp * sin(6.2831853 * x / WAVELEN);
  }

  vec2 uv = vUv - offset / uRes;
  float shift = min(length(offset), 1.0) * 0.6;
  vec2 duv = shift > 0.02 ? normalize(offset) * shift / uRes : vec2(0.0);

  /* a sub-pixel breath of dispersion at the wavefront, nothing more */
  vec4 cr = texture2D(uTex, uv - duv);
  vec4 c = texture2D(uTex, uv);
  vec4 cb = texture2D(uTex, uv + duv);
  gl_FragColor = vec4(cr.r, c.g, cb.b, c.a);
}
`;

export type RippleEngine = {
  /** upload a freshly rasterized text frame */
  setTexture(source: TexImageSource): void;
  /** a disturbance at buffer-pixel coordinates (bottom-left origin) */
  drop(x: number, y: number): void;
  resize(width: number, height: number): void;
  destroy(): void;
};

export function createRippleEngine(
  canvas: HTMLCanvasElement,
  dpr: number,
): RippleEngine | null {
  const gl = canvas.getContext("webgl", {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    preserveDrawingBuffer: true,
  });
  if (!gl) return null;

  function compile(type: number, source: string): WebGLShader | null {
    const shader = gl!.createShader(type);
    if (!shader) return null;
    gl!.shaderSource(shader, source);
    gl!.compileShader(shader);
    if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) return null;
    return shader;
  }

  const vs = compile(gl.VERTEX_SHADER, VERTEX);
  const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT);
  const program = gl.createProgram();
  if (!vs || !fs || !program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW,
  );
  const aPos = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

  const uRes = gl.getUniformLocation(program, "uRes");
  const uNow = gl.getUniformLocation(program, "uNow");
  const uAmp = gl.getUniformLocation(program, "uAmp");
  const uDrops = gl.getUniformLocation(program, "uDrops");

  /* the disturbance amplitude: fractions of a pixel is the whole point */
  gl.uniform1f(uAmp, 1.6 * dpr);

  const drops = new Float32Array(MAX_DROPS * 3).fill(-1);
  let cursor = 0;
  let raf = 0;
  let destroyed = false;

  const now = () => performance.now() / 1000;

  function render() {
    raf = 0;
    if (destroyed) return;
    const t = now();
    gl!.uniform1f(uNow, t);
    gl!.uniform3fv(uDrops, drops);
    gl!.clearColor(0, 0, 0, 0);
    gl!.clear(gl!.COLOR_BUFFER_BIT);
    gl!.drawArrays(gl!.TRIANGLES, 0, 3);

    let alive = false;
    for (let i = 0; i < MAX_DROPS; i++) {
      const t0 = drops[i * 3 + 2];
      if (t0 >= 0 && t - t0 <= MAX_AGE) alive = true;
    }
    /* the water settles: one last still frame, then silence */
    if (alive) raf = requestAnimationFrame(render);
  }

  function schedule() {
    if (!raf && !destroyed) raf = requestAnimationFrame(render);
  }

  return {
    setTexture(source) {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
      schedule();
    },
    drop(x, y) {
      drops[cursor * 3] = x;
      drops[cursor * 3 + 1] = y;
      drops[cursor * 3 + 2] = now();
      cursor = (cursor + 1) % MAX_DROPS;
      schedule();
    },
    resize(width, height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
      gl.uniform2f(uRes, width, height);
      schedule();
    },
    destroy() {
      destroyed = true;
      if (raf) cancelAnimationFrame(raf);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
