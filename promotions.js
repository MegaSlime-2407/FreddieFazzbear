// promotions.js — Add from Promotions to Cart
document.addEventListener('DOMContentLoaded', () => {
  const promoButtons = document.querySelectorAll('.grid-3 article button');

  promoButtons.forEach(button => {
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

//Task 2 Part 4 By Madiyar (Filter by price) implementation:

const sortSelect = document.getElementById('price-sort');
const grid = document.getElementById('promotions-grid');

const original = Array.from(grid.children); // save original order for default (grid.children - dochernie elementi vnutri tega)

sortSelect.addEventListener('change', function () {
  var items = Array.from(grid.children);
  var mode = this.value;

  if (mode === 'asc') {
    items.sort(function(a,b){
      return Number(a.dataset.price) - Number(b.dataset.price);
    });
  } else if (mode === 'desc') {
    items.sort(function(a,b){
      return Number(b.dataset.price) - Number(a.dataset.price);
    });
  } else {
    items = original.slice(); 
  }

  grid.innerHTML = '';
  items.forEach(function(el){
    grid.appendChild(el);
  });
});
