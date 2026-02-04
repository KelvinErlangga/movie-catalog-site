import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { getMovieDetails, searchMovie, getMovieVideos, getMovieCredits } from "../services/api";
import NavBar from "./Navbar";
import MovieList from "../components/MovieList";

const Detail = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [movieDetail, setMovieDetail] = useState(null);
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trailerKey, setTrailerKey] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  const navigate = useNavigate();

  const baseImgUrl = process.env.REACT_APP_BASEIMGURL;
  const backdropUrl = "https://image.tmdb.org/t/p/original";
  const profileBaseUrl = "https://image.tmdb.org/t/p/w185"; 

  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    setMovieDetail(null);
    setTrailerKey(null);
    setCredits(null); 
    
    const fetchData = async () => {
      try {
        const detailData = await getMovieDetails(id);
        setMovieDetail(detailData);

        const videoData = await getMovieVideos(id);
        const officialTrailer = videoData.find(
          (vid) => vid.type === "Trailer" && vid.site === "YouTube"
        );
        if (officialTrailer) {
          setTrailerKey(officialTrailer.key);
        }

        const creditsData = await getMovieCredits(id);
        setCredits(creditsData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  // --- BAGIAN INI YANG DIPERBAIKI ---
  const search = async (q) => {
    if (q.length > 1) {
      // searchMovie mengembalikan Array, bukan Object dengan properti .results
      const results = await searchMovie(q);
      
      // HAPUS .results DISINI
      setSearchResults(results); 
    }
  };
  // ----------------------------------

  const handleGenreRedirect = (genre) => {
    sessionStorage.setItem('activeGenre', JSON.stringify(genre));
    sessionStorage.setItem('currentView', 'filter');
    sessionStorage.removeItem('activeYear');
    sessionStorage.removeItem('activeCountry');
    sessionStorage.removeItem('searchResults');
    navigate('/');
  };

  const handleYearRedirect = (year) => {
    sessionStorage.setItem('activeYear', JSON.stringify(year));
    sessionStorage.setItem('currentView', 'filter');
    sessionStorage.removeItem('activeGenre');
    sessionStorage.removeItem('activeCountry');
    sessionStorage.removeItem('searchResults');
    navigate('/');
  };

  const handleCountryRedirect = (country) => {
    sessionStorage.setItem('activeCountry', JSON.stringify(country));
    sessionStorage.setItem('currentView', 'filter');
    sessionStorage.removeItem('activeGenre');
    sessionStorage.removeItem('activeYear');
    sessionStorage.removeItem('searchResults');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading details...</p>
        </div>
      </div>
    );
  }

  if (!movieDetail) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Movie not found</p>
        <button 
            onClick={() => navigate('/')}
            className="ml-4 text-blue-500 hover:underline"
        >
            Back to Home
        </button>
      </div>
    );
  }

  return (
    // <div className="min-h-screen bg-black text-white flex flex-col relative">
    <div className="min-h-screen transition-colors duration-300 bg-gray-50 text-gray-900 dark:bg-black dark:text-white flex flex-col relative">
      <NavBar 
        onSearch={search}
        onGenreFilter={handleGenreRedirect}
        onYearFilter={handleYearRedirect}
        onCountryFilter={handleCountryRedirect}
      />
      
      {showTrailer && trailerKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
                <button 
                    onClick={() => setShowTrailer(false)}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-red-600 text-white rounded-full transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <iframe
                    src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                    title="Movie Trailer"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
        </div>
      )}

      <div className="flex-grow">
        {searchResults && searchResults.length > 0 ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Search Results</h2>
                <button 
                    onClick={() => setSearchResults([])}
                    className="text-gray-400 hover:text-white"
                >
                    Clear Search
                </button>
            </div>
            <MovieList movies={searchResults} type="search" />
          </div>
        ) : (
          <div className="relative">
            {/* HERO SECTION */}
            <div className="relative h-96 md:h-[600px] overflow-hidden">
              <img
                src={movieDetail.backdrop_path 
                  ? `${backdropUrl}${movieDetail.backdrop_path}` 
                  : "/no_image_available.jpg"
                }
                alt={movieDetail.title}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
            </div>

            {/* MAIN CONTENT */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative -mt-32 md:-mt-64 z-10 pb-12">
                
                {/* UPPER SECTION: POSTER + INFO TEXT */}
                <div className="flex flex-col md:flex-row gap-8 mb-12">
                  
                  {/* Poster */}
                  <div className="flex-shrink-0">
                    <img
                      src={movieDetail.poster_path 
                        ? `${baseImgUrl}${movieDetail.poster_path}` 
                        : "/no_image_available.jpg"
                      }
                      alt={movieDetail.title}
                      className="w-48 md:w-80 rounded-xl shadow-2xl mx-auto md:mx-0 border-4 border-gray-800/50"
                    />
                  </div>

                  {/* Info Text */}
                  <div className="flex-1 text-center md:text-left pt-4 md:pt-12">
                    <h1 className="text-3xl md:text-5xl font-extrabold mb-2 text-white drop-shadow-lg">
                      {movieDetail.original_title || movieDetail.title}
                    </h1>
                    
                    {movieDetail.tagline && (
                      <p className="text-gray-300 text-lg mb-4 italic font-light">
                        "{movieDetail.tagline}"
                      </p>
                    )}

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6">
                      <div className="flex items-center bg-gray-800/60 px-3 py-1.5 rounded-lg border border-gray-700 backdrop-blur-md">
                        <span className="text-yellow-400 mr-2 text-lg">★</span>
                        <span className="font-bold text-white text-lg">{movieDetail.vote_average?.toFixed(1) || 'N/A'}</span>
                        <span className="text-gray-400 ml-1 text-sm">({movieDetail.vote_count || 0})</span>
                      </div>
                      
                      {movieDetail.runtime && (
                        <span className="text-gray-200 bg-gray-800/60 px-3 py-1.5 rounded-lg border border-gray-700 backdrop-blur-md font-medium">
                          {Math.floor(movieDetail.runtime / 60)}h {movieDetail.runtime % 60}m
                        </span>
                      )}
                      
                      {movieDetail.release_date && (
                        <span className="text-gray-200 bg-gray-800/60 px-3 py-1.5 rounded-lg border border-gray-700 backdrop-blur-md font-medium">
                          {new Date(movieDetail.release_date).getFullYear()}
                        </span>
                      )}
                    </div>

                    {movieDetail.genres && movieDetail.genres.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-8 justify-center md:justify-start">
                        {movieDetail.genres.map((genre) => (
                          <span
                            key={genre.id}
                            className="px-4 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-300 rounded-full text-sm border border-blue-500/20 transition-colors"
                          >
                            {genre.name}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mb-8 max-w-4xl">
                      <h2 className="text-xl font-bold mb-3 text-white border-l-4 border-blue-600 pl-4">Overview</h2>
                      <p className="text-gray-300 leading-relaxed text-lg text-justify md:text-left">
                        {movieDetail.overview || "No synopsis available."}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                      {trailerKey && (
                          <button
                            onClick={() => setShowTrailer(true)}
                            className="inline-flex items-center px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all hover:-translate-y-1 shadow-lg shadow-red-900/30 cursor-pointer border-none"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="mr-2 w-6 h-6">
                                <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                            </svg>
                            Watch Trailer
                          </button>
                      )}

                      {movieDetail.homepage && (
                        <a
                          href={movieDetail.homepage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all hover:-translate-y-1 shadow-lg shadow-blue-900/30 no-underline"
                        >
                          Official Website
                        </a>
                      )}
                      
                      {movieDetail.imdb_id && (
                        <a
                          href={`https://www.imdb.com/title/${movieDetail.imdb_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-6 py-3 bg-[#F5C518] hover:bg-[#E2B616] text-black font-bold rounded-xl transition-all hover:-translate-y-1 shadow-lg no-underline"
                        >
                          IMDb
                        </a>
                      )}
                    </div>
                  </div>
                </div> 

                {/* CAST SECTION */}
                {credits && credits.cast && credits.cast.length > 0 && (
                  <div className="mb-12">
                    <h2 className="text-xl font-bold mb-6 text-white border-l-4 border-blue-600 pl-4 text-left">Top Cast</h2>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                      {credits.cast.slice(0, 12).map((actor) => (
                        <div key={actor.id} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 border border-gray-700/50">
                          <div className="aspect-[2/3] overflow-hidden bg-gray-700">
                            <img
                              src={actor.profile_path 
                                ? `${profileBaseUrl}${actor.profile_path}` 
                                : "https://via.placeholder.com/185x278?text=No+Image"
                              }
                              alt={actor.name}
                              className="w-full h-full object-cover object-top"
                              loading="lazy"
                            />
                          </div>
                          <div className="p-3 text-left">
                            <h3 className="font-bold text-white text-sm truncate">{actor.name}</h3>
                            <p className="text-gray-400 text-xs truncate mt-1">{actor.character}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Production Companies */}
                {movieDetail.production_companies && movieDetail.production_companies.length > 0 && (
                  <div className="mt-8">
                    <div className="flex items-center mb-6">
                      <h2 className="text-xl font-bold text-white mr-4">Production Companies</h2>
                      <div className="h-px bg-gray-800 flex-grow"></div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
                      <div className="flex flex-wrap justify-center md:justify-start gap-12 items-center">
                        {movieDetail.production_companies
                          .filter(company => company.logo_path)
                          .map((company) => (
                            <div key={company.id} className="group relative flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 hover:bg-white/5">
                              <img
                                src={`https://image.tmdb.org/t/p/original${company.logo_path}`}
                                alt={company.name}
                                className="h-10 md:h-16 w-auto object-contain filter brightness-0 invert opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                              />
                              <span className="absolute -bottom-2 opacity-0 group-hover:opacity-100 text-xs text-gray-400 transition-opacity duration-300 mt-2 whitespace-nowrap">
                                {company.name}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="border-t border-gray-800 bg-black py-8 mt-auto z-20 relative text-center">
        <p className="text-gray-400 font-medium">&copy; 2026 CINEMAVIN. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Detail;