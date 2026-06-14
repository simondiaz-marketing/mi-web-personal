/**
 * ArticleNavManager
 * Shows related articles from the same section at the bottom of article pages.
 * Reads data from academic-posts.json and filters by matching `subject`.
 */
export class ArticleNavManager {
    constructor() {
        if (!document.body.classList.contains('article-page')) return;
        this.init();
    }

    async init() {
        const posts = await this.fetchPosts();
        if (!posts || posts.length < 2) return;

        const currentIndex = this.findCurrentArticle(posts);
        if (currentIndex === -1) return;

        const currentPost = posts[currentIndex];
        // Filter related: same subject, excluding current article
        const related = posts.filter((post, i) =>
            i !== currentIndex && post.subject === currentPost.subject
        );

        if (related.length === 0) return;

        this.render(related);
    }

    findCurrentArticle(posts) {
        let path = decodeURIComponent(window.location.pathname);
        let pathBase = path.split('/').pop().replace(/\.html$/, '');
        
        // Si la URL termina en slash (ej: /practica-1/), pathBase estará vacío.
        // En ese caso tomamos el último segmento real.
        if (!pathBase) {
            const segments = path.split('/').filter(Boolean);
            pathBase = segments.pop() || 'index';
        }

        let index = posts.findIndex(post => {
            const postBase = post.url.split('/').pop().replace(/\.html$/, '');
            return pathBase === postBase;
        });
        
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

    render(relatedPosts) {
        const prefix = this.getRelativePrefix();

        const section = document.createElement('section');
        section.className = 'related-articles';
        section.setAttribute('aria-label', 'Artículos relacionados');

        const title = document.createElement('h2');
        title.className = 'related-articles__title';
        title.textContent = 'Otros artículos de esta sección';
        section.appendChild(title);

        const grid = document.createElement('div');
        grid.className = 'related-articles__grid';

        relatedPosts.forEach(post => {
            const card = document.createElement('a');
            card.href = prefix + post.url;
            card.className = 'related-articles__card';

            card.innerHTML = `
                <div class="related-articles__badge">${post.category}</div>
                <h3 class="related-articles__card-title">${post.title}</h3>
                <p class="related-articles__description">${post.description}</p>
                <span class="related-articles__link">Leer artículo →</span>
            `;

            grid.appendChild(card);
        });

        section.appendChild(grid);

        // Insert inside article-content, after article-body
        const articleContent = document.querySelector('.article-content');
        if (articleContent) {
            articleContent.appendChild(section);
        } else {
            const footer = document.querySelector('footer');
            if (footer) footer.parentNode.insertBefore(section, footer);
        }
    }
}
