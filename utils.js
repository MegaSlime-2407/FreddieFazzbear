//new class for utilities by Madiyar 
//impl Jquerry 3 task
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