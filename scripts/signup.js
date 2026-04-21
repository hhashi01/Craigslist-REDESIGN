window.accountCreated = sessionStorage.getItem("accountCreated") === "true";

/* --------------------------------------------------------------------------
   NAV — swap "Sign Up" ↔ "Your Account" on desktop and in drawer
   -------------------------------------------------------------------------- */

function updateDrawerAccountState() {
  const greeting = document.getElementById("drawer-greeting");
  const nameLink = document.getElementById("drawer-name-link");
  const drawerAvatar = document.getElementById("drawer-avatar");
  const drawerBtn = document.getElementById("drawer-account-btn");

  if (!drawerBtn) return;

  if (window.accountCreated) {
    if (greeting) greeting.textContent = "Welcome back,";
    if (nameLink) nameLink.href = "user_account.html";
    if (drawerAvatar) drawerAvatar.href = "user_account.html";
    drawerBtn.textContent = "View my Account";
    drawerBtn.href = "user_account.html";
  } else {
    if (greeting) greeting.textContent = "Hello, stranger!";
    if (nameLink) nameLink.href = "signup.html";
    if (drawerAvatar) drawerAvatar.href = "signup.html";
    drawerBtn.textContent = "Sign Up";
    drawerBtn.href = "signup.html";
  }
}

/* --------------------------------------------------------------------------
   VALIDATION RULES
   -------------------------------------------------------------------------- */

const RULES = {
  name: {
    validate(val) {
      if (!val.trim()) return "Full name is required.";
      if (val.trim().length < 2) return "Name must be at least 2 characters.";
      if (val.trim().length > 50) return "Name must be 50 characters or fewer.";
      if (!/^[A-Za-zÀ-ÿ\s'\-]+$/.test(val.trim())) return "Name can only contain letters, spaces, hyphens, or apostrophes.";
      return null;
    },
  },
  email: {
    validate(val) {
      if (!val.trim()) return "Email address is required.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val.trim())) return "Enter a valid email address — e.g. you@example.com.";
      return null;
    },
  },
  phone: {
    validate(val) {
      if (!val.trim()) return null; // optional
      const digits = val.replace(/\D/g, "");
      if (digits.length < 10) return "Phone number must have at least 10 digits.";
      if (digits.length > 11) return "Phone number is too long — enter 10 digits.";
      return null;
    },
  },
  password: {
    validate(val) {
      if (!val) return "Password is required.";
      if (val.length < 8) return "Password must be at least 8 characters.";
      if (!/[A-Z]/.test(val)) return "Add at least one uppercase letter (A–Z).";
      if (!/[a-z]/.test(val)) return "Add at least one lowercase letter (a–z).";
      if (!/[0-9]/.test(val)) return "Add at least one number (0–9).";
      return null;
    },
  },
  confirm: {
    validate(val) {
      if (!val) return "Please confirm your password.";
      if (val !== document.getElementById("password").value) return "Passwords do not match — check and try again.";
      return null;
    },
  },
};

/* --------------------------------------------------------------------------
   PASSWORD STRENGTH METER
   -------------------------------------------------------------------------- */

function scorePassword(val) {
  if (!val) return { score: 0, label: "", color: "" };

  let score = 0;
  if (val.length >= 8) score++;
  if (val.length >= 12) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[a-z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;

  const levels = [
    { max: 2, label: "Weak",   color: "#ef4444" },
    { max: 3, label: "Fair",   color: "#f59e0b" },
    { max: 4, label: "Good",   color: "#3b82f6" },
    { max: 6, label: "Strong", color: "#22c55e" }
  ];

  const level = levels.find(l => score <= l.max);
  return { score, label: level.label, color: level.color };
}

function updateStrengthMeter(val) {
  const wrap = document.getElementById("strength-wrap");
  const fill = document.getElementById("strength-fill");
  const text = document.getElementById("strength-text");

  if (!val) { wrap.hidden = true; return; }

  wrap.hidden = false;
  const { score, label, color } = scorePassword(val);
  const pct = Math.round((score / 6) * 100);
  fill.style.cssText   = `width:${pct}%;background:${color}`;
  text.textContent     = label;
  text.style.color     = color;
}

/* --------------------------------------------------------------------------
   FIELD STATE
   -------------------------------------------------------------------------- */

function setFieldState(fieldId, state, message = "") {
  const input = document.getElementById(fieldId);
  const error = document.getElementById(`${fieldId}-error`);
  const icon  = input.parentElement.querySelector(".field-icon");

  input.classList.remove("field-valid", "field-invalid");
  if (icon) { icon.textContent = ""; icon.classList.remove("icon-success", "icon-error"); }
  error.textContent = "";
  error.classList.remove("visible");

  if (state === "error") {
    input.classList.add("field-invalid");
    error.textContent = message;
    error.classList.add("visible");
    if (icon) { icon.textContent = "✕"; icon.classList.add("icon-error"); }
  } else if (state === "success") {
    input.classList.add("field-valid");
    if (icon) { icon.textContent = "✓"; icon.classList.add("icon-success"); }
  }
}

function validateField(fieldId) {
  const rule = RULES[fieldId];
  if (!rule) return true;
  const error = rule.validate(document.getElementById(fieldId).value);
  if (error) { setFieldState(fieldId, "error", error); return false; }
  setFieldState(fieldId, "success");
  return true;
}

/* --------------------------------------------------------------------------
   MAIN
   -------------------------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {

  const form    = document.getElementById("signupForm");
  const success = document.getElementById("signup-success");

  // signup.js may be loaded on pages without the form — bail if so
  if (!form) return;

  const allIds  = ["name", "email", "phone", "password", "confirm"];
  const touched = new Set();

  document.querySelectorAll(".toggle-pw").forEach(btn => {
    const input = document.getElementById(btn.dataset.target);
    if (input) input.classList.add("has-toggle");
  });

  allIds.forEach(id => {
    const input = document.getElementById(id);
    if (!input) return;

    input.addEventListener("blur", () => {
      touched.add(id);
      validateField(id);
      if (id === "password" && touched.has("confirm")) validateField("confirm");
    });

    input.addEventListener("input", () => {
      if (id === "phone")    formatPhoneInput(input);
      if (id === "password") {
        updateStrengthMeter(input.value);
        if (touched.has("confirm")) validateField("confirm");
      }
      if (touched.has(id)) validateField(id);
    });
  });

  // Show/hide password toggle
  document.querySelectorAll(".toggle-pw").forEach(btn => {
    btn.addEventListener("click", () => {
      const input   = document.getElementById(btn.dataset.target);
      const showing = input.type === "text";
      input.type      = showing ? "password" : "text";
      btn.textContent = showing ? "Show" : "Hide";
    });
  });

  // Submit
  form.addEventListener("submit", e => {
    e.preventDefault();

    let allValid = true;
    allIds.forEach(id => {
      touched.add(id);
      if (!validateField(id)) allValid = false;
    });

    if (!allValid) {
      const firstBad = allIds.find(id =>
        document.getElementById(id).classList.contains("field-invalid")
      );
      if (firstBad) document.getElementById(firstBad).focus();
      return;
    }

    // Success
    window.accountCreated = true;
    sessionStorage.setItem("accountCreated", "true");

    form.hidden    = true;
    success.hidden = false;
    success.focus();
  });
});