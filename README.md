<p align="center">
<img src="https://cdn.homio.se/intro-1653312308.jpg" />
</p>

# Kimiko

Kimiko is a self-hosted service that crawls one ecommerce website, generates article subjects, writes article drafts with AI, and sends them to WordPress as drafts for editorial review.

## Setup

1. Copy `.env.example` to `.env`.
2. Fill in your site URL, WordPress credentials, and OpenAI settings.
3. Start Kimiko with Docker or run it locally.

```bash
mkdir -p /kimiko/homio
cp .env.example /kimiko/homio/.env
docker build -t kimiko .
docker run --rm -p 3000:3000 --env-file /kimiko/homio/.env -v /kimiko/homio:/instance kimiko
```

Local development:

```bash
npm install
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run dev
```

## Required config

- `PORT`
- `SITE_URL`
- `WORDPRESS_URL`
- `WORDPRESS_USERNAME`
- `WORDPRESS_APP_PASSWORD`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`

Kimiko stores data in a local SQLite file. In Docker, if `DATABASE_URL` is not set, Kimiko automatically uses `file:/instance/kimiko.db`.

A simple pattern is to keep one directory per instance, for example `/kimiko/homio/`, and mount that directory into the container. Then both `.env` and `kimiko.db` live together in the same host directory.

That means this is enough:

```bash
mkdir -p /kimiko/homio
cp .env.example /kimiko/homio/.env
docker run --rm -p 3000:3000 --env-file /kimiko/homio/.env -v /kimiko/homio:/instance kimiko
```

`DATABASE_URL` is optional and only needed if you want to override the default database location.

For local development against a WordPress instance with a self-signed certificate, Kimiko allows insecure WordPress TLS by default in `development`. You can override that with `WORDPRESS_ALLOW_INSECURE_TLS=true` or `false`.

## Admin UI

Open `http://localhost:3000` to manage subjects, inspect runs and logs, and trigger crawl or article jobs manually.

WordPress publishing uses the REST API with an application password, and posts are created as `draft` only.
