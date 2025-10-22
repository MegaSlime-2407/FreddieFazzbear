document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- ACCORDION ---------------- */
  document.querySelectorAll('.accordion .accordion-item').forEach(item => {
    const btn = item.querySelector('.accordion-button');
    const panel = item.querySelector('.accordion-panel');
    if (!btn || !panel) return;

    btn.setAttribute('aria-expanded', 'false');
    panel.style.overflow = 'hidden';
    panel.style.maxHeight = '0px';

    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      if (expanded) {
        item.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        panel.style.maxHeight = '0px';
      } else {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  /* ---------------- MODAL ---------------- */
  const triggers = document.querySelectorAll('[data-modal]');
  triggers.forEach(trigger => {
    const modal = document.querySelector(trigger.dataset.modal);
    if (!modal) return;

    const closeBtn = modal.querySelector('.modal-close');

    trigger.addEventListener('click', e => {
      e.preventDefault();
      modal.hidden = false;
    });

    closeBtn?.addEventListener('click', () => modal.hidden = true);
    modal.addEventListener('click', e => { if (e.target === modal) modal.hidden = true; });
  });

  /* ---------------- FORM VALIDATION ---------------- */
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;

      form.querySelectorAll('input[required], textarea[required]').forEach(field => {
        if (!field.value.trim()) {
          valid = false;
          field.nextElementSibling.textContent = 'This field is required';
        } else {
          field.nextElementSibling.textContent = '';
        }

        if (field.type === 'email' && field.value) {
          const re = /\S+@\S+\.\S+/;
          if (!re.test(field.value)) {
            valid = false;
            field.nextElementSibling.textContent = 'Invalid email';
          }
        }
      });

      if (valid) {
        form.reset();
        alert('Form submitted successfully (demo)');
      }
    });
  });



/* ---------------- JS ADVANCED TASKS ---------------- */

  /* ===========================
   THEMED IMPLEMENTATION FOR SITE
   Insert inside DOMContentLoaded
   =========================== */

/* ---------------- SOUND: reliable playSound + fallback WebAudio ---------------- */
const SOUND_PATHS = {
  notify: 'https://www.soundjay.com/buttons/sounds/button-3.mp3', // example — поменяй на свой URL или путь
  error:  './assets/sounds/error.mp3',
  hover:  './assets/sounds/hover.mp3' // optional
};

const audioCache = {};
let audioCtx = null;

function tryHtmlAudio(name) {
  return new Promise((resolve, reject) => {
    const path = SOUND_PATHS[name];
    if (!path) return reject(new Error('no-path'));
    try {
      if (!audioCache[name]) {
        const a = new Audio(path);
        a.preload = 'auto';
        audioCache[name] = a;
      }
      const au = audioCache[name];
      au.currentTime = 0;
      const p = au.play();
      if (p && typeof p.then === 'function') {
        p.then(() => resolve('html-audio')).catch(err => reject(err));
      } else {
        resolve('html-audio');
      }
    } catch (err) {
      reject(err);
    }
  });
}

function webAudioBeep({ frequency = 880, duration = 0.12, gain = 0.06 } = {}) {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const ctx = audioCtx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = frequency;
    g.gain.setValueAtTime(gain, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
    return true;
  } catch (e) {
    return false;
  }
}

function playSound(name = 'notify') {
  tryHtmlAudio(name).catch(() => {
    webAudioBeep();
  });
}

// resume audio context on first gesture (graceful)
const resumeOnGesture = () => {
  try {
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  } catch (e) {}
  window.removeEventListener('click', resumeOnGesture);
  window.removeEventListener('keydown', resumeOnGesture);
  window.removeEventListener('touchstart', resumeOnGesture);
};
window.addEventListener('click', resumeOnGesture);
window.addEventListener('keydown', resumeOnGesture);
window.addEventListener('touchstart', resumeOnGesture);

/* ---------------- THEMED IMPLEMENTATION (company/services/etc) ---------------- */

// Company object (Objects & Methods)
const company = {
  name: 'My Tasty App',
  founded: 2017,
  locations: 12,
  mission: 'Tasty food, happy people',
  specialties: ['Pizza', 'Salads', 'Desserts', 'Fast Delivery'],
  facts() {
    return [
      { k: 'Founded', v: this.founded },
      { k: 'Locations', v: `${this.locations} stores around the city` },
      { k: 'Mission', v: this.mission }
    ];
  },
  renderQuickFacts(selector = '.info-card') {
    const root = document.querySelector(selector);
    if (!root) return;
    const title = `<h3 class="small-title">Quick facts</h3>`;
    const htmlFacts = this.facts().map(f => `<p class="muted small"><strong>${f.k}:</strong> ${f.v}</p>`).join('');
    root.innerHTML = `${title}${htmlFacts}<div class="mt-3"><a href="contacts.html" class="btn btn-outline" style="display:inline-block;width:100%;">Contact us</a></div>`;
  }
};
// Render (keeps demo block intact because demo sits after .info-card)
company.renderQuickFacts('.info-card');

// Services: render into .grid-3
const services = [
  { id: 's1', title: 'Fast Delivery', desc: 'Under 30 minutes', tag: 'delivery', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=200&fit=crop' },
  { id: 's2', title: 'Quality Ingredients', desc: 'Local suppliers', tag: 'quality', img: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400&h=200&fit=crop' },
  { id: 's3', title: '24/7 Support', desc: 'Always here for you', tag: 'support', img: 'https://images.unsplash.com/photo-1574126154517-d1e0d89ef734?w=400&h=200&fit=crop' }
];

function renderServicesGrid(selector = '.grid-3') {
  const grid = document.querySelector(selector);
  if (!grid) return;
  // keep existing cards only if they are non-empty; but replace to keep consistent demo
  grid.innerHTML = '';
  services.forEach(s => {
    const card = document.createElement('div');
    card.className = 'card service-card';
    card.innerHTML = `
      <img src="${s.img}" alt="${s.title}" loading="lazy">
      <h3>${s.title}</h3>
      <p class="muted small">${s.desc}</p>
      <div class="mt-3"><a href="#" class="btn btn-outline">Learn More</a></div>
    `;
    grid.appendChild(card);
  });
}
renderServicesGrid('.grid-3');

// Available now (HOF filter/map)
const availableNowEl = document.createElement('div');
availableNowEl.className = 'card mt-3';
availableNowEl.innerHTML = `<h4 class="small-title">Available now</h4><p class="muted small" id="available-now-list"></p>`;
const mainWrapper = document.querySelector('main .wrapper');
if (mainWrapper) mainWrapper.insertBefore(availableNowEl, mainWrapper.firstElementChild?.nextSibling || null);
const deliveryServices = services.filter(s => s.tag === 'delivery').map(s => s.title);
const availEl = document.getElementById('available-now-list');
if (availEl) availEl.textContent = deliveryServices.length ? deliveryServices.join(', ') : 'No delivery services currently';

// Attach sound actions (Order button, modal form success, gallery hover)
function attachSoundToActions() {
  const orderBtn = document.querySelector('a[href="index.html#order"], a.btn.btn-primary[href*="#order"]');
  if (orderBtn) {
    orderBtn.addEventListener('click', (e) => {
      // play notify
      playSound('notify');
      orderBtn.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.04)' }, { transform: 'scale(1)' }], { duration: 220 });
    });
  }

  // Modal form success/error (if exists)
  const contactModalForm = document.getElementById('contact-modal-form');
  if (contactModalForm) {
    contactModalForm.addEventListener('submit', () => {
      setTimeout(() => {
        if (!contactModalForm.querySelector('.input-error')) {
          playSound('notify');
        } else {
          playSound('error');
        }
      }, 30);
    });
  }

  // gallery hover sound (optional)
  document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('mouseenter', () => {
      playSound('hover');
    });
  });
}
attachSoundToActions();

// IntersectionObserver animations
const animateOnView = (selector, opts = {}) => {
  const nodes = document.querySelectorAll(selector);
  if (!nodes.length) return;
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.style.transition = 'opacity 420ms ease, transform 420ms cubic-bezier(.2,.9,.3,1)';
        en.target.style.opacity = '1';
        en.target.style.transform = 'translateY(0)';
        obs.unobserve(en.target);
      }
    });
  }, { threshold: 0.12, ...opts });

  nodes.forEach(n => {
    n.style.opacity = '0';
    n.style.transform = 'translateY(12px)';
    io.observe(n);
  });
};

animateOnView('.grid-3 > *');
animateOnView('.gallery-item');

// small accordion enhancement
document.querySelectorAll('.accordion .accordion-item').forEach(item => {
  const btn = item.querySelector('.accordion-button');
  btn?.addEventListener('click', () => {
    if (item.classList.contains('open')) {
      item.style.boxShadow = '0 12px 30px rgba(0,0,0,0.06)';
      item.style.transform = 'translateY(-6px)';
      setTimeout(() => { item.style.transform = ''; item.style.boxShadow = ''; }, 360);
    }
  });
});

// reveal header subtitle
const headerSubtitle = document.querySelector('.area-header .section-subtitle');
if (headerSubtitle) {
  headerSubtitle.style.opacity = '0';
  headerSubtitle.style.transform = 'translateY(6px)';
  setTimeout(() => {
    headerSubtitle.style.transition = 'opacity 420ms ease, transform 420ms ease';
    headerSubtitle.style.opacity = '1';
    headerSubtitle.style.transform = 'translateY(0)';
  }, 220);
}

/* ----------------- Steam effect initializer ----------------- */
function initSteamEffect({
  selector = '.service-card img, .card img, .gallery-item img', // элементы, к которым привяжем эффект
  hoverSound = 'hover' // имя звука в SOUND_PATHS (если есть)
} = {}) {
  // Обёрнём картинки в .hot-card контейнер (если их родитель — .card, оставим)
  document.querySelectorAll(selector).forEach(img => {
    // Защита: не оборачиваем, если уже есть контейнер .hot-card
    const parent = img.closest('.hot-card') || img.parentElement;
    // Если родитель уже .hot-card — используем его
    if (!img.closest('.hot-card')) {
      // Создаём оболочку только если родитель не является .card с другими элементами
      const wrapper = document.createElement('div');
      wrapper.className = 'hot-card';
      // Сохраняем display/flow родителя: если img был единственным ребенком, заменяем; иначе просто вставляем wrapper вокруг img
      img.parentElement.insertBefore(wrapper, img);
      wrapper.appendChild(img);
      // Когда перекомпоновать содержимое, можно вернуть в .card стили, но wrapper минимален
    } 
  });

  // Добавляем ховер/фокус обработчики — используем делегирование не требуется, просто per-element
  document.querySelectorAll('.hot-card').forEach(card => {
    let steamTimer = null;

    const activate = () => {
      card.classList.add('hot-active');
      // звук (если есть функция playSound)
      try { if (typeof playSound === 'function') playSound(hoverSound); } catch(e) {}
      // Снимем класс через время чуть больше анимации чтобы можно было повторно сработать
      clearTimeout(steamTimer);
      steamTimer = setTimeout(() => card.classList.remove('hot-active'), 1400);
    };

    // hover и touchstart
    card.addEventListener('mouseenter', activate);
    card.addEventListener('touchstart', activate, { passive: true });

    // keyboard accessibility: активация при focus внутри (например таб на кнопку внутри карточки)
    card.addEventListener('focusin', activate);
  });
}

// Инициализация (поставь вызов после определения playSound и создания карточек)
initSteamEffect({ selector: '.grid-3 .card img, .gallery-item img', hoverSound: 'hover' });


/* ---------------- Demo filler: populate Profile / Skills / Projects ---------------- */
function populateDemoNow() {
  const profileEl = document.querySelector('#profile-info');
  const skillsList = document.querySelector('#skills-list');
  const projectsEl = document.querySelector('#projects');
  const soundBtn = document.querySelector('#sound-btn');

  // Profile — команда и миссия коротко и по теме
  if (profileEl) {
    profileEl.textContent = 'Team: Chef Yerkanat · Frontend Aldiyar · Manager Madiyar · Support Alinur — crafting fresh pizzas since 2017';
  }

  // Skills — навыки, релевантные ресторану/пиццерии
  if (skillsList) {
    const skills = [
      'Dough & fermentation',
      'Recipe testing & balancing',
      'Sourcing fresh ingredients',
      'Fast & safe delivery'
    ];
    skillsList.innerHTML = skills.map(s => `<li>${s}</li>`).join('');
  }

  // Projects — реальные инициативы / фичи сайта
  if (projectsEl) {
    const projects = [
      'Seasonal menu launch',
      'Opening new Almaty branch (Q4)',
      'Improved online ordering flow'
    ];
    projectsEl.textContent = projects.join(' · ');
  }

  // Tidy: change sound button label to be contextual
  if (soundBtn) {
    soundBtn.textContent = 'Play order sound';
  }
}

// Run immediately and again shortly (covers timing issues)
populateDemoNow();
setTimeout(populateDemoNow, 120);

/* ---------------- Play order sound on button click ---------------- */
(function attachOrderSoundButton(){
  const btn = document.querySelector('#sound-btn'); // если у тебя другой id — поменяй сюда
  if (!btn) return;

  // preload (если в audioCache уже нет — попробуем создать объект Audio заранее)
  btn.addEventListener('mouseenter', () => {
    try {
      if (typeof SOUND_PATHS !== 'undefined' && SOUND_PATHS.notify && !audioCache['notify']) {
        audioCache['notify'] = new Audio(SOUND_PATHS.notify);
        audioCache['notify'].preload = 'auto';
      }
    } catch (e) {}
  }, { once: true });

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    try {
      // вызов общей функции playSound (она уже делает fallback на WebAudio)
      playSound('notify');
    } catch (err) {
      // на всякий случай — воспроизвести простой beep
      try { webAudioBeep(); } catch(e) {}
    }

    // небольшая визуальная отдача
    try {
      btn.animate(
        [{ transform: 'scale(1)' }, { transform: 'scale(1.06)' }, { transform: 'scale(1)' }],
        { duration: 220, easing: 'ease-out' }
      );
    } catch (e) {}
  });
})();


});


  
