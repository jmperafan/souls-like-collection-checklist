#!/usr/bin/env node
// Unified script to update game prices and search for new games

import axios from 'axios';
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PRICECHARTING_API_KEY = process.env.PRICECHARTING_API_KEY;
const DATA_PATH = join(__dirname, '..', 'src', 'data.js');

// Platform mappings
const PLATFORMS = {
    PS3: 'playstation-3',
    PS4: 'playstation-4',
    PS5: 'playstation-5'
};

// Load games data
function loadGames() {
    const content = readFileSync(DATA_PATH, 'utf8');
    const match = content.match(/const gamesData = (\[[\s\S]*?\]);/);
    return match ? eval(match[1]) : [];
}

// Save games data
function saveGames(games) {
    const content = `// Souls-like games with physical releases on PlayStation platforms
// Last updated: ${new Date().toISOString()}

const gamesData = ${JSON.stringify(games, null, 4)};
`;
    writeFileSync(DATA_PATH, content, 'utf8');
}

// Update price for a single game
async function updatePrice(game) {
    if (!PRICECHARTING_API_KEY) return null;

    try {
        const platform = PLATFORMS[game.platforms[0]];
        const response = await axios.get('https://www.pricecharting.com/api/product', {
            params: {
                t: PRICECHARTING_API_KEY,
                q: game.name,
                console: platform
            }
        });

        if (response.data?.products?.[0]) {
            const product = response.data.products[0];
            return parseFloat(product['loose-price'] || product['cib-price'] || 0);
        }
    } catch (error) {
        console.error(`Error fetching price for ${game.name}:`, error.message);
    }
    return null;
}

// Main update function
async function updateAllPrices() {
    console.log('🔄 Updating game prices...\n');

    const games = loadGames();
    let updated = 0;

    for (let i = 0; i < games.length; i++) {
        const game = games[i];
        console.log(`[${i + 1}/${games.length}] ${game.name}`);

        const newPrice = await updatePrice(game);
        if (newPrice && newPrice !== game.price) {
            console.log(`  💰 $${game.price} → $${newPrice}`);
            game.price = newPrice;
            updated++;
        }

        // Rate limit: 1 request per second
        if (i < games.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    if (updated > 0) {
        saveGames(games);
        console.log(`\n✅ Updated ${updated} prices`);
    } else {
        console.log('\n✓ All prices current');
    }
}

// Run update
if (!PRICECHARTING_API_KEY) {
    console.log('⚠️  No API key. Set PRICECHARTING_API_KEY to update prices.');
    process.exit(0);
}

updateAllPrices().catch(error => {
    console.error('❌ Error:', error.message);
    process.exit(1);
});
