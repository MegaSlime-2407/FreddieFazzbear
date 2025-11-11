document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signupForm');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  
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
    
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    if (!name) {
      showError('name', 'Name is required');
      return;
    }
    
    if (!email) {
      showError('email', 'Email is required');
      return;
    }
    
    if (!password) {
      showError('password', 'Password is required');
      return;
    }
    
    if (password.length < 6) {
      showError('password', 'Password must be at least 6 characters');
      return;
    }
    
    if (password !== confirmPassword) {
      showError('confirmPassword', 'Passwords do not match');
      return;
    }
    
    const result = signUp(name, email, password);
    
    if (result.success) {
      localStorage.setItem('currentUser', JSON.stringify({
        id: result.user.id,
        name: result.user.name,
        email: result.user.email
      }));
      window.location.href = 'profile.html';
    } else {
      showError('email', result.message);
    }
  });
});

