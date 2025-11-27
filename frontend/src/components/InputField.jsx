export default function InputField({ label, value, onChange, type = "text" }) {
  return (
    <div className="flex flex-col gap-2 mb-4">
      <label className="text-gray-700 font-semibold">{label}</label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        className="
          w-full 
          px-4 py-3 
          rounded-xl 
          bg-white/60 
          border border-gray-300 
          shadow-sm 
          backdrop-blur-md
          outline-none
          transition-all
          focus:ring-2 focus:ring-indigo-400
          focus:border-indigo-500
        "
      />
    </div>
  );
}
