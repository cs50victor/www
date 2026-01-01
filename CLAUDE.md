# CLAUDE.md

@AGENTS.md 

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
- `_w.generator.ts` scans posts and generates `_w.ts` (auto-generated, do not edit)
- Generator runs automatically before dev/build

**Path alias:** `@/*` maps to project root

## Conventions

- Be concise. Aim for simplicity.
- Always run `bun run build` to verify changes do not break the build.
