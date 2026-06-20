# WordPool

A community flashcard study app. Anyone can add a word (deck, word, meaning, optional
example, their name) and it's instantly visible to everyone. Browse decks, study with
flip cards.

**Stack:** Next.js (App Router, TS) · Tailwind · Prisma 7 · Neon (Postgres) · Vercel

---

## Run locally

You need a free Postgres DB from [Neon](https://neon.tech) (or any Postgres).

1. **Get a database URL**
   - Sign up at neon.tech → create a project → copy the connection string.

2. **Set the env var**
   ```bash
   cp .env.example .env
   # paste your connection string into DATABASE_URL
   ```

3. **Install + set up the schema + seed**
   ```bash
   npm install
   npx prisma migrate dev --name init   # creates tables
   npx prisma db seed                   # adds sample decks/cards
   ```

4. **Start**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000

---

## Deploy to Vercel (free)

1. Push this repo to GitHub.
2. On [vercel.com](https://vercel.com): **New Project** → import the repo.
3. Add an Environment Variable: `DATABASE_URL` = your Neon string.
4. Deploy. Vercel runs `next build` and gives you a live URL.
5. First deploy only — apply the schema to the prod DB:
   ```bash
   npx prisma migrate deploy   # run locally, pointed at the prod DATABASE_URL
   npx prisma db seed          # optional sample data
   ```

> Tip: in Neon, use one branch for local dev and the main branch for production so
> your test cards don't mix with live data.

---

## Routes

| Path            | What                                    |
| --------------- | --------------------------------------- |
| `/`             | All decks (with card counts)            |
| `/deck/[id]`    | Cards in a deck + flip study mode       |
| `/add`          | Add a card (pick deck or create new)    |

| API                       | Method | What                             |
| ------------------------- | ------ | -------------------------------- |
| `/api/decks`              | GET    | All decks + card counts          |
| `/api/decks/[id]/cards`   | GET    | One deck + its cards             |
| `/api/cards`              | POST   | Add a card (creates deck if new) |

---

## Notes

- No login by design — writers just type their name. Public, shared deck.
- Spam surface is open (anyone can POST). Cheap hardening later: rate-limit by IP,
  honeypot field, captcha. Field length is already capped at 500 chars.
