import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const links = [
  { to: '/', label: 'Home', icon: '🏠', external: true },
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/patients', label: 'Patients', icon: '👥' },
  { to: '/ai', label: 'AI Assistant', icon: '🤖' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
];

export function Sidebar() {
  return (
    <aside className="w-56 min-h-screen glass border-r border-white/10 flex flex-col py-4">
      <div className="px-4 mb-6 flex items-center gap-3">
        <img 
          src="/logo.svg" 
          alt="Arcadia Health Logo" 
          className="w-10 h-10 drop-shadow-lg"
        />
        <div>
          <div className="text-lg font-bold text-white">Arcadia</div>
          <div className="text-xs text-slate-400">Health Platform</div>
        </div>
      </div>
      <nav className="flex-1 flex flex-col gap-1 px-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive && !link.external ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`
            }
          >
            <span>{link.icon}</span>
            <span className="text-sm font-medium">{link.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="px-4 py-3 border-t border-white/10">
        <div className="text-xs text-slate-500">
          <div className="flex items-center gap-1 mb-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>System Online</span>
          </div>
          <div>47 Cities Connected</div>
        </div>
      </div>
    </aside>
  );
}
