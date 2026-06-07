/**
 * ArticleNavManager
 * Automatically injects prev/next navigation at the bottom of article pages.
 * Reads article order from academic-posts.json.
 */
export class ArticleNavManager {
    constructor() {
        // Only run on article pages
        if (!document.body.classList.contains('article-page')) return;
        this.init();
    }

    async init() {
        const posts = await this.fetchPosts();
        if (!posts || posts.length < 2) return;

        const currentIndex = this.findCurrentArticle(posts);
        if (currentIndex === -1) return;

        const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
        const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

        if (!prevPost && !nextPost) return;

        this.render(prevPost, nextPost);
    }

    findCurrentArticle(posts) {
        const path = decodeURIComponent(window.location.pathname).replace(/^\//, '');
        // Try exact match first, then fallback to filename match
        let index = posts.findIndex(post => path.endsWith(post.url));
        if (index === -1) {
            // Fallback: match just the filename
            const currentFile = path.split('/').pop();
            index = posts.findIndex(post => post.url.endsWith(currentFile));
        }
        return index;
    }

    async fetchPosts() {
        const strategies = [
            window.location.origin + '/data/academic-posts.json',
            'data/academic-posts.json',
            '../data/academic-posts.json',
            '../../data/academic-posts.json'
        ];

        for (const url of strategies) {
            try {
                const response = await fetch(url);
                if (response.ok) return await response.json();
            } catch (e) {
                continue;
            }
        }
        console.warn('ArticleNavManager: Could not load academic-posts.json');
        return null;
    }

    getRelativePrefix() {
        const indexLink = document.querySelector('nav a[href*="index.html"]');
        if (indexLink) {
            const href = indexLink.getAttribute('href');
            if (href.startsWith('../../')) return '../../';
            if (href.startsWith('../')) return '../';
        }
        return '';
    }

    render(prevPost, nextPost) {
        const prefix = this.getRelativePrefix();

        const nav = document.createElement('nav');
        nav.className = 'article-pagination';
        nav.setAttribute('aria-label', 'Navegación entre artículos');

        // Previous article
        if (prevPost) {
            const prevLink = document.createElement('a');
            prevLink.href = prefix + prevPost.url;
            prevLink.className = 'pagination-card prev';
            prevLink.innerHTML = `
                <span class="pagination-label">← Artículo anterior</span>
                <span class="pagination-title">${prevPost.title}</span>
            `;
            nav.appendChild(prevLink);
        } else {
            nav.appendChild(document.createElement('div'));
        }

        // Next article
        if (nextPost) {
            const nextLink = document.createElement('a');
            nextLink.href = prefix + nextPost.url;
            nextLink.className = 'pagination-card next';
            nextLink.innerHTML = `
                <span class="pagination-label">Artículo siguiente →</span>
                <span class="pagination-title">${nextPost.title}</span>
            `;
            nav.appendChild(nextLink);
        } else {
            nav.appendChild(document.createElement('div'));
        }

        // Insert inside article-content, after article-body
        const articleContent = document.querySelector('.article-content');
        if (articleContent) {
            articleContent.appendChild(nav);
        } else {
            // Fallback: insert before footer
            const footer = document.querySelector('footer');
            if (footer) {
                footer.parentNode.insertBefore(nav, footer);
            }
        }
    }
}
