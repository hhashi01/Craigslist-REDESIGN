window.accountCreated = sessionStorage.getItem("accountCreated") === "true";

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
    initDarkModeToggle();
    updateNavAccountBtn();       // ← move here, guaranteed to run after injection
    updateDrawerAccountState();  // ← add here, same reason

    const navHeight = document.getElementById('nav-placeholder').offsetHeight;
    document.body.style.paddingTop = navHeight + 'px';
  });

fetch('navigations/footer.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('footer-placeholder').innerHTML = html;
    loadStyle('navigations/footer.css');
  });

function updateNavAccountBtn() {
  const btn = document.getElementById("nav-account-btn");
  if (!btn) return;

  if (window.accountCreated) {
    btn.href      = "user_account.html";
    btn.innerHTML = "<b>Your Account</b>";
    btn.setAttribute("aria-label", "Go to your account");
  } else {
    btn.href      = "signup.html";
    btn.innerHTML = "<b>Sign Up</b>";
    btn.setAttribute("aria-label", "Sign up for an account");
  }
}

function updateDrawerAccountState() {
  const greeting     = document.getElementById("drawer-greeting");
  const nameLink     = document.getElementById("drawer-name-link");
  const drawerAvatar = document.getElementById("drawer-avatar");
  const drawerBtn    = document.getElementById("drawer-account-btn");

  if (!drawerBtn) return;

  if (window.accountCreated) {
    if (greeting)     greeting.textContent = "Welcome back,";
    if (nameLink)     nameLink.href        = "user_account.html";
    if (drawerAvatar) drawerAvatar.href    = "user_account.html";
    drawerBtn.textContent                  = "View my Account";
    drawerBtn.href                         = "user_account.html";
  } else {
    if (greeting)     greeting.textContent = "Hello, stranger!";
    if (nameLink)     nameLink.href        = "signup.html";
    if (drawerAvatar) drawerAvatar.href    = "signup.html";
    drawerBtn.textContent                  = "Sign Up";
    drawerBtn.href                         = "signup.html";
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    updateNavAccountBtn();
    updateDrawerAccountState();
  });
} else {
  updateNavAccountBtn();
  updateDrawerAccountState();
}