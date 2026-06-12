async function fetchLatestVideos() {
    try {
        // Llamamos a nuestra función Serverless de Vercel (oculta la API Key)
        const response = await fetch('/api/youtube');
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
            renderVideos(data.items);
        } else if (data.error) {
            console.error('Error desde el servidor:', data.error);
        }
    } catch (error) {
        console.error('Error al obtener videos de YouTube:', error);
    }
}

function renderVideos(videos) {
    const grid = document.querySelector('#videos .grid');
    if (!grid) return;
    
    // Clear existing hardcoded videos
    grid.innerHTML = '';
    
    videos.forEach(video => {
        // Handle different API formats (Search vs Videos endpoint)
        const videoId = typeof video.id === 'string' ? video.id : video.id.videoId;
        const title = video.snippet.title;
        const thumbnail = video.snippet.thumbnails.medium.url;
        
        const cardHTML = `
            <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" class="card-link">
                <div class="card video-card" data-video-id="${videoId}">
                    <div class="video-container">
                        <img src="${thumbnail}" alt="${title}">
                    </div>
                    <h3>${title}</h3>
                    <p>Míralo ahora en YouTube</p>
                </div>
            </a>
        `;
        
        grid.insertAdjacentHTML('beforeend', cardHTML);
    });
    
    // Re-initialize effects for new cards
    if (window.initCardEffects) {
        const newCards = grid.querySelectorAll('.card');
        newCards.forEach(card => window.initCardEffects(card));
    }
}

document.addEventListener('DOMContentLoaded', fetchLatestVideos);
