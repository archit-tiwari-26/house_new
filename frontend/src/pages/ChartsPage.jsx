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
        <p className="text-lg text-gray-500">Loading analytics...</p>
      </div>
    );

  // --- Format data for charts ---
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
    <div className="p-8 space-y-16">
      <h1 className="text-4xl font-semibold text-gray-800 mb-8">
        Market Analytics & Insights
      </h1>

      {/* --------------------------- PRICE DISTRIBUTION --------------------------- */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Price Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={priceDistData}>
            <XAxis dataKey="label" angle={-30} textAnchor="end" height={80} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#6366F1" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* --------------------------- BHK AVERAGE PRICE --------------------------- */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Average Price by BHK</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={bhkAvgData}>
            <CartesianGrid strokeDasharray="3 3" />
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

      {/* --------------------------- LOCALITY TOP 10 --------------------------- */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">
          Top 10 Most Expensive Localities
        </h2>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={localityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="loc" angle={-25} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="price" fill="#F59E0B" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* --------------------------- SCATTER: SIZE VS PRICE --------------------------- */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">
          Size (SqFt) vs Price (Lakhs)
        </h2>
        <ResponsiveContainer width="100%" height={350}>
          <ScatterChart>
            <CartesianGrid />
            <XAxis
              dataKey="Size_in_SqFt"
              name="Size"
              label={{ value: "Size in SqFt", position: "bottom" }}
            />
            <YAxis
              dataKey="Price_in_Lakhs"
              name="Price"
              label={{ value: "Price in Lakhs", angle: -90, position: "insideLeft" }}
            />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Scatter data={scatterData} fill="#EF4444" />
          </ScatterChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
}
