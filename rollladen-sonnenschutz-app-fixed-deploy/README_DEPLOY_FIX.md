# Deployment-Fix für Vercel

Diese Version entfernt die alte package-lock.json mit internen Registry-Links und pinnt alle Pakete auf stabile Versionen.

Wichtig in GitHub löschen:
- package-lock.json
- npm-shrinkwrap.json, falls vorhanden
- .npmrc nur behalten, wenn sie auf https://registry.npmjs.org/ zeigt

Vercel Einstellungen:
- Root Directory: rollladen-sonnenschutz-app
- Install Command: npm install --no-audit --no-fund
- Build Command: npm run build
- Output Directory: dist
- Node.js Version: 20.x

Danach Redeploy mit Clear Build Cache / ohne Cache.
