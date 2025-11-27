import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import PredictPrice from "./pages/PredictPrice";
import CompareHouses from "./pages/CompareHouses";
import ChartsPage from "./pages/ChartsPage";

export default function App() {
  return (
    <div>
      <Navbar />

      <div className="pt-8 px-6 max-w-5xl mx-auto">
        <Routes>
          <Route path="/" element={<PredictPrice />} />
          <Route path="/compare" element={<CompareHouses />} />
          <Route path="/charts" element={<ChartsPage />} />
        </Routes>
      </div>
    </div>
  );
}
