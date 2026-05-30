# Kimiko Tasks

## Bootstrap project
- [x] Initialize Next.js TypeScript app with App Router
- [x] Add shadcn-style UI primitives
- [x] Add Prisma + SQLite
- [x] Add Dockerfile and `.dockerignore`
- [x] Add `.env.example`

## Define data model
- [x] Implement Prisma schema for subjects, site pages, articles, job runs, app logs, app state
- [x] Add initial migration
- [x] Add seed-free startup path

## Build config layer
- [x] Add env parsing/validation
- [x] Add typed config module
- [x] Add masked settings serializer for UI

## Build crawl subsystem
- [x] Add sitemap discovery
- [x] Add same-domain crawler with limits
- [x] Add extraction + page classification
- [x] Add content hashing and cache update logic

## Build AI provider layer
- [x] Define provider interface
- [x] Implement OpenAI provider
- [x] Add structured subject generation
- [x] Add structured article generation
- [x] Add validation/parsing guards

## Build WordPress integration
- [x] Add REST client using application password auth
- [x] Add create-draft flow
- [x] Add failure/result persistence

## Build scheduler
- [x] Add cron bootstrap
- [x] Add non-overlap guards
- [x] Add manual trigger compatibility

## Build admin API
- [x] Subjects CRUD
- [x] Queue reorder endpoint
- [x] Dashboard/runs/logs/content endpoints
- [x] Health endpoint

## Build admin UI
- [x] Dashboard
- [x] Subject queue manager
- [x] Run/log inspection
- [x] Content history
- [x] Settings view

## Add observability and resilience
- [x] Structured DB log writer
- [x] Job run summaries
- [x] Graceful error surfaces in UI

## Add tests
- [ ] Unit tests for prompt parsers, dedupe, reorder logic, config validation
- [ ] Integration tests for API routes and service flows
- [ ] Mocked tests for OpenAI + WordPress clients

## Finish operator docs
- [x] Short README
- [x] `.env.example` comments
- [x] Docker run example
