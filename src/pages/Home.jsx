import { useEffect, useState, useRef } from "react";
import { getMovieList, nowPlayingMovie, topRatedMovie, searchMovie } from "../services/api";
import NavBar from "../components/Navbar";
import MovieCarousel from "../components/Carousel";
import MovieList from "../components/MovieList";
import { IoIosArrowUp } from "react-icons/io";

const Home = () => {
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const baseImgUrl = process.env.REACT_APP_BASEIMGURL;
  const nowPlayingRef = useRef(null);

  useEffect(() => {
    nowPlayingMovie().then((result) => {
      setNowPlayingMovies(result);
    });
    getMovieList().then((result) => {
      setPopularMovies(result);
    });
    topRatedMovie().then((result) => {
      setTopRatedMovies(result);
    });

    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > (nowPlayingRef.current?.offsetTop || 0));
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const search = async (q) => {
    if (q.length > 1) {
      const query = await searchMovie(q);
      setSearchResults(query.results);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <div className="mb-2 w-full">
        <NavBar onSearch={search} />
      </div>
      <div className="mb-10" ref={nowPlayingRef}>
        {searchResults.length > 0 ? (
          <MovieList movies={searchResults} baseImgUrl={baseImgUrl} />
        ) : (
          <>
            <MovieCarousel movies={nowPlayingMovies} baseImgUrl={baseImgUrl} />
            <div className="m-10 text-center">
              <h2 className="mt-12 mb-8 font-bold" id="now_playing">
                NOW PLAYING
              </h2>
              <MovieList movies={nowPlayingMovies} />
              <h2 className="mt-20 mb-8 font-bold" id="popular">
                POPULAR MOVIES
              </h2>
              <MovieList movies={popularMovies} />
              <h2 className="mt-20 mb-8 font-bold" id="top_rated">
                TOP RATED
              </h2>
              <MovieList movies={topRatedMovies} />
            </div>
          </>
        )}
      </div>
      {showScrollToTop && (
        <div className="fixed bottom-10 right-10 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <IoIosArrowUp size={40} />
        </div>
      )}
    </div>
  );
};

export default Home;
