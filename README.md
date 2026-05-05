# PDF To Video Pipeline

Pipeline for turning a PDF into a video workflow using PDF parsing, LLM script generation, image generation, audio generation, and FFmpeg merging.

## What It Does

- Parses a source PDF.
- Splits text into chunks.
- Sends chunks to an LLM adapter.
- Generates cover/scene imagery through an image adapter.
- Generates narration audio through an audio adapter.
- Merges generated assets into video output with FFmpeg.

## Structure

```text
config/providers.json
generate-cover.js
run-pipeline.js
src/
  adapters/
    audio/elevenlabs.js
    image/stability.js
    llm/aiOrchestrator.js
  core/
    chunker.js
    ffmpegMerger.js
    pdfParser.js
    pipeline.js
```

## Tech Stack

- Node.js.
- `pdf-parse`.
- Axios/FormData for provider calls.
- `fluent-ffmpeg` for video assembly.

## Quick Start

```bash
npm install
copy .env.example .env
node run-pipeline.js
```

## Environment

Use `.env.example` for provider keys and endpoints. Common provider families in the current code are:

- ElevenLabs for audio.
- Stability for images.
- AI Orchestrator for LLM/script generation.

## Notes

The `workspace/` directory is intentionally ignored because it is runtime output, not source code.
