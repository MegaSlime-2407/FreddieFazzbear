// cart.js — Display and Manage Cart
document.addEventListener('DOMContentLoaded', () => {
  const cartContainer = document.querySelector('.cart-grid');
  const totalElement = document.querySelector('.cart-summary p strong');
  const proceedBtn = document.querySelector('.btn-primary[href="checkout.html"]');
  const cartMessage = document.getElementById('cartMessage');

  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // === Render Cart ===
  function renderCart() {
    if (cart.length === 0) {
      cartContainer.innerHTML = '<p class="muted">Your cart is empty 🛒</p>';
      totalElement.textContent = 'Total: 0 ₸';
      proceedBtn.classList.add('btn-disabled');
      proceedBtn.setAttribute('disabled', 'true');
      return;
    }

    let total = 0;
    cartContainer.innerHTML = cart.map((item, index) => {
      const price = parseInt(item.price.replace(/\D/g, '')) || 0;
      total += price;
      return `
        <div class="cart-item">
          <img src="${item.image || 'https://via.placeholder.com/80'}" alt="${item.title}" class="cart-thumb" loading="lazy">
          <div class="cart-details">
            <h3 class="cart-title">${item.title}</h3>
            <span class="cart-price">${item.price}</span>
          </div>
          <div class="cart-actions">
            <button class="btn btn-danger remove-item" data-index="${index}">Remove</button>
          </div>
        </div>
      `;
    }).join('');

    totalElement.textContent = `Total: ${total} ₸`;
    proceedBtn.classList.remove('btn-disabled');
    proceedBtn.removeAttribute('disabled');

    // === Remove item buttons ===
    document.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = btn.dataset.index;
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        showCartMessage('Item removed from cart 🗑️');
        renderCart();
      });
    });
  }

  // === Feedback messages ===
  function showCartMessage(text) {
    cartMessage.textContent = text;
    cartMessage.style.opacity = '1';
    cartMessage.style.color = 'red';
    setTimeout(() => {
      cartMessage.style.opacity = '0';
    }, 2000);
  }

  // === Star rating ===
  const stars = document.querySelectorAll('.star');
  const ratingMessage = document.getElementById('ratingMessage');

  stars.forEach((star, index) => {
    star.addEventListener('click', () => {
      stars.forEach((s, i) => {
        s.style.color = i <= index ? 'gold' : '#ccc';
      });
      ratingMessage.textContent = `You rated the website ${index + 1} / 5 ⭐`;
      ratingMessage.style.color = 'green';
      localStorage.setItem('siteRating', index + 1);
    });
  });

  // === Restore saved rating ===
  const savedRating = localStorage.getItem('siteRating');
  if (savedRating) {
    stars.forEach((s, i) => {
      s.style.color = i < savedRating ? 'gold' : '#ccc';
    });
    ratingMessage.textContent = `Your previous rating: ${savedRating} / 5 ⭐`;
    ratingMessage.style.color = 'green';
  }

  renderCart();
});
