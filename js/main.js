/* T. C. Dirtworks quote form and small UI helpers.
   FORM_ENDPOINT:
     ""  -> demo mode. Submit opens a mailto: to info@tcdirtworks.com.
     A Formspree (or compatible) URL -> POST the form there instead.
   To go live, set FORM_ENDPOINT and nothing else in this file needs to change.
*/
const FORM_ENDPOINT = "";
const ESTIMATE_EMAIL = "info@tcdirtworks.com";

const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");

function setMenu(open) {
  if (!menuToggle || !siteNav) return;
  menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
  menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  siteNav.classList.toggle("is-open", open);
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenu(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1040) setMenu(false);
  });
}

document.querySelectorAll("[data-placeholder-link]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
  });
});

const callDock = document.querySelector(".call-dock");
const quoteForm = document.querySelector("#quote-form");

if (callDock && quoteForm) {
  quoteForm.addEventListener("focusin", () => callDock.classList.add("is-hidden"));
  quoteForm.addEventListener("focusout", (event) => {
    if (!quoteForm.contains(event.relatedTarget)) callDock.classList.remove("is-hidden");
  });
}

const demoNote = document.querySelector("#form-note");
const submitButton = quoteForm ? quoteForm.querySelector("[type='submit']") : null;
if (FORM_ENDPOINT) {
  if (demoNote) demoNote.textContent = "Sending this form delivers the request to T. C. Dirtworks.";
  if (submitButton) submitButton.textContent = "Send estimate request";
}

if (quoteForm) {
  const status = document.querySelector("#form-status");

  quoteForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!quoteForm.checkValidity()) {
      quoteForm.reportValidity();
      return;
    }

    const data = new FormData(quoteForm);
    if ((data.get("_gotcha") || "").toString().trim() !== "") return;

    const submitButton = quoteForm.querySelector("[type='submit']");
    if (submitButton) submitButton.disabled = true;

    try {
      if (FORM_ENDPOINT) {
        const response = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: data,
        });
        if (!response.ok) throw new Error("Request failed");
        quoteForm.reset();
        if (status) {
          status.textContent = "Request sent to T. C. Dirtworks.";
        }
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
        const href = `mailto:${ESTIMATE_EMAIL}?subject=${encodeURIComponent(`Free estimate request — ${name}`)}&body=${encodeURIComponent(body)}`;
        window.location.href = href;
        if (status) {
          status.textContent = `Your email app should open with this request addressed to ${ESTIMATE_EMAIL}. If it does not, email that address directly. This demo form does not store or send the message on its own.`;
        }
      }
    } catch (error) {
      if (status) {
        status.textContent = `The form could not be sent. Email ${ESTIMATE_EMAIL} or call 854-275-9644 instead.`;
      }
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}

function value(data, key) {
  return (data.get(key) || "").toString().trim();
}
