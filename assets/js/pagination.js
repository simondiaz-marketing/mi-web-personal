export class PaginationManager {
    constructor() {
        this.container = document.getElementById('pagination-container');
        this.blogPosts = [];
        this.init();
    }

    async init() {
        if (!this.container) return;

        try {
            const dataPath = window.location.origin + '/data/academic-posts.json';
            const response = await fetch(dataPath);
            if (!response.ok) throw new Error('Fetch failed');
            this.blogPosts = await response.json();
        } catch (e) {
            try {
                const response = await fetch('../data/academic-posts.json');
                this.blogPosts = await response.json();
            } catch (err1) {
                try {
                    const response = await fetch('../../data/academic-posts.json');
                    this.blogPosts = await response.json();
                } catch (err2) {}
            }
        }
        
        if (this.blogPosts && this.blogPosts.length > 0) {
            this.render();
        }
    }

    render() {
        // Get current page path
        let currentPath = window.location.pathname;
        
        // Normalize path (handle root index.html vs folder path)
        if (currentPath.endsWith('/')) currentPath += 'index.html';
        
        // Find current post index in the data
        const currentIndex = this.blogPosts.findIndex(post => {
            const postUrl = post.url.startsWith('/') ? post.url : `/${post.url}`;
            return currentPath.includes(post.url) || postUrl === currentPath;
        });

        if (currentIndex === -1) return;

        const prevPost = this.blogPosts[currentIndex + 1]; // Older post
        const nextPost = this.blogPosts[currentIndex - 1]; // Newer post

        // Determine prefix by checking the navbar's link to index.html
        let prefix = "";
        const indexLink = document.querySelector('nav a[href*="index.html"]');
        if (indexLink) {
            const href = indexLink.getAttribute('href');
            if (href.startsWith('../../')) {
                prefix = '../../';
            } else if (href.startsWith('../')) {
                prefix = '../';
            }
        }

        let html = '<div class="article-pagination">';

        if (prevPost) {
            html += `
                <a href="${prefix}${prevPost.url}" class="pagination-card prev">
                    <span class="pagination-label">← Anterior</span>
                    <span class="pagination-title">${prevPost.title}</span>
                </a>
            `;
        } else {
            html += '<div></div>'; 
        }

        if (nextPost) {
            html += `
                <a href="${prefix}${nextPost.url}" class="pagination-card next">
                    <span class="pagination-label">Siguiente →</span>
                    <span class="pagination-title">${nextPost.title}</span>
                </a>
            `;
        }

        html += '</div>';
        this.container.innerHTML = html;
    }
}
