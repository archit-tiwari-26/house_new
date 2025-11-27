import { motion } from "framer-motion";
import { HomeIcon, ChartBarIcon, ScaleIcon } from "@heroicons/react/24/solid";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="p-5 shadow-xl bg-white/50 backdrop-blur-lg sticky top-0 z-30 border-b border-white/20"
    >
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-700"> House Price Predictor</h1>

        <div className="flex gap-6 text-gray-700 font-medium">
          <a href="/" className="hover:text-indigo-600 flex items-center gap-2">
            <HomeIcon className="h-5" /> Predict
          </a>

          <a href="/compare" className="hover:text-indigo-600 flex items-center gap-2">
            <ScaleIcon className="h-5" /> Compare
          </a>

          <a href="/charts" className="hover:text-indigo-600 flex items-center gap-2">
            <ChartBarIcon className="h-5" /> Analytics
          </a>
        </div>
      </div>
    </motion.nav>
  );
}
