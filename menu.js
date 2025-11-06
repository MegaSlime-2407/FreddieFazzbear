// menu.js — Add from Menu to Cart

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

$(window).on('scroll', lazyLoad);
$(document).ready(lazyLoad);

$(document).on('click', '.copy-btn', function () {
  copyName(this);
});

document.addEventListener('DOMContentLoaded', () => {
  const addButtons = document.querySelectorAll('.grid-3 article .btn-primary');

  addButtons.forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('article');
      const title = card.querySelector('h3').textContent.trim();
      const price = card.querySelector('strong').textContent.trim();
      const image = card.querySelector('img').src; 

      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      cart.push({ title, price, image }); 
      localStorage.setItem('cart', JSON.stringify(cart));

      if (typeof showToast === 'function') {
        showToast(`${title} added to cart!`, 2500);
      }

      button.textContent = 'Added';
      button.classList.add('btn-success');
      setTimeout(() => {
        button.textContent = 'Add';
        button.classList.remove('btn-success');
      }, 2500);
    });
  });
});

const products = ['Classic Margherita', 'Pepperoni Feast', 'Veggie Garden'];
let highlightedElements = [];

$('#search-bar').on('keyup', function() {
  const query = $(this).val().toLowerCase();
  
  $('#products-grid article').each(function() {
    const $item = $(this);
    const title = $item.find('h3').text().toLowerCase();
    
    if (title.includes(query)) {
      $item.show();
      highlightSearchTerms($item, query);
    } else {
      $item.hide();
    }
  });
  
  if (query.length > 0) {
    showAutocomplete(query);
  } else {
    $('#autocomplete').hide().empty();
    removeHighlights();
  }
});

function showAutocomplete(query) {
  const matches = products.filter(p => p.toLowerCase().includes(query));
  const $autocomplete = $('#autocomplete');
  
  if (matches.length > 0) {
    $autocomplete.empty();
    matches.forEach(match => {
      const $suggestion = $('<div class="autocomplete-item"></div>').text(match);
      $suggestion.on('click', function() {
        $('#search-bar').val(match);
        $('#autocomplete').hide().empty();
        $('#products-grid article').each(function() {
          const $item = $(this);
          const title = $item.find('h3').text();
          if (title === match) {
            $item.show();
          }
        });
      });
      $autocomplete.append($suggestion);
    });
    $autocomplete.show();
  } else {
    $autocomplete.hide().empty();
  }
}

function highlightSearchTerms($element, query) {
  removeHighlights();
  
  $element.find('h3, p').each(function() {
    const $target = $(this);
    let html = $target.html();
    
    if (query.length > 0) {
      const regex = new RegExp(`(${query})`, 'gi');
      html = html.replace(regex, '<mark class="highlight">$1</mark>');
      $target.html(html);
      highlightedElements.push($target);
    }
  });
}

function removeHighlights() {
  highlightedElements.forEach($el => {
    $el.find('mark.highlight').each(function() {
      const $mark = $(this);
      $mark.replaceWith($mark.text());
    });
  });
  highlightedElements = [];
}

$('#search-bar').on('blur', function() {
  setTimeout(() => $('#autocomplete').hide(), 200);
});

$('#search-bar').on('focus', function() {
  if ($(this).val().length > 0) {
    $('#autocomplete').show();
  }
});