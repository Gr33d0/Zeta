import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.tsx";
import TestComponents from "./pages/TestComponents.tsx";
import NotFound from "./pages/NotFound.tsx";
import PythonInterpreter from "./pages/PythonInterpreter.tsx";
import LevelLoader from "./pages/levels/LevelLoader.tsx"; // <- está dentro de /pages/levels
import Stars from "./components/Stars.tsx";
import Nav from "react-bootstrap/Nav";

import "./css/App.css";
function App() {
  return (
    <>
      <Nav className="justify-content-center main-navbar" >
        <Nav.Item>
          <Nav.Link as={Link} to="/">
            Home
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/test">
            Sobre
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/notfound">
            Not Found
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
     
          <Stars/>
          </Nav.Item>
      </Nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<TestComponents />} />
        <Route path="/python" element={<PythonInterpreter />} />
        {/* Casa com /levels/Level1, /levels/Level2, ... */}
        <Route path="/levels/:level" element={<LevelLoader />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
