export class PaginationManager {
    constructor() {
        this.container = document.getElementById('pagination-container');
        this.blogPosts = [];
        this.init();
    }

    async init() {
        if (!this.container) return;

        try {
            // Try absolute root first
            let response = await fetch('/data/blog-posts.json');
            if (!response.ok) throw new Error('Root fetch failed');
            this.blogPosts = await response.json();
        } catch (e) {
            try {
                // Fallback for subfolders
                let response = await fetch('../data/blog-posts.json');
                this.blogPosts = await response.json();
            } catch (err) {
                console.error('Error initializing pagination:', err);
            }
        }
        
        if (this.blogPosts.length > 0) {
            this.render();
        }
    }

    render() {
        // Get current page path
        let currentPath = window.location.pathname;
        
        // Normalize path (handle root index.html vs folder path)
        if (currentPath.endsWith('/')) currentPath += 'index.html';
        
        // Find current post index in the data
        // Data URLs are relative to root like "blog/blog-name.html"
        // We need to match it.
        const currentIndex = this.blogPosts.findIndex(post => {
            const postUrl = post.url.startsWith('/') ? post.url : `/${post.url}`;
            return currentPath.includes(post.url) || postUrl === currentPath;
        });

        if (currentIndex === -1) return;

        const prevPost = this.blogPosts[currentIndex + 1]; // Older post
        const nextPost = this.blogPosts[currentIndex - 1]; // Newer post

        let html = '<div class="article-pagination">';

        if (prevPost) {
            html += `
                <a href="/${prevPost.url}" class="pagination-card prev">
                    <span class="pagination-label">← Anterior</span>
                    <span class="pagination-title">${prevPost.title}</span>
                </a>
            `;
        } else {
            // Placeholder to keep grid layout if only one side exists, 
            // but the user said "si se trata solo del ultimo articulo, solo se podra indexar un articulo anterior"
            // So we just don't add anything here.
            html += '<div></div>'; 
        }

        if (nextPost) {
            html += `
                <a href="/${nextPost.url}" class="pagination-card next">
                    <span class="pagination-label">Siguiente →</span>
                    <span class="pagination-title">${nextPost.title}</span>
                </a>
            `;
        }

        html += '</div>';
        this.container.innerHTML = html;
    }
}
