# ProEstimate PH

React + TypeScript + Vite app scaffold for the Gemini-generated ProEstimate PH source.

## Run locally
1. Install Node.js (LTS).
2. Open a terminal in this folder.
3. Run `npm install`
4. Run `npm run dev`
5. Open the local URL shown by Vite.

## Build for hosting
Run `npm run build`. Vite creates the production site in `dist/`.

## Deploy with Vercel
1. Upload this project folder to a GitHub repository.
2. In Vercel, import that repository.
3. Framework preset: Vite (usually detected automatically).
4. Build command: `npm run build`
5. Output directory: `dist`
6. Deploy.

Important: this version stores project data in each browser's localStorage. It does not provide shared cloud storage, accounts, or cross-device synchronization. Users should export regular JSON backups. The sample projects and rates in the source are demonstration data and must be checked/updated before real estimating or bidding use.
