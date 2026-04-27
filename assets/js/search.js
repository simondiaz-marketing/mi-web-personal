export class SearchManager {
    constructor() {
        this.overlay = document.getElementById('search-overlay');
        this.input = document.getElementById('search-input');
        this.resultsContainer = document.getElementById('search-results');
        this.closeBtn = document.getElementById('close-search');
        this.navBtn = document.getElementById('search-nav-btn');
        this.blogBtn = document.getElementById('search-blog-btn');
        this.blogPosts = [];
        this.youtubeVideos = [];

        this.init();
    }

    async init() {
        if (!this.overlay) return;

        // Fetch blog posts - Using a more robust path
        try {
            // Try absolute root first, then relative if that fails
            let response = await fetch('/data/blog-posts.json');
            if (!response.ok) throw new Error('Root fetch failed');
            this.blogPosts = await response.json();
        } catch (e) {
            try {
                // Fallback for subfolders or different base paths
                let response = await fetch('../data/blog-posts.json');
                this.blogPosts = await response.json();
            } catch (err) {
                console.warn('Could not load blog posts for search:', err);
            }
        }

        // Try to get videos from the YouTube global state if available
        this.getYouTubeVideos();

        // Setup event listeners
        this.navBtn?.addEventListener('click', () => this.open());
        this.blogBtn?.addEventListener('click', () => this.open());
        this.closeBtn?.addEventListener('click', () => this.close());
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) this.close();
        });

        this.input.addEventListener('input', () => this.performSearch());

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.overlay.classList.contains('active')) {
                this.close();
            }
        });
    }

    open() {
        this.getYouTubeVideos(); // Refresh video list in case they loaded late
        this.overlay.classList.add('active');
        this.overlay.style.display = 'flex';
        setTimeout(() => {
            this.overlay.style.opacity = '1';
            this.input.focus();
        }, 10);
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.overlay.style.opacity = '0';
        setTimeout(() => {
            this.overlay.classList.remove('active');
            this.overlay.style.display = 'none';
            this.input.value = '';
            this.resultsContainer.innerHTML = '';
        }, 400);
        document.body.style.overflow = '';
    }

    getYouTubeVideos() {
        this.youtubeVideos = []; // Clear to avoid duplicates
        const videoCards = document.querySelectorAll('.video-card');
        videoCards.forEach(card => {
            const title = card.querySelector('h3')?.textContent;
            const url = card.closest('a')?.href;
            if (title && url) {
                this.youtubeVideos.push({
                    title,
                    description: 'Video Tutorial',
                    url,
                    badge: 'Video'
                });
            }
        });
    }

    performSearch() {
        const query = this.input.value.toLowerCase().trim();
        if (query.length < 2) {
            this.resultsContainer.innerHTML = '';
            return;
        }

        const allItems = [...this.blogPosts, ...this.youtubeVideos];

        const filtered = allItems.filter(item => 
            item.title.toLowerCase().includes(query) || 
            (item.description && item.description.toLowerCase().includes(query))
        );

        this.renderResults(filtered);
    }

    renderResults(results) {
        this.resultsContainer.innerHTML = '';

        if (results.length === 0) {
            this.resultsContainer.innerHTML = '<p style="text-align:center; color:var(--text-dim);">No se encontraron resultados.</p>';
            return;
        }

        results.forEach(item => {
            const resultItem = document.createElement('a');
            resultItem.href = item.url.startsWith('http') ? item.url : `/${item.url}`;
            resultItem.className = 'search-result-item';
            
            resultItem.innerHTML = `
                <div class="badge">${item.badge || 'IA'}</div>
                <h4>${item.title}</h4>
                <p>${item.description}</p>
            `;

            this.resultsContainer.appendChild(resultItem);
        });
    }
}
