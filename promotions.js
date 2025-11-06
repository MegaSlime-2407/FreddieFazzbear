// promotions.js — Add from Promotions to Cart

// Sound functionality (same as about.html)
const SOUND_PATHS = {
  notify: 'https://www.soundjay.com/buttons/sounds/button-3.mp3'
};

const audioCache = {};
let audioCtx = null;

function tryHtmlAudio(name) {
  return new Promise((resolve, reject) => {
    const path = SOUND_PATHS[name];
    if (!path) return reject(new Error('no-path'));
    try {
      if (!audioCache[name]) {
        const a = new Audio(path);
        a.preload = 'auto';
        audioCache[name] = a;
      }
      const au = audioCache[name];
      au.currentTime = 0;
      const p = au.play();
      if (p && typeof p.then === 'function') {
        p.then(() => resolve('html-audio')).catch(err => reject(err));
      } else {
        resolve('html-audio');
      }
    } catch (err) {
      reject(err);
    }
  });
}

function webAudioBeep({ frequency = 880, duration = 0.12, gain = 0.06 } = {}) {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const ctx = audioCtx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = frequency;
    g.gain.setValueAtTime(gain, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
    return true;
  } catch (e) {
    return false;
  }
}

function playSound(name = 'notify') {
  tryHtmlAudio(name).catch(() => {
    webAudioBeep();
  });
}

// Resume audio context on first gesture
const resumeOnGesture = () => {
  try {
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  } catch (e) {}
  window.removeEventListener('click', resumeOnGesture);
  window.removeEventListener('keydown', resumeOnGesture);
  window.removeEventListener('touchstart', resumeOnGesture);
};
window.addEventListener('click', resumeOnGesture);
window.addEventListener('keydown', resumeOnGesture);
window.addEventListener('touchstart', resumeOnGesture);

document.addEventListener('DOMContentLoaded', () => {
  const promoButtons = document.querySelectorAll('.grid-3 article button');

  promoButtons.forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('article');
      const title = card.querySelector('h3').textContent.trim();
      const price = card.querySelector('strong').textContent.trim();
      const image = card.querySelector('img').src; 

      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      cart.push({ title, price, image }); 
      localStorage.setItem('cart', JSON.stringify(cart));

      // Play order sound (same as on about.html)
      playSound('notify');

      button.textContent = 'Added';
      button.classList.add('btn-success');
      setTimeout(() => {
        button.textContent = 'Add';
        button.classList.remove('btn-success');
      }, 1000);
    });
  });
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
