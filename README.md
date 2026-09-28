# Tick Ninja

A modern, responsive TikTok downloader interface with an Express local server and a Vercel serverless API.

## Deploy to Vercel

1. Upload this folder to GitHub.
2. Import the repository into Vercel.
3. Root Directory: `./`
4. Build Command: **leave empty / do not override**
5. Output Directory: **leave empty / do not override**
6. Install Command: `npm install`
7. Deploy.

There is intentionally no `build` script. The previous Vercel error `Missing script: "build"` happens when Vercel is configured to run `npm run build` even though this app does not need a build step.

## Run locally

```bash
npm install
npm start
```

Then open http://localhost:3000

## API provider

The backend uses TikWM as the processing provider. TikWM's public site documents TikTok link processing and download options. Provider availability, limits, and output quality can change, so this integration should be treated as an external dependency.

Only use content you are permitted to download, and follow TikTok's terms and applicable copyright laws.
