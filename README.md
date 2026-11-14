# T. C. Dirtworks

Proof-of-concept marketing site for T. C. Dirtworks, built by ZarSeb Enterprises. Static HTML, CSS, and JavaScript. No build step.

Preview: [https://koffeekinggamer.github.io/tc-dirtworks-site/](https://koffeekinggamer.github.io/tc-dirtworks-site/)

Pushes to `main` publish the site with `.github/workflows/pages.yml`. There is no `CNAME`.

Open locally with any static server:

```sh
python3 -m http.server 8080
```

Then visit `http://127.0.0.1:8080`.

## Domain

Do not add a `CNAME` or otherwise point `tcdirtworks.com` from this repository until the client is ready. GitHub Pages is serving the preview from `main` at the root of the repository.

## Quote form

The estimate form is a demo. Submitting it opens a `mailto:` to `info@tcdirtworks.com`.

To switch to Formspree (or any endpoint that accepts `FormData`), set `FORM_ENDPOINT` at the top of `js/main.js`:

```js
const FORM_ENDPOINT = "https://formspree.io/f/xxxxxxxx";
```

Leave it as an empty string to keep the mailto demo.

## Still needed from the client

- Logo, to replace the text wordmark
- Project photos, to replace the empty gallery frames
- Real customer reviews. Do not invent testimonials.
- Social profile URLs. Facebook and Instagram links are `href="#"` placeholders.
- A live form endpoint, if email-via-mailto is not enough
