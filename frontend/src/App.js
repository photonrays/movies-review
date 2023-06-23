import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import AddReview from "./components/add-review";
import MoviesList from "./components/movies-list";
import Movie from "./components/movie";
import Login from "./components/login";

// thang - 20521895
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

function App() {
  // thang - 20521895
  const [user, setUser] = useState(null);

  async function login(user = null) {
    setUser(user)
  }
  
  async function logout() {
    setUser(null);
  }

  return (
    <div className="App">
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="/">Movie Reviews</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link>
              <Link to={"/movies"}>Movies</Link>
            </Nav.Link>
            <Nav.Link>
              {user ? <a href="/">Logout User</a> : <Link to={"/login"}>Login</Link>}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* thang - 20521895 */}
      <Routes>
        <Route exact path="/" element={<MoviesList />}></Route>
        <Route
          path="/movies/:id/review"
          element={<AddReview user={user} />}
        ></Route>
        <Route path="/movies/:id" element={<Movie user={user} />}></Route>
        <Route path="/login" element={<Login login={login} />}></Route>
      </Routes>
    </div>
  );
}
export default App;
