import React, { useState } from "react";

import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

import { Fade } from "react-awesome-reveal";

export default function MovieList({ movies }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const baseImgUrl = process.env.REACT_APP_BASEIMGURL;

  return (
    <Fade>
      <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {movies.map((movie, i) => (
          <Link to={`/list/${movie.type}/detail/${movie.id}`} key={i}>
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
    </Fade>
  );
}
