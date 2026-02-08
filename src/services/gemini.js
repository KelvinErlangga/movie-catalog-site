import { GoogleGenerativeAI } from '@google/generative-ai';
import { getFallbackRecommendations, getFallbackSearch } from './gemini-fallback';

// Debug: Check if API key is loaded
console.log('🔍 Gemini API Key Status:', process.env.REACT_APP_GEMINI_API_KEY ? '✅ Loaded' : '❌ Not found');

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

// AI Movie Recommendation Engine
export const getMovieRecommendation = async (userPreferences = {}) => {
  console.log('🎬 Getting movie recommendation with preferences:', userPreferences);
  
  // Extract mood outside try block so it's available in catch blocks
  const { genres, year, mood, recentlyWatched } = userPreferences;
  
  try {
    // Coba model yang berbeda - mulai dengan yang paling basic
    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
    console.log('✅ Model loaded successfully');
    
    // Add random seed for variety
    const randomSeed = Math.floor(Math.random() * 10000);
    const randomAdjective = ['seru', 'menarik', 'epik', 'fantastis', 'luar biasa'][Math.floor(Math.random() * 5)];
    
    // Enhanced prompt with randomization for variety
    const prompt = `Berdasarkan preferensi berikut, berikan 3 rekomendasi film yang ${randomAdjective} dan BERBEDA dari sebelumnya:
    
    Mood: ${mood || 'umum'}
    Genre: ${genres || 'semua genre'}
    Film yang ditonton: ${recentlyWatched || 'tidak ada'}
    Random seed: ${randomSeed}
    
    Response dalam format JSON array:
    [
      {
        "title": "Judul Film",
        "year": 2023,
        "reason": "Alasan singkat kenapa film ini cocok",
        "mood_match": "Cocok untuk mood ${mood || 'umum'}",
        "similarity": "Mirip dengan film favorit kamu",
        "id": "movie-id"
      }
    ]
    
    PENTING: Berikan film yang BERBEDA dan VARIATIF, jangan gunakan film yang sama berulang-ulang!`;

    console.log('📝 Sending prompt to Gemini...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('📨 Raw response from Gemini:', text);
    
    // Parse JSON response
    try {
      const parsed = JSON.parse(text);
      console.log('✅ Successfully parsed JSON:', parsed);
      return parsed;
    } catch (parseError) {
      console.error('❌ Error parsing Gemini response:', parseError);
      console.log('Raw text that failed to parse:', text);
      
      // Fallback: use randomized recommendations
      return getFallbackRecommendations(mood || 'umum');
    }
  } catch (error) {
    console.error('❌ Error getting movie recommendation:', error);
    console.error('Full error details:', error.message);
    
    // Return fallback data with mood-based randomization
    return getFallbackRecommendations(mood || 'umum');
  }
};

// Natural Language Search
export const naturalLanguageSearch = async (query) => {
  console.log('🔍 Natural language search for:', query);
  
  try {
    // Coba model yang berbeda
    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
    console.log('✅ Model loaded for natural search');
    
    const prompt = `Ubah query pencarian film natural language ini menjadi parameter pencarian yang terstruktur.
    
    Query: "${query}"
    
    Response dalam format JSON:
    {
      "search_terms": ["kata kunci utama"],
      "genres": ["genre yang cocok"],
      "year": tahun jika disebutkan,
      "mood": "mood yang diinginkan",
      "type": "movie/tv/both",
      "original_query": "query asli"
    }
    
    Jika tidak ada informasi untuk field tertentu, kosongkan atau null. Response hanya JSON tanpa penjelasan.`;

    console.log('📝 Sending natural search prompt...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('📨 Natural search raw response:', text);
    
    try {
      const parsed = JSON.parse(text);
      console.log('✅ Natural search parsed:', parsed);
      return parsed;
    } catch (parseError) {
      console.error('❌ Error parsing natural search response:', parseError);
      console.log('Raw text that failed to parse:', text);
      
      // Fallback: extract keywords manually
      const fallback = {
        search_terms: query.split(' ').filter(word => word.length > 2),
        genres: [],
        year: null,
        mood: null,
        type: "movie",
        original_query: query
      };
      console.log('🔄 Using fallback search params:', fallback);
      return fallback;
    }
  } catch (error) {
    console.error('❌ Error in natural language search:', error);
    console.error('Full error details:', error.message);
    
    // Return fallback
    console.log('🔄 Using fallback search');
    return {
      search_terms: query.split(' ').filter(word => word.length > 2),
      genres: [],
      year: null,
      mood: null,
      type: "movie",
      original_query: query
    };
  }
};

// Smart Movie Review Generator
export const generateMovieReview = async (movieData) => {
  try {
    // Coba model yang berbeda
    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
    
    const { title, overview, genres, release_date, vote_average } = movieData;
    
    const prompt = `Buat review film yang menarik dan natural untuk film berikut:
    
    Judul: ${title}
    Sinopsis: ${overview}
    Genre: ${genres?.map(g => g.name).join(', ')}
    Tahun: ${release_date}
    Rating: ${vote_average}/10
    
    Buat review dalam bahasa Indonesia dengan gaya yang engaging, mencakup:
    - Pembuka yang menarik
    - Analisis singkat tentang plot dan tema
    - Kelebihan film
    - Rekomendasi untuk penonton seperti apa
    
    Panjang review sekitar 150-200 kata. Tone yang friendly dan informatif.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating movie review:', error);
    return null;
  }
};

// Movie Comparison
export const compareMovies = async (movie1, movie2) => {
  try {
    // Coba model yang berbeda
    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
    
    const prompt = `Bandingkan dua film ini dalam format yang menarik:
    
    Film 1: ${movie1.title} (${movie1.year})
    Genre: ${movie1.genres?.map(g => g.name).join(', ')}
    Rating: ${movie1.vote_average}/10
    
    Film 2: ${movie2.title} (${movie2.year})
    Genre: ${movie2.genres?.map(g => g.name).join(', ')}
    Rating: ${movie2.vote_average}/10
    
    Berikan perbandingan dalam format:
    1. Kesamaan tema dan genre
    2. Perbedaan utama dalam plot dan gaya
    3. Mana yang lebih cocok untuk penonton seperti apa
    4. Rekomendasi final
    
    Response dalam bahasa Indonesia, sekitar 200-250 kata.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error comparing movies:', error);
    return null;
  }
};

// Fun Facts Generator
export const generateMovieFunFacts = async (movieData) => {
  try {
    // Coba model yang berbeda
    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
    
    const { title, overview, genres, release_date } = movieData;
    
    const prompt = `Generate 3-5 fakta menarik tentang film "${title}" (${release_date}) berdasarkan informasi yang ada:
    
    Genre: ${genres?.map(g => g.name).join(', ')}
    Sinopsis: ${overview}
    
    Buat fakta-fakta yang:
    - Menarik dan mungkin tidak diketahui banyak orang
    - Terkait dengan produksi, casting, atau trivia
    - Mendidik tapi tetap entertaining
    
    Format dalam bahasa Indonesia dengan bullet points. Jika tidak ada informasi spesifik, berikan fakta umum tentang genre atau era film tersebut.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating fun facts:', error);
    return null;
  }
};
