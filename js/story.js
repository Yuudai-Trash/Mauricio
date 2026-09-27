/* ESTADIO CERO — guion en viñetas.
 * Página: { rows: [[altura, panel, panel...], ...] } o { full: panel } o { text: html }.
 * Panel: { st, bg, bgo, ac, el:[], fx0:[], fx:[], sfx:[], b:[] , w }.
 * Burbujas: sp (diálogo), sh (grito), th (pensamiento), sy (Árbitro), ca (narración), wh (susurro), rf (Reflejo), tv (transmisión).
 */
(function (global) {
  'use strict';
  const mk = (t) => (x, y, s, tail, w) => ({ t, x, y, s, tail: tail || (t === 'ca' || t === 'sy' || t === 'tv' ? 'n' : 'b'), w });
  const sp = mk('sp'), sh = mk('sh'), th = mk('th'), sy = mk('sy'), ca = mk('ca'), wh = mk('wh'), rf = mk('rf'), tv = mk('tv');
  const R = (h, ...p) => [h, ...p];
  const pg = (...rows) => ({ rows });
  const full = (p) => ({ full: p });
  const bu = (c, x, y, s, e, m, o) => Object.assign({ k: 'bust', c, x, y, s, e, m }, o || {});
  const fg = (c, pose, x, y, s, o) => Object.assign({ k: 'fig', c, pose, x, y, s }, o || {});
  const ball = (x, y, s, o) => Object.assign({ k: 'ball', x, y, s }, o || {});
  const sfx = (t, x, y, size, rot, c, o) => Object.assign({ t, x, y, size, rot, c }, o || {});
  const timer = (t, x, y, s, c, label) => ({ k: 'timer', t, x, y, s, c, label });
  const eyes = (c, e, o) => Object.assign({ k: 'eyes', c, e, x: 50, y: 55, s: 1 }, o || {});
  const txt = (t, x, y, size, o) => Object.assign({ k: 'text', t, x, y, size }, o || {});

  // Pantalla del mundo mirando en vivo
  const tvScreen = (sub, o) => Object.assign({ k: 'screen', x: 12, y: 8, w: 76, h: 52, live: true, leg: true, sub }, o || {});
  const crowd = (o) => Object.assign({ k: 'mob', n: 10, y: 96, s: 0.55, silhouette: '#04050b', seed: 4 }, o || {});

  const chapters = [];

  // =====================================================================
  // PRÓLOGO
  // =====================================================================
  chapters.push({
    id: 'prologo', n: 'Prólogo', title: 'El Partido de las Estrellas', pov: 'El mundo', color: '#ffb020',
    pages: [
      full({
        st: 'color', bg: 'black',
        el: [txt('“Todo partido es el último', 50, 42, 6.2, { font: 'Georgia, serif', fill: '#f4ecd8', st: 'none', ls: 0 }), txt('para alguien.”', 50, 50, 6.2, { font: 'Georgia, serif', fill: '#f4ecd8', st: 'none', ls: 0 }), txt('— Grafiti en un vestuario de Rosales', 50, 60, 3, { font: 'Georgia, serif', fill: '#9a927e', st: 'none', ls: 0 })]
      }),
      pg(
        R(560, {
          st: 'color', bg: 'stadium', bgo: { hy: 55, seed: 3 },
          el: [fg('mesias', 'walk', 30, 92, 0.3, { back: true }), fg('rolando', 'stand', 55, 90, 0.28), fg('neimar', 'dribble', 72, 93, 0.28), ball(78, 88, 0.035)],
          b: [ca(24, 9, 'Estadio Coloso, Ciudad de México. Minuto 88.', 'n', 40), tv(74, 9, 'EN VIVO · Partido de las Estrellas · 2.300 millones de espectadores', 'n', 44)]
        }),
        R(460,
          { st: 'color', bg: 'stadium', bgo: { hy: 20 }, el: [bu('nico', 50, 58, 0.9, 'shock', 'o', { blush: true }), ball(84, 86, 0.14)], b: [th(26, 16, 'Estoy a tres metros de Leo Mesías…', 'br', 40), ca(76, 92, 'Nico Ferro, 17. Recogepelotas.', 'n', 44)] },
          { st: 'color', bg: 'flat', bgo: { bgc: '#1d2b52' }, el: [bu('rolando', 50, 60, 0.9, 'smirk', 'smirk')], b: [sp(30, 14, '¿Nervioso, chico? Tranquilo. Nadie mira a los recogepelotas.', 'br', 48)] }
        ),
        R(420,
          { st: 'pop', bg: 'flat', bgo: { bgc: '#ffd400' }, fx0: [{ n: 'burst', fr: 0.45 }], el: [fg('dibujo', 'dance', 50, 94, 0.72)], b: [sh(50, 13, '¡Pibe! ¡Pasámela que la quiero bailar!', 'b', 60)], sfx: [sfx('¡CHA-CHÁN!', 80, 60, 10, 12, '#ff2a6a')] },
          { st: 'color', bg: 'pitch', bgo: { hy: 35 }, el: [fg('memo', 'ready', 45, 90, 0.55), fg('nico', 'kick', 78, 94, 0.4)], b: [sp(30, 16, '¡Ándale, Nico! ¡Bien pegadita!', 'b', 44), ca(72, 12, 'Memo Ocho, arquero. Su ídolo.', 'n', 40)] }
        )
      ),
      pg(
        R(480, {
          st: 'color', bg: 'pitch', bgo: { hy: 22 }, fx0: [{ n: 'speed', fa: 0 }],
          el: [fg('nico', 'sprint', 40, 92, 0.6), ball(72, 88, 0.07, { trail: 0 })],
          b: [ca(22, 12, 'Minuto 90. Un balón se escapa hacia el círculo central.', 'n', 40), sh(80, 20, '¡Pibe, no entres a la cancha!', 'bl', 34)]
        }),
        R(520, {
          st: 'neon', bg: 'night', ac: '#ffb020',
          el: [{ k: 'arbitro', x: 50, y: 30, s: 0.55, shut: true }],
          fx: [{ n: 'crack', fx: 50, fy: 18 }],
          sfx: [sfx('KRRRRAK', 50, 76, 17, -4, '#ffb020')],
          b: [ca(20, 90, 'Y el cielo se partió.', 'n', 30)]
        }),
        R(360,
          { st: 'manga', bg: 'white', el: [eyes('mesias', 'shock')] },
          { st: 'manga', bg: 'white', el: [eyes('rolando', 'shock')] },
          { st: 'manga', bg: 'white', el: [eyes('nico', 'shock')] }
        )
      ),
      full({
        st: 'neon', bg: 'stadium', bgo: { hy: 70 }, ac: '#ffb020',
        el: [{ k: 'arbitro', x: 50, y: 24, s: 0.72, wide: true }, { k: 'fx', n: 'beam', fx: 50, fxc: '#ffb020' }, fg('mesias', 'float', 30, 72, 0.12), fg('nico', 'float', 50, 66, 0.12), fg('rolando', 'float', 68, 70, 0.12), fg('dibujo', 'float', 40, 58, 0.1), fg('neimar', 'float', 60, 56, 0.1), fg('memo', 'float', 76, 60, 0.1), fg('extra1', 'float', 22, 60, 0.1), fg('vozinho', 'float', 84, 52, 0.09)],
        fx: [{ n: 'particles', fx: 50, fy: 60, fxc: '#ffd27a' }],
        sfx: [sfx('VOOOOOM', 50, 45, 14, -6, '#ffb020')],
        b: [sy(50, 91, 'AUDITORÍA PLANETARIA INICIADA. SELECCIONANDO: CIEN JUGADORES.', 'n', 70)]
      }),
      full({
        st: 'color', bg: 'tower', bgo: { labels: true, seed: 7 }, ac: '#39f3ff',
        el: [{ k: 'screen', x: 5, y: 76, w: 34, h: 15, live: true, sub: { st: 'neon', bg: 'stack', ac: '#39f3ff', el: [{ k: 'arbitro', x: 50, y: 35, s: 0.6 }] } }],
        b: [
          ca(28, 5, 'Del Estadio Coloso brotó una torre de veinticinco anillos.', 'n', 46),
          ca(76, 38, 'El anillo 1 rozaba las nubes. El 25 flotaba fuera de la atmósfera.', 'n', 40),
          ca(72, 70, 'Todas las pantallas del planeta se encendieron solas. Nadie pudo apagarlas.', 'n', 44),
          tv(50, 96, 'LA TORRE SE VE DESDE TODO EL VALLE DE MÉXICO · 8.000 MILLONES MIRAN EN VIVO', 'n', 88)
        ]
      })
    ]
  });

  // =====================================================================
  // CAPÍTULO 1 — LA CUOTA (POV Nico)
  // =====================================================================
  chapters.push({
    id: 'c1', n: 'Capítulo 1', title: 'La Cuota', pov: 'Nico Ferro', color: '#ff8a1a',
    pages: [
      full({
        st: 'neon', bg: 'stack', bgo: { n: 10, earth: true }, ac: '#39f3ff',
        el: [fg('nico', 'kneel', 50, 86, 0.18)],
        b: [th(50, 70, '¿Dónde… estoy?', 'b', 24)]
      }),
      pg(
        R(460,
          { st: 'color', bg: 'pitch', bgo: { hy: 40 }, el: [bu('nico', 50, 60, 0.9, 'shock', 'open', { sweat: true })], b: [sp(28, 14, 'Me duele todo…', 'br', 30)], w: 1 },
          { st: 'color', bg: 'pitch', bgo: { hy: 45 }, el: [crowd({ silhouette: null, n: 12, y: 88, s: 0.42, seed: 7, e: 'shock' })], b: [ca(50, 12, 'Anillo 13. Cien jugadores. Las estrellas más grandes del mundo. Y yo.', 'n', 70)], w: 1.6 }
        ),
        R(520, {
          st: 'neon', bg: 'space', ac: '#ffb020',
          el: [{ k: 'arbitro', x: 30, y: 50, s: 0.8 }, timer('24:00:00', 74, 50, 0.4, '#ff3344', 'TIEMPO RESTANTE')],
          b: [sy(72, 15, 'BIENVENIDOS AL ESTADIO CERO.', 'n', 44), sy(72, 84, 'LA TIERRA SERÁ AUDITADA. UN PLANETA SE MIDE POR SU FÚTBOL.', 'n', 48)]
        }),
        R(420,
          { st: 'pop', bg: 'flat', bgo: { bgc: '#79d0ff' }, fx0: [{ n: 'burst', fr: 0.5, burstc: '#fff' }], el: [bu('neimar', 50, 62, 0.9, 'shock', 'open')], b: [sp(50, 13, '¿Es un programa de bromas? ¡Meu Deus, dime que es de bromas!', 'b', 70)] },
          { st: 'manga', bg: 'white', el: [bu('rolando', 50, 62, 0.9, 'calm', 'flat')], b: [sp(50, 13, 'No. Mírale el ojo. Esto es real.', 'b', 60)] }
        )
      ),
      pg(
        R(480, {
          st: 'neon', bg: 'space', ac: '#ff3344',
          el: [timer('23:59:31', 50, 52, 0.62, '#ff3344', 'LEY 1 — LA CUOTA')],
          b: [sy(50, 13, 'CADA JUGADOR DE CAMPO DEBE METER UN GOL EN 24 HORAS.', 'n', 76), sy(50, 88, 'QUIEN NO LO HAGA, MUERE.', 'n', 44)]
        }),
        R(480,
          { st: 'neon', bg: 'space', ac: '#5ff3ff', el: [{ k: 'goal', x: 50, y: 90, s: 0.9, glow: '#5ff3ff' }, { k: 'guardian', x: 50, y: 90, s: 0.75 }], b: [ca(50, 10, 'Los arcos los cuidan los Guardianes. Arqueros de luz. Sin rostro.', 'n', 80)] },
          { st: 'color', bg: 'flat', bgo: { bgc: '#2a1f44' }, el: [bu('dibujo', 20, 70, 0.62, 'shock'), bu('memo', 50, 72, 0.62, 'shock'), bu('vozinho', 80, 70, 0.62, 'calm')], b: [sy(50, 15, 'LEY 2 — LOS ARQUEROS NO ANOTAN. POR CADA ATAJADA, REGALAN UNA VIDA A QUIEN ELIJAN.', 'n', 86)] }
        ),
        R(440,
          { st: 'color', bg: 'pitch', bgo: { hy: 30 }, el: [bu('dibujo', 50, 62, 0.9, 'smirk', 'grin')], b: [sp(40, 13, '¿Ah, sí? ¿Y cuál es la trampa, ojito?', 'br', 52)] },
          { st: 'manga', bg: 'white', ac: '#ff3344', fx0: ['focus'], el: [bu('memo', 50, 64, 0.9, 'shock', 'o', { sweat: true })], b: [sy(50, 13, 'LEY 3 — UN ARQUERO AGUANTA DOS GOLES. AL TERCERO, MUERE.', 'n', 84)] }
        )
      ),
      pg(
        R(400,
          { st: 'color', bg: 'pitch', bgo: { hy: 40 }, el: [fg('extra3', 'sprint', 60, 92, 0.6)], b: [sh(30, 18, '¡Yo me largo de este circo!', 'br', 44)], fx0: [{ n: 'speed', fa: 0 }] },
          { st: 'neon', bg: 'space', ac: '#39f3ff', el: [fg('extra3', 'float', 45, 62, 0.4, { rot: 25 })], b: [ca(50, 90, 'Saltó del anillo.', 'n', 40)] }
        ),
        R(600, {
          st: 'carbon', bg: 'space',
          el: [fg('extra3', 'float', 50, 72, 0.55, { stone: true, rot: 60, seed: 9 })],
          fx: [{ n: 'dust', fx: 60, fy: 55 }],
          b: [ca(22, 12, 'En el vacío no se cae. Se congela.', 'n', 36), ca(76, 90, 'Nadie más volvió a intentarlo.', 'n', 38)]
        }),
        R(380, {
          st: 'manga', bg: 'white', fx0: [{ n: 'speed', fa: 90 }],
          el: [bu('nico', 50, 62, 0.95, 'shock', 'o', { sweat: true })],
          b: [th(80, 26, 'Esto es real. Es real. Es real.', 'l', 30)]
        })
      ),
      pg(
        R(480, {
          st: 'pop', bg: 'pecera',
          el: [fg('guardiolo', 'hands', 12, 92, 0.42), fg('mourino', 'point', 30, 92, 0.42), fg('simeon', 'stand', 46, 92, 0.42), fg('klopf', 'arms', 62, 92, 0.44), { k: 'cooler', x: 80, y: 90, s: 0.08 }, fg('biela', 'kneel', 80, 83, 0.3), { k: 'mic', x: 92, y: 88, s: 0.3 }],
          b: [ca(24, 10, 'Entre los anillos 12 y 13 flotaba La Pecera. Adentro: los técnicos.', 'n', 38), sy(76, 12, 'LOS TÉCNICOS NO JUEGAN. MIRAN. HAY UN SOLO MICRÓFONO.', 'n', 38)]
        }),
        R(400,
          { st: 'pop', bg: 'flat', bgo: { bgc: '#ffd400' }, el: [bu('mourino', 50, 62, 0.9, 'smirk', 'smirk')], b: [sp(50, 13, 'Obviamente, el micrófono es mío. Soy especial.', 'b', 62)] },
          { st: 'pop', bg: 'flat', bgo: { bgc: '#ff5a5a' }, el: [bu('simeon', 50, 62, 0.9, 'ang', 'shout', { vein: true })], b: [sh(50, 13, '¡Tocalo y te arranco la mano, José!', 'b', 62)] }
        ),
        R(460, {
          st: 'pop', bg: 'pecera', fx0: [{ n: 'burst', fx: 40, fy: 55, fr: 0.35 }],
          el: [fg('simeon', 'kick', 30, 92, 0.5), fg('mourino', 'fall', 52, 90, 0.44, { flip: true }), fg('klopf', 'arms', 70, 92, 0.46), fg('guardiolo', 'reach', 84, 92, 0.42), { k: 'cooler', x: 10, y: 92, s: 0.08 }, fg('biela', 'kneel', 10, 85, 0.3)],
          sfx: [sfx('¡PAF!', 42, 38, 14, -10, '#ffffff'), sfx('¡CRAC!', 76, 30, 10, 12, '#ffd400')],
          b: [sp(16, 16, 'Entre nosotros solo se puede discutir estrategia.', 'b', 26), sh(84, 14, '¡Esto ES estrategia!', 'b', 26)]
        })
      ),
      pg(
        R(460, {
          st: 'manga', bg: 'white', ac: '#ff2d4d', fx0: [{ n: 'speed', fa: 0 }],
          el: [fg('rolando', 'kick', 35, 94, 0.62), ball(78, 58, 0.08, { trail: 190, fire: true, c: '#ff2d4d' }), timer('23:59:49', 84, 14, 0.28, '#ff2d4d')],
          sfx: [sfx('¡SÍÍÍÍU!', 46, 34, 13, -10, '#ff2d4d')],
          b: [ca(18, 10, 'Once segundos. Primer gol del torneo.', 'n', 30)]
        }),
        R(460,
          { st: 'color', bg: 'pitch', bgo: { hy: 30 }, el: [{ k: 'goal', x: 50, y: 88, s: 0.95 }, fg('memo', 'reach', 30, 88, 0.55, { rot: 70 }), ball(72, 64, 0.07)], b: [ca(50, 10, 'Pero no le había pateado a un Guardián.', 'n', 70)] },
          { st: 'color', bg: 'flat', bgo: { bgc: '#264a3a' }, el: [bu('memo', 50, 62, 0.9, 'sad', 'flat', { sweat: true })], b: [sp(50, 13, 'Uno.', 'b', 20), ca(50, 90, 'Memo Ocho: 1/3', 'n', 40)] }
        ),
        R(440,
          { st: 'color', bg: 'pitch', bgo: { hy: 30 }, el: [bu('nico', 50, 62, 0.9, 'ang', 'shout', { vein: true })], b: [sh(50, 13, '¡Le pateó al arquero humano!', 'b', 60)] },
          { st: 'manga', bg: 'white', el: [bu('rolando', 50, 62, 0.9, 'calm', 'smirk')], b: [sp(50, 13, 'Las reglas no dicen a quién patear, chico. Dicen que patees.', 'b', 70)] }
        )
      ),
      pg(
        R(460, {
          st: 'manga', bg: 'pitch', bgo: { hy: 28 }, ac: '#ff2d4d',
          el: [{ k: 'goal', x: 50, y: 50, s: 0.46 }, fg('memo', 'ready', 50, 50, 0.3), crowd({ silhouette: null, n: 14, y: 90, s: 0.36, seed: 12, e: 'calm' })],
          b: [ca(24, 10, 'Hora 1. Ya había una fila.', 'n', 36), ca(76, 10, 'Frente a los arcos humanos. Siempre es más fácil patearle a alguien que sangra.', 'n', 40)]
        }),
        R(460,
          { st: 'color', bg: 'pitch', bgo: { hy: 30 }, el: [fg('mesias', 'walk', 60, 92, 0.6, { back: true }), fg('jaime', 'point', 20, 92, 0.5)], b: [sp(22, 12, '¿Leo? ¡La fila es acá!', 'b', 32), sp(70, 14, 'Yo no le pateo a un hombre.', 'b', 36)] },
          { st: 'neon', bg: 'space', ac: '#7fd3ff', el: [{ k: 'goal', x: 50, y: 92, s: 0.8, glow: '#5ff3ff' }, { k: 'guardian', x: 58, y: 92, s: 0.7 }, fg('mesias', 'kick', 22, 96, 0.44), ball(46, 62, 0.06, { trail: 200, fire: true, c: '#7fd3ff' })], b: [ca(50, 10, 'Leo Mesías solo le pateó a Guardianes.', 'n', 70)] }
        ),
        R(460,
          { st: 'neon', bg: 'space', ac: '#ff8a1a', el: [{ k: 'guardian', x: 60, y: 92, s: 0.8 }, fg('nico', 'fall', 30, 94, 0.45)], sfx: [sfx('¡PUM!', 48, 34, 12, -8, '#ff8a1a')], w: 1 },
          { st: 'manga', bg: 'white', el: [fg('nico', 'kneel', 50, 90, 0.7)], b: [th(50, 16, 'No puedo ni tocarla.', 'b', 50), ca(50, 94, 'Hora 6. Nico Ferro: 0 goles.', 'n', 60)], w: 1 }
        )
      )
    ]
  });

  // =====================================================================
  // CAPÍTULO 2 — AL TERCERO (POV Dibujo)
  // =====================================================================
  chapters.push({
    id: 'c2', n: 'Capítulo 2', title: 'Al tercero', pov: 'Dibujo Martell', color: '#b36bff',
    pages: [
      full({
        st: 'manga', bg: 'white', ac: '#b36bff', fx0: ['focus'],
        el: [{ k: 'ghost', x: 50, y: 70, s: 0.9, op: 0.25, c: '#b36bff' }, { k: 'goal', x: 50, y: 88, s: 1.05 }, fg('dibujo', 'ready', 50, 90, 0.5)],
        b: [th(50, 10, 'Dos goles encima. Uno más y me voy.', 'n', 60)]
      }),
      pg(
        R(500, {
          st: 'manga', bg: 'white', ac: '#b36bff', fx0: [{ n: 'speed', fa: -20 }],
          el: [fg('dibujo', 'reach', 55, 62, 0.62, { rot: -65, hip: true }), ball(84, 26, 0.08, { trail: 200 })],
          sfx: [sfx('¡PAF!', 30, 28, 16, -12, '#b36bff')],
          b: [sy(70, 90, 'ATAJADA. ELIGE UNA VIDA.', 'n', 44)]
        }),
        R(440,
          { st: 'color', bg: 'pitch', bgo: { hy: 30 }, el: [bu('dibujo', 50, 62, 0.9, 'smirk', 'grin')], b: [sp(44, 13, 'Esa va para el flaquito que llora allá atrás.', 'br', 60)] },
          { st: 'acuarela', bg: 'sunset', el: [bu('extra2', 50, 62, 0.9, 'cry', 'open')], b: [sp(50, 13, '¿P-para mí? Ni me conoce…', 'b', 60)] }
        ),
        R(420, {
          st: 'color', bg: 'flat', bgo: { bgc: '#231a36' },
          el: [bu('dibujo', 26, 64, 0.95, 'det', 'grit', { sweat: true }), timer('2/3', 74, 48, 0.42, '#b36bff', 'GOLES EN CONTRA')],
          b: [ca(74, 88, 'Hora 9. Dibujo Martell: 14 atajadas. 14 vidas regaladas.', 'n', 44)]
        })
      ),
      pg(
        R(480, {
          st: 'color', bg: 'pitch', bgo: { hy: 35 },
          el: [{ k: 'goal', x: 70, y: 80, s: 0.5 }, fg('vozinho', 'ready', 70, 82, 0.4), fg('dibujo', 'stand', 20, 92, 0.5)],
          b: [ca(50, 10, 'El arco de al lado. Josimar "Vozinho" Días. Cabo Verde. Cuarenta años.', 'n', 80)]
        }),
        R(440,
          { st: 'color', bg: 'flat', bgo: { bgc: '#ffcf8a' }, el: [bu('vozinho', 50, 62, 0.9, 'calm', 'smile')], b: [sp(50, 13, 'Descansa, hermano. Yo cubro tu arco una hora.', 'b', 64)] },
          { st: 'color', bg: 'flat', bgo: { bgc: '#c9b3ff' }, el: [bu('dibujo', 50, 62, 0.9, 'shock', 'o')], b: [sp(50, 13, '¿Y vos quién sos?', 'b', 48)] }
        ),
        R(440,
          { st: 'color', bg: 'flat', bgo: { bgc: '#ffcf8a' }, el: [bu('vozinho', 50, 62, 0.9, 'happy', 'grin')], b: [sp(50, 13, 'Uno que también lleva dos goles encima.', 'b', 64)] },
          { st: 'pop', bg: 'flat', bgo: { bgc: '#ffd400' }, fx0: [{ n: 'burst', fr: 0.4 }], el: [fg('dibujo', 'fist', 34, 92, 0.6), fg('vozinho', 'fist', 66, 92, 0.6, { flip: true })], b: [ca(50, 10, 'Así empezaron a turnarse.', 'n', 60)] }
        )
      ),
      pg(
        R(440, {
          st: 'acuarela', bg: 'night', bgo: { seed: 9 },
          el: [{ k: 'goal', x: 50, y: 78, s: 0.5 }, fg('memo', 'ready', 50, 80, 0.36), fg('nico', 'windup', 26, 94, 0.36)],
          b: [ca(22, 10, 'Hora 20. Noche artificial.', 'n', 34)]
        }),
        R(420,
          { st: 'acuarela', bg: 'night', el: [bu('memo', 50, 62, 0.9, 'calm', 'smile')], b: [sp(50, 13, 'Pateas con miedo, mijo. Se te nota en el tobillo.', 'b', 66)] },
          { st: 'acuarela', bg: 'night', el: [bu('nico', 50, 62, 0.9, 'sad', 'frown')], b: [sp(50, 13, 'Nunca he jugado en serio, Memo. Soy recogepelotas.', 'b', 66)] }
        ),
        R(420, {
          st: 'retro', bg: 'barrio', bgo: { seed: 5 },
          el: [fg('nico', 'kick', 40, 90, 0.34, { kit: 'casual', num: '' }), ball(70, 70, 0.05, { trail: 180 })],
          b: [ca(24, 12, 'Iztapalapa. Una pared. Diez mil tiros.', 'n', 38)]
        }),
        R(420,
          { st: 'acuarela', bg: 'night', el: [bu('memo', 50, 62, 0.9, 'happy', 'smile')], b: [sp(50, 13, 'Entonces ya jugaste más que muchos de estos.', 'b', 64)] },
          { st: 'acuarela', bg: 'night', el: [bu('nico', 35, 64, 0.8, 'sad'), bu('memo', 76, 66, 0.8, 'calm', 'smile')], b: [sp(30, 12, '¿Y tú? Ya llevas dos…', 'b', 40), sp(74, 14, 'Tranquilo. Yo ya viví.', 'b', 40)] }
        )
      ),
      pg(
        R(420, {
          st: 'manga', bg: 'black', ac: '#ff2233',
          el: [timer('00:00:59', 50, 50, 0.7, '#ff2233', 'LA CUOTA')],
          b: [ca(50, 90, 'Quedan 59 segundos. 41 jugadores sin gol. Uno de ellos, Nico.', 'n', 80)]
        }),
        R(460, {
          st: 'manga', bg: 'pitch', bgo: { hy: 25 }, ac: '#ff2233',
          el: [{ k: 'goal', x: 70, y: 82, s: 0.52 }, fg('memo', 'ready', 70, 84, 0.4), fg('nico', 'windup', 22, 96, 0.5), ball(36, 92, 0.05)],
          b: [sp(22, 14, 'No… a ti no.', 'b', 30)]
        }),
        R(440,
          { st: 'acuarela', bg: 'sunset', el: [bu('memo', 50, 62, 0.9, 'calm', 'smile')], b: [sp(50, 13, 'Tírame, mijo. Es tu vida.', 'b', 56)] },
          { st: 'manga', bg: 'white', fx0: [{ n: 'speed', fa: 90 }], el: [bu('nico', 50, 62, 0.9, 'cry', 'open')], b: [sp(50, 13, '¡No quiero que te—!', 'b', 50)] }
        ),
        R(340, {
          st: 'manga', bg: 'white', ac: '#ff2233', fx0: ['focus'],
          el: [eyes('memo', 'det')],
          b: [sh(50, 86, '¡¡TÍRAME, NICOLÁS!!', 'n', 60)]
        })
      ),
      full({
        st: 'acuarela', bg: 'sunset',
        el: [{ k: 'goal', x: 50, y: 70, s: 1.0 }, fg('memo', 'siuu', 50, 72, 0.4, { e: 'happy', m: 'smile' }), ball(64, 42, 0.07, { trail: 150 }), fg('nico', 'kick', 22, 98, 0.34)],
        fx: [{ n: 'sparkle', seed: 3 }],
        sfx: [sfx('gol', 80, 50, 12, 8, '#ffffff')],
        b: [ca(26, 8, 'Memo Ocho no se tiró.', 'n', 40), ca(76, 16, 'Abrió los brazos como quien recibe a un hijo.', 'n', 40), sy(50, 92, 'TERCER GOL. ARQUERO ELIMINADO.', 'n', 60)]
      }),
      full({
        st: 'color', bg: 'plaza', bgo: { seed: 3 },
        el: [tvScreen({ st: 'carbon', bg: 'white', el: [bu('memo', 50, 62, 0.95, 'happy', 'smile', { stone: true, seed: 4 })], fx: [{ n: 'dust', fx: 60, fy: 50 }] }), crowd({ n: 14, y: 100, s: 0.2 })],
        b: [ca(28, 66, 'Zócalo, Ciudad de México. Trescientas mil personas.', 'n', 46), ca(72, 72, 'Vieron morir a su arquero en vivo. Con la torre de anillos brillando sobre sus cabezas.', 'n', 46), tv(50, 5, 'ÚLTIMA HORA · MEMO OCHO (1985–2026)', 'n', 60)]
      }),
      pg(
        R(360, {
          st: 'neon', bg: 'space', ac: '#ff2233',
          el: [timer('00:00:00', 50, 52, 0.6, '#ff2233')],
          b: [sy(50, 12, 'FIN DE LA CUOTA.', 'n', 40)]
        }),
        R(560, {
          st: 'carbon', bg: 'pitch', bgo: { hy: 30 },
          el: [crowd({ silhouette: null, n: 12, y: 86, s: 0.5, seed: 21, stone: true, e: 'closed' })],
          fx: [{ n: 'dust', fx: 50, fy: 70 }, { n: 'dust', fx: 20, fy: 60, seed: 3 }],
          b: [ca(50, 10, 'Cuarenta jugadores se volvieron piedra al mismo tiempo. Y se deshicieron como arena.', 'n', 80)]
        }),
        R(420,
          { st: 'acuarela', bg: 'night', el: [bu('nico', 50, 62, 0.9, 'cry', 'open')] },
          { st: 'acuarela', bg: 'night', el: [bu('dibujo', 50, 62, 0.9, 'sad', 'frown')], b: [sp(50, 13, '…', 'b', 20)] }
        )
      )
    ]
  });

  // =====================================================================
  // INTERLUDIO I — LO QUE QUEDA
  // =====================================================================
  chapters.push({
    id: 'i1', n: 'Interludio I', title: 'Lo que queda', pov: 'Todos', color: '#9aa6b8',
    pages: [
      pg(
        R(460, {
          st: 'pop', bg: 'flat', bgo: { bgc: '#ff5a5a' }, fx0: [{ n: 'burst', fr: 0.4 }],
          el: [fg('dibujo', 'point', 30, 94, 0.62), fg('rolando', 'stand', 70, 94, 0.62, { flip: true })],
          b: [sh(28, 14, '¡Fuiste el primero de la fila, hijo de—!', 'b', 44), sh(74, 14, '¡Yo no inventé las reglas!', 'b', 40)]
        }),
        R(420, {
          st: 'manga', bg: 'white', fx0: ['focus'],
          el: [fg('dibujo', 'kick', 36, 94, 0.62), fg('rolando', 'fall', 70, 92, 0.52, { flip: true })],
          sfx: [sfx('¡PUM!', 56, 36, 18, -10, '#ffffff')]
        }),
        R(440,
          { st: 'color', bg: 'pitch', bgo: { hy: 30 }, el: [fg('dibujo', 'stand', 22, 94, 0.5), fg('mesias', 'hands', 50, 94, 0.52), fg('rolando', 'kneel', 80, 92, 0.42, { flip: true })], w: 1.2 },
          { st: 'color', bg: 'flat', bgo: { bgc: '#1d2b52' }, el: [bu('mesias', 50, 62, 0.9, 'det', 'flat')], b: [sp(50, 13, 'Basta. Memo ya no está. Pelearnos no lo trae.', 'b', 66)] }
        )
      ),
      pg(
        R(460, {
          st: 'acuarela', bg: 'pecera',
          el: [bu('aguirra', 36, 64, 0.8, 'cry', 'open'), bu('klopf', 72, 66, 0.8, 'sad', 'frown')],
          b: [ca(50, 10, 'En La Pecera, esa noche, nadie se peleó por el micrófono.', 'n', 70)]
        }),
        R(460,
          { st: 'acuarela', bg: 'night', el: [fg('vozinho', 'kneel', 50, 90, 0.6)], b: [ca(50, 12, 'Vozinho rezó por los cuarenta. Uno por uno. Se sabía todos los nombres.', 'n', 80)] },
          { st: 'acuarela', bg: 'night', el: [bu('extra1', 30, 66, 0.7, 'cry'), bu('extra3', 72, 66, 0.7, 'sad')], b: [ca(50, 12, 'Hubo abrazos entre hombres que ayer no se hablaban.', 'n', 80)] }
        ),
        R(440,
          { st: 'color', bg: 'night', el: [bu('rolando', 50, 62, 0.9, 'sad', 'flat')], b: [sp(50, 13, 'Chico… lo de Memo…', 'b', 50)] },
          { st: 'color', bg: 'night', el: [bu('nico', 50, 62, 0.9, 'ang', 'frown', { lx: -6 })], b: [sp(50, 13, 'No me hable.', 'b', 40)] }
        )
      ),
      pg(
        R(460, {
          st: 'neon', bg: 'stack', bgo: { n: 8 }, ac: '#ffb020',
          el: [{ k: 'arbitro', x: 50, y: 30, s: 0.5 }],
          b: [sy(50, 80, 'LEY 4 — BATALLA CAMPAL. 60 JUGADORES. 4 EQUIPOS AL AZAR. 25 ANILLOS. 4 ARCOS.', 'n', 84)]
        }),
        R(460,
          { st: 'manga', bg: 'black', ac: '#ff2d4d', el: [{ k: 'card', x: 50, y: 52, s: 0.7 }], b: [sy(50, 90, 'CADA GOL RECIBIDO: EL EQUIPO VOTA. EL ELEGIDO RECIBE LA TARJETA NEGRA.', 'n', 90)] },
          { st: 'manga', bg: 'white', el: [bu('nico', 50, 62, 0.9, 'shock', 'o', { sweat: true })], b: [sy(50, 13, 'LA BATALLA TERMINA CUANDO QUEDEN 26.', 'n', 84)] }
        ),
        R(420, {
          st: 'color', bg: 'pecera',
          el: [bu('guardiolo', 50, 64, 0.85, 'shock', 'open', { sweat: true })],
          b: [sp(50, 13, '¿Votar? ¿Los hacen votar a quién muere? Eso no es fútbol. Eso es…', 'b', 60), ca(50, 92, '…la humanidad, Pep.', 'n', 40)]
        })
      )
    ]
  });

  // =====================================================================
  // CAPÍTULO 3 — TARJETA NEGRA (POV Modrović)
  // =====================================================================
  chapters.push({
    id: 'c3', n: 'Capítulo 3', title: 'Tarjeta Negra', pov: 'Luka Modrović', color: '#ff2d4d',
    pages: [
      full({
        st: 'manga', bg: 'black', ac: '#ff2d4d',
        el: [bu('modrovic', 50, 40, 0.5, 'calm', 'flat', { kit: 'oro', dark: true }), { k: 'card', x: 50, y: 72, s: 0.45, rot: 6 }],
        fx: [{ n: 'vignette' }]
      }),
      pg(
        R(360,
          { st: 'color', bg: 'flat', bgo: { bgc: '#e3262e' }, el: [bu('rolando', 50, 64, 0.9, 'calm', 'n', { kit: 'rojo' })], b: [ca(50, 90, 'ROJO', 'n', 40)] },
          { st: 'color', bg: 'flat', bgo: { bgc: '#1f6fe0' }, el: [bu('haalund', 50, 64, 0.9, 'det', 'n', { kit: 'azul' })], b: [ca(50, 90, 'AZUL', 'n', 40)] },
          { st: 'color', bg: 'flat', bgo: { bgc: '#1faa59' }, el: [bu('mbapo', 50, 64, 0.9, 'n', 'n', { kit: 'verde' })], b: [ca(50, 90, 'VERDE', 'n', 40)] },
          { st: 'color', bg: 'flat', bgo: { bgc: '#f2b705' }, el: [bu('mesias', 50, 64, 0.9, 'det', 'n', { kit: 'oro' })], b: [ca(50, 90, 'ORO', 'n', 40)] }
        ),
        R(500, {
          st: 'color', bg: 'stack', bgo: { n: 7 },
          el: [bu('dibujo', 12, 76, 0.44, 'smirk', 'n', { kit: 'oro' }), bu('vozinho', 28, 78, 0.44, 'calm', 'n', { kit: 'oro' }), bu('nico', 44, 78, 0.42, 'shock', 'n', { kit: 'oro' }), bu('yamar', 60, 78, 0.44, 'n', 'n', { kit: 'oro' }), bu('mesias', 76, 77, 0.44, 'det', 'n', { kit: 'oro' }), bu('modrovic', 91, 77, 0.44, 'calm', 'n', { kit: 'oro' })],
          b: [ca(50, 11, 'Me tocó con un argentino, un recogepelotas, dos arqueros y nueve desconocidos. Nunca había jugado con desconocidos. Aunque, bien visto, todos lo somos.', 'n', 90)]
        }),
        R(440,
          { st: 'color', bg: 'pitch', bgo: { hy: 30 }, el: [bu('dibujo', 50, 62, 0.9, 'smirk', 'grin', { kit: 'oro' })], b: [sp(50, 13, 'Yo el primer rato, vos el segundo.', 'b', 56)] },
          { st: 'color', bg: 'pitch', bgo: { hy: 30 }, el: [bu('vozinho', 50, 62, 0.9, 'calm', 'smile', { kit: 'oro' })], b: [sp(50, 13, 'Y ninguno de los dos llega al tercero.', 'b', 60)] }
        )
      ),
      pg(
        R(420,
          { st: 'color', bg: 'pitch', bgo: { hy: 30 }, el: [bu('mesias', 50, 62, 0.9, 'det', 'n', { kit: 'oro' })], b: [sp(50, 13, 'Si nadie hace goles, nadie muere.', 'b', 56)] },
          { st: 'color', bg: 'stack', bgo: { n: 9 }, el: [], b: [ca(50, 88, 'Minutos 1 a 10: nadie atacó. En ninguno de los 25 anillos.', 'n', 80)], w: 1.4 }
        ),
        R(440, {
          st: 'neon', bg: 'space', ac: '#ff2d4d',
          el: [{ k: 'arbitro', x: 26, y: 50, s: 0.8, c: '#ff2d4d' }, { k: 'card', x: 76, y: 52, s: 0.7, rot: 10 }],
          b: [sy(50, 10, 'PASIVIDAD DETECTADA.', 'n', 40), sy(50, 90, 'DIEZ MINUTOS SIN GOL: TARJETA NEGRA PARA TODA LA CANCHA MÁS PASIVA.', 'n', 86)]
        }),
        R(500, {
          st: 'carbon', bg: 'pitch', bgo: { hy: 25 },
          el: [crowd({ silhouette: null, n: 6, y: 86, s: 0.62, seed: 31, stone: true, e: 'closed', kits: ['verde', 'azul'] })],
          fx: [{ n: 'dust', fx: 50, fy: 60 }],
          b: [ca(50, 10, 'Anillo 4. Seis jugadores. Ninguno había tocado la pelota.', 'n', 70)]
        })
      ),
      pg(
        R(440, {
          st: 'manga', bg: 'white', ac: '#a8f0ff', fx0: [{ n: 'speed', fa: 0 }],
          el: [fg('haalund', 'kick', 30, 94, 0.62, { kit: 'azul' }), ball(76, 50, 0.1, { trail: 190, fire: true, c: '#a8f0ff' })],
          sfx: [sfx('¡¡BOOM!!', 72, 24, 16, -10, '#a8f0ff')],
          b: [ca(18, 10, 'Azul: Erlend Haalund. Once goles en veinte minutos.', 'n', 34)]
        }),
        R(480,
          { st: 'pop', bg: 'pecera', el: [fg('mourino', 'point', 40, 92, 0.6), { k: 'mic', x: 70, y: 90, s: 0.45 }], b: [sh(40, 14, '¡Rojo! ¡Rompan a Mesías! ¡A los tobillos!', 'b', 56)] },
          { st: 'pop', bg: 'pecera', fx0: [{ n: 'burst', fr: 0.4 }], el: [fg('simeon', 'kick', 30, 92, 0.56), fg('mourino', 'fall', 70, 90, 0.5, { flip: true })], sfx: [sfx('¡CRAC!', 50, 36, 16, -10, '#fff')], b: [sh(50, 12, '¡La violencia se juega, no se ordena!', 'b', 64)] }
        ),
        R(460,
          { st: 'manga', bg: 'white', fx: [{ n: 'hands' }], el: [crowd({ silhouette: null, n: 8, y: 80, s: 0.42, seed: 5, kits: ['azul'], e: 'calm' })], b: [ca(50, 10, 'Azul recibe un gol. Votación: 9 a 5.', 'n', 70), wh(50, 40, 'Si él sigue metiendo goles, todos vienen por nosotros.', 'n', 70)] },
          { st: 'carbon', bg: 'white', el: [bu('haalund', 50, 62, 0.9, 'shock', 'o', { kit: 'azul', stone: true, seed: 3 })], fx: [{ n: 'dust', fx: 70, fy: 50 }], b: [sp(50, 12, '¿…Yo?', 'b', 20), ca(50, 92, 'Lo votaron por miedo a lo que atraía.', 'n', 70)] }
        )
      ),
      pg(
        R(400, {
          st: 'color', bg: 'pitch', bgo: { hy: 25 },
          el: [{ k: 'goal', x: 50, y: 82, s: 0.7 }, fg('vozinho', 'reach', 30, 82, 0.4, { rot: 70, kit: 'cpvk' }), ball(66, 62, 0.06)],
          sfx: [sfx('GOL', 80, 30, 12, 8, '#f2b705')],
          b: [sy(24, 12, 'ORO RECIBE. VOZINHO: 1/3. ORO: VOTEN.', 'n', 40)]
        }),
        R(460, {
          st: 'manga', bg: 'black', ac: '#ff2d4d',
          el: [bu('extra1', 24, 66, 0.72, 'ang', 'smirk', { kit: 'oro', dark: true }), bu('extra2', 52, 68, 0.72, 'calm', 'flat', { kit: 'oro', dark: true }), bu('extra3', 80, 66, 0.72, 'smirk', 'smirk', { kit: 'oro', dark: true })],
          b: [wh(22, 14, 'El recogepelotas. No es jugador de verdad.', 'b', 36), wh(52, 26, 'Nadie lo va a extrañar.', 'b', 30), wh(80, 14, 'Cinco votos y listo.', 'b', 30)]
        }),
        R(440,
          { st: 'manga', bg: 'white', el: [bu('modrovic', 50, 62, 0.9, 'det', 'flat', { kit: 'oro', dark: true })], b: [ca(50, 90, 'Lo planearon en once segundos. Como quien decide un cambio.', 'n', 80)] },
          { st: 'manga', bg: 'white', ac: '#ff2d4d', fx: [{ n: 'hands' }], el: [bu('nico', 50, 54, 0.8, 'shock', 'o', { kit: 'oro', sweat: true })], b: [sy(50, 12, 'ELEGIDO: JUGADOR 100.', 'n', 60)] }
        )
      ),
      full({
        st: 'color', bg: 'stack', bgo: { n: 6 }, ac: '#ff2d4d', fx0: [{ n: 'focus', fx: 50, fy: 45, fr: 0.35, fxc: '#1a0508' }],
        el: [fg('nico', 'stand', 76, 88, 0.26, { kit: 'oro', e: 'cry' }), fg('modrovic', 'walk', 44, 94, 0.44, { kit: 'oro', e: 'calm' }), { k: 'card', x: 50, y: 30, s: 0.26, rot: -4 }],
        b: [sp(22, 52, 'Elijan a otro.', 'br', 22), sp(20, 66, 'A mí.', 'br', 14), sy(50, 92, '…SUSTITUCIÓN ACEPTADA.', 'n', 50)]
      }),
      pg(
        R(460,
          { st: 'acuarela', bg: 'sunset', el: [bu('modrovic', 50, 62, 0.9, 'happy', 'smile', { kit: 'oro' })], b: [sp(50, 13, 'Yamar. Toma el brazalete. Ahora corres tú por los dos.', 'b', 66)] },
          { st: 'acuarela', bg: 'sunset', el: [bu('yamar', 50, 62, 0.9, 'cry', 'open', { kit: 'oro', arm: true })], b: [sp(50, 13, 'Luka…', 'b', 30)] }
        ),
        R(440,
          { st: 'acuarela', bg: 'sunset', el: [bu('nico', 50, 62, 0.9, 'cry', 'open', { kit: 'oro' })], b: [sp(50, 13, '¿Por qué? ¡Si ni me conoce!', 'b', 56)] },
          { st: 'acuarela', bg: 'sunset', el: [bu('modrovic', 50, 62, 0.9, 'closed', 'smile', { kit: 'oro' })], b: [sp(50, 13, 'Por eso, chico. Alguien tiene que empezar.', 'b', 60)] }
        ),
        R(520, {
          st: 'carbon', bg: 'white',
          el: [bu('modrovic', 40, 58, 0.9, 'closed', 'smile', { kit: 'oro', stone: true, seed: 12 })],
          fx: [{ n: 'dust', fx: 70, fy: 40 }, { n: 'dust', fx: 80, fy: 60, seed: 4 }]
        })
      ),
      pg(
        R(460, {
          st: 'manga', bg: 'white', ac: '#7fd3ff', fx0: ['focus'],
          el: [bu('mesias', 50, 62, 0.95, 'ego', 'grit', { kit: 'oro' })],
          b: [ca(50, 92, 'Mesías no dijo una palabra el resto del partido. Metió cuatro goles.', 'n', 80)]
        }),
        R(480, {
          st: 'color', bg: 'plaza', bgo: { seed: 8, low: '#10131f' },
          el: [tvScreen({ st: 'acuarela', bg: 'sunset', el: [bu('modrovic', 50, 62, 0.9, 'happy', 'smile', { kit: 'oro' })] }, { x: 20, y: 8, w: 60, h: 62 }), crowd({ n: 12, y: 98, s: 0.5 })],
          b: [ca(50, 90, 'Zagreb apagó todas sus luces durante un minuto. Solo quedó encendida la pantalla.', 'n', 84)]
        }),
        R(420, {
          st: 'color', bg: 'pitch', bgo: { hy: 35 },
          el: [crowd({ silhouette: null, n: 13, y: 90, s: 0.42, seed: 44, e: 'sad', kits: ['oro', 'rojo', 'verde', 'azul'] })],
          b: [sy(50, 12, 'QUEDAN 26. FIN DE LA BATALLA CAMPAL.', 'n', 60)]
        })
      )
    ]
  });

  // =====================================================================
  // CAPÍTULO 4 — LOS 26 (POV Yamar)
  // =====================================================================
  chapters.push({
    id: 'c4', n: 'Capítulo 4', title: 'Los 26', pov: 'Lamín Yamar', color: '#ffd23a',
    pages: [
      full({
        st: 'color', bg: 'earthview', bgo: { ex: 50, ey: 118, es: 0.9 },
        el: [crowd({ silhouette: null, n: 11, y: 74, s: 0.34, seed: 50, e: 'det', kits: ['tierra'] }), bu('yamar', 50, 42, 0.3, 'det', 'flat', { kit: 'tierra', arm: true })]
      }),
      pg(
        R(440, {
          st: 'neon', bg: 'mirror', ac: '#ffb020',
          el: [{ k: 'arbitro', x: 50, y: 42, s: 0.6 }],
          b: [sy(50, 88, 'LEY 5 — GRAN FINAL. SELECCIÓN TIERRA CONTRA LOS REFLEJOS. SI PIERDEN, EL PLANETA SE BORRA.', 'n', 90)]
        }),
        R(440,
          { st: 'color', bg: 'flat', bgo: { bgc: '#243a6a' }, el: [bu('yamar', 50, 62, 0.9, 'sad', 'flat', { kit: 'tierra', arm: true })], b: [th(50, 13, 'Diecinueve años. Y un brazalete que pesa como un planeta.', 'b', 70)] },
          { st: 'pop', bg: 'flat', bgo: { bgc: '#ffd400' }, fx0: [{ n: 'burst', fr: 0.45, burstc: '#fff' }], el: [bu('neimar', 50, 62, 0.9, 'cry', 'open', { kit: 'tierra' })], b: [sh(50, 13, '¿Uniforme BLANCO? ¡Se me va a ensuciar todo!', 'b', 66)] }
        ),
        R(460,
          { st: 'acuarela', bg: 'night', el: [bu('rolando', 50, 62, 0.9, 'sad', 'flat', { kit: 'tierra' })], b: [sp(50, 13, 'Fui el primero de la fila, Nico. No hay minuto en que no lo piense. Perdóname.', 'b', 76)] },
          { st: 'acuarela', bg: 'night', el: [bu('nico', 50, 62, 0.9, 'sad', 'frown', { kit: 'tierra' })], b: [sp(50, 13, 'Memo te habría perdonado. Yo todavía no.', 'b', 64)] }
        )
      ),
      pg(
        R(440, {
          st: 'pop', bg: 'flat', bgo: { bgc: '#ff9a5a' },
          el: [bu('mbapo', 26, 66, 0.72, 'ang', 'shout', { kit: 'tierra' }), bu('jaime', 74, 66, 0.72, 'ang', 'grit', { kit: 'tierra' })],
          b: [sh(24, 14, '¡Hay que presionar arriba!', 'b', 36), sh(76, 14, '¡Con presión arriba nos matan!', 'b', 36)]
        }),
        R(420, {
          st: 'pop', bg: 'flat', bgo: { bgc: '#c9b3ff' },
          el: [fg('dibujo', 'dance', 50, 94, 0.7, { kit: 'tierrak' })],
          b: [sh(50, 13, '¡Muchachos! ¡Si nos vamos a morir, que sea bailando!', 'b', 70)],
          sfx: [sfx('jajaja', 18, 60, 8, -12, '#ff2a6a'), sfx('jaja', 84, 70, 7, 10, '#ff2a6a')]
        }),
        R(460,
          { st: 'acuarela', bg: 'night', el: [fg('dibujo', 'arms', 38, 94, 0.62, { kit: 'tierrak' }), fg('vozinho', 'arms', 62, 94, 0.62, { kit: 'tierrak', flip: true })], b: [sp(26, 14, 'Vos el primer tiempo…', 'b', 36), sp(74, 16, 'No. Tú el primero. Yo te cuido el segundo.', 'b', 40)] },
          { st: 'acuarela', bg: 'night', el: [fg('mesias', 'kneel', 36, 90, 0.5, { kit: 'tierra' }), fg('nico', 'kneel', 70, 90, 0.44, { kit: 'tierra', flip: true })], b: [sp(30, 14, '¿Sabes por qué nunca le pateé a un hombre, Nico?', 'b', 50)] }
        )
      ),
      pg(
        R(500, {
          st: 'retro', bg: 'curve',
          el: [{ k: 'goal', x: 50, y: 84, s: 0.7 }, fg('mesias', 'ready', 50, 86, 0.36, { kit: 'casual', num: '', beard: null }), ball(20, 60, 0.07, { trail: 20 })],
          b: [ca(20, 10, 'Rosales, 1994.', 'n', 30), sp(76, 16, 'Porque de chico era el más chiquito. Y siempre me mandaban al arco.', 'b', 44)]
        }),
        R(440,
          { st: 'color', bg: 'night', el: [bu('mesias', 50, 62, 0.9, 'closed', 'smile', { kit: 'tierra' })], b: [sp(50, 13, 'Sé lo que se siente que todos te pateen a vos.', 'b', 60)] },
          { st: 'color', bg: 'pecera', el: [bu('biela', 30, 66, 0.72, 'calm', 'flat'), bu('escalona', 72, 66, 0.72, 'det', 'flat')], b: [sp(28, 13, 'Mañana alguien va a tener que hablarles.', 'b', 44), sp(74, 13, 'Que hablen ellos, Loco. Nosotros, cuando nos dejen.', 'b', 44)] }
        )
      ),
      pg(
        R(460, {
          st: 'glitch', bg: 'mirror', bgo: { seed: 30 },
          el: [crowd({ silhouette: null, n: 11, y: 90, s: 0.46, seed: 60, rf: true })],
          fx: [{ n: 'shards', seed: 4 }],
          sfx: [sfx('ZZZZT', 50, 20, 14, -6, '#cfe3ff')],
          b: [ca(50, 8, 'Y llegaron los Reflejos.', 'n', 40)]
        }),
        R(440,
          { st: 'color', bg: 'flat', bgo: { bgc: '#1d2b52' }, el: [bu('mesias', 50, 62, 0.9, 'shock', 'o', { kit: 'tierra' })], w: 1 },
          { st: 'glitch', bg: 'mirror', el: [bu('mesias', 50, 62, 0.9, 'n', 'none', { rf: true })], b: [ca(50, 92, 'Leo Mesías, 2012. 91 goles en un año.', 'n', 80)], w: 1 }
        ),
        R(420,
          { st: 'glitch', bg: 'mirror', el: [bu('mbapo', 50, 62, 0.9, 'n', 'none', { rf: true })], b: [ca(50, 92, "Kylen M'Bapó, en su pico.", 'n', 80)] },
          { st: 'glitch', bg: 'mirror', el: [bu('dibujo', 50, 62, 0.9, 'n', 'none', { rf: true })], b: [ca(50, 92, 'Su arquero: el reflejo de Dibujo.', 'n', 80)] },
          { st: 'glitch', bg: 'mirror', el: [bu('nico', 50, 62, 0.9, 'n', 'none', { rf: true, op: 0.45, blur: 6 })], b: [ca(50, 92, 'El de Nico… era borroso.', 'n', 80)] }
        )
      ),
      pg(
        R(420,
          { st: 'color', bg: 'flat', bgo: { bgc: '#1a2340' }, el: [bu('nico', 50, 62, 0.9, 'shock', 'open', { kit: 'tierra' })], b: [sp(50, 13, '¿Por qué el mío no tiene forma?', 'b', 60)] },
          { st: 'neon', bg: 'space', ac: '#ffb020', el: [{ k: 'arbitro', x: 50, y: 45, s: 0.8 }], b: [sy(50, 88, 'TU MEJOR VERSIÓN AÚN NO EXISTE.', 'n', 80)] }
        ),
        R(460, {
          st: 'color', bg: 'pitch', bgo: { hy: 30 },
          el: [crowd({ silhouette: null, n: 12, y: 94, s: 0.46, seed: 70, e: 'sad', kits: ['tierra'] }), fg('rolando', 'stand', 50, 70, 0.4, { kit: 'tierra' })],
          b: [ca(50, 10, 'La charla antes de la final no la dio un técnico. La pidió Rolando.', 'n', 80)]
        }),
        R(440,
          { st: 'manga', bg: 'white', el: [bu('rolando', 50, 62, 0.9, 'sad', 'flat', { kit: 'tierra' })], b: [sp(50, 13, 'Toda mi vida guardé cosas. Goles. Récords. Botines. Ayer guardé mi lugar en una fila… y un hombre murió.', 'b', 80)] },
          { st: 'manga', bg: 'white', ac: '#ff2d4d', fx0: ['focus'], el: [bu('rolando', 50, 62, 0.9, 'ego', 'grit', { kit: 'tierra' })], b: [sp(50, 13, 'Hoy nada es mío. Ni esta camiseta. Ni esta vida. Todo es de ellos.', 'b', 80)] }
        )
      ),
      full({
        st: 'color', bg: 'tower', bgo: { seed: 12, low: '#ff7a4a' }, ac: '#39f3ff',
        el: [{ k: 'screen', x: 6, y: 58, w: 40, h: 18, live: true, sub: { st: 'color', bg: 'pitch', bgo: { hy: 30 }, el: [crowd({ silhouette: null, n: 9, y: 96, s: 0.5, seed: 80, e: 'ego', kits: ['tierra'] })] } }, { k: 'screen', x: 54, y: 64, w: 40, h: 18, live: 'LIVE', sub: { st: 'color', bg: 'pitch', bgo: { hy: 30 }, el: [bu('rolando', 50, 62, 0.9, 'ego', 'shout', { kit: 'tierra' })] } }, crowd({ n: 16, y: 100, s: 0.2 })],
        sfx: [sfx('¡¡POR LOS 74!!', 50, 20, 13, -6, '#ffffff', { st: '#0a2a6a' })],
        b: [ca(50, 46, 'Veintiséis gargantas. Y, abajo, ocho mil millones repitiendo lo mismo.', 'n', 70)]
      })
    ]
  });

  // =====================================================================
  // CAPÍTULO 5 — MEJOR VERSIÓN (POV Mesías)
  // =====================================================================
  chapters.push({
    id: 'c5', n: 'Capítulo 5', title: 'Mejor versión', pov: 'Leo Mesías', color: '#7fd3ff',
    pages: [
      full({
        st: 'glitch', bg: 'mirror', bgo: { seed: 3 },
        el: [bu('mesias', 28, 50, 0.6, 'ego', 'flat', { kit: 'tierra', lx: 8 }), bu('mesias', 72, 50, 0.6, 'n', 'none', { rf: true, flip: true })],
        fx: [{ n: 'shards', seed: 9 }]
      }),
      pg(
        R(480, {
          st: 'color', bg: 'earthview', bgo: { ex: 80, ey: 30, es: 0.35 },
          el: [fg('mesias', 'stand', 40, 94, 0.34, { kit: 'tierra', back: true }), fg('mesias', 'stand', 60, 94, 0.34, { rf: true, flip: true }), ball(50, 92, 0.04)],
          sfx: [sfx('¡PIIIIII!', 50, 24, 12, -6, '#ffffff')],
          b: [sy(24, 70, 'ANILLO 25. LA GRAN FINAL COMIENZA.', 'n', 34)]
        }),
        R(460, {
          st: 'manga', bg: 'white', ac: '#4d7bff', fx0: [{ n: 'speed', fa: 0 }],
          el: [fg('mbapo', 'sprint', 30, 94, 0.56, { kit: 'tierra' }), fg('mbapo', 'sprint', 70, 94, 0.56, { rf: true })],
          b: [ca(20, 10, "Minuto 12. Reflejo de M'Bapó.", 'n', 34)]
        }),
        R(420,
          { st: 'manga', bg: 'white', fx0: ['focus'], el: [bu('mbapo', 50, 62, 0.9, 'shock', 'o', { kit: 'tierra', sweat: true })], b: [sp(50, 13, 'Es… más rápido que yo.', 'b', 50)] },
          { st: 'manga', bg: 'white', ac: '#ff2233', el: [{ k: 'goal', x: 50, y: 90, s: 0.9 }, fg('dibujo', 'reach', 30, 90, 0.5, { rot: 70, kit: 'tierrak' }), ball(74, 66, 0.07)], sfx: [sfx('GOL', 80, 26, 14, 8, '#ff2233')], b: [sy(34, 12, '0 – 1. DIBUJO: 1/3.', 'n', 44)] }
        )
      ),
      pg(
        R(420, {
          st: 'neon', bg: 'space', ac: '#ff2233',
          el: [{ k: 'arbitro', x: 50, y: 46, s: 0.7, c: '#ff2233' }],
          b: [sy(50, 88, "JUGADOR SUPERADO POR SU REFLEJO: KYLEN M'BAPÓ.", 'n', 80)]
        }),
        R(460,
          { st: 'carbon', bg: 'white', el: [bu('mbapo', 50, 62, 0.9, 'calm', 'smile', { kit: 'tierra', stone: true, seed: 8 })], fx: [{ n: 'dust', fx: 70, fy: 50 }], b: [sp(50, 13, 'Al menos… me ganó alguien rápido.', 'b', 60)] },
          { st: 'color', bg: 'plaza', bgo: { seed: 21 }, el: [tvScreen({ st: 'carbon', bg: 'white', el: [bu('mbapo', 50, 62, 0.9, 'calm', 'smile', { kit: 'tierra', stone: true })] }, { x: 14, y: 10, w: 72, h: 50 }), crowd({ n: 9, y: 100, s: 0.5 })], b: [ca(50, 88, 'París, Bondy. Un barrio entero en silencio.', 'n', 80)] }
        ),
        R(480, {
          st: 'manga', bg: 'white', ac: '#7fd3ff', fx0: [{ n: 'speed', fa: 0 }],
          el: [fg('mesias', 'dribble', 55, 92, 0.52, { rf: true }), ball(66, 88, 0.05), fg('alvaro', 'fall', 20, 92, 0.34, { kit: 'tierra' }), fg('jaime', 'fall', 36, 90, 0.3, { kit: 'tierra', flip: true }), fg('neimar', 'fall', 82, 92, 0.34, { kit: 'tierra' })],
          b: [ca(22, 10, 'Minuto 38. Reflejo de Mesías. Cinco rivales en diez metros.', 'n', 40)]
        })
      ),
      pg(
        R(440,
          { st: 'manga', bg: 'white', ac: '#7fd3ff', el: [bu('mesias', 50, 62, 0.9, 'shock', 'o', { kit: 'tierra' })], b: [th(50, 13, 'Así jugaba yo. Sin mirar a nadie.', 'b', 60)] },
          { st: 'manga', bg: 'white', ac: '#ff2233', el: [{ k: 'goal', x: 50, y: 90, s: 0.9 }, fg('dibujo', 'reach', 70, 90, 0.5, { rot: -70, kit: 'tierrak' }), ball(28, 60, 0.07)], sfx: [sfx('GOL', 22, 26, 14, -8, '#ff2233')], b: [sy(66, 12, '0 – 2. DIBUJO: 2/3.', 'n', 44)] }
        ),
        R(460,
          { st: 'color', bg: 'flat', bgo: { bgc: '#79b6e3' }, el: [bu('alvaro', 50, 62, 0.9, 'sad', 'open', { kit: 'tierra' })], b: [sp(50, 13, 'Perdón, Leo. No llegué.', 'b', 50)] },
          { st: 'neon', bg: 'space', ac: '#ff2233', el: [{ k: 'arbitro', x: 50, y: 45, s: 0.7, c: '#ff2233' }], b: [sy(50, 88, 'JUGADOR SUPERADO: JULIÁN ÁLVARO.', 'n', 80)] }
        ),
        R(440, {
          st: 'manga', bg: 'black', ac: '#b36bff',
          el: [bu('dibujo', 30, 62, 0.95, 'det', 'grit', { kit: 'tierrak', sweat: true }), timer('2/3', 76, 46, 0.42, '#ff2233', 'DIBUJO')],
          b: [sp(76, 86, 'Dos. Uno más y me voy con ellos.', 't', 40)]
        })
      ),
      full({
        st: 'acuarela', bg: 'earthview', bgo: { ex: 50, ey: 115, es: 0.8 },
        el: [bu('mesias', 66, 40, 0.34, 'cry', 'open', { kit: 'tierra', lx: -8 }), bu('alvaro', 34, 72, 0.36, 'closed', 'smile', { kit: 'tierra', stone: true, seed: 7, lx: 6 })],
        fx: [{ n: 'dust', fx: 44, fy: 66 }, { n: 'dust', fx: 58, fy: 58, seed: 9 }],
        b: [ca(28, 10, 'La Araña corrió hasta el último segundo.', 'n', 44), ca(72, 20, 'Hasta el último.', 'n', 30), tv(50, 95, 'BUENOS AIRES · CÓRDOBA · CALCHÍN: EL PAÍS ENTERO SE ARRODILLA FRENTE A LA TELE', 'n', 90)]
      }),
      pg(
        R(360, {
          st: 'neon', bg: 'pecera', ac: '#ffb020',
          el: [{ k: 'mic', x: 50, y: 88, s: 0.6 }],
          b: [sy(50, 14, 'ENTRETIEMPO. COMODÍN DISPONIBLE: UN TÉCNICO PUEDE BAJAR A HABLAR.', 'n', 84)]
        }),
        R(520, {
          st: 'pop', bg: 'pecera', fx0: [{ n: 'burst', fx: 50, fy: 55, fr: 0.45 }],
          el: [fg('mourino', 'reach', 18, 92, 0.46), fg('simeon', 'kick', 38, 92, 0.46), fg('klopf', 'arms', 58, 92, 0.48), fg('guardiolo', 'fall', 76, 88, 0.42, { flip: true }), fg('ancelotta', 'stand', 92, 92, 0.44)],
          sfx: [sfx('¡PAF!', 30, 34, 12, -10, '#fff'), sfx('¡PUM!', 66, 30, 12, 10, '#ffd400'), sfx('¡ÑAC!', 50, 60, 9, -4, '#ff2a6a')],
          b: [sh(18, 12, '¡Yo! ¡Soy el Especial!', 'b', 30), sh(50, 12, '¡Ni lo sueñes, portugués!', 'b', 30), sh(80, 12, '¡Solo estrategia! ¡Solo estrategia!', 'bl', 30)]
        }),
        R(440,
          { st: 'pop', bg: 'flat', bgo: { bgc: '#8fd0ff' }, el: [bu('ancelotta', 50, 62, 0.9, 'calm', 'flat')], b: [sp(50, 13, 'Esto es estrategia, Pep. De supervivencia.', 'b', 60)] },
          { st: 'color', bg: 'pecera', el: [{ k: 'cooler', x: 50, y: 92, s: 0.14 }, fg('biela', 'kneel', 50, 80, 0.5)], b: [sp(50, 13, 'Que hable el que conoce al que tiene que ganar.', 'b', 64)] }
        )
      ),
      pg(
        R(420, {
          st: 'manga', bg: 'pecera', fx0: [{ n: 'focus', fx: 50, fy: 50, fr: 0.3 }],
          el: [bu('escalona', 50, 62, 0.9, 'shock', 'o', { sweat: true })],
          b: [ca(50, 10, 'Y todos miraron a Escalona.', 'n', 50)]
        }),
        R(520, {
          st: 'color', bg: 'locker',
          el: [crowd({ silhouette: null, n: 9, y: 96, s: 0.46, seed: 90, e: 'sad', kits: ['tierra'] }), fg('escalona', 'stand', 50, 72, 0.42)],
          b: [sp(50, 10, 'No les voy a hablar de táctica. Ya saben todo lo que hay que saber.', 'b', 70)]
        }),
        R(440,
          { st: 'color', bg: 'locker', el: [bu('escalona', 50, 62, 0.9, 'det', 'flat')], b: [sp(50, 13, 'Esos de enfrente son ustedes en su mejor día. Pero su mejor día ya pasó. El de ustedes es hoy.', 'b', 80)] },
          { st: 'color', bg: 'locker', el: [bu('escalona', 50, 62, 0.9, 'calm', 'smile')], b: [sp(50, 13, 'Leo. Tu mejor versión no es la de 2012. Es la que aprendió a pasarla.', 'b', 80)] }
        )
      ),
      pg(
        R(440,
          { st: 'color', bg: 'locker', el: [bu('escalona', 50, 62, 0.9, 'sad', 'flat')], b: [sp(50, 13, 'Dibu. Tenés dos encima. Si te hacen uno más…', 'b', 66)] },
          { st: 'color', bg: 'locker', el: [bu('dibujo', 50, 62, 0.9, 'smirk', 'grin', { kit: 'tierrak' })], b: [sp(50, 13, 'Ya sé, Lio. Por eso no me van a hacer ninguno.', 'b', 66)] }
        ),
        R(560, {
          st: 'manga', bg: 'white', ac: '#1b64d4', fx0: ['focus'],
          el: [crowd({ silhouette: null, n: 10, y: 92, s: 0.52, seed: 91, e: 'ego', kits: ['tierra'] })],
          b: [sp(50, 12, 'Salgan. Ocho mil millones los están mirando. Jueguen como si pudieran verlos.', 'b', 80)],
          sfx: [sfx('¡¡VAMOS!!', 50, 44, 16, -6, '#1b64d4')]
        })
      )
    ]
  });

  // =====================================================================
  // CAPÍTULO 6 — LO DESCONOCIDO (coral)
  // =====================================================================
  chapters.push({
    id: 'c6', n: 'Capítulo 6', title: 'Lo desconocido', pov: 'Coral', color: '#39f3ff',
    pages: [
      full({
        st: 'neon', bg: 'earthview', bgo: { ex: 50, ey: 120, es: 0.9, waves: true, wc: '#39f3ff' }, ac: '#39f3ff',
        el: [fg('dibujo', 'ready', 50, 72, 0.3, { kit: 'tierrak' }), { k: 'goal', x: 50, y: 70, s: 0.7, glow: '#39f3ff' }],
        b: [ca(50, 8, 'Segundo tiempo. Tierra 0 – 2 Reflejos.', 'n', 60)]
      }),
      pg(
        R(380, {
          st: 'color', bg: 'pitch', bgo: { hy: 30 },
          el: [fg('rolando', 'header', 60, 90, 0.56, { rf: true }), ball(40, 40, 0.07, { trail: 20 })],
          sfx: [sfx('¡PIIII!', 20, 20, 10, -8, '#fff')],
          b: [ca(78, 12, 'Minuto 46. Reflejo de Rolando, 2008. Cabezazo a quemarropa.', 'n', 40)]
        }),
        R(480, {
          st: 'manga', bg: 'white', ac: '#b36bff', fx0: ['focus'],
          el: [eyes('dibujo', 'ego', { band: 40 })],
          b: [th(50, 88, 'Yo sé dónde me voy a tirar. Mi reflejo también lo sabe. Entonces me tiro al otro lado.', 'n', 84)]
        })
      ),
      full({
        st: 'manga', bg: 'white', ac: '#b36bff', fx0: [{ n: 'speed', fa: -30 }, { n: 'burst', fx: 76, fy: 30, fr: 0.2, burstc: '#e6d0ff' }],
        el: [fg('dibujo', 'reach', 46, 58, 0.36, { rot: -72, kit: 'tierrak', hip: true, e: 'ego' }), ball(80, 30, 0.06, { trail: 200 })],
        fx: [{ n: 'aura', fx: 50, fy: 50, fxc: '#b36bff' }],
        sfx: [sfx('¡¡PAAAF!!', 34, 20, 20, -12, '#b36bff')],
        b: [ca(50, 90, 'Minuto 46. La atajada más grande que vio el universo. Con dos goles encima.', 'n', 70)]
      }),
      pg(
        R(420,
          { st: 'manga', bg: 'white', ac: '#ff2233', el: [fg('dibujo', 'fall', 50, 92, 0.6, { kit: 'tierrak' })], sfx: [sfx('CRAC', 70, 30, 14, 10, '#ff2233')] },
          { st: 'color', bg: 'pitch', bgo: { hy: 20 }, el: [bu('dibujo', 50, 62, 0.9, 'ang', 'shout', { kit: 'tierrak', sweat: true })], b: [sh(50, 13, '¡Aaagh! ¡El tobillo!', 'b', 56)] }
        ),
        R(440,
          { st: 'neon', bg: 'space', ac: '#b36bff', el: [{ k: 'arbitro', x: 50, y: 42, s: 0.6, c: '#b36bff' }], b: [sy(50, 86, 'ATAJADA. ELIGE UNA VIDA.', 'n', 60)] },
          { st: 'color', bg: 'pitch', bgo: { hy: 20 }, el: [bu('dibujo', 50, 62, 0.9, 'smirk', 'grit', { kit: 'tierrak' })], b: [sp(50, 13, 'Para vos, bocón. Tomala. La vas a necesitar.', 'b', 66)] }
        ),
        R(440,
          { st: 'color', bg: 'flat', bgo: { bgc: '#c8102e' }, el: [bu('rolando', 50, 62, 0.9, 'calm', 'smile', { kit: 'tierra' })], b: [sp(50, 13, 'No. Guárdasela al chico.', 'b', 50)] },
          { st: 'manga', bg: 'white', el: [bu('nico', 50, 62, 0.9, 'shock', 'o', { kit: 'tierra' })], b: [sy(50, 13, 'VIDA TRANSFERIDA: JUGADOR 100.', 'n', 70)] }
        )
      ),
      pg(
        R(480, {
          st: 'acuarela', bg: 'pitch', bgo: { hy: 30 },
          el: [fg('dibujo', 'slump', 36, 92, 0.46, { kit: 'tierrak' }), fg('vozinho', 'walk', 66, 94, 0.52, { kit: 'cpvk' })],
          b: [sp(28, 14, 'Cuidámelo, hermano.', 'b', 30), sp(74, 16, 'Con mi vida.', 'b', 26)]
        }),
        R(440,
          { st: 'manga', bg: 'white', ac: '#ffb020', fx0: ['focus'], el: [bu('vozinho', 50, 62, 0.9, 'ego', 'flat', { kit: 'cpvk' })], b: [ca(50, 90, 'Josimar "Vozinho" Días. 0/3.', 'n', 60)] },
          { st: 'color', bg: 'plaza', bgo: { seed: 40, low: '#2a3a5a' }, el: [tvScreen({ st: 'manga', bg: 'white', ac: '#ffb020', el: [bu('vozinho', 50, 62, 0.9, 'ego', 'flat', { kit: 'cpvk' })] }, { x: 14, y: 8, w: 72, h: 52 }), crowd({ n: 9, y: 100, s: 0.5 })], b: [ca(50, 88, 'Praia, Cabo Verde. Medio millón de personas rezando lo mismo.', 'n', 84)] }
        ),
        R(420, {
          st: 'color', bg: 'pecera',
          el: [bu('escalona', 30, 66, 0.72, 'det', 'shout'), { k: 'mic', x: 60, y: 90, s: 0.42 }, bu('simeon', 84, 66, 0.72, 'calm', 'flat')],
          b: [sh(28, 12, '¡Leo! ¡No la lleves! ¡Soltala!', 'b', 36), sp(80, 12, 'Hoy el micrófono es tuyo, Lio.', 'b', 36)]
        })
      ),
      pg(
        R(440, {
          st: 'color', bg: 'pitch', bgo: { hy: 25 },
          el: [fg('mesias', 'dribble', 36, 94, 0.56, { kit: 'tierra' }), fg('mesias', 'ready', 66, 94, 0.56, { rf: true, flip: true }), ball(50, 90, 0.05)],
          b: [ca(50, 10, 'Minuto 71. Mesías contra Mesías.', 'n', 50)]
        }),
        R(440,
          { st: 'manga', bg: 'white', ac: '#7fd3ff', fx0: ['focus'], el: [bu('mesias', 50, 62, 0.9, 'ego', 'flat', { kit: 'tierra' })], b: [th(50, 13, 'Él gambeteaba para llegar. Yo aprendí a llegar sin gambetear.', 'b', 76)] },
          { st: 'manga', bg: 'white', ac: '#7fd3ff', fx0: [{ n: 'speed', fa: 0 }], el: [fg('mesias', 'reach', 50, 94, 0.56, { rf: true }), ball(50, 88, 0.06, { trail: 0, fire: true, c: '#7fd3ff' })], b: [ca(50, 10, 'Un pase entre las piernas de su propio pasado.', 'n', 70)] }
        ),
        R(480,
          { st: 'color', bg: 'pitch', bgo: { hy: 25 }, fx0: [{ n: 'speed', fa: 0 }], el: [fg('yamar', 'kick', 40, 94, 0.62, { kit: 'tierra', arm: true }), ball(84, 60, 0.07, { trail: 190, fire: true, c: '#ffd23a' })], sfx: [sfx('¡GOOOL!', 70, 22, 16, -8, '#ffd23a')], b: [sy(20, 12, 'TIERRA 1 – 2.', 'n', 30)], w: 1.4 },
          { st: 'pop', bg: 'flat', bgo: { bgc: '#ffd23a' }, fx0: [{ n: 'burst', fr: 0.45, burstc: '#fff' }], el: [bu('yamar', 50, 62, 0.9, 'happy', 'shout', { kit: 'tierra', arm: true })], b: [sh(50, 12, '¡POR LUKA!', 'b', 50)] }
        )
      ),
      pg(
        R(360, {
          st: 'manga', bg: 'black', ac: '#ff2d4d',
          el: [timer('89:00', 50, 52, 0.5, '#ff2d4d', 'MINUTO')],
          b: [ca(50, 90, 'Los Reflejos se cerraron como un muro de espejo.', 'n', 70)]
        }),
        R(460,
          { st: 'color', bg: 'earthview', bgo: { ex: 50, ey: 130, es: 0.6 }, el: [bu('rolando', 50, 62, 0.9, 'det', 'shout', { kit: 'tierra' })], b: [sh(50, 13, '¡Árbitro! ¿Cuánto cuesta un gol imposible?', 'b', 66)] },
          { st: 'neon', bg: 'space', ac: '#ffb020', el: [{ k: 'arbitro', x: 50, y: 44, s: 0.72 }], b: [sy(50, 88, 'LA VIDA DE QUIEN LO INTENTE.', 'n', 70)] }
        ),
        R(440,
          { st: 'color', bg: 'flat', bgo: { bgc: '#0b6e3a' }, el: [bu('rolando', 50, 62, 0.9, 'calm', 'smile', { kit: 'tierra' })], b: [sp(50, 13, 'Barato.', 'b', 30)] },
          { st: 'manga', bg: 'white', fx0: [{ n: 'speed', fa: 90 }], el: [bu('nico', 50, 62, 0.9, 'shock', 'shout', { kit: 'tierra' })], b: [sh(50, 13, '¡ROLANDO, NO!', 'b', 50)] }
        )
      ),
      full({
        st: 'manga', bg: 'white', ac: '#ff2d4d', fx0: ['focus'],
        el: [fg('rolando', 'kick', 46, 48, 0.4, { kit: 'tierra', rot: 168, flip: true, hip: true, e: 'ego' }), ball(80, 22, 0.07, { trail: 200, fire: true, c: '#ff2d4d' })],
        fx: [{ n: 'aura', fx: 46, fy: 50, fxc: '#ff2d4d' }],
        sfx: [sfx('¡¡SÍÍÍÍÍÍU!!', 50, 88, 17, -6, '#ff2d4d')],
        b: [ca(20, 8, 'Chilena. Treinta metros.', 'n', 34), ca(80, 8, 'Al ángulo.', 'n', 24)]
      }),
      pg(
        R(420, {
          st: 'color', bg: 'pitch', bgo: { hy: 20 },
          el: [{ k: 'goal', x: 50, y: 90, s: 1.0 }, fg('dibujo', 'reach', 30, 90, 0.5, { rf: true, rot: -60 }), ball(84, 34, 0.07)],
          b: [sy(50, 10, 'TIERRA 2 – 2.', 'n', 40)]
        }),
        R(480,
          { st: 'carbon', bg: 'white', el: [fg('rolando', 'siuu', 50, 94, 0.66, { kit: 'tierra', stone: true, seed: 3 })], fx: [{ n: 'dust', fx: 70, fy: 40 }], sfx: [sfx('SÍÍÍ…', 50, 18, 12, -4, '#bbbbbb')] },
          { st: 'carbon', bg: 'white', el: [bu('rolando', 50, 62, 0.9, 'closed', 'smile', { kit: 'tierra', stone: true, seed: 5 })], fx: [{ n: 'dust', fx: 72, fy: 50, seed: 7 }], b: [sp(50, 13, 'Nada… era mío.', 'b', 40)] }
        ),
        R(440,
          { st: 'acuarela', bg: 'night', el: [bu('nico', 50, 62, 0.9, 'cry', 'open', { kit: 'tierra' })], b: [sp(50, 13, 'Te perdono. ¡Te perdono, carajo!', 'b', 60)] },
          { st: 'color', bg: 'plaza', bgo: { seed: 55 }, el: [tvScreen({ st: 'carbon', bg: 'white', el: [fg('rolando', 'siuu', 50, 94, 0.66, { kit: 'tierra', stone: true })] }, { x: 14, y: 8, w: 72, h: 52 }), crowd({ n: 9, y: 100, s: 0.5 })], b: [ca(50, 88, 'Funchal, Madeira. Nadie gritó el gol. Todos lo lloraron.', 'n', 84)] }
        )
      ),
      pg(
        R(400, {
          st: 'neon', bg: 'space', ac: '#ff2233',
          el: [{ k: 'goal', x: 50, y: 80, s: 0.8, glow: '#ff2233' }, ball(50, 70, 0.06)],
          b: [sy(50, 12, 'PENALES. QUIEN FALLA, MUERE.', 'n', 60)]
        }),
        R(420,
          { st: 'color', bg: 'pitch', bgo: { hy: 20 }, el: [fg('yamar', 'kick', 50, 94, 0.62, { kit: 'tierra', arm: true })], sfx: [sfx('GOL', 76, 30, 14, 8, '#ffd23a')], b: [ca(50, 10, 'Yamar: adentro.', 'n', 50)] },
          { st: 'glitch', bg: 'mirror', el: [fg('mbapo', 'kick', 50, 94, 0.62, { rf: true })], b: [ca(50, 10, 'Reflejo: adentro. Vozinho 1/3.', 'n', 70)] },
          { st: 'pop', bg: 'flat', bgo: { bgc: '#ffd400' }, el: [bu('neimar', 50, 62, 0.9, 'det', 'grin', { kit: 'tierra' })], b: [sp(50, 13, 'Esta vez no me tiro.', 'b', 60), ca(50, 92, 'Neimar: adentro.', 'n', 60)] }
        ),
        R(480,
          { st: 'manga', bg: 'white', ac: '#ffb020', fx0: [{ n: 'speed', fa: 20 }], el: [fg('vozinho', 'reach', 50, 60, 0.56, { rot: 70, kit: 'cpvk', hip: true }), ball(22, 40, 0.07)], sfx: [sfx('¡PAF!', 76, 26, 14, 8, '#ffb020')], b: [sy(50, 92, 'ATAJADA. ELIGE UNA VIDA.', 'n', 50)] },
          { st: 'color', bg: 'flat', bgo: { bgc: '#ffcf8a' }, el: [bu('vozinho', 50, 62, 0.9, 'calm', 'smile', { kit: 'cpvk' })], b: [sp(50, 13, 'La guardo. Alguien la va a necesitar.', 'b', 60)] }
        )
      ),
      pg(
        R(460, {
          st: 'color', bg: 'pitch', bgo: { hy: 25 },
          el: [{ k: 'goal', x: 70, y: 80, s: 0.52 }, fg('dibujo', 'ready', 70, 82, 0.34, { rf: true }), fg('nico', 'windup', 24, 96, 0.5, { kit: 'tierra' })],
          b: [th(30, 12, 'Mi reflejo no existe. Nadie sabe cómo pateo. Ni yo.', 'b', 44)]
        }),
        R(420,
          { st: 'manga', bg: 'white', ac: '#ff2233', fx0: ['focus'], el: [{ k: 'goal', x: 50, y: 90, s: 1.1 }, ball(12, 26, 0.08, { trail: 10 })], sfx: [sfx('¡¡CLANG!!', 50, 40, 18, -8, '#ff2233')] },
          { st: 'manga', bg: 'white', el: [bu('nico', 50, 62, 0.9, 'shock', 'open', { kit: 'tierra', sweat: true })], b: [sy(50, 13, 'FALLÓ. JUGADOR 100: VIDA DE RESERVA DETECTADA. SOBREVIVE.', 'n', 84)] }
        ),
        R(440,
          { st: 'acuarela', bg: 'sunset', el: [bu('nico', 50, 62, 0.9, 'cry', 'smile', { kit: 'tierra' })], b: [ca(50, 12, 'La vida de Dibujo. Que pasó por Rolando. Que llegó a Nico.', 'n', 80)] },
          { st: 'glitch', bg: 'mirror', el: [fg('mesias', 'kick', 50, 94, 0.62, { rf: true })], b: [ca(50, 10, 'Reflejo: adentro. Vozinho 2/3.', 'n', 70)], sfx: [sfx('GOL', 76, 36, 12, 8, '#cfe3ff')] }
        )
      ),
      pg(
        R(420,
          { st: 'color', bg: 'pitch', bgo: { hy: 20 }, fx0: [{ n: 'speed', fa: 0 }], el: [fg('jaime', 'kick', 50, 94, 0.62, { kit: 'tierra', flip: true })], sfx: [sfx('GOL', 22, 28, 14, -8, '#fcd116')], b: [ca(64, 10, 'Jaime Rodrigo. Zurda. Adentro.', 'n', 54)] },
          { st: 'neon', bg: 'space', ac: '#39f3ff', el: [timer('3 – 2', 50, 50, 0.6, '#39f3ff', 'PENALES')], b: [ca(50, 90, 'Queda un penal por lado.', 'n', 60)] }
        ),
        R(440, {
          st: 'manga', bg: 'black', ac: '#ffb020',
          el: [fg('vozinho', 'ready', 50, 94, 0.6, { kit: 'cpvk' }), fg('haalund', 'windup', 18, 96, 0.44, { rf: true })],
          b: [ca(70, 12, 'Cuarto reflejo. Si entra, muere Vozinho.', 'n', 44)]
        }),
        R(460,
          { st: 'acuarela', bg: 'night', el: [bu('vozinho', 50, 62, 0.9, 'closed', 'flat', { kit: 'cpvk' })], b: [th(50, 13, 'Señor, si es mi hora, que sea atajando.', 'b', 60)] },
          { st: 'manga', bg: 'white', ac: '#b36bff', fx0: ['focus'], el: [bu('dibujo', 50, 62, 0.9, 'ego', 'shout', { kit: 'tierrak' })], b: [sh(50, 13, '¡AL OTRO LADO, VOZI! ¡TIRATE AL OTRO LADO!', 'b', 70)] }
        )
      ),
      full({
        st: 'manga', bg: 'white', ac: '#ffb020', fx0: [{ n: 'speed', fa: 25 }, { n: 'burst', fx: 22, fy: 30, fr: 0.18, burstc: '#ffe7a6' }],
        el: [fg('vozinho', 'reach', 56, 52, 0.36, { rot: 72, kit: 'cpvk', hip: true, e: 'ego' }), ball(20, 30, 0.06, { trail: -20 })],
        fx: [{ n: 'aura', fx: 50, fy: 50, fxc: '#ffb020' }],
        sfx: [sfx('¡¡ATAJÓÓÓ!!', 62, 88, 18, -6, '#ffb020')],
        b: [ca(76, 8, 'Vozinho. Cuarenta años. Cabo Verde.', 'n', 40), ca(26, 72, 'Se tiró al otro lado.', 'n', 34)]
      }),
      pg(
        R(360, {
          st: 'neon', bg: 'earthview', bgo: { ex: 50, ey: 120, es: 0.8 }, ac: '#39f3ff',
          el: [],
          b: [sy(50, 30, 'TIERRA 3 – 2. SI CONVIERTE, LA TIERRA SIGUE EXISTIENDO.', 'n', 80)]
        }),
        R(560, {
          st: 'color', bg: 'pitch', bgo: { hy: 18 },
          el: [{ k: 'goal', x: 50, y: 36, s: 0.4 }, fg('dibujo', 'ready', 50, 37, 0.14, { rf: true }), ball(50, 60, 0.03), fg('mesias', 'walk', 50, 98, 0.52, { kit: 'tierra', back: true })],
          b: [ca(22, 70, 'Leo Mesías caminó hacia el punto penal como caminaba en Rosales: mirando el piso.', 'n', 36)]
        }),
        R(360,
          { st: 'manga', bg: 'white', ac: '#7fd3ff', el: [eyes('mesias', 'ego')] },
          { st: 'glitch', bg: 'mirror', el: [bu('dibujo', 50, 62, 0.9, 'n', 'none', { rf: true })], b: [th(50, 14, 'Esquina izquierda. Perfecta. Él ya lo sabe.', 'b', 70)] }
        )
      ),
      full({
        st: 'color', bg: 'pitch', bgo: { hy: 12 }, ac: '#7fd3ff', fx0: [{ n: 'focus', fx: 80, fy: 22, fr: 0.1, fxc: '#0b2a4a' }],
        el: [{ k: 'goal', x: 56, y: 44, s: 0.82 }, fg('dibujo', 'reach', 30, 42, 0.26, { rf: true, rot: -66, hip: true }), ball(84, 22, 0.06, { trail: 225, fire: true, c: '#7fd3ff' }), fg('mesias', 'kick', 40, 98, 0.42, { kit: 'tierra', flip: true })],
        sfx: [sfx('GOL', 76, 60, 22, -8, '#7fd3ff')],
        b: [ca(24, 70, 'Amagó a la esquina perfecta.', 'n', 34), ca(76, 78, 'Y la clavó en el ángulo contrario. Con la derecha. Su pierna menos hábil.', 'n', 40)]
      }),
      full({
        st: 'pop', bg: 'tower', bgo: { seed: 30, low: '#ffcf5a' }, ac: '#ffd400',
        el: [{ k: 'screen', x: 6, y: 62, w: 40, h: 18, live: true, sub: { st: 'pop', bg: 'flat', bgo: { bgc: '#79b6e3' }, fx0: [{ n: 'burst', fr: 0.5 }], el: [bu('mesias', 50, 62, 0.9, 'happy', 'shout', { kit: 'tierra' })] } }, { k: 'screen', x: 54, y: 66, w: 40, h: 18, live: 'AO VIVO', sub: { st: 'pop', bg: 'flat', bgo: { bgc: '#ffcf8a' }, fx0: [{ n: 'burst', fr: 0.5 }], el: [bu('vozinho', 50, 62, 0.9, 'happy', 'shout', { kit: 'cpvk' })] } }, crowd({ n: 18, y: 100, s: 0.2 })],
        fx: [{ n: 'sparkle', seed: 8 }],
        sfx: [sfx('¡¡GOOOOOOL!!', 50, 20, 17, -6, '#ffd400')],
        b: [ca(50, 46, 'Ocho mil millones de personas gritaron al mismo tiempo. Por primera vez en la historia, el planeta hizo un solo ruido.', 'n', 76)]
      })
    ]
  });

  // =====================================================================
  // EPÍLOGO — TIEMPO AÑADIDO
  // =====================================================================
  chapters.push({
    id: 'epilogo', n: 'Epílogo', title: 'Tiempo añadido', pov: 'Nico Ferro', color: '#ffcf8a',
    pages: [
      full({
        st: 'acuarela', bg: 'sunset',
        el: [crowd({ silhouette: null, n: 9, y: 84, s: 0.3, seed: 61, rf: true, e: 'closed' })],
        fx: [{ n: 'shards', seed: 5 }, { n: 'sparkle', seed: 2 }],
        b: [rf(50, 16, 'Nosotros perdimos nuestra final hace mil años. Solo quedaron nuestros recuerdos, jugando.', 'n', 70), rf(50, 34, 'Gracias por jugar como nosotros no pudimos.', 'n', 60)]
      }),
      pg(
        R(460,
          { st: 'glitch', bg: 'mirror', el: [bu('mesias', 50, 62, 0.9, 'closed', 'none', { rf: true, op: 0.7 })], fx: [{ n: 'shards', seed: 7 }], b: [rf(50, 13, 'Tu mejor versión… era esta.', 'b', 60)] },
          { st: 'color', bg: 'flat', bgo: { bgc: '#79b6e3' }, el: [bu('mesias', 50, 62, 0.9, 'calm', 'smile', { kit: 'tierra' })], b: [sp(50, 13, 'Tardé treinta años en encontrarla.', 'b', 60)] }
        ),
        R(440, {
          st: 'neon', bg: 'space', ac: '#ffb020',
          el: [{ k: 'arbitro', x: 50, y: 46, s: 0.75, shut: true }],
          b: [sy(50, 88, 'AUDITORÍA SUPERADA. LA TIERRA CONTINÚA.', 'n', 70)]
        }),
        R(500, {
          st: 'color', bg: 'tower', bgo: { n: 8, seed: 3, low: '#ffb07a' }, ac: '#39f3ff',
          el: [],
          b: [ca(50, 90, 'La torre de anillos se replegó hacia el Estadio Coloso como un telescopio que se cierra.', 'n', 84)]
        })
      ),
      pg(
        R(500, {
          st: 'color', bg: 'stadium', bgo: { hy: 50, seed: 3 },
          el: [crowd({ silhouette: null, n: 12, y: 94, s: 0.4, seed: 77, e: 'shock', kits: ['tierra'] })],
          b: [ca(50, 8, 'Estadio Coloso. 20:59:03. En la Tierra habían pasado tres segundos.', 'n', 80)]
        }),
        R(360, {
          st: 'color', bg: 'black',
          el: [txt('SALIERON 100.', 50, 44, 8, { fill: '#f4ecd8', st: 'none' }), txt('VOLVIERON 23.', 50, 74, 8, { fill: '#ff5a5a', st: 'none' })]
        }),
        R(460,
          { st: 'acuarela', bg: 'stadium', bgo: { hy: 20 }, el: [fg('dibujo', 'arms', 38, 94, 0.62, { kit: 'tierrak' }), fg('vozinho', 'arms', 62, 94, 0.62, { kit: 'cpvk', flip: true })], b: [sp(26, 14, 'Te debo la vida, hermano.', 'b', 36), sp(76, 14, 'Me debes un baile.', 'b', 32)] },
          { st: 'acuarela', bg: 'stadium', bgo: { hy: 20 }, el: [bu('aguirra', 30, 66, 0.72, 'cry', 'smile'), bu('nico', 72, 66, 0.72, 'cry', 'smile', { kit: 'tierra' })], b: [sp(30, 12, 'Memo estaría orgulloso, mijo.', 'b', 40)] }
        )
      ),
      pg(
        R(420, {
          st: 'acuarela', bg: 'night',
          el: [bu('mesias', 50, 62, 0.9, 'sad', 'flat', { kit: 'tierra' })],
          b: [th(50, 13, 'Setenta y siete.', 'b', 36)]
        }),
        R(460, {
          st: 'acuarela', bg: 'stadium', bgo: { hy: 45, night: false, seed: 9 },
          el: [txt('EL PARTIDO DE LOS 77', 50, 20, 7, { fill: '#ffffff', st: '#1b2440' }), crowd({ silhouette: null, n: 11, y: 94, s: 0.42, seed: 88, e: 'closed', kits: ['arg', 'por', 'cro', 'mexk', 'fra', 'nor', 'col', 'esp', 'bra'] })],
          b: [ca(50, 90, 'Un año después. Setenta y siete camisetas colgadas en el arco.', 'n', 80)]
        }),
        R(460,
          { st: 'color', bg: 'stadium', bgo: { hy: 30, night: false }, el: [bu('nico', 50, 62, 0.9, 'det', 'grin', { kit: 'mex', num: 100 })], b: [ca(50, 90, 'Nico Ferro. Dorsal 100. Debut profesional.', 'n', 70)] },
          { st: 'carbon', bg: 'sunset', el: [fg('rolando', 'kick', 50, 62, 0.62, { kit: 'tierra', stone: true, rot: 168, flip: true, hip: true })], b: [ca(50, 90, 'Funchal. Estatua de bronce. Cada día, alguien le grita "¡SÍÍÍU!".', 'n', 84)] }
        )
      ),
      full({
        st: 'retro', bg: 'barrio', bgo: { seed: 5 },
        el: [{ k: 'arbitro', x: 78, y: 16, s: 0.22, op: 0.35 }, fg('extra2', 'kick', 40, 92, 0.22, { kit: 'bib', num: '' }), ball(62, 76, 0.04, { trail: 180 })],
        b: [ca(28, 8, 'Iztapalapa. Una pared. Un niño. Diez mil tiros.', 'n', 44), sy(74, 32, 'PRÓXIMA REVISIÓN: EN CIEN AÑOS.', 'n', 40), ca(50, 96, 'FIN', 'n', 16)]
      }),
      {
        text: `<h2>Agradecimientos</h2>
<p>A Muneyuki Kaneshiro y Yusuke Nomura (<em>Blue Lock</em>), a Yoichi Takahashi (<em>Capitán Tsubasa</em>), a Haro Aso (<em>Alice in Borderland</em>) y a Eduardo Galeano, que nos enseñó que el fútbol también se escribe.</p>
<p>A todos los arqueros del mundo, que atajan por otros.</p>
<p>A todo el que alguna vez jugó un partido como si fuera el último.</p>
<p class="small">Todos los personajes son ficticios. Los nombres son deformaciones cariñosas de leyendas reales: cualquier parecido es homenaje.</p>
<p class="small">Ilustraciones generadas por código (SVG), mezclando estilos: anime a color, manga de tinta, retro 80s, neón, acuarela, pop-art, glitch y carbón.</p>`
      }
    ]
  });

  global.STORY = {
    title: 'ESTADIO CERO',
    tagline: '100 jugadores. 24 horas. Un solo planeta. Y el mundo entero mirando.',
    synopsis: 'Durante un partido benéfico en el Estadio Coloso, un ojo colosal abre el cielo y se lleva a cien jugadores a una torre de veinticinco anillos que sube hasta el espacio. La Tierra será auditada con fútbol: el que no mete su gol, muere; el arquero que recibe tres, también. Los que lleguen a la final decidirán si el planeta sigue existiendo, mientras ocho mil millones de personas lo miran en vivo sin poder hacer nada.',
    chapters,
    cast: [
      ['mesias', 'Leo Mesías', 'El capitán silencioso. Nunca le patea a un hombre.'],
      ['dibujo', 'Dibujo Martell', 'Arquero bocón. Ataja por otros.'],
      ['vozinho', 'Vozinho Días', 'Arquero de Cabo Verde. 40 años. Fe inquebrantable.'],
      ['rolando', 'Cristóbal Rolando', 'Ego puro. Busca redimirse.'],
      ['nico', 'Nico Ferro', 'Recogepelotas. Jugador número 100.'],
      ['memo', 'Memo Ocho', 'Arquero mexicano. El ídolo de Nico.'],
      ['modrovic', 'Luka Modrović', 'El veterano que da el paso al frente.'],
      ['yamar', 'Lamín Yamar', 'Prodigio de 19 años.'],
      ['escalona', 'Lio Escalona', 'DT. La charla del entretiempo.'],
      ['biela', '"Loco" Biela', 'DT. Sentado en su conservadora.'],
      ['simeon', 'Cholo Simeón', 'DT. El más violento de La Pecera.'],
      ['mourino', 'José Mouriño', 'DT. "El Especial". Quiere el micrófono.']
    ]
  };
})(typeof window !== 'undefined' ? window : globalThis);
