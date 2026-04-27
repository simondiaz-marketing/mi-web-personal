const YOUTUBE_API_KEY = 'AIzaSyBq1KpBjQpIZuGWHVnzs_4B3V5jb86YEeM';
const CHANNEL_ID = 'UCRjEetcMz3rKhFAEQJN-Jag';

async function fetchLatestVideos() {
    // Increase maxResults to have enough videos after filtering
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=15&type=video`;
    
    try {
        const response = await fetch(searchUrl);
        const data = await response.json();
        
        if (data.items) {
            const videoIds = data.items.map(item => item.id.videoId).join(',');
            
            // Fetch detailed info to get duration
            const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&id=${videoIds}&part=contentDetails,snippet`;
            const detailsResponse = await fetch(detailsUrl);
            const detailsData = await detailsResponse.json();
            
            // Filter out Shorts (less than 60 seconds)
            // YouTube duration format is ISO 8601 (e.g., PT1M2S)
            const longFormVideos = detailsData.items.filter(video => {
                const duration = video.contentDetails.duration;
                return !isShort(duration);
            }).slice(0, 6); // Take only the first 6 after filtering
            
            renderVideos(longFormVideos);
        }
    } catch (error) {
        console.error('Error fetching YouTube videos:', error);
    }
}

function isShort(duration) {
    // PT#M#S -> if it doesn't have 'M' or 'H', and 'S' is < 60, it's a short
    // Simple check: if it contains 'H' or 'M', it's definitely > 60s (unless PT0M... which is rare)
    if (duration.includes('H') || duration.includes('M')) {
        // Double check for PT0M#S
        if (duration.includes('M0S') && !duration.includes('H')) return true;
        return false;
    }
    // Only seconds (PTS#S)
    const seconds = parseInt(duration.match(/\d+/)[0]);
    return seconds < 60;
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
