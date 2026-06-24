// ═══════════════════════════════════════════
//   EMPRENDE UAEMEX 365 — Lógica principal
//   Dirección de Desarrollo Empresarial · UAEMéx
// ═══════════════════════════════════════════

// ── NAVIGATION ──
  const navItems = document.querySelectorAll('.nav-item[data-section], .btn[data-section], .sidebar-logo-link[data-section]');
  const sections = document.querySelectorAll('.section');
  const sidebar = document.getElementById('sidebar');
  const hamburger = document.getElementById('ham');
  const sidebarClose = document.getElementById('sidebarClose');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const navGroups = document.querySelectorAll('[data-nav-group]');
const navGroupToggles = document.querySelectorAll('.nav-group-toggle');

// ── SELECTOR DE TEMAS ──
const themeButtons = document.querySelectorAll('[data-apply-theme]');
const themeOptions = document.querySelectorAll('[data-theme-option]');
const themeStatus = document.getElementById('themeStatus');

function getStoredTheme() {
  try {
    return localStorage.getItem('theme') === 'institucional' ? 'institucional' : 'actual';
  } catch (error) {
    return 'actual';
  }
}

function setTheme(theme, persist = true) {
  const selectedTheme = theme === 'institucional' ? 'institucional' : 'actual';
  document.documentElement.setAttribute('data-theme', selectedTheme);

  if (persist) {
    try {
      localStorage.setItem('theme', selectedTheme);
    } catch (error) {
      // La interfaz sigue funcionando aunque el navegador bloquee el almacenamiento.
    }
  }

  themeOptions.forEach(option => {
    const isActive = option.dataset.themeOption === selectedTheme;
    option.classList.toggle('is-active', isActive);
    option.setAttribute('aria-current', isActive ? 'true' : 'false');
  });

  themeButtons.forEach(button => {
    const isActive = button.dataset.applyTheme === selectedTheme;
    button.disabled = isActive;
    button.setAttribute('aria-pressed', String(isActive));
  });

  if (themeStatus) {
    themeStatus.textContent = `Tema activo: ${selectedTheme === 'institucional' ? 'Institucional UAEMéx' : 'Tema actual'}`;
  }
}

themeButtons.forEach(button => {
  button.addEventListener('click', () => setTheme(button.dataset.applyTheme));
});

setTheme(getStoredTheme(), false);

// ── MENÚ LATERAL ACORDEÓN ──
function setNavGroupState(group, open) {
  const toggle = group.querySelector('.nav-group-toggle');
  const content = group.querySelector('.nav-group-content');
  const chevron = group.querySelector('.nav-chevron');

  group.classList.toggle('nav-group-open', open);
  toggle.setAttribute('aria-expanded', String(open));
  content.hidden = !open;
  chevron.textContent = open ? '▾' : '▸';
}

function openGroupForSection(sectionId) {
  let activeGroup = null;

  navGroups.forEach(group => {
    const containsSection = Array.from(group.querySelectorAll('.nav-item[data-section]'))
      .some(item => item.dataset.section === sectionId);
    group.classList.toggle('has-active', containsSection);
    if (containsSection) activeGroup = group;
  });

  if (activeGroup) {
    setNavGroupState(activeGroup, true);
  } else {
    navGroups.forEach(group => setNavGroupState(group, false));
  }
}

navGroupToggles.forEach(toggle => {
  toggle.addEventListener('click', () => {
    const group = toggle.closest('[data-nav-group]');
    const willOpen = toggle.getAttribute('aria-expanded') !== 'true';
    setNavGroupState(group, willOpen);
  });
});

openGroupForSection(document.querySelector('.section.active')?.id);

  function setMobileMenu(open) {
    sidebar.classList.toggle('open', open);
    sidebarOverlay.classList.toggle('active', open);
    sidebarOverlay.setAttribute('aria-hidden', String(!open));
    hamburger.setAttribute('aria-expanded', String(open));
    hamburger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.body.classList.toggle('sidebar-open', open);
  }

  function goTo(id) {
    sections.forEach(s => s.classList.remove('active'));
    const target = document.getElementById(id);
    if (target) { target.classList.add('active'); window.scrollTo(0,0); }
    document.querySelectorAll('.nav-item').forEach(n => {
      n.classList.toggle('active', n.dataset.section === id);
    });
    openGroupForSection(id);
    if (window.innerWidth <= 900) {
      setMobileMenu(false);
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
  hamburger.addEventListener('click', () => {
    setMobileMenu(!sidebar.classList.contains('open'));
  });
  sidebarClose.addEventListener('click', () => setMobileMenu(false));
  sidebarOverlay.addEventListener('click', () => setMobileMenu(false));

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900 && sidebar.classList.contains('open')) setMobileMenu(false);
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

// ── VISOR DEL ESQUEMA DEL EVENTO ──
const eventImageModal = document.getElementById('eventImageModal');
const openEventScheme = document.getElementById('openEventScheme');
const closeEventScheme = document.getElementById('closeEventScheme');
const eventImageScroll = eventImageModal?.querySelector('.event-image-scroll');
let eventSchemePreviousFocus = null;

function abrirEsquemaEvento() {
  if (!eventImageModal) return;
  eventSchemePreviousFocus = document.activeElement;
  eventImageModal.classList.add('open');
  eventImageModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  if (eventImageScroll) {
    eventImageScroll.scrollTop = 0;
    eventImageScroll.scrollLeft = 0;
  }
  closeEventScheme?.focus();
}

function cerrarEsquemaEvento() {
  if (!eventImageModal || !eventImageModal.classList.contains('open')) return;
  eventImageModal.classList.remove('open');
  eventImageModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  eventSchemePreviousFocus?.focus();
}

openEventScheme?.addEventListener('click', abrirEsquemaEvento);
closeEventScheme?.addEventListener('click', cerrarEsquemaEvento);

eventImageModal?.addEventListener('click', event => {
  if (event.target === eventImageModal) cerrarEsquemaEvento();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') cerrarEsquemaEvento();
});

// accion abrir y cerrar PDf
function abrirPDF(rutaPDF) {
    const pdfModal = document.getElementById('pdfModal');
    document.getElementById('pdfViewer').src = rutaPDF;
    document.getElementById('pdfMobileLink').href = rutaPDF;
    pdfModal.style.display = 'flex';
    pdfModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
}

function cerrarPDF() {
    const pdfModal = document.getElementById('pdfModal');
    pdfModal.style.display = 'none';
    pdfModal.setAttribute('aria-hidden', 'true');
    document.getElementById('pdfViewer').src = '';
    document.getElementById('pdfMobileLink').href = '#';
    document.body.classList.remove('modal-open');
}

document.getElementById('pdfModal')?.addEventListener('click', event => {
  if (event.target.id === 'pdfModal') cerrarPDF();
});

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  if (sidebar.classList.contains('open')) setMobileMenu(false);
  if (document.getElementById('pdfModal')?.style.display === 'flex') cerrarPDF();
});
// accion abrir y cerrar video
function abrirVideo(url) {
  const modal = document.getElementById("videoModal");
  const video = document.getElementById("videoPlayer");

  video.src = url;
  modal.style.display = "block";
  video.load();
  video.play();
}

function cerrarVideo() {
  const modal = document.getElementById("videoModal");
  const video = document.getElementById("videoPlayer");

  video.pause();
  video.src = "";
  modal.style.display = "none";
}
