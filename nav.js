document.addEventListener('DOMContentLoaded', () => {
  const authLinksContainer = document.getElementById('authLinks');
  if (!authLinksContainer) return;
  
  const user = getCurrentUser();
  const currentPage = window.location.pathname.split('/').pop();
  
  if (user) {
    const profileLink = document.createElement('a');
    profileLink.href = 'profile.html';
    profileLink.textContent = 'Profile';
    if (currentPage === 'profile.html') {
      profileLink.classList.add('active');
    }
    authLinksContainer.appendChild(profileLink);
  } else {
    if (currentPage !== 'login.html') {
      const loginLink = document.createElement('a');
      loginLink.href = 'login.html';
      loginLink.textContent = 'Log In';
      authLinksContainer.appendChild(loginLink);
    }
    
    if (currentPage !== 'signup.html') {
      const signupLink = document.createElement('a');
      signupLink.href = 'signup.html';
      signupLink.textContent = 'Sign Up';
      authLinksContainer.appendChild(signupLink);
    }
  }
});

