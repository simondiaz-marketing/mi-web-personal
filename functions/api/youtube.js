export async function onRequest(context) {
    // En Cloudflare, las variables de entorno viven dentro de "context.env"
    const YOUTUBE_API_KEY = context.env.YOUTUBE_API_KEY;
    const CHANNEL_ID = 'UCRjEetcMz3rKhFAEQJN-Jag';

    // Headers estándar para devolver JSON
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' // Opcional, pero bueno tenerlo
    };

    if (!YOUTUBE_API_KEY) {
        return new Response(JSON.stringify({ error: 'YouTube API Key no está configurada en Cloudflare' }), { 
            status: 500, headers 
        });
    }

    try {
        const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=15&type=video`;
        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();

        if (searchData.error) {
            return new Response(JSON.stringify({ error: searchData.error.message }), { 
                status: 500, headers 
            });
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
                return totalSeconds < 120;
            };

            const longFormVideos = detailsData.items.filter(video => {
                const duration = video.contentDetails.duration;
                return !isShort(duration);
            }).slice(0, 6);

            return new Response(JSON.stringify({ items: longFormVideos }), { 
                status: 200, headers 
            });
        }

        return new Response(JSON.stringify({ items: [] }), { 
            status: 200, headers 
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Error al obtener los videos' }), { 
            status: 500, headers 
        });
    }
}
