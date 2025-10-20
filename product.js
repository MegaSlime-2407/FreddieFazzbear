const btn = document.getElementById('btn-show-time');
const out = document.getElementById('time-output');

btn.addEventListener('click', () => {
  const now = new Date().toLocaleTimeString();
  out.textContent = "Current time: " + now;
});
