# Deploy-Fix Vercel Node 24

Diese Version ist für Vercel mit Node.js 24 vorbereitet.

Wichtig in Vercel:

- Root Directory: `rollladen-sonnenschutz-app`
- Install Command: `npm install --no-audit --no-fund`
- Build Command: `npm run build`
- Output Directory: `dist`
- Node.js Version: `24.x`

Wichtig in GitHub löschen, falls vorhanden:

- `package-lock.json`
- `npm-shrinkwrap.json`

Die `.npmrc` nutzt die öffentliche npm Registry: `https://registry.npmjs.org/`.
