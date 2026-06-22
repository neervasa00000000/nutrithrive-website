# ARKIVE — Testnet MVP

Permanent social feed + encrypted vault on Base Sepolia.

## Prerequisites

- Node.js 18+
- MetaMask (or compatible wallet) on Base Sepolia testnet
- [WalletConnect Project ID](https://cloud.walletconnect.com/)
- Arweave JWK key for uploads (Turbo SDK)

## Setup

### 1. Contracts

```bash
cd arkive/contracts
npm install
cp ../.env.example .env
# Edit .env and set DEPLOYER_PRIVATE_KEY (testnet wallet only)
npx hardhat compile
npx hardhat test
```

### 2. Deploy to Base Sepolia

Only run when `DEPLOYER_PRIVATE_KEY` is set in `contracts/.env`:

```bash
npx hardhat run scripts/deploy.js --network baseSepolia
```

This writes contract addresses to `frontend/src/config/contracts.js` and copies ABIs to `frontend/src/contracts/`.

If deploy is skipped, copy ABIs from compile artifacts:

```bash
node -e "
const fs=require('fs');
const names=['PointsSystem','UserRegistry','PostRegistry','VaultRegistry'];
for(const n of names){
  const a=require('./artifacts/contracts/'+n+'.sol/'+n+'.json');
  fs.writeFileSync('../frontend/src/contracts/'+n+'.json',JSON.stringify({abi:a.abi},null,2));
}
"
```

### 3. Frontend

```bash
cd arkive/frontend
npm install
cp ../.env.example .env
# Set VITE_WALLETCONNECT_PROJECT_ID and VITE_ARWEAVE_KEY
npm run dev
```

Open http://localhost:5173

### 4. Production build

```bash
npm run build
npm run preview
```

### 5. Private preview on nutrithrive.com.au

Unlisted path: **https://nutrithrive.com.au/private/arkive-preview/**

- Not linked from the main site or sitemap
- `X-Robots-Tag: noindex, nofollow` + `<meta name="robots" content="noindex, nofollow">`
- HTTP Basic Auth (Netlify Pro+): username `nt-preview`, password `arkive-test-2026`
- SPA fallback and relaxed CSP are configured in `_redirects` and `netlify.toml`

Build and copy into the site repo:

```bash
# From repo root — set arkive/frontend/.env first (see .env.example)
node scripts/build-arkive-preview.mjs
git add private/arkive-preview
git push   # Netlify auto-deploys on push
```

**Build-time env vars** (baked into the bundle):

| Variable | Required | Purpose |
|----------|----------|---------|
| `VITE_WALLETCONNECT_PROJECT_ID` | Yes (wallet UI) | RainbowKit / WalletConnect |
| `VITE_ARWEAVE_KEY` | For uploads | Arweave JWK JSON string for Turbo uploads |

Without `VITE_WALLETCONNECT_PROJECT_ID`, the preview shows a setup screen instead of the app.

**Deploy:** Push to the connected Git branch (same as the main NutriThrive site). Netlify runs `npm ci && npm run build:minify && node scripts/prepare-netlify-publish.mjs` and publishes `.netlify-publish/`. The ARKIVE bundle under `private/arkive-preview/` is copied as static files (source under `arkive/` is excluded from publish).

**Note:** Basic Auth via `Basic-Auth` header requires a Netlify Pro or Enterprise plan. On Free, the obscure URL + noindex still limits discovery.


- **Feed**: Posts uploaded to Arweave, registered on `PostRegistry`. Likes award points.
- **Vault**: Files encrypted client-side via Lit Protocol, stored on Arweave, registered on `VaultRegistry`.
- **Points**: `PointsSystem` tracks balances; `PostRegistry` is authorised to award points.

## Network

- Chain: Base Sepolia (chain ID 84532)
- RPC: https://sepolia.base.org

## Test flow

1. Connect wallet (Base Sepolia)
2. Register username on Profile (225 welcome points)
3. Create text/image post on Feed
4. Like another user's post
5. Upload file to Vault
6. Decrypt and view vault file
