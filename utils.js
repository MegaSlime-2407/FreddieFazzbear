//new class for utilities by Madiyar 
//impl Jquerry 3 task

function showToast(msg, time = 2500) {
  const $t = $('.toast');
  $t.text(msg).fadeIn(200);

  setTimeout(() => {
    $t.fadeOut(200);
  }, time);
}

function addToCart(buttonElement, toastTime = 2500) {
    const card = buttonElement.closest('article');
    const title = card.querySelector('h3').textContent.trim();
    const price = card.querySelector('strong').textContent.trim();
    const image = card.querySelector('img').src;
  
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({ title, price, image });
    localStorage.setItem('cart', JSON.stringify(cart));
  
    buttonElement.textContent = 'Added';
    buttonElement.classList.add('btn-success');
    showToast(`${title} added to cart!`, toastTime);
  
    setTimeout(() => {
      buttonElement.textContent = 'Add';
      buttonElement.classList.remove('btn-success');
    }, toastTime);
  }
  

  function copyName(buttonElement) {
    const card = $(buttonElement).closest('article');
    const title = card.find('h3').text().trim();
    const btn = buttonElement;
    const tooltip = document.getElementById('global-tooltip');
  
    navigator.clipboard.writeText(title).then(() => {
    const originalIcon = btn.textContent;
    btn.textContent = '✅';

        
      tooltip.textContent = 'Copied!';
  
      const rect = btn.getBoundingClientRect();
      const top = window.scrollY + rect.top - 30;
      const left = window.scrollX + rect.left + rect.width / 2;
  
      tooltip.style.top = top + 'px';
      tooltip.style.left = left + 'px';
      tooltip.style.transform = 'translateX(-50%)';
      tooltip.style.opacity = '1';
  
      setTimeout(() => {
        btn.textContent = '📋';
        tooltip.style.opacity = '0';
      }, 1500);
    });
  }

  function lazyLoad() {
    $('.lazy').each(function () {
      const img = $(this);
  
      if (img.attr('src') === img.data('src')) return;
  
      const imgTop = img.offset().top;
      const scrollBottom = $(window).scrollTop() + $(window).height();
  
      if (scrollBottom > imgTop - 300) {
        const realSrc = img.data('src');
  
        if (!realSrc) return;
  
        const tempImg = new Image();
        tempImg.src = realSrc;
  
        tempImg.onload = function () {
          setTimeout(function() {
            img.attr('src', realSrc);
            img.addClass('loaded');
          }, 2000);
        };
        
        tempImg.onerror = function() {
          img.removeClass('lazy');
        };
      }
    });
  }
