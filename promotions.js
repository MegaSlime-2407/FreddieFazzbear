//Jquerry Task 3 by Madiyar
function showToast(msg, time = 2500) {
  const $t = $('.toast');
  $t.text(msg).fadeIn(200);

  setTimeout(() => {
    $t.fadeOut(200);
  }, time);
}

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
      showToast(`${title} added to cart!`); //Jquerry task3
      setTimeout(() => {
        button.textContent = 'Add';
        button.classList.remove('btn-success');
      }, 2500);
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

  switch (mode) {
    case 'asc':
      items.sort(function(a,b){
        return Number(a.dataset.price) - Number(b.dataset.price);
      });
      break;
    case 'desc':
      items.sort(function(a,b){
        return Number(b.dataset.price) - Number(a.dataset.price);
      });
      break;
    default:
      items = original.slice(); 
      break;
  }

  grid.innerHTML = '';
  items.forEach(function(el){
    grid.appendChild(el);
  });
});
