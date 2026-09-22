# redirect-url

Redirects image paths to the Mekari CDN. Live at:
**https://redirect-url-six.vercel.app/**

## Endpoints

### Healthcheck

```
GET /
```

Returns `200 { "status": "ok" }`.

### Image redirect

```
GET /{path1}/{path2}.jpg
```

Redirects (`302`, cached for 5 minutes) to:

```
https://mekaripos-staging-cdn.mekari.io/attachments/{path1}/{path2}?x-oss-process=image/resize,m_fill,w_800,h_800,limit_0/format,jpg
```

`path1` and `path2` must match `[A-Za-z0-9_-]+`, otherwise the request returns `400`.

**Example**

```
https://redirect-url-six.vercel.app/defac458-62af-494e-8c3c-a49504fd4290/8aa61423-7435-46b8-90aa-da001191e18a.jpg
```

→ redirects to

```
https://mekaripos-staging-cdn.mekari.io/attachments/defac458-62af-494e-8c3c-a49504fd4290/8aa61423-7435-46b8-90aa-da001191e18a?x-oss-process=image/resize,m_fill,w_800,h_800,limit_0/format,jpg
```

#### Custom origin

Override the redirect base URL with an `origin` query param:

```
GET /{path1}/{path2}.jpg?origin={base_url}
```

- If `origin` is omitted, it defaults to `https://mekaripos-staging-cdn.mekari.io/attachments`.
- If `origin` is present, it must be a valid `http(s)` URL whose host is on the allowlist (see below) — otherwise the request returns `400`. This is intentional: a caller that gets an origin silently ignored would otherwise receive a `200`-equivalent redirect to the wrong base with no way to detect it.
- A trailing `/` on `origin` is normalized.

**Origin allowlist**

To prevent open-redirect abuse, `origin` hosts are checked against an allowlist (exact host or subdomain match), configurable via the `ALLOWED_ORIGIN_HOSTS` env var (comma-separated), defaulting to:

```
mekari.io,mekari.com
```

`cdn.mekari.io` is allowed; `mekari.io.evil.example` is not.

**Example**

```
https://redirect-url-six.vercel.app/defac458-62af-494e-8c3c-a49504fd4290/8aa61423-7435-46b8-90aa-da001191e18a.jpg?origin=https://example.com/attachments
```

→ redirects to

```
https://example.com/attachments/defac458-62af-494e-8c3c-a49504fd4290/8aa61423-7435-46b8-90aa-da001191e18a?x-oss-process=image/resize,m_fill,w_800,h_800,limit_0/format,jpg
```

## Configuration

| Env var | Default | Purpose |
|---|---|---|
| `ALLOWED_ORIGIN_HOSTS` | `mekari.io,mekari.com` | Comma-separated allowlist of hosts `origin` may target (exact or subdomain match). |
| `IMAGE_TRANSFORM` | `x-oss-process=image/resize,m_fill,w_800,h_800,limit_0/format,jpg` | Query string appended to the redirect target. Adjustable without a redeploy. |
| `PORT` | `3000` | Local server port. |

## Local development

```
npm install
npm start
npm test
```

Server runs on `http://localhost:3000` (or `$PORT`).

## Deployment

Deployed on Vercel via `vercel.json`. Pushing to `master` triggers a new production deployment if the GitHub repo is linked to the Vercel project.
