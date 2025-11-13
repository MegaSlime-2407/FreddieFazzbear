document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signupForm');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  const phoneAllowedPattern = /^[\d\s()+-]+$/;
  
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
    const phone = phoneInput.value.trim();
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

    if (!emailPattern.test(email)) {
      showError('email', 'Enter a valid email address');
      return;
    }

    if (!phone) {
      showError('phone', 'Phone number is required');
      return;
    }

    const phoneDigits = phone.replace(/\D/g, '');
    if (!phoneAllowedPattern.test(phone) || phoneDigits.length < 10 || phoneDigits.length > 15) {
      showError('phone', 'Enter a valid phone number');
      return;
    }
    
    if (!password) {
      showError('password', 'Password is required');
      return;
    }
    
    if (!passwordPattern.test(password)) {
      showError('password', 'Password must be 8+ chars with upper, lower, number & symbol');
      return;
    }
    
    if (password !== confirmPassword) {
      showError('confirmPassword', 'Passwords do not match');
      return;
    }
    
    const result = signUp(name, email, phone, password);
    
    if (result.success) {
      localStorage.setItem('currentUser', JSON.stringify({
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        phone: result.user.phone
      }));
      window.location.href = 'profile.html';
    } else {
      showError('email', result.message);
    }
  });
});

