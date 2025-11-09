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
            platforms: [],
            physical: '',
            owned: '',
            sortBy: 'name'
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupMultiselect();
        this.render();
    }

    setupMultiselect() {
        const elements = this.getMultiselectElements();

        this.setupDropdownToggle(elements);
        this.setupAllCheckbox(elements);
        this.setupPlatformCheckboxes(elements);

        elements.allCheckbox.checked = true;
    }

    getMultiselectElements() {
        const dropdown = document.getElementById('platformFilterDropdown');
        const button = document.getElementById('platformFilterButton');
        const options = dropdown.querySelector('.multiselect-options');
        const checkboxes = options.querySelectorAll('input[type="checkbox"]');
        const allCheckbox = options.querySelector('input[data-all="true"]');
        const platformCheckboxes = Array.from(checkboxes).filter(cb => !cb.hasAttribute('data-all'));

        return { dropdown, button, allCheckbox, platformCheckboxes };
    }

    setupDropdownToggle({ dropdown, button }) {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    }

    setupAllCheckbox({ button, allCheckbox, platformCheckboxes }) {
        allCheckbox.addEventListener('change', () => {
            if (allCheckbox.checked) {
                platformCheckboxes.forEach(cb => cb.checked = false);
            }
            this.updatePlatformFilter(button, allCheckbox, platformCheckboxes);
        });
    }

    setupPlatformCheckboxes({ button, allCheckbox, platformCheckboxes }) {
        platformCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    allCheckbox.checked = false;
                } else if (!platformCheckboxes.some(cb => cb.checked)) {
                    allCheckbox.checked = true;
                }
                this.updatePlatformFilter(button, allCheckbox, platformCheckboxes);
            });
        });
    }

    updatePlatformFilter(button, allCheckbox, platformCheckboxes) {
        const selected = platformCheckboxes
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        this.filters.platforms = selected;

        // Update button text
        if (allCheckbox.checked || selected.length === 0) {
            button.textContent = 'All Platforms';
        } else if (selected.length === 1) {
            button.textContent = selected[0];
        } else if (selected.length === platformCheckboxes.length) {
            button.textContent = 'All Platforms';
        } else {
            button.textContent = `${selected.length} Platforms`;
        }

        this.applyFilters();
    }

    setupEventListeners() {
        // Search
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.filters.search = e.target.value.toLowerCase();
            this.applyFilters();
        });

        // Physical release filter
        document.getElementById('physicalFilter').addEventListener('change', (e) => {
            this.filters.physical = e.target.value;
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
            platforms: [],
            physical: '',
            owned: '',
            sortBy: 'name'
        };

        document.getElementById('searchInput').value = '';

        // Reset platform multiselect
        const dropdown = document.getElementById('platformFilterDropdown');
        const button = document.getElementById('platformFilterButton');
        const allCheckbox = dropdown.querySelector('input[data-all="true"]');
        const platformCheckboxes = dropdown.querySelectorAll('input[type="checkbox"]:not([data-all])');

        platformCheckboxes.forEach(cb => cb.checked = false);
        allCheckbox.checked = true;
        button.textContent = 'All Platforms';

        document.getElementById('physicalFilter').value = '';
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

        // Platform filter (multi-select)
        if (this.filters.platforms && this.filters.platforms.length > 0) {
            filtered = filtered.filter(game =>
                game.platforms.some(platform => this.filters.platforms.includes(platform))
            );
        }

        // Physical release filter
        if (this.filters.physical === 'physical') {
            filtered = filtered.filter(game => game.hasPhysical === true);
        } else if (this.filters.physical === 'digital') {
            filtered = filtered.filter(game => game.hasPhysical === false);
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

        return {
            totalGames,
            ownedGames,
            percentage
        };
    }

    getPlatformIcons(platforms) {
        // Using Simple Icons - cleaner, official brand icons
        const PLATFORM_SVGS = {
            playstation: '<svg class="platform-icon" viewBox="0 0 24 24" title="PlayStation"><path fill="currentColor" d="M8.984 2.596v17.547l3.915 1.261V6.688c0-.69.304-1.151.794-.991.636.18.76.814.76 1.505v5.875c2.441 1.193 4.362-.002 4.362-3.152 0-3.237-1.126-4.675-4.438-5.827-1.307-.448-3.728-1.186-5.39-1.502zm4.656 16.241l6.296-2.275c.715-.258.826-.625.246-.818-.586-.192-1.637-.139-2.357.123l-4.205 1.5V14.98l.24-.085s1.201-.42 2.913-.615c1.696-.18 3.785.03 5.437.661 1.848.601 2.04 1.472 1.576 2.072-.465.6-1.622 1.036-1.622 1.036l-8.544 3.107V18.86zM1.807 18.6c-1.9-.545-2.214-1.668-1.352-2.32.801-.586 2.16-1.052 2.16-1.052l5.615-2.013v2.313L4.205 17c-.705.271-.825.632-.239.826.586.195 1.637.15 2.343-.12L8.247 17v2.074c-.12.03-.256.044-.39.073-1.939.331-3.996.196-6.038-.479z"/></svg>',
            xbox: '<svg class="platform-icon" viewBox="0 0 16 16" title="Xbox"><path fill="currentColor" d="M7.202 15.967a8 8 0 0 1-3.552-1.26c-.898-.585-1.101-.826-1.101-1.306 0-.965 1.062-2.656 2.879-4.583C6.459 7.723 7.897 6.44 8.052 6.475c.302.068 2.718 2.423 3.622 3.531 1.43 1.753 2.088 3.189 1.754 3.829-.254.486-1.83 1.437-2.987 1.802-.954.301-2.207.429-3.239.33m-5.866-3.57C.589 11.253.212 10.127.03 8.497c-.06-.539-.038-.846.137-1.95.218-1.377 1.002-2.97 1.945-3.95.401-.417.437-.427.926-.263.595.2 1.23.638 2.213 1.528l.574.519-.313.385C4.056 6.553 2.52 9.086 1.94 10.653c-.315.852-.442 1.707-.306 2.063.091.24.007.15-.3-.319Zm13.101.195c.074-.36-.019-1.02-.238-1.687-.473-1.443-2.055-4.128-3.508-5.953l-.457-.575.494-.454c.646-.593 1.095-.948 1.58-1.25.381-.237.927-.448 1.161-.448.145 0 .654.528 1.065 1.104a8.4 8.4 0 0 1 1.343 3.102c.153.728.166 2.286.024 3.012a9.5 9.5 0 0 1-.6 1.893c-.179.393-.624 1.156-.82 1.404-.1.128-.1.127-.043-.148ZM7.335 1.952c-.67-.34-1.704-.705-2.276-.803a4 4 0 0 0-.759-.043c-.471.024-.45 0 .306-.358A7.8 7.8 0 0 1 6.47.128c.8-.169 2.306-.17 3.094-.005.85.18 1.853.552 2.418.9l.168.103-.385-.02c-.766-.038-1.88.27-3.078.853-.361.176-.676.316-.699.312a12 12 0 0 1-.654-.319Z"/></svg>',
            nintendo: '<svg class="platform-icon" viewBox="0 0 24 24" title="Nintendo Switch"><path fill="currentColor" d="M14.176 24h3.674c3.376 0 6.15-2.774 6.15-6.15V6.15C24 2.775 21.226 0 17.85 0H14.176c-.074 0-.15.074-.15.15v23.7c0 .076.076.15.15.15zm4.574-13.199c1.351 0 2.399 1.125 2.399 2.398 0 1.352-1.125 2.4-2.399 2.4-1.35 0-2.4-1.049-2.4-2.4-.001-1.349 1.05-2.398 2.4-2.398zM11.4 0H6.15C2.775 0 0 2.775 0 6.15v11.7C0 21.226 2.775 24 6.15 24h5.25c.076 0 .15-.074.15-.15V.15c0-.076-.074-.15-.15-.15zM9.676 22.051H6.15c-2.326 0-4.201-1.875-4.201-4.201V6.15c0-2.326 1.875-4.201 4.201-4.201h3.526v20.102zM3.75 7.199c0 1.275.975 2.25 2.25 2.25s2.25-.975 2.25-2.25c0-1.273-.975-2.25-2.25-2.25s-2.25.977-2.25 2.25z"/></svg>',
            pc: '<svg class="platform-icon" viewBox="0 0 24 24" title="Steam"><path fill="currentColor" d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z"/></svg>'
        };

        const families = {
            playstation: platforms.some(p => p.includes('PS') || p.includes('PlayStation') || p.includes('Vita')),
            xbox: platforms.some(p => p.includes('Xbox')),
            nintendo: platforms.some(p => p.includes('Switch') || p.includes('Nintendo')),
            pc: platforms.some(p => p.toLowerCase() === 'pc')
        };

        return Object.entries(families)
            .filter(([_, hasFamily]) => hasFamily)
            .map(([family]) => PLATFORM_SVGS[family])
            .join('');
    }

    renderStats() {
        const stats = this.calculateStats();

        document.getElementById('totalGames').textContent = stats.totalGames;
        document.getElementById('ownedGames').textContent = stats.ownedGames;
        document.getElementById('completionPercentage').textContent = `${stats.percentage}%`;
    }

    renderGames() {
        const grid = document.getElementById('gamesGrid');

        if (this.filteredGames.length === 0) {
            grid.innerHTML = this.getEmptyStateHTML();
            return;
        }

        grid.innerHTML = this.filteredGames.map(game => this.getGameCardHTML(game)).join('');
        this.attachGameCardListeners(grid);
    }

    getEmptyStateHTML() {
        return `
            <div class="empty-state">
                <h3>No games found</h3>
                <p>Try adjusting your filters</p>
            </div>
        `;
    }

    getGameCardHTML(game) {
        const isOwned = this.storage.isOwned(game.id);
        const platformIcons = this.getPlatformIcons(game.platforms);
        const coverUrl = game.cover || 'https://via.placeholder.com/264x374/0f3460/e94560?text=No+Cover';
        const physicalBadge = game.hasPhysical
            ? '<span class="physical-badge">Physical</span>'
            : '<span class="digital-badge">Digital Only</span>';

        return `
            <div class="game-card ${isOwned ? 'owned' : ''}" data-game-id="${game.id}">
                <img src="${coverUrl}" alt="${game.name} Cover" class="game-cover" loading="lazy">
                <div class="game-content">
                    <div class="game-title">${game.name}</div>
                    <div class="game-info">
                        <div class="game-detail">
                            <span class="game-detail-label">Platform:</span>
                            <span class="game-detail-value platform-icons">${platformIcons}</span>
                        </div>
                        <div class="game-detail">
                            <span class="game-detail-label">Release:</span>
                            <span class="game-detail-value">${physicalBadge}</span>
                        </div>
                        <div class="game-detail">
                            <span class="game-detail-label">Year:</span>
                            <span class="game-detail-value">${game.year}</span>
                        </div>
                        <div class="game-detail">
                            <span class="game-detail-label">Developer:</span>
                            <span class="game-detail-value">${game.developer}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    attachGameCardListeners(grid) {
        grid.querySelectorAll('.game-card').forEach(card => {
            card.addEventListener('click', () => {
                this.storage.toggleGame(card.dataset.gameId);
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
