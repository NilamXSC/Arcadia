import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function Breadcrumbs({ items }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-slate-400">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span className="text-slate-600">/</span>}
          {item.to ? (
            <Link to={item.to} className="hover:text-cyan-400 transition-colors">{item.label}</Link>
          ) : (
            <span className="text-slate-200">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
