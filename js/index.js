import { fetchYouTubeVideos, getCategory, getCategoryIcon } from './api_request.js';

document.addEventListener('DOMContentLoaded', async () => {
    const docsGrid = document.querySelector('.docs-grid');
    if (!docsGrid) return;
    try {
        const videos = await fetchYouTubeVideos('folclore mitologia brasil');
        docsGrid.innerHTML = '';
        videos.forEach(item => {
            const videoId = item.id.videoId;
            const title = item.snippet.title;
            const channelTitle = item.snippet.channelTitle;
            const thumbnailUrl = item.snippet.thumbnails.high.url;
            const publishedAt = new Date(item.snippet.publishedAt).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' });
            const category = getCategory(title);
            const categoryIconSvg = getCategoryIcon(category);
            // Duração não está disponível diretamente na resposta da search API, então exibiremos 'YouTube' como placeholder
            const duration = 'YouTube';
            const cardHTML = `
                <div class="doc-card" onclick="window.open('https://www.youtube.com/watch?v=${videoId}', '_blank')" title="${title}">
                    <div class="doc-thumbnail">
                        <img src="${thumbnailUrl}" alt="${title}">
                        <div class="doc-play">
                            <i class="fas fa-play"></i>
                        </div>
                        <div class="doc-category" title="Categoria: ${category}">
                            ${categoryIconSvg}
                        </div>
                    </div>
                    <div class="doc-info">
                        <h3>${title}</h3>
                        <p>${duration} | ${channelTitle}</p>
                        <div class="doc-rating">
                            <span style="font-size:0.9em;color:#d4af37;">${publishedAt}</span>
                        </div>
                    </div>
                </div>
            `;
            docsGrid.innerHTML += cardHTML;
        });
    } catch (error) {
        docsGrid.innerHTML = `<p style="color:#d4af37;">Erro ao carregar vídeos: ${error.message}</p>`;
    }
});


