document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');

  // Get all images currently on the page
  const imgs = Array.from(document.images);
  let loadedCount = 0;

  if (imgs.length === 0) {
    loader.classList.add('fade-out'); // no images, hide immediately
    return;
  }

  const checkAllLoaded = () => {
    loadedCount++;
    if (loadedCount === imgs.length) {
      loader.classList.add('fade-out');
    }
  };

  imgs.forEach(img => {
    if (img.complete) {
      checkAllLoaded();
    } else {
      img.addEventListener('load', checkAllLoaded);
      img.addEventListener('error', checkAllLoaded);
    }
  });
});
