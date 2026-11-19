// Homepage Promotional Banner Slider
document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".hero-slide");
  if (slides.length <= 1) return;

  let index = 0;
  function showSlide(nextIdx) {
    slides[index].classList.remove("active");
    index = (nextIdx + slides.length) % slides.length;
    slides[index].classList.add("active");
  }

  const prevBtn = document.getElementById("sliderPrev");
  const nextBtn = document.getElementById("sliderNext");
  if (prevBtn) prevBtn.addEventListener("click", () => showSlide(index - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => showSlide(index + 1));

  setInterval(() => showSlide(index + 1), 6000);
});
