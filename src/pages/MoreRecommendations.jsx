import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getMovieRecommendation } from '../services/gemini';
import { FaRobot, FaHeart, FaClock, FaSpinner, FaArrowLeft } from 'react-icons/fa';

const MoreRecommendations = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mood = searchParams.get('mood') || 'umum';
  const genres = searchParams.get('genres') || '';
  const recentlyWatched = searchParams.get('recentlyWatched') || '';
  
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const recommendationsPerPage = 3; // Ubah ke 3 film per load

  // Fungsi untuk mendapatkan poster URL
  const getPosterUrl = (title, year) => {
    // Menggunakan placeholder dari TMDB atau service lain
    const apiKey = process.env.REACT_APP_TMDB_API_KEY;
    if (apiKey) {
      return `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(title)}&year=${year}`;
    }
    // Fallback ke placeholder image
    return `https://picsum.photos/seed/${encodeURIComponent(title)}${year}/300/450.jpg`;
  };

  // Fungsi untuk mendapatkan poster yang sudah di-cache
  const getMoviePoster = (rec) => {
    // Jika sudah ada poster_path dari TMDB
    if (rec.poster_path) {
      return `https://image.tmdb.org/t/p/w500${rec.poster_path}`;
    }
    // Jika ada backdrop_path
    if (rec.backdrop_path) {
      return `https://image.tmdb.org/t/p/w500${rec.backdrop_path}`;
    }
    // Fallback ke placeholder
    return getPosterUrl(rec.title, rec.year);
  };

  const loadMoreRecommendations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const userPreferences = {
        mood,
        genres,
        recentlyWatched,
        page,
        count: recommendationsPerPage
      };
      
      console.log('🎬 Loading more recommendations for mood:', mood, 'Page:', page);
      
      // Try API first
      try {
        const recs = await getMovieRecommendation(userPreferences);
        console.log('📨 API Response:', recs);
        
        if (recs && recs.length > 0) {
          if (page === 1) {
            setRecommendations(recs);
          } else {
            // Filter out duplicates before adding new recommendations
            setRecommendations(prev => {
              const existingIds = new Set(prev.map(r => r.id || r.title));
              const newRecs = recs.filter(rec => !existingIds.has(rec.id || rec.title));
              return [...prev, ...newRecs];
            });
          }
          setHasMore(true); // API returned results, so there might be more
        } else {
          // API returned empty, use fallback
          await loadFallbackRecommendations();
        }
      } catch (apiError) {
        console.log('🔄 API failed, using fallback:', apiError);
        await loadFallbackRecommendations();
      }
    } catch (error) {
      console.error('❌ Error loading recommendations:', error);
      setError('Gagal memuat rekomendasi. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  }, [mood, genres, recentlyWatched, page, recommendationsPerPage, loadFallbackRecommendations]);

  useEffect(() => {
    loadMoreRecommendations();
  }, []); // Hapus loadMoreRecommendations dari dependency

  const loadFallbackRecommendations = useCallback(async () => {
    const { getFallbackRecommendations } = await import('../services/gemini-fallback');
    
    if (page === 1) {
      // First load - get 3 movies
      const fallbackRecs = getFallbackRecommendations(mood);
      setRecommendations(fallbackRecs);
      setHasMore(true);
    } else {
      // Load more - get additional movies without duplicates
      setRecommendations(prev => {
        const existingIds = new Set(prev.map(r => r.id || r.title));
        let newRecs = [];
        let attempts = 0;
        const maxAttempts = 10; // Prevent infinite loop
        
        // Keep trying to get new movies until we have 3 or reach max attempts
        while (newRecs.length < recommendationsPerPage && attempts < maxAttempts) {
          const moreRecs = getFallbackRecommendations(mood);
          const uniqueRecs = moreRecs.filter(rec => !existingIds.has(rec.id || rec.title));
          
          // Add to new recommendations and existing IDs
          uniqueRecs.forEach(rec => {
            if (newRecs.length < recommendationsPerPage) {
              newRecs.push(rec);
              existingIds.add(rec.id || rec.title);
            }
          });
          
          attempts++;
        }
        
        const updatedRecommendations = [...prev, ...newRecs];
        
        // Check if we can still get more movies
        if (newRecs.length === 0 || attempts >= maxAttempts) {
          setHasMore(false);
          console.log('🚫 No more unique movies available');
        }
        
        return updatedRecommendations;
      });
    }
  }, [mood, page, recommendationsPerPage]);

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
    loadMoreRecommendations();
  };

  const handleMovieClick = async (movie) => {
    // Navigate to detail page using movie title as fallback
    navigate(`/detail/${movie.title}`);
  };

  const getMoodEmoji = (mood) => {
    const moodEmojis = {
      umum: '🎬',
      bahagia: '😊',
      sedih: '😢',
      action: '⚡',
      romantis: '💕',
      seru: '🎉',
      tenang: '🧘'
    };
    return moodEmojis[mood] || '🎬';
  };

  const getMoodTitle = (mood) => {
    const moodTitles = {
      umum: 'Umum',
      bahagia: 'Bahagia',
      sedih: 'Sedih',
      action: 'Action',
      romantis: 'Romantis',
      seru: 'Seru',
      tenang: 'Tenang'
    };
    return moodTitles[mood] || 'Umum';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-4 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Kembali
          </button>
          
          <div className="flex items-center mb-4">
            <FaRobot className="text-blue-500 text-3xl mr-3" />
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Rekomendasi Film {getMoodEmoji(mood)} {getMoodTitle(mood)}
            </h1>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300">
            Temukan lebih banyak film yang sesuai dengan mood {getMoodTitle(mood)} kamu
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 dark:bg-red-900 dark:border-red-600 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Recommendations Grid */}
        {recommendations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {recommendations.map((rec, index) => (
              <div
                key={`${rec.id || rec.title}-${index}`}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group transform hover:scale-105 overflow-hidden"
                onClick={() => handleMovieClick(rec)}
              >
                {/* Poster Section */}
                <div className="relative h-64 bg-gray-200 dark:bg-gray-700">
                  <img
                    src={getMoviePoster(rec)}
                    alt={rec.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://picsum.photos/seed/fallback-${rec.title}${rec.year}/300/450.jpg`;
                    }}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-white text-xs line-clamp-2">{rec.reason}</p>
                    </div>
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                      {rec.title}
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                      {rec.year}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    {rec.mood_match && (
                      <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                        <FaHeart className="mr-1 flex-shrink-0" />
                        <span className="line-clamp-1">{rec.mood_match}</span>
                      </div>
                    )}
                    
                    {rec.similarity && (
                      <div className="flex items-center text-xs text-blue-600 dark:text-blue-400">
                        <FaClock className="mr-1 flex-shrink-0" />
                        <span className="line-clamp-1">{rec.similarity}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="flex items-center text-blue-600 dark:text-blue-400">
              <FaSpinner className="animate-spin mr-3 text-2xl" />
              <span className="text-lg">Memuat rekomendasi film...</span>
            </div>
          </div>
        )}

        {/* Load More Button */}
        {!isLoading && recommendations.length > 0 && hasMore && (
          <div className="text-center">
            <button
              onClick={handleLoadMore}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-8 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Muat Lebih Banyak Film
            </button>
          </div>
        )}

        {/* No More Movies Message */}
        {!isLoading && recommendations.length > 0 && !hasMore && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              🎬 Semua film untuk mood {getMoodTitle(mood)} sudah ditampilkan
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && recommendations.length === 0 && !error && (
          <div className="text-center py-12">
            <FaRobot className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Belum ada rekomendasi
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              Cobalah pilih mood yang berbeda atau muat ulang halaman
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoreRecommendations;
