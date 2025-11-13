function signUp(name, email, phone, password) {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return { success: false, message: 'Email already exists' };
  }
  
  const newUser = {
    id: Date.now().toString(),
    name: name,
    email: email,
    phone: phone,
    password: password
  };
  
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  
  return { success: true, user: newUser };
}

function logIn(email, password) {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return { success: false, message: 'Invalid email or password' };
  }
  
  const userSession = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone || ''
  };
  
  localStorage.setItem('currentUser', JSON.stringify(userSession));
  
  return { success: true, user: userSession };
}

function logOut() {
  localStorage.removeItem('currentUser');
}

function getCurrentUser() {
  const userStr = localStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
}

function isLoggedIn() {
  return getCurrentUser() !== null;
}

function getUserRating(userId) {
  const ratings = JSON.parse(localStorage.getItem('userRatings')) || {};
  return ratings[userId] || null;
}

function saveUserRating(userId, rating) {
  const ratings = JSON.parse(localStorage.getItem('userRatings')) || {};
  ratings[userId] = rating;
  localStorage.setItem('userRatings', JSON.stringify(ratings));
}

function getAllRatings() {
  return JSON.parse(localStorage.getItem('userRatings')) || {};
}

function getAverageRating() {
  const ratings = getAllRatings();
  const values = Object.values(ratings)
    .map(Number)
    .filter(value => !Number.isNaN(value) && value > 0);
  const count = values.length;
  const average = count ? values.reduce((acc, curr) => acc + curr, 0) / count : 0;
  return { average, count };
}

function getAllUsers() {
  return JSON.parse(localStorage.getItem('users')) || [];
}

