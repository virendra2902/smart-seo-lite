# 🚀 Publishing smart-seo-lite to npm

## Prerequisites
- Node.js ≥ 16
- npm account at npmjs.com

## Steps

### 1. Install dependencies
```bash
npm install
```

### 2. Build the package
```bash
npm run build
```
This creates the `dist/` folder with CJS + ESM builds.

### 3. Login to npm
```bash
npm login
```

### 4. Test the package locally (optional but recommended)
```bash
npm pack
# This creates smart-seo-lite-1.0.0.tgz
# Test it in another project with:
# npm install ../path/to/smart-seo-lite-1.0.0.tgz
```

### 5. Publish!
```bash
npm publish --access public
```

## Updating the version
```bash
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.0 → 1.1.0
npm version major  # 1.0.0 → 2.0.0
npm publish
```

## Tips
- Update README before publishing
- Add a CHANGELOG.md for version history
- Set up GitHub Actions for auto-publish on tag push
