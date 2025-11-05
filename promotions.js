// promotions.js — Add from Promotions to Cart
$(document).on('click', '.grid-3 article .btn-primary', function () {
  addToCart(this, 2500);
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
