// --- YOUTUBE API INTEGRATION SCRIPT ---

        // IMPORTANT: Replace '[YOUR_API_KEY]' with your actual YouTube API key.
        const API_KEY = 'AIzaSyAwEs625WhaXLORYlhkkaE-YnKab_pKi6s';

        /**
         * Fetches videos from YouTube and populates the video section.
         */
        async function searchYouTubeVideos() {
            const videoContainer = document.getElementById('youtube-videos');
            const warningContainer = document.getElementById('api-key-warning');
            const errorContainer = document.getElementById('api-error-message');

            // Show a warning and stop if the API key is missing.
            if (!API_KEY || API_KEY === '[YOUR_API_KEY]') {
                warningContainer.style.display = 'block';
                videoContainer.innerHTML = ''; 
                return;
            }
            warningContainer.style.display = 'none';

            // API request URL.
            const url = `
            https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=documentário+folclore+brasileiro&maxResults=10&order=viewCount&videoDuration=medium&RegionCode=BR&relevanceLanguage=pt&type=video&key=${API_KEY}`;

            try {
                const response = await fetch(url);
                
                // Handle HTTP errors (e.g., 403 Forbidden for bad API key)
                if (!response.ok) {
                    const errorData = await response.json();
                    const errorMessage = errorData.error.message || `Erro na requisição: ${response.status}`;
                    throw new Error(errorMessage);
                }
                
                const data = await response.json();

                // Clear the container before adding new videos.
                videoContainer.innerHTML = ''; 
                errorContainer.style.display = 'none';

                // Loop through each video item from the API response.
                data.items.forEach(item => {
                    if (item.id.videoId) { // Ensure it's a video and not a channel/playlist
                        const videoId = item.id.videoId;
                        const title = item.snippet.title;
                        const channelTitle = item.snippet.channelTitle;
                        const thumbnailUrl = item.snippet.thumbnails.high.url;
                        const publishedAt = new Date(item.snippet.publishedAt).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' });

                        // Determine the category and get the corresponding icon.
                        const category = getCategory(title.toLowerCase());
                        const categoryIconSvg = getCategoryIcon(category);

                        // Create the HTML for the video card.
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
                        // Add the new card to the container.
                        videoContainer.innerHTML += cardHTML;
                    }
                });

            } catch (error) {
                console.error('Ocorreu um erro ao buscar os vídeos do YouTube:', error);
                errorContainer.innerHTML = `Falha ao carregar vídeos. Verifique o console para mais detalhes. (Erro: ${error.message})`;
                errorContainer.style.display = 'block';
                videoContainer.innerHTML = '';
            }
        }

        /**
         * Determines a video's category based on keywords in its title.
         * @param {string} title - The lowercase title of the video.
         * @returns {string} The determined category name.
         */
        function getCategory(title) {
            if (title.includes('lenda') || title.includes('folclore') || title.includes('saci') || title.includes('curupira') || title.includes('iara') || title.includes('mula sem cabeça')) return 'Folclore';
            if (title.includes('deus') || title.includes('orixá') || title.includes('tupã') || title.includes('jaci') || title.includes('candomblé')) return 'Divindades';
            if (title.includes('comida') || title.includes('culinária') || title.includes('receita')) return 'Culinária';
            if (title.includes('tribo') || title.includes('indígena') || title.includes('povo originário')) return 'Povos Originários';
            return 'Cultura';
        }

        /**
         * Returns an SVG icon string based on the category name.
         * @param {string} category - The category name.
         * @returns {string} An SVG string for the icon.
         */
        function getCategoryIcon(category) {
            const icons = {
                'Folclore': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z"></path></svg>`,
                'Divindades': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l-1.45 4.54L6 9l4.5 3.55L9 17l3-2.3 3 2.3-1.5-4.45L18 9l-4.55-1.46L12 3z"></path></svg>`,
                'Culinária': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"></path></svg>`,
                'Povos Originários': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L1 9l4 1.5V14h2V10.5L12 14l5-3.5V14h2v-3.5L23 9l-11-7zM12 4.53L18.07 9H5.93L12 4.53zM4.5 16h15v2h-15v-2z"></path></svg>`,
                'Cultura': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"></path></svg>`
            };
            return icons[category] || icons['Cultura'];
        }

        // Call the function to start the search when the page loads.
        document.addEventListener('DOMContentLoaded', searchYouTubeVideos);