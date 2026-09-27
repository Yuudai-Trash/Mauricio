/* ESTADIO CERO — lector: portada, modo Páginas, modo Cascada, zoom de viñetas. */
(function () {
  'use strict';
  const S = window.STORY;
  const $ = (s, r) => (r || document).querySelector(s);
  const app = $('#app');
  const PW = 1000, PH = 1500, M = 22, G = 14;
  const NARROW = 700;

  // ---------- almacenamiento seguro ----------
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sin almacenamiento */ } }
  };
  let mode = store.get('ec-mode', 'paginas');
  const readMap = store.get('ec-read', {});

  // ---------- modelo ----------
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const chapters = S.chapters.map((c, ci) => {
    const pages = [{ title: true }].concat(c.pages);
    return Object.assign({}, c, { ci, pages });
  });
  function layout(page) {
    if (page.full) return [{ p: page.full, x: 0, y: 0, w: PW, h: PH, bleed: true }];
    if (!page.rows) return [];
    const rows = page.rows;
    const tot = rows.reduce((a, r) => a + r[0], 0);
    const scale = (PH - 2 * M - G * (rows.length - 1)) / tot;
    let y = M;
    const out = [];
    rows.forEach((r) => {
      const h = r[0] * scale;
      const ps = r.slice(1);
      const sw = ps.reduce((a, p) => a + (p.w || 1), 0);
      const aw = PW - 2 * M - G * (ps.length - 1);
      let x = M;
      ps.forEach((p) => {
        const w = (aw * (p.w || 1)) / sw;
        out.push({ p, x, y, w, h });
        x += w + G;
      });
      y += h + G;
    });
    return out;
  }
  chapters.forEach((c) => { c.layouts = c.pages.map(layout); });

  // tiempo de lectura: 200 palabras/min + 3 s por viñeta + 4 s por página
  function countWords(t) { return String(t).replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length; }
  chapters.forEach((c) => {
    let words = 0, panels = 0;
    c.pages.forEach((pg, i) => {
      if (pg.text) words += countWords(pg.text);
      c.layouts[i].forEach((l) => { panels++; (l.p.b || []).forEach((b) => { words += countWords(b.s); }); });
    });
    c.words = words;
    c.secs = (words / 200) * 60 + panels * 3 + c.pages.length * 4;
    c.min = Math.max(1, Math.round(c.secs / 60));
  });
  const totalMin = Math.round(chapters.reduce((a, c) => a + c.secs, 0) / 60);
  const totalPages = chapters.reduce((a, c) => a + c.pages.length, 0);
  const globalIndex = (ci, pi) => chapters.slice(0, ci).reduce((a, c) => a + c.pages.length, 0) + pi;

  // ---------- render de piezas ----------
  function bubblesHTML(p) {
    return (p.b || []).map((b) => `<div class="bub ${b.t} tail-${b.tail || 'b'}" style="left:${b.x}%;top:${b.y}%;--w:${Math.min(94, (b.w || 50) * 1.18).toFixed(1)}%" data-x="${b.x}" data-y="${b.y}">${esc(b.s)}</div>`).join('');
  }
  function panelDiv(l, key) {
    const pct = (v, t) => (v / t) * 100 + '%';
    return `<div class="panel${l.bleed ? ' bleed' : ''}" data-key="${key}" style="left:${pct(l.x, PW)};top:${pct(l.y, PH)};width:${pct(l.w, PW)};height:${pct(l.h, PH)}"><div class="ph"></div><div class="bubbles">${bubblesHTML(l.p)}</div></div>`;
  }
  function titleInner(c) {
    return `<div class="title-inner"><div class="n">${esc(c.n)}</div><h2>${esc(c.title)}</h2><div class="rule"></div><div class="pov">Punto de vista: <b>${esc(c.pov)}</b></div><div class="rt">≈ ${c.min} min de lectura · ${c.pages.length - 1} páginas</div></div>`;
  }
  function pageHTML(ci, pi) {
    const c = chapters[ci], pg = c.pages[pi];
    if (pg.title) return `<div class="page title-page" style="--c:${c.color}" data-ci="${ci}" data-pi="${pi}">${titleInner(c)}</div>`;
    if (pg.text) return `<div class="page text-page" data-ci="${ci}" data-pi="${pi}"><div class="text-inner">${pg.text}</div></div>`;
    const ls = c.layouts[pi];
    return `<div class="page" data-ci="${ci}" data-pi="${pi}">${ls.map((l, k) => panelDiv(l, `${ci}.${pi}.${k}`)).join('')}</div>`;
  }
  function soloHTML(ci, pi, k) {
    const l = chapters[ci].layouts[pi][k];
    const W = Math.round(l.w), H = Math.round(l.h);
    return `<div class="solo" data-key="${ci}.${pi}.${k}" style="aspect-ratio:${W}/${H};--k:${(PW / W).toFixed(4)}"><div class="bubbles">${bubblesHTML(l.p)}</div></div>`;
  }
  function paint(el) {
    if (!el || el.dataset.done) return;
    const [ci, pi, k] = el.dataset.key.split('.').map(Number);
    const l = chapters[ci].layouts[pi][k];
    let svg;
    try { svg = ART.render(l.p, Math.round(l.w), Math.round(l.h)); } catch (e) { console.error(e); return; }
    const ph = el.querySelector('.ph');
    if (ph) ph.remove();
    el.insertAdjacentHTML('afterbegin', svg);
    el.dataset.done = '1';
    fitBubbles(el);
  }
  // Mantiene cada burbuja dentro de su viñeta (se recalcula al cambiar de tamaño)
  function fitBubbles(root) {
    root.querySelectorAll('.bubbles').forEach((box) => {
      const W = box.clientWidth, H = box.clientHeight;
      if (!W || !H) return;
      const pad = Math.max(3, W * 0.012);
      box.querySelectorAll('.bub').forEach((b) => {
        b.style.left = b.dataset.x + '%';
        b.style.top = b.dataset.y + '%';
        const bw = b.offsetWidth, bh = b.offsetHeight;
        let cx = (W * b.dataset.x) / 100, cy = (H * b.dataset.y) / 100;
        const tailB = /tail-(b|bl|br)\b/.test(b.className) ? bh * 0.12 : 0;
        cx = Math.min(Math.max(cx, bw / 2 + pad), W - bw / 2 - pad);
        cy = Math.min(Math.max(cy, bh / 2 + pad), H - bh / 2 - pad - tailB);
        b.style.left = (cx / W) * 100 + '%';
        b.style.top = (cy / H) * 100 + '%';
      });
    });
  }
  let io = null;
  function observe(root) {
    if (io) io.disconnect();
    if (!('IntersectionObserver' in window)) { root.querySelectorAll('[data-key]').forEach(paint); return; }
    io = new IntersectionObserver((ents) => ents.forEach((e) => { if (e.isIntersecting) { paint(e.target); io.unobserve(e.target); } }), { rootMargin: '900px 0px' });
    root.querySelectorAll('[data-key]').forEach((el) => io.observe(el));
  }

  // ---------- barra ----------
  function setMode(m) {
    mode = m;
    store.set('ec-mode', m);
    document.querySelectorAll('.seg-btn').forEach((b) => b.classList.toggle('on', b.dataset.mode === m));
  }
  function setProgress(ci, pi) {
    $('#progressFill').style.width = ci == null ? '0%' : ((globalIndex(ci, pi) + 1) / totalPages) * 100 + '%';
  }
  function markRead(ci, pi) {
    const c = chapters[ci];
    store.set('ec-last', { ch: c.id, p: pi });
    if (pi >= c.pages.length - 1 && !readMap[c.id]) { readMap[c.id] = 1; store.set('ec-read', readMap); }
    setProgress(ci, pi);
  }
  const chIndex = (id) => Math.max(0, chapters.findIndex((c) => c.id === id));

  // ---------- portada ----------
  function thumb(c) {
    const first = c.pages[1];
    const p = first.full || (first.rows && first.rows[0][1]);
    try { return ART.render(p, 400, 600); } catch (e) { return ''; }
  }
  function chCard(c, cur) {
    return `<button type="button" class="ch-card${readMap[c.id] ? ' done' : ''}${cur ? ' cur' : ''}" data-go="${c.id}" style="--c:${c.color}"><div class="ch-thumb">${thumb(c)}</div><div><div class="ch-n">${esc(c.n)}</div><div class="ch-t">${esc(c.title)}</div><div class="ch-m">${esc(c.pov)} · ≈ ${c.min} min</div></div></button>`;
  }
  function renderHome() {
    document.title = 'Estadio Cero';
    setProgress(null);
    const last = store.get('ec-last', null);
    const cover = ART.render({ st: 'color', bg: 'tower', bgo: { seed: 7, labels: false }, ac: '#39f3ff', el: [{ k: 'arbitro', x: 50, y: 14, s: 0.36 }] }, 1400, 1000);
    const castArt = (id) => ART.render({ st: 'color', bg: 'flat', bgo: { bgc: '#2b2645' }, el: [{ k: 'bust', c: id, x: 50, y: 58, s: 0.95, e: 'n' }] }, 300, 300);
    app.innerHTML = `<div class="home">
      <section class="hero">
        <div class="hero-art">${cover}</div>
        <div class="hero-body">
          <div class="kicker">Cómic · Ciencia ficción futbolera</div>
          <h1>ESTADIO CERO</h1>
          <p class="tag">${esc(S.tagline)}</p>
          <p class="syn">${esc(S.synopsis)}</p>
          <div class="hero-cta">
            <button class="btn primary big" type="button" data-start>Leer desde el inicio</button>
            ${last ? `<button class="btn big" type="button" data-continue>Continuar: ${esc(chapters[chIndex(last.ch)].n)}</button>` : ''}
            <span class="meta">${chapters.length} partes · ≈ ${totalMin} min</span>
          </div>
        </div>
      </section>
      <section class="section">
        <h2>¿Cómo quieres leer?</h2>
        <p class="sub">Puedes cambiar de formato en cualquier momento desde la barra superior.</p>
        <div class="modes">
          <button type="button" class="mode-card${mode === 'paginas' ? ' on' : ''}" data-setmode="paginas"><b>Páginas</b><span>Como un tomo impreso: una página a la vez. Flechas, teclado o deslizar. Toca una viñeta para ampliarla.</span></button>
          <button type="button" class="mode-card${mode === 'cascada' ? ' on' : ''}" data-setmode="cascada"><b>Cascada</b><span>Estilo webtoon: todo el capítulo en scroll vertical. En celular, viñeta por viñeta a pantalla completa.</span></button>
        </div>
      </section>
      <section class="section">
        <h2>Capítulos</h2>
        <p class="sub">Lectura total estimada: ≈ ${totalMin} minutos.</p>
        <ol class="chapters">${chapters.map((c) => `<li>${chCard(c)}</li>`).join('')}</ol>
      </section>
      <section class="section">
        <h2>Reparto</h2>
        <p class="sub">Nombres ficticios, deformaciones cariñosas de leyendas reales.</p>
        <div class="cast">${S.cast.map((x) => `<div class="cast-card"><div class="cast-art">${castArt(x[0])}</div><div class="t"><b>${esc(x[1])}</b><span>${esc(x[2])}</span></div></div>`).join('')}</div>
      </section>
      <section class="section">
        <h2>Estructura</h2>
        <p class="sub">Del prólogo al epílogo, siguiendo el arco dramático clásico.</p>
        <div class="structure">
          <div><b>Preliminares</b><p>Epígrafe y Prólogo: el Partido de las Estrellas y la torre de anillos.</p></div>
          <div><b>Introducción</b><p>Capítulo 1: la Ley del Árbitro, La Pecera de los DT y la fila.</p></div>
          <div><b>Desarrollo</b><p>Capítulos 2 a 4 e Interludio: arqueros que salvan a otros, la Tarjeta Negra y los 26.</p></div>
          <div><b>Clímax</b><p>Capítulos 5 y 6: la Gran Final contra los Reflejos, hasta el último penal.</p></div>
          <div><b>Resolución y epílogo</b><p>Tiempo añadido: los que vuelven, los que no, y los agradecimientos.</p></div>
        </div>
      </section>
      <p class="foot">Estadio Cero es una obra de ficción. Ilustraciones generadas por código combinando estilos (anime a color, manga, retro 80s, neón, acuarela, pop-art, glitch y carbón), inspiradas en Blue Lock, Capitán Tsubasa y Alice in Borderland.</p>
    </div>`;
    window.scrollTo(0, 0);
  }

  // ---------- modo páginas ----------
  let cur = { ci: 0, pi: 0 };
  function fitPage() {
    const narrow = innerWidth < NARROW;
    const availH = innerHeight - $('#bar').offsetHeight - 12 - 54;
    const availW = innerWidth - (narrow ? 12 : 150);
    const pw = Math.max(200, Math.min(availW, (availH * 2) / 3));
    app.style.setProperty('--pw', pw + 'px');
  }
  function renderPaged(ci, pi, dir) {
    const c = chapters[ci];
    pi = Math.max(0, Math.min(pi, c.pages.length - 1));
    cur = { ci, pi };
    document.title = `${c.n}: ${c.title} · Estadio Cero`;
    const first = ci === 0 && pi === 0, lastP = ci === chapters.length - 1 && pi === c.pages.length - 1;
    app.innerHTML = `<div class="pv">
      <button class="pv-nav prev" type="button" aria-label="Página anterior" ${first ? 'disabled' : ''}>‹</button>
      <div class="pv-stage">${pageHTML(ci, pi)}</div>
      <button class="pv-nav next" type="button" aria-label="Página siguiente" ${lastP ? 'disabled' : ''}>›</button>
      <div class="pv-foot"><span><b>${esc(c.n)}</b> · ${pi === 0 ? 'Portadilla' : `pág. ${pi} / ${c.pages.length - 1}`}</span><span class="hint">← → para pasar · clic en una viñeta para ampliar</span></div>
    </div>`;
    const pageEl = $('.pv .page');
    if (dir) pageEl.style.setProperty('--dir', dir > 0 ? '24px' : '-24px');
    fitPage();
    pageEl.querySelectorAll('[data-key]').forEach(paint);
    markRead(ci, pi);
  }
  function step(d) {
    let { ci, pi } = cur;
    pi += d;
    if (pi >= chapters[ci].pages.length) { if (ci >= chapters.length - 1) return; ci++; pi = 0; }
    if (pi < 0) { if (ci <= 0) return; ci--; pi = chapters[ci].pages.length - 1; }
    location.hash = `#/paginas/${chapters[ci].id}/${pi}`;
    cur.dir = d;
  }

  // ---------- modo cascada ----------
  let cvNarrow = null;
  function renderCascade(ci, pi) {
    const c = chapters[ci];
    cur = { ci, pi: pi || 0 };
    document.title = `${c.n}: ${c.title} · Estadio Cero`;
    const narrow = innerWidth < NARROW;
    cvNarrow = narrow;
    let html = `<div class="cv">`;
    c.pages.forEach((pg, i) => {
      if (pg.title || pg.text || !narrow) html += `<div class="cv-item" data-pi="${i}">${pageHTML(ci, i)}</div>`;
      else html += `<div class="cv-item solo-list" data-pi="${i}">${c.layouts[i].map((_, k) => soloHTML(ci, i, k)).join('')}</div>`;
    });
    const next = chapters[ci + 1];
    html += `<div class="cv-end">${next ? `<p>Siguiente: ${esc(next.n)} · ${esc(next.title)} (≈ ${next.min} min)</p><button class="btn primary big" type="button" data-go="${next.id}">Seguir leyendo →</button>` : `<p>Fin de Estadio Cero. Gracias por leer.</p><a class="btn big" href="#/">Volver a la portada</a>`}</div></div>`;
    app.innerHTML = html;
    observe(app);
    // página visible → progreso
    const items = app.querySelectorAll('.cv-item');
    if ('IntersectionObserver' in window) {
      const vis = new IntersectionObserver((ents) => {
        ents.forEach((e) => { if (e.isIntersecting) { const p = Number(e.target.dataset.pi); cur.pi = p; markRead(ci, p); } });
      }, { rootMargin: '-45% 0px -45% 0px' });
      items.forEach((it) => vis.observe(it));
    }
    if (pi) {
      const t = app.querySelector(`.cv-item[data-pi="${pi}"]`);
      if (t) requestAnimationFrame(() => t.scrollIntoView());
    } else window.scrollTo(0, 0);
    markRead(ci, pi || 0);
  }

  // ---------- zoom ----------
  let zoomList = [], zoomAt = 0;
  function openZoom(key) {
    const [ci] = key.split('.').map(Number);
    zoomList = [];
    chapters[ci].layouts.forEach((ls, pi) => ls.forEach((_, k) => zoomList.push(`${ci}.${pi}.${k}`)));
    zoomAt = Math.max(0, zoomList.indexOf(key));
    $('#zoom').hidden = false;
    showZoom();
  }
  function showZoom() {
    const [ci, pi, k] = zoomList[zoomAt].split('.').map(Number);
    const l = chapters[ci].layouts[pi][k];
    const maxW = innerWidth - (innerWidth < NARROW ? 12 : 140), maxH = innerHeight - 40;
    const w = Math.min(maxW, (maxH * l.w) / l.h);
    const st = $('#zoomStage');
    st.innerHTML = soloHTML(ci, pi, k);
    st.firstElementChild.style.width = w + 'px';
    paint(st.firstElementChild);
    $('#zoomPrev').disabled = zoomAt === 0;
    $('#zoomNext').disabled = zoomAt === zoomList.length - 1;
  }
  function closeZoom() { $('#zoom').hidden = true; $('#zoomStage').innerHTML = ''; }

  // ---------- índice ----------
  function openDrawer() {
    const ci = location.hash.startsWith('#/') && location.hash.length > 2 ? cur.ci : -1;
    $('#drawerToc').innerHTML = chapters.map((c, i) => `<li>${chCard(c, i === ci)}</li>`).join('');
    $('#drawer').hidden = false;
    $('#drawerClose').focus();
  }
  function closeDrawer() { $('#drawer').hidden = true; }

  // ---------- rutas ----------
  function route() {
    const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    closeZoom();
    if (!parts.length) { renderHome(); return; }
    const m = parts[0] === 'cascada' ? 'cascada' : 'paginas';
    setMode(m);
    const ci = chIndex(parts[1] || chapters[0].id);
    const pi = Number(parts[2] || 0) || 0;
    if (m === 'paginas') renderPaged(ci, pi, cur.dir); else renderCascade(ci, pi);
    cur.dir = 0;
  }
  function go(chId, pi) { location.hash = `#/${mode}/${chId}/${pi || 0}`; }

  // ---------- eventos ----------
  document.addEventListener('click', (e) => {
    const t = e.target.closest('button, a, .panel, .solo');
    if (!t) { if (e.target.id === 'drawer') closeDrawer(); if (e.target.id === 'zoom') closeZoom(); return; }
    if (t.dataset.go) { closeDrawer(); go(t.dataset.go, 0); return; }
    if (t.dataset.setmode) { setMode(t.dataset.setmode); renderHome(); return; }
    if (t.hasAttribute('data-start')) { go(chapters[0].id, 0); return; }
    if (t.hasAttribute('data-continue')) { const l = store.get('ec-last', null); if (l) go(l.ch, l.p); return; }
    if (t.classList.contains('seg-btn')) {
      const onReader = location.hash.length > 2;
      setMode(t.dataset.mode);
      if (onReader) location.hash = `#/${mode}/${chapters[cur.ci].id}/${cur.pi}`; else renderHome();
      return;
    }
    if (t.id === 'btnChapters') { openDrawer(); return; }
    if (t.id === 'drawerClose') { closeDrawer(); return; }
    if (t.id === 'zoomClose') { closeZoom(); return; }
    if (t.id === 'zoomPrev') { if (zoomAt > 0) { zoomAt--; showZoom(); } return; }
    if (t.id === 'zoomNext') { if (zoomAt < zoomList.length - 1) { zoomAt++; showZoom(); } return; }
    if (t.classList.contains('pv-nav')) { step(t.classList.contains('next') ? 1 : -1); return; }
    if ((t.classList.contains('panel') || t.classList.contains('solo')) && !t.closest('#zoom') && t.dataset.key) openZoom(t.dataset.key);
  });
  document.addEventListener('keydown', (e) => {
    if (!$('#zoom').hidden) {
      if (e.key === 'Escape') closeZoom();
      if (e.key === 'ArrowRight' && zoomAt < zoomList.length - 1) { zoomAt++; showZoom(); }
      if (e.key === 'ArrowLeft' && zoomAt > 0) { zoomAt--; showZoom(); }
      return;
    }
    if (!$('#drawer').hidden) { if (e.key === 'Escape') closeDrawer(); return; }
    if (!$('.pv')) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); step(1); }
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); step(-1); }
  });
  let tx = null, ty = null;
  document.addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
  document.addEventListener('touchend', (e) => {
    if (tx == null) return;
    const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
    tx = null;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.3) return;
    if (!$('#zoom').hidden) { if (dx < 0 && zoomAt < zoomList.length - 1) { zoomAt++; showZoom(); } else if (dx > 0 && zoomAt > 0) { zoomAt--; showZoom(); } return; }
    if ($('.pv')) step(dx < 0 ? 1 : -1);
  }, { passive: true });
  let rt;
  addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => {
      if ($('.pv')) fitPage();
      fitBubbles(document);
      if ($('.cv') && cvNarrow !== (innerWidth < NARROW)) renderCascade(cur.ci, cur.pi);
      if (!$('#zoom').hidden) showZoom();
    }, 150);
  });
  addEventListener('hashchange', route);

  setMode(mode);
  route();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => fitBubbles(document));
})();
