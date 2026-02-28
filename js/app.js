import { Icons } from './components/Icons.js';
import { AudienceManager } from './components/AudienceManager.js';

class App {
  constructor() {
    this.bgAudience = new AudienceManager('bg-audience-container', true);
    this.fgAudience = new AudienceManager('fg-audience-container', false);
    this.init();
  }

  init() {
    this.renderIcons();
    this.setupResizeObserver();
    this.fgAudience.update(6); // Static foreground rows
  }

  renderIcons() {
    // Fill containers with SVG icons
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
      const newRows = Math.max(12, Math.floor(height / 40));
      this.bgAudience.update(newRows);
    };

    const observer = new ResizeObserver(updateRows);
    observer.observe(document.body);
    updateRows();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new App();
});