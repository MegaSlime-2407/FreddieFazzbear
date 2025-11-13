document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
      el.textContent = '';
    });
    document.querySelectorAll('input').forEach(el => {
      el.classList.remove('input-error');
    });
  }
  
  function showError(fieldId, message) {
    const errorEl = document.getElementById(fieldId + 'Error');
    const inputEl = document.getElementById(fieldId);
    if (errorEl) errorEl.textContent = message;
    if (inputEl) inputEl.classList.add('input-error');
  }
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    if (!email) {
      showError('email', 'Email is required');
      return;
    }

    if (!emailPattern.test(email)) {
      showError('email', 'Enter a valid email address');
      return;
    }
    
    if (!password) {
      showError('password', 'Password is required');
      return;
    }

    if (password.length < 8) {
      showError('password', 'Password must be at least 8 characters');
      return;
    }
    
    const result = logIn(email, password);
    
    if (result.success) {
      window.location.href = 'profile.html';
    } else {
      showError('password', result.message);
    }
  });
});

