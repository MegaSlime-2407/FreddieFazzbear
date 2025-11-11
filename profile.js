document.addEventListener('DOMContentLoaded', () => {
  const user = getCurrentUser();
  
  if (!user) {
    window.location.href = 'login.html';
    return;
  }
  
  document.getElementById('userName').textContent = user.name;
  document.getElementById('userEmail').textContent = user.email;
  
  document.getElementById('logoutBtn').addEventListener('click', () => {
    logOut();
    window.location.href = 'index.html';
  });
});

