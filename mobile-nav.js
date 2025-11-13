document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const nav = document.querySelector('header nav');
  const header = document.querySelector('header');
  const refreshOffset = () => {
    if (typeof window.updateHeaderOffset === 'function') {
      window.updateHeaderOffset();
    }
  };
  
  if (!menuToggle || !nav) return;
  
  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('mobile-menu-open');
    menuToggle.classList.toggle('active');
    header.classList.toggle('mobile-menu-active');
    refreshOffset();
  });
  
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('mobile-menu-open') && 
        !nav.contains(e.target) && 
        !menuToggle.contains(e.target)) {
      nav.classList.remove('mobile-menu-open');
      menuToggle.classList.remove('active');
      header.classList.remove('mobile-menu-active');
      refreshOffset();
    }
  });
  
  nav.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      nav.classList.remove('mobile-menu-open');
      menuToggle.classList.remove('active');
      header.classList.remove('mobile-menu-active');
      refreshOffset();
    }
  });

  refreshOffset();
});

