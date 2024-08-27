import { Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import "bootstrap/dist/css/bootstrap.min.css";

const MovieCarousel = ({ movies, baseImgUrl }) => {
  return (
    <div className="mt-5">
      <Fade>
        <Carousel>
          {movies.map((movie) => (
            <Carousel.Item key={movie.id}>
              <Link to={`/detail/${movie.id}`}>
                <img className="d-block w-screen object-cover" src={`${baseImgUrl}/${movie.backdrop_path}`} alt={`${baseImgUrl}/${movie.title}`} />
                <div className="absolute inset-0 flex flex-col justify-center items-center p-48 mt-44 text-white bg-gradient-to-t from-black">
                  <div className="text-4xl md:text-5xl font-black mb-3">{movie.title}</div>
                  <div className="text-base md:text-2xl mb-2 md:mr-5 font-bold">
                    {movie.release_date}
                    <span className="md:ml-5">{movie.vote_average}⭐</span>
                  </div>
                  {window.innerWidth >= 768 ? <div className="italic text-sm mt-1">{movie.overview || "Description not available"}</div> : null}
                </div>
              </Link>
            </Carousel.Item>
          ))}
        </Carousel>
      </Fade>
    </div>
  );
};

export default MovieCarousel;
