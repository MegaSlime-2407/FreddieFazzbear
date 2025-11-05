// theme-switcher.js - Dark/Light Mode with Local Storage Persistence

class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.toggleBtn = null;
        this.applyTheme(); 
        this.init();
    }

    init() {
        this.createToggleButton();
        this.addEventListeners();
    }

    createToggleButton() {
        this.toggleBtn = document.createElement('button');
        this.toggleBtn.className = 'theme-toggle';
        this.toggleBtn.setAttribute('aria-label', 'Toggle dark mode');
        this.toggleBtn.innerHTML = this.theme === 'light' ? '🌙' : '☀️';
        this.toggleBtn.title = 'Switch theme';
        
        const nav = document.querySelector('nav');
        if (nav) {
            nav.appendChild(this.toggleBtn);
        }
    }

    applyTheme() {
        if (this.theme === 'dark') {
            document.documentElement.classList.add('dark-theme'); 
            if (this.toggleBtn) this.toggleBtn.innerHTML = '☀️';
        } else {
            document.documentElement.classList.remove('dark-theme'); 
            if (this.toggleBtn) this.toggleBtn.innerHTML = '🌙';
        }
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.theme);
        this.applyTheme();
    }

    addEventListeners() {
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => this.toggleTheme());
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
});