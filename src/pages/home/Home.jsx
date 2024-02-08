import { useEffect, useState, useRef } from "react";
import { getMovieList, searchMovie, topRatedMovie, nowPlayingMovie } from "../../services/api";
import Navbar from "../Navbar";
import Slider from "../../components/detail/Slider";
import { Card } from "react-bootstrap";
import { IoIosArrowUp } from "react-icons/io";
import { Link } from "react-router-dom";

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

  const MovieList = ({ movies }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {movies.map((movie, i) => (
          <Link to={`/list/${movie.type}/detail/${movie.id}`} key={i}>
            {/* Use the Link component to wrap the card */}
            <div className="relative group flex flex-col mb-3" onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)}>
              <Card className="bg-dark-subtle p-2 rounded-lg shadow-lg transform transition-transform hover:scale-125 flex flex-col h-full">
                <Card.Img variant="top" className="w-full h-full object-cover rounded-md mb-2" src={`${baseImgUrl}/${movie.poster_path}`} alt={`${baseImgUrl}/${movie.title}`} />
                <Card.Body className="absolute inset-0">
                  {hoveredIndex === i && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center">
                      <div className="text-white text-base font-bold">{movie.title}</div>
                      <div className="text-gray-200 text-sm">{"(" + movie.release_date + ")"}</div>
                      <div className="text-yellow-500 text-sm">{movie.vote_average}⭐</div>
                      <p className="text-white text-center m-6">{movie.overview.length > 100 ? `${movie.overview.substring(0, 100)}...` : movie.overview}</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  const search = async (q) => {
    if (q.length > 1) {
      const query = await searchMovie(q);
      setSearchResults(query.results);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <div className="mb-2 w-full">
        <Navbar onSearch={search} />
      </div>
      <div className="mb-10" ref={nowPlayingRef}>
        {searchResults.length > 0 ? (
          <MovieList movies={searchResults} baseImgUrl={baseImgUrl} />
        ) : (
          <>
            <Slider movies={popularMovies} baseImgUrl={baseImgUrl} />
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
