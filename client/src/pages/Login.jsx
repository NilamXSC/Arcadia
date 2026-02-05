import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export function Login() {
  const [loading, setLoading] = useState(false);
  const { loginAsGuest } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleGuestLogin = async () => {
    setLoading(true);
    try {
      await loginAsGuest();
      toast('Welcome to Arcadia Health Demo! 🎭', 'success');
      navigate('/dashboard');
    } catch (err) {
      toast(err.message || 'Guest login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl glass p-8"
      >
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🔐</div>
          <h1 className="text-2xl font-bold text-white mb-2">Login Coming Soon!</h1>
          <p className="text-slate-400 text-sm">
            Full authentication features are under development.
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-cyan-900/20 border border-cyan-500/30">
            <p className="text-cyan-300 text-sm mb-2">
              <strong>✨ Try the Demo Instead</strong>
            </p>
            <p className="text-slate-400 text-xs">
              Access the full Arcadia Health experience with sample data, AI assistant, and all features - no login required!
            </p>
          </div>

          <button 
            onClick={handleGuestLogin}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
          >
            {loading ? 'Loading...' : '🎭 Continue as Guest'}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-800 text-slate-400">Or</span>
            </div>
          </div>

          <Link 
            to="/"
            className="block w-full py-3 rounded-xl text-center bg-slate-700 text-slate-300 hover:bg-slate-600 transition-all"
          >
            ← Back to Home
          </Link>
        </div>

        <p className="mt-6 text-center text-slate-400 text-sm">
          No account? <Link to="/register" className="text-cyan-400 hover:underline">Register</Link>
        </p>
      </motion.div>
    </div>
  );
}
