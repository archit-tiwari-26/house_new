export default function InputField({ label, value, onChange, type="text" }) {
  return (
    <div className="flex flex-col mb-4">
      <label className="mb-1 font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="px-3 py-2 border rounded-lg shadow-sm focus:ring focus:ring-indigo-200"
      />
    </div>
  );
}
