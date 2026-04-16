/* window.accountCreated  {boolean}
  false on initial page load; set to true when the form submits
  successfully. Other scripts can read this flag to conditionally
  show login/logout UI, redirect, etc.*/

window.accountCreated = false;

/* --------------------------------------------------------------------------
   NAV BUTTON — swap "Sign Up" ↔ "Your Account"

   updateNavAccountBtn() reads window.accountCreated and updates the
   #nav-account-btn anchor text + href accordingly.

   watchForNav() uses a MutationObserver on #nav-placeholder so the check
   runs automatically on every page once header_footer.js injects the nav.
   It also gets called directly after a successful sign-up (same session).
   -------------------------------------------------------------------------- */

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

function watchForNav() {
  const placeholder = document.getElementById("nav-placeholder");
  if (!placeholder) return;

  if (document.getElementById("nav-account-btn")) {
    updateNavAccountBtn();
    return;
  }

  const observer = new MutationObserver(() => {
    if (document.getElementById("nav-account-btn")) {
      updateNavAccountBtn();
      observer.disconnect();
    }
  });

  observer.observe(placeholder, { childList: true, subtree: true });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", watchForNav);
} else {
  watchForNav();
}

/* Validation: each entry maps a field id → { validate(value) → string | null }
   Returning a string means invalid; null means valid. */

const RULES = {
  name: {
    validate(val) {
      if (!val.trim())
        return "Full name is required.";
      if (val.trim().length < 2)
        return "Name must be at least 2 characters.";
      if (val.trim().length > 50)
        return "Name must be 50 characters or fewer.";
      if (!/^[A-Za-zÀ-ÿ\s'\-]+$/.test(val.trim()))
        return "Name can only contain letters, spaces, hyphens, or apostrophes.";
      return null;
    },
  },

  email: {
    validate(val) {
      if (!val.trim())
        return "Email address is required.";
      // I'm gonna be honest. The specfic reg-ex here is beyond me.
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val.trim()))
        return "Enter a valid email address — e.g. you@example.com.";
      return null;
    },
  },

  phone: {
    validate(val) {
      // Optional: pass if empty
      if (!val.trim()) return null;
      const digits = val.replace(/\D/g, "");
      if (digits.length < 10)
        return "Phone number must have at least 10 digits.";
      if (digits.length > 11)
        return "Phone number is too long — enter 10 digits.";
      return null;
    },
  },

  password: {
    validate(val) {
      if (!val)
        return "Password is required.";
      if (val.length < 8)
        return "Password must be at least 8 characters.";
      if (!/[A-Z]/.test(val))
        return "Add at least one uppercase letter (A–Z).";
      if (!/[a-z]/.test(val))
        return "Add at least one lowercase letter (a–z).";
      if (!/[0-9]/.test(val))
        return "Add at least one number (0–9).";
      return null;
    },
  },

  confirm: {
    validate(val) {
      if (!val)
        return "Please confirm your password.";
      if (val !== document.getElementById("password").value)
        return "Passwords do not match — check and try again.";
      return null;
    },
  },
};

/* Password strength cool thing */
/* This tool comes from a template online */
 
function scorePassword(val) {
  if (!val) return { score: 0, label: "", color: "" };

  let score = 0;

  // Length checks
  if (val.length >= 8) score++;
  if (val.length >= 12) score++;

  // Character checks
  if (/[A-Z]/.test(val)) score++;
  if (/[a-z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;

  // Map score → label + color
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
  const wrap  = document.getElementById("strength-wrap");
  const fill  = document.getElementById("strength-fill");
  const text  = document.getElementById("strength-text");

  if (!val) return (wrap.hidden = true);

  wrap.hidden = false;

  const { score, label, color } = scorePassword(val);
  const pct = Math.round((score / 6) * 100);

  // This line is from Claude
  fill.style.cssText = `width:${pct}%;background:${color}`;
  text.textContent = label;
  text.style.color = color;
}

/*  set / clear field validation state */

/**
 * @param {string} fieldId   - input element id
 * @param {"error"|"success"|"neutral"} state
 * @param {string} [message] - error message (only used for "error" state)
 */

function setFieldState(fieldId, state, message = "") {
  const input = document.getElementById(fieldId);
  const error = document.getElementById(`${fieldId}-error`);
  const icon  = input.parentElement.querySelector(".field-icon");

  // Reset all classes first
  input.classList.remove("field-valid", "field-invalid");
  if (icon) {
    icon.textContent = "";
    icon.classList.remove("icon-success", "icon-error");
  }
  error.textContent = "";
  error.classList.remove("visible");

  if (state === "error") {
    input.classList.add("field-invalid");
    error.textContent = message;
    error.classList.add("visible");
    if (icon) {
      icon.textContent = "✕";
      icon.classList.add("icon-error");
    }
  } else if (state === "success") {
    input.classList.add("field-valid");
    if (icon) {
      icon.textContent = "✓";
      icon.classList.add("icon-success");
    }
  }
  // "neutral" → already reset above
}


function validateField(fieldId) {
  const rule  = RULES[fieldId];
  if (!rule) return true;

  const input = document.getElementById(fieldId);
  const error = rule.validate(input.value);

  if (error) {
    setFieldState(fieldId, "error", error);
    return false;
  }

  setFieldState(fieldId, "success");
  return true;
}


/* Toggle */

function applyTogglePadding() {
  document.querySelectorAll(".toggle-pw").forEach((btn) => {
    const input = document.getElementById(btn.dataset.target);
    if (input) input.classList.add("has-toggle");
  });
}


/* Main */

document.addEventListener("DOMContentLoaded", () => {
  const form    = document.getElementById("signupForm");
  const success = document.getElementById("signup-success");
  const allIds  = ["name", "email", "phone", "password", "confirm"];

  // Track which fields the user has interacted with (blurred at least once)
  const touched = new Set();

  applyTogglePadding();

  // For each field

  allIds.forEach((id) => {
    const input = document.getElementById(id);
    if (!input) return;

    // Validate on blur
    input.addEventListener("blur", () => {
      touched.add(id);
      validateField(id);

      // When leaving password, check if interacted with
      if (id === "password" && touched.has("confirm")) {
        validateField("confirm");
      }
    });

    // Validate on input only after the field has been interacted with (no error when start typing)
    input.addEventListener("input", () => {
      if (id === "phone") formatPhoneInput(input);

      if (id === "password") {
        updateStrengthMeter(input.value);
        // Re-validate confirm live if already touched
        if (touched.has("confirm")) validateField("confirm");
      }

      if (touched.has(id)) validateField(id);
    });
  });

  // Show hide/passworrd :)

  document.querySelectorAll(".toggle-pw").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input   = document.getElementById(btn.dataset.target);
      const showing = input.type === "text";
      input.type        = showing ? "password" : "text";
      btn.textContent   = showing ? "Show" : "Hide";
    });
  });

  // Submit

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Force-validate all fields (so someone who clicks submit without interacting sees lots of errors
    let allValid = true;
    allIds.forEach((id) => {
      touched.add(id);
      if (!validateField(id)) allValid = false;
    });

    if (!allValid) {
      const firstBad = allIds.find((id) =>
        document.getElementById(id).classList.contains("field-invalid")
      );
      if (firstBad) document.getElementById(firstBad).focus();
      return;
    }

    // All good? Success!
    window.accountCreated = true;

    // Update the nav button immediately in the same session.
    updateNavAccountBtn();

    form.hidden    = true;
    success.hidden = false;
    success.focus();
  });
});