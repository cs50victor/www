# Agent Instructions

## Commands

```bash
bun run dev      # Start dev server (runs _w.generator.ts first, then next dev --turbo)
bun run build    # Production build (runs _w.generator.ts first)
bun run lint     # ESLint
bun run start    # Start production server
```

## Architecture

Personal website (vic.so) built with Next.js 15 App Router, React 19, Tailwind CSS 4, and MDX.

**Key directories:**
- `app/` - Pages and API routes (App Router)
- `app/t/[slug]/` - MDX blog posts with metadata exports
- `components/ui/` - shadcn-style UI primitives
- `lib/` - Utilities and constants

**Blog system:**
- Posts live in `app/t/<slug>/page.mdx`
- Each post exports `metadata` with title, description, date, optional hero/tags
- The metadata export **must** end with `};` (semicolon). The generator regex depends on it; without it the post is silently excluded from the listing.
- `_w.generator.ts` scans posts and generates `_w.ts` (auto-generated, do not edit)
- OG images use `next/og` (satori): images need explicit `width`/`height` (`height: 'auto'` won't work), fonts must be TTF (not woff2), and assets must live in `public/` to work on Vercel
- Generator runs automatically before dev/build

**Path alias:** `@/*` maps to project root

## Conventions

- Be concise. Aim for simplicity.
- Always run `bun run build` to verify changes do not break the build.

## Landing the Plane (Session Completion)

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **Run quality gates** (if code changed) - Tests, linters, builds
2. **Commit all intended changes** - Make sure the work is captured locally before syncing
3. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   git push
   git status  # MUST show "up to date with origin"
   ```
4. **Clean up** - Clear stashes, prune remote branches
5. **Verify** - All changes committed AND pushed
6. **Hand off** - Provide context for next session

**CRITICAL RULES:**
- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds
