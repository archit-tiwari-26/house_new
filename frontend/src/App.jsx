import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import PredictPrice from "./pages/PredictPrice";
import CompareHouses from "./pages/CompareHouses";
import ChartsPage from "./pages/ChartsPage";

import bg from "./bg.jpg";  // ✅ Correct path

export default function App() {
  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Transparent overlay */}
<div className="absolute inset-0 bg-gradient-to-b from-white/20 to-white/50 backdrop-blur-sm"></div>



      {/* Actual page content */}
      <div className="relative z-10">
        <Navbar />
        <div className="pt-8 px-6 max-w-5xl mx-auto pb-16">
          <Routes>
            <Route path="/" element={<PredictPrice />} />
            <Route path="/compare" element={<CompareHouses />} />
            <Route path="/charts" element={<ChartsPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
