export function initCarousel() {
  const container = document.querySelector('.carousel-container');
  if (!container) return;

  const track = container.querySelector('.carousel-track');
  const slides = Array.from(container.querySelectorAll('.carousel-slide'));
  const nextBtn = container.querySelector('.next-btn');
  const prevBtn = container.querySelector('.prev-btn');
  const dots = Array.from(container.querySelectorAll('.carousel-dot'));
  
  let currentIndex = 0;
  const slideCount = slides.length;

  const updateCarousel = (index) => {
    currentIndex = (index + slideCount) % slideCount;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
    
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentIndex);
    });
  };

  nextBtn?.addEventListener('click', () => updateCarousel(currentIndex + 1));
  prevBtn?.addEventListener('click', () => updateCarousel(currentIndex - 1));

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => updateCarousel(i));
  });

  // Optional: Auto-play
  let interval = setInterval(() => updateCarousel(currentIndex + 1), 6000);
  container.addEventListener('mouseenter', () => clearInterval(interval));
  container.addEventListener('mouseleave', () => {
    clearInterval(interval);
    interval = setInterval(() => updateCarousel(currentIndex + 1), 6000);
  });
}