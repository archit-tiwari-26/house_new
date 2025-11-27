export default function HouseCard({ house }) {
  return (
    <div className="bg-white shadow-md rounded-xl p-5 border border-gray-100 hover:shadow-lg transition-all">
      <h3 className="text-xl font-semibold text-indigo-700 mb-2">
        {house.Locality || "Unknown Locality"}
      </h3>

      <div className="space-y-1 text-gray-700">
        <p><b>Price:</b> ₹ {house.Price_in_Lakhs}</p>
        <p><b>BHK:</b> {house.BHK}</p>
        <p><b>Size:</b> {house.Size_in_SqFt} sqft</p>
        <p><b>Floor:</b> {house.Floor_No} / {house.Total_Floors}</p>
        <p><b>Age:</b> {house.Age_of_Property} years</p>
      </div>

      {/* Amenities */}
      {house.Amenities && (
        <div className="mt-3">
          <span className="text-sm font-medium text-indigo-600">Amenities:</span>
          <p className="text-sm text-gray-600">
            {house.Amenities}
          </p>
        </div>
      )}
    </div>
  );
}
