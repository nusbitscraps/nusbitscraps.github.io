document.addEventListener('DOMContentLoaded', () => {
  const navContainer = document.getElementById('main-nav');

  fetch('data/nav.json')
    .then(res => res.json())
    .then(menu => {
      if (!menu || menu.length === 0) return;

      // Create hamburger button for mobile
      const hamburger = document.createElement('button');
      hamburger.classList.add('hamburger');
      hamburger.setAttribute('aria-label', 'Toggle menu');
      hamburger.innerHTML = '<span></span><span></span><span></span>';
      
      // Create menu container
      const menuContainer = document.createElement('div');
      menuContainer.classList.add('nav-menu-container');
      
      const ul = document.createElement('ul');
      ul.classList.add('nav-menu');

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

      menuContainer.appendChild(ul);
      navContainer.appendChild(hamburger);
      navContainer.appendChild(menuContainer);

      // Toggle menu on hamburger click
      hamburger.addEventListener('click', () => {
        navContainer.classList.toggle('nav-open');
        hamburger.classList.toggle('active');
      });

      // Close menu when clicking on a link
      ul.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
          navContainer.classList.remove('nav-open');
          hamburger.classList.remove('active');
        }
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!navContainer.contains(e.target)) {
          navContainer.classList.remove('nav-open');
          hamburger.classList.remove('active');
        }
      });
    })
    .catch(err => {
      console.error("Failed to load nav.json:", err);
      navContainer.textContent = "Navigation could not load.";
    });
});
