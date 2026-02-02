import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const MovieCarousel = ({ movies, baseImgUrl }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === movies.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [movies.length]);

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

  return (
    <div className="relative w-full h-96 md:h-[500px] overflow-hidden bg-gray-900">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={`${baseImgUrl}/${currentMovie.backdrop_path}`}
          alt={currentMovie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <Link to={`/detail/${currentMovie.id}`} className="no-underline">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 hover:text-blue-400 transition-colors">
                {currentMovie.title}
              </h1>
            </Link>
            
            <div className="flex items-center space-x-4 text-gray-300 mb-4">
              <span className="text-sm md:text-base">{currentMovie.release_date}</span>
              <span className="flex items-center">
                <span className="text-yellow-500 mr-1">★</span>
                <span className="text-sm md:text-base">{currentMovie.vote_average}</span>
              </span>
            </div>

            <p className="text-gray-300 text-sm md:text-base line-clamp-3 mb-6">
              {currentMovie.overview || "Description not available"}
            </p>

            <Link 
              to={`/detail/${currentMovie.id}`}
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors no-underline"
            >
              View Details
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="ml-2 h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex 
                ? 'bg-blue-600 w-8' 
                : 'bg-gray-400 hover:bg-gray-300'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default MovieCarousel;
