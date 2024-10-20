// document.getElementById("saveAsImageBtn").addEventListener("click", function () {
//     const canvas = document.getElementById("mainCanvas");
    
//     if (!canvas) {
//         alert("Canvas element not found!");
//         return;
//     }

//     try {
//         const imageType = "image/png"; // or "image/jpeg" for JPEG format
//         const imageData = canvas.toDataURL(imageType);

//         // Create a temporary download link
//         const downloadLink = document.createElement("a");
//         downloadLink.href = imageData;
//         downloadLink.download = "canvas_image.png"; // Specify the filename
//         downloadLink.click(); // Trigger the download
//     } catch (error) {
//         console.error("Error generating image data:", error);
//         alert("Failed to save the image. Please try again.");
//     }
// });
function saveCanvasAsImage(canvasId, filename = 'canvas_image.png') {
    const canvas = document.getElementById(canvasId);
    
    if (!canvas) {
        alert("Canvas element not found!");
        return;
    }

    try {
        const imageType = "image/png"; // You can use "image/jpeg" for JPEG format
        const imageData = canvas.toDataURL(imageType);

        // Create a temporary download link
        const downloadLink = document.createElement("a");
        downloadLink.href = imageData;
        downloadLink.download = filename; // Specify the filename
        downloadLink.click(); // Trigger the download
    } catch (error) {
        console.error("Error generating image data:", error);
        alert("Failed to save the image. Please try again.");
    }
}

// Usage example:
document.getElementById("saveAsImageBtn").addEventListener("click", function () {
    saveCanvasAsImage("mainCanvas");
});
