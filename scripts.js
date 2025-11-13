document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- LAYOUT OFFSET ---------------- */
  const updateHeaderOffset = () => {
    const header = document.querySelector('header');
    if (!header) return;
    const extraSpace = window.innerWidth <= 768 ? 56 : 36;
    const offset = header.offsetHeight + extraSpace;
    document.documentElement.style.setProperty('--page-offset', `${Math.ceil(offset)}px`);
  };

  window.updateHeaderOffset = updateHeaderOffset;
  updateHeaderOffset();
  window.addEventListener('resize', () => requestAnimationFrame(updateHeaderOffset));
  window.addEventListener('load', updateHeaderOffset, { once: true });
  setTimeout(updateHeaderOffset, 300);

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

  /* INSERT: Scroll progress logic — поместить в scripts.js (в самом конце) */
(function () {
  'use strict';

  var progressEl = document.getElementById('scroll-progress');
  if (!progressEl) return; // если элемент не найден — ничего не делаем

  // Обновить прогресс и aria
  function updateProgress() {
    var doc = document.documentElement;
    var body = document.body;
    var scrollTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    var scrollHeight = Math.max(
      body.scrollHeight, doc.scrollHeight,
      body.offsetHeight, doc.offsetHeight,
      body.clientHeight, doc.clientHeight
    );
    var clientHeight = doc.clientHeight || window.innerHeight;
    var maxScroll = scrollHeight - clientHeight;
    var pct = 0;

    if (maxScroll > 0) {
      pct = Math.min(100, Math.max(0, (scrollTop / maxScroll) * 100));
    } else {
      pct = 0;
    }

    progressEl.style.width = pct + '%';
    progressEl.setAttribute('aria-valuenow', Math.round(pct));

    // Показываем прогрессбар только если есть что скроллить
    if (maxScroll > 0 && (scrollTop > 20 || pct > 0)) {
      progressEl.classList.add('visible');
      document.body.classList.add('has-top-progressbar'); // опционально добавить отступ сверху
      progressEl.setAttribute('aria-hidden', 'false');
    } else {
      // когда документ короткий — скрываем
      progressEl.classList.remove('visible');
      document.body.classList.remove('has-top-progressbar');
      progressEl.setAttribute('aria-hidden', 'true');
    }
  }

  // Debounce — чтобы не обновлять слишком часто во время быстрого скролла
  var rafPending = false;
  function onScrollOrResize() {
    if (rafPending) return;
    rafPending = true;
    window.requestAnimationFrame(function () {
      updateProgress();
      rafPending = false;
    });
  }

  // Начальная установка и обработчики
  window.addEventListener('scroll', onScrollOrResize, {passive: true});
  window.addEventListener('resize', onScrollOrResize);
  window.addEventListener('orientationchange', onScrollOrResize);

  // Инициализация на загрузке
  document.addEventListener('DOMContentLoaded', function () {
    updateProgress();
  });

  // Если контент динамически добавляется (например lazy images),
  // можно повторно вызвать updateProgress() после загрузки изображений:
  window.addEventListener('load', function () {
    // даём секунду чтобы подвисшие расчёты завершились
    setTimeout(updateProgress, 120);
  });

})();
/* END INSERT */
/* INSERT: Animated counters — add to end of scripts.js */
(function () {
  'use strict';

  var counters = Array.prototype.slice.call(document.querySelectorAll('.stat-number'));
  if (!counters.length) return;

  // форматирование числа с разделителем тысяч
  function formatNumber(n) {
    // Используем toLocaleString, fallback — простой форматер
    if (typeof n.toLocaleString === 'function') {
      return n.toLocaleString('en-US');
    }
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // анимация: плавный подсчёт от 0 до target за duration ms
  function animateCount(el, target, duration, suffix) {
    var start = null;
    var from = 0;
    var diff = target - from;
    var easeOutCubic = function (t) { return 1 - Math.pow(1 - t, 3); };

    function step(timestamp) {
      if (!start) start = timestamp;
      var elapsed = timestamp - start;
      var progress = Math.min(1, elapsed / duration);
      var eased = easeOutCubic(progress);
      var current = Math.floor(from + diff * eased);
      el.textContent = formatNumber(current) + (suffix || '');
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        // гарантируем точное финальное значение
        el.textContent = formatNumber(target) + (suffix || '');
        // пометка, что анимация выполнена
        el.dataset.animated = 'true';
      }
    }
    window.requestAnimationFrame(step);
  }

  // IntersectionObserver для запуска при появлении в viewport (одноразово)
  var observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.35 // запускаем, когда ~35% видимости
  };

  var obs = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      if (el.dataset.animated === 'true') {
        observer.unobserve(el);
        return;
      }
      var target = parseInt(el.getAttribute('data-target') || '0', 10) || 0;
      var suffix = el.getAttribute('data-suffix') || '';
      // Длительность можно настраивать: чем больше число — тем длиннее анимация
      var duration = Math.min(2000, 600 + Math.round(Math.log(Math.max(target,1)) * 500));
      animateCount(el, target, duration, suffix);
      observer.unobserve(el); // запускаем только один раз
    });
  }, observerOptions);

  // Подключаем все элементы
  counters.forEach(function (el) {
    // начальное состояние — 0
    el.textContent = '0';
    obs.observe(el);
  });

})();

/* INSERT: Submit button spinner logic */
(function () {
  'use strict';

  const forms = document.querySelectorAll('form.js-with-spinner');
  if (!forms.length) return;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneAllowedPattern = /^[\d\s()+-]+$/;

  function showMessage(targetId, text, isError) {
    const el = document.getElementById(targetId);
    if (!el) return;
    el.textContent = text;
    el.className = isError ? 'form-error' : 'form-success';
    setTimeout(() => { el.textContent = ''; }, 4000);
  }

  function clearFieldErrors(form) {
    form.querySelectorAll('.error-message[data-error-for]').forEach(el => {
      el.textContent = '';
    });
    form.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
  }

  function setFieldError(form, input, message) {
    if (!input) return;
    input.classList.add('input-error');
    const errorEl = form.querySelector(`.error-message[data-error-for="${input.id}"]`);
    if (errorEl) errorEl.textContent = message;
  }

  function validateContactForm(form) {
    clearFieldErrors(form);
    let isValid = true;

    const nameInput = form.querySelector('input[name="name"]');
    const emailInput = form.querySelector('input[type="email"]');
    const phoneInput = form.querySelector('input[type="tel"]');
    const messageInput = form.querySelector('textarea[name="message"]');

    if (nameInput) {
      const name = nameInput.value.trim();
      if (!name) {
        setFieldError(form, nameInput, 'Name is required');
        isValid = false;
      }
    }

    if (emailInput) {
      const email = emailInput.value.trim();
      if (!email) {
        setFieldError(form, emailInput, 'Email is required');
        isValid = false;
      } else if (!emailPattern.test(email)) {
        setFieldError(form, emailInput, 'Enter a valid email address');
        isValid = false;
      }
    }

    if (phoneInput) {
      const phone = phoneInput.value.trim();
      const digits = phone.replace(/\D/g, '');
      if (!phone) {
        setFieldError(form, phoneInput, 'Phone number is required');
        isValid = false;
      } else if (!phoneAllowedPattern.test(phone) || digits.length < 10 || digits.length > 15) {
        setFieldError(form, phoneInput, 'Enter a valid phone number');
        isValid = false;
      }
    }

    if (messageInput) {
      const message = messageInput.value.trim();
      if (!message) {
        setFieldError(form, messageInput, 'Message is required');
        isValid = false;
      } else if (message.length < 10) {
        setFieldError(form, messageInput, 'Message should be at least 10 characters');
        isValid = false;
      }
    }

    return isValid;
  }

  forms.forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('[data-spinner]');
      if (!btn) return;

      const original = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = `<span class="spinner"></span> Please wait...`;

       if (!validateContactForm(form)) {
        btn.disabled = false;
        btn.innerHTML = original;
        return;
       }

      // Симуляция обработки формы
      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = original;
        form.reset();

        // Определяем, куда выводить сообщение
        const msgId = form.id === 'contact-modal-form'
          ? 'modalFormMessage'
          : 'contactFormMessage';

        showMessage(msgId, '✅ Message sent successfully!', false);
      }, 1500);
    });
  });
})();



});


  
