import { useEffect, useState } from "react";
import { getAnalytics } from "../api/api";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function ChartsPage() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    getAnalytics().then((res) => setAnalytics(res.data));
  }, []);

  if (!analytics)
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg text-gray-500 animate-pulse">
          Loading analytics...
        </p>
      </div>
    );

  // --- Format chart data ---
  const priceDistData = Object.entries(analytics.price_distribution).map(
    ([label, value]) => ({ label, value })
  );
  const bhkAvgData = Object.entries(analytics.bhk_avg_price).map(
    ([bhk, price]) => ({ bhk, price })
  );
  const localityData = Object.entries(analytics.locality_avg_price).map(
    ([loc, price]) => ({ loc, price })
  );
  const scatterData = analytics.scatter_data;

  return (
    <div className="px-8 py-10 space-y-16 max-w-7xl mx-auto">

      {/* Title */}
      <h1 className="text-5xl font-bold text-gray-900 tracking-tight mb-4">
        Market Analytics
      </h1>
      <p className="text-lg text-gray-600 mb-10">
        Explore pricing trends, locality insights, and predictive analytics of the Delhi housing market.
      </p>

      {/* ========================= PRICE DISTRIBUTION ========================= */}
      <section className="p-8 rounded-2xl bg-white/60 backdrop-blur-xl shadow-xl border border-gray-200">
        <h2 className="text-3xl font-semibold mb-6 text-indigo-700">
          Price Distribution
        </h2>
        <p className="text-gray-600 mb-6">
          Number of houses available within different price brackets.
        </p>

        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={priceDistData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="label" angle={-25} textAnchor="end" height={70} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#6366F1" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* ========================= BHK AVG PRICE ========================= */}
      <section className="p-8 rounded-2xl bg-white/60 backdrop-blur-xl shadow-xl border border-gray-200">
        <h2 className="text-3xl font-semibold mb-6 text-emerald-700">
          Average Price by BHK
        </h2>
        <p className="text-gray-600 mb-6">
          How house prices change with number of bedrooms (BHK).
        </p>

        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={bhkAvgData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="bhk" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#10B981"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </section>

      {/* ========================= LOCALITY TOP 10 ========================= */}
      <section className="p-8 rounded-2xl bg-white/60 backdrop-blur-xl shadow-xl border border-gray-200">
        <h2 className="text-3xl font-semibold mb-6 text-amber-700">
          Top 10 Most Expensive Localities
        </h2>
        <p className="text-gray-600 mb-6">
          A look at the premium areas with the highest average price per house.
        </p>

        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={localityData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="loc" angle={-25} textAnchor="end" height={90} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="price" fill="#F59E0B" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* ========================= SCATTER CHART ========================= */}
      <section className="p-8 rounded-2xl bg-white/60 backdrop-blur-xl shadow-xl border border-gray-200">
        <h2 className="text-3xl font-semibold mb-6 text-rose-700">
          Size (SqFt) vs Price (Lakhs)
        </h2>
        <p className="text-gray-600 mb-6">
          Relationship between the built-up area and price of properties.
        </p>

        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart>
            <CartesianGrid opacity={0.3} />
            <XAxis
              dataKey="Size_in_SqFt"
              name="Size"
              label={{ value: "Size in SqFt", position: "bottom" }}
            />
            <YAxis
              dataKey="Price_in_Lakhs"
              name="Price"
              label={{
                value: "Price in Lakhs",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Scatter data={scatterData} fill="#EF4444" />
          </ScatterChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
}
