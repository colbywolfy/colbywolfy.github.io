// Mobile menu toggle
const btn = document.getElementById('menu-btn');
const nav = document.getElementById('nav');

btn.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  btn.setAttribute('aria-expanded', open);
});

nav.addEventListener('click', e => {
  if (e.target.tagName === 'A') {
    nav.classList.remove('open');
    btn.setAttribute('aria-expanded', false);
  }
});

// Highlight the nav link for the section in view
const links = [...nav.querySelectorAll('a')];

const spy = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      links.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

document.querySelectorAll('main section').forEach(s => spy.observe(s));

// Click any project image to view it full screen
const dialog = document.createElement('dialog');
dialog.className = 'lightbox';
dialog.setAttribute('aria-label', 'Enlarged image');
dialog.innerHTML = '<button class="close" type="button" aria-label="Close image">&times;</button><img alt="">';
document.body.appendChild(dialog);

const bigImg = dialog.querySelector('img');

document.querySelectorAll('.card img').forEach(img => {
  const zoom = document.createElement('button');
  zoom.type = 'button';
  zoom.className = 'zoom';
  zoom.setAttribute('aria-label', 'Enlarge image: ' + img.alt);
  img.replaceWith(zoom);
  zoom.appendChild(img);

  zoom.addEventListener('click', () => {
    bigImg.src = img.src;
    bigImg.alt = img.alt;
    dialog.showModal();
  });
});

// Close on the X button or by clicking outside the image (Esc works automatically)
dialog.addEventListener('click', e => {
  if (e.target !== bigImg) {
    dialog.close();
  }
});

// Contact form: validate, then send to Formspree without leaving the page
const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');

form.addEventListener('submit', async e => {
  e.preventDefault();

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.value);

  if (!form.name.value.trim() || !emailOk || !form.message.value.trim()) {
    status.textContent = 'Please enter your name, a valid email address and a message.';
    return;
  }

  try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    });

    if (res.ok) {
      status.textContent = 'Thanks, your message was sent.';
      form.reset();
    } else {
      status.textContent = 'The message could not be sent. Please email me directly.';
    }
  } catch {
    status.textContent = 'Network error. Please email me directly.';
  }
});