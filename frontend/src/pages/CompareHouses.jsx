import { useState, useEffect } from "react";
import { compareHouses, getDropdowns } from "../api/api";
import SelectField from "../components/SelectField";
import InputField from "../components/InputField";

export default function CompareHouses() {
  const [h1, setH1] = useState({});
  const [h2, setH2] = useState({});
  const [options, setOptions] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getDropdowns().then((res) => setOptions(res.data));
  }, []);

  const change1 = (field, value) => {
    setH1((prev) => ({ ...prev, [field]: value }));
  };

  const change2 = (field, value) => {
    setH2((prev) => ({ ...prev, [field]: value }));
  };

  if (!options)
    return (
      <div className="text-center py-20 text-xl text-gray-500 animate-pulse">
        Loading comparison options...
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto py-10">
      {/* Page Title */}
      <h2 className="text-4xl font-bold text-gray-800 mb-8 tracking-tight">
        Compare Two Houses
      </h2>

      {/* Main Compare Card */}
      <div className="bg-white/70 backdrop-blur-lg shadow-xl rounded-xl p-10 border border-gray-200">

        <div className="grid md:grid-cols-2 gap-12">

          {/* ===================== HOUSE 1 ===================== */}
          <div className="bg-white/60 p-6 rounded-xl shadow-sm border">
            <h3 className="font-semibold text-2xl mb-5 text-indigo-700">
              House 1
            </h3>

            <div className="space-y-4">
              <SelectField
                label="Locality"
                value={h1.Locality || ""}
                options={options.Locality}
                onChange={(e) => change1("Locality", e.target.value)}
              />

              <SelectField
                label="Property Type"
                value={h1.Property_Type || ""}
                options={options.Property_Type}
                onChange={(e) => change1("Property_Type", e.target.value)}
              />

              <SelectField
                label="BHK"
                value={h1.BHK || ""}
                options={options.BHK}
                onChange={(e) => change1("BHK", e.target.value)}
              />

              <InputField
                label="Size in SqFt"
                type="number"
                value={h1.Size_in_SqFt || ""}
                onChange={(e) => change1("Size_in_SqFt", e.target.value)}
              />
            </div>
          </div>

          {/* ===================== HOUSE 2 ===================== */}
          <div className="bg-white/60 p-6 rounded-xl shadow-sm border">
            <h3 className="font-semibold text-2xl mb-5 text-indigo-700">
              House 2
            </h3>

            <div className="space-y-4">
              <SelectField
                label="Locality"
                value={h2.Locality || ""}
                options={options.Locality}
                onChange={(e) => change2("Locality", e.target.value)}
              />

              <SelectField
                label="Property Type"
                value={h2.Property_Type || ""}
                options={options.Property_Type}
                onChange={(e) => change2("Property_Type", e.target.value)}
              />

              <SelectField
                label="BHK"
                value={h2.BHK || ""}
                options={options.BHK}
                onChange={(e) => change2("BHK", e.target.value)}
              />

              <InputField
                label="Size in SqFt"
                type="number"
                value={h2.Size_in_SqFt || ""}
                onChange={(e) => change2("Size_in_SqFt", e.target.value)}
              />
            </div>
          </div>

        </div>

        {/* Compare Button */}
        <button
          onClick={async () => {
            setLoading(true);
            const res = await compareHouses({ house1: h1, house2: h2 });
            setResult(res.data);
            setLoading(false);
          }}
          className="mt-10 w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 transition-all text-white px-10 py-3 rounded-lg text-lg font-semibold shadow-md"
        >
          {loading ? "Comparing..." : "Compare Houses"}
        </button>

        {/* Result Section */}
        {result && (
          <div className="mt-10 bg-indigo-50 border border-indigo-200 p-8 rounded-xl shadow">
            <p className="text-lg mb-3">
              <span className="font-semibold">House 1 Estimated Price:</span>
              <span className="text-indigo-900 font-bold ml-2">
                ₹ {result.house1_price.toFixed(2)}
              </span>
            </p>

            <p className="text-lg mb-3">
              <span className="font-semibold">House 2 Estimated Price:</span>
              <span className="text-indigo-900 font-bold ml-2">
                ₹ {result.house2_price.toFixed(2)}
              </span>
            </p>

            <h3 className="mt-5 text-3xl font-bold text-indigo-700">
              Better Deal: {result.higher}
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}
