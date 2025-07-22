import { fetchYouTubeVideos, getCategory, getCategoryIcon } from './api_request.js';

        function getCategoriaFromURL() {
            const params = new URLSearchParams(window.location.search);
            return params.get('categoria') || '';
        }

        async function renderRelatedVideos() {
            const categoria = getCategoriaFromURL();
            document.getElementById('category-title').textContent = `Vídeos Relacionados: ${categoria}`;
            const grid = document.getElementById('related-videos-grid');
            grid.innerHTML = '';
            try {
                const videos = await fetchYouTubeVideos(categoria,{ maxResults: 12, order:'relevance'});
                videos.forEach(item => {
                    const videoId = item.id.videoId;
                    const title = item.snippet.title;
                    const channelTitle = item.snippet.channelTitle;
                    const thumbnailUrl = item.snippet.thumbnails.high.url;
                    const publishedAt = new Date(item.snippet.publishedAt).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' });
                    const category = getCategory(title);
                    const categoryIconSvg = getCategoryIcon(category);
                    const duration = 'YouTube';
                    const cardHTML = `
                        <div class="doc-card" onclick="window.open('https://www.youtube.com/watch?v=${videoId}', '_blank')" title="${title}">
                            <div class="doc-thumbnail">
                                <img src="${thumbnailUrl}" alt="${title}">
                                <div class="doc-play">
                                    <i class="fas fa-play"></i>
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
                    grid.innerHTML += cardHTML;
                });
            } catch (error) {
                grid.innerHTML = `<p style='color:#d4af37;'>Erro ao carregar vídeos: ${error.message}</p>`;
            }
        }
        renderRelatedVideos();