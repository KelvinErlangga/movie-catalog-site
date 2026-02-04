import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Detail from "./components/Detail";
import { ThemeProvider } from "./context/ThemeContext"; // Import ini

const App = () => {
  return (
    <ThemeProvider>
      {/* Hapus class bg-black text-white disini, pindahkan ke dalam komponen atau body */}
      <div className="min-h-screen transition-colors duration-300 bg-gray-50 text-gray-900 dark:bg-black dark:text-white">
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/detail/:id" element={<Detail />} />
            <Route path="/list/:type/detail/:id" element={<Detail />} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
};

export default App;