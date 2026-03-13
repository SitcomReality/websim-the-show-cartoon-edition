import { Icons } from '../components/Icons.js';

export function renderIcons() {
  document.querySelectorAll('[data-icon]').forEach(el => {
    const iconName = el.getAttribute('data-icon');
    if (Icons[iconName]) {
      el.innerHTML = Icons[iconName]();
    }
  });
}