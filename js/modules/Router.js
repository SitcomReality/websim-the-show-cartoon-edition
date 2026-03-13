import { renderIcons } from '../utils/IconRenderer.js';
import { initCarousel } from './Carousel.js';
import { setupForms } from './Forms.js';

let isTransitioning = false;

export function isNavigating() {
  return isTransitioning;
}

export async function navigateTo(path, push = true) {
  if (isTransitioning) return;
  isTransitioning = true;

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

      // 6. Re-render icons and re-init components for new content
      renderIcons();
      initCarousel();
      setupForms();
      
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
    isTransitioning = false;
  }, 600);
}