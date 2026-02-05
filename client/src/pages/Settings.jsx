import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';

export function Settings() {
  const { user } = useAuth();
  return (
    <div className="p-6 space-y-6">
      <Breadcrumbs items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Settings' }]} />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl glass p-6 max-w-lg"
      >
        <h2 className="text-2xl font-bold text-white mb-4">Settings</h2>
        <div className="space-y-4 text-slate-300">
          <div>
            <label className="text-sm text-slate-500">Name</label>
            <p className="font-medium">{user?.name}</p>
          </div>
          <div>
            <label className="text-sm text-slate-500">Email</label>
            <p className="font-medium">{user?.email}</p>
          </div>
          <div>
            <label className="text-sm text-slate-500">Role</label>
            <p className="font-medium">{user?.role ?? 'viewer'}</p>
          </div>
        </div>
        <p className="mt-6 text-sm text-slate-500">More settings (theme, notifications) can be added here.</p>
      </motion.div>
    </div>
  );
}
