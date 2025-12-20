(function(){
  // Initialize accordions inside a container. Keeps only one open at a time.
  window.initAccordions = function(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    // select all direct section children inside the container so different pages are supported
    const sections = Array.from(container.querySelectorAll('section'));
    if (!sections.length) return;

    sections.forEach((sec, idx) => {
      // normalize class so CSS accordion styles apply
      if (!sec.classList.contains('year-section')) {
        sec.classList.add('year-section');
      }

      const h2 = sec.querySelector('h2');
      if (!h2) return;

      // Ensure there's a collapsible body wrapper
      let body = sec.querySelector('.collapsible-body');
      if (!body) {
        body = document.createElement('div');
        body.classList.add('collapsible-body');

        // Move everything after h2 into body, but stop when the next sibling is another SECTION
        let nxt = h2.nextSibling;
        while (nxt) {
          // if this sibling is an element node and is a SECTION, stop — it's the next section
          if (nxt.nodeType === 1 && nxt.tagName.toLowerCase() === 'section') break;

          const cur = nxt;
          nxt = cur.nextSibling;
          body.appendChild(cur);
        }
        sec.appendChild(body);
      }

      h2.classList.add('year-toggle');
      h2.setAttribute('tabindex', '0');
      h2.setAttribute('role', 'button');

      // Prepare initial inline maxHeight so CSS transitions work
      // closed: maxHeight = 0; open: set to scrollHeight
      if (idx === 0) {
        sec.classList.add('open');
        h2.setAttribute('aria-expanded', 'true');
        // set maxHeight to content height so it is visible
        body.style.maxHeight = body.scrollHeight + 'px';
      } else {
        sec.classList.remove('open');
        h2.setAttribute('aria-expanded', 'false');
        body.style.maxHeight = '0px';
      }

      const closeSection = (s, b, header) => {
        // animate collapse by setting from current height to 0
        b.style.maxHeight = b.scrollHeight + 'px';
        // force reflow then set to 0
        requestAnimationFrame(() => {
          b.style.maxHeight = '0px';
        });

        const onEnd = function() {
          // remove open class after transition completes
          s.classList.remove('open');
          b.removeEventListener('transitionend', onEnd);
        };
        b.addEventListener('transitionend', onEnd);
        if (header) header.setAttribute('aria-expanded', 'false');
      };

      const openSection = (s, b, header) => {
        // add open class so padding / styles apply, then animate to full height
        s.classList.add('open');
        // set to content height
        b.style.maxHeight = b.scrollHeight + 'px';
        if (header) header.setAttribute('aria-expanded', 'true');
      };

      const toggle = () => {
        const currentlyOpen = container.querySelector('section.open');
        if (currentlyOpen && currentlyOpen !== sec) {
          const openBody = currentlyOpen.querySelector('.collapsible-body');
          const openH2 = currentlyOpen.querySelector('.year-toggle');
          if (openBody) closeSection(currentlyOpen, openBody, openH2);
        }

        const isOpen = sec.classList.contains('open');
        if (isOpen) {
          closeSection(sec, body, h2);
        } else {
          openSection(sec, body, h2);
        }
      };

      h2.addEventListener('click', toggle);
      h2.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      });
    });
  };

  // Image zoom modal
  (function(){
    let modal = null;

    function createModal() {
      modal = document.createElement('div');
      modal.className = 'image-modal';
      modal.innerHTML = '<div class="image-modal-backdrop"></div><img class="image-modal-img" src="" alt="">';
      document.body.appendChild(modal);

      modal.addEventListener('click', (e) => {
        // close when clicking backdrop or image
        closeModal();
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
      });
    }

    function openModal(src, alt) {
      if (!modal) createModal();
      const img = modal.querySelector('.image-modal-img');
      img.src = src;
      img.alt = alt || '';
      modal.classList.add('open');
    }

    function closeModal() {
      if (!modal) return;
      modal.classList.remove('open');
      const img = modal.querySelector('.image-modal-img');
      img.src = '';
      img.alt = '';
    }

    // Delegate clicks on document for images inside image-gallery
    document.addEventListener('click', (e) => {
      const img = e.target.closest && e.target.closest('.image-gallery img');
      if (img) {
        openModal(img.src, img.alt);
      }
    });
  })();

})();
