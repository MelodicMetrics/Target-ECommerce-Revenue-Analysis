document.addEventListener('DOMContentLoaded', () => {
  const breadcrumbsWrapper = document.querySelector('.breadcrumbs-wrapper');
  let lastScrollTop = 0;
  let isMinimized = false;

  // Handle scroll to toggle minimized state
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop === 0) {
      // User is at the top of the page: expand breadcrumbs
      breadcrumbsWrapper.classList.remove('minimized');
      isMinimized = false;
    } else if (scrollTop > lastScrollTop && !isMinimized) {
      // Scrolling down: minimize breadcrumbs
      breadcrumbsWrapper.classList.add('minimized');
      isMinimized = true;
    }

    lastScrollTop = Math.max(scrollTop, 0); // Prevent negative scrolling
  });

  // Expand breadcrumbs on hover
  breadcrumbsWrapper.addEventListener('mouseenter', () => {
    breadcrumbsWrapper.classList.remove('minimized');
    isMinimized = false; // Update state
  });

  // Revert to minimized state on mouse leave
  breadcrumbsWrapper.addEventListener('mouseleave', () => {
    if (window.pageYOffset > 0) {
      // Minimize only if not at the top of the page
      breadcrumbsWrapper.classList.add('minimized');
      isMinimized = true; // Update state
    }
  });
});
