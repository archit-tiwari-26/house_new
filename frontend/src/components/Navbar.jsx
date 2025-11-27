import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="shadow-md bg-white py-4 px-6 flex justify-between">
      <h1 className="text-2xl font-bold text-indigo-700"> House Price Predictor</h1>

      <div className="space-x-6 text-lg">
        <Link to="/">Predict</Link>
        <Link to="/compare">Compare</Link>
        <Link to="/charts">Charts</Link>
        
      </div>
    </nav>
  );
}
