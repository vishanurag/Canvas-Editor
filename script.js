document.addEventListener('mousemove', (e) => {
  const sparkle = document.createElement('div');
  sparkle.classList.add('sparkle');
  document.querySelector('.sparkles-container').appendChild(sparkle);

  sparkle.style.left = `${e.pageX - 5}px`;
  sparkle.style.top = `${e.pageY - 5}px`;

  setTimeout(() => {
    sparkle.remove();
  }, 600);  // Sparkles disappear after 0.6 seconds (matching animation duration)
});
