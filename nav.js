document.addEventListener('DOMContentLoaded', () => {
  const authLinksContainer = document.getElementById('authLinks');
  if (!authLinksContainer) return;
  
  const user = getCurrentUser();
  
  if (user) {
    const profileLink = document.createElement('a');
    profileLink.href = 'profile.html';
    profileLink.textContent = 'Profile';
    authLinksContainer.appendChild(profileLink);
  } else {
    const loginLink = document.createElement('a');
    loginLink.href = 'login.html';
    loginLink.textContent = 'Log In';
    authLinksContainer.appendChild(loginLink);
    
    const signupLink = document.createElement('a');
    signupLink.href = 'signup.html';
    signupLink.textContent = 'Sign Up';
    authLinksContainer.appendChild(signupLink);
  }
});

