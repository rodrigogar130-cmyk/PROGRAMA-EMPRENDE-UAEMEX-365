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

  if (sectionId?.startsWith('home-')) {
    closeOtherNavGroups(homeSidebarGroup);
    setHomeSidebarState(true);
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

  function goTo(id, closeMobile = true) {
    sections.forEach(s => s.classList.remove('active'));
    const target = document.getElementById(id);
    if (target) { target.classList.add('active'); window.scrollTo(0,0); }
    document.querySelectorAll('.nav-item').forEach(n => {
      n.classList.toggle('active', n.dataset.section === id && !n.dataset.homeTab);
    });
    openGroupForSection(id);
    if (closeMobile && window.innerWidth <= 900) {
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

      goTo(item.dataset.section, !togglesHomeSidebar);
      if (togglesHomeSidebar) {
        setHomeSidebarState(willOpenHomeSidebar);
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

// ── AGENDA OPERATIVA UE 2026B ──
// Edita este arreglo para cambiar fechas, títulos, horarios, categorías o detalles.
const agendaCalendarData = [
  { start:'2026-07-06', title:'Sesión Q&A / RUE Emprende Academy 365', time:'12:00 pm', category:'coordinacion', status:'Terminado', objective:'Sesión de preguntas y respuestas con Responsables de Unidades de Emprendimiento sobre Emprende Academy 365.' },
  { start:'2026-07-07', title:'Ajustes de convocatoria Emprende UAEMéx / mejoras a plantillas y actividades de Emprende Academy 365, módulo de finanzas', category:'convocatoria', status:'Terminado', objective:'Ajustes a la convocatoria Emprende UAEMéx, mejora de plantillas y actividades de Emprende Academy 365 y revisión del módulo de finanzas.' },
  { start:'2026-07-09', title:'Junta de alineación con aliados estratégicos', time:'10:00 am', category:'coordinacion', status:'Terminado', objective:'Inspiration Days y Banco de Retos.' },
  { start:'2026-07-13', title:"Reunión con TIC's", time:'10:00 am', category:'plataforma', status:'Terminado', objective:"Reunión con el área de TIC's para hablar sobre la plataforma Emprende Academy 365. Lugar: CU." },
  { start:'2026-07-15', title:'Curso de Digitalización y RRSS', category:'formacion', status:'Terminado', objective:'Curso dirigido a emprendedores de Atlacomulco sobre digitalización y redes sociales.' },
  { start:'2026-07-16', title:'Integración DDE', time:'9:00 am a 6:00 pm', category:'institucional', status:'Terminado', objective:'Jornada de integración de la DDE en el Edificio de Educación a Distancia.' },
  { start:'2026-07-17', title:'Vacaciones', category:'vacaciones', status:'Terminado', objective:'Periodo vacacional.' },
  { start:'2026-07-20', end:'2026-07-24', title:'Vacaciones', category:'vacaciones', status:'Terminado', objective:'Periodo vacacional.' },
  { start:'2026-08-03', title:'Vacaciones', category:'vacaciones', status:'Terminado', objective:'Periodo vacacional.' },
  { start:'2026-08-04', title:'Publicación de la convocatoria Emprende UAEMéx 365', time:'Registro abierto hasta 31 de agosto', timeLabel:'Registro', category:'convocatoria', status:'En proceso', tasks:['Publicidad','Contenido','Difusión'], objective:'Apertura y difusión de la convocatoria Emprende UAEMéx 365. El registro permanecerá disponible hasta el 31 de agosto de 2026. Tareas: Publicidad, Contenido, Difusión.' },
  { start:'2026-08-07', title:'Sesión de trabajo DDE con RPE, RUE y RUII', category:'coordinacion', status:'Terminado', objective:'Sesión de coordinación en CIC Toluca, Ciudad Universitaria.' },
  { start:'2026-08-10', title:'Sesión de trabajo DDE en Ecatepec', category:'coordinacion', status:'Terminado', objective:'Sesión de trabajo con RPE, RUE y RUII en Ecatepec.' },
  { start:'2026-08-17', title:'Caravana en Temascaltepec', place:'Temascaltepec', category:'activacion', status:'En proceso', owner:'Carlos Rodrigo', objective:'Caravana en Temascaltepec. Responsable: Carlos Rodrigo.' },
  { start:'2026-08-26', title:'Inspiration Days', place:'Facultad de Ciencias de la Conducta', category:'activacion', status:'En proceso', objective:'Actividad de activación inicial para presentar experiencias emprendedoras, conectar talento universitario y motivar la participación en el programa Emprende UAEMéx 365. Lugar: Facultad de Ciencias de la Conducta.' },
  { start:'2026-08-31', title:'Cierre de registro convocatoria Emprende UAEMéx 365', time:'31 de agosto', timeLabel:'Registro hasta', category:'convocatoria', status:'En proceso', objective:'Fecha límite de registro de la convocatoria Emprende UAEMéx 365.' },
  { start:'2026-09-02', title:'Inicio de actividades Emprende Academy 365', category:'formacion', status:'En proceso', objective:'Inicio formal de actividades en la plataforma Emprende Academy 365.' },
  { start:'2026-09-09', end:'2026-09-10', title:'Hackathon con el Banco de Retos', place:'Prepa 1', category:'activacion', status:'En proceso', tasks:['Preparar materiales digitales','Preparar materiales impresos'], objective:'Actividad de integración y resolución de retos reales mediante equipos participantes del programa Emprende UAEMéx 365. Lugar: Prepa 1. Tareas: Preparar materiales digitales, Preparar materiales impresos.' },
  { start:'2026-10-15', end:'2026-10-16', title:'Festival Anual de Innovación al Emprendimiento UAEMéx de la DDE', place:'Ciudad Universitaria', category:'institucional', status:'En proceso', objective:'Evento institucional de la Dirección de Desarrollo Empresarial orientado a integrar formación, talento universitario, retos reales, vinculación, experiencias, aliados estratégicos y cultura emprendedora. Lugar: Ciudad Universitaria.' },
  { start:'2026-10-15', end:'2026-10-16', title:'Bootcamp Emprende UAEMéx 365', place:'Facultad de Ingeniería', category:'activacion', status:'En proceso', tasks:['Preparar entregables','Preparar editables'], objective:'Jornada intensiva para fortalecer proyectos, preparar entregables, validar avances y consolidar evidencias de los equipos participantes. Lugar: Facultad de Ingeniería. Tareas: Preparar entregables, Preparar editables.' }
];
const agendaMonthNotices = [
  { year:2026, month:8, title:'Aviso importante para septiembre', dateLabel:'Septiembre de 2026', compactDateLabel:'SEP 2026', time:'Encargado: Manuel Jasso', category:'formacion', status:'En proceso', owner:'Manuel Jasso', tasks:['Trabajar en el nuevo módulo 4 de Finanzas de Emprende Academy 365'], objective:'Durante septiembre se deberá avanzar en el desarrollo y preparación del nuevo módulo 4 de Finanzas para fortalecer la plataforma Emprende Academy 365. Encargado: Manuel Jasso. Tarea: Trabajar en el nuevo módulo 4 de Finanzas de Emprende Academy 365.' }
];
const agendaMonths = [
  { year:2026, month:6, name:'Julio' },
  { year:2026, month:7, name:'Agosto' },
  { year:2026, month:8, name:'Septiembre' },
  { year:2026, month:9, name:'Octubre' }
];
const agendaCategoryLabels = {
  coordinacion:'Reunión / Coordinación',
  plataforma:'Coordinación / Plataforma',
  convocatoria:'Convocatoria',
  formacion:'Formación',
  activacion:'Activación',
  institucional:'Evento institucional',
  vacaciones:'Vacaciones'
};
const agendaStatusClasses = {
  'Terminado':'status-done',
  'En proceso':'status-progress',
  'No realizado':'status-pending'
};
const agendaWeekdays = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
const agendaMonthNames = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const agendaCalendar = document.getElementById('agendaCalendar');
const agendaEventDialog = document.getElementById('agendaEventDialog');
const closeAgendaDialog = document.getElementById('closeAgendaDialog');
const agendaDialogType = document.getElementById('agendaDialogType');
const agendaDialogTitle = document.getElementById('agendaDialogTitle');
const agendaDialogMeta = agendaEventDialog?.querySelector('.agenda-dialog-meta');
const agendaDialogHeading = agendaEventDialog?.querySelector('.agenda-dialog-body h3');
const agendaDialogDate = document.getElementById('agendaDialogDate');
const agendaDialogTime = document.getElementById('agendaDialogTime');
const agendaDialogObjective = document.getElementById('agendaDialogObjective');
let agendaPreviousFocus = null;
let agendaScrollPosition = { x: 0, y: 0 };

function parseAgendaDate(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day, 12);
}

function formatAgendaDate(calendarEvent) {
  if (calendarEvent.dateLabel) return calendarEvent.dateLabel;
  const start = parseAgendaDate(calendarEvent.start);
  const end = parseAgendaDate(calendarEvent.end || calendarEvent.start);
  if (start.getTime() === end.getTime()) return `${start.getDate()} de ${agendaMonthNames[start.getMonth()]} de ${start.getFullYear()}`;
  if (start.getMonth() === end.getMonth()) return `${start.getDate()} al ${end.getDate()} de ${agendaMonthNames[start.getMonth()]} de ${start.getFullYear()}`;
  return `${start.getDate()} de ${agendaMonthNames[start.getMonth()]} al ${end.getDate()} de ${agendaMonthNames[end.getMonth()]} de ${end.getFullYear()}`;
}

function formatAgendaCompactDate(calendarEvent) {
  if (calendarEvent.compactDateLabel) return calendarEvent.compactDateLabel;
  const start = parseAgendaDate(calendarEvent.start);
  const end = parseAgendaDate(calendarEvent.end || calendarEvent.start);
  const day = date => String(date.getDate()).padStart(2, '0');
  const month = date => agendaMonthNames[date.getMonth()].slice(0, 3).toUpperCase();

  if (start.getTime() === end.getTime()) return `${day(start)} ${month(start)}`;
  if (start.getMonth() === end.getMonth()) return `${day(start)}–${day(end)} ${month(start)}`;
  return `${day(start)} ${month(start)}–${day(end)} ${month(end)}`;
}

function createAgendaElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function getAgendaSecondaryLabel(calendarEvent) {
  return calendarEvent.place || calendarEvent.time || calendarEvent.owner || agendaCategoryLabels[calendarEvent.category] || 'Actividad';
}

function captureAgendaScrollPosition() {
  agendaScrollPosition = {
    x: window.scrollX || window.pageXOffset || 0,
    y: window.scrollY || window.pageYOffset || 0
  };
}

function restoreAgendaScrollPosition() {
  window.scrollTo(agendaScrollPosition.x, agendaScrollPosition.y);
}

function focusAgendaElement(element) {
  if (!element) return;

  try {
    element.focus({ preventScroll: true });
  } catch (error) {
    element.focus();
    restoreAgendaScrollPosition();
  }
}

function handleAgendaEventClick(event, calendarEvent, trigger) {
  event.preventDefault();
  event.stopPropagation();
  openAgendaEvent(calendarEvent, trigger);
}

function setAgendaDialogMeta(calendarEvent) {
  if (!agendaDialogMeta) return;

  const metaItems = [
    formatAgendaDate(calendarEvent),
    calendarEvent.time ? `${calendarEvent.timeLabel || 'Hora'}: ${calendarEvent.time}` : 'Horario por confirmar',
    `Estado: ${calendarEvent.status || 'No realizado'}`,
    calendarEvent.place ? `Lugar: ${calendarEvent.place}` : null,
    calendarEvent.owner ? `Responsable: ${calendarEvent.owner}` : null,
    calendarEvent.tasks?.length ? `Tareas: ${calendarEvent.tasks.join(', ')}` : null
  ].filter(Boolean);

  agendaDialogMeta.replaceChildren();
  metaItems.forEach((item, index) => {
    const metaElement = index === 0 ? agendaDialogDate : (index === 1 ? agendaDialogTime : createAgendaElement('span'));
    metaElement.textContent = item;
    agendaDialogMeta.appendChild(metaElement);
  });
}

function openAgendaEvent(calendarEvent, trigger) {
  if (!agendaEventDialog) return;
  captureAgendaScrollPosition();
  agendaPreviousFocus = trigger || document.activeElement;
  agendaDialogType.textContent = `${agendaCategoryLabels[calendarEvent.category] || 'Actividad'} · ${calendarEvent.status || 'No realizado'}`;
  agendaDialogTitle.textContent = calendarEvent.title;
  setAgendaDialogMeta(calendarEvent);
  if (agendaDialogHeading) agendaDialogHeading.textContent = 'Descripción';
  agendaDialogObjective.textContent = calendarEvent.objective || 'Información por confirmar.';
  agendaEventDialog.setAttribute('aria-hidden', 'false');
  agendaEventDialog.classList.add('is-open');
  if (!agendaEventDialog.open) agendaEventDialog.showModal();
  document.body.classList.add('modal-open');
  focusAgendaElement(closeAgendaDialog);
  restoreAgendaScrollPosition();
  requestAnimationFrame(restoreAgendaScrollPosition);
}

function closeAgendaEvent() {
  if (agendaEventDialog?.open) agendaEventDialog.close();
}

function renderAgendaCalendar() {
  if (!agendaCalendar) return;
  agendaCalendar.replaceChildren();

  agendaMonths.forEach(({ year, month, name }) => {
    const monthEvents = agendaCalendarData.filter(calendarEvent => {
      const start = parseAgendaDate(calendarEvent.start);
      return start.getFullYear() === year && start.getMonth() === month;
    });
    const monthNotices = agendaMonthNotices.filter(notice => notice.year === year && notice.month === month);
    const monthBlock = createAgendaElement('article', 'academic-month');
    const monthHeader = createAgendaElement('header', 'academic-month-header');
    const monthName = createAgendaElement('h3', '', name);
    const monthYear = createAgendaElement('span', '', `${year} · ${monthEvents.length} actividades${monthNotices.length ? ` · ${monthNotices.length} aviso` : ''}`);
    monthHeader.append(monthName, monthYear);

    const noticesBlock = createAgendaElement('div', 'agenda-month-notices');
    monthNotices.forEach(notice => {
      const noticeButton = createAgendaElement('button', 'agenda-month-notice');
      noticeButton.type = 'button';
      noticeButton.dataset.category = notice.category;
      noticeButton.dataset.status = notice.status || 'No realizado';
      noticeButton.classList.add(agendaStatusClasses[noticeButton.dataset.status] || 'status-pending');
      noticeButton.setAttribute('aria-label', `Ver detalle: ${formatAgendaDate(notice)} · ${notice.title}`);

      const noticeDate = createAgendaElement('span', 'agenda-month-notice-date', formatAgendaCompactDate(notice));
      const noticeContent = createAgendaElement('span', 'agenda-month-notice-content');
      noticeContent.append(
        createAgendaElement('small', '', 'Avisos del mes'),
        createAgendaElement('strong', '', notice.title),
        createAgendaElement('span', '', notice.tasks?.[0] || notice.objective)
      );
      const noticeStatus = createAgendaElement('span', 'agenda-month-notice-status', notice.status || 'No realizado');
      noticeButton.append(noticeDate, noticeContent, noticeStatus);
      noticeButton.addEventListener('click', event => handleAgendaEventClick(event, notice, noticeButton));
      noticesBlock.appendChild(noticeButton);
    });

    const scrollArea = createAgendaElement('div', 'academic-month-scroll');
    scrollArea.tabIndex = 0;
    scrollArea.setAttribute('aria-label', `Calendario de ${name} de ${year}`);
    const calendarInner = createAgendaElement('div', 'academic-month-inner');
    const weekdayHeader = createAgendaElement('div', 'academic-weekdays');
    agendaWeekdays.forEach(day => weekdayHeader.appendChild(createAgendaElement('span', '', day)));
    calendarInner.appendChild(weekdayHeader);

    const firstDay = new Date(year, month, 1, 12);
    const mondayOffset = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0, 12).getDate();
    const totalCells = Math.ceil((mondayOffset + daysInMonth) / 7) * 7;

    for (let weekIndex = 0; weekIndex < totalCells / 7; weekIndex += 1) {
      const week = createAgendaElement('div', 'academic-week');
      const weekStart = new Date(year, month, 1 - mondayOffset + weekIndex * 7, 12);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + dayIndex);
        const dayNumber = createAgendaElement('span', 'academic-day-number', String(date.getDate()));
        dayNumber.style.gridColumn = String(dayIndex + 1);
        if (date.getMonth() !== month) dayNumber.classList.add('is-outside');
        week.appendChild(dayNumber);
      }

      const segments = monthEvents.map(calendarEvent => {
        const eventStart = parseAgendaDate(calendarEvent.start);
        const eventEnd = parseAgendaDate(calendarEvent.end || calendarEvent.start);
        if (eventEnd < weekStart || eventStart > weekEnd) return null;
        const segmentStart = eventStart > weekStart ? eventStart : weekStart;
        const segmentEnd = eventEnd < weekEnd ? eventEnd : weekEnd;
        const startColumn = Math.round((segmentStart - weekStart) / 86400000);
        const endColumn = Math.round((segmentEnd - weekStart) / 86400000);
        return { calendarEvent, startColumn, endColumn };
      }).filter(Boolean).sort((a, b) => a.startColumn - b.startColumn || b.endColumn - a.endColumn);

      const occupiedLanes = [];
      segments.forEach(segment => {
        let lane = occupiedLanes.findIndex(columns => {
          for (let column = segment.startColumn; column <= segment.endColumn; column += 1) {
            if (columns[column]) return false;
          }
          return true;
        });
        if (lane === -1) {
          lane = occupiedLanes.length;
          occupiedLanes.push(Array(7).fill(false));
        }
        for (let column = segment.startColumn; column <= segment.endColumn; column += 1) occupiedLanes[lane][column] = true;

        const eventButton = createAgendaElement('button', 'academic-event');
        eventButton.type = 'button';
        eventButton.dataset.category = segment.calendarEvent.category;
        eventButton.dataset.status = segment.calendarEvent.status || 'No realizado';
        eventButton.classList.add(agendaStatusClasses[eventButton.dataset.status] || 'status-pending');
        eventButton.style.gridColumn = `${segment.startColumn + 1} / span ${segment.endColumn - segment.startColumn + 1}`;
        eventButton.style.gridRow = String(lane + 2);
        const dateLabel = formatAgendaDate(segment.calendarEvent);
        const secondaryLabel = getAgendaSecondaryLabel(segment.calendarEvent);
        eventButton.title = `${dateLabel} · ${segment.calendarEvent.title} · ${eventButton.dataset.status} · ${secondaryLabel}`;
        eventButton.setAttribute('aria-label', `Ver detalle: ${eventButton.title}`);
        eventButton.append(
          createAgendaElement('strong', 'academic-event-title', segment.calendarEvent.title),
          createAgendaElement('small', 'academic-event-time', secondaryLabel),
          createAgendaElement('span', 'academic-event-status', eventButton.dataset.status)
        );
        eventButton.addEventListener('click', event => handleAgendaEventClick(event, segment.calendarEvent, eventButton));
        week.appendChild(eventButton);
      });
      calendarInner.appendChild(week);
    }

    scrollArea.appendChild(calendarInner);

    const mobileList = createAgendaElement('div', 'academic-mobile-list');
    mobileList.setAttribute('aria-label', `Agenda de ${name} de ${year}`);
    [...monthEvents]
      .sort((a, b) => parseAgendaDate(a.start) - parseAgendaDate(b.start))
      .forEach(calendarEvent => {
        const eventButton = createAgendaElement('button', 'academic-mobile-event');
        eventButton.type = 'button';
        eventButton.dataset.category = calendarEvent.category;
        eventButton.dataset.status = calendarEvent.status || 'No realizado';
        eventButton.classList.add(agendaStatusClasses[eventButton.dataset.status] || 'status-pending');
        eventButton.setAttribute('aria-label', `Ver detalle: ${formatAgendaDate(calendarEvent)} · ${calendarEvent.title}`);

        const dateLabel = createAgendaElement('span', 'academic-mobile-date', formatAgendaCompactDate(calendarEvent));
        const eventContent = createAgendaElement('span', 'academic-mobile-content');
        eventContent.append(
          createAgendaElement('strong', 'academic-mobile-title', calendarEvent.title),
          createAgendaElement('span', 'academic-mobile-status', `Estado: ${eventButton.dataset.status}`)
        );
        if (calendarEvent.time) {
          eventContent.appendChild(createAgendaElement('span', 'academic-mobile-time', `${calendarEvent.timeLabel || 'Hora'}: ${calendarEvent.time}`));
        }
        if (calendarEvent.place) {
          eventContent.appendChild(createAgendaElement('span', 'academic-mobile-time', `Lugar: ${calendarEvent.place}`));
        }
        if (calendarEvent.owner) {
          eventContent.appendChild(createAgendaElement('span', 'academic-mobile-time', `Responsable: ${calendarEvent.owner}`));
        }
        if (calendarEvent.tasks?.length) {
          eventContent.appendChild(createAgendaElement('span', 'academic-mobile-time', `Tareas: ${calendarEvent.tasks.join(', ')}`));
        }
        eventButton.append(dateLabel, eventContent);
        eventButton.addEventListener('click', event => handleAgendaEventClick(event, calendarEvent, eventButton));
        mobileList.appendChild(eventButton);
      });

    monthBlock.append(monthHeader);
    if (monthNotices.length) monthBlock.appendChild(noticesBlock);
    monthBlock.append(scrollArea, mobileList);
    agendaCalendar.appendChild(monthBlock);
  });
}

renderAgendaCalendar();

closeAgendaDialog?.addEventListener('click', closeAgendaEvent);
agendaEventDialog?.addEventListener('click', event => {
  if (event.target === agendaEventDialog) closeAgendaEvent();
});
agendaEventDialog?.addEventListener('close', () => {
  agendaEventDialog.setAttribute('aria-hidden', 'true');
  agendaEventDialog.classList.remove('is-open');
  document.body.classList.remove('modal-open');
  if (agendaPreviousFocus?.isConnected) focusAgendaElement(agendaPreviousFocus);
  restoreAgendaScrollPosition();
  requestAnimationFrame(restoreAgendaScrollPosition);
});

// ── ETAPAS INTERACTIVAS DEL EMBUDO INSTITUCIONAL ──
const funnelPhaseData = {
  'fase-1': {
    eyebrow: 'Primera fase',
    title: 'Fomento Empresarial',
    text: 'Identificación de talento, cultura emprendedora, concursos, capacitación inicial y generación de evidencias tempranas.'
  },
  'fase-2': {
    eyebrow: 'Segunda fase',
    title: 'Unidades de Emprendimiento',
    text: 'Activación de equipos, formación mediante Emprende UAEMéx 365, Hackathon, Bootcamp, Demo Day y desarrollo de proyectos con evidencia.'
  },
  'fase-3': {
    eyebrow: 'Tercera fase',
    title: 'Incubación de la Innovación',
    text: 'Profesionalización, modelo de negocio, alineación, escalamiento y canalización hacia salida al mercado.'
  }
};
const funnelPhaseButtons = document.querySelectorAll('#ecosistema [data-phase]');
const funnelPhaseEyebrow = document.getElementById('funnelPhaseEyebrow');
const funnelPhaseTitle = document.getElementById('funnelPhaseTitle');
const funnelPhaseText = document.getElementById('funnelPhaseText');

function activateFunnelPhase(phase) {
  const phaseData = funnelPhaseData[phase];
  if (!phaseData) return;
  funnelPhaseEyebrow.textContent = phaseData.eyebrow;
  funnelPhaseTitle.textContent = phaseData.title;
  funnelPhaseText.textContent = phaseData.text;
  funnelPhaseButtons.forEach(button => {
    const isActive = button.dataset.phase === phase;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
}

funnelPhaseButtons.forEach(button => {
  button.addEventListener('click', () => activateFunnelPhase(button.dataset.phase));
  button.addEventListener('focus', () => activateFunnelPhase(button.dataset.phase));
  if (button.classList.contains('funnel-hotspot')) {
    button.addEventListener('mouseenter', () => activateFunnelPhase(button.dataset.phase));
  }
});
activateFunnelPhase('fase-1');

// ── VISOR DEL ESQUEMA DEL EVENTO ──
const eventImageModal = document.getElementById('eventImageModal');
const eventImageTriggers = document.querySelectorAll('[data-event-image]');
const closeEventScheme = document.getElementById('closeEventScheme');
const eventImageScroll = eventImageModal?.querySelector('.event-image-scroll');
const eventModalImage = eventImageScroll?.querySelector('img');
const eventModalTitle = document.getElementById('eventImageModalTitle');
const eventModalTag = document.getElementById('eventImageModalTag');
let eventSchemePreviousFocus = null;

function abrirEsquemaEvento(trigger) {
  if (!eventImageModal) return;
  eventSchemePreviousFocus = document.activeElement;
  if (trigger && eventModalImage) {
    eventModalImage.src = trigger.dataset.eventImage;
    const sourceImageAlt = trigger.querySelector('img')?.alt || trigger.dataset.eventAlt || 'Imagen ampliada';
    eventModalImage.alt = `${sourceImageAlt} en tamaño completo`;
  }
  if (trigger?.dataset.eventTitle && eventModalTitle) {
    eventModalTitle.textContent = trigger.dataset.eventTitle;
  }
  if (eventModalTag) {
    eventModalTag.textContent = trigger?.dataset.eventTag || 'Evento Anual DDE';
  }
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

eventImageTriggers.forEach(trigger => {
  trigger.addEventListener('click', () => abrirEsquemaEvento(trigger));
});
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

const inspirationVideo = document.querySelector('[data-inspiration-video]');
if (inspirationVideo) {
  inspirationVideo.volume = 0.85;
  inspirationVideo.muted = false;
  inspirationVideo.play().catch(() => {
    inspirationVideo.muted = true;
    inspirationVideo.play().catch(() => {});
  });

  const enableInspirationAudio = () => {
    inspirationVideo.muted = false;
    inspirationVideo.volume = 0.85;
    if (!inspirationVideo.paused) {
      inspirationVideo.play().catch(() => {});
    }
    document.removeEventListener('click', enableInspirationAudio);
    document.removeEventListener('touchstart', enableInspirationAudio);
  };

  document.addEventListener('click', enableInspirationAudio);
  document.addEventListener('touchstart', enableInspirationAudio);
}

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
