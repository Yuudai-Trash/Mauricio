/* ESTADIO CERO — motor de ilustración SVG
 * Dibuja viñetas completas a partir de una descripción de escena.
 * Estilos: color, manga, retro, neon, acuarela, pop, glitch, carbon.
 */
(function (global) {
  'use strict';

  // ---------- utilidades ----------
  let UID = 0;
  const uid = (p) => p + '_' + (++UID).toString(36);
  const r2 = (n) => Math.round(n * 100) / 100;
  function rng(seed) {
    let s = (seed * 9301 + 49297) % 233280 || 1;
    return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  }
  function hx(c) {
    c = String(c).replace('#', '');
    if (c.length === 3) c = c.split('').map((x) => x + x).join('');
    const n = parseInt(c, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const toHex = (a) => '#' + a.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
  const mix = (a, b, t) => { const A = hx(a), B = hx(b); return toHex(A.map((v, i) => v + (B[i] - v) * t)); };
  const lum = (c) => { const [r, g, b] = hx(c); return (0.299 * r + 0.587 * g + 0.114 * b) / 255; };
  const sat = (c, k) => { const [r, g, b] = hx(c); const l = (r + g + b) / 3; return toHex([l + (r - l) * k, l + (g - l) * k, l + (b - l) * k]); };
  const dark = (c, t) => mix(c, '#000000', t);
  const light = (c, t) => mix(c, '#ffffff', t);
  function poster(c, levels) {
    const l = lum(c);
    let best = levels[0];
    for (const v of levels) if (Math.abs(v - l) < Math.abs(best - l)) best = v;
    return best;
  }

  // ---------- estilos ----------
  const STYLES = {
    color: { ink: '#16121c', lw: 1, m: (c) => c },
    manga: {
      ink: '#0d0d0d', lw: 1.15, paper: '#f4f1ea',
      m: (c) => { const v = poster(c, [0.1, 0.38, 0.62, 0.82, 0.97]) * 255; return toHex([v, v, v]); },
      ov: 'tone'
    },
    retro: { ink: '#2b140a', lw: 1.45, m: (c) => mix(sat(c, 1.12), '#ff9a55', 0.12), ov: 'grain' },
    neon: { ink: '#3ff6ff', lw: 0.9, m: (c) => mix(c, '#0a0722', 0.74), f: 'glow' },
    acuarela: { ink: '#5b4535', lw: 0.75, m: (c) => mix(sat(c, 0.9), '#fffaf0', 0.24), f: 'water', ov: 'paper' },
    pop: { ink: '#000000', lw: 1.6, m: (c) => sat(c, 1.45), ov: 'ben' },
    glitch: { ink: '#0b0b12', lw: 1, m: (c) => c, f: 'glitch', ov: 'scan' },
    carbon: {
      ink: '#1b1916', lw: 1.05,
      m: (c) => { const v = poster(c, [0.16, 0.42, 0.66, 0.86]); return mix(toHex([v * 255, v * 255, v * 255]), '#8a7a62', 0.14); },
      f: 'rough', ov: 'grain'
    }
  };

  // ---------- personajes ----------
  const KITS = {
    arg: { base: '#79b6e3', alt: '#ffffff', type: 'stripes', trim: '#1c2b4b', shorts: '#1c2b4b', socks: '#ffffff' },
    argk: { base: '#8b3dff', alt: '#5a1fc0', type: 'keeper', trim: '#e6ff3a', shorts: '#5a1fc0', socks: '#8b3dff', gloves: '#e6ff3a' },
    por: { base: '#c8102e', alt: '#0b6e3a', type: 'plain', trim: '#0b6e3a', shorts: '#0b6e3a', socks: '#c8102e' },
    fra: { base: '#1f3a93', alt: '#ffffff', type: 'plain', trim: '#e11d2b', shorts: '#ffffff', socks: '#e11d2b' },
    nor: { base: '#ba0c2f', alt: '#ffffff', type: 'plain', trim: '#00205b', shorts: '#ffffff', socks: '#ba0c2f' },
    bra: { base: '#ffd900', alt: '#009c3b', type: 'plain', trim: '#009c3b', shorts: '#1a3fa8', socks: '#ffffff' },
    cro: { base: '#e21d2e', alt: '#ffffff', type: 'checks', trim: '#1a3fa8', shorts: '#ffffff', socks: '#1a3fa8' },
    esp: { base: '#c60b1e', alt: '#ffc400', type: 'plain', trim: '#ffc400', shorts: '#1a2f6b', socks: '#1a2f6b' },
    col: { base: '#fcd116', alt: '#003893', type: 'plain', trim: '#ce1126', shorts: '#003893', socks: '#fcd116' },
    mexk: { base: '#27b34b', alt: '#0f6b2a', type: 'keeper', trim: '#111111', shorts: '#111111', socks: '#27b34b', gloves: '#ffffff' },
    bib: { base: '#8f949c', alt: '#ff7a1a', type: 'bib', trim: '#ff7a1a', shorts: '#2a2d33', socks: '#2a2d33' },
    rojo: { base: '#e3262e', alt: '#7a0c12', type: 'team', trim: '#ffffff', shorts: '#7a0c12', socks: '#e3262e' },
    azul: { base: '#1f6fe0', alt: '#0b2e6b', type: 'team', trim: '#ffffff', shorts: '#0b2e6b', socks: '#1f6fe0' },
    verde: { base: '#1faa59', alt: '#0b4a26', type: 'team', trim: '#ffffff', shorts: '#0b4a26', socks: '#1faa59' },
    oro: { base: '#f2b705', alt: '#7a5200', type: 'team', trim: '#1a1a1a', shorts: '#1a1a1a', socks: '#f2b705' },
    tierra: { base: '#f7f7f2', alt: '#1b64d4', type: 'earth', trim: '#1b64d4', shorts: '#1b64d4', socks: '#f7f7f2' },
    tierrak: { base: '#111827', alt: '#1b64d4', type: 'keeper', trim: '#38e1ff', shorts: '#111827', socks: '#111827', gloves: '#38e1ff' },
    ref: { base: '#16161c', alt: '#c9d2e0', type: 'mirror', trim: '#e9f1ff', shorts: '#16161c', socks: '#16161c' },
    suit: { base: '#1d1f26', alt: '#ffffff', type: 'suit', trim: '#ffffff', shorts: '#1d1f26', socks: '#1d1f26' },
    mex: { base: '#0f7a3a', alt: '#ffffff', type: 'plain', trim: '#c8102e', shorts: '#ffffff', socks: '#c8102e' },
    cpvk: { base: '#ff8c1a', alt: '#003893', type: 'keeper', trim: '#003893', shorts: '#003893', socks: '#ff8c1a', gloves: '#ffffff' },
    trackarg: { base: '#1c2b4b', alt: '#79b6e3', type: 'track', trim: '#ffffff', shorts: '#1c2b4b', socks: '#1c2b4b' },
    trackdark: { base: '#262a33', alt: '#6b7280', type: 'track', trim: '#9aa3b2', shorts: '#262a33', socks: '#262a33' },
    trackmex: { base: '#0f6b3a', alt: '#c8102e', type: 'track', trim: '#ffffff', shorts: '#0f6b3a', socks: '#0f6b3a' },
    trackblk: { base: '#18181b', alt: '#e3262e', type: 'track', trim: '#e3262e', shorts: '#18181b', socks: '#18181b' },
    sweater: { base: '#4a4d55', alt: '#2f3238', type: 'sweater', trim: '#2f3238', shorts: '#23252b', socks: '#23252b' },
    suitblk: { base: '#0d0d10', alt: '#0d0d10', type: 'suit', shirt: '#1a1a1f', tie: '#0d0d10', trim: '#333', shorts: '#0d0d10', socks: '#0d0d10' },
    suitnavy: { base: '#1b2440', alt: '#ffffff', type: 'suit', trim: '#ffffff', shorts: '#1b2440', socks: '#1b2440' },
    casual: { base: '#3a4a5c', alt: '#2a3440', type: 'plain', trim: '#2a3440', shorts: '#22303c', socks: '#dddddd' }
  };

  const CH = {
    mesias: { name: 'Leo Mesías', num: 10, skin: '#ebb690', hair: 'mesias', hc: '#5b3a22', beard: 'full', bc: '#4c2f1b', eye: '#6b4424', ego: '#7fd3ff', kit: 'arg', face: 'soft' },
    dibujo: { name: 'Dibujo Martell', num: 23, skin: '#e2a47d', hair: 'short', hc: '#1d1512', beard: 'stubble', bc: '#231914', eye: '#4a2f1a', ego: '#c07bff', kit: 'argk', face: 'square' },
    rolando: { name: 'Cristóbal Rolando', num: 7, skin: '#d99d74', hair: 'slick', hc: '#17100c', eye: '#3a2213', ego: '#ff2d4d', kit: 'por', face: 'sharp' },
    nico: { name: 'Nico Ferro', num: 100, skin: '#c78a5c', hair: 'spiky', hc: '#141018', eye: '#7a3b10', ego: '#ff8a1a', kit: 'bib', face: 'young' },
    memo: { name: 'Memo Ocho', num: 13, skin: '#c98d62', hair: 'curly', hc: '#1c130d', band: '#ffffff', beard: 'stubble', bc: '#2a1b12', eye: '#3a2414', ego: '#3dff7a', kit: 'mexk', face: 'soft' },
    modrovic: { name: 'Luka Modrović', num: 10, skin: '#efc3a2', hair: 'long', hc: '#a0764e', eye: '#6b8fb0', ego: '#ffffff', kit: 'cro', face: 'sharp', lines: true },
    yamar: { name: 'Lamín Yamar', num: 19, skin: '#8f5b3c', hair: 'curly', hc: '#120c09', eye: '#2a1a10', ego: '#ffd23a', kit: 'esp', face: 'young' },
    mbapo: { name: "Kylen M'Bapó", num: 10, skin: '#86573a', hair: 'buzz', hc: '#140e0b', eye: '#2a1a10', ego: '#4d7bff', kit: 'fra', face: 'soft' },
    haalund: { name: 'Erlend Haalund', num: 9, skin: '#f1c9aa', hair: 'bun', hc: '#e8c56a', eye: '#3a7bd5', ego: '#a8f0ff', kit: 'nor', face: 'square' },
    neimar: { name: 'Neimar Jr.', num: 10, skin: '#d6a17a', hair: 'mohawk', hc: '#1a120c', hc2: '#f1e2a0', beard: 'stubble', bc: '#2a1b12', eye: '#3a2414', ego: '#ffe600', kit: 'bra', face: 'sharp' },
    jaime: { name: 'Jaime Rodrigo', num: 10, skin: '#d49a70', hair: 'wavy', hc: '#241810', eye: '#3a2414', ego: '#ffd400', kit: 'col', face: 'soft' },
    alvaro: { name: 'Julián Álvaro', num: 9, skin: '#e7b48c', hair: 'short', hc: '#2c1d14', eye: '#4a2f1a', ego: '#79b6e3', kit: 'arg', face: 'young' },
    vinicio: { name: 'Vinício Jr.', num: 7, skin: '#6e4630', hair: 'afro', hc: '#120c09', eye: '#2a1a10', ego: '#ffe600', kit: 'bra', face: 'young' },
    vozinho: { name: 'Vozinho Días', num: 1, skin: '#5e3b27', hair: 'bald', hc: '#1a120c', beard: 'full', bc: '#16100b', eye: '#2a1a10', ego: '#ffb020', kit: 'cpvk', face: 'square' },
    escalona: { name: 'Lio Escalona', num: 0, skin: '#e6b38e', hair: 'short', hc: '#6b4a2e', beard: 'stubble', bc: '#5a3d26', eye: '#5b3a1e', kit: 'trackarg', face: 'soft', dt: true },
    guardiolo: { name: 'Pep Guardiolo', num: 0, skin: '#e9be9c', hair: 'bald', hc: '#bdbdbd', beard: 'stubble', bc: '#9a9a9a', eye: '#4a3a2a', kit: 'sweater', face: 'sharp', dt: true, lines: true },
    mourino: { name: 'José Mouriño', num: 0, skin: '#e2b08c', hair: 'slick', hc: '#9c9c9c', eye: '#3a2a1a', kit: 'suitnavy', face: 'sharp', dt: true, lines: true },
    simeon: { name: 'Cholo Simeón', num: 0, skin: '#dcaa84', hair: 'slick', hc: '#0e0e10', eye: '#1e140c', kit: 'suitblk', face: 'sharp', dt: true },
    biela: { name: 'Loco Biela', num: 0, skin: '#e8bd9a', hair: 'short', hc: '#bcbcbc', eye: '#3a4a5a', kit: 'trackdark', face: 'soft', dt: true, glasses: true, lines: true },
    ancelotta: { name: 'Carlo Ancelotta', num: 0, skin: '#efc6a6', hair: 'short', hc: '#d2d2d2', eye: '#3a3a4a', kit: 'suitnavy', face: 'square', dt: true, brow: 'raise', lines: true },
    klopf: { name: 'Jürgen Klopf', num: 0, skin: '#f0c7a6', hair: 'cap', hc: '#111111', beard: 'full', bc: '#8a7a68', eye: '#4a6a8a', kit: 'trackblk', face: 'square', dt: true, glasses: true },
    aguirra: { name: 'Vasco Aguirra', num: 0, skin: '#d7a37c', hair: 'buzz', hc: '#a8a8a8', eye: '#2a1a10', kit: 'trackmex', face: 'square', dt: true, lines: true },
    extra1: { name: 'Jugador', num: 4, skin: '#e0ac86', hair: 'short', hc: '#3a2a1c', eye: '#3a2414', kit: 'casual', face: 'square' },
    extra2: { name: 'Jugador', num: 5, skin: '#7a4d34', hair: 'buzz', hc: '#140e0b', eye: '#2a1a10', kit: 'casual', face: 'soft' },
    extra3: { name: 'Jugador', num: 8, skin: '#f0caa8', hair: 'wavy', hc: '#c8a060', eye: '#3a7bd5', kit: 'casual', face: 'sharp' },
    reflejo: { name: 'Reflejo', num: 0, skin: '#c9d2e0', hair: 'none', hc: '#9aa6b8', eye: '#ffffff', kit: 'ref', face: 'sharp', mirror: true }
  };

  // ---------- contexto de dibujo ----------
  function makeCtx(style, accent) {
    const S = STYLES[style] || STYLES.color;
    return { style, S, ink: S.ink, lw: S.lw, m: S.m, acc: accent || '#29b6ff', defs: [] };
  }
  const P = (d, f, s, w, x) => `<path d="${d}" fill="${f || 'none'}"${s ? ` stroke="${s}" stroke-width="${r2(w)}" stroke-linejoin="round" stroke-linecap="round"` : ''}${x ? ' ' + x : ''}/>`;

  function chromeGrad(ctx, a, b) {
    const id = uid('chr');
    ctx.defs.push(`<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a || '#f5f8ff'}"/><stop offset=".35" stop-color="#8e99ad"/><stop offset=".55" stop-color="#e9eef7"/><stop offset=".8" stop-color="#5d677a"/><stop offset="1" stop-color="${b || '#c7d0de'}"/></linearGradient>`);
    return `url(#${id})`;
  }

  // ---------- pelo ----------
  function zig(pts) { return pts.map((p, i) => (i ? 'L' : 'M') + p[0] + ',' + p[1]).join(' ') + ' Z'; }
  function hairPaths(h) {
    // devuelve {back, front} en coordenadas de cabeza (ancho ~92)
    switch (h) {
      case 'mesias': return {
        back: '',
        front: 'M-50,-4 C-56,-46 -32,-68 2,-68 C36,-68 56,-46 50,-6 L46,-12 L38,-34 L28,-26 L22,-36 L10,-24 L6,-36 L-6,-20 L-10,-34 L-20,-16 L-26,-30 L-34,-10 L-40,-22 L-44,-6 L-46,12 Z'
      };
      case 'spiky': return {
        back: '',
        front: zig([[-52, -2], [-58, -30], [-50, -40], [-64, -58], [-40, -60], [-46, -84], [-20, -70], [-10, -96], [6, -72], [26, -92], [28, -66], [54, -76], [46, -50], [62, -40], [50, -26], [54, -2], [44, -24], [38, -6], [30, -28], [22, -4], [14, -30], [4, -8], [-6, -30], [-14, -2], [-22, -28], [-32, -8], [-40, -26], [-48, -6]])
      };
      case 'slick': return {
        back: '',
        front: 'M-47,-6 C-54,-52 -30,-80 6,-80 C42,-78 56,-50 47,-6 L44,-20 C40,-40 24,-47 4,-47 C-18,-47 -38,-42 -44,-20 Z',
        shine: 'M-24,-68 C-4,-74 18,-72 34,-60 M-30,-58 C-12,-64 8,-62 24,-54'
      };
      case 'buzz': return { back: '', front: 'M-46,-12 C-48,-58 48,-58 46,-12 L44,-22 C38,-42 -38,-42 -44,-22 Z', thin: true };
      case 'bun': return {
        back: 'M-18,-64 A18,18 0 1 1 18,-64 A18,18 0 1 1 -18,-64 Z',
        front: 'M-48,-2 C-54,-50 -30,-70 2,-70 C34,-70 54,-50 48,-2 L44,-18 C40,-38 22,-44 2,-44 C-20,-44 -40,-38 -44,-18 Z',
        shine: 'M-44,-18 Q-50,6 -46,26 M44,-18 Q50,6 46,26 M-20,-62 C0,-66 18,-64 30,-56'
      };
      case 'mohawk': return {
        back: '',
        front: 'M-46,-12 C-48,-54 48,-54 46,-12 L44,-22 C38,-40 -38,-40 -44,-22 Z',
        top: 'M-28,-38 C-34,-70 -8,-90 20,-90 C40,-88 48,-72 42,-52 C34,-62 20,-62 10,-54 C2,-48 -10,-40 -28,-38 Z'
      };
      case 'long': return {
        back: 'M-50,-24 C-62,16 -60,52 -50,76 L-24,70 L-30,24 Z M50,-24 C62,16 60,52 50,76 L24,70 L30,24 Z',
        front: 'M-50,-4 C-56,-50 -30,-70 0,-70 C30,-70 56,-50 50,-4 L52,44 L42,26 L40,-6 C34,-26 16,-36 4,-36 L2,-20 L-4,-36 C-16,-36 -34,-26 -40,-6 L-42,26 L-52,44 Z'
      };
      case 'short': return {
        back: '',
        front: 'M-48,-6 C-54,-50 -30,-66 0,-66 C30,-66 54,-50 48,-6 L44,-22 L36,-36 L30,-28 L22,-40 L12,-30 L2,-42 L-8,-30 L-18,-40 L-26,-28 L-34,-36 L-42,-22 Z'
      };
      case 'wavy': return {
        back: 'M-50,-10 C-58,20 -52,40 -44,50 L-36,20 Z M50,-10 C58,20 52,40 44,50 L36,20 Z',
        front: 'M-50,6 C-58,-48 -30,-70 2,-70 C36,-70 58,-46 50,6 L44,-14 C42,-26 36,-32 30,-30 C26,-40 14,-38 8,-32 C0,-40 -12,-36 -16,-26 C-22,-34 -34,-28 -36,-16 C-42,-18 -46,-8 -46,4 Z'
      };
      case 'afro': return {
        back: '',
        front: 'M-56,-4 C-72,-60 -34,-96 0,-96 C34,-96 72,-60 56,-4 L46,-18 C40,-34 22,-40 0,-40 C-22,-40 -40,-34 -46,-18 Z'
      };
      case 'curly': return { back: '', front: '', curly: true };
      case 'bald': return { back: '', front: '', bald: true };
      case 'cap': return {
        back: '',
        front: 'M-50,-16 C-54,-66 54,-66 50,-16 C20,-24 -20,-24 -50,-16 Z',
        visor: 'M-50,-18 C-24,-30 40,-30 76,-12 L70,-4 C40,-18 -24,-18 -50,-10 Z'
      };
      default: return { back: '', front: '' };
    }
  }

  // ---------- rostro ----------
  const FACES = {
    soft: 'M-44,-22 C-45,-58 45,-58 44,-22 L43,4 C41,28 22,48 0,55 C-22,48 -41,28 -43,4 Z',
    sharp: 'M-44,-22 C-45,-58 45,-58 44,-22 L43,2 C40,26 20,46 0,58 C-20,46 -40,26 -43,2 Z',
    square: 'M-46,-22 C-47,-58 47,-58 46,-22 L46,10 C44,34 24,50 0,55 C-24,50 -44,34 -46,10 Z',
    young: 'M-44,-22 C-45,-58 45,-58 44,-22 L42,6 C38,28 20,46 0,51 C-20,46 -38,28 -42,6 Z'
  };
  const SHADE = 'M44,-22 L43,4 C41,28 22,48 0,55 C14,42 26,22 30,-2 C32,-16 36,-24 44,-22 Z';

  const BROWS = { // [inner y, mid y, outer y]
    n: [-18, -23, -19], det: [-12, -19, -21], ang: [-8, -17, -22], shock: [-26, -30, -25],
    sad: [-25, -21, -15], happy: [-21, -26, -21], calm: [-17, -20, -18], ego: [-11, -18, -21],
    smirk: [-18, -22, -20], dead: [-18, -21, -18], closed: [-19, -22, -19], cry: [-26, -21, -14]
  };

  function eye(ctx, o, cx, flip) {
    const { ink, lw } = ctx;
    const e = o.e || 'n';
    const s = flip ? -1 : 1;
    let g = `<g transform="translate(${cx},6) scale(${s},1)">`;
    const W = 'M-13,-4 Q-2,-13 13,-7 L12,8 Q0,12 -12,8 Z';
    if (e === 'happy') { g += P('M-12,4 Q0,-9 12,3', null, ink, 3.2 * lw); return g + '</g>'; }
    if (e === 'closed') { g += P('M-12,2 Q0,8 12,2', null, ink, 3 * lw) + P('M10,3 L15,6', null, ink, 1.6 * lw); return g + '</g>'; }
    const white = o.mirror ? '#0a0c12' : '#ffffff';
    g += P(W, white);
    if (o.mirror) {
      g += P('M-11,2 Q0,-4 11,0 L10,3 Q0,1 -11,5 Z', '#ffffff', null, 0, 'opacity=".95"');
      g += P('M-11,2 Q0,-4 11,0', null, '#bff6ff', 5, 'opacity=".35"');
    } else if (e !== 'dead') {
      const id = uid('ir');
      const ic = e === 'ego' ? o.ego || ctx.acc : ctx.m(o.eye || '#4a2f1a');
      ctx.defs.push(`<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${dark(ic, 0.65)}"/><stop offset=".55" stop-color="${ic}"/><stop offset="1" stop-color="${light(ic, 0.45)}"/></linearGradient>`);
      const clip = uid('ec');
      ctx.defs.push(`<clipPath id="${clip}"><path d="${W}"/></clipPath>`);
      let rx = 8.2, ry = 10.5, pr = 3.8;
      if (e === 'shock') { rx = 4; ry = 5; pr = 1.6; }
      if (e === 'ang') { rx = 6.4; ry = 8.4; pr = 2.6; }
      const lx = o.lx || 0;
      g += `<g clip-path="url(#${clip})">`;
      g += `<ellipse cx="${1 + lx}" cy="1" rx="${rx}" ry="${ry}" fill="url(#${id})" stroke="${ink}" stroke-width="${0.8 * lw}"/>`;
      if (e === 'ego') {
        g += `<ellipse cx="${1 + lx}" cy="2" rx="1.6" ry="6" fill="${ink}"/>`;
        g += P(`M${1 + lx},-9 L${1 + lx},12 M${-7 + lx},1 L${9 + lx},1`, null, light(ic, 0.7), 0.8, 'opacity=".8"');
      } else {
        g += `<ellipse cx="${1 + lx}" cy="2" rx="${pr}" ry="${pr * 1.3}" fill="${dark(ic, 0.8)}"/>`;
      }
      if (e !== 'shock') {
        g += `<circle cx="${4 + lx}" cy="-4" r="${ctx.style === 'retro' ? 3.8 : 3}" fill="#fff"/>`;
        g += `<circle cx="${-3 + lx}" cy="6" r="1.6" fill="#fff"/>`;
        if (ctx.style === 'retro') g += P(`M${4 + lx},-10 L${4 + lx},2 M${-2 + lx},-4 L${10 + lx},-4`, null, '#fff', 1.2);
      }
      if (e === 'sad' || e === 'cry') g += `<circle cx="${-2 + lx}" cy="-3" r="2.2" fill="#fff" opacity=".9"/>`;
      g += '</g>';
    }
    // párpado según expresión
    const skin = o.skinC;
    if (e === 'det' || e === 'ego') g += P('M-16,-16 L16,-16 L15,-6 Q2,-9 -14,-1 Z', skin);
    if (e === 'ang') g += P('M-16,-16 L16,-16 L15,-3 Q2,-5 -14,2 Z', skin);
    if (e === 'calm' || e === 'smirk') g += P('M-16,-16 L16,-16 L15,0 Q0,-3 -15,1 Z', skin);
    if (e === 'sad' || e === 'cry') g += P('M-16,-16 L16,-16 L15,-9 Q4,-8 -14,-1 Z', skin);
    // pestañas
    let lash = 'M-15,-3 Q-3,-14 14,-7 L15,-4 Q-2,-10 -13,-1 Z';
    if (e === 'det' || e === 'ego') lash = 'M-15,-1 Q-2,-9 15,-7 L16,-4 Q-2,-6 -13,1 Z';
    if (e === 'ang') lash = 'M-15,2 Q-2,-5 15,-4 L16,-1 Q-2,-2 -13,4 Z';
    if (e === 'calm' || e === 'smirk') lash = 'M-15,1 Q0,-4 15,-1 L16,2 Q0,-1 -13,4 Z';
    if (e === 'sad' || e === 'cry') lash = 'M-15,-1 Q4,-9 15,-9 L16,-6 Q4,-6 -13,1 Z';
    if (e === 'shock') lash = 'M-15,-4 Q-3,-15 14,-8 L15,-6 Q-2,-12 -13,-2 Z';
    g += P(lash, ink) + P('M13,-7 L20,-11 L16,-3 Z', ink);
    g += P('M-11,8 Q0,11.5 11,7', null, ink, 1.3 * lw);
    if (e === 'shock') g += P('M-10,14 L-6,17 M-2,15 L1,18 M5,15 L8,17', null, ink, 1 * lw);
    if (e === 'cry') g += P('M-4,10 C-6,20 -8,30 -5,40 C-2,32 0,22 -1,10 Z', '#bfe8ff', ink, 0.8 * lw, 'opacity=".95"');
    if (e === 'ego') g += P('M16,-4 L30,-10 M16,0 L32,0 M16,4 L28,10', null, o.ego || ctx.acc, 1.6, 'opacity=".9"');
    return g + '</g>';
  }

  function brow(ctx, o, cx, flip, color) {
    let b = BROWS[o.e || 'n'] || BROWS.n;
    if (o.raise && flip) b = [b[0] - 9, b[1] - 12, b[2] - 8];
    const s = flip ? -1 : 1;
    const d = `M-12,${b[0]} Q0,${b[1]} 13,${b[2]}`;
    return `<g transform="translate(${cx},6) scale(${s},1)">${P(d, null, color, 4.4 * ctx.lw)}</g>`;
  }

  function mouth(ctx, m, lx) {
    const { ink, lw } = ctx;
    const t = `transform="translate(${lx},0)"`;
    switch (m) {
      case 'smile': return `<g ${t}>${P('M-11,36 Q0,45 11,36', null, ink, 2 * lw)}</g>`;
      case 'grin': return `<g ${t}>${P('M-15,33 Q0,50 15,33 Z', '#fff', ink, 1.8 * lw)}${P('M-13,36 Q0,39 13,36', null, ink, 0.8)}</g>`;
      case 'open': return `<g ${t}>${P('M-12,31 Q0,29 12,31 Q9,53 0,53 Q-9,53 -12,31 Z', '#4a0d10', ink, 1.8 * lw)}${P('M-10,32 Q0,30 10,32 L9,36 Q0,34 -9,36 Z', '#fff')}<ellipse cx="0" cy="47" rx="6" ry="4" fill="#d9565b"/></g>`;
      case 'shout': return `<g ${t}>${P('M-16,29 Q0,26 16,29 Q12,58 0,58 Q-12,58 -16,29 Z', '#4a0d10', ink, 2 * lw)}${P('M-14,30 Q0,27 14,30 L13,35 Q0,32 -13,35 Z', '#fff')}<ellipse cx="0" cy="51" rx="8" ry="5" fill="#d9565b"/></g>`;
      case 'grit': return `<g ${t}>${P('M-14,33 L14,33 L12,42 L-12,42 Z', '#fff', ink, 1.8 * lw)}${P('M-14,37.5 L13,37.5 M-7,33 L-7,42 M0,33 L0,42 M7,33 L7,42', null, ink, 0.9)}</g>`;
      case 'frown': return `<g ${t}>${P('M-9,41 Q0,34 9,41', null, ink, 2 * lw)}</g>`;
      case 'o': return `<g ${t}><ellipse cx="0" cy="39" rx="4.5" ry="5.5" fill="#4a0d10" stroke="${ink}" stroke-width="${1.5 * lw}"/></g>`;
      case 'smirk': return `<g ${t}>${P('M-9,39 Q3,41 11,33', null, ink, 2 * lw)}</g>`;
      case 'flat': return `<g ${t}>${P('M-8,39 L8,39', null, ink, 2 * lw)}</g>`;
      case 'none': return '';
      default: return `<g ${t}>${P('M-7,38 Q0,40.5 7,38', null, ink, 2 * lw)}</g>`;
    }
  }

  // Cabeza completa (sin torso). Coordenadas: centro de la cara en (0,0), ancho ~92.
  function head(ctx, ch, o) {
    const { ink, lw, m } = ctx;
    const mirror = !!(ch.mirror || o.rf);
    const stone = !!o.stone;
    let skin = mirror ? chromeGrad(ctx) : m(ch.skin);
    if (stone) skin = '#8d877d';
    const skinFlat = mirror ? '#b9c3d3' : stone ? '#8d877d' : m(ch.skin);
    const shade = mirror ? '#6f7a8e' : dark(skinFlat, 0.22);
    let hairC = mirror ? chromeGrad(ctx, '#6d7890', '#2b3140') : m(ch.hc || '#222');
    if (stone) hairC = '#5e5850';
    const hairShade = mirror ? '#3a4254' : dark(m(ch.hc || '#222'), 0.35);
    const hp = hairPaths(ch.hair);
    const lx = o.lx || 0;
    let g = '';
    if (o.back) {
      // vista de espaldas: solo pelo cubriendo la cabeza
      g += `<ellipse cx="0" cy="0" rx="46" ry="52" fill="${skinFlat}" stroke="${ink}" stroke-width="${2.4 * lw}"/>`;
      const bh = ch.hair === 'buzz' || ch.hair === 'mohawk' ? 'M-47,20 C-54,-62 54,-62 47,20 C30,30 -30,30 -47,20 Z' : 'M-50,30 C-60,-66 60,-66 50,30 C30,42 -30,42 -50,30 Z';
      g += P(bh, hairC, ink, 2.4 * lw);
      if (ch.hair === 'bun') g += P(hp.back, hairC, ink, 2.2 * lw);
      if (ch.hair === 'long') g += P('M-50,20 C-52,50 -44,70 -30,76 L30,76 C44,70 52,50 50,20 Z', hairC, ink, 2.2 * lw);
      return g;
    }
    if (hp.back) g += P(hp.back, hairC, ink, 2.4 * lw);
    if (ch.hair === 'curly') {
      const circles = [];
      for (let i = 0; i <= 10; i++) { const a = Math.PI * (1.02 + i * 0.096); circles.push([Math.cos(a) * 50, -14 + Math.sin(a) * 50, ch.band ? 14 : 12]); }
      circles.push([-30, -38, 11], [-12, -44, 12], [8, -44, 12], [26, -38, 11], [0, -58, 14], [-22, -58, 12], [22, -58, 12]);
      g += `<g>${circles.map((c) => `<circle cx="${r2(c[0])}" cy="${r2(c[1])}" r="${c[2] + 1.6 * lw}" fill="${ink}"/>`).join('')}</g>`;
      o._curl = circles;
    }
    // orejas
    g += `<ellipse cx="${-44 + lx * 0.3}" cy="8" rx="7" ry="12" fill="${skinFlat}" stroke="${ink}" stroke-width="${2 * lw}"/>`;
    g += `<ellipse cx="${44 + lx * 0.3}" cy="8" rx="7" ry="12" fill="${skinFlat}" stroke="${ink}" stroke-width="${2 * lw}"/>`;
    // cara
    g += P(FACES[ch.face] || FACES.soft, skin, ink, 2.6 * lw);
    if (ctx.style !== 'neon') g += P(SHADE, shade, null, 0, 'opacity=".45"');
    if (o.dark) g += P('M-44,-22 C-45,-58 45,-58 44,-22 L43,14 C20,22 -20,22 -43,14 Z', '#000', null, 0, 'opacity=".55"');
    // barba
    if (ch.beard && !mirror) {
      const bd = 'M-44,2 C-42,28 -22,50 0,57 C22,50 42,28 44,2 C40,18 30,29 18,30 C10,31 6,30 0,30 C-6,30 -10,31 -18,30 C-30,29 -40,18 -44,2 Z';
      const bc = stone ? '#6e685f' : m(ch.bc || ch.hc);
      g += P(bd, bc, null, 0, `opacity="${ch.beard === 'full' ? 0.92 : 0.35}"`);
      if (ch.beard === 'full') g += P('M-13,33 Q0,27 13,33 Q0,31 -13,33 Z', bc, bc, 2.5);
    }
    // rasgos
    const eo = { e: o.e, eye: ch.eye, ego: o.egoC || ch.ego, lx, skinC: skinFlat, mirror, raise: ch.brow === 'raise' };
    if (mirror) {
      g += `<g transform="translate(${lx},0)">${eye(ctx, eo, 19, false)}${eye(ctx, eo, -19, true)}</g>`;
    } else {
      g += `<g transform="translate(${lx},0)">`;
      g += eye(ctx, eo, 19, false) + eye(ctx, eo, -19, true);
      const bcol = stone ? '#4d4740' : dark(m(ch.hc || '#222'), 0.2);
      g += brow(ctx, eo, 19, false, bcol) + brow(ctx, eo, -19, true, bcol);
      g += P('M3,16 L-1,26 L4,27', null, dark(skinFlat, 0.45), 1.6 * lw);
      g += '</g>';
      g += mouth(ctx, o.m || (o.e === 'happy' ? 'smile' : o.e === 'ang' ? 'grit' : o.e === 'shock' ? 'o' : 'n'), lx);
      if (ch.lines) g += P('M-30,18 L-22,20 M30,18 L22,20', null, dark(skinFlat, 0.35), 1.2);
      if (o.blush) g += P('M-36,22 L-32,16 M-30,22 L-26,16 M-24,22 L-20,16 M20,22 L24,16 M26,22 L30,16 M32,22 L36,16', null, '#e0556b', 1.6);
      if (o.sweat) g += P('M40,-30 C34,-18 36,-10 42,-10 C48,-10 48,-18 40,-30 Z', '#bfe8ff', ink, 1.4 * lw);
      if (o.vein) g += P('M-30,-44 L-24,-38 M-18,-44 L-24,-38 M-24,-38 L-30,-32 M-24,-38 L-18,-32', null, '#e0112b', 3);
      if (o.blood) g += P('M18,-40 C22,-30 20,-20 16,-12', null, '#b3121e', 3);
    }
    // pelo frontal (sombra primero)
    if (ch.hair === 'curly') {
      g += `<g>${o._curl.map((c) => `<circle cx="${r2(c[0])}" cy="${r2(c[1])}" r="${c[2]}" fill="${hairC}"/>`).join('')}</g>`;
      g += o._curl.slice(0, 7).map((c) => P(`M${r2(c[0] - 5)},${r2(c[1] + 2)} q5,-6 10,0`, null, hairShade, 1.6)).join('');
    } else if (hp.front) {
      if (!hp.thin && !mirror) g += `<g transform="translate(3,6)" opacity=".28">${P(hp.front, dark(skinFlat, 0.5))}</g>`;
      g += P(hp.front, hairC, ink, (hp.thin ? 1.6 : 2.6) * lw, hp.thin ? 'opacity=".92"' : '');
      if (hp.shine && !stone) g += P(hp.shine, null, light(m(ch.hc || '#222'), 0.35), 2, 'opacity=".7"');
      if (hp.top) g += P(hp.top, stone ? '#6e685f' : m(ch.hc2 || '#eee'), ink, 2.4 * lw);
      if (ch.hair === 'mesias') g += P('M-46,-8 L-42,-8 L-42,16 L-46,12 Z', hairC);
    }
    if (hp.bald && !mirror) g += P('M-26,-42 C-12,-50 8,-50 22,-44', null, '#ffffff', 3, 'opacity=".45"') + P('M-44,-8 L-44,10 M44,-8 L44,10', null, dark(skinFlat, 0.4), 1);
    if (hp.visor) g += P(hp.visor, stone ? '#4d4740' : m(ch.hc), ink, 2.2 * lw) + `<circle cx="0" cy="-52" r="3" fill="${ink}"/>`;
    if (ch.glasses && !mirror) {
      const gc = stone ? '#3a3530' : '#1a1a1a';
      g += `<g transform="translate(${lx},0)"><rect x="3" y="-6" width="34" height="24" rx="7" fill="#cfe6ff" fill-opacity=".18" stroke="${gc}" stroke-width="${2.6 * lw}"/><rect x="-37" y="-6" width="34" height="24" rx="7" fill="#cfe6ff" fill-opacity=".18" stroke="${gc}" stroke-width="${2.6 * lw}"/>${P('M-3,2 Q0,-2 3,2', null, gc, 2.4 * lw)}${P('M8,-2 L16,-4', null, '#fff', 2, 'opacity=".7"')}</g>`;
    }
    if (ch.band && !mirror) g += P('M-49,-30 C-20,-40 20,-40 49,-30 L49,-21 C20,-31 -20,-31 -49,-21 Z', m(ch.band), ink, 1.8 * lw);
    if (mirror) g += P('M-30,-40 C-10,-50 20,-48 34,-36', null, '#ffffff', 3, 'opacity=".6"');
    return g;
  }

  // ---------- torso para busto ----------
  function kitOf(ch, o) { return KITS[o.kit || ch.kit] || KITS.casual; }
  function torso(ctx, ch, o) {
    const { ink, lw, m } = ctx;
    const k = kitOf(ch, o);
    const mirror = !!(ch.mirror || o.rf);
    const stone = !!o.stone;
    const base = stone ? '#7d776e' : mirror ? '#15171e' : m(k.base);
    const alt = stone ? '#6b655c' : m(k.alt);
    const trim = stone ? '#5a544c' : m(k.trim);
    const skin = stone ? '#8d877d' : mirror ? '#b9c3d3' : m(ch.skin);
    const body = 'M-20,46 C-42,58 -82,64 -102,86 C-114,100 -118,132 -120,170 L120,170 C118,132 114,100 102,86 C82,64 42,58 20,46 Z';
    let g = '';
    g += P('M-17,28 L-17,62 Q0,74 17,62 L17,28 Z', skin, ink, 2.2 * lw);
    g += P('M-17,38 Q0,52 17,38 L17,48 Q0,60 -17,48 Z', dark(skin, 0.3), null, 0, 'opacity=".55"');
    const clip = uid('tc');
    ctx.defs.push(`<clipPath id="${clip}"><path d="${body}"/></clipPath>`);
    g += P(body, base, ink, 2.8 * lw);
    g += `<g clip-path="url(#${clip})">`;
    if (k.type === 'stripes' && !stone) for (let x = -104; x < 120; x += 44) g += `<rect x="${x}" y="40" width="20" height="140" fill="${alt}"/>`;
    if (k.type === 'checks' && !stone) for (let y = 50; y < 180; y += 18) for (let x = -126; x < 126; x += 18) if (((x + y) / 18) % 2 === 0) g += `<rect x="${x}" y="${y}" width="18" height="18" fill="${alt}"/>`;
    if (k.type === 'bib' && !stone) g += P('M-70,74 L-40,60 Q0,100 40,60 L70,74 L76,170 L-76,170 Z', m('#ff7a1a'), ink, 2 * lw);
    if (k.type === 'earth' && !stone) g += P('M-120,120 L120,96 L120,110 L-120,134 Z', alt, null, 0, 'opacity=".9"');
    if (k.type === 'keeper' && !stone) g += P('M-120,110 L-20,80 L-10,170 L-120,170 Z', alt, null, 0, 'opacity=".55"');
    if (k.type === 'team' && !stone) g += P('M-120,70 L-60,70 L-40,170 L-120,170 Z', alt, null, 0, 'opacity=".6"');
    if (k.type === 'mirror' || mirror) g += P('M-60,60 L-20,170 M30,60 L70,170 M-110,120 L110,110', null, '#d7e6ff', 1.4, 'opacity=".45"');
    if (k.type === 'suit') g += P('M-22,46 L0,124 L22,46 Z', m(k.shirt || '#ffffff')) + P('M-6,56 L0,50 L6,56 L3,118 L0,124 L-3,118 Z', m(k.tie || '#b3121e')) + P('M-22,46 L-6,100 L-40,70 Z M22,46 L6,100 L40,70 Z', dark(base, 0.25), ink, 1.4 * lw);
    if (k.type === 'track' && !stone) g += P('M0,50 L0,170', null, trim, 3) + P('M-104,96 L-70,70 M104,96 L70,70', null, alt, 9) + P('M-24,46 L-20,60 L20,60 L24,46', null, alt, 5);
    if (k.type === 'sweater' && !stone) g += P('M-24,48 Q0,90 24,48', dark(base, 0.3), ink, 1.4) + P('M-10,52 L0,60 L10,52 L10,90 L-10,90 Z', m('#ffffff'));
    g += P('M60,74 C80,90 96,112 104,150', null, dark(base, 0.35), 5, 'opacity=".45"');
    g += '</g>';
    // cuello de la camiseta
    if (k.type !== 'suit' && k.type !== 'track' && k.type !== 'sweater') g += P('M-22,48 Q0,74 22,48', null, trim, 7) + P('M-22,48 Q0,74 22,48', null, ink, 1.2 * lw);
    const num = o.num != null ? o.num : ch.num;
    if (num && !mirror && !stone && !['suit', 'bib', 'track', 'sweater'].includes(k.type)) g += `<text x="44" y="136" font-family="Bangers, Impact, sans-serif" font-size="30" fill="${trim}" stroke="${ink}" stroke-width=".8" text-anchor="middle">${num}</text>`;
    if (k.type === 'bib' && !stone) g += `<text x="0" y="140" font-family="Bangers, Impact, sans-serif" font-size="40" fill="#1a1a1a" text-anchor="middle">${o.num || 100}</text>`;
    if (k.type === 'earth' && !stone) g += `<circle cx="-46" cy="112" r="11" fill="${m('#1b64d4')}" stroke="${ink}" stroke-width="1.4"/><path d="M-52,106 q6,2 4,8 q6,0 8,6" fill="none" stroke="${m('#2bb34b')}" stroke-width="3"/>`;
    if (o.arm) g += P('M-104,110 L-86,92 L-80,120 L-98,138 Z', m('#ffd400'), ink, 1.6 * lw) + `<text x="-92" y="120" font-family="Bangers" font-size="14" text-anchor="middle" fill="#111">C</text>`;
    return g;
  }

  function bust(ctx, ch, o) {
    let g = '';
    const hp = hairPaths(ch.hair);
    if (hp.back && ch.hair === 'long' && !o.back) g += P(hp.back, ctx.m(ch.hc), ctx.ink, 2.4 * ctx.lw);
    g += torso(ctx, ch, o);
    g += `<g transform="translate(0,-4)">${head(ctx, ch, o)}</g>`;
    if (o.stone) g += cracks(ctx, 0, 40, 130, o.seed || 3);
    return g;
  }

  function cracks(ctx, cx, cy, R, seed) {
    const r = rng(seed || 7);
    let d = '';
    for (let i = 0; i < 7; i++) {
      let x = cx + (r() - 0.5) * R, y = cy + (r() - 0.5) * R * 1.4;
      d += `M${r2(x)},${r2(y)}`;
      for (let j = 0; j < 4; j++) { x += (r() - 0.5) * 36; y += (r() - 0.3) * 30; d += ` L${r2(x)},${r2(y)}`; }
    }
    return P(d, null, '#1b1916', 2.2) + P(d, null, '#d8d2c6', 0.7, 'transform="translate(1.5,1)"');
  }

  // ---------- figura de cuerpo entero ----------
  // Puntos: n cuello, sa/sb hombros, ea/eb codos, ha/hb manos, pa/pb caderas, ka/kb rodillas, fa/fb pies. a = lejano, b = cercano. Mira a la derecha.
  const POSES = {
    stand: { n: [0, -54], sa: [-5, -50], ea: [-9, -27], ha: [-10, -6], sb: [5, -50], eb: [10, -27], hb: [12, -6], pa: [-3, 0], ka: [-4, 26], fa: [-5, 52], pb: [3, 0], kb: [5, 26], fb: [7, 52] },
    front: { n: [0, -54], sa: [-15, -50], ea: [-19, -27], ha: [-20, -5], sb: [15, -50], eb: [19, -27], hb: [20, -5], pa: [-7, 0], ka: [-8, 26], fa: [-9, 52], pb: [7, 0], kb: [8, 26], fb: [9, 52], front: 1 },
    walk: { n: [3, -54], sa: [0, -50], ea: [8, -28], ha: [14, -10], sb: [5, -50], eb: [-4, -28], hb: [-10, -10], pa: [-2, 0], ka: [-8, 25], fa: [-16, 50], pb: [2, 0], kb: [10, 24], fb: [12, 51] },
    run: { n: [12, -52], sa: [9, -48], ea: [24, -38], ha: [32, -52], sb: [13, -48], eb: [-4, -34], hb: [-10, -18], pa: [-2, 0], ka: [-10, 22], fa: [-32, 34], pb: [2, 0], kb: [24, 8], fb: [18, 34] },
    sprint: { n: [18, -48], sa: [15, -44], ea: [30, -30], ha: [42, -40], sb: [19, -44], eb: [0, -30], hb: [-12, -24], pa: [-2, 0], ka: [-14, 18], fa: [-38, 24], pb: [2, 0], kb: [26, 4], fb: [22, 30] },
    kick: { n: [-6, -54], sa: [-8, -50], ea: [6, -60], ha: [22, -62], sb: [-4, -50], eb: [-22, -40], hb: [-34, -32], pa: [-2, 0], ka: [-3, 26], fa: [-5, 52], pb: [2, 0], kb: [22, 10], fb: [46, 14] },
    windup: { n: [6, -54], sa: [3, -50], ea: [20, -44], ha: [34, -40], sb: [8, -50], eb: [-8, -40], hb: [-22, -46], pa: [-2, 0], ka: [2, 26], fa: [4, 52], pb: [2, 0], kb: [-8, 22], fb: [-30, 30] },
    reach: { n: [0, -54], sa: [-6, -50], ea: [-9, -74], ha: [-11, -96], sb: [6, -50], eb: [10, -74], hb: [12, -96], pa: [-3, 0], ka: [-6, 26], fa: [-8, 52], pb: [3, 0], kb: [9, 24], fb: [16, 48] },
    header: { n: [2, -54], sa: [-12, -50], ea: [-24, -42], ha: [-30, -58], sb: [14, -50], eb: [26, -42], hb: [32, -58], pa: [-4, 0], ka: [-8, 20], fa: [-22, 36], pb: [4, 0], kb: [10, 18], fb: [-2, 40], front: 1 },
    siuu: { n: [0, -56], sa: [-15, -52], ea: [-32, -38], ha: [-48, -26], sb: [15, -52], eb: [32, -38], hb: [48, -26], pa: [-7, 0], ka: [-20, 22], fa: [-32, 50], pb: [7, 0], kb: [20, 22], fb: [32, 50], front: 1 },
    cheer: { n: [0, -54], sa: [-15, -50], ea: [-24, -72], ha: [-32, -94], sb: [15, -50], eb: [24, -72], hb: [32, -94], pa: [-7, 0], ka: [-10, 26], fa: [-14, 52], pb: [7, 0], kb: [10, 26], fb: [14, 52], front: 1 },
    fist: { n: [0, -54], sa: [-15, -50], ea: [-20, -28], ha: [-20, -6], sb: [15, -50], eb: [30, -64], hb: [26, -90], pa: [-7, 0], ka: [-9, 26], fa: [-12, 52], pb: [7, 0], kb: [9, 26], fb: [12, 52], front: 1 },
    kneel: { n: [10, -40], sa: [7, -37], ea: [12, -16], ha: [16, 2], sb: [12, -37], eb: [16, -16], hb: [22, 0], pa: [-2, 0], ka: [-2, 28], fa: [-28, 30], pb: [2, 0], kb: [24, 2], fb: [24, 30] },
    slump: { n: [18, -34], sa: [16, -31], ea: [22, -10], ha: [22, 12], sb: [20, -31], eb: [26, -10], hb: [30, 10], pa: [-2, 0], ka: [18, 14], fa: [-10, 22], pb: [2, 0], kb: [22, 10], fb: [2, 24] },
    ready: { n: [0, -46], sa: [-15, -42], ea: [-32, -38], ha: [-50, -34], sb: [15, -42], eb: [32, -38], hb: [50, -34], pa: [-8, 0], ka: [-20, 20], fa: [-24, 46], pb: [8, 0], kb: [20, 20], fb: [24, 46], front: 1 },
    dance: { n: [4, -54], sa: [-11, -50], ea: [-22, -68], ha: [-16, -88], sb: [19, -50], eb: [30, -34], hb: [14, -24], pa: [-5, 0], ka: [-12, 26], fa: [-18, 52], pb: [9, 0], kb: [14, 22], fb: [26, 44], front: 1 },
    dribble: { n: [10, -48], sa: [7, -45], ea: [-10, -40], ha: [-24, -34], sb: [13, -45], eb: [28, -38], hb: [38, -30], pa: [-2, 0], ka: [6, 21], fa: [-4, 46], pb: [2, 0], kb: [18, 18], fb: [24, 44] },
    point: { n: [2, -54], sa: [-2, -50], ea: [-6, -28], ha: [-8, -6], sb: [6, -50], eb: [26, -54], hb: [48, -58], pa: [-3, 0], ka: [-4, 26], fa: [-5, 52], pb: [3, 0], kb: [5, 26], fb: [7, 52] },
    fall: { n: [-30, -40], sa: [-32, -36], ea: [-44, -52], ha: [-50, -66], sb: [-28, -36], eb: [-8, -50], hb: [4, -62], pa: [-2, 0], ka: [10, 20], fa: [30, 32], pb: [2, 0], kb: [20, 14], fb: [40, 20] },
    arms: { n: [0, -54], sa: [-15, -50], ea: [-8, -34], ha: [10, -38], sb: [15, -50], eb: [8, -34], hb: [-10, -40], pa: [-7, 0], ka: [-8, 26], fa: [-10, 52], pb: [7, 0], kb: [8, 26], fb: [10, 52], front: 1 },
    hands: { n: [0, -54], sa: [-15, -50], ea: [-20, -28], ha: [-12, -12], sb: [15, -50], eb: [20, -28], hb: [12, -12], pa: [-7, 0], ka: [-8, 26], fa: [-9, 52], pb: [7, 0], kb: [8, 26], fb: [9, 52], front: 1 },
    float: { n: [0, -54], sa: [-15, -50], ea: [-30, -52], ha: [-42, -64], sb: [15, -50], eb: [28, -40], hb: [44, -44], pa: [-7, 0], ka: [-16, 22], fa: [-12, 46], pb: [7, 0], kb: [14, 18], fb: [22, 40], front: 1 }
  };

  function fig(ctx, ch, o) {
    const { ink, lw, m } = ctx;
    const pz = POSES[o.pose] || POSES.stand;
    const k = kitOf(ch, o);
    const mirror = !!(ch.mirror || o.rf);
    const stone = !!o.stone;
    const S = (c) => (stone ? mix(dark('#8d877d', lum(c) < 0.3 ? 0.25 : 0), '#8d877d', 0.3) : mirror ? c : m(c));
    const jersey = stone ? '#7d776e' : mirror ? '#1a1d26' : m(k.base);
    const shorts = stone ? '#6b655c' : mirror ? '#11131a' : m(k.shorts);
    const socks = stone ? '#7d776e' : mirror ? '#1a1d26' : m(k.socks);
    const skin = stone ? '#8d877d' : mirror ? '#b9c3d3' : m(ch.skin);
    const boot = stone ? '#4d4740' : mirror ? '#e9eef7' : m(o.boot || '#111111');
    const glove = k.gloves ? (stone ? '#9a948a' : m(k.gloves)) : null;
    const keeper = k.type === 'keeper' || ['suit', 'track', 'sweater'].includes(k.type);
    const longPants = ['suit', 'track', 'sweater'].includes(k.type);
    const W = 2 * 1.3 * lw;
    const seg = (a, b, w, c) => [`<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${ink}" stroke-width="${r2(w + W * 2)}" stroke-linecap="round"/>`, `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`];
    const midp = (a, b, t) => [r2(a[0] + (b[0] - a[0]) * t), r2(a[1] + (b[1] - a[1]) * t)];
    const limb = (parts, shade) => {
      const o1 = [], o2 = [];
      parts.forEach((p) => { const s = seg(p[0], p[1], p[2], shade ? dark(p[3], 0.22) : p[3]); o1.push(s[0]); o2.push(s[1]); });
      return o1.join('') + o2.join('');
    };
    const arm = (s, e, h, far) => {
      const sl = midp(s, e, 0.6);
      const parts = keeper ? [[s, e, 10, jersey], [e, h, 9, jersey]] : [[s, sl, 11, jersey], [sl, e, 9, skin], [e, h, 8, skin]];
      let g = limb(parts, far);
 const hc = glove ? (far ? dark(glove, 0.2) : glove) : far ? dark(skin, 0.22) : skin;
      g += `<circle cx="${h[0]}" cy="${h[1]}" r="${glove ? 7.5 : 5.2}" fill="${hc}" stroke="${ink}" stroke-width="${W}"/>`;
      return g;
    };
    const leg = (p, kn, f, far) => {
      const th = midp(p, kn, 0.55);
      const sk = midp(kn, f, 0.15);
      let g = limb(longPants ? [[p, kn, 14, shorts], [kn, f, 12, shorts]] : [[p, th, 15, shorts], [th, kn, 12, skin], [kn, sk, 11, socks], [sk, f, 10, socks]], far);
      const dir = f[0] - kn[0] >= 0 ? 1 : -1;
      const bc = far ? dark(boot, 0.2) : boot;
      g += `<ellipse cx="${r2(f[0] + dir * 5)}" cy="${f[1] + 1}" rx="10" ry="5.5" fill="${bc}" stroke="${ink}" stroke-width="${W}" transform="rotate(${r2(Math.atan2(f[1] - kn[1], f[0] - kn[0]) * 57.3 - 90 * dir)},${f[0]},${f[1]})"/>`;
      return g;
    };
    const n = pz.n, hip = [0, 0];
    const vx = n[0] - hip[0], vy = n[1] - hip[1];
    const L = Math.hypot(vx, vy);
    const px = -vy / L, py = vx / L;
    const sw = pz.front ? 16 : 11, hw = pz.front ? 12 : 9;
    const tq = [[n[0] + px * sw, n[1] + py * sw], [n[0] - px * sw, n[1] - py * sw], [hip[0] - px * hw, hip[1] - py * hw], [hip[0] + px * hw, hip[1] + py * hw]];
    const tpath = 'M' + tq.map((q) => r2(q[0]) + ',' + r2(q[1])).join(' L') + ' Z';
    let g = '';
    g += arm(pz.sa, pz.ea, pz.ha, !pz.front);
    g += leg(pz.pa, pz.ka, pz.fa, !pz.front);
    g += leg(pz.pb, pz.kb, pz.fb, false);
    g += P(tpath, jersey, ink, W * 1.1);
    const alt = stone ? '#6b655c' : m(k.alt);
    if (!stone && !mirror) {
      if (k.type === 'stripes') {
        const a = midp(tq[0], tq[3], 0.5), b = midp(tq[1], tq[2], 0.5);
        g += `<line x1="${r2(n[0] + (a[0] - n[0]) * 0.3)}" y1="${r2(n[1])}" x2="${r2(a[0] * 0.3)}" y2="0" stroke="${alt}" stroke-width="5"/>`;
        g += `<line x1="${r2(n[0] + px * 9)}" y1="${r2(n[1] + py * 9)}" x2="${r2(px * 7)}" y2="${r2(py * 7)}" stroke="${alt}" stroke-width="4"/>`;
        g += `<line x1="${r2(n[0] - px * 7)}" y1="${r2(n[1] - py * 7)}" x2="${r2(-px * 5)}" y2="${r2(-py * 5)}" stroke="${alt}" stroke-width="4"/>`;
        void b;
      } else if (k.type === 'checks') {
        g += `<line x1="${n[0]}" y1="${n[1] + 6}" x2="0" y2="-2" stroke="${alt}" stroke-width="6" stroke-dasharray="6 6"/>`;
      } else if (k.type === 'earth' || k.type === 'team' || k.type === 'bib') {
        g += `<line x1="${r2(n[0] + px * 14)}" y1="${r2(n[1] + py * 14 + 22)}" x2="${r2(n[0] - px * 14)}" y2="${r2(n[1] - py * 14 + 16)}" stroke="${k.type === 'bib' ? m('#ff7a1a') : alt}" stroke-width="${k.type === 'bib' ? 16 : 4}"/>`;
      }
    }
    if (mirror) g += P(tpath, 'none', '#cfe3ff', 1, 'opacity=".6" stroke-dasharray="3 5"');
    if (o.back) {
      const num = o.num != null ? o.num : ch.num;
      g += `<text x="${r2(n[0] * 0.5)}" y="${r2(n[1] * 0.45 + 6)}" font-family="Bangers, Impact" font-size="22" fill="${stone ? '#4d4740' : m(k.trim)}" stroke="${ink}" stroke-width=".6" text-anchor="middle">${num}</text>`;
    }
    g += arm(pz.sb, pz.eb, pz.hb, false);
    // cabeza
    const ux = vx / L, uy = vy / L;
    const hcx = r2(n[0] + ux * 17), hcy = r2(n[1] + uy * 17);
    const tilt = r2(Math.atan2(ux, -uy) * 57.3 * 0.6);
    g += `<g transform="translate(${hcx},${hcy}) rotate(${tilt}) scale(.31)">${head(ctx, ch, Object.assign({}, o, { lx: pz.front ? 0 : o.lx != null ? o.lx : 9 }))}</g>`;
    if (o.arm) g += `<rect x="${r2(pz.sb[0] - 5)}" y="${r2(pz.sb[1] + 6)}" width="10" height="5" fill="${m('#ffd400')}" stroke="${ink}" stroke-width="1"/>`;
    if (stone) g += cracks(ctx, 0, -30, 70, o.seed || 5);
    return g;
  }

  // ---------- objetos ----------
  function ball(ctx, o) {
    const r = o.r || 10;
    let g = '';
    const ac = o.c || ctx.acc;
    if (o.trail != null) {
      const a = (o.trail * Math.PI) / 180;
      for (let i = 0; i < 5; i++) {
        const off = (i - 2) * r * 0.45;
        const px = -Math.sin(a) * off, py = Math.cos(a) * off;
        const len = r * (5 + (2 - Math.abs(i - 2)) * 3);
        g += `<line x1="${r2(px)}" y1="${r2(py)}" x2="${r2(px - Math.cos(a) * len)}" y2="${r2(py - Math.sin(a) * len)}" stroke="${o.fire ? ac : ctx.ink}" stroke-width="${r2(r * 0.18)}" stroke-linecap="round" opacity="${o.fire ? 0.85 : 0.6}"/>`;
      }
    }
    if (o.fire) g += `<circle r="${r * 1.9}" fill="${ac}" opacity=".35"/><circle r="${r * 1.45}" fill="${light(ac, 0.3)}" opacity=".55"/>`;
    const fill = ctx.style === 'neon' ? '#0a0722' : '#ffffff';
    g += `<circle r="${r}" fill="${fill}" stroke="${ctx.ink}" stroke-width="${r2(r * 0.12 * ctx.lw)}"/>`;
    const pent = (cx, cy, s) => { let d = ''; for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5; d += (i ? 'L' : 'M') + r2(cx + Math.cos(a) * s) + ',' + r2(cy + Math.sin(a) * s); } return d + 'Z'; };
    const pc = ctx.style === 'neon' ? ctx.ink : ctx.ink;
    g += P(pent(0, 0, r * 0.36), pc);
    [[0, -0.86], [0.82, -0.28], [0.52, 0.72], [-0.52, 0.72], [-0.82, -0.28]].forEach((p) => { g += P(pent(p[0] * r, p[1] * r, r * 0.26), pc); });
    g += `<circle r="${r}" fill="none" stroke="${ctx.ink}" stroke-width="${r2(r * 0.12 * ctx.lw)}"/>`;
    g += `<path d="M${r2(-r * 0.5)},${r2(-r * 0.62)} A${r * 0.7},${r * 0.7} 0 0 1 ${r2(r * 0.4)},${r2(-r * 0.72)}" stroke="#fff" stroke-width="${r2(r * 0.12)}" fill="none" opacity=".8"/>`;
    return g;
  }

  function goal(ctx, o) {
    // arco frontal: ancho 240, alto 80 (unidades locales)
    const { ink, lw } = ctx;
    const post = ctx.style === 'neon' ? ctx.acc : '#ffffff';
    let g = '';
    let net = '';
    for (let x = -116; x <= 116; x += 12) net += `M${x},-78 L${x * 0.86},-4 `;
    for (let y = -74; y < 0; y += 10) net += `M${-120 + (y + 78) * 0.2},${y} L${120 - (y + 78) * 0.2},${y} `;
    g += P('M-120,-80 L-104,-60 L104,-60 L120,-80 M-104,-60 L-104,0 M104,-60 L104,0', null, ctx.m('#cfd4da'), 2);
    g += P(net, null, ctx.style === 'neon' ? ctx.acc : ctx.m('#e8ecef'), 1, 'opacity=".75"');
    g += P('M-120,0 L-120,-80 L120,-80 L120,0', null, ink, 11 * lw) + P('M-120,0 L-120,-80 L120,-80 L120,0', null, post, 7);
    if (o.glow) g += P('M-120,0 L-120,-80 L120,-80 L120,0', null, o.glow, 16, 'opacity=".35"');
    return g;
  }

  function arbitro(ctx, o) {
    // el ojo cósmico. radio base 100
    const c = o.c || '#ffb020';
    const id = uid('ag'), id2 = uid('ai');
    ctx.defs.push(`<radialGradient id="${id}"><stop offset="0" stop-color="${light(c, 0.6)}"/><stop offset=".5" stop-color="${c}"/><stop offset="1" stop-color="${dark(c, 0.6)}"/></radialGradient>`);
    ctx.defs.push(`<radialGradient id="${id2}"><stop offset=".6" stop-color="${c}" stop-opacity=".0"/><stop offset=".8" stop-color="${c}" stop-opacity=".35"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`);
    let g = `<circle r="190" fill="url(#${id2})"/>`;
    let ticks = '';
    for (let i = 0; i < 60; i++) {
      const a = (i / 60) * Math.PI * 2, r1 = i % 5 ? 150 : 138;
      ticks += `M${r2(Math.cos(a) * r1)},${r2(Math.sin(a) * r1)} L${r2(Math.cos(a) * 158)},${r2(Math.sin(a) * 158)} `;
    }
    g += `<circle r="158" fill="none" stroke="${c}" stroke-width="2" opacity=".8"/><circle r="128" fill="none" stroke="${c}" stroke-width="1" stroke-dasharray="4 8" opacity=".7"/>`;
    g += P(ticks, null, c, 3, 'opacity=".85"');
    if (o.hand != null) {
      const a = (o.hand / 60) * Math.PI * 2 - Math.PI / 2;
      g += `<line x1="0" y1="0" x2="${r2(Math.cos(a) * 145)}" y2="${r2(Math.sin(a) * 145)}" stroke="${light(c, 0.3)}" stroke-width="4"/>`;
    }
    g += P('M-120,0 Q0,-86 120,0 Q0,86 -120,0 Z', '#0a0a0f', c, 4);
    g += `<circle r="${o.shut ? 0 : 56}" fill="url(#${id})"/>`;
    if (!o.shut) {
      g += `<circle r="44" fill="none" stroke="${dark(c, 0.5)}" stroke-width="2"/>`;
      g += `<ellipse rx="10" ry="${o.wide ? 26 : 38}" fill="#050505"/>`;
      g += `<circle cx="18" cy="-18" r="9" fill="#fff" opacity=".9"/>`;
    } else g += P('M-120,0 Q0,30 120,0', null, c, 5);
    g += P('M-120,0 Q0,-86 120,0 Q0,86 -120,0 Z', 'none', light(c, 0.5), 1.5);
    return g;
  }

  function guardian(ctx, o) {
    // arquero de luz sin rostro, alto
    const c = o.c || '#5ff3ff';
    const h = o.tall || 1;
    const id = uid('gg');
    ctx.defs.push(`<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c}" stop-opacity=".95"/><stop offset="1" stop-color="${c}" stop-opacity=".25"/></linearGradient>`);
    let g = `<g transform="scale(1,${h})">`;
    g += `<ellipse cx="0" cy="-60" rx="80" ry="90" fill="${c}" opacity=".12"/>`;
    g += P('M-14,-120 C-14,-138 14,-138 14,-120 C14,-106 -14,-106 -14,-120 Z', `url(#${id})`, '#ffffff', 1.5);
    g += P('M-24,-100 L24,-100 L20,-40 L-20,-40 Z', `url(#${id})`, '#ffffff', 1.5);
    g += P('M-24,-98 L-70,-120 L-96,-134 M24,-98 L70,-120 L96,-134', null, c, 10, 'opacity=".9"');
    g += `<circle cx="-98" cy="-136" r="11" fill="#fff" opacity=".9"/><circle cx="98" cy="-136" r="11" fill="#fff" opacity=".9"/>`;
    g += P('M-14,-40 L-26,0 M14,-40 L26,0', null, c, 11, 'opacity=".8"');
    g += P('M-8,-124 L8,-124', null, '#ffffff', 2.5);
    g += '</g>';
    return g;
  }

  function card(ctx, o) {
    const c = o.c || '#050505';
    let g = `<g transform="rotate(${o.rot || -8})">`;
    g += `<rect x="-40" y="-58" width="80" height="116" rx="6" fill="${c}" stroke="${o.edge || '#ff2d4d'}" stroke-width="3"/>`;
    g += `<rect x="-40" y="-58" width="80" height="116" rx="6" fill="none" stroke="${o.edge || '#ff2d4d'}" stroke-width="12" opacity=".25"/>`;
    g += P('M-30,-50 L30,40', null, '#ffffff', 2, 'opacity=".12"');
    if (o.eye !== false) g += `<g transform="scale(.18)">${P('M-120,0 Q0,-86 120,0 Q0,86 -120,0 Z', 'none', o.edge || '#ff2d4d', 8)}<circle r="40" fill="${o.edge || '#ff2d4d'}"/></g>`;
    // mano que sostiene
    if (o.hand) g += P('M-30,40 C-40,60 -30,80 -10,84 L30,84 C40,70 40,50 30,40 Z', ctx.m(o.hand), ctx.ink, 2.4);
    return g + '</g>';
  }

  function timer(ctx, o) {
    const c = o.c || '#ff3344';
    const txt = o.t || '24:00:00';
    const w = txt.length * 30 + 40;
    let g = `<rect x="${-w / 2}" y="-44" width="${w}" height="88" rx="10" fill="#07060c" stroke="${c}" stroke-width="3" opacity=".92"/>`;
    g += `<rect x="${-w / 2}" y="-44" width="${w}" height="88" rx="10" fill="none" stroke="${c}" stroke-width="12" opacity=".2"/>`;
    g += `<text x="0" y="22" text-anchor="middle" font-family="'Share Tech Mono', monospace" font-size="58" fill="${c}" textLength="${w - 44}" lengthAdjust="spacingAndGlyphs">${txt}</text>`;
    if (o.label) g += `<text x="0" y="-54" text-anchor="middle" font-family="'Share Tech Mono', monospace" font-size="20" fill="${c}">${o.label}</text>`;
    return g;
  }

  function earth(ctx, o) {
    const id = uid('ea');
    ctx.defs.push(`<radialGradient id="${id}" cx=".35" cy=".35"><stop offset="0" stop-color="${ctx.m('#6ac2ff')}"/><stop offset=".7" stop-color="${ctx.m('#1d5fb8')}"/><stop offset="1" stop-color="${ctx.m('#0a1f4a')}"/></radialGradient>`);
    let g = `<circle r="104" fill="${ctx.m('#5fc9ff')}" opacity=".25"/><circle r="100" fill="url(#${id})"/>`;
    g += P('M-60,-40 C-40,-60 -10,-50 -20,-30 C-30,-10 -60,0 -50,20 C-40,40 -70,50 -80,30 C-90,10 -80,-20 -60,-40 Z M10,-70 C30,-80 60,-60 50,-40 C40,-20 20,-30 10,-10 C0,10 20,30 40,30 C60,30 70,50 50,70 C30,80 10,60 0,40 C-10,20 -10,-50 10,-70 Z', ctx.m('#3fae5a'), null, 0, 'opacity=".9"');
    g += P('M-80,-10 C-40,-30 40,-40 90,-20 M-90,30 C-40,20 30,10 95,20', null, '#ffffff', 5, 'opacity=".35"');
    if (o.crack) g += P('M-20,-100 L-10,-60 L-30,-30 L0,0 L-10,40 L20,100', null, '#ff3344', 3);
    return g;
  }

  function stadiumStack(ctx, W, H, o) {
    // 25 canchas apiladas en perspectiva
    const c = o.c || ctx.acc || '#39f3ff';
    const n = o.n || 9;
    let g = '';
    const cx = W * (o.cx != null ? o.cx / 100 : 0.5);
    for (let i = n - 1; i >= 0; i--) {
      const t = i / (n - 1);
      const y = H * (0.92 - t * 0.82);
      const w = W * (0.9 - t * 0.55);
      const d = w * 0.22;
      const pts = `${cx - w / 2},${y} ${cx},${y - d} ${cx + w / 2},${y} ${cx},${y + d}`;
      const grass = mix(ctx.m('#1f8f45'), '#050818', 0.25 + t * 0.4);
      g += `<polygon points="${pts}" fill="${grass}" stroke="${c}" stroke-width="${2.2 - t}" opacity="${1 - t * 0.35}"/>`;
      g += `<polygon points="${cx - w / 2},${y} ${cx},${y + d} ${cx + w / 2},${y} ${cx + w / 2},${y + 10} ${cx},${y + d + 10} ${cx - w / 2},${y + 10}" fill="${dark(c, 0.7)}" opacity="${0.8 - t * 0.4}"/>`;
      // líneas de cancha
      g += `<ellipse cx="${cx}" cy="${y}" rx="${w * 0.08}" ry="${d * 0.16}" fill="none" stroke="#ffffff" stroke-width="1" opacity=".55"/>`;
      g += `<line x1="${cx - w / 4}" y1="${y - d / 2}" x2="${cx + w / 4}" y2="${y + d / 2}" stroke="#ffffff" stroke-width="1" opacity=".45"/>`;
      if (i % 3 === 1) g += `<line x1="${cx - w * 0.3}" y1="${y}" x2="${cx - w * 0.3}" y2="${y - H * 0.1}" stroke="${c}" stroke-width="${6 - t * 3}" opacity=".25"/><line x1="${cx + w * 0.28}" y1="${y}" x2="${cx + w * 0.28}" y2="${y - H * 0.1}" stroke="${c}" stroke-width="${6 - t * 3}" opacity=".25"/>`;
    }
    return g;
  }

  // ---------- la torre de anillos (Estadio Cero visto desde la Tierra) ----------
  function tower(ctx, W, H, o) {
    const m = ctx.m;
    const c = o.c || ctx.acc || '#39f3ff';
    let g = `<rect width="${W}" height="${H}" fill="${grad(ctx, '#03020c', m(o.low || '#ff9a6a'), true, m('#0d2260'))}"/>`;
    g += stars(W, H * 0.55, o.seed || 5, 160);
    const cx = W * (o.cx != null ? o.cx / 100 : 0.5);
    const baseY = H * (o.base != null ? o.base / 100 : 0.86), topY = H * 0.04;
    // volcanes y ciudad
    g += P(`M${-W * 0.05},${baseY + H * 0.02} L${W * 0.14},${baseY - H * 0.13} L${W * 0.2},${baseY - H * 0.11} L${W * 0.34},${baseY + H * 0.02} Z`, m('#3a3f66'));
    g += P(`M${W * 0.1},${baseY - H * 0.105} L${W * 0.14},${baseY - H * 0.13} L${W * 0.17},${baseY - H * 0.116} L${W * 0.15},${baseY - H * 0.1} Z`, '#f2f4ff', null, 0, 'opacity=".85"');
    g += P(`M${W * 0.62},${baseY + H * 0.02} L${W * 0.8},${baseY - H * 0.1} L${W * 0.9},${baseY - H * 0.09} L${W * 1.05},${baseY + H * 0.02} Z`, m('#343a60'));
    const r = rng(o.seed || 8);
    let x = 0;
    while (x < W) {
      const w = W * (0.02 + r() * 0.04), h = H * (0.02 + r() * 0.06);
      g += `<rect x="${r2(x)}" y="${r2(baseY - h + H * 0.03)}" width="${r2(w)}" height="${r2(h + H * 0.2)}" fill="${m('#141a33')}"/>`;
      for (let k = 0; k < 3; k++) if (r() < 0.6) g += `<rect x="${r2(x + w * 0.3)}" y="${r2(baseY - h + H * 0.035 + k * H * 0.012)}" width="${r2(w * 0.2)}" height="${r2(H * 0.005)}" fill="#ffd97a" opacity=".8"/>`;
      x += w + 2;
    }
    // haz central
    g += `<polygon points="${cx - W * 0.03},${topY} ${cx + W * 0.03},${topY} ${cx + W * 0.16},${baseY} ${cx - W * 0.16},${baseY}" fill="${c}" opacity=".13"/>`;
    g += `<polygon points="${cx - W * 0.008},${topY} ${cx + W * 0.008},${topY} ${cx + W * 0.04},${baseY} ${cx - W * 0.04},${baseY}" fill="#ffffff" opacity=".35"/>`;
    const N = o.n || 25;
    const grass = m('#23a04f');
    for (let i = N - 1; i >= 0; i--) {
      const f = Math.pow(0.9, i);
      const y = topY + (baseY - H * 0.06 - topY) * f;
      const rx = W * 0.44 * (0.28 + 0.72 * f), ry = rx * 0.17;
      const op = 0.55 + 0.45 * f;
      g += `<ellipse cx="${cx}" cy="${r2(y + ry * 0.35)}" rx="${r2(rx)}" ry="${r2(ry)}" fill="${dark(c, 0.75)}" opacity="${r2(op)}"/>`;
      g += `<ellipse cx="${cx}" cy="${r2(y)}" rx="${r2(rx)}" ry="${r2(ry)}" fill="${mix(grass, '#0a1030', 0.55 - 0.45 * f)}" stroke="${c}" stroke-width="${r2(1 + 3 * f)}" opacity="${r2(op)}"/>`;
      g += `<ellipse cx="${cx}" cy="${r2(y)}" rx="${r2(rx * 0.55)}" ry="${r2(ry * 0.55)}" fill="none" stroke="#ffffff" stroke-width="${r2(0.5 + f)}" opacity="${r2(0.5 * op)}"/>`;
      g += `<ellipse cx="${cx}" cy="${r2(y)}" rx="${r2(rx * 1.04)}" ry="${r2(ry * 1.3)}" fill="none" stroke="${c}" stroke-width="${r2(6 * f + 1)}" opacity=".18"/>`;
      if (o.labels && (i === N - 1 || i === 12)) g += `<text x="${r2(cx + rx + 10)}" y="${r2(y + 5)}" font-family="'Share Tech Mono', monospace" font-size="${r2(10 + 12 * f)}" fill="${c}">ANILLO ${i + 1}</text>`;
    }
    // nubes cruzando los primeros anillos
    for (let i = 0; i < 6; i++) g += `<ellipse cx="${r2(W * (0.1 + r() * 0.8))}" cy="${r2(baseY - H * (0.14 + r() * 0.06))}" rx="${r2(W * (0.12 + r() * 0.12))}" ry="${r2(H * 0.012)}" fill="#ffffff" opacity=".22"/>`;
    // Estadio Coloso
    g += `<ellipse cx="${cx}" cy="${baseY}" rx="${W * 0.2}" ry="${H * 0.03}" fill="${m('#8a8fa8')}" stroke="${ctx.ink}" stroke-width="2"/>`;
    g += `<ellipse cx="${cx}" cy="${baseY - H * 0.004}" rx="${W * 0.15}" ry="${H * 0.02}" fill="${grass}"/>`;
    g += `<ellipse cx="${cx}" cy="${baseY - H * 0.004}" rx="${W * 0.15}" ry="${H * 0.02}" fill="${c}" opacity=".35"/>`;
    return g;
  }
  function waves(ctx, o) {
    const c = o.c || ctx.acc;
    let g = '';
    for (let i = 0; i < 6; i++) g += `<circle r="${110 + i * 26}" fill="none" stroke="${c}" stroke-width="${4 - i * 0.5}" opacity="${r2(0.8 - i * 0.12)}" stroke-dasharray="${i % 2 ? '10 8' : '30 6'}"/>`;
    return g;
  }
  function mic(ctx, o) {
    const on = o.on !== false;
    let g = P('M0,0 L0,-70 M-24,0 L24,0', null, ctx.ink, 6) + P('M0,0 L0,-70', null, ctx.m('#555a66'), 3);
    g += `<rect x="-11" y="-100" width="22" height="34" rx="11" fill="${ctx.m('#2a2d36')}" stroke="${ctx.ink}" stroke-width="2.5"/>`;
    g += P('M-9,-92 L9,-92 M-9,-86 L9,-86 M-9,-80 L9,-80', null, ctx.m('#8a8f9c'), 1.4);
    if (on) g += `<circle cx="0" cy="-108" r="5" fill="#ff2233"/><circle cx="0" cy="-108" r="12" fill="#ff2233" opacity=".3"/>`;
    return g;
  }
  function cooler(ctx) {
    return `<rect x="-30" y="-36" width="60" height="36" rx="4" fill="${ctx.m('#e8eef5')}" stroke="${ctx.ink}" stroke-width="2.5"/><rect x="-30" y="-36" width="60" height="10" rx="3" fill="${ctx.m('#1f6fe0')}" stroke="${ctx.ink}" stroke-width="2.5"/>${P('M-14,-36 Q0,-48 14,-36', null, ctx.ink, 3)}`;
  }
  function board(ctx) {
    let g = `<rect x="-70" y="-100" width="140" height="90" fill="#f7f9fb" stroke="${ctx.ink}" stroke-width="3"/>`;
    g += P('M-40,-80 L-10,-60 L20,-70 L40,-40 M-50,-40 L-20,-50', null, '#1f6fe0', 2.4) + P('M40,-40 l-8,0 m8,0 l-2,-8', null, '#1f6fe0', 2.4);
    g += `<text x="-42" y="-70" font-family="Bangers" font-size="14" fill="#e3262e">X</text><text x="10" y="-30" font-family="Bangers" font-size="14" fill="#e3262e">O O</text>`;
    g += P('M-60,-10 L-60,20 M60,-10 L60,20', null, ctx.ink, 3);
    return g;
  }
  function screen(ctx, W, H, e) {
    const x = W * (e.x || 0) / 100, y = H * (e.y || 0) / 100, w = W * (e.w || 40) / 100, h = H * (e.h || 30) / 100;
    let g = `<rect x="${r2(x - 8)}" y="${r2(y - 8)}" width="${r2(w + 16)}" height="${r2(h + 16)}" rx="6" fill="#0b0c10" stroke="${ctx.ink}" stroke-width="3"/>`;
    g += `<rect x="${r2(x - 20)}" y="${r2(y - 20)}" width="${r2(w + 40)}" height="${r2(h + 40)}" rx="10" fill="${e.glow || '#8fd8ff'}" opacity=".12"/>`;
    if (e.sub) g += render(e.sub, Math.round(w), Math.round(h)).replace('<svg ', `<svg x="${r2(x)}" y="${r2(y)}" width="${r2(w)}" height="${r2(h)}" `);
    g += `<polygon points="${r2(x)},${r2(y)} ${r2(x + w * 0.4)},${r2(y)} ${r2(x + w * 0.1)},${r2(y + h)} ${r2(x)},${r2(y + h)}" fill="#ffffff" opacity=".07"/>`;
    if (e.live) g += `<rect x="${r2(x + 10)}" y="${r2(y + 10)}" width="70" height="24" fill="#e3262e"/><text x="${r2(x + 45)}" y="${r2(y + 28)}" text-anchor="middle" font-family="'Share Tech Mono', monospace" font-size="17" fill="#fff">${e.live === true ? 'EN VIVO' : e.live}</text>`;
    if (e.leg) g += `<line x1="${r2(x + w / 2)}" y1="${r2(y + h + 8)}" x2="${r2(x + w / 2)}" y2="${r2(H)}" stroke="#0b0c10" stroke-width="${r2(w * 0.04)}"/>`;
    return g;
  }

  // ---------- fondos ----------
  function stars(W, H, seed, n, col) {
    const r = rng(seed || 11);
    let s = '';
    for (let i = 0; i < (n || 90); i++) s += `<circle cx="${r2(r() * W)}" cy="${r2(r() * H)}" r="${r2(r() * 1.8 + 0.3)}" fill="${col || '#fff'}" opacity="${r2(r() * 0.8 + 0.2)}"/>`;
    return s;
  }
  function grad(ctx, a, b, vertical, c) {
    const id = uid('bg');
    ctx.defs.push(`<linearGradient id="${id}" x1="0" y1="0" x2="${vertical ? 0 : 1}" y2="${vertical ? 1 : 0}"><stop offset="0" stop-color="${a}"/>${c ? `<stop offset=".55" stop-color="${c}"/>` : ''}<stop offset="1" stop-color="${b}"/></linearGradient>`);
    return `url(#${id})`;
  }
  function crowdDots(ctx, W, y0, y1, seed, dim) {
    const r = rng(seed || 3);
    let g = '';
    const cols = ['#e3262e', '#1f6fe0', '#ffd400', '#ffffff', '#79b6e3', '#1faa59', '#ff7a1a'];
    for (let y = y0; y < y1; y += 9) for (let x = (y % 2) * 4; x < W; x += 9) {
      if (r() < 0.12) continue;
      g += `<circle cx="${r2(x + r() * 3)}" cy="${r2(y + r() * 3)}" r="${r2(2.2 + r())}" fill="${ctx.m(cols[Math.floor(r() * cols.length)])}" opacity="${dim || 0.75}"/>`;
    }
    return g;
  }
  function pitch(ctx, W, H, hy, o) {
    const g1 = ctx.m(o.grass || '#2e9a4a'), g2 = ctx.m(dark(o.grass || '#2e9a4a', 0.12));
    let g = `<rect x="0" y="${hy}" width="${W}" height="${H - hy}" fill="${g1}"/>`;
    const n = 8;
    for (let i = 0; i < n; i += 2) {
      const t0 = i / n, t1 = (i + 1) / n;
      const y0 = hy + (H - hy) * t0 * t0, y1 = hy + (H - hy) * t1 * t1;
      g += `<rect x="0" y="${r2(y0)}" width="${W}" height="${r2(y1 - y0)}" fill="${g2}"/>`;
    }
    const line = ctx.style === 'neon' ? ctx.acc : '#ffffff';
    g += `<line x1="0" y1="${r2(hy + (H - hy) * 0.18)}" x2="${W}" y2="${r2(hy + (H - hy) * 0.18)}" stroke="${line}" stroke-width="3" opacity=".8"/>`;
    g += `<ellipse cx="${W * 0.5}" cy="${r2(hy + (H - hy) * 0.45)}" rx="${W * 0.28}" ry="${r2((H - hy) * 0.16)}" fill="none" stroke="${line}" stroke-width="3" opacity=".7"/>`;
    return g;
  }

  function background(ctx, W, H, bg, o) {
    const m = ctx.m;
    const st = ctx.style;
    const paper = ctx.S.paper || '#fbf6ec';
    let g = '';
    switch (bg) {
      case 'none': return '';
      case 'white': return `<rect width="${W}" height="${H}" fill="${st === 'manga' ? paper : '#fffdf7'}"/>`;
      case 'black': return `<rect width="${W}" height="${H}" fill="#07060a"/>`;
      case 'flat': return `<rect width="${W}" height="${H}" fill="${m(o.bgc || '#d8d2c4')}"/>`;
      case 'sky':
        g += `<rect width="${W}" height="${H}" fill="${grad(ctx, m('#4aa3ff'), m('#cfeaff'), true)}"/>`;
        g += P(`M${W * 0.1},${H * 0.25} q30,-20 60,0 q20,-14 40,4 q20,4 0,16 h-100 q-20,-8 0,-20 Z`, '#ffffff', null, 0, 'opacity=".85"');
        return g;
      case 'sunset':
        g += `<rect width="${W}" height="${H}" fill="${grad(ctx, m('#ff6b8b'), m('#ffd27a'), true, m('#ff9a5a'))}"/>`;
        g += `<circle cx="${W * 0.7}" cy="${H * 0.62}" r="${Math.min(W, H) * 0.18}" fill="${m('#fff1b8')}" opacity=".9"/>`;
        for (let i = 0; i < 5; i++) g += `<rect x="0" y="${H * (0.5 + i * 0.05)}" width="${W}" height="${H * 0.012}" fill="${m('#ff9a5a')}" opacity=".6"/>`;
        return g;
      case 'curve': // cancha estilo Supercampeones con horizonte curvo
        g += `<rect width="${W}" height="${H}" fill="${grad(ctx, m('#ff7f6b'), m('#ffe2a0'), true)}"/>`;
        g += `<path d="M-40,${H} L-40,${H * 0.55} Q${W / 2},${H * 0.2} ${W + 40},${H * 0.55} L${W + 40},${H} Z" fill="${m('#3faa4f')}" stroke="${ctx.ink}" stroke-width="${2 * ctx.lw}"/>`;
        g += `<path d="M-40,${H * 0.72} Q${W / 2},${H * 0.36} ${W + 40},${H * 0.72}" fill="none" stroke="#fff" stroke-width="4" opacity=".85"/>`;
        return g;
      case 'night':
        g += `<rect width="${W}" height="${H}" fill="${grad(ctx, m('#0b1030'), m('#2a1b4a'), true)}"/>` + stars(W, H * 0.7, o.seed, 70);
        return g;
      case 'space':
        g += `<rect width="${W}" height="${H}" fill="${grad(ctx, '#05030d', '#120a2a', true, '#0a0620')}"/>`;
        g += `<ellipse cx="${W * 0.7}" cy="${H * 0.3}" rx="${W * 0.5}" ry="${H * 0.22}" fill="${m('#5b2bd8')}" opacity=".18"/>`;
        g += `<ellipse cx="${W * 0.2}" cy="${H * 0.7}" rx="${W * 0.4}" ry="${H * 0.18}" fill="${m('#11b5d8')}" opacity=".12"/>`;
        g += stars(W, H, o.seed, 140);
        return g;
      case 'stadium': {
        const hy = H * (o.hy != null ? o.hy / 100 : 0.52);
        g += `<rect width="${W}" height="${H}" fill="${o.night === false ? grad(ctx, m('#6ab7ff'), m('#dff1ff'), true) : grad(ctx, m('#0d1330'), m('#2a2f5a'), true)}"/>`;
        if (o.night !== false) g += stars(W, hy * 0.4, o.seed, 30);
        // gradas
        g += `<path d="M0,${hy * 0.35} Q${W / 2},${hy * 0.2} ${W},${hy * 0.35} L${W},${hy} L0,${hy} Z" fill="${m('#23263a')}"/>`;
        g += crowdDots(ctx, W, hy * 0.32, hy - 6, o.seed, 0.7);
        g += `<rect x="0" y="${hy - 10}" width="${W}" height="10" fill="${m('#1a1d2c')}"/>`;
        // torres de luz
        [0.08, 0.92].forEach((fx) => {
          const x = W * fx;
          g += `<line x1="${x}" y1="${hy * 0.1}" x2="${x}" y2="${hy * 0.35}" stroke="${m('#555')}" stroke-width="4"/>`;
          g += `<rect x="${x - 22}" y="${hy * 0.06}" width="44" height="16" fill="${m('#fffbe0')}" stroke="${ctx.ink}" stroke-width="1.5"/>`;
          g += `<polygon points="${x - 22},${hy * 0.1} ${x + 22},${hy * 0.1} ${W * 0.5 + (fx - 0.5) * W * 0.3},${hy} ${W * 0.5 - (fx - 0.5) * -W * 0.1},${hy}" fill="#fffbe0" opacity=".08"/>`;
        });
        g += pitch(ctx, W, H, hy, o);
        return g;
      }
      case 'pitch': {
        const hy = H * (o.hy != null ? o.hy / 100 : 0.3);
        g += `<rect width="${W}" height="${H}" fill="${o.skyc ? m(o.skyc) : grad(ctx, m('#0a0d24'), m('#1b2350'), true)}"/>`;
        if (!o.skyc) g += stars(W, hy, o.seed, 40);
        g += pitch(ctx, W, H, hy, o);
        return g;
      }
      case 'stack':
        g += background(ctx, W, H, 'space', o);
        if (o.earth) g += `<g transform="translate(${W * 0.82},${H * 0.85}) scale(${Math.min(W, H) / 380})">${earth(ctx, {})}</g>`;
        g += stadiumStack(ctx, W, H, o);
        return g;
      case 'void':
        return `<rect width="${W}" height="${H}" fill="${grad(ctx, m(o.bgc || '#ffffff'), m(o.bgc2 || '#d7dde8'), true)}"/>`;
      case 'mirror': {
        g += `<rect width="${W}" height="${H}" fill="${grad(ctx, '#0c0f18', '#28324a', false, '#11151f')}"/>`;
        const r = rng(o.seed || 21);
        for (let i = 0; i < 16; i++) {
          const x = r() * W, y = r() * H, s = 30 + r() * 120;
          g += `<polygon points="${r2(x)},${r2(y)} ${r2(x + s)},${r2(y + s * 0.3)} ${r2(x + s * 0.4)},${r2(y + s)}" fill="${chromeGrad(ctx)}" opacity="${r2(0.08 + r() * 0.2)}"/>`;
        }
        return g;
      }
      case 'locker': {
        g += `<rect width="${W}" height="${H}" fill="${m('#2b2f3a')}"/>`;
        for (let x = 0; x < W; x += 90) g += `<rect x="${x + 6}" y="${H * 0.08}" width="78" height="${H * 0.58}" fill="${m('#3b4252')}" stroke="${ctx.ink}" stroke-width="2"/><rect x="${x + 16}" y="${H * 0.14}" width="58" height="10" fill="${m('#222733')}"/>`;
        g += `<rect x="0" y="${H * 0.7}" width="${W}" height="${H * 0.08}" fill="${m('#6b4a2e')}" stroke="${ctx.ink}" stroke-width="2"/><rect x="0" y="${H * 0.78}" width="${W}" height="${H * 0.22}" fill="${m('#1a1d25')}"/>`;
        return g;
      }
      case 'barrio': {
        g += `<rect width="${W}" height="${H}" fill="${grad(ctx, m('#ff8a5a'), m('#ffd08a'), true)}"/>`;
        const r = rng(o.seed || 4);
        let x = 0;
        while (x < W) {
          const w = 60 + r() * 80, h = H * (0.25 + r() * 0.3);
          const col = m(['#e0b36a', '#d9765a', '#8fb3d9', '#e8d9b0', '#b98fd0'][Math.floor(r() * 5)]);
          g += `<rect x="${r2(x)}" y="${r2(H * 0.75 - h)}" width="${r2(w)}" height="${r2(h)}" fill="${col}" stroke="${ctx.ink}" stroke-width="2"/>`;
          g += `<rect x="${r2(x + w * 0.3)}" y="${r2(H * 0.75 - h * 0.7)}" width="${r2(w * 0.25)}" height="${r2(h * 0.25)}" fill="${m('#3b3040')}"/>`;
          x += w;
        }
        g += `<rect x="0" y="${H * 0.75}" width="${W}" height="${H * 0.25}" fill="${m('#9a8a70')}"/>`;
        g += `<line x1="0" y1="${H * 0.2}" x2="${W}" y2="${H * 0.3}" stroke="${ctx.ink}" stroke-width="1.5"/>`;
        return g;
      }
      case 'earthview':
        g += background(ctx, W, H, 'space', o);
        g += `<g transform="translate(${W * (o.ex || 50) / 100},${H * (o.ey || 110) / 100}) scale(${(Math.max(W, H) / 150) * (o.es || 1)})">${o.waves ? waves(ctx, { c: o.wc || '#39f3ff' }) : ''}${earth(ctx, o)}</g>`;
        return g;
      case 'tower': return tower(ctx, W, H, o);
      case 'pecera': {
        g += background(ctx, W, H, 'space', o);
        g += `<g opacity=".6">${stadiumStack(ctx, W, H, { n: 6, cx: 75, c: '#39f3ff' })}</g>`;
        g += `<rect width="${W}" height="${H}" fill="${m('#0c1426')}" opacity=".45"/>`;
        for (let x = 0; x < W; x += W / 4) g += `<rect x="${r2(x)}" y="0" width="${r2(W * 0.012)}" height="${H}" fill="${m('#3a4660')}"/>`;
        g += P(`M${W * 0.1},0 L${W * 0.3},${H} M${W * 0.18},0 L${W * 0.34},${H} M${W * 0.6},0 L${W * 0.72},${H * 0.6}`, null, '#ffffff', 3, 'opacity=".08"');
        g += `<rect x="0" y="${H * 0.82}" width="${W}" height="${H * 0.18}" fill="${m('#2a3040')}" stroke="${ctx.ink}" stroke-width="3"/>`;
        g += `<rect x="0" y="${H * 0.82}" width="${W}" height="${H * 0.02}" fill="${m('#39f3ff')}" opacity=".35"/>`;
        return g;
      }
      case 'plaza': {
        g += `<rect width="${W}" height="${H}" fill="${grad(ctx, m('#0a0f28'), m(o.low || '#2c2350'), true)}"/>`;
        g += stars(W, H * 0.4, o.seed, 40);
        const r = rng(o.seed || 12);
        let x = -10;
        while (x < W) {
          const w = W * (0.06 + r() * 0.1), h = H * (0.3 + r() * 0.35);
          g += `<rect x="${r2(x)}" y="${r2(H * 0.85 - h)}" width="${r2(w)}" height="${r2(h)}" fill="${m('#161b33')}" stroke="${m('#0a0d1c')}" stroke-width="2"/>`;
          for (let yy = H * 0.85 - h + 10; yy < H * 0.84; yy += 16) for (let xx = x + 6; xx < x + w - 8; xx += 14) if (r() < 0.35) g += `<rect x="${r2(xx)}" y="${r2(yy)}" width="6" height="8" fill="#ffd97a" opacity=".7"/>`;
          x += w + 4;
        }
        g += `<rect x="0" y="${H * 0.85}" width="${W}" height="${H * 0.15}" fill="${m('#101322')}"/>`;
        return g;
      }
      case 'rain':
        g += `<rect width="${W}" height="${H}" fill="${grad(ctx, m('#2c3444'), m('#556070'), true)}"/>`;
        for (let i = 0; i < 70; i++) { const r = rng(i + 3); const x = r() * W, y = r() * H; g += `<line x1="${r2(x)}" y1="${r2(y)}" x2="${r2(x - 8)}" y2="${r2(y + 30)}" stroke="#cfe0f5" stroke-width="1.2" opacity=".5"/>`; }
        return g;
      default:
        return `<rect width="${W}" height="${H}" fill="${m(o.bgc || '#eee')}"/>`;
    }
  }

  // ---------- efectos ----------
  function fx(ctx, W, H, name, o) {
    const r = rng((o.seed || 1) * 7 + name.length);
    const cx = W * (o.fx != null ? o.fx / 100 : 0.5), cy = H * (o.fy != null ? o.fy / 100 : 0.5);
    const col = o.fxc || (ctx.style === 'neon' ? ctx.acc : ctx.ink);
    let g = '';
    switch (name) {
      case 'focus': {
        const R = Math.hypot(W, H);
        const r0 = Math.min(W, H) * (o.fr || 0.28);
        for (let i = 0; i < 90; i++) {
          const a = r() * Math.PI * 2, w = 0.006 + r() * 0.018, rr = r0 * (0.9 + r() * 0.6);
          g += `<polygon points="${r2(cx + Math.cos(a - w) * R)},${r2(cy + Math.sin(a - w) * R)} ${r2(cx + Math.cos(a + w) * R)},${r2(cy + Math.sin(a + w) * R)} ${r2(cx + Math.cos(a) * rr)},${r2(cy + Math.sin(a) * rr)}" fill="${col}" opacity=".85"/>`;
        }
        return g;
      }
      case 'speed': {
        const ang = ((o.fa || 0) * Math.PI) / 180;
        g += `<g transform="rotate(${o.fa || 0},${W / 2},${H / 2})">`;
        for (let i = 0; i < 46; i++) {
          const y = -H * 0.3 + r() * H * 1.6, x = -W * 0.3 + r() * W * 1.2, l = W * (0.2 + r() * 0.6);
          g += `<line x1="${r2(x)}" y1="${r2(y)}" x2="${r2(x + l)}" y2="${r2(y)}" stroke="${col}" stroke-width="${r2(0.8 + r() * 2.6)}" opacity=".7"/>`;
        }
        void ang;
        return g + '</g>';
      }
      case 'burst': {
        const R1 = Math.min(W, H) * (o.fr || 0.3), R2 = R1 * 0.55;
        let d = '';
        for (let i = 0; i < 28; i++) { const a = (i / 28) * Math.PI * 2, rr = i % 2 ? R2 : R1 * (0.8 + r() * 0.4); d += (i ? 'L' : 'M') + r2(cx + Math.cos(a) * rr) + ',' + r2(cy + Math.sin(a) * rr); }
        return P(d + 'Z', ctx.m(o.burstc || '#fff27a'), ctx.ink, 3 * ctx.lw, 'opacity=".95"');
      }
      case 'glow':
        return `<circle cx="${cx}" cy="${cy}" r="${Math.min(W, H) * (o.fr || 0.4)}" fill="${o.fxc || ctx.acc}" opacity=".28"/><circle cx="${cx}" cy="${cy}" r="${Math.min(W, H) * (o.fr || 0.4) * 0.5}" fill="${o.fxc || ctx.acc}" opacity=".3"/>`;
      case 'aura': {
        const c = o.fxc || ctx.acc;
        for (let i = 0; i < 26; i++) {
          const x = cx + (r() - 0.5) * W * 0.6, y0 = cy + H * 0.3, l = H * (0.3 + r() * 0.5);
          g += P(`M${r2(x)},${r2(y0)} Q${r2(x + (r() - 0.5) * 60)},${r2(y0 - l / 2)} ${r2(x + (r() - 0.5) * 30)},${r2(y0 - l)}`, null, c, r2(2 + r() * 6), `opacity="${r2(0.25 + r() * 0.5)}"`);
        }
        return g;
      }
      case 'particles': case 'dust': {
        const c = o.fxc || (name === 'dust' ? '#a59d90' : ctx.acc);
        for (let i = 0; i < 60; i++) {
          const x = cx + (r() - 0.3) * W * 0.7, y = cy + (r() - 0.5) * H * 0.7, s = 2 + r() * 7;
          g += `<rect x="${r2(x)}" y="${r2(y)}" width="${r2(s)}" height="${r2(s)}" fill="${c}" opacity="${r2(0.3 + r() * 0.7)}" transform="rotate(${r2(r() * 90)},${r2(x)},${r2(y)})"/>`;
        }
        return g;
      }
      case 'shards': {
        for (let i = 0; i < 22; i++) {
          const x = r() * W, y = r() * H, s = 10 + r() * 40;
          g += `<polygon points="${r2(x)},${r2(y)} ${r2(x + s)},${r2(y + s * 0.2)} ${r2(x + s * 0.3)},${r2(y + s * 0.9)}" fill="${chromeGrad(ctx)}" stroke="#fff" stroke-width=".8" opacity=".85"/>`;
        }
        return g;
      }
      case 'sparkle': {
        for (let i = 0; i < 14; i++) {
          const x = r() * W, y = r() * H, s = 4 + r() * 12;
          g += P(`M${r2(x)},${r2(y - s)} L${r2(x + s * 0.2)},${r2(y - s * 0.2)} L${r2(x + s)},${r2(y)} L${r2(x + s * 0.2)},${r2(y + s * 0.2)} L${r2(x)},${r2(y + s)} L${r2(x - s * 0.2)},${r2(y + s * 0.2)} L${r2(x - s)},${r2(y)} L${r2(x - s * 0.2)},${r2(y - s * 0.2)} Z`, '#fff', null, 0, 'opacity=".9"');
        }
        return g;
      }
      case 'vignette': {
        const id = uid('vg');
        ctx.defs.push(`<radialGradient id="${id}"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="${o.vo || 0.75}"/></radialGradient>`);
        return `<rect width="${W}" height="${H}" fill="url(#${id})"/>`;
      }
      case 'red': return `<rect width="${W}" height="${H}" fill="#ff0022" opacity=".22" style="mix-blend-mode:multiply"/>`;
      case 'flash': return `<rect width="${W}" height="${H}" fill="#fff" opacity=".55"/>`;
      case 'crack': {
        let d = '';
        for (let i = 0; i < 9; i++) { let x = cx, y = cy; d += `M${r2(x)},${r2(y)}`; const a = r() * Math.PI * 2; for (let j = 0; j < 5; j++) { x += Math.cos(a + (r() - 0.5)) * 40; y += Math.sin(a + (r() - 0.5)) * 40; d += ` L${r2(x)},${r2(y)}`; } }
        return P(d, null, '#fff', 3) + P(d, null, ctx.ink, 1.2);
      }
      case 'beam': return `<polygon points="${cx - 30},0 ${cx + 30},0 ${cx + W * 0.2},${H} ${cx - W * 0.2},${H}" fill="${o.fxc || '#fffbe0'}" opacity=".22"/>`;
      case 'hands': { // manos del público/jugadores extendidas
        for (let i = 0; i < 9; i++) { const x = (i + 0.5) * (W / 9); g += P(`M${r2(x)},${H} L${r2(x - 6)},${r2(H * 0.75)} L${r2(x + 8)},${r2(H * 0.75)} Z`, '#000', null, 0, 'opacity=".75"'); }
        return g;
      }
      default: return '';
    }
  }

  // Multitud de bustos pequeños (grupos)
  function mob(ctx, W, H, o) {
    const r = rng(o.seed || 9);
    const n = o.n || 12;
    const y = H * (o.y != null ? o.y / 100 : 0.8);
    const s = (H / 260) * (o.s || 0.5);
    const kits = o.kits || ['arg', 'por', 'bra', 'fra', 'esp', 'nor', 'col', 'cro', 'casual'];
    const cs = ['extra1', 'extra2', 'extra3', 'jaime', 'vinicio', 'alvaro', 'mbapo', 'haalund', 'neimar'];
    let g = '';
    for (let i = 0; i < n; i++) {
      const x = W * (0.04 + (0.92 * (i + r() * 0.5)) / n);
      const yy = y + (r() - 0.5) * H * 0.06;
      const ch = Object.assign({}, CH[cs[Math.floor(r() * cs.length)]]);
      const kit = kits[Math.floor(r() * kits.length)];
      const sc = s * (0.8 + r() * 0.3);
      const opt = { kit, e: o.e || (r() < 0.5 ? 'shock' : 'n'), lx: (r() - 0.5) * 10, num: Math.floor(r() * 30) + 1, rf: o.rf, stone: o.stone };
      if (o.silhouette) {
        g += `<g transform="translate(${r2(x)},${r2(yy)}) scale(${r2(sc)})">${P('M-40,-60 C-40,-110 40,-110 40,-60 C40,-30 20,-10 0,-10 C-20,-10 -40,-30 -40,-60 Z M-110,170 C-110,60 -40,40 0,40 C40,40 110,60 110,170 Z', o.silhouette)}</g>`;
      } else {
        g += `<g transform="translate(${r2(x)},${r2(yy)}) scale(${r2(sc)})">${bust(ctx, ch, opt)}</g>`;
      }
    }
    return g;
  }

  // ---------- capas finales (filtros y texturas) ----------
  function overlay(ctx, W, H) {
    const ov = ctx.S.ov;
    let g = '';
    if (ov === 'tone') {
      const id = uid('pt');
      ctx.defs.push(`<pattern id="${id}" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><circle cx="3.5" cy="3.5" r="1.3" fill="#000"/></pattern>`);
      g += `<rect width="${W}" height="${H}" fill="url(#${id})" opacity=".13"/>`;
    }
    if (ov === 'ben') {
      const id = uid('pb');
      ctx.defs.push(`<pattern id="${id}" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><circle cx="6" cy="6" r="2.6" fill="#ff2a6a"/></pattern>`);
      g += `<rect width="${W}" height="${H}" fill="url(#${id})" opacity=".16"/>`;
    }
    if (ov === 'grain' || ov === 'paper') {
      const id = uid('gr');
      ctx.defs.push(`<filter id="${id}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="${ov === 'paper' ? 0.035 : 0.9}" numOctaves="${ov === 'paper' ? 4 : 1}" seed="3"/><feColorMatrix values="0 0 0 0 ${ov === 'paper' ? 0.55 : 0.1}  0 0 0 0 ${ov === 'paper' ? 0.42 : 0.08}  0 0 0 0 ${ov === 'paper' ? 0.3 : 0.06}  0 0 0 ${ov === 'paper' ? 0.5 : 0.45} 0"/></filter>`);
      g += `<rect width="${W}" height="${H}" filter="url(#${id})" opacity="${ov === 'paper' ? 0.45 : 0.35}"/>`;
    }
    if (ov === 'scan') {
      const id = uid('sc');
      ctx.defs.push(`<pattern id="${id}" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="1.4" fill="#000"/></pattern>`);
      g += `<rect width="${W}" height="${H}" fill="url(#${id})" opacity=".22"/>`;
    }
    return g;
  }

  function filterDef(ctx) {
    const f = ctx.S.f;
    if (!f) return null;
    const id = uid('fl');
    if (f === 'glow') ctx.defs.push(`<filter id="${id}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="2.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`);
    if (f === 'water') ctx.defs.push(`<filter id="${id}" x="-2%" y="-2%" width="104%" height="104%"><feTurbulence type="fractalNoise" baseFrequency=".03" numOctaves="3" seed="7" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="7" xChannelSelector="R" yChannelSelector="G" result="d"/><feGaussianBlur in="d" stdDeviation=".7" result="bl"/><feBlend in="bl" in2="d" mode="multiply"/></filter>`);
    if (f === 'rough') ctx.defs.push(`<filter id="${id}" x="-2%" y="-2%" width="104%" height="104%"><feTurbulence type="turbulence" baseFrequency=".06" numOctaves="2" seed="4" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="3.5" xChannelSelector="R" yChannelSelector="G"/></filter>`);
    if (f === 'glitch') ctx.defs.push(`<filter id="${id}" x="-3%" y="-3%" width="106%" height="106%"><feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r"/><feOffset in="r" dx="-5" dy="0" result="ro"/><feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="bl"/><feOffset in="bl" dx="5" dy="1" result="bo"/><feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g"/><feBlend in="ro" in2="g" mode="screen" result="rg"/><feBlend in="rg" in2="bo" mode="screen"/></filter>`);
    return id;
  }

  // ---------- SFX y textos ----------
  function sfx(ctx, W, H, s) {
    // s: {t, x, y, size, rot, c}
    const size = (s.size || 12) * W / 100;
    const c = ctx.m(s.c || '#ffdd00');
    const sk = s.skew != null ? s.skew : -8;
    return `<g transform="translate(${W * s.x / 100},${H * s.y / 100}) rotate(${s.rot || -8}) skewX(${sk})"><text text-anchor="middle" dominant-baseline="middle" font-family="Bangers, Impact, sans-serif" font-size="${r2(size)}" fill="${c}" stroke="${s.st || '#111'}" stroke-width="${r2(size * 0.09)}" paint-order="stroke" letter-spacing="${r2(size * 0.04)}">${s.t}</text></g>`;
  }

  // ---------- escena ----------
  function place(W, H, e) {
    const x = (W * (e.x != null ? e.x : 50)) / 100, y = (H * (e.y != null ? e.y : 60)) / 100;
    return { x: r2(x), y: r2(y) };
  }

  function element(ctx, W, H, e) {
    const pos = place(W, H, e);
    const flip = e.flip ? -1 : 1;
    const rot = e.rot || 0;
    const ch = CH[e.c] || CH.extra1;
    let inner = '', scale = 1;
    switch (e.k) {
      case 'bust': scale = (H * (e.s || 0.8)) / 230; inner = bust(ctx, ch, e); break;
      case 'head': scale = (H * (e.s || 0.6)) / 120; inner = head(ctx, ch, e); break;
      case 'eyes': {
        // primer plano extremo de ojos: se recorta a una franja
        scale = Math.max((W * (e.s || 1)) / 110, H / ((e.band || 44) - 4));
        const clip = uid('ey');
        ctx.defs.push(`<clipPath id="${clip}"><rect x="-60" y="-24" width="120" height="${e.band || 44}"/></clipPath>`);
        inner = `<g clip-path="url(#${clip})"><rect x="-60" y="-24" width="120" height="60" fill="${ctx.m(ch.skin)}"/>${head(ctx, ch, e)}</g>`;
        break;
      }
      case 'fig': scale = (H * (e.s || 0.6)) / 140; inner = `<g transform="translate(0,${e.hip ? 0 : -52})">${fig(ctx, ch, e)}</g>`; break;
      case 'mic': scale = (H * (e.s || 0.4)) / 100; inner = mic(ctx, e); break;
      case 'cooler': scale = (H * (e.s || 0.2)) / 40; inner = cooler(ctx, e); break;
      case 'screen': return screen(ctx, W, H, e);
      case 'tower': return tower(ctx, W, H, e);
      case 'waves': scale = (Math.min(W, H) * (e.s || 0.5)) / 200; inner = waves(ctx, e); break;
      case 'board': scale = (H * (e.s || 0.4)) / 100; inner = board(ctx, e); break;
      case 'ball': scale = (H * (e.s || 0.08)) / 20; inner = ball(ctx, e); break;
      case 'goal': scale = (W * (e.s || 0.6)) / 240; inner = goal(ctx, e); break;
      case 'arbitro': scale = (Math.min(W, H) * (e.s || 0.8)) / 320; inner = arbitro(ctx, e); break;
      case 'guardian': scale = (H * (e.s || 0.7)) / 140; inner = guardian(ctx, e); break;
      case 'card': scale = (H * (e.s || 0.5)) / 120; inner = card(ctx, e); break;
      case 'timer': scale = (W * (e.s || 0.5)) / 300; inner = timer(ctx, e); break;
      case 'earth': scale = (Math.min(W, H) * (e.s || 0.5)) / 200; inner = earth(ctx, e); break;
      case 'mob': return mob(ctx, W, H, e);
      case 'stack': return stadiumStack(ctx, W, H, e);
      case 'rect': return `<rect x="${W * (e.x || 0) / 100}" y="${H * (e.y || 0) / 100}" width="${W * (e.w || 100) / 100}" height="${H * (e.h || 10) / 100}" fill="${ctx.m(e.fill || '#000')}" opacity="${e.op != null ? e.op : 1}"/>`;
      case 'text': {
        const size = (e.size || 10) * W / 100;
        return `<text x="${pos.x}" y="${pos.y}" text-anchor="middle" font-family="${e.font || 'Bangers, Impact'}" font-size="${r2(size)}" fill="${e.fill || '#fff'}" stroke="${e.st || '#000'}" stroke-width="${r2(size * (e.sw != null ? e.sw : 0.06))}" paint-order="stroke" letter-spacing="${e.ls || 2}" transform="rotate(${rot},${pos.x},${pos.y})">${e.t}</text>`;
      }
      case 'fx': return fx(ctx, W, H, e.n, e);
      case 'ghost': // figura etérea de Guardián/Árbitro detrás
        scale = (H * (e.s || 0.8)) / 140; inner = `<g opacity="${e.op || 0.35}">${guardian(ctx, e)}</g>`; break;
      default: return '';
    }
    const op = e.op != null ? ` opacity="${e.op}"` : '';
    const f = e.blur ? ` filter="url(#${blurDef(ctx, e.blur)})"` : '';
    return `<g transform="translate(${pos.x},${pos.y}) rotate(${rot}) scale(${r2(scale * flip)},${r2(scale)})"${op}${f}>${inner}</g>`;
  }
  function blurDef(ctx, v) { const id = uid('bl'); ctx.defs.push(`<filter id="${id}"><feGaussianBlur stdDeviation="${v}"/></filter>`); return id; }

  // panel: {st, ac, bg, el:[], fx:[], sfx:[]}, W,H en unidades
  function render(panel, W, H) {
    const ctx = makeCtx(panel.st || 'color', panel.ac);
    const o = Object.assign({}, panel.bgo || {});
    let body = background(ctx, W, H, panel.bg || 'white', o);
    (panel.fx0 || []).forEach((n) => { body += fx(ctx, W, H, typeof n === 'string' ? n : n.n, typeof n === 'string' ? {} : n); });
    (panel.el || []).forEach((e) => { body += element(ctx, W, H, e); });
    (panel.fx || []).forEach((n) => { body += fx(ctx, W, H, typeof n === 'string' ? n : n.n, typeof n === 'string' ? {} : n); });
    (panel.sfx || []).forEach((s) => { body += sfx(ctx, W, H, s); });
    body += overlay(ctx, W, H);
    const fid = filterDef(ctx);
    if (fid) body = `<g filter="url(#${fid})">${body}</g>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" role="img"><defs>${ctx.defs.join('')}</defs>${body}</svg>`;
  }

  global.ART = { render, CH, KITS, STYLES, POSES };
})(typeof window !== 'undefined' ? window : globalThis);
