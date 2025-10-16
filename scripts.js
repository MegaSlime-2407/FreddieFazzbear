document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- ACCORDION ---------------- */
  document.querySelectorAll('.accordion .accordion-item').forEach(item => {
    const btn = item.querySelector('.accordion-button');
    const panel = item.querySelector('.accordion-panel');
    if (!btn || !panel) return;

    btn.setAttribute('aria-expanded', 'false');
    panel.style.maxHeight = null;

    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      if (expanded) {
        item.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        panel.style.maxHeight = null;
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

});
