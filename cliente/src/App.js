import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import PythonInterpreter from "./pages/PythonInterpreter";

function App() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/about">Sobre</Link> |{" "}
        <Link to="/notfound">Not Found</Link>|{" "}
        <Link to="/python">Python Interpreter</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/python" element={<PythonInterpreter />} />
      </Routes>
    </div>
  );
}

export default App;
