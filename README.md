# Media SDK

A headless Media SDK built with TypeScript, React and Vite.

## Features

### Photos
- Search photos using Pexels API
- Responsive photo grid
- Lazy-loaded images
- Photo lightbox
- Pagination / Load More
- View tracking
- Download tracking

### Videos
- Video search using Pexels API
- Vertical video reels
- Scroll-snap navigation
- Active video detection using IntersectionObserver
- Automatic muted autoplay
- Previous video automatically pauses
- Video view tracking
- Video download
- Load More videos

## Project Architecture

```text
media-sdk/
│
├── packages/
│   ├── media-core/
│   │   └── API client and media types
│   │
│   ├── media-react/
│   │   └── React hooks and MediaProvider
│   │
│   ├── media-ui-react/
│   │   └── Grid, Lightbox and Reel UI hooks
│   │
│   └── media-native/
│
└── apps/
    └── web/
        └── Demo application





Pexels API
    ↓
Media Core
    ↓
Media React
    ↓
React Hooks
    ↓
UI React
    ↓
Web Demo



Search
  ↓
useMediaSearch()
  ↓
Media Grid
  ↓
Lightbox
  ↓
View / Download tracking


Search
  ↓
useVideoSearch()
  ↓
Video Reels
  ↓
IntersectionObserver
  ↓
Active Video
  ↓
Autoplay
  ↓
Pause Previous Video


Technologies
TypeScript
React
Vite
Pexels API
CSS
npm Workspaces