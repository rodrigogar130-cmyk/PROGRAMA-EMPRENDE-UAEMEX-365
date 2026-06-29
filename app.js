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
const homeSidebarGroup = document.querySelector('[data-home-sidebar-group]');
const homeSidebarToggle = document.querySelector('[data-home-sidebar-toggle]');
const homeSubnav = document.getElementById('home-subnav');
const homeSidebarChevron = document.querySelector('[data-home-sidebar-chevron]');

// ── SELECTOR DE TEMAS ──
const themeButtons = document.querySelectorAll('[data-apply-theme]');
const themeOptions = document.querySelectorAll('[data-theme-option]');
const themeStatus = document.getElementById('themeStatus');

function getStoredTheme() {
  try {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'actual' || savedTheme === 'institucional' ? savedTheme : 'institucional';
  } catch (error) {
    return 'institucional';
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
    themeStatus.textContent = `Tema activo: ${selectedTheme === 'institucional' ? 'Institucional UAEMéx' : 'Innovador'}`;
  }
}

themeButtons.forEach(button => {
  button.addEventListener('click', () => setTheme(button.dataset.applyTheme));
});

setTheme(getStoredTheme(), false);

// ── MENÚ LATERAL ACORDEÓN ──
function setHomeSidebarState(open) {
  if (!homeSidebarGroup || !homeSidebarToggle || !homeSubnav) return;

  homeSidebarGroup.classList.toggle('home-sidebar-open', open);
  homeSidebarToggle.setAttribute('aria-expanded', String(open));
  homeSubnav.hidden = !open;

  if (homeSidebarChevron) {
    homeSidebarChevron.textContent = open ? '▾' : '▸';
  }
}

function setNavGroupState(group, open) {
  const toggle = group.querySelector('.nav-group-toggle');
  const content = group.querySelector('.nav-group-content');
  const chevron = group.querySelector('.nav-chevron');

  group.classList.toggle('nav-group-open', open);
  toggle.setAttribute('aria-expanded', String(open));
  content.hidden = !open;
  chevron.textContent = open ? '▾' : '▸';
}

function closeOtherNavGroups(activeGroup = null) {
  navGroups.forEach(group => {
    if (group !== activeGroup) setNavGroupState(group, false);
  });

  if (activeGroup !== homeSidebarGroup) {
    setHomeSidebarState(false);
  }
}

function openGroupForSection(sectionId) {
  if (sectionId === 'home') {
    closeOtherNavGroups(homeSidebarGroup);
    return;
  }

  let activeGroup = null;

  navGroups.forEach(group => {
    const containsSection = Array.from(group.querySelectorAll('.nav-item[data-section]'))
      .some(item => item.dataset.section === sectionId);
    group.classList.toggle('has-active', containsSection);
    if (containsSection) activeGroup = group;
  });

  if (activeGroup) {
    closeOtherNavGroups(activeGroup);
    setNavGroupState(activeGroup, true);
  } else {
    closeOtherNavGroups();
  }
}

navGroupToggles.forEach(toggle => {
  toggle.addEventListener('click', () => {
    const group = toggle.closest('[data-nav-group]');
    const willOpen = toggle.getAttribute('aria-expanded') !== 'true';
    closeOtherNavGroups(group);
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
      n.classList.toggle('active', n.dataset.section === id && !n.dataset.homeTab);
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
      const togglesHomeSidebar = item.hasAttribute('data-home-sidebar-toggle');
      const willOpenHomeSidebar = togglesHomeSidebar
        ? !homeSidebarGroup?.classList.contains('home-sidebar-open')
        : false;

      goTo(item.dataset.section);
      if (togglesHomeSidebar) {
        setHomeSidebarState(willOpenHomeSidebar);
      }
      if (item.dataset.section === 'home' && !item.dataset.homeTab && !item.dataset.homeTabLink) {
        setHomeTab('vision');
      }
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
  // HOME INTERNAL TABS
  const homeTabButtons = document.querySelectorAll('[data-home-tab]');
  const homeTabPanels = document.querySelectorAll('[data-home-panel]');

  function setHomeTab(tabId, shouldScroll = false) {
    if (!tabId) return;

    homeTabButtons.forEach(button => {
      const isActive = button.dataset.homeTab === tabId;
      button.classList.toggle('active', isActive);
      if (button.hasAttribute('aria-selected')) {
        button.setAttribute('aria-selected', String(isActive));
      }
    });

    homeTabPanels.forEach(panel => {
      const isActive = panel.dataset.homePanel === tabId;
      panel.classList.toggle('active', isActive);
      panel.hidden = !isActive;
    });

    if (shouldScroll) {
      document.querySelector('.home-route-tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  homeTabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const isSidebarSubitem = button.classList.contains('home-subitem');
      if (isSidebarSubitem) {
        setHomeSidebarState(true);
      }
      setHomeTab(button.dataset.homeTab, isSidebarSubitem);
    });
  });

  document.querySelectorAll('[data-home-tab-link]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      setHomeTab(link.dataset.homeTabLink, true);
    });
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ── VISOR DE FOMENTO EMPRESARIAL ──
// VISOR COMPARATIVO DE INICIO
const problemCarouselItems = [
  {
    title: 'Modelo anterior de participación',
    src: 'imgenes/modelo-anterior.png',
    alt: 'Modelo anterior de participación'
  },
  {
    title: 'Nueva ruta de canalización de participantes',
    src: 'imgenes/nueva-ruta.png',
    alt: 'Nueva ruta de canalización de participantes'
  }
];
const problemCarouselModal = document.getElementById('problemCarouselModal');
const problemCarouselImage = document.getElementById('problemCarouselImage');
const problemCarouselTitle = document.getElementById('problemCarouselTitle');
const problemCarouselCount = document.getElementById('problemCarouselCount');
const closeProblemCarousel = document.getElementById('closeProblemCarousel');
const problemCarouselPrev = document.getElementById('problemCarouselPrev');
const problemCarouselNext = document.getElementById('problemCarouselNext');
const problemImageTriggers = document.querySelectorAll('[data-problem-image]');
let problemCarouselIndex = 0;
let problemCarouselPreviousFocus = null;

function renderProblemCarousel(index) {
  const nextIndex = (index + problemCarouselItems.length) % problemCarouselItems.length;
  const item = problemCarouselItems[nextIndex];
  if (!item || !problemCarouselImage || !problemCarouselTitle || !problemCarouselCount) return;

  problemCarouselIndex = nextIndex;
  problemCarouselImage.src = item.src;
  problemCarouselImage.alt = item.alt;
  problemCarouselTitle.textContent = item.title;
  problemCarouselCount.textContent = `${nextIndex + 1} de ${problemCarouselItems.length}`;
}

function openProblemCarousel(index, trigger) {
  if (!problemCarouselModal) return;
  problemCarouselPreviousFocus = trigger;
  renderProblemCarousel(index);
  problemCarouselModal.classList.add('open');
  problemCarouselModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  closeProblemCarousel?.focus();
}

function closeProblemCarouselModal() {
  if (!problemCarouselModal?.classList.contains('open')) return;
  problemCarouselModal.classList.remove('open');
  problemCarouselModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  if (problemCarouselPreviousFocus?.isConnected) problemCarouselPreviousFocus.focus();
}

problemImageTriggers.forEach(trigger => {
  trigger.addEventListener('click', () => openProblemCarousel(Number(trigger.dataset.problemImage), trigger));
});

closeProblemCarousel?.addEventListener('click', closeProblemCarouselModal);
problemCarouselPrev?.addEventListener('click', () => renderProblemCarousel(problemCarouselIndex - 1));
problemCarouselNext?.addEventListener('click', () => renderProblemCarousel(problemCarouselIndex + 1));

problemCarouselModal?.addEventListener('click', event => {
  if (event.target === problemCarouselModal) closeProblemCarouselModal();
});

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  closeProblemCarouselModal();
});

const fomentoDetailDialog = document.getElementById('fomentoDetailDialog');
const fomentoDetailBody = document.getElementById('fomentoDetailBody');
const fomentoDetailTitle = document.getElementById('fomentoDetailTitle');
const fomentoDetailProgress = document.getElementById('fomentoDetailProgress');
const fomentoDetailClose = document.getElementById('fomentoDetailClose');
const fomentoDetailPrev = document.getElementById('fomentoDetailPrev');
const fomentoDetailNext = document.getElementById('fomentoDetailNext');
const fomentoPanelButtons = Array.from(document.querySelectorAll('[data-fm-panel]'));
const fomentoPanelTemplates = Array.from(document.querySelectorAll('[data-fm-content]'));
let fomentoDetailIndex = 0;
let fomentoDetailPreviousFocus = null;

function renderFomentoDetail(index) {
  const template = fomentoPanelTemplates[index];
  if (!template || !fomentoDetailBody) return;

  fomentoDetailIndex = index;
  fomentoDetailTitle.textContent = template.dataset.title;
  fomentoDetailProgress.textContent = `Sección ${index + 1} de ${fomentoPanelTemplates.length}`;
  fomentoDetailBody.replaceChildren(template.content.cloneNode(true));
  fomentoDetailBody.scrollTop = 0;
  fomentoDetailPrev.disabled = index === 0;
  fomentoDetailNext.disabled = index === fomentoPanelTemplates.length - 1;

  fomentoPanelButtons.forEach(button => {
    button.classList.toggle('is-active', button.dataset.fmPanel === template.dataset.fmContent);
  });
}

function openFomentoDetail(panelId, trigger) {
  if (!fomentoDetailDialog) return;
  const index = fomentoPanelTemplates.findIndex(template => template.dataset.fmContent === panelId);
  if (index < 0) return;

  fomentoDetailPreviousFocus = trigger;
  renderFomentoDetail(index);
  if (!fomentoDetailDialog.open) fomentoDetailDialog.showModal();
  document.body.classList.add('modal-open');
}

function closeFomentoDetail() {
  if (fomentoDetailDialog?.open) fomentoDetailDialog.close();
}

fomentoPanelButtons.forEach(button => {
  button.addEventListener('click', () => openFomentoDetail(button.dataset.fmPanel, button));
});

fomentoDetailClose?.addEventListener('click', closeFomentoDetail);
fomentoDetailPrev?.addEventListener('click', () => renderFomentoDetail(fomentoDetailIndex - 1));
fomentoDetailNext?.addEventListener('click', () => renderFomentoDetail(fomentoDetailIndex + 1));

fomentoDetailBody?.addEventListener('click', event => {
  const sectionLink = event.target.closest('[data-section]');
  if (!sectionLink) return;
  event.preventDefault();
  const sectionId = sectionLink.dataset.section;
  closeFomentoDetail();
  goTo(sectionId);
});

fomentoDetailDialog?.addEventListener('click', event => {
  if (event.target === fomentoDetailDialog) closeFomentoDetail();
});

fomentoDetailDialog?.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  fomentoPanelButtons.forEach(button => button.classList.remove('is-active'));
  if (fomentoDetailPreviousFocus?.isConnected) fomentoDetailPreviousFocus.focus();
});

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
