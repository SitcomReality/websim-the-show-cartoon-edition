export function showMenuTooltip(link) {
  // Remove existing tooltips to avoid clutter
  const existing = document.querySelector('.nav-tooltip');
  if (existing) existing.remove();

  const linkText = Array.from(link.childNodes)
    .filter(node => node.nodeType === Node.TEXT_NODE)
    .map(node => node.textContent.trim())
    .filter(text => text.length > 0)
    .join(' ');

  const tooltip = document.createElement('div');
  tooltip.className = 'nav-tooltip';
  tooltip.textContent = `Click again to go to ${linkText}`;
  
  // Append to the list item to keep positioning relative to it
  link.parentElement.appendChild(tooltip);

  // Trigger animation
  requestAnimationFrame(() => {
    tooltip.classList.add('is-visible');
  });

  // Auto-hide after a short duration
  setTimeout(() => {
    tooltip.classList.remove('is-visible');
    setTimeout(() => tooltip.remove(), 400);
  }, 2500);
}

export function closeAllMenus() {
  document.querySelectorAll('.is-open').forEach(el => el.classList.remove('is-open'));
}