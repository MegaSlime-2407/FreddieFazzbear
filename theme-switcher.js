// theme-switcher.js - Dark/Light Mode with Local Storage Persistence

class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.toggleBtn = null;
        this.mobileQuery = window.matchMedia('(max-width: 1024px)');
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
        
        this.syncPlacement(true);
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

        if (this.mobileQuery && this.mobileQuery.addEventListener) {
            this.mobileQuery.addEventListener('change', () => this.syncPlacement());
        } else if (this.mobileQuery && this.mobileQuery.addListener) {
            this.mobileQuery.addListener(() => this.syncPlacement());
        }

        window.addEventListener('resize', () => {
            this.syncPlacement();
            if (this.toggleBtn) {
                this.toggleBtn.blur();
            }
        });
    }

    syncPlacement(force = false) {
        if (!this.toggleBtn) return;
        const nav = document.querySelector('header nav');
        const header = document.querySelector('header .wrapper');
        const isMobile = this.mobileQuery ? this.mobileQuery.matches : window.innerWidth <= 1024;
        const target = isMobile ? header : nav;
        if (target && this.toggleBtn.parentElement !== target) {
            target.appendChild(this.toggleBtn);
        }

        if (!target && header && force) {
            header.appendChild(this.toggleBtn);
        }

        if (isMobile) {
            this.toggleBtn.classList.add('is-mobile-toggle');
        } else {
            this.toggleBtn.classList.remove('is-mobile-toggle');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const manager = new ThemeManager();
    manager.syncPlacement();
    window.addEventListener('load', () => manager.syncPlacement());
    window.addEventListener('resize', () => manager.syncPlacement());
});