import { Icons } from './components/Icons.js';
import { AudienceManager } from './components/AudienceManager.js';

class App {
  constructor() {
    this.bgAudience = new AudienceManager('bg-audience-container', true);
    this.isTransitioning = false;
    this.init();
  }

  init() {
    this.renderIcons();
    this.setupResizeObserver();
    this.setupRouting();
  }

  renderIcons() {
    document.querySelectorAll('[data-icon]').forEach(el => {
      const iconName = el.getAttribute('data-icon');
      if (Icons[iconName]) {
        el.innerHTML = Icons[iconName]();
      }
    });
  }

  setupResizeObserver() {
    const updateRows = () => {
      const height = document.body.scrollHeight;
      // Adjusted row spacing to account for slightly taller members and overlap
      const newRows = Math.max(12, Math.floor(height / 48));
      this.bgAudience.update(newRows);
    };

    const observer = new ResizeObserver(updateRows);
    observer.observe(document.body);
    updateRows();
  }

  setupRouting() {
    // Intercept clicks on navigation links and handle dropdown toggles
    document.addEventListener('click', (e) => {
      // 1. Handle Menu Button (Mobile/Tablet toggle)
      const menuBtn = e.target.closest('.interactive-btn');
      if (menuBtn && menuBtn.parentElement.classList.contains('dropdown')) {
        const dropdown = menuBtn.parentElement;
        const wasOpen = dropdown.classList.contains('is-open');
        
        // Close all others first
        document.querySelectorAll('.dropdown.is-open, .dropdown-item.is-open').forEach(el => {
          el.classList.remove('is-open');
        });

        if (!wasOpen) {
          dropdown.classList.add('is-open');
          menuBtn.setAttribute('aria-expanded', 'true');
        } else {
          menuBtn.setAttribute('aria-expanded', 'false');
        }
        return;
      }

      // 2. Handle Navigation and Submenus
      const link = e.target.closest('.nav-link');
      if (link && link.href && !this.isTransitioning) {
        const item = link.parentElement;
        const hasSubmenu = link.classList.contains('has-submenu');

        // Unified behavior: first click opens submenu, second click navigates
        if (hasSubmenu) {
          if (!item.classList.contains('is-open')) {
            e.preventDefault();
            // Close siblings at the same level
            const siblings = item.parentElement.querySelectorAll(':scope > .dropdown-item.is-open');
            siblings.forEach(s => s.classList.remove('is-open'));
            item.classList.add('is-open');
            return;
          }
        }

        // Standard navigation for actual links (or second click on submenu parent)
        const url = new URL(link.href);
        if (url.origin === window.location.origin) {
          e.preventDefault();
          
          // Close all menus before transition
          document.querySelectorAll('.is-open').forEach(el => el.classList.remove('is-open'));
          
          this.navigateTo(link.getAttribute('href'));
        }
      } else if (!e.target.closest('.dropdown')) {
        // Clicked outside - close all menus
        document.querySelectorAll('.is-open').forEach(el => el.classList.remove('is-open'));
      }
    });

    // Handle back/forward buttons
    window.addEventListener('popstate', () => {
      this.navigateTo(window.location.pathname, false);
    });
  }

  async navigateTo(path, push = true) {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    // 1. Close Curtains
    document.body.classList.add('curtains-closed');
    
    // Wait for curtains to close (animation duration is 0.6s)
    await new Promise(r => setTimeout(r, 600));

    try {
      // 2. Fetch new content
      const response = await fetch(path);
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      const newContent = doc.querySelector('.site-main');
      const currentContent = document.querySelector('.site-main');

      if (newContent && currentContent) {
        // 3. Swap main-content-area
        currentContent.innerHTML = newContent.innerHTML;
        
        // 4. Update Title and Body Class
        document.title = doc.title;
        document.body.className = doc.body.className;

        // 5. Update History
        if (push) {
          window.history.pushState({}, '', path);
        }

        // 6. Re-render icons for new content
        this.renderIcons();
        
        // Scroll to top
        window.scrollTo(0, 0);
      }
    } catch (err) {
      console.error('Navigation failed:', err);
    }

    // 7. Open Curtains
    // Small delay to ensure browser has painted the new content
    await new Promise(r => setTimeout(r, 100));
    document.body.classList.remove('curtains-closed');
    
    // Reset transition flag after curtains are open
    setTimeout(() => {
      this.isTransitioning = false;
    }, 600);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new App();
});