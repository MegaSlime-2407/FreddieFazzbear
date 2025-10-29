//Jquerry Task 3.1 by Madiyar
function showToast(msg, time = 2500) {
  const $t = $('.toast');
  $t.text(msg).fadeIn(200);

  setTimeout(() => {
    $t.fadeOut(200);
  }, time);
}

//Jquerry Task 3.2 by Madiyar



$(document).on('click', '.copy-btn', function () {
  copyName(this);
});



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
