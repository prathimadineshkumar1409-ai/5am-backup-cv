# Gemini / OpenAI Analyzer Proxy (sample)

This small Express server exposes a single endpoint used by the front-end:

- POST /api/gemini-analyze

It accepts a JSON payload with quiz context and returns recommendations. The server will use the OpenAI Chat Completions API when the `OPENAI_API_KEY` environment variable is set. Otherwise it returns a deterministic fallback analysis suitable for local testing.

## Quick start

1. Open a terminal in this folder:

```powershell
cd c:\Users\Dell\Desktop\CodeVerse\server
npm install
npm start
```

2. To enable the AI integration, set your OpenAI API key in the environment before starting:

```powershell
$env:OPENAI_API_KEY = 'sk-...'
npm start
```

3. The server listens on port 3001 by default. The front-end expects `/api/gemini-analyze` to be available relative to your app root. When developing with Live Server you can either:

- Run this proxy on port 3001 and adjust the front-end fetch to `http://localhost:3001/api/gemini-analyze`, or
- Run a small reverse proxy to forward `/api/gemini-analyze` to `http://localhost:3001/api/gemini-analyze`.

## Notes

- Keep your API key secret. Do NOT commit it to the repo.
- This is a minimal example for local testing and should be adapted before using in production (authentication, rate limiting, input sanitization, etc.).
