import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

export function Navbar({ title }) {
  const { user, logout } = useAuth();
  const isGuest = user?.role === 'guest';
  
  return (
    <>
      {isGuest && (
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-2 px-4 text-sm">
          🎭 <strong>Guest Mode</strong> - You're viewing demo data. No database required!
        </div>
      )}
      <header className="h-14 glass border-b border-white/10 flex items-center justify-between px-6">
        <h1 className="text-lg font-semibold text-slate-200">{title}</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-400">
            {isGuest ? '👤 Guest User' : (user?.name ?? user?.email)}
          </span>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={logout}
            className="text-sm px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300"
          >
            Logout
          </motion.button>
        </div>
      </header>
    </>
  );
}
