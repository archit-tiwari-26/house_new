import { useEffect, useState } from "react";
import { getDropdowns, predictPrice } from "../api/api";
import SelectField from "../components/SelectField";
import InputField from "../components/InputField";

export default function PredictPrice() {
  const [form, setForm] = useState({});
  const [price, setPrice] = useState(null);
  const [options, setOptions] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getDropdowns().then((res) => setOptions(res.data));
  }, []);

  const change = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  if (!options)
    return (
      <div className="text-center py-20 text-xl text-gray-500 animate-pulse">
        Loading configuration...
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto py-10">
      {/* TITLE */}
      <h2 className="text-4xl font-bold mb-6 text-gray-800 tracking-tight">
        Predict House Price
      </h2>

      {/* CARD */}
      <div className="bg-white/70 backdrop-blur-lg shadow-xl rounded-xl p-8 border border-gray-200">

        {/* Grid Form */}
        <div className="grid md:grid-cols-2 gap-6">
          
          <SelectField
            label="Locality"
            value={form.Locality || ""}
            options={options.Locality}
            onChange={(e) => change("Locality", e.target.value)}
          />

          <SelectField
            label="Property Type"
            value={form.Property_Type || ""}
            options={options.Property_Type}
            onChange={(e) => change("Property_Type", e.target.value)}
          />

          <SelectField
            label="Furnished Status"
            value={form.Furnished_Status || ""}
            options={options.Furnished_Status}
            onChange={(e) => change("Furnished_Status", e.target.value)}
          />

          <SelectField
            label="Parking Space"
            value={form.Parking_Space || ""}
            options={options.Parking_Space}
            onChange={(e) => change("Parking_Space", e.target.value)}
          />

          <SelectField
            label="Facing"
            value={form.Facing || ""}
            options={options.Facing}
            onChange={(e) => change("Facing", e.target.value)}
          />

          <SelectField
            label="Owner Type"
            value={form.Owner_Type || ""}
            options={options.Owner_Type}
            onChange={(e) => change("Owner_Type", e.target.value)}
          />

          <SelectField
            label="Availability Status"
            value={form.Availability_Status || ""}
            options={options.Availability_Status}
            onChange={(e) => change("Availability_Status", e.target.value)}
          />

          <SelectField
            label="BHK"
            value={form.BHK || ""}
            options={options.BHK}
            onChange={(e) => change("BHK", e.target.value)}
          />

          <InputField
            label="Size in SqFt"
            type="number"
            value={form.Size_in_SqFt || ""}
            onChange={(e) => change("Size_in_SqFt", e.target.value)}
          />

          <SelectField
            label="Amenities"
            value={form.Amenities || ""}
            options={options.Amenities}
            onChange={(e) => change("Amenities", e.target.value)}
          />
        </div>

        {/* Predict Button */}
        <button
          onClick={async () => {
            setLoading(true);
            const res = await predictPrice({ data: form });
            setPrice(res.data.predicted_price);
            setLoading(false);
          }}
          className="mt-8 w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 transition-all text-white px-8 py-3 rounded-lg shadow-md font-semibold tracking-wide"
        >
          {loading ? "Predicting..." : "Predict Price"}
        </button>

        {/* Result */}
        {price && (
          <div className="mt-8 p-6 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-xl text-xl font-semibold shadow">
            Estimated Price:  
            <span className="text-3xl font-bold ml-2">₹ {price.toFixed(2)} Lakhs</span>
          </div>
        )}
      </div>
    </div>
  );
}
