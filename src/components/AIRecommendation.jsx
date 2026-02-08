import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMovieRecommendation, generateMovieReview } from '../services/gemini';
import { FaRobot, FaStar, FaHeart, FaClock, FaPlus } from 'react-icons/fa';

const AIRecommendation = ({ currentMovie }) => {
  // If no currentMovie prop provided, use standalone mode
  const isStandalone = !currentMovie;
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userPreferences, setUserPreferences] = useState({
    mood: '',
    genres: '',
    recentlyWatched: ''
  });

  // Auto-load recommendations for standalone mode
  useEffect(() => {
    if (!currentMovie) {
      console.log('🚀 Component loaded in standalone mode');
      // Don't auto-load, let user choose mood first
    }
  }, []);

  useEffect(() => {
    if (currentMovie) {
      setUserPreferences(prev => ({
        ...prev,
        recentlyWatched: currentMovie.title,
        genres: currentMovie.genres?.map(g => g.name).join(', ')
      }));
    }
  }, [currentMovie]);

  const handleGetRecommendations = async () => {
    console.log('🎬 Getting recommendations for mood:', userPreferences.mood);
    console.log('🔍 Full userPreferences:', userPreferences);
    
    // Validate that mood is selected - more robust check
    if (!userPreferences.mood || userPreferences.mood.trim() === '') {
      console.log('❌ Mood validation failed - mood:', userPreferences.mood);
      alert('❌ Silakan pilih mood terlebih dahulu!');
      return;
    }
    
    console.log('✅ Mood validation passed:', userPreferences.mood);
    setIsLoading(true);
    
    // Clear current recommendations first
    setRecommendations([]);
    
    try {
      // Add timestamp to force fresh recommendations
      const preferencesWithTimestamp = {
        ...userPreferences,
        timestamp: Date.now(),
        refreshCount: Math.floor(Math.random() * 1000)
      };
      
      console.log('📤 Sending to API:', preferencesWithTimestamp);
      const recs = await getMovieRecommendation(preferencesWithTimestamp);
      console.log('📨 API Response:', recs);
      
      if (recs && recs.length > 0) {
        // Add unique keys to prevent duplicate rendering issues
        const recommendationsWithKeys = recs.map((rec, index) => ({
          ...rec,
          uniqueKey: `${rec.id || rec.title}-${Date.now()}-${index}`
        }));
        console.log('✅ Final recommendations:', recommendationsWithKeys);
        setRecommendations(recommendationsWithKeys);
      } else {
        throw new Error('Empty response');
      }
    } catch (error) {
      console.error('❌ API Error:', error);
      
      // Fallback to local data with randomization
      console.log('🔄 Using fallback system...');
      const { getFallbackRecommendations } = await import('../services/gemini-fallback');
      const fallbackRecs = getFallbackRecommendations(userPreferences.mood || 'umum');
      console.log('📦 Fallback recommendations:', fallbackRecs);
      
      // Add unique keys to fallback recommendations
      const recommendationsWithKeys = fallbackRecs.map((rec, index) => ({
        ...rec,
        uniqueKey: `fallback-${rec.id || rec.title}-${Date.now()}-${index}`
      }));
      console.log('✅ Final fallback recommendations:', recommendationsWithKeys);
      setRecommendations(recommendationsWithKeys);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReview = async (movie) => {
    try {
      const review = await generateMovieReview(movie);
      if (review) {
        // Show review in a nice modal or alert
        alert(`📝 **Review AI untuk ${movie.title}**\n\n${review}`);
      }
    } catch (error) {
      console.error('Error generating review:', error);
      alert('❌ Maaf, tidak bisa generate review saat ini.');
    }
  };

  const handleSeeMore = () => {
    if (!userPreferences.mood) {
      alert('❌ Silakan pilih mood terlebih dahulu!');
      return;
    }
    
    const params = new URLSearchParams({
      mood: userPreferences.mood,
      genres: userPreferences.genres || '',
      recentlyWatched: userPreferences.recentlyWatched || ''
    });
    
    navigate(`/more-recommendations?${params.toString()}`);
  };

  const handleMovieClick = async (movie) => {
    try {
      // First try to search for the movie in TMDB to get real ID
      const { searchMovie } = await import('../services/api');
      const searchResults = await searchMovie(movie.title);
      
      if (searchResults.length > 0) {
        // Use the first result's ID
        const foundMovie = searchResults[0];
        navigate(`/detail/${foundMovie.id}`);
      } else {
        // Fallback: use title-based navigation (will show not found)
        navigate(`/detail/${movie.title}`);
      }
    } catch (error) {
      console.error('Error searching movie:', error);
      // Fallback navigation
      navigate(`/detail/${movie.title}`);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 shadow-lg">
      <div className="flex items-center mb-4">
        <FaRobot className="text-blue-500 text-2xl mr-3" />
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
          {isStandalone ? 'AI Film Recommendations' : 'AI Recommendations'}
        </h3>
      </div>

      {/* User Preferences - Always show mood selection */}
      <div className="space-y-3 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Mood saat ini
          </label>
          <select
            value={userPreferences.mood}
            onChange={(e) => {
              const newMood = e.target.value;
              console.log('🎭 Mood changed to:', newMood);
              setUserPreferences(prev => ({ ...prev, mood: newMood }));
              // Clear recommendations immediately when mood changes
              setRecommendations([]);
              // Remove auto-get recommendations to prevent unwanted alerts
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
          >
            <option value="" className="dark:bg-gray-700 dark:text-white">Pilih mood</option>
            <option value="umum" className="dark:bg-gray-700 dark:text-white">🎬 Umum</option>
            <option value="bahagia" className="dark:bg-gray-700 dark:text-white">😊 Bahagia</option>
            <option value="sedih" className="dark:bg-gray-700 dark:text-white">😢 Sedih</option>
            <option value="action" className="dark:bg-gray-700 dark:text-white">⚡ Action</option>
            <option value="romantis" className="dark:bg-gray-700 dark:text-white">💕 Romantis</option>
            <option value="seru" className="dark:bg-gray-700 dark:text-white">🎉 Seru</option>
            <option value="tenang" className="dark:bg-gray-700 dark:text-white">🧘 Tenang</option>
          </select>
        </div>

        {/* Genre input - only show in detail mode */}
        {currentMovie && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Genre favorit
            </label>
            <input
              type="text"
              value={userPreferences.genres}
              onChange={(e) => setUserPreferences(prev => ({ ...prev, genres: e.target.value }))}
              placeholder="Contoh: action, comedy, drama"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
          </div>
        )}

        {/* Manual refresh button */}
        <button
          onClick={() => {
            console.log('🔄 Refresh clicked - Current mood:', userPreferences.mood);
            
            // Clear recommendations immediately for visual feedback
            setRecommendations([]);
            
            // Small delay to show clearing effect
            setTimeout(() => {
              handleGetRecommendations();
            }, 100);
          }}
          disabled={isLoading || !userPreferences.mood}
          className={`w-full py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center ${
            isLoading || !userPreferences.mood
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
              : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 hover:shadow-lg transform hover:scale-[1.02]'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Mencari rekomendasi baru...
            </div>
          ) : !userPreferences.mood ? (
            '🎭 Pilih mood terlebih dahulu'
          ) : (
            '🔄 Refresh Rekomendasi'
          )}
        </button>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800 dark:text-white flex items-center">
            <FaStar className="text-yellow-500 mr-2" />
            Rekomendasi untuk Kamu
          </h4>
          
          {recommendations.map((rec, index) => (
            <div key={rec.uniqueKey || `${rec.title}-${index}`} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer group">
              <div onClick={() => handleMovieClick(rec)}>
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {rec.title} ({rec.year})
                  </h5>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent movie click
                      handleGenerateReview(rec);
                    }}
                    className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm px-2 py-1 rounded border border-blue-300 dark:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
                  >
                    📝 Review
                  </button>
                </div>
              </div>
              
              <div onClick={() => handleMovieClick(rec)}>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                  {rec.reason}
                </p>
                
                {rec.mood_match && (
                  <div className="flex items-center text-sm text-green-600 dark:text-green-400 mb-1">
                    <FaHeart className="mr-1" />
                    <span className="dark:text-green-400">{rec.mood_match}</span>
                  </div>
                )}
                
                {rec.similarity && (
                  <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
                    <FaClock className="mr-1" />
                    <span className="dark:text-blue-400">{rec.similarity}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* "Lihat Lebih Banyak Film" Button - Show when there are recommendations */}
      {recommendations.length > 0 && !isLoading && (
        <div className="mt-6 text-center">
          <button
            onClick={handleSeeMore}
            className="bg-gradient-to-r from-green-500 to-teal-500 text-white py-2 px-6 rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300 flex items-center justify-center mx-auto transform hover:scale-105 shadow-md"
          >
            <FaPlus className="mr-2" />
            Lihat Lebih Banyak Film
          </button>
        </div>
      )}

      {recommendations.length === 0 && !isLoading && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <FaRobot className="text-4xl mx-auto mb-2 opacity-50" />
          <p className="dark:text-gray-400">Pilih mood kamu dan dapatkan rekomendasi film yang dipersonalisasi!</p>
        </div>
      )}
    </div>
  );
};

export default AIRecommendation;
