document.addEventListener('DOMContentLoaded', () => {
  const user = getCurrentUser();
  
  if (!user) {
    window.location.href = 'login.html';
    return;
  }
  
  document.getElementById('userName').textContent = user.name;
  document.getElementById('userEmail').textContent = user.email;
  const phoneEl = document.getElementById('userPhone');
  if (phoneEl) {
    phoneEl.textContent = user.phone && user.phone.trim() ? user.phone : '—';
  }
  
  document.getElementById('logoutBtn').addEventListener('click', () => {
    logOut();
    window.location.href = 'index.html';
  });
});

