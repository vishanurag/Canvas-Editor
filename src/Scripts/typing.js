document.addEventListener("DOMContentLoaded", () => {
  const el = document.querySelector(".hero-title");

  if (!el) return;

  // Function to restart typing animation
  const startTyping = () => {
    el.classList.remove("typing-active");
    void el.offsetWidth; // Force reflow to restart animation
    el.classList.add("typing-active");
  };

  // Intersection Observer - starts when element is in view
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        startTyping();
      }
    },
    { threshold: 0.5 }
  );

  observer.observe(el);

  // Detect when user comes back to tab
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      // Only restart if element is visible in viewport
      const rect = el.getBoundingClientRect();
      if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
        startTyping();
      }
    }
  });
});
