# RZXXY Football Live

Next.js football match centre with live-score/fixture data supplied by API-Football (API-Sports).

## Setup

1. Create an API-Football account and get an API key from API-Sports.
2. In Vercel, open the **rzxxy-football-live** project.
3. Go to **Settings → Environment Variables**.
4. Add `API_FOOTBALL_KEY` with your API key. Enable it for Production (and Preview if needed).
5. Redeploy the latest deployment.
6. Open the website and press **Refresh** in Match Centre.

Keep the API key on the server as a Vercel environment variable. Do not put it in client-side code, commit it to GitHub, or share it publicly.

## Data behavior

- The server route `/api/matches` requests currently live fixtures first.
- If there are no live matches, it requests fixtures for today's date in the Asia/Yangon timezone.
- Search, status filters, league shortcuts, refresh, and match details are handled by the website UI.
- API access, league coverage, update frequency, and request quotas depend on the API-Sports account/plan.
- Authorized live video is not included; score data does not provide a video stream.

## Run locally

```bash
npm install
npm run dev
```

Set `API_FOOTBALL_KEY` in a local `.env.local` file when running locally. Never commit that file.
