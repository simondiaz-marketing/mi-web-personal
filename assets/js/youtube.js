const YOUTUBE_API_KEY = 'AIzaSyBq1KpBjQpIZuGWHVnzs_4B3V5jb86YEeM';
const CHANNEL_ID = 'UCRjEetcMz3rKhFAEQJN-Jag';

async function fetchLatestVideos() {
    const url = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=6&type=video`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.items) {
            renderVideos(data.items);
        }
    } catch (error) {
        console.error('Error fetching YouTube videos:', error);
    }
}

function renderVideos(videos) {
    const grid = document.querySelector('#videos .grid');
    if (!grid) return;
    
    // Clear existing hardcoded videos
    grid.innerHTML = '';
    
    videos.forEach(video => {
        const videoId = video.id.videoId;
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
