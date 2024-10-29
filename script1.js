document.getElementById('feedbackForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Show thank you message
    const thankYouMessage = document.getElementById('thankyouMessage');
    thankYouMessage.textContent = "Thank you for your feedback!";
    thankYouMessage.style.display = "block";

    // Optionally, clear the form
    document.getElementById('feedbackForm').reset();
});