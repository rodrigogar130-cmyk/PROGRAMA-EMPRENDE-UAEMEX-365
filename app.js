// ═══════════════════════════════════════════
//   EMPRENDE UAEMEX 365 — Lógica principal
//   Dirección de Desarrollo Empresarial · UAEMéx
// ═══════════════════════════════════════════

// ── NAVIGATION ──
  const navItems = document.querySelectorAll('.nav-item[data-section], .btn[data-section]');
  const sections = document.querySelectorAll('.section');

  function goTo(id) {
    sections.forEach(s => s.classList.remove('active'));
    const target = document.getElementById(id);
    if (target) { target.classList.add('active'); window.scrollTo(0,0); }
    document.querySelectorAll('.nav-item').forEach(n => {
      n.classList.toggle('active', n.dataset.section === id);
    });
    if (window.innerWidth <= 900) {
      document.getElementById('sidebar').classList.remove('open');
    }
    // Re-trigger reveals for new section
    setTimeout(() => {
      target.querySelectorAll('.reveal').forEach(el => {
        el.classList.remove('visible');
        observer.observe(el);
      });
    }, 50);
  }

  navItems.forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      goTo(item.dataset.section);
    });
  });

  // ── HAMBURGER ──
  document.getElementById('ham').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });

  // ── MANUAL TABS ──
  document.querySelectorAll('.m-nav-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.m-nav-item').forEach(m => m.classList.remove('active'));
      item.classList.add('active');
      const tab = item.dataset.tab;
      document.querySelectorAll('.manual-content > div').forEach(d => d.classList.remove('active'));
      document.getElementById('tab-' + tab).classList.add('active');
    });
  });

  // ── SCROLL REVEAL ──
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));