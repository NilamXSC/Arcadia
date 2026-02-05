import { motion } from 'framer-motion';

export function RadioGroup({ options, value, onChange, name = 'radio' }) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((opt) => (
        <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
          <motion.input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className="w-4 h-4 accent-cyan-500"
          />
          <span className="text-sm text-slate-300">{opt.label}</span>
        </label>
      ))}
    </div>
  );
}
