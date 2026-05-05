---
version: alpha
name: vic.so
description: "Personal website for Victor A., a software engineer and builder. The design system is an editorial developer portfolio: narrow, quiet, type-led, monochrome-first, and intentionally sparse, with motion used as a small interaction cue rather than decoration."

colors:
  primary: "#0f172b"
  on-primary: "#f8fafc"
  background: "#ffffff"
  foreground: "#292828"
  foreground-strong: "#0f172b"
  surface: "#ffffff"
  surface-muted: "#f1f5f9"
  surface-subtle: "#f3f3f2"
  border: "#e2e8f0"
  muted-foreground: "#52525b"
  ring: "#90a1b9"
  dark-background: "#0f0f10"
  dark-surface: "#020618"
  dark-surface-muted: "#1d293d"
  dark-foreground: "#f8fafc"
  dark-muted-foreground: "#90a1b9"
  destructive: "#e7000b"
  link: "#292828"

typography:
  display-serif:
    fontFamily: EB Garamond
    fontSize: 48px
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: -0.02em
  title-serif:
    fontFamily: EB Garamond
    fontSize: 24px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: -0.02em
  heading-md:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: -0.01em
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: -0.01em
  body-sm:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: -0.01em
  label-sm:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: -0.01em
  caption:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: 0
  mono-sm:
    fontFamily: Geist Mono
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: 0

rounded:
  none: 0px
  sm: 6px
  md: 8px
  lg: 10px
  xl: 14px
  full: 9999px

spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  section: 48px
  page-top: 80px
  page-bottom: 160px
  content-max: 640px

components:
  page-shell:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.body-md}"
    padding: "{spacing.md}"
    width: "{spacing.content-max}"
  page-shell-dark:
    backgroundColor: "{colors.dark-background}"
    textColor: "{colors.dark-foreground}"
    typography: "{typography.body-md}"
  panel-dark:
    backgroundColor: "{colors.dark-surface}"
    textColor: "{colors.dark-foreground}"
    rounded: "{rounded.lg}"
    padding: "{spacing.md}"
  primary-action:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm}"
  tab-list:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.muted-foreground}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.md}"
  tab-list-dark:
    backgroundColor: "{colors.dark-surface-muted}"
    textColor: "{colors.dark-muted-foreground}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.md}"
  tab-active:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.foreground-strong}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.md}"
  tab-active-dark:
    backgroundColor: "{colors.dark-surface-muted}"
    textColor: "{colors.dark-foreground}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.md}"
  writing-row:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    typography: "{typography.body-md}"
    padding: "{spacing.sm}"
  writing-meta:
    backgroundColor: "transparent"
    textColor: "{colors.muted-foreground}"
    typography: "{typography.body-sm}"
  divider:
    backgroundColor: "{colors.border}"
    height: 1px
  focus-ring:
    backgroundColor: "{colors.ring}"
    height: 3px
    rounded: "{rounded.full}"
  code-surface:
    backgroundColor: "{colors.surface-subtle}"
    textColor: "{colors.foreground}"
    typography: "{typography.mono-sm}"
    rounded: "{rounded.sm}"
    padding: "{spacing.sm}"
  input-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    height: 36px
    padding: "{spacing.sm}"
  social-link:
    backgroundColor: "transparent"
    textColor: "{colors.link}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.full}"
    padding: "{spacing.sm}"
  experience-row:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    padding: "{spacing.sm}"
  blog-prose:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    typography: "{typography.body-md}"
  blog-heading:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    typography: "{typography.display-serif}"
  destructive-action:
    backgroundColor: "{colors.destructive}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm}"
---

# vic.so DESIGN.md

## Overview

vic.so is a personal website for a software engineer. It should feel like a small, precise notebook rather than a portfolio landing page. The interface is quiet, centered, text-first, and low-chrome. It privileges reading, scanning, and direct navigation over visual spectacle.

The brand personality is restrained, technical, and conversational. Pages should look hand-kept but not handmade: compact, carefully spaced, and typographically deliberate. The first impression should be a calm white page with a narrow column, dark gray type, and small animated affordances.

Use motion sparingly. Existing interaction uses short fade, blur, and spring transitions for section entry, tabs, preloading, and hover feedback. Motion should clarify state or focus; it should not become ambient decoration.

## Colors

The palette is monochrome-first with a narrow neutral range. Color appears mostly through content images, employer logos, and external media, not through UI chrome.

- **Background (#ffffff):** Default page canvas. Keep it clean and uninterrupted.
- **Foreground (#292828):** Primary text. It is softer than pure black and should be used for most reading surfaces.
- **Primary (#0f172b):** Primary actions, active controls, and strongest semantic text.
- **Foreground Strong (#0f172b):** Strong emphasis where the element is not a button or active control.
- **Surface Muted (#f1f5f9):** Subtle tab backgrounds, quiet panels, hover fills, and secondary UI surfaces.
- **Surface Subtle (#f3f3f2):** Code and low-emphasis filled areas.
- **Border (#e2e8f0):** Thin dividers, writing rows, inputs, and component outlines.
- **Muted Foreground (#52525b):** Dates, captions, descriptions, metadata, and inactive controls.
- **Dark Background (#0f0f10):** App-level dark body color.
- **Dark Surface (#020618):** Deep dark-mode root token for major surfaces.
- **Dark Surface Muted (#1d293d):** Dark-mode tabs, muted fills, and hover surfaces.
- **Dark Foreground (#f8fafc):** Primary dark-mode text.

Do not introduce a decorative brand accent unless the feature itself needs a semantic color. The site identity comes from type, spacing, and restraint.

## Typography

Typography is the design system. The site uses Geist Sans as the default UI face, Geist Mono for code and technical labels, and EB Garamond as the editorial serif for the site wordmark and blog headings.

- **Display Serif:** EB Garamond, 48px, weight 400, tight leading. Use for blog post H1s and rare editorial moments.
- **Title Serif:** EB Garamond, 24px, weight 500. Use for the site name and small identity marks.
- **Body:** Geist Sans, 16px, regular, 1.5 line height. This is the default for interface and prose-adjacent surfaces.
- **Labels:** Geist Sans, 14px, medium. Use for tabs, buttons, compact navigation, and social links.
- **Metadata:** Geist Sans at 12-14px in muted foreground. Use tabular numerals for dates and compact time-like values.
- **Monospace:** Geist Mono for code, command output, short technical captions, and small loading/status copy.

Global text should keep tight tracking. Headings and short identity text may use tighter tracking; do not add positive letter spacing except where a tiny technical label explicitly needs it.

## Layout

The layout is a narrow centered column. The root content shell is `max-w-screen-sm`, roughly 640px, with 16px horizontal padding and 80px top padding. Most home-page sections are narrower still, often centered at `max-w-xl`, `max-w-11/12`, or a similar constrained width.

Spacing should feel compact but not crowded:

- Use 16px as the default content padding.
- Use 24px for grouped horizontal gaps and feature rhythm.
- Use 48px for section separation inside content.
- Use 80px or more only for page-level breathing room.
- Keep long-form prose in the existing typography plugin rhythm rather than custom one-off spacing.

The homepage uses tabbed sections: About, Thoughts, Experience, and Contact. Treat these as the primary navigation surface. Do not replace them with a large hero, marketing grid, or multi-column dashboard.

Writing rows use a three-column rhythm: year, title/description, and month/day. Rows should stay scannable, with border-bottom separation and muted dates.

## Elevation & Depth

Depth is almost flat. Use dividers, opacity shifts, muted fills, and motion instead of shadows.

- Primary content sits directly on the page background.
- Lists use bottom borders rather than cards.
- Active tab state uses a moving rounded muted background, not a heavy selected button.
- Hover states may use `foreground/5`, underline, grayscale release, or opacity changes.
- Avoid heavy box shadows, glass effects, gradient backgrounds, and stacked card layouts.

For blog posts, the fixed top fade and scroll progress indicator provide depth and orientation. Keep this treatment subtle: a small blurred strip and a 1px progress bar are enough.

## Shapes

The shape language is mostly rectangular with small radii.

- Use 6-10px radius for standard controls and inputs.
- Use 14px radius for row hover surfaces and larger interactive rows.
- Use full radius only for tiny social pills, badges, or icon toggles.
- Use square media thumbnails when the content is a logo or employer image. Existing experience thumbnails are grayscale square images with zero radius.

Do not make the whole site pill-shaped. Rounded elements should be local and functional.

## Components

### Page Shell

Use a single centered column with 16px side padding, 80px top padding, and a minimum full-screen height. Keep the footer absolute and visually quiet. The page shell should not look like a card.

### Tab Navigation

Tabs are compact text buttons inside an animated rounded background. The active state is medium-weight, high-contrast text. Inactive tabs use muted zinc text and become higher contrast on hover. The moving background uses a short spring transition.

### About Section

The About section is plain prose with cursor-linked inline entities. Keep it centered, narrow, and direct. Inline cursor affordances may reveal contextual imagery, but the base text should remain readable without them.

### Writing List

Writing rows are the densest recurring component. Each row should show year only on the first item in a group, title in primary text, description in muted text, and month/day in tabular muted text. On list hover, fade sibling rows and restore opacity on the focused row.

### Experience List

Experience uses a grayscale horizontal logo slider followed by compact linked rows. Employer images stay square and grayscale by default, with color revealed on hover. Rows may get a quiet hover fill and rounded corner, but they should not become heavy cards.

### Social Links

Social links are small magnetic rounded pills with an external-arrow glyph. The hover affordance is underline plus magnetic motion. Keep labels short.

### Blog Prose

Blog pages use a centered prose column with EB Garamond H1 treatment, restrained heading weights, generous blockquote spacing, centered blockquotes, and wide figures on larger screens. Preserve the scroll progress bar and copy button affordance.

### Forms and Inputs

Use the shadcn-style input treatment: 36px height, 8px radius, transparent or muted background, border token, and a visible focus ring using the ring token. Do not invent a separate form style.

## Do's and Don'ts

### Do

- Do keep the interface narrow, centered, and text-led.
- Do use Geist Sans for UI and EB Garamond for editorial identity moments.
- Do use muted zinc/slate values for metadata, dates, and inactive controls.
- Do use borders, opacity, and subtle fills instead of card shadows.
- Do keep motion short and purposeful: fade, blur, spring tab background, magnetic hover.
- Do preserve dark-mode parity for every new surface.
- Do show real work or writing content directly instead of replacing it with marketing filler.
- Do keep blog post metadata exports and generated writing data flow untouched when designing content pages.

### Don't

- Don't add a hero landing section, decorative blobs, gradient washes, or oversized marketing copy.
- Don't turn repeated rows into nested cards.
- Don't introduce a saturated accent color for ordinary UI chrome.
- Don't use heavy shadows, glassmorphism, or blurred decorative panels.
- Don't use positive letter spacing on normal UI text.
- Don't make buttons or navigation universally pill-shaped.
- Don't widen the main site shell beyond the existing editorial column without a content-specific reason.
- Don't hide content hierarchy behind animation.

## Provenance

This file follows the official Google `DESIGN.md` alpha format: YAML design tokens first, then canonical `##` sections where tokens are normative and prose explains how to apply them. The structure was cross-checked against the `google-labs-code/design.md` specification and examples, plus the `awesome-design-md` collection for practical agent-facing conventions.

Repo evidence used: `AGENTS.md`, `package.json`, `app/globals.css`, `app/layout.tsx`, `app/page.tsx`, `app/t/layout.tsx`, `app/header.tsx`, `app/footer.tsx`, `components/ui/button.tsx`, `components/ui/input.tsx`, `components/ui/animated-background.tsx`, and `lib/constants.ts`.
