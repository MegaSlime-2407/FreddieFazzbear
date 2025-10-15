// scripts.js — improved, robust accordion + modal logic (vanilla JS)
document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- ACCORDION ---------------- */
  (function initAccordion(){
    const items = document.querySelectorAll('.accordion .accordion-item');
    if (!items.length) return;

    items.forEach(item => {
      const btn = item.querySelector('.accordion-button');
      const panel = item.querySelector('.accordion-panel');
      if (!btn || !panel) return;

      // ARIA defaults
      btn.setAttribute('aria-expanded', 'false');
      panel.style.maxHeight = null;

      // Click handler
      btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        if (expanded) {
          collapse(item, panel, btn);
        } else {
          // close siblings (optional: keep only one open)
          items.forEach(other => {
            if (other !== item && other.classList.contains('open')) {
              const obtn = other.querySelector('.accordion-button');
              const opanel = other.querySelector('.accordion-panel');
              collapse(other, opanel, obtn);
            }
          });
          expand(item, panel, btn);
        }
      });

      // Keyboard accessibility (Enter / Space)
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          btn.click();
        }
      });
    });

    function expand(item, panel, btn) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      panel.style.maxHeight = panel.scrollHeight + 'px';
    }
    function collapse(item, panel, btn) {
      item.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      panel.style.maxHeight = null;
    }
  })();

  /* ---------------- MODAL / POPUP ----------------
     - Triggers: elements with data-modal="#selector"
     - Also supports legacy selectors: .btn-subscribe, .btn-contact, #open-contact-popup
     - Modal overlays should use class .modal-overlay and have an id (e.g. id="contact-modal")
  -------------------------------------------------*/
  (function initModal(){
    // collect triggers with data-modal
    const explicitTriggers = Array.from(document.querySelectorAll('[data-modal]'));

    // also auto-detect legacy triggers and add data-modal if missing
    const legacy = Array.from(document.querySelectorAll('.btn-subscribe, .btn-contact, #open-contact-popup'));
    legacy.forEach(el => {
      if (!el.getAttribute('data-modal')) {
        if (document.getElementById('contact-modal')) el.setAttribute('data-modal', '#contact-modal');
        else if (document.getElementById('modal-overlay')) el.setAttribute('data-modal', '#modal-overlay');
      }
    });

    // rebuild triggers list (explicit + legacy possibly updated)
    const triggers = Array.from(document.querySelectorAll('[data-modal]'));
    if (!triggers.length) return;

    // Map modal selector => element
    const modalMap = new Map();
    document.querySelectorAll('.modal-overlay').forEach(modalEl => {
      if (modalEl.id) modalMap.set('#' + modalEl.id, modalEl);
    });

    // If no overlays present, still allow selectors to query DOM
    // Focusable selector list
    const FOCUSABLE = 'a[href], area[href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';

    let lastFocused = null;

    // Attach click to triggers
    triggers.forEach(trigger => {
      const selector = trigger.getAttribute('data-modal');
      if (!selector) return;
      // try modalMap first, then fallback to querySelector
      const modalEl = modalMap.get(selector) || document.querySelector(selector);
      if (!modalEl) return;

      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(modalEl, trigger);
      });
    });

    // Setup each modal overlay handlers
    const overlays = Array.from(document.querySelectorAll('.modal-overlay'));
    overlays.forEach(modalEl => {
      // close buttons
      modalEl.querySelectorAll('.modal-close').forEach(btn => btn.addEventListener('click', () => closeModal(modalEl)));

      // click outside content to close
      modalEl.addEventListener('click', (e) => {
        if (e.target === modalEl) closeModal(modalEl);
      });

      // keydown handler stored on element for add/remove
      modalEl._keydownHandler = function (e) {
        if (e.key === 'Escape') {
          closeModal(modalEl);
          return;
        }
        if (e.key === 'Tab') {
          // simple focus trap
          const focusables = Array.from(modalEl.querySelectorAll(FOCUSABLE)).filter(el => el.offsetParent !== null);
          if (!focusables.length) return;
          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };
    });

    function openModal(modalEl, trigger) {
      lastFocused = trigger || document.activeElement;
      modalEl.hidden = false;
      modalEl.classList.add('show');
      // fade-in
      modalEl.style.opacity = 0;
      requestAnimationFrame(() => {
        modalEl.style.transition = 'opacity 180ms ease';
        modalEl.style.opacity = 1;
      });

      // focus first focusable element
      const first = modalEl.querySelector('input, button, textarea, [tabindex]:not([tabindex="-1"])');
      if (first) first.focus();

      document.addEventListener('keydown', modalEl._keydownHandler);
    }

    function closeModal(modalEl) {
      modalEl.style.opacity = 0;
      const cleanup = () => {
        modalEl.hidden = true;
        modalEl.classList.remove('show');
        modalEl.style.transition = '';
        modalEl.style.opacity = '';
        if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
        document.removeEventListener('keydown', modalEl._keydownHandler);
      };

      const onEnd = (ev) => {
        if (ev.target === modalEl) {
          modalEl.removeEventListener('transitionend', onEnd);
          cleanup();
        }
      };
      modalEl.addEventListener('transitionend', onEnd);
      // fallback cleanup
      setTimeout(() => {
        if (!modalEl.hidden) cleanup();
      }, 300);
    }
  })();

  /* ---------------- PAGE CONTACT FORM VALIDATION ---------------- */
  (function initContactForm(){
    const pageContactForm = document.getElementById('page-contact-form');
    if (!pageContactForm) return;
    const pageError = document.getElementById('page-form-error');
    pageContactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (pageError) pageError.style.display = 'none';

      const name = document.getElementById('pc-name');
      const email = document.getElementById('pc-email');
      const message = document.getElementById('pc-message');

      if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
        if (pageError) {
          pageError.textContent = 'Please fill in all required fields.';
          pageError.style.display = 'block';
        }
        return;
      }
      if (!/\S+@\S+\.\S+/.test(email.value)) {
        if (pageError) {
          pageError.textContent = 'Please enter a valid email address.';
          pageError.style.display = 'block';
        }
        email.focus();
        return;
      }

      // Demo success — replace with fetch() to send to backend
      pageContactForm.reset();
      window.alert('Message sent (demo). Thank you!');
    });
  })();

  /* ---------------- MODAL FORM (if you have #modal-form) ---------------- */
  (function initModalForm(){
    const modalForm = document.getElementById('modal-form'); // primary modal form id
    if (!modalForm) return;
    const modalError = document.getElementById('modal-error');

    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (modalError) modalError.style.display = 'none';
      const email = modalForm.querySelector('input[type="email"]');
      if (!email || !/\S+@\S+\.\S+/.test(email.value)) {
        if (modalError) {
          modalError.textContent = 'Please enter a valid email address.';
          modalError.style.display = 'block';
        }
        if (email) email.focus();
        return;
      }
      // success
      const overlay = modalForm.closest('.modal-overlay');
      if (overlay) {
        const closeBtn = overlay.querySelector('.modal-close');
        if (closeBtn) closeBtn.click();
        else overlay.hidden = true;
      }
      modalForm.reset();
      window.alert('Thanks! Your request was received (demo).');
    });
  })();

});
