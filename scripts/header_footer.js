function loadStyle(href) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

fetch('navigations/header.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('nav-placeholder').innerHTML = html;
    loadStyle('navigations/header.css');
    initHamburger();
    initDarkModeToggle(); // wire up toggles after nav HTML exists
  });

fetch('navigations/footer.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('footer-placeholder').innerHTML = html;
    loadStyle('navigations/footer.css');
  });

  fetch('navigations/header.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('nav-placeholder').innerHTML = html;
    loadStyle('navigations/header.css');
    initHamburger();
    initDarkModeToggle();

    // Offset page content by nav height
    const navHeight = document.getElementById('nav-placeholder').offsetHeight;
    document.querySelector('.page-content').style.paddingTop = navHeight + 'px';
  });

  