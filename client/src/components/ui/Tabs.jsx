import { useState } from 'react';
import { motion } from 'framer-motion';

export function Tabs({ tabs, defaultIndex = 0, onChange }) {
  const [active, setActive] = useState(defaultIndex);

  const set = (i) => {
    setActive(i);
    onChange?.(i);
  };

  return (
    <div className="flex flex-col">
      <div className="flex gap-1 p-1 rounded-xl neumo w-fit">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => set(i)}
            className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              active === i ? 'text-slate-900' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {active === i && (
              <motion.span
                layoutId="tab"
                className="absolute inset-0 bg-cyan-500/30 rounded-lg"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              />
            )}
            <span className="relative z-10">{typeof tab === 'string' ? tab : tab.label}</span>
          </button>
        ))}
      </div>
      <div className="mt-4">
        {tabs[active]?.content ?? (typeof tabs[active] === 'object' && tabs[active]?.children)}
      </div>
    </div>
  );
}
