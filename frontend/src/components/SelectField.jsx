export default function SelectField({ label, options, value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-gray-700 font-semibold">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="select-field"
      >
        <option value="">Select...</option>
        {options?.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
