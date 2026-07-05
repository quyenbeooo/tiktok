# SnapTik-Pro Clone

Free TikTok video downloader — download videos without watermark, MP3 audio, and photo slideshows.

## Tech Stack

- **Next.js 14** (App Router)
- **Tailwind CSS** (Premium Dark Theme)
- **Lucide React** (Icons)
- **TikWM API** (Primary) + RapidAPI fallback

## Getting Started

### Prerequisites

- Node.js 18.17+ (required by Next.js 14)

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Optional: RapidAPI Fallback

Copy `.env.example` to `.env.local` and add your RapidAPI key:

```
TIKTOK_API_KEY=your_rapidapi_key_here
```

## Features

- Download TikTok videos in HD without watermark
- Download original video and MP3 audio
- Photo slideshow support with carousel and bulk download
- Mobile-responsive premium dark UI
- Server-side API proxy (hides keys, avoids CORS)
- Force-download via blob (no new tab)

## Project Structure

```
app/
  api/download/route.ts   # Backend proxy API
  page.tsx                # Home page
  layout.tsx              # Root layout + SEO
components/
  Header.tsx              # Navbar
  HeroInput.tsx           # URL input + state management
  LoadingState.tsx        # Skeleton loader + progress
  DownloadActions.tsx     # Result section + download buttons
  VideoPreview.tsx        # HTML5 video player
  ImageGallery.tsx        # Photo slideshow carousel
  Toast.tsx               # Error/success notifications
  Footer.tsx              # Legal links + disclaimer
lib/utils.ts              # URL validation, force download
types/index.ts            # TypeScript interfaces
```

## Disclaimer

This tool is for educational and personal use only. Not affiliated with TikTok or ByteDance.
