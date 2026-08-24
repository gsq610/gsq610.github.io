const root = document.documentElement;
const tabs = [...document.querySelectorAll('.tab-button')];
const panels = [...document.querySelectorAll('.tab-panel')];
const tabIndicator = document.querySelector('.tab-indicator');
const workspaceLabel = document.querySelector('#workspace-label');
const themeToggle = document.querySelector('.theme-toggle');
const pointerGlow = document.querySelector('.pointer-glow');
const progressBar = document.querySelector('.scroll-progress span');

const TOPICS = {
  unlearning: {
    number: '01 / 04',
    index: '01',
    title: 'Machine Unlearning',
    short: 'Targeted forgetting with explicit control over retained utility and risk.',
    description: 'I study how to remove targeted information or behaviour from trained models without retraining from scratch, while preserving unrelated capabilities.',
    meta: 'CORE DIRECTION',
    metrics: [['Question A', 'Did the target disappear?'], ['Question B', 'Did utility survive?'], ['Question C', 'Does it hold under shift?']]
  },
  agent: {
    number: '02 / 04',
    index: '02',
    title: 'LLM & Agent Safety',
    short: 'Studying harmful behaviour across model, tool-selection, and execution layers.',
    description: 'I evaluate harmful behaviour in tool-using agents across planning, target-tool proposals, substitution pathways, execution, leakage, and final task outcomes.',
    meta: 'AGENTIC SYSTEMS',
    metrics: [['Model', 'What does it propose?'], ['Control', 'What is allowed to execute?'], ['Outcome', 'What actually leaks or fails?']]
  },
  privacy: {
    number: '03 / 04',
    index: '03',
    title: 'Privacy-Preserving AI',
    short: 'Protecting data at training, inference, and interaction time.',
    description: 'My privacy work spans encrypted neural inference, privacy leakage in language models, and methods that remove or constrain access to sensitive information.',
    meta: 'PRIVACY',
    metrics: [['Data', 'What must stay protected?'], ['Model', 'What can be inferred?'], ['System', 'Where can leakage occur?']]
  },
  risk: {
    number: '04 / 04',
    index: '04',
    title: 'Risk & Evaluation',
    short: 'Turning safety goals into measurable criteria and decision rules.',
    description: 'I design benchmarks, metrics, and conformal-style risk controls so model safety claims can be compared against explicit, user-defined requirements.',
    meta: 'EVALUATION',
    metrics: [['Measure', 'What risk matters?'], ['Calibrate', 'How uncertain is it?'], ['Decide', 'Is the model acceptable?']]
  }
};

const PUBLICATIONS = {
  froc: {
    year: '2026', venue: 'ICAIIC · IEEE',
    title: 'FROC: A Unified Framework with Risk-Optimized Control for Machine Unlearning in LLMs',
    authors: 'Si Qi Goh, Yongsen Zheng, Ziyao Liu, Sami Hormi, Kwok-Yan Lam',
    description: 'FROC frames unlearning model selection as a risk-control problem, balancing forgetting effectiveness and retained utility under explicit acceptance criteria.',
    links: [['IEEE / DOI', 'https://doi.org/10.1109/ICAIIC68212.2026.11454224'], ['arXiv', 'https://arxiv.org/abs/2512.13337']]
  },
  safety: {
    year: '2026', venue: 'Artificial Intelligence Review',
    title: 'AI Safety Landscape for Large Language Models: Taxonomy, State-of-the-Art, and Future Directions',
    authors: 'Chen Chen, Xueluan Gong, Ziyao Liu, Weifeng Jiang, Si Qi Goh, Kwok-Yan Lam',
    description: 'A broad taxonomy and survey of LLM safety, covering trustworthy AI, responsible AI, technical attacks and mitigations, and ecosystem-level concerns.',
    links: [['Springer / DOI', 'https://doi.org/10.1007/s10462-026-11590-x']]
  },
  fhe: {
    year: '2024', venue: 'IEEE TDSC',
    title: 'Efficient FHE-Based Privacy-Enhanced Neural Network for Trustworthy AI-as-a-Service',
    authors: 'Kwok-Yan Lam, Xianhui Lu, Linru Zhang, Xiangning Wang, Huaxiong Wang, Si Qi Goh',
    description: 'Privacy-enhanced neural inference using practical fully homomorphic encryption for encrypted AI-as-a-Service workflows.',
    links: [['IEEE / DOI', 'https://doi.org/10.1109/TDSC.2024.3353536']]
  },
  timeseries: {
    year: '2025–26', venue: 'Survey / Preprint',
    title: 'From Prompts to Agents: A Comprehensive Survey of LLM-Driven Time Series Analysis',
    authors: 'Regina Zhang*, Si Qi Goh*, Xingsheng Chen*, et al.',
    description: 'A survey of more than 150 studies tracing the transition from prompt-based time-series analysis toward autonomous agentic workflows.',
    links: [['SSRN', 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6614598'], ['Project', 'https://github.com/CoderPowerBeyond/Agent-Prompt-TS-Survey']]
  }
};

function setTopic(key) {
  const topic = TOPICS[key];
  if (!topic) return;
  document.querySelectorAll('.orbit-node').forEach((node) => node.classList.toggle('is-selected', node.dataset.topic === key));
  document.querySelectorAll('.research-menu-item').forEach((item) => item.classList.toggle('is-active', item.dataset.research === key));
  document.querySelector('#topic-number').textContent = topic.number;
  document.querySelector('#topic-title').textContent = topic.title;
  document.querySelector('#topic-copy').textContent = topic.short;
  document.querySelector('#focus-index').textContent = topic.index;
  document.querySelector('#focus-meta').textContent = topic.meta;
  document.querySelector('#focus-title').textContent = topic.title;
  document.querySelector('#focus-description').textContent = topic.description;
  document.querySelector('#focus-metrics').innerHTML = topic.metrics.map(([label, value]) => `<div><small>${label}</small><strong>${value}</strong></div>`).join('');
}

document.querySelectorAll('.orbit-node').forEach((button) => button.addEventListener('click', () => setTopic(button.dataset.topic)));
document.querySelectorAll('.research-menu-item').forEach((button) => button.addEventListener('click', () => setTopic(button.dataset.research)));

function positionTabIndicator(activeTab) {
  if (!activeTab || !tabIndicator) return;
  tabIndicator.style.left = `${activeTab.offsetLeft}px`;
  tabIndicator.style.width = `${activeTab.offsetWidth}px`;
}

function activateTab(name, updateHash = true, scroll = false) {
  const target = panels.find((panel) => panel.id === name) || panels[0];
  const activeTab = tabs.find((tab) => tab.dataset.tab === target.id);

  tabs.forEach((tab) => {
    const active = tab === activeTab;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });

  panels.forEach((panel) => {
    const active = panel === target;
    panel.classList.toggle('is-active', active);
    panel.hidden = !active;
  });

  positionTabIndicator(activeTab);
  workspaceLabel.textContent = target.id[0].toUpperCase() + target.id.slice(1);
  document.title = `Si Qi Goh · ${workspaceLabel.textContent}`;

  if (updateHash && window.location.hash !== `#${target.id}`) history.replaceState(null, '', `#${target.id}`);
  if (scroll) document.querySelector('.workspace').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateTab(tab.dataset.tab, true, true));
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    tabs[next].focus();
    activateTab(tabs[next].dataset.tab);
  });
});

window.addEventListener('hashchange', () => activateTab(window.location.hash.slice(1), false));
window.addEventListener('resize', () => positionTabIndicator(document.querySelector('.tab-button.is-active')));

document.querySelectorAll('[data-jump]').forEach((button) => button.addEventListener('click', () => activateTab(button.dataset.jump, true, true)));

const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const storedTheme = localStorage.getItem('theme');
root.dataset.theme = storedTheme || (systemDark ? 'dark' : 'light');
function updateThemeIcon() { document.querySelector('.theme-icon').textContent = root.dataset.theme === 'dark' ? '☼' : '◐'; }
updateThemeIcon();
themeToggle.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', root.dataset.theme);
  updateThemeIcon();
});

const searchInput = document.querySelector('#publication-search');
const pubCards = [...document.querySelectorAll('.publication-card')];
let pubFilter = 'all';
function filterPublications() {
  const q = searchInput.value.trim().toLowerCase();
  let visible = 0;
  pubCards.forEach((card) => {
    const categoryMatch = pubFilter === 'all' || card.dataset.category === pubFilter;
    const textMatch = !q || card.dataset.title.toLowerCase().includes(q) || card.textContent.toLowerCase().includes(q);
    const show = categoryMatch && textMatch;
    card.classList.toggle('is-hidden-by-filter', !show);
    if (show) visible += 1;
  });
  document.querySelector('#publication-empty').hidden = visible !== 0;
}
searchInput.addEventListener('input', filterPublications);
document.querySelectorAll('[data-pub-filter]').forEach((button) => button.addEventListener('click', () => {
  pubFilter = button.dataset.pubFilter;
  document.querySelectorAll('[data-pub-filter]').forEach((b) => b.classList.toggle('is-active', b === button));
  filterPublications();
}));

const dialog = document.querySelector('#publication-dialog');
const dialogClose = document.querySelector('.dialog-close');
function openPublication(key) {
  const pub = PUBLICATIONS[key];
  if (!pub) return;
  document.querySelector('#dialog-year').textContent = pub.year;
  document.querySelector('#dialog-venue').textContent = pub.venue;
  document.querySelector('#dialog-title').textContent = pub.title;
  document.querySelector('#dialog-authors').textContent = pub.authors;
  document.querySelector('#dialog-description').textContent = pub.description;
  document.querySelector('#dialog-links').innerHTML = pub.links.map(([label, url]) => `<a href="${url}" target="_blank" rel="noreferrer">${label} ↗</a>`).join('');
  if (typeof dialog.showModal === 'function') dialog.showModal();
}
document.querySelectorAll('.pub-open').forEach((button) => button.addEventListener('click', () => openPublication(button.dataset.publication)));
dialogClose.addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  const rect = dialog.getBoundingClientRect();
  const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
  if (!inside) dialog.close();
});

document.querySelectorAll('.experience-toggle').forEach((toggle) => toggle.addEventListener('click', () => {
  const item = toggle.closest('.experience-item');
  const details = item.querySelector('.experience-details');
  const isOpen = item.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', String(isOpen));
  toggle.querySelector('b').textContent = isOpen ? '−' : '+';
  details.hidden = !isOpen;
}));

let eventFilter = 'all';
const eventCards = [...document.querySelectorAll('.engagement-card')];
function filterEvents() {
  let visible = 0;
  eventCards.forEach((card) => {
    const show = eventFilter === 'all' || card.dataset.event === eventFilter;
    card.classList.toggle('is-hidden-by-filter', !show);
    if (show) visible += 1;
  });
  document.querySelector('#event-count').textContent = `${visible} engagement${visible === 1 ? '' : 's'}`;
}
document.querySelectorAll('[data-event-filter]').forEach((button) => button.addEventListener('click', () => {
  eventFilter = button.dataset.eventFilter;
  document.querySelectorAll('[data-event-filter]').forEach((b) => b.classList.toggle('is-active', b === button));
  filterEvents();
}));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

window.addEventListener('scroll', () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
}, { passive: true });

if (window.matchMedia('(pointer:fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.addEventListener('pointermove', (event) => {
    pointerGlow.style.left = `${event.clientX}px`;
    pointerGlow.style.top = `${event.clientY}px`;
  }, { passive: true });

  const tiltCards = document.querySelectorAll('.publication-card, .engagement-card');
  tiltCards.forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      card.style.transform = `perspective(900px) rotateX(${(-y * 3).toFixed(2)}deg) rotateY(${(x * 3).toFixed(2)}deg) translateY(-4px)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });
}

document.querySelector('#year').textContent = new Date().getFullYear();
activateTab(window.location.hash.slice(1) || 'research', false);
setTimeout(() => positionTabIndicator(document.querySelector('.tab-button.is-active')), 0);
