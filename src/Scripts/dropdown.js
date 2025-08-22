// drop-down menu
document.querySelectorAll(".dropdown-toggle").forEach((btn) => {
  btn.addEventListener("click", function (e) {
    e.stopPropagation(); // prevent auto close immediately
    this.parentElement.classList.toggle("show");

    // Close other dropdowns
    document.querySelectorAll(".nav-item").forEach((drop) => {
      if (drop !== this.parentElement) {
        drop.classList.remove("show");
      }
    });
  });
});

// Close dropdown if clicked outside
window.addEventListener("click", function (e) {
  if (!e.target.closest(".nav-item")) {
    document.querySelectorAll(".nav-item").forEach((drop) => {
      drop.classList.remove("show");
    });
  }
});
