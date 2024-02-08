import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Detail from "./components/detail/Detail";

const App = () => {
  return (
    <div className="bg-black text-white">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/detail/:id" element={<Detail />} />
          <Route path="/list/:type/detail/:id" element={<Detail />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
