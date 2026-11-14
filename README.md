# T. C. Dirtworks

Proof-of-concept marketing site for T. C. Dirtworks, built by ZarSeb Enterprises. Static HTML, CSS, and JavaScript. No build step.

Live site: [https://tcdirtworks.com/](https://tcdirtworks.com/)

Publish from the `main` branch, folder `/` (root). The `CNAME` file sets the GitHub Pages domain to `tcdirtworks.com`.

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

GitHub Pages serves this site at `https://tcdirtworks.com`. DNS for the apex and `www` is in Cloudflare and is not managed from this repository. Do not change MX records.

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
