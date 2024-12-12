document.addEventListener('DOMContentLoaded', function () {
  const sectionId = window.location.hash.substring(1); // Get the ID from the URL hash
  if (sectionId) {
    const details = document.querySelector(`.section-details#${sectionId}`);
    if (details) {
      details.setAttribute('open', ''); // Automatically open the details section

      // Add highlight class
      details.classList.add('highlight-section');

      // Trigger fade-out after a short duration
      setTimeout(() => {
        // Allow breathing animation to run during the fade-out
        details.classList.add('fade-out');
        setTimeout(() => {
          // Stop the animation and clean up after the fade is complete
          details.classList.remove('highlight-section', 'fade-out');
        }, 3000); // Match the opacity transition duration
      }, 3000); // Highlight lasts for 3 seconds before fading out
    }
  }
});
