import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function MovieList({ movies, type }) {
  const baseImgUrl = process.env.REACT_APP_BASEIMGURL;
  const scrollRef = useRef(null);

  // LOGIK AUTO-SCROLL (HANYA AKTIF DI HP!)
  useEffect(() => {
    if (type === 'search' || type === 'filter') return; 

    const container = scrollRef.current;
    if (!container) return;

    let animationFrameId;
    
    // NAH! Sekarang angka sekecil apapun (0.2, 0.15) bakal jalan mulus
    const scrollSpeed = 0.2; 
    
    // Variabel bantuan untuk nyimpen angka pecahan (desimal)
    let exactScroll = container.scrollLeft; 

    const autoScroll = () => {
      // HENTIKAN auto-scroll jika ini di layar Desktop (lebar >= 768px / md)
      if (window.innerWidth >= 768) {
        cancelAnimationFrame(animationFrameId);
        return;
      }

      if (container.scrollLeft >= (container.scrollWidth - container.clientWidth - 1)) {
        exactScroll = 0; // Reset ke 0
        container.scrollLeft = 0;
      } else {
        exactScroll += scrollSpeed; // Tambahin angka desimal ke variabel bantuan
        container.scrollLeft = exactScroll; // Baru terapin ke browser
      }
      animationFrameId = requestAnimationFrame(autoScroll);
    };

    const startScroll = () => {
      // Cuma mulai animasi kalo di layar HP
      if (window.innerWidth < 768) {
        // Sinkronisasi posisi biar gak loncat kalau abis di-swipe manual pakai jari
        exactScroll = container.scrollLeft; 
        animationFrameId = requestAnimationFrame(autoScroll);
      }
    };
    
    const stopScroll = () => {
      cancelAnimationFrame(animationFrameId);
    };

    startScroll();

    container.addEventListener('mouseenter', stopScroll);
    container.addEventListener('mouseleave', startScroll);
    container.addEventListener('touchstart', stopScroll, { passive: true });
    container.addEventListener('touchend', startScroll);
    
    window.addEventListener('resize', startScroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mouseenter', stopScroll);
      container.removeEventListener('mouseleave', startScroll);
      container.removeEventListener('touchstart', stopScroll);
      container.removeEventListener('touchend', startScroll);
      window.removeEventListener('resize', startScroll);
    };
  }, [type, movies]);

  if (!movies || movies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No movies found</p>
      </div>
    );
  }

  const listType = type || "movie";

  // Desain Kartu kita pisah biar kode rapi (Ukuran Font/Padding otomatis berubah HP vs Desktop)
  const MovieCard = ({ movie }) => (
    <Link
      to={`/list/${listType}/detail/${movie.id}`}
      className="group block relative overflow-hidden rounded-xl md:rounded-2xl aspect-[2/3] bg-gray-900 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20 md:hover:shadow-blue-500/30 w-full h-full"
    >
      <img
        src={movie.poster_path ? `${baseImgUrl}/${movie.poster_path}` : "/no_image_available.jpg"}
        alt={movie.title}
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        loading="lazy"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />

      {movie.vote_average > 0 && (
        <div className="absolute top-1.5 right-1.5 md:top-3 md:right-3 bg-black/40 backdrop-blur-md border border-white/10 text-white px-1.5 py-0.5 md:px-2 md:py-1 rounded-md md:rounded-lg text-[10px] md:text-xs font-bold flex items-center gap-0.5 md:gap-1 shadow-lg transition-transform duration-300 group-hover:scale-105">
          <span className="text-yellow-400 text-[10px] md:text-sm">★</span> 
          {movie.vote_average.toFixed(1)}
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-2 md:p-4 translate-y-4 transition-transform duration-500 ease-out group-hover:translate-y-0">
        <h3 className="text-white font-bold text-xs md:text-base leading-tight md:leading-snug mb-0.5 md:mb-1 line-clamp-2 drop-shadow-lg">
          {movie.title}
        </h3>
        
        <div className="flex items-center justify-between mt-1 md:mt-2 opacity-0 transition-opacity duration-500 delay-100 group-hover:opacity-100">
          <span className="text-gray-300 text-[9px] md:text-xs font-medium bg-white/10 px-1 md:px-2 py-0.5 md:py-1 rounded backdrop-blur-sm">
            {movie.release_date?.split('-')[0] || 'N/A'}
          </span>
          <span className="text-blue-400 text-[9px] md:text-xs font-bold flex items-center gap-0.5 md:gap-1">
            Detail
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-2.5 h-2.5 md:w-3 md:h-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );

  // 1. TAMPILAN SEARCH / FILTER (Selalu Grid Kotak-kotak di semua device)
  if (type === 'search' || type === 'filter') {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4 md:gap-6">
        {movies.map((movie) => (
          <div key={movie.id}><MovieCard movie={movie} /></div>
        ))}
      </div>
    );
  }

  // 2. TAMPILAN HOME SECTION
  return (
    <div 
      ref={scrollRef}
      // THE MAGIC BULLET: 
      // Di HP: flex + overflow-x-auto (Bisa digeser)
      // Di Desktop (md:): grid + grid-cols-4 lg:grid-cols-5 (Paten Grid!)
      className="flex overflow-x-auto md:grid md:overflow-visible md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-6 pb-4 md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
    >
      {movies.map((movie) => (
        <div 
          key={movie.id} 
          // DI HP: Kecil mungil (w-[110px]) biar muat banyak
          // DI DESKTOP: Otomatis full menyesuaikan Grid (md:w-full)
          className="w-[110px] sm:w-[130px] flex-shrink-0 md:w-full md:flex-shrink-1"
        >
          <MovieCard movie={movie} />
        </div>
      ))}
    </div>
  );
}