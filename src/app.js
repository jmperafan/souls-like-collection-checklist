// Storage management
const STORAGE_KEY = 'soulslike_collection';
const STORAGE_VERSION = '1.0';

class StorageManager {
    getCollection() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            if (!data) {
                return { owned: {}, version: STORAGE_VERSION };
            }
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading collection from localStorage:', error);
            return { owned: {}, version: STORAGE_VERSION };
        }
    }

    saveCollection(collection) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                ...collection,
                version: STORAGE_VERSION,
                lastUpdated: new Date().toISOString()
            }));
            return true;
        } catch (error) {
            console.error('Error saving collection to localStorage:', error);
            return false;
        }
    }

    toggleGame(gameId) {
        const collection = this.getCollection();

        if (collection.owned[gameId]) {
            delete collection.owned[gameId];
        } else {
            collection.owned[gameId] = true;
        }

        this.saveCollection(collection);
        return collection.owned[gameId] || false;
    }

    isOwned(gameId) {
        const collection = this.getCollection();
        return !!collection.owned[gameId];
    }

    exportCollection() {
        const collection = this.getCollection();
        const dataStr = JSON.stringify(collection, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `soulslike-collection-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    importCollection(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const imported = JSON.parse(e.target.result);

                    if (!imported.owned || typeof imported.owned !== 'object') {
                        reject(new Error('Invalid collection file format'));
                        return;
                    }

                    this.saveCollection(imported);
                    resolve(imported);
                } catch (error) {
                    reject(new Error('Failed to parse collection file'));
                }
            };

            reader.onerror = () => {
                reject(new Error('Failed to read file'));
            };

            reader.readAsText(file);
        });
    }
}

// App State
class App {
    constructor() {
        this.storage = new StorageManager();
        this.games = gamesData; // From data.js
        this.filteredGames = [...this.games];
        this.filters = {
            search: '',
            platform: '',
            owned: '',
            sortBy: 'name'
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.render();
    }

    setupEventListeners() {
        // Search
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.filters.search = e.target.value.toLowerCase();
            this.applyFilters();
        });

        // Platform filter
        document.getElementById('platformFilter').addEventListener('change', (e) => {
            this.filters.platform = e.target.value;
            this.applyFilters();
        });

        // Owned filter
        document.getElementById('ownedFilter').addEventListener('change', (e) => {
            this.filters.owned = e.target.value;
            this.applyFilters();
        });

        // Sort
        document.getElementById('sortBy').addEventListener('change', (e) => {
            this.filters.sortBy = e.target.value;
            this.applyFilters();
        });

        // Reset filters
        document.getElementById('resetFilters').addEventListener('click', () => {
            this.resetFilters();
        });

        // Export
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.storage.exportCollection();
        });

        // Import
        document.getElementById('importFile').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.storage.importCollection(file)
                    .then(() => {
                        alert('Collection imported successfully!');
                        this.render();
                    })
                    .catch((error) => {
                        alert(`Failed to import collection: ${error.message}`);
                    });
                e.target.value = '';
            }
        });
    }

    resetFilters() {
        this.filters = {
            search: '',
            platform: '',
            owned: '',
            sortBy: 'name'
        };

        document.getElementById('searchInput').value = '';
        document.getElementById('platformFilter').value = '';
        document.getElementById('ownedFilter').value = '';
        document.getElementById('sortBy').value = 'name';

        this.applyFilters();
    }

    applyFilters() {
        let filtered = [...this.games];

        // Search filter
        if (this.filters.search) {
            filtered = filtered.filter(game =>
                game.name.toLowerCase().includes(this.filters.search)
            );
        }

        // Platform filter
        if (this.filters.platform) {
            filtered = filtered.filter(game =>
                game.platforms.includes(this.filters.platform)
            );
        }

        // Owned filter
        if (this.filters.owned === 'owned') {
            filtered = filtered.filter(game => this.storage.isOwned(game.id));
        } else if (this.filters.owned === 'needed') {
            filtered = filtered.filter(game => !this.storage.isOwned(game.id));
        }

        // Sort
        filtered = this.sortGames(filtered);

        this.filteredGames = filtered;
        this.render();
    }

    sortGames(games) {
        const sorted = [...games];

        switch (this.filters.sortBy) {
            case 'name':
                return sorted.sort((a, b) => a.name.localeCompare(b.name));

            case 'platform':
                return sorted.sort((a, b) => {
                    const aPlatform = a.platforms[0];
                    const bPlatform = b.platforms[0];
                    return aPlatform.localeCompare(bPlatform);
                });

            case 'priceAsc':
                return sorted.sort((a, b) => a.price - b.price);

            case 'priceDesc':
                return sorted.sort((a, b) => b.price - a.price);

            case 'year':
                return sorted.sort((a, b) => a.year - b.year);

            default:
                return sorted;
        }
    }

    calculateStats() {
        const totalGames = this.filteredGames.length;
        const ownedGames = this.filteredGames.filter(game =>
            this.storage.isOwned(game.id)
        ).length;
        const percentage = totalGames > 0 ? ((ownedGames / totalGames) * 100).toFixed(1) : 0;

        const totalValue = this.filteredGames.reduce((sum, game) => sum + game.price, 0);
        const ownedValue = this.filteredGames
            .filter(game => this.storage.isOwned(game.id))
            .reduce((sum, game) => sum + game.price, 0);

        return {
            totalGames,
            ownedGames,
            percentage,
            totalValue,
            ownedValue
        };
    }

    renderStats() {
        const stats = this.calculateStats();

        document.getElementById('totalGames').textContent = stats.totalGames;
        document.getElementById('ownedGames').textContent = stats.ownedGames;
        document.getElementById('completionPercentage').textContent = `${stats.percentage}%`;
        document.getElementById('totalValue').textContent = `$${stats.totalValue.toFixed(2)}`;
        document.getElementById('ownedValue').textContent = `$${stats.ownedValue.toFixed(2)}`;
    }

    renderGames() {
        const grid = document.getElementById('gamesGrid');

        if (this.filteredGames.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <h3>No games found</h3>
                    <p>Try adjusting your filters</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = this.filteredGames.map(game => {
            const isOwned = this.storage.isOwned(game.id);
            const platformBadges = game.platforms.map(p =>
                `<span class="platform-badge">${p}</span>`
            ).join('');

            // Use cover image or placeholder
            const coverUrl = game.cover || 'https://via.placeholder.com/264x374/0f3460/e94560?text=No+Cover';

            return `
                <div class="game-card ${isOwned ? 'owned' : ''}" data-game-id="${game.id}">
                    <img src="${coverUrl}" alt="${game.name} Cover" class="game-cover" loading="lazy">
                    <div class="game-content">
                        <div class="game-title">${game.name}</div>
                        <div class="game-info">
                            <div class="game-detail">
                                <span class="game-detail-label">Platform:</span>
                                <span class="game-detail-value">${platformBadges}</span>
                            </div>
                            <div class="game-detail">
                                <span class="game-detail-label">Year:</span>
                                <span class="game-detail-value">${game.year}</span>
                            </div>
                            <div class="game-price">$${game.price.toFixed(2)}</div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Add click handlers
        grid.querySelectorAll('.game-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const gameId = card.dataset.gameId;
                this.storage.toggleGame(gameId);
                this.render();
            });
        });
    }

    render() {
        this.renderStats();
        this.renderGames();
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
