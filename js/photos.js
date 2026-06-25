/* =====================================================================
   GHOST PEPPER — photo loader
   Swaps gradient placeholders for real images IF the file exists.
   Drop files into assets/photos/ named to match the slots below.
   Missing files simply stay as the trippy gradient placeholder.
   ===================================================================== */
(function () {
  // Fill the hero atmosphere layer (right-masked) if a hero image exists.
  const hero = document.querySelector('.hero__photo');
  if (hero) tryImg('assets/photos/hero.jpg', (url) => {
    hero.style.backgroundImage = `url("${url}")`;
    hero.classList.add('on');
  });

  // Fill any element with [data-photo="slug"] from assets/photos/slug.jpg
  document.querySelectorAll('[data-photo]').forEach(el => {
    const slug = el.dataset.photo;
    tryImg(`assets/photos/${slug}.jpg`, (url) => {
      el.style.backgroundImage = `url("${url}")`;
      el.classList.add('has-photo');
    });
  });

  function tryImg(url, ok) {
    const img = new Image();
    img.onload = () => ok(url);
    img.onerror = () => {};
    img.src = url;
  }
})();
