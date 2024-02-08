import { Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const MovieSlider = ({ movies, baseImgUrl }) => {
  return (
    <Container>
      <Row>
        <Col>
          <Carousel showThumbs={false} autoPlay={true} transitionTime={1000} infiniteLoop={true} showStatus={false}>
            {movies.map((movie) => (
              <Link key={movie.id} to={`/detail/${movie.id}`}>
                <img className="object-cover" src={`${baseImgUrl}/${movie.backdrop_path}`} alt={`${baseImgUrl}/${movie.title}`} />
                <div className="absolute inset-0 flex flex-col justify-end p-40 text-white bg-gradient-to-t from-black">
                  <div className="text-4xl md:text-6xl font-black mb-3">{movie.title}</div>
                  <div className="text-base md:text-3xl mb-2 md:mr-5 font-bold">
                    {movie.release_date}
                    <span className="md:ml-5">{movie.vote_average}⭐</span>
                  </div>
                  {window.innerWidth >= 768 ? <div className="italic text-sm mt-1">{movie.overview || "Description not available"}</div> : null}
                </div>
              </Link>
            ))}
          </Carousel>
        </Col>
      </Row>
    </Container>
  );
};

export default MovieSlider;
