class CurrencyApp {
    constructor() {
        this.apiUrl = 'http://localhost:3000/api';
        this.currency = 'ARS';
        this.autoRefreshInterval = null;
        this.init();
    }

    init() {
        // Get elements
        this.apiUrlInput = document.getElementById('api-url');
        this.currencySelect = document.getElementById('currency-select');
        this.refreshBtn = document.getElementById('refresh-btn');
        this.statusText = document.getElementById('status-text');
        this.lastUpdateText = document.getElementById('last-update');

        // Set up event listeners
        this.apiUrlInput.addEventListener('change', (e) => {
            this.apiUrl = e.target.value.trim();
            this.loadAllData();
        });

        this.currencySelect.addEventListener('change', (e) => {
            this.currency = e.target.value;
            this.loadAllData();
        });

        this.refreshBtn.addEventListener('click', () => {
            this.loadAllData();
        });

        // Load initial data
        this.loadAllData();

        // Auto-refresh every 60 seconds
        this.autoRefreshInterval = setInterval(() => {
            this.loadAllData();
        }, 60000);
    }

    async loadAllData() {
        this.setStatus('Loading...', 'loading');
        
        try {
            await Promise.all([
                this.loadQuotes(),
                this.loadAverage(),
                this.loadSlippage()
            ]);
            
            this.setStatus('Data loaded successfully', 'success');
            this.updateLastUpdateTime();
        } catch (error) {
            this.setStatus('Error loading data', 'error');
            console.error('Error loading data:', error);
        }
    }

    async loadQuotes() {
        const container = document.getElementById('quotes-container');
        const loading = document.getElementById('quotes-loading');
        const error = document.getElementById('quotes-error');

        loading.style.display = 'block';
        error.style.display = 'none';
        container.innerHTML = '';

        try {
            const response = await fetch(`${this.apiUrl}/quotes?currency=${this.currency}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const quotes = await response.json();
            
            loading.style.display = 'none';

            if (quotes.length === 0) {
                container.innerHTML = '<p class="no-data">No quotes available</p>';
                return;
            }

            const grid = document.createElement('div');
            grid.className = 'quote-grid';

            quotes.forEach(quote => {
                const quoteItem = this.createQuoteElement(quote);
                grid.appendChild(quoteItem);
            });

            container.appendChild(grid);
        } catch (err) {
            loading.style.display = 'none';
            error.style.display = 'block';
            error.textContent = `Error loading quotes: ${err.message}`;
            console.error('Error fetching quotes:', err);
        }
    }

    async loadAverage() {
        const container = document.getElementById('average-container');
        const loading = document.getElementById('average-loading');
        const error = document.getElementById('average-error');

        loading.style.display = 'block';
        error.style.display = 'none';
        container.innerHTML = '';

        try {
            const response = await fetch(`${this.apiUrl}/average?currency=${this.currency}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const average = await response.json();
            
            loading.style.display = 'none';

            const grid = document.createElement('div');
            grid.className = 'average-grid';

            grid.innerHTML = `
                <div class="average-item">
                    <div class="average-label">Average Buy Price</div>
                    <div class="average-value">$${average.average_buy_price.toFixed(2)}</div>
                </div>
                <div class="average-item">
                    <div class="average-label">Average Sell Price</div>
                    <div class="average-value">$${average.average_sell_price.toFixed(2)}</div>
                </div>
            `;

            if (average.sources_count) {
                grid.innerHTML += `
                    <div class="average-info">
                        <strong>Currency:</strong> ${average.currency}<br>
                        <strong>Sources:</strong> ${average.sources_count}
                    </div>
                `;
            }

            container.appendChild(grid);
        } catch (err) {
            loading.style.display = 'none';
            error.style.display = 'block';
            error.textContent = `Error loading average: ${err.message}`;
            console.error('Error fetching average:', err);
        }
    }

    async loadSlippage() {
        const container = document.getElementById('slippage-container');
        const loading = document.getElementById('slippage-loading');
        const error = document.getElementById('slippage-error');

        loading.style.display = 'block';
        error.style.display = 'none';
        container.innerHTML = '';

        try {
            const response = await fetch(`${this.apiUrl}/slippage?currency=${this.currency}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const slippages = await response.json();
            
            loading.style.display = 'none';

            if (slippages.length === 0) {
                container.innerHTML = '<p class="no-data">No slippage data available</p>';
                return;
            }

            const table = document.createElement('table');
            table.className = 'slippage-table';

            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Source</th>
                        <th>Buy Price Slippage</th>
                        <th>Sell Price Slippage</th>
                    </tr>
                </thead>
                <tbody>
                    ${slippages.map(slip => `
                        <tr>
                            <td>${this.truncateUrl(slip.source)}</td>
                            <td class="${this.getSlippageClass(slip.buy_price_slippage)}">
                                ${this.formatSlippage(slip.buy_price_slippage)}
                            </td>
                            <td class="${this.getSlippageClass(slip.sell_price_slippage)}">
                                ${this.formatSlippage(slip.sell_price_slippage)}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            `;

            container.appendChild(table);
        } catch (err) {
            loading.style.display = 'none';
            error.style.display = 'block';
            error.textContent = `Error loading slippage: ${err.message}`;
            console.error('Error fetching slippage:', err);
        }
    }

    createQuoteElement(quote) {
        const div = document.createElement('div');
        div.className = 'quote-item';

        div.innerHTML = `
            <div class="quote-source">${this.truncateUrl(quote.source)}</div>
            <div class="quote-prices">
                <div class="price-box buy">
                    <div class="price-label">Buy</div>
                    <div class="price-value">$${quote.buy_price.toFixed(2)}</div>
                </div>
                <div class="price-box sell">
                    <div class="price-label">Sell</div>
                    <div class="price-value">$${quote.sell_price.toFixed(2)}</div>
                </div>
            </div>
        `;

        return div;
    }

    truncateUrl(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname + urlObj.pathname;
        } catch (e) {
            return url;
        }
    }

    formatSlippage(value) {
        const percentage = (value * 100).toFixed(2);
        const sign = value >= 0 ? '+' : '';
        return `${sign}${percentage}%`;
    }

    getSlippageClass(value) {
        if (Math.abs(value) < 0.01) {
            return 'slippage-neutral';
        }
        return value >= 0 ? 'slippage-positive' : 'slippage-negative';
    }

    setStatus(message, type) {
        this.statusText.textContent = message;
        this.statusText.style.color = type === 'success' ? 'var(--success-color)' : 
                                       type === 'error' ? 'var(--danger-color)' : 
                                       'var(--warning-color)';
    }

    updateLastUpdateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        this.lastUpdateText.textContent = `Last updated: ${timeString}`;
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new CurrencyApp();
});
