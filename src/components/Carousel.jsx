import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const MovieCarousel = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!movies || movies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === movies.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [movies]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? movies.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === movies.length - 1 ? 0 : currentIndex + 1);
  };

  if (!movies || movies.length === 0) {
    return null;
  }

  const currentMovie = movies[currentIndex];
  const backdropUrl = "https://image.tmdb.org/t/p/original";

  return (
    <div className="relative w-full h-[55vh] md:h-[85vh] overflow-hidden bg-black group">
      
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={`${backdropUrl}/${currentMovie.backdrop_path}`}
          alt={currentMovie.title}
          className="w-full h-full object-cover object-top transition-transform duration-1000 ease-in-out group-hover:scale-105"
        />
        
        {/* --- PERBAIKAN GRADASI (THE FIX) --- */}
        
        {/* 1. LAYER PROTEKSI TEKS (Gelap di belakang tulisan) */}
        {/* <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" /> */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/10 to-transparent" />
        
        {/* 2. LAYER BLENDING SMOOTH (Kunci agar tidak patah)
               - Menggunakan h-1/2 (setengah layar) agar pudarnya pelan-pelan.
               - Menambahkan transisi 'via' agar tidak mendadak putih/hitam.
        */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 via-gray-50/20 to-transparent dark:from-black dark:via-black/20" />
      </div>

      {/* Konten Text (Menggunakan Style Lama yang Proporsional) */}
      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-16 md:mt-0">
          <div className="max-w-3xl animate-in slide-in-from-left duration-700 fade-in">
            
            <Link to={`/detail/${currentMovie.id}`} className="no-underline block group/title">
              <h1 className="text-3xl md:text-6xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg group-hover/title:text-blue-400 transition-colors">
                {currentMovie.title}
              </h1>
            </Link>
            
            <div className="flex items-center space-x-4 text-gray-200 mb-6 font-medium text-sm md:text-lg drop-shadow-md">
              <span className="bg-white/10 px-2 py-1 rounded border border-white/20 backdrop-blur-sm">
                {currentMovie.release_date?.split('-')[0]}
              </span>
              <span className="flex items-center text-yellow-400 font-bold bg-black/20 px-2 py-1 rounded backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-1">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                </svg>
                {currentMovie.vote_average?.toFixed(1)}
              </span>
            </div>

            <p className="text-gray-100 text-sm md:text-lg line-clamp-3 md:line-clamp-4 mb-8 leading-relaxed max-w-xl drop-shadow-md font-light">
              {currentMovie.overview || "Description not available for this movie."}
            </p>

            <div className="flex space-x-4">
              <Link 
                to={`/detail/${currentMovie.id}`}
                className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-600/40 no-underline"
              >
                <span>Watch Trailer</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="ml-2 w-5 h-5">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                </svg>
              </Link>
              
              <Link 
                to={`/detail/${currentMovie.id}`}
                className="inline-flex items-center px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl transition-all duration-300 border border-white/20 hover:border-white/40 no-underline"
              >
                More Details
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tombol Navigasi */}
      <button
        onClick={goToPrevious}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/30 hover:bg-blue-600 text-white/70 hover:text-white rounded-full transition-all backdrop-blur-sm border border-white/10 group-hover:bg-black/50 z-20"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      <button
        onClick={goToNext}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/30 hover:bg-blue-600 text-white/70 hover:text-white rounded-full transition-all backdrop-blur-sm border border-white/10 group-hover:bg-black/50 z-20"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      {/* Indikator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-blue-500 w-8 shadow-[0_0_10px_rgba(59,130,246,0.5)]' 
                : 'bg-white/30 w-2 hover:bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default MovieCarousel;