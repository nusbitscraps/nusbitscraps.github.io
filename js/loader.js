(function() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  let imagesToLoad = new Set();
  let loadedCount = 0;
  let hasStartedLoading = false;
  const MAX_WAIT_TIME = 5000; // Maximum 5 seconds wait
  const VIEWPORT_BUFFER = 200; // Extra pixels below viewport to consider "above fold"
  let timeoutId;

  // Check if image is in viewport (above the fold)
  function isInViewport(img) {
    const rect = img.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    return rect.top < viewportHeight + VIEWPORT_BUFFER;
  }

  // Track image loading
  function trackImage(img) {
    if (imagesToLoad.has(img)) return; // Already tracking
    
    imagesToLoad.add(img);
    
    if (img.complete && img.naturalHeight !== 0) {
      // Image already loaded
      loadedCount++;
      checkIfReady();
    } else {
      // Wait for image to load
      img.addEventListener('load', () => {
        loadedCount++;
        checkIfReady();
      }, { once: true });
      
      img.addEventListener('error', () => {
        loadedCount++;
        checkIfReady();
      }, { once: true });
    }
  }

  // Check if we should hide the loader
  function checkIfReady() {
    const viewportImages = Array.from(imagesToLoad).filter(isInViewport);
    const viewportLoaded = viewportImages.filter(img => 
      img.complete || img.naturalHeight === 0
    ).length;

    // Priority: Wait for viewport images (above the fold) to load
    // This provides better UX as users see content immediately
    if (viewportImages.length > 0) {
      if (viewportLoaded === viewportImages.length) {
        hideLoader();
        return;
      }
    } else {
      // No viewport images yet, check if we have any images at all
      if (imagesToLoad.size === 0 && hasStartedLoading) {
        // No images found, hide after a short delay
        setTimeout(hideLoader, 300);
        return;
      }
      // If we have images but none in viewport yet, wait a bit more
      if (imagesToLoad.size > 0 && loadedCount === imagesToLoad.size) {
        // All images loaded but none were in viewport (edge case)
        hideLoader();
      }
    }
  }

  function hideLoader() {
    if (timeoutId) clearTimeout(timeoutId);
    loader.classList.add('fade-out');
  }

  // Watch for dynamically added images
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) { // Element node
          // Check if the added node is an image
          if (node.tagName === 'IMG') {
            trackImage(node);
          }
          // Check for images inside the added node
          const imgs = node.querySelectorAll ? node.querySelectorAll('img') : [];
          imgs.forEach(trackImage);
        }
      });
    });
  });

  // Start observing when DOM is ready
  function init() {
    hasStartedLoading = true;
    
    // Track existing images
    const existingImgs = Array.from(document.images);
    if (existingImgs.length > 0) {
      existingImgs.forEach(trackImage);
    } else {
      // No images initially, wait a bit for dynamic content
      setTimeout(() => {
        const dynamicImgs = Array.from(document.images);
        if (dynamicImgs.length === 0) {
          hideLoader();
        } else {
          dynamicImgs.forEach(trackImage);
        }
      }, 100);
    }

    // Start observing the document for new images
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Fallback: hide loader after max wait time
    timeoutId = setTimeout(() => {
      hideLoader();
    }, MAX_WAIT_TIME);

    // Check immediately and periodically
    checkIfReady();
    setTimeout(checkIfReady, 500);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Also check when window loads (for images loaded via CSS or other means)
  window.addEventListener('load', () => {
    setTimeout(checkIfReady, 200);
  });
})();
