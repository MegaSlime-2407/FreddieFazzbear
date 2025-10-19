// menu.js — Add from Menu to Cart
document.addEventListener('DOMContentLoaded', () => {
  const addButtons = document.querySelectorAll('.grid-3 article button');

  addButtons.forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('article');
      const title = card.querySelector('h3').textContent.trim();
      const price = card.querySelector('strong').textContent.trim();
      const image = card.querySelector('img').src; 

      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      cart.push({ title, price, image }); 
      localStorage.setItem('cart', JSON.stringify(cart));

      button.textContent = 'Added';
      button.classList.add('btn-success');
      setTimeout(() => {
        button.textContent = 'Add';
        button.classList.remove('btn-success');
      }, 1000);
    });
  });
});
