# Setting Up Automated Updates

This guide will help you set up the automated price updates and game discovery features.

## Overview

The automation consists of two main components:

1. **GitHub Actions**: Runs weekly to update prices and search for new games
2. **Local Scripts**: Can be run manually for testing or immediate updates

## Quick Start

### 1. Get API Keys

#### PriceCharting (Required for Price Updates)

1. Go to https://www.pricecharting.com/api-documentation
2. Sign up for an account
3. Subscribe to an API plan (free tier available: 100 requests/day)
4. Copy your API key

#### Reddit (Optional - Enhances Game Discovery)

1. Go to https://www.reddit.com/prefs/apps
2. Click "create another app..."
3. Fill in the form:
   - **Name**: SoulslikeCollectionBot (or your choice)
   - **Type**: Select "script"
   - **Description**: For tracking souls-like physical releases
   - **About URL**: (leave blank)
   - **Redirect URI**: http://localhost:8080
4. Click "create app"
5. Copy the **client ID** (under the app name) and **client secret**

### 2. Configure GitHub Secrets

To enable GitHub Actions automation:

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the following secrets:

| Secret Name | Description | Required? |
|-------------|-------------|-----------|
| `PRICECHARTING_API_KEY` | Your PriceCharting API key | Yes (for prices) |
| `REDDIT_CLIENT_ID` | Reddit app client ID | Optional |
| `REDDIT_CLIENT_SECRET` | Reddit app client secret | Optional |
| `REDDIT_USER_AGENT` | Format: `AppName/1.0.0 (by /u/username)` | Optional |

### 3. Test Locally (Optional)

Before relying on GitHub Actions, you can test the scripts locally:

```bash
cd scripts

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your API keys
nano .env  # or use your favorite editor

# Run the test script
./test-local.sh
```

The test script provides options to:
- Test price updates only
- Test Reddit search only
- Run both scripts
- View discovered games

## How It Works

### Automated Workflow (Weekly)

Every Monday at 9 AM UTC, GitHub Actions will:

1. **Update Prices**:
   - Fetch current prices from PriceCharting for all games
   - Update `data.js` with new prices
   - Commit changes if prices changed

2. **Search for New Games**:
   - Search Reddit for physical release announcements
   - Look for souls-like games on PS3/PS4/PS5
   - Save findings to `potential-new-games.json`
   - Create a GitHub Issue if new games are found

3. **Notification**:
   - If new potential games are discovered, an issue is created
   - Review the issue and manually add verified games to `data.js`

### Manual Trigger

You can manually run the workflow anytime:

1. Go to **Actions** tab in your repository
2. Select **Update Games and Prices**
3. Click **Run workflow** → **Run workflow**

## Understanding the Results

### Price Updates

When prices are updated, you'll see a commit like:
```
chore: automated update of game prices and new game discoveries [skip ci]
```

Check the commit to see which prices changed.

### New Game Discoveries

New games are saved to `scripts/potential-new-games.json` and reported in a GitHub Issue.

**Confidence Levels:**
- **High**: Official announcement, confirmed physical release
- **Medium**: Likely physical release, needs verification
- **Low**: Possible physical release, more research needed

**Review Process:**
1. Check the GitHub Issue created by the bot
2. Verify each game has a physical release on PriceCharting
3. Confirm it's a souls-like (check r/soulslikes wiki)
4. Manually add to `data.js` if verified
5. Close the issue

## Customization

### Change Schedule

Edit `.github/workflows/update-games.yml`:

```yaml
on:
  schedule:
    # Current: Every Monday at 9 AM UTC
    - cron: '0 9 * * 1'

    # Daily: - cron: '0 9 * * *'
    # Twice per week: - cron: '0 9 * * 1,4'
```

### Modify Search Terms

Edit `scripts/search-reddit.js`:

```javascript
// Add or remove subreddits
const SUBREDDITS = [
    'soulslikes',
    'your_subreddit'
];

// Add or remove search terms
const SEARCH_TERMS = [
    'souls-like physical release',
    'your custom term'
];
```

### Adjust Rate Limits

In the scripts, modify the delay values:

```javascript
// update-prices.js
await delay(1000); // 1 second between requests

// search-reddit.js
await new Promise(resolve => setTimeout(resolve, 2000)); // 2 seconds
```

## Troubleshooting

### Workflow Fails

Check the Actions tab for error details:

1. **"No API key provided"**: Add the `PRICECHARTING_API_KEY` secret
2. **"Rate limit exceeded"**: Wait for the limit to reset or upgrade your API plan
3. **"Parse error"**: Check `data.js` for syntax errors

### No New Games Found

This is normal! Not every week will have new announcements. The search looks for:
- Physical release announcements
- PlayStation platform mentions
- Souls-like genre indicators

### Duplicate Detections

The scripts automatically filter out games already in `data.js`, but may occasionally suggest variants (e.g., GOTY editions). Review and manually add only if needed.

### Local Testing Issues

```bash
# Reinstall dependencies
cd scripts
rm -rf node_modules
npm install

# Check environment variables
cat .env

# Run scripts with debug output
DEBUG=* node update-prices.js
```

## Best Practices

1. **Review Before Adding**: Always verify new games on PriceCharting before adding
2. **Check Prices Manually**: Occasionally spot-check prices to ensure accuracy
3. **Monitor Issues**: Review GitHub Issues created by the bot regularly
4. **Keep API Keys Secret**: Never commit `.env` file or expose API keys
5. **Update Dependencies**: Periodically run `npm update` in the scripts folder

## API Rate Limits

### PriceCharting
- **Free Tier**: 100 requests/day
- **Paid Tiers**: Higher limits available
- With 48 games, weekly updates fit within free tier

### Reddit
- **Authenticated**: 60 requests/minute
- **Public API**: ~30 requests/minute
- Scripts respect rate limits automatically

## Need Help?

- Check existing GitHub Issues for similar problems
- Review the script output for error messages
- Ensure API keys are correctly configured
- Test locally before relying on automation

---

**Note**: Price data from PriceCharting represents market averages and may vary by condition, region, and retailer.
