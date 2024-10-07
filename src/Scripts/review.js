document.getElementById('reviewForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Get the form values
    const name = document.getElementById('name').value;
    const rating = document.getElementById('rating').value;
    const review = document.getElementById('review').value;

    const date = new Date().toLocaleDateString();

    

    // Create a new review element
    const reviewItem = document.createElement('div');
    reviewItem.classList.add('review');

    reviewItem.innerHTML = `
        
        <div class="review-content">
            <h3>${name}</h3>
            <div class="rating">${'★'.repeat(rating)}</div>
            <p>${review}</p>
            <small>Reviewed on ${date}</small>
        </div>
    `;

    // Append the new review to the reviews list
    document.getElementById('reviewsList').appendChild(reviewItem);

    // Clear the form
    document.getElementById('reviewForm').reset();
});
