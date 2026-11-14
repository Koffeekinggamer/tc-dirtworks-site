# T. C. Dirtworks

Proof-of-concept marketing site for T. C. Dirtworks, built by ZarSeb Enterprises. Static HTML, CSS, and JavaScript. No build step.

Preview URL (once Pages is on): [https://koffeekinggamer.github.io/tc-dirtworks-site/](https://koffeekinggamer.github.io/tc-dirtworks-site/)

Publish from the `main` branch, folder `/` (root). Do not add a `CNAME`. The domain `tcdirtworks.com` should stay unpointed until the client asks for it.

The agent token cannot create the Pages site (`POST /repos/.../pages` returns 403, resource not accessible by integration). Turn it on once in the repository:

1. Settings → Pages
2. Build and deployment → Deploy from a branch
3. Branch `main`, folder `/ (root)`, then Save

After that, this URL serves the files in the repository root. No build step.

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

- Project photos, to replace the empty gallery frames
- Real customer reviews. Do not invent testimonials.
- Any additional social profile, if one is added later. Facebook is the only link.
- A live form endpoint, if email-via-mailto is not enough
