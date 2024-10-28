import React, { useState } from "react";
import { Navbar, Nav, FormControl, Form, Container } from "react-bootstrap";

export default function NavBar({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <Navbar bg="black" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand href="/" className="mr-5 fs-4 fw-bolder">
          CINEMA<span className="text-blue-400">VIN</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Form onSubmit={handleSearchSubmit} className="flex items-center md:w-1/2 lg:w-2/3 mx-auto">
            <FormControl type="text" placeholder="Search Movie Here" className="mr-2 ml-10 flex-1 transition-all duration-300 ease-in-out transform" value={searchQuery} onChange={handleSearchChange} />
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </Form>

          <Nav className="ml-auto">
            <Nav.Link href="#now_playing">Now Playing</Nav.Link>
            <Nav.Link href="#popular">Popular</Nav.Link>
            <Nav.Link href="#top_rated">Top Rated</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
