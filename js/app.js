import { renderIcons } from './utils/IconRenderer.js';
import { AudienceManager } from './components/AudienceManager.js';
import { initCarousel } from './modules/Carousel.js';
import { setupForms } from './modules/Forms.js';
import { navigateTo, isNavigating } from './modules/Router.js';
import { showMenuTooltip, closeAllMenus } from './modules/Navigation.js';

class App {
  constructor() {
    this.bgAudience = new AudienceManager('bg-audience-container', true);
    this.init();
  }

  init() {
    renderIcons();
    this.setupResizeObserver();
    this.setupClickDelegation();
    initCarousel();
    setupForms();

    window.addEventListener('popstate', () => {
      navigateTo(window.location.pathname, false);
    });
  }

  setupResizeObserver() {
    const updateRows = () => {
      const height = document.body.scrollHeight;
      const newRows = Math.max(12, Math.floor(height / 48));
      this.bgAudience.update(newRows);
    };

    const observer = new ResizeObserver(updateRows);
    observer.observe(document.body);
    updateRows();
  }

  setupClickDelegation() {
    document.addEventListener('click', (e) => {
      // 1. Menu Button
      const menuBtn = e.target.closest('.interactive-btn');
      if (menuBtn && menuBtn.parentElement.classList.contains('dropdown')) {
        const dropdown = menuBtn.parentElement;
        const wasOpen = dropdown.classList.contains('is-open');
        
        closeAllMenus();

        if (!wasOpen) {
          dropdown.classList.add('is-open');
          menuBtn.setAttribute('aria-expanded', 'true');
        } else {
          menuBtn.setAttribute('aria-expanded', 'false');
        }
        return;
      }

      // 2. Navigation
      const link = e.target.closest('.nav-link');
      if (link && link.href && !isNavigating()) {
        const item = link.parentElement;
        const hasSubmenu = link.classList.contains('has-submenu');

        if (hasSubmenu && !item.classList.contains('is-open')) {
          e.preventDefault();
          const siblings = item.parentElement.querySelectorAll(':scope > .dropdown-item.is-open');
          siblings.forEach(s => s.classList.remove('is-open'));
          item.classList.add('is-open');
          showMenuTooltip(link);
          return;
        }

        const url = new URL(link.href);
        if (url.origin === window.location.origin) {
          e.preventDefault();
          closeAllMenus();
          navigateTo(link.getAttribute('href'));
        }
      } else if (!e.target.closest('.dropdown')) {
        closeAllMenus();
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new App();
});