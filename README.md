# Videoflix Frontend

This is the **Angular** frontend for **Videoflix**, a video streaming platform that allows users to upload, transcode, and stream videos in multiple resolutions. The frontend communicates with a Django REST API backend and features secure authentication, a responsive UI built with Angular Material, and high-quality video playback using **Video.js**.

## Tech Stack

- **Framework:** Angular 18 (CLI v18.2)
- **UI Library:** Angular Material
- **Video Player:** [Video.js](https://videojs.com/)
- **State Management:** Angular services & observables
- **API Integration:** REST API with JWT (Django backend)
- **Build Tools:** Angular CLI

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Angular CLI](https://angular.io/cli)

### Install Dependencies

```bash
npm install

```

## Development Server

Start the development server:

```bash
ng serve

```

Navigate to `http://localhost:4200/`. The app will reload automatically upon code changes.

## API Integration

The frontend connects to a Django REST backend available at `http://localhost:8081/api/`. You can configure the base API URL in:

```
src/environmen/environment.
```
Example:

```
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8081/api'
};

```

## Video Playback with Video.js

The app uses **Video.js** (`video.js` npm package) for video playback. Key features:

- HTML5 video support
- Multiple resolution sources
- Responsive and accessible UI
- Customizable player skins

The integration can be found in:

```
src/app/componen/video-player/
```

Make sure to import the Video.js CSS in your global `angular.json` or styles:

```json

"styles": [
  "node_modules/video.js/dist/video-js.css",
  "src/styles.scss"
]

```

## Available Scrip

| Script                        | Description                                    |
| ----------------------------- | ---------------------------------------------- |
| `npm start` / `ng serve`      | Start development server                       |
| `npm run build`               | Build the application for production           |
| `npm run test`                | Run unit tes with Karma                      |
| `npm run watch`               | Watch and rebuild                              |
| `npm run serve:ssr:videoflix` | Serve server-rendered version (if SSR enabled) |

## Build

To build the project for production:

```bash

ng build

```

Artifacts will be saved in the `dist/` directory.

## Unit Testing

Run unit tests with Karma:

```bash

ng test

```

## End-to-End Testing

To configure and run E2E tests, install a supported test runner (e.g., Cypress):

```bash

ng add @cypress/schematic

```

Then run:

```bash

ng e2e

```

## Environment Configuration

Use Angular environments for API configuration:

```bash

src/environments/
├── environment.ts         # Development
└── environment.prod.ts    # Production

```

## Deployment

- Build the app using `ng build --configuration production`
- Deploy contents of `dist/videoflix/` to a static host (e.g., Nginx, Firebase, Netlify)
- Ensure `environment.prod.ts` uses the correct backend API URL