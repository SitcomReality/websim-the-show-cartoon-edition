export function setupForms() {
  document.querySelectorAll('form.theatrical-form').forEach(form => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      // Handle form submission logic here in the future
    });
  });
}