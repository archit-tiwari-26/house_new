import { useEffect, useState } from "react";
import { getDropdowns, predictPrice } from "../api/api";
import SelectField from "../components/SelectField";
import InputField from "../components/InputField";

export default function PredictPrice() {
  const [form, setForm] = useState({});
  const [price, setPrice] = useState(null);
  const [options, setOptions] = useState(null);

  useEffect(() => {
    getDropdowns().then((res) => setOptions(res.data));
  }, []);

  const change = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  if (!options) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-6">Predict House Price</h2>

      <div className="grid grid-cols-2 gap-6">
        
        {/* Locality */}
        <SelectField 
          label="Locality"
          value={form.Locality || ""}
          options={options.Locality}
          onChange={(e) => change("Locality", e.target.value)}
        />

        {/* Property Type */}
        <SelectField 
          label="Property Type" 
          value={form.Property_Type || ""}
          options={options.Property_Type}
          onChange={(e) => change("Property_Type", e.target.value)}
        />

        {/* Furnished Status */}
        <SelectField 
          label="Furnished Status" 
          value={form.Furnished_Status || ""}
          options={options.Furnished_Status}
          onChange={(e) => change("Furnished_Status", e.target.value)}
        />

        {/* Parking */}
        <SelectField 
          label="Parking Space" 
          value={form.Parking_Space || ""}
          options={options.Parking_Space}
          onChange={(e) => change("Parking_Space", e.target.value)}
        />

        {/* Facing */}
        <SelectField 
          label="Facing" 
          value={form.Facing || ""}
          options={options.Facing}
          onChange={(e) => change("Facing", e.target.value)}
        />

        {/* Owner Type */}
        <SelectField 
          label="Owner Type" 
          value={form.Owner_Type || ""}
          options={options.Owner_Type}
          onChange={(e) => change("Owner_Type", e.target.value)}
        />

        {/* Availability */}
        <SelectField 
          label="Availability Status"
          value={form.Availability_Status || ""}
          options={options.Availability_Status}
          onChange={(e) => change("Availability_Status", e.target.value)}
        />

        {/* BHK */}
        <SelectField 
          label="BHK" 
          value={form.BHK || ""}
          options={options.BHK}
          onChange={(e) => change("BHK", e.target.value)}
        />

        {/* Size */}
        <InputField 
          label="Size in SqFt" 
          type="number"
          value={form.Size_in_SqFt || ""}
          onChange={(e) => change("Size_in_SqFt", e.target.value)}
        />

        {/* Amenities */}
        <SelectField 
          label="Amenities" 
          value={form.Amenities || ""}
          options={options.Amenities}
          onChange={(e) => change("Amenities", e.target.value)}
        />

      </div>

      <button
        onClick={async () => {
          const res = await predictPrice({ data: form });
          setPrice(res.data.predicted_price);
        }}
        className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-lg"
      >
        Predict
      </button>

      {price && (
        <div className="mt-6 bg-indigo-100 p-5 rounded-xl text-lg font-semibold">
          Predicted Price: ₹ {price.toFixed(2)} Lakhs
        </div>
      )}
    </div>
  );
}
