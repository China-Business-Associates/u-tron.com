# u-tron.com Static Site

## CI/CD Deployment Process

Deployments run automatically via GitHub Actions workflow [.github/workflows/deploy.yml](.github/workflows/deploy.yml).

### Workflow Stages

1. **Trigger (Push)**:
   - Triggers on push or pull request to `main`.

2. **Lint & Quality Verification (`verify` job)**:
   - **JS Syntax**: `node --check js/*.js`
   - **HTML Validation**: `npx htmlhint "**/*.html"`
   - **Link & Asset Audit**: `npx linkinator index.html --recurse --url-rewrite-search "^https://u-tron\.com/" --url-rewrite-replace "/" --retry-errors --retry-errors-count 3`

3. **Deploy to Production (`deploy` job)**:
   - Executes only on `push` to `main` after `verify` succeeds.
   - Syncs static assets via `rsync` over SSH to `/home/cba_admin1/u-tron.com/`.
   - Automatically excludes `.git*` and `.github*`.
   - Required repository secret: `SSH_PRIVATE_KEY` (optional: `SSH_HOST`, `SSH_USER`).

### Local Verification

Run checks locally before pushing:

```bash
node --check js/*.js
npx htmlhint "**/*.html"
npx linkinator index.html --config linkinator.config.json --recurse
```

### Manual Deployment Fallback

```bash
rsync -avz --delete --exclude='.git*' --exclude='.github*' ./ cba_admin1@u-tron.com:/home/cba_admin1/u-tron.com/
```
