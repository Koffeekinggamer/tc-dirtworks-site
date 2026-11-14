/* T. C. Dirtworks quote form and interface.
   FORM_ENDPOINT:
     ""  -> demo mode. Submit opens a mailto: to info@tcdirtworks.com.
     A Formspree (or compatible) URL -> POST the form there instead.
   To go live, set FORM_ENDPOINT and nothing else in this file needs to change.
*/
const FORM_ENDPOINT = "";
const ESTIMATE_EMAIL = "info@tcdirtworks.com";
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const headerQuery = () => document.documentElement.classList.toggle("is-compact", window.scrollY > 16);
headerQuery();
window.addEventListener("scroll", headerQuery, { passive: true });

const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");
const scrim = document.querySelector(".nav-scrim");
let lastFocus = null;

function setMenu(open) {
  if (!menuToggle || !siteNav) return;
  menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
  menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  siteNav.classList.toggle("is-open", open);
  document.body.classList.toggle("nav-open", open);
  if (open) {
    lastFocus = document.activeElement;
    const first = siteNav.querySelector("a, button");
    if (first) first.focus();
  } else if (lastFocus && typeof lastFocus.focus === "function") {
    lastFocus.focus();
  }
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenu(false);
  });

  if (scrim) scrim.addEventListener("click", () => setMenu(false));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
    if (event.key !== "Tab" || !siteNav.classList.contains("is-open")) return;
    const focusable = [...siteNav.querySelectorAll("a, button")];
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 959) setMenu(false);
  });
}

const callDock = document.querySelector(".call-dock");
const quoteForm = document.querySelector("#quote-form");

if (callDock && quoteForm) {
  quoteForm.addEventListener("focusin", () => callDock.classList.add("is-hidden"));
  quoteForm.addEventListener("focusout", (event) => {
    if (!quoteForm.contains(event.relatedTarget)) callDock.classList.remove("is-hidden");
  });
}

const reveals = document.querySelectorAll(".reveal");
if (reduceMotion || !("IntersectionObserver" in window)) {
  reveals.forEach((el) => el.classList.add("is-inview"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-inview");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
  );
  reveals.forEach((el) => observer.observe(el));
}

if (!reduceMotion) {
  const parallaxNodes = document.querySelectorAll("[data-parallax]");
  const hero = document.querySelector(".hero");
  const steps = document.querySelector(".steps");
  let ticking = false;

  const updateMotion = () => {
    const root = document.documentElement;
    const max = root.scrollHeight - window.innerHeight;
    const progress = max > 0 ? window.scrollY / max : 0;
    root.style.setProperty("--scroll-p", progress.toFixed(4));
    const wide = window.innerWidth >= 760;

    if (hero) {
      const y = wide ? Math.min(24, window.scrollY * 0.06) : 0;
      hero.style.setProperty("--hero-y", `${y.toFixed(1)}px`);
    }

    if (steps) {
      const rect = steps.getBoundingClientRect();
      const view = window.innerHeight;
      const amount = (view * 0.92 - rect.top) / (view * 0.55);
      steps.style.setProperty("--steps-p", Math.min(1, Math.max(0, amount)).toFixed(3));
    }

    if (wide) {
      parallaxNodes.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const speed = Number(el.dataset.parallax) || 0.06;
        const shift = (rect.top - window.innerHeight * 0.5) * speed * -0.2;
        el.style.setProperty("--py", `${shift.toFixed(1)}px`);
      });
    }
  };

  const requestTick = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateMotion();
      ticking = false;
    });
  };

  window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", requestTick);
  updateMotion();
}

const lightbox = document.querySelector("#lightbox");
const lightboxCopy = document.querySelector("#lightbox-copy");
const lightboxPhoto = document.querySelector("#lightbox-photo");
const lightboxClose = document.querySelector("#lightbox-close");

document.querySelectorAll(".shot").forEach((shot) => {
  shot.addEventListener("click", () => {
    if (!lightbox || !lightboxCopy) return;
    const photo = shot.querySelector("img");
    if (lightboxPhoto && photo) {
      lightboxPhoto.src = photo.currentSrc || photo.src;
      lightboxPhoto.alt = photo.alt;
    }
    lightboxCopy.textContent = "Placeholder image only. This is not a finished T. C. Dirtworks project.";
    if (typeof lightbox.showModal === "function") lightbox.showModal();
    else lightbox.setAttribute("open", "");
  });
});

if (lightbox && lightboxClose) {
  lightboxClose.addEventListener("click", () => lightbox.close());
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) lightbox.close();
  });
}

const rules = {
  name: (value) => (value.trim().length >= 2 ? "" : "Enter your name."),
  phone: (value) => (value.replace(/\D/g, "").length >= 7 ? "" : "Enter a phone number."),
  email: (value) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "Enter a valid email address."),
  job_site: (value) => (value.trim().length >= 3 ? "" : "Enter the job site or address."),
  service: (value) => (value ? "" : "Select a service."),
  contact_method: (value) => (value ? "" : "Select how you prefer to be contacted."),
};

function fieldElement(form, key) {
  return form.querySelector(`[name="${key}"]`);
}

function showError(input, message) {
  const field = input.closest(".field");
  const error = field ? field.querySelector(".field-error") : null;
  if (!field || !error) return;
  field.classList.toggle("is-invalid", Boolean(message));
  input.setAttribute("aria-invalid", message ? "true" : "false");
  error.hidden = !message;
  error.textContent = message;
}

function validateField(form, key) {
  const input = fieldElement(form, key);
  if (!input || !rules[key]) return true;
  const message = rules[key](input.value || "");
  showError(input, message);
  return !message;
}

function validateForm(form) {
  let firstInvalid = null;
  Object.keys(rules).forEach((key) => {
    const input = fieldElement(form, key);
    const message = rules[key]((input && input.value) || "");
    if (input) showError(input, message);
    if (message && !firstInvalid) firstInvalid = input;
  });
  if (firstInvalid) firstInvalid.focus();
  return !firstInvalid;
}

const demoNote = document.querySelector("#form-note");
const submitButton = quoteForm ? quoteForm.querySelector("[type='submit']") : null;
if (FORM_ENDPOINT) {
  if (demoNote) demoNote.textContent = "Sending this form delivers the request to T. C. Dirtworks.";
  if (submitButton) submitButton.textContent = "Send estimate request";
}

if (quoteForm) {
  const status = document.querySelector("#form-status");
  const success = document.querySelector("#form-success");
  const successCopy = document.querySelector("#form-success-copy");
  const resetButton = document.querySelector("#form-reset");

  Object.keys(rules).forEach((key) => {
    const input = fieldElement(quoteForm, key);
    if (!input) return;
    input.addEventListener("blur", () => validateField(quoteForm, key));
    input.addEventListener("input", () => {
      if (input.getAttribute("aria-invalid") === "true") validateField(quoteForm, key);
    });
  });

  if (resetButton && success) {
    resetButton.addEventListener("click", () => {
      success.hidden = true;
      quoteForm.hidden = false;
      const name = fieldElement(quoteForm, "name");
      if (name) name.focus();
    });
  }

  quoteForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (status) status.textContent = "";
    if (!validateForm(quoteForm)) return;

    const data = new FormData(quoteForm);
    if ((data.get("_gotcha") || "").toString().trim() !== "") return;

    const button = quoteForm.querySelector("[type='submit']");
    if (button) button.disabled = true;

    try {
      if (FORM_ENDPOINT) {
        const response = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: data,
        });
        if (!response.ok) throw new Error("Request failed");
        quoteForm.reset();
        showSuccess("Request sent to T. C. Dirtworks.");
      } else {
        const name = value(data, "name");
        const body = [
          "Free estimate request for T. C. Dirtworks",
          "",
          `Name: ${name}`,
          `Phone: ${value(data, "phone")}`,
          `Email: ${value(data, "email")}`,
          `Job site: ${value(data, "job_site")}`,
          `Service: ${value(data, "service")}`,
          `Preferred contact method: ${value(data, "contact_method")}`,
        ].join("\n");
        window.location.href = `mailto:${ESTIMATE_EMAIL}?subject=${encodeURIComponent(`Free estimate request — ${name}`)}&body=${encodeURIComponent(body)}`;
        showSuccess(`Your email app should open with this request addressed to ${ESTIMATE_EMAIL}. If it does not, email that address directly. This demo form does not store or send the message on its own.`);
      }
    } catch (error) {
      if (status) status.textContent = `The form could not be sent. Email ${ESTIMATE_EMAIL} or call 854-275-9644 instead.`;
    } finally {
      if (button) button.disabled = false;
    }
  });

  function showSuccess(message) {
    if (success && successCopy) {
      successCopy.textContent = message;
      quoteForm.hidden = true;
      success.hidden = false;
      success.querySelector("h3").focus?.();
      const heading = success.querySelector("h3");
      if (heading) {
        heading.setAttribute("tabindex", "-1");
        heading.focus();
      }
    } else if (status) {
      status.textContent = message;
    }
  }
}

function value(data, key) {
  return (data.get(key) || "").toString().trim();
}
