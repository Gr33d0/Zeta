import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import PythonInterpreter from "./pages/PythonInterpreter";
import TestComponents from "./pages/TestComponents";
import Container from "react-bootstrap/Container";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import LevelPage from "./pages/LevelPage";
import React from "react";

import './css/App.css';


function App() {
  return (
    <Container fluid className="App vh-100" >
      <Navbar  expand="lg" className="bg-body-tertiary App-header  ">
        <Container>
        <Navbar.Brand href="/">Logo</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/about">Sobre</Nav.Link>
            <Nav.Link href="/notfound">Not Found</Nav.Link>
            <Nav.Link href="/python">Python Interpreter</Nav.Link>
            <Nav.Link href="/testcomponents">Test Components</Nav.Link>
          </Nav>

        </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="mt-4 mb-4 p-3 rounded">
      <Routes>
      <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/python" element={<PythonInterpreter />} />
          <Route path="/testcomponents" element={<TestComponents />} />
          <Route path="/level/:levelId" element={ <React.Suspense fallback={<div>Loading...</div>}><LevelPage /></React.Suspense>} />

      </Routes>
      </Container>
    </Container>
  );
}

export default App;
