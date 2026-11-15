/* T. C. Dirtworks quote form and interface.
   The estimate form posts JSON to FormSubmit. It does not open an email app.
*/
const FORM_ENDPOINT = "https://formsubmit.co/ajax/info@tcdirtworks.com";
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
const lightboxTitle = document.querySelector("#lightbox-title");
const lightboxClose = document.querySelector("#lightbox-close");
const projectGallery = document.querySelector("#project-gallery");
const galleryMore = document.querySelector("#gallery-more");

document.querySelectorAll(".shot").forEach((shot) => {
  shot.addEventListener("click", () => {
    if (!lightbox || !lightboxCopy) return;
    const photo = shot.querySelector("img");
    if (lightboxPhoto && photo) {
      lightboxPhoto.src = photo.currentSrc || photo.src;
      lightboxPhoto.alt = photo.alt;
    }
    if (lightboxTitle) lightboxTitle.textContent = shot.dataset.title || "Project photo";
    lightboxCopy.textContent = shot.dataset.caption || "";
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

if (projectGallery && galleryMore) {
  const hiddenCount = projectGallery.querySelectorAll("li:nth-child(n + 7)").length;
  if (!hiddenCount) {
    galleryMore.hidden = true;
  } else {
    galleryMore.addEventListener("click", () => {
      projectGallery.classList.add("is-expanded");
      galleryMore.setAttribute("aria-expanded", "true");
      galleryMore.hidden = true;
      const firstExtra = projectGallery.querySelector("li:nth-child(7) .shot");
      if (firstExtra) firstExtra.focus();
    });
  }
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

if (quoteForm) {
  const status = document.querySelector("#form-status");
  const success = document.querySelector("#form-success");

  if (location.hash === "#quote-thanks" && success) {
    quoteForm.hidden = true;
    success.hidden = false;
  }

  Object.keys(rules).forEach((key) => {
    const input = fieldElement(quoteForm, key);
    if (!input) return;
    input.addEventListener("blur", () => validateField(quoteForm, key));
    input.addEventListener("input", () => {
      if (input.getAttribute("aria-invalid") === "true") validateField(quoteForm, key);
    });
  });

  quoteForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (status) status.textContent = "";
    if (!validateForm(quoteForm)) return;

    const data = new FormData(quoteForm);
    if (value(data, "_honey") !== "") return;

    const button = quoteForm.querySelector("[type='submit']");
    if (button) button.disabled = true;

    const name = value(data, "name");
    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone: value(data, "phone"),
          email: value(data, "email"),
          contact_method: value(data, "contact_method"),
          job_site: value(data, "job_site"),
          service: value(data, "service"),
          _subject: `Free estimate request — ${name}`,
          _template: "table",
          _captcha: "false",
          _honey: "",
        }),
      });
      if (!response.ok) throw new Error("Request failed");
      quoteForm.reset();
      showSuccess();
    } catch (error) {
      if (status) status.textContent = "We couldn't send your request. Call 854-275-9644.";
      if (button) button.disabled = false;
    }
  });

  function showSuccess() {
    if (success) {
      quoteForm.hidden = true;
      success.hidden = false;
      const heading = success.querySelector("h3");
      if (heading) {
        heading.setAttribute("tabindex", "-1");
        heading.focus();
      }
    } else if (status) {
      status.textContent = "Thanks, we got your request and will be in touch soon.";
    }
  }
}

function value(data, key) {
  return (data.get(key) || "").toString().trim();
}
