const scrollToTopBtn = document.getElementById("BacktoTop");
window.onscroll = function () {
    scrollFunction();
};

function scrollFunction() {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        scrollToTopBtn.style.visibility = 'visible';
        scrollToTopBtn.style.opacity = '1';
    } else {
        scrollToTopBtn.style.visibility = 'hidden';
        scrollToTopBtn.style.opacity = '0';
    }
}

scrollToTopBtn.addEventListener("click", function () {
    // Smooth scroll back to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
});