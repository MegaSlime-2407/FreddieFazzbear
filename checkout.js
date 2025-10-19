// checkout.js — Form Validation + Cart Summary
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('checkoutForm');


  const orderList = document.querySelector('.order-summary ul');
  const totalElement = document.querySelector('.order-summary p strong');

  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  if (cart.length === 0) {
    orderList.innerHTML = '<li>Your cart is empty 🛒</li>';
    totalElement.textContent = 'Total: 0 ₸';
  } else {
    let total = 0;
    orderList.innerHTML = cart.map(item => {
      
      const cleanPrice = parseInt(item.price.replace(/\s|₸/g, ''));
      total += cleanPrice;
      return `<li>🍕 ${item.title} — ${item.price}</li>`;
    }).join('');

    
    totalElement.textContent = `Total: ${total.toLocaleString()} ₸`;
  }

  
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const address = document.getElementById('address');
    const phone = document.getElementById('phone');

    document.querySelectorAll('.error-message').forEach(e => e.textContent = '');
    [name, email, address, phone].forEach(el => el.classList.remove('input-error'));

    let isValid = true;

    if (name.value.trim().length < 2) {
      showError(name, 'Please enter your full name.');
      isValid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value.trim())) {
      showError(email, 'Please enter a valid email address.');
      isValid = false;
    }

    if (address.value.trim().length < 5) {
      showError(address, 'Please enter a valid address.');
      isValid = false;
    }

    const phonePattern = /^\+7\d{10}$/;
    if (!phonePattern.test(phone.value.trim())) {
      showError(phone, 'Phone number must start with +7 and contain 11 digits.');
      isValid = false;
    }

    if (isValid) {
      alert('Your order has been successfully submitted! 🍕');
      localStorage.removeItem('cart'); // очистка корзины
      form.reset();
      window.location.href = 'index.html';
    }
  });

  function showError(input, message) {
    const error = input.parentElement.querySelector('.error-message');
    error.textContent = message;
    input.classList.add('input-error');
  }
});


const phoneInput = document.querySelector('#phone');

phoneInput.addEventListener('focus', () => {
  if (!phoneInput.value.startsWith('+7')) {
    phoneInput.value = '+7';
  }
});

phoneInput.addEventListener('input', () => {
  if (!phoneInput.value.startsWith('+7')) {
    phoneInput.value = '+7';
  }
});

phoneInput.addEventListener('keypress', (e) => {
  if (!/[0-9]/.test(e.key)) e.preventDefault();
  if (phoneInput.value.length >= 12) e.preventDefault();
});
