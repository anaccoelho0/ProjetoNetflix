import { fetchYouTubeVideos, getCategory, getCategoryIcon } from './api_request.js';

document.addEventListener('DOMContentLoaded', async () => {
    const destaquesSection = document.querySelector('section.destaques');
    if (!destaquesSection) return;
    try {
        const videos = await fetchYouTubeVideos('folclore mitologia brasil');
        destaquesSection.innerHTML = '';
        videos.forEach(item => {
            const videoId = item.id.videoId;
            const title = item.snippet.title;
            const channelTitle = item.snippet.channelTitle;
            const thumbnailUrl = item.snippet.thumbnails.high.url;
            const publishedAt = new Date(item.snippet.publishedAt).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' });
            const category = getCategory(title);
            const categoryIconSvg = getCategoryIcon(category);
            const cardHTML = `
                <div class="video-card" onclick="window.open('https://www.youtube.com/watch?v=${videoId}', '_blank')" title="${title}">
                    <div class="thumbnail-container">
                        <img src="${thumbnailUrl}" alt="${title}" class="video-thumbnail" onerror="this.onerror=null;this.src='https://placehold.co/480x270/181818/FFF?text=Vídeo+Indisponível';">
                    </div>
                    <div class="video-info">
                        <div class="category-icon" title="Categoria: ${category}">
                            ${categoryIconSvg}
                        </div>
                        <div class="video-meta">
                            <h3 class="video-title">${title}</h3>
                            <p class="video-channel">${channelTitle}</p>
                            <p class="video-stats">Publicado em ${publishedAt}</p>
                        </div>
                    </div>
                </div>
            `;
            destaquesSection.innerHTML += cardHTML;
        });
    } catch (error) {
        destaquesSection.innerHTML = `<p style="color:#d4af37;">Erro ao carregar vídeos: ${error.message}</p>`;
    }
});


