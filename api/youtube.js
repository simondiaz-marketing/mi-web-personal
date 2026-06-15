export default async function handler(req, res) {
    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
    const CHANNEL_ID = 'UCRjEetcMz3rKhFAEQJN-Jag';

    if (!YOUTUBE_API_KEY) {
        return res.status(500).json({ error: 'YouTube API Key is not configured' });
    }

    try {
        const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=15&type=video`;
        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();

        if (searchData.error) {
            return res.status(500).json({ error: searchData.error.message });
        }

        if (searchData.items) {
            const videoIds = searchData.items.map(item => item.id.videoId).join(',');
            
            const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&id=${videoIds}&part=contentDetails,snippet`;
            const detailsResponse = await fetch(detailsUrl);
            const detailsData = await detailsResponse.json();
            
            const isShort = (duration) => {
                if (duration.includes('H')) return false;
                const minutesMatch = duration.match(/(\d+)M/);
                const secondsMatch = duration.match(/(\d+)S/);
                const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;
                const seconds = secondsMatch ? parseInt(secondsMatch[1]) : 0;
                const totalSeconds = (minutes * 60) + seconds;
                return totalSeconds <= 120;
            };

            const longFormVideos = detailsData.items.filter(video => {
                const duration = video.contentDetails.duration;
                return !isShort(duration);
            }).slice(0, 6);

            return res.status(200).json({ items: longFormVideos });
        }

        return res.status(200).json({ items: [] });
    } catch (error) {
        console.error('Error fetching YouTube videos:', error);
        return res.status(500).json({ error: 'Failed to fetch videos' });
    }
}
