export default function SelectField({ label, value, options, onChange }) {
  return (
    <div>
      <label className="block mb-1 text-gray-700">{label}</label>
      <select
        className="border p-2 rounded w-full"
        value={value}
        onChange={onChange}
      >
        <option value="">Select {label}</option>

        {options?.map((opt, idx) => (
          <option key={idx} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
