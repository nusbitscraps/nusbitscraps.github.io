document.addEventListener('DOMContentLoaded', () => {
  const navContainer = document.getElementById('main-nav');

  fetch('data/nav.json')
    .then(res => res.json())
    .then(menu => {
      if (!menu || menu.length === 0) return;

      const ul = document.createElement('ul');

      menu.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = item.url;
        a.textContent = item.title;

        // Highlight current page
        if (window.location.pathname.endsWith(item.url) || (window.location.pathname === '/' && item.url === 'index.html')) {
          a.classList.add('active');
        }

        li.appendChild(a);
        ul.appendChild(li);
      });

      navContainer.appendChild(ul);
    })
    .catch(err => {
      console.error("Failed to load nav.json:", err);
      navContainer.textContent = "Navigation could not load.";
    });
});
