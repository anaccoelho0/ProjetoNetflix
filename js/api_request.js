// --- YOUTUBE API MODULE ---

const API_KEY = 'AIzaSyAwEs625WhaXLORYlhkkaE-YnKab_pKi6s';

/**
 * Faz uma busca na API do YouTube e retorna os dados dos vídeos.
 * @param {string} query - Termo de busca.
 * @param {object} options - Opções extras para a busca (maxResults, order, etc).
 * @returns {Promise<Array>} Array de vídeos encontrados.
 */
export async function fetchYouTubeVideos(query = '', options = {}) {
    if (!API_KEY || API_KEY === '[YOUR_API_KEY]') {
        throw new Error('API Key do YouTube não definida.');
    }
    const {
        maxResults = 5,
        order = 'viewCount',
        videoDuration = 'medium',
        regionCode = 'BR',
        relevanceLanguage = 'pt',
        type = 'video',
    } = options;
    const url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&maxResults=${maxResults}&order=${order}&videoDuration=${videoDuration}&regionCode=${regionCode}&relevanceLanguage=${relevanceLanguage}&type=${type}&key=${API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error?.message || `Erro na requisição: ${response.status}`;
        throw new Error(errorMessage);
    }
    const data = await response.json();
    return data.items.filter(item => item.id.videoId);
}

/**
 * Determina a categoria do vídeo pelo título.
 * @param {string} title
 * @returns {string}
 */
export function getCategory(title) {
    const t = title.toLowerCase();
    if (t.includes('lenda') || t.includes('folclore') || t.includes('saci') || t.includes('curupira') || t.includes('iara') || t.includes('mula sem cabeça')) return 'Folclore';
    if (t.includes('deus') || t.includes('orixá') || t.includes('tupã') || t.includes('jaci') || t.includes('candomblé')) return 'Divindades';
    if (t.includes('comida') || t.includes('culinária') || t.includes('receita')) return 'Culinária';
    if (t.includes('tribo') || t.includes('indígena') || t.includes('povo originário')) return 'Povos Originários';
    return 'Cultura';
}

/**
 * Retorna SVG de ícone da categoria.
 * @param {string} category
 * @returns {string}
 */
export function getCategoryIcon(category) {
    const icons = {
        'Folclore': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z"></path></svg>`,
        'Divindades': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l-1.45 4.54L6 9l4.5 3.55L9 17l3-2.3 3 2.3-1.5-4.45L18 9l-4.55-1.46L12 3z"></path></svg>`,
        'Culinária': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"></path></svg>`,
        'Povos Originários': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L1 9l4 1.5V14h2V10.5L12 14l5-3.5V14h2v-3.5L23 9l-11-7zM12 4.53L18.07 9H5.93L12 4.53zM4.5 16h15v2h-15v-2z"></path></svg>`,
        'Cultura': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"></path></svg>`
    };
    return icons[category] || icons['Cultura'];
}