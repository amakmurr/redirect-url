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

Redirects (`301`) to:

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

- If `origin` is omitted or not a valid `http(s)` URL, it defaults to `https://mekaripos-staging-cdn.mekari.io/attachments`.
- A trailing `/` on `origin` is normalized.

**Example**

```
https://redirect-url-six.vercel.app/defac458-62af-494e-8c3c-a49504fd4290/8aa61423-7435-46b8-90aa-da001191e18a.jpg?origin=https://example.com/attachments
```

→ redirects to

```
https://example.com/attachments/defac458-62af-494e-8c3c-a49504fd4290/8aa61423-7435-46b8-90aa-da001191e18a?x-oss-process=image/resize,m_fill,w_800,h_800,limit_0/format,jpg
```

## Local development

```
npm install
npm start
```

Server runs on `http://localhost:3000` (or `$PORT`).

## Deployment

Deployed on Vercel via `vercel.json`. Pushing to `master` triggers a new production deployment if the GitHub repo is linked to the Vercel project.
