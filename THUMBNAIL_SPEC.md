# Thumbnail Generator Spec

directory: ~/dev/www

## Overview

A YouTube thumbnail generator at `/thumbnail` that uses Google Vertex AI (Nano Banana Pro model) to create thumbnails from reference images and text prompts.

## Core Features

### Input Sources
- **Image upload**: User uploads a reference image
- **YouTube URL**: Fetch existing thumbnail from a YouTube video URL

### Generation
- **Model**: Google Vertex AI - Nano Banana Pro
- **Workflow**: Image-to-image with text prompt guidance
- **Output**: 2-4 variations per generation
- **Dimensions**: 1280x720 (YouTube standard)

## UI Flow (Step Wizard)

### Step 1: Source Selection
- Choose between image upload or YouTube URL
- For YouTube: paste URL, fetch and display current thumbnail
- For upload: drag-drop or file picker
- Preview the source image before proceeding

### Step 2: Describe Modifications
- Text prompt input describing desired changes
- Examples/suggestions for effective prompts
- Optional: style presets (cinematic, bold text, minimalist, etc.)

### Step 3: Generate
- Submit to Vertex AI
- Loading state with progress indicator
- Display 2-4 generated variations in a grid

### Step 4: Select & Download
- Click to select preferred variation
- Download button (PNG, max quality)
- Option to regenerate with adjusted prompt
- Option to start over

## Persistence

- **Browser localStorage** for recent generations
- Store: source image (base64 or blob URL), prompt, generated results, timestamp
- Display recent history on landing page
- Clear history option

## Technical Implementation

### API Route
- `POST /api/thumbnail/generate`
  - Body: `{ image: base64, prompt: string }`
  - Response: `{ variations: [base64, ...] }`

### YouTube Thumbnail Fetch
- `GET /api/thumbnail/youtube?url=<youtube_url>`
- Extract video ID, fetch `https://img.youtube.com/vi/{id}/maxresdefault.jpg`
- Fallback to `hqdefault.jpg` if maxres unavailable

### Environment Variables
- `GOOGLE_VERTEX_API_KEY` - Vertex AI credentials
- `GOOGLE_VERTEX_PROJECT_ID` - GCP project ID (if needed)

## Components

```
app/thumbnail/
├── page.tsx              # Main wizard container
├── components/
│   ├── SourceStep.tsx    # Step 1: upload or YouTube URL
│   ├── PromptStep.tsx    # Step 2: describe modifications
│   ├── GenerateStep.tsx  # Step 3: generation + results
│   ├── SelectStep.tsx    # Step 4: select and download
│   └── HistoryPanel.tsx  # Recent generations sidebar
└── lib/
    └── storage.ts        # localStorage utilities

app/api/thumbnail/
├── generate/route.ts     # Vertex AI generation endpoint
└── youtube/route.ts      # YouTube thumbnail fetcher
```

## Open Questions

1. **Rate limiting**: Should we limit generations per session/day?
2. **Image preprocessing**: Resize/crop source images before sending to API?
3. **Error handling**: Retry logic for API failures?
4. **Analytics**: Track usage/popular prompts?

## Future Considerations

- User accounts for persistent history across devices
- Prompt templates library
- Batch generation from multiple YouTube URLs
- A/B testing integration (upload to YouTube, track CTR)
