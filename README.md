![Kimiko intro](https://cdn.homio.se/intro-1653312308.jpg)

# Kimiko

Kimiko is a self-hosted service that crawls one ecommerce website, generates article subjects, writes article drafts with AI, and sends them to WordPress as drafts for editorial review.

## Setup

1. Copy `.env.example` to `.env`.
2. Fill in your site URL, WordPress credentials, and OpenAI settings.
3. Start Kimiko with Docker or run it locally.

```bash
docker build -t kimiko .
docker run --rm -p 3000:3000 --env-file .env -v $(pwd)/data:/data kimiko
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
- `DATABASE_URL`
- `SITE_URL`
- `WORDPRESS_URL`
- `WORDPRESS_USERNAME`
- `WORDPRESS_APP_PASSWORD`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`

Kimiko stores data in the SQLite file referenced by `DATABASE_URL`. In Docker, the example config uses `/data/kimiko.db`, so mount `/data` to keep data persistent.

## Admin UI

Open `http://localhost:3000` to manage subjects, inspect runs and logs, and trigger crawl or article jobs manually.

WordPress publishing uses the REST API with an application password, and posts are created as `draft` only.
