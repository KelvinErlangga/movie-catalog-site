import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Container, Row, Col, Image, Button } from "react-bootstrap";

import { getMovieDetails, searchMovie } from "../services/api";
import NavBar from "./Navbar";
import MovieList from "../components/MovieList";

const Detail = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [movieDetail, setMovieDetail] = useState();
  const baseImgUrl = process.env.REACT_APP_BASEIMGURL;
  const nowPlayingRef = useRef(null);

  const { id } = useParams();

  useEffect(() => {
    getMovieDetails(id)
      .then((result) => {
        setMovieDetail(result);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  const search = async (q) => {
    if (q.length > 1) {
      const query = await searchMovie(q);
      setSearchResults(query.results);
    }
  };

  return (
    <>
      <div className="mb-5 w-full">
        <NavBar onSearch={search} />
      </div>
      <div className="mb-10" ref={nowPlayingRef}>
        {searchResults.length > 0 ? (
          <MovieList movies={searchResults} baseImgUrl={baseImgUrl} />
        ) : (
          <Container className="w-full flex flex-col items-center">
            <Row className="w-full">
              <Col>
                <img className="w-full max-w-screen-xl h-[500px] object-cover mx-auto object-top" src={`${baseImgUrl}${movieDetail?.backdrop_path || "no_image_available.jpg"}`} alt="" fluid />
                <div className="w-3/4 flex items-center relative bottom-52 mx-auto">
                  <div className="mr-8">
                    <div className="w-60">
                      <img className="w-full rounded-md shadow-xl" src={`${baseImgUrl}${movieDetail?.poster_path || "no_image_available.jpg"}`} alt="" />
                    </div>
                  </div>
                  <Col className="text-white flex flex-col justify-between">
                    <div>
                      <h2 className="font-semibold text-3xl">{movieDetail?.original_title || "no title found"}</h2>
                      <p className="text-gray-400 text-sm">{movieDetail?.tagline || "no tagline found"}</p>
                      <div className="text-yellow-400">
                        {movieDetail?.vote_average || "no rate found"} <i className="fas fa-star" />
                        <span className="text-sm">{movieDetail ? `(${movieDetail.vote_count} votes)` : ""}</span>
                      </div>
                      <p className="text-sm">{movieDetail?.runtime + " mins" || "no runtime found"}</p>
                      <p className="text-sm">
                        {"Release date: " + (movieDetail?.release_date || "no release date found")} <i className="fas fa-star" />
                      </p>
                      <div className="flex space-x-2 mt-5">
                        {movieDetail?.genres?.map((genre) => (
                          <span className="border border-white rounded-full px-2 py-1" id={genre.id} key={genre.id}>
                            {genre.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-8">
                      <div className="font-semibold text-2xl mb-4">Synopsis</div>
                      <p>{movieDetail?.overview || ""}</p>
                    </div>
                  </Col>
                </div>
              </Col>
            </Row>
            <Row className="flex justify-between w-3/4 relative bottom-24">
              <Col className="flex flex-col space-y-4">
                <div className="font-semibold text-2xl">Useful Links</div>
                {movieDetail?.homepage && (
                  <Button href={movieDetail.homepage} target="_blank" rel="noopener noreferrer" variant="danger" className="text-white text-lg no-underline py-2 px-4 rounded-full flex items-center">
                    Homepage <i className="newTab fas fa-external-link-alt ml-2" />
                  </Button>
                )}
                {movieDetail?.imdb_id && (
                  <Button href={`https://www.imdb.com/title/${movieDetail.imdb_id}`} target="_blank" rel="noopener noreferrer" variant="warning" className="text-white text-lg no-underline py-2 px-4 rounded-full flex items-center">
                    IMDb <i className="newTab fas fa-external-link-alt ml-2" />
                  </Button>
                )}
              </Col>
            </Row>
            <Row className="font-semibold text-2xl w-4/5 mb-10">Production companies</Row>
            <Row className="w-5/6 flex justify-center items-end">
              {movieDetail?.production_companies?.map((company) =>
                company.logo_path ? (
                  <Col className="flex flex-col items-center" key={company.id}>
                    <Image className="w-48 h-24 object-contain m-4" src={`https://image.tmdb.org/t/p/original${company.logo_path}`} alt={company.name} fluid />
                    <span className="text-white">{company.name}</span>
                  </Col>
                ) : null
              )}
            </Row>
          </Container>
        )}
      </div>
    </>
  );
};

export default Detail;
