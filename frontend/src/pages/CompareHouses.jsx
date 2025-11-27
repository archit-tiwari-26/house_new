import { useState, useEffect } from "react";
import { compareHouses, getDropdowns } from "../api/api";
import SelectField from "../components/SelectField";
import InputField from "../components/InputField";

export default function CompareHouses() {
  const [h1, setH1] = useState({});
  const [h2, setH2] = useState({});
  const [options, setOptions] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    getDropdowns().then((res) => setOptions(res.data));
  }, []);

  const change1 = (field, value) => {
    setH1((prev) => ({ ...prev, [field]: value }));
  };

  const change2 = (field, value) => {
    setH2((prev) => ({ ...prev, [field]: value }));
  };

  if (!options) return <p>Loading dropdowns...</p>;

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-6">Compare Two Houses</h2>

      <div className="grid grid-cols-2 gap-10">

        {/* ===================== HOUSE 1 ===================== */}
        <div>
          <h3 className="font-bold text-xl mb-3 text-indigo-600">House 1</h3>

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

        {/* ===================== HOUSE 2 ===================== */}
        <div>
          <h3 className="font-bold text-xl mb-3 text-indigo-600">House 2</h3>

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

      <button
        onClick={async () => {
          const res = await compareHouses({ house1: h1, house2: h2 });
          setResult(res.data);
        }}
        className="mt-6 bg-indigo-600 hover:bg-indigo-700 transition text-white px-6 py-3 rounded-lg"
      >
        Compare Houses
      </button>

      {result && (
        <div className="mt-8 bg-indigo-100 border border-indigo-300 p-6 rounded-lg shadow">
          <p className="text-lg mb-2">
            House 1 Price:
            <b className="text-indigo-800"> ₹ {result.house1_price.toFixed(2)}</b>
          </p>
          <p className="text-lg mb-2">
            House 2 Price:
            <b className="text-indigo-800"> ₹ {result.house2_price.toFixed(2)}</b>
          </p>

          <h3 className="mt-3 text-2xl font-semibold text-indigo-700">
            Better Deal: {result.higher}
          </h3>
        </div>
      )}
    </div>
  );
}
