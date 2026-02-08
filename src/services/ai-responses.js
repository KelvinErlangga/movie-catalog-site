// AI Response Generator untuk berbagai intents
import { searchMovie } from './api';

// Popular movies data
const popularMovies = {
  2025: [
    { title: "Captain America: Brave New World", genre: "Action", rating: "8.2/10", description: "Sam Wilson mengambil peran Captain America dalam petualangan baru." },
    { title: "Thunderbolts", genre: "Action", rating: "7.8/10", description: "Tim anti-pahlawan Marvel dalam misi yang kompleks." },
    { title: "Mickey 17", genre: "Sci-Fi", rating: "7.5/10", description: "Robert Pattinson dalam film sci-fi tentang kloning." },
    { title: "The Fantastic Four", genre: "Action", rating: "8.0/10", description: "Reboot Marvel untuk Fantastic Four." },
    { title: "Jurassic World: Rebirth", genre: "Adventure", rating: "7.6/10", description: "Petualangan baru di dunia Jurassic." }
  ],
  2024: [
    { title: "Deadpool & Wolverine", genre: "Action", rating: "8.5/10", description: "Deadpool dan Wolverine bersatu lagi!" },
    { title: "Dune: Part Two", genre: "Sci-Fi", rating: "8.8/10", description: "Kelanjutan epik Dune." },
    { title: "Inside Out 2", genre: "Animation", rating: "8.3/10", description: "Riley kembali dengan emosi baru." },
    { title: "Beetlejuice Beetlejuice", genre: "Comedy", rating: "7.9/10", description: "Sequel Beetlejuice yang lama ditunggu." },
    { title: "Joker: Folie à Deux", genre: "Drama", rating: "7.7/10", description: "Joker kembali dalam musical drama." }
  ]
};

export const generateAIResponse = async (parsedQuery) => {
  const { intent, title, year, genre, originalQuery } = parsedQuery;
  
  console.log('🤖 Generating AI response for intent:', intent);
  
  switch (intent) {
    case 'sinopsis':
      return await handleSinopsisRequest(parsedQuery);
      
    case 'popular':
      return await handlePopularRequest(parsedQuery);
      
    case 'trending':
      return await handleTrendingRequest(parsedQuery);
      
    case 'latest':
      return await handleLatestRequest(parsedQuery);
      
    case 'rating':
      return await handleRatingRequest(parsedQuery);
      
    case 'genre':
      return await handleGenreRequest(parsedQuery);
      
    case 'cast':
      return await handleCastRequest(parsedQuery);
      
    case 'rekomendasi':
      return await handleRecommendationRequest(parsedQuery);
      
    case 'review':
      return await handleReviewRequest(parsedQuery);
      
    default:
      return await handleSearchRequest(parsedQuery);
  }
};

const handleSinopsisRequest = async (parsedQuery) => {
  const { getMovieByTitle } = await import('./smart-parser');
  const localMovies = getMovieByTitle(parsedQuery.title, parsedQuery.year);
  
  if (localMovies.length > 0) {
    return localMovies[0].sinopsis;
  }
  
  const searchResults = await searchMovie(parsedQuery.title);
  if (searchResults.length > 0) {
    return searchResults[0].overview || 'Sinopsis tidak tersedia untuk film ini.';
  }
  
  return `❌ Maaf, tidak menemukan film "${parsedQuery.title}" dalam database.`;
};

const handlePopularRequest = async (parsedQuery) => {
  const targetYear = parsedQuery.year || 2025;
  const movies = popularMovies[targetYear] || popularMovies[2025];
  
  let response = `🔥 **Film Terpopuler ${targetYear}**\n\n`;
  
  movies.forEach((movie, index) => {
    response += `**${index + 1}. ${movie.title}**\n`;
    response += `🎭 Genre: ${movie.genre}\n`;
    response += `⭐ Rating: ${movie.rating}\n`;
    response += `📝 ${movie.description}\n\n`;
  });
  
  return response;
};

const handleTrendingRequest = async (parsedQuery) => {
  const searchResults = await searchMovie('');
  const trending = searchResults
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, 8);
  
  let response = `📈 **Film Trending Saat Ini**\n\n`;
  
  trending.forEach((movie, index) => {
    response += `**${index + 1}. ${movie.title}** (${new Date(movie.release_date).getFullYear()})\n`;
    response += `⭐ ${movie.vote_average}/10 | 🔥 Popularity: ${Math.round(movie.popularity || 0)}\n`;
    response += `📝 ${movie.overview ? movie.overview.substring(0, 100) + '...' : 'No overview'}\n\n`;
  });
  
  return response;
};

const handleLatestRequest = async (parsedQuery) => {
  const currentYear = new Date().getFullYear();
  const searchResults = await searchMovie('');
  
  const latest = searchResults
    .filter(movie => new Date(movie.release_date).getFullYear() >= currentYear - 1)
    .sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
    .slice(0, 6);
  
  let response = `🆕 **Film Terbaru**\n\n`;
  
  latest.forEach((movie, index) => {
    response += `**${index + 1}. ${movie.title}**\n`;
    response += `📅 Rilis: ${new Date(movie.release_date).toLocaleDateString('id-ID')}\n`;
    response += `⭐ ${movie.vote_average}/10\n`;
    response += `📝 ${movie.overview ? movie.overview.substring(0, 80) + '...' : 'No overview'}\n\n`;
  });
  
  return response;
};

const handleRatingRequest = async (parsedQuery) => {
  const searchResults = await searchMovie(parsedQuery.title || '');
  
  const topRated = searchResults
    .sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))
    .slice(0, 8);
  
  let response = `⭐ **Film dengan Rating Tertinggi**\n\n`;
  
  topRated.forEach((movie, index) => {
    response += `**${index + 1}. ${movie.title}** (${new Date(movie.release_date).getFullYear()})\n`;
    response += `⭐ ${movie.vote_average}/10 | 🗳️ ${movie.vote_count} votes\n`;
    response += `📝 ${movie.overview ? movie.overview.substring(0, 80) + '...' : 'No overview'}\n\n`;
  });
  
  return response;
};

const handleGenreRequest = async (parsedQuery) => {
  const searchResults = await searchMovie('');
  const targetGenre = parsedQuery.genre;
  
  const genreMovies = searchResults.filter(movie => 
    movie.genre_ids && movie.genre_ids.length > 0
  ).slice(0, 6);
  
  let response = `🎭 **Film ${targetGenre ? targetGenre.charAt(0).toUpperCase() + targetGenre.slice(1) : 'Berbagai Genre'}**\n\n`;
  
  genreMovies.forEach((movie, index) => {
    response += `**${index + 1}. ${movie.title}** (${new Date(movie.release_date).getFullYear()})\n`;
    response += `⭐ ${movie.vote_average}/10\n`;
    response += `📝 ${movie.overview ? movie.overview.substring(0, 80) + '...' : 'No overview'}\n\n`;
  });
  
  return response;
};

const handleCastRequest = async (parsedQuery) => {
  const searchResults = await searchMovie(parsedQuery.title || '');
  
  if (searchResults.length > 0) {
    const movie = searchResults[0];
    let response = `🎬 **Info Film: ${movie.title}**\n\n`;
    response += `📅 Tahun: ${new Date(movie.release_date).getFullYear()}\n`;
    response += `⭐ Rating: ${movie.vote_average}/10\n`;
    response += `📝 Sinopsis: ${movie.overview ? movie.overview.substring(0, 150) + '...' : 'No overview'}\n\n`;
    response += `💡 *Untuk info pemeran lengkap, cari di detail film.*`;
    
    return response;
  }
  
  return `❌ Maaf, tidak menemukan informasi untuk "${parsedQuery.title || 'film yang diminta'}".`;
};

const handleRecommendationRequest = async (parsedQuery) => {
  const { getFallbackRecommendations } = await import('./gemini-fallback');
  const mood = parsedQuery.genre || 'umum';
  const recommendations = getFallbackRecommendations(mood);
  
  let response = `🎬 **Rekomendasi Film ${mood.charAt(0).toUpperCase() + mood.slice(1)}**\n\n`;
  
  recommendations.forEach((movie, index) => {
    response += `**${index + 1}. ${movie.title}** (${movie.year})\n`;
    response += `📝 ${movie.reason}\n\n`;
  });
  
  return response;
};

const handleReviewRequest = async (parsedQuery) => {
  const searchResults = await searchMovie(parsedQuery.title || '');
  
  if (searchResults.length > 0) {
    const movie = searchResults[0];
    let response = `📝 **Review AI: ${movie.title}**\n\n`;
    response += `⭐ Rating: ${movie.vote_average}/10 (${movie.vote_count} votes)\n\n`;
    response += `🎭 **Genre:** ${movie.genre_ids ? 'Action, Drama, Thriller' : 'Various'}\n\n`;
    response += `📖 **Sinopsis:**\n${movie.overview || 'Tidak ada sinopsis tersedia.'}\n\n`;
    response += `💭 **Analisis AI:**\nFilm ini menawarkan pengalaman yang ${movie.vote_average >= 7 ? 'sangat memuaskan' : 'cukup baik'} dengan rating ${movie.vote_average}/10. ${movie.vote_average >= 8 ? 'Wajib ditonton!' : 'Cocok untuk penggemar genre ini.'}`;
    
    return response;
  }
  
  return `❌ Maaf, tidak dapat membuat review untuk "${parsedQuery.title || 'film yang diminta'}".`;
};

const handleSearchRequest = async (parsedQuery) => {
  const searchTerms = parsedQuery.searchTerms.join(' ');
  const searchResults = await searchMovie(searchTerms);
  
  if (searchResults.length > 0) {
    let response = `🔍 **Hasil Pencarian: "${searchTerms}"**\n\n`;
    
    searchResults.slice(0, 5).forEach((movie, index) => {
      response += `**${index + 1}. ${movie.title}** (${new Date(movie.release_date).getFullYear()})\n`;
      response += `⭐ ${movie.vote_average}/10\n`;
      response += `📝 ${movie.overview ? movie.overview.substring(0, 100) + '...' : 'No overview'}\n\n`;
    });
    
    return response;
  }
  
  return `❌ Tidak menemukan film untuk "${searchTerms}". Coba kata kunci lain ya!`;
};
