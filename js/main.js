(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Pecah judul hero jadi kata-kata yang naik satu per satu
  const h1 = $('.split');
  h1.innerHTML = h1.textContent.split(' ')
    .map((w, i) => `<span class="w"><i style="--i:${i}">${w}</i></span>`).join('');

  // 2. Efek flash kamera setelah strip foto selesai jatuh
  setTimeout(() => $('#flash').classList.add('go'), reduce ? 0 : 1900);

  // 3. Navbar solid + progress bar scroll + parallax galeri
  const nav = $('#nav'), bar = $('#progress'), gs = $$('.g');
  let ticking = false;
  const onScroll = () => {
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    nav.classList.toggle('solid', y > 40);
    bar.style.width = (y / max * 100) + '%';
    if (!reduce) gs.forEach(g => {
      const r = g.getBoundingClientRect();
      const off = (r.top - innerHeight / 2) * parseFloat(g.dataset.speed);
      g.style.transform = `translateY(${off}px)`;
    });
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  // 4. Reveal saat scroll (kartu & langkah muncul bergantian)
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .2 });
  $$('.reveal').forEach(el => {
    el.style.setProperty('--d', ([...el.parentElement.children].indexOf(el)) * 120);
    io.observe(el);
  });

  // 5. Angka naik (counter)
  const co = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, to = +el.dataset.count, t0 = performance.now(), dur = 1800;
    const tick = t => {
      const p = Math.min((t - t0) / dur, 1), eased = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(to * eased).toLocaleString('id-ID');
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    co.unobserve(el);
  }), { threshold: .6 });
  $$('[data-count]').forEach(el => co.observe(el));

  if (reduce) return;

  // 6. Strip foto miring mengikuti mouse
  const wrap = $('#stripWrap'), strip = $('#strip');
  wrap.addEventListener('mousemove', e => {
    const r = wrap.getBoundingClientRect();
    strip.style.setProperty('--ry', ((e.clientX - r.left) / r.width - .5) * 24 + 'deg');
    strip.style.setProperty('--rx', ((e.clientY - r.top) / r.height - .5) * -24 + 'deg');
  });
  wrap.addEventListener('mouseleave', () => { strip.style.removeProperty('--rx'); strip.style.removeProperty('--ry'); });

  // 7. Kartu 3D tilt
  $$('.tilt').forEach(c => {
    c.addEventListener('mousemove', e => {
      const r = c.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      c.style.transform = `perspective(700px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-6px)`;
    });
    c.addEventListener('mouseleave', () => c.style.transform = '');
  });

  // 8. Tombol magnet (tertarik ke kursor)
  $$('.magnet').forEach(b => {
    b.addEventListener('mousemove', e => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px, ${(e.clientY - r.top - r.height / 2) * .35}px)`;
    });
    b.addEventListener('mouseleave', () => b.style.transform = '');
  });
})();
