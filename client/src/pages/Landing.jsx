import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

// Live Data
const cityHealthTrend = [
  { month: 'Jan', index: 72, patients: 8200 },
  { month: 'Feb', index: 75, patients: 9100 },
  { month: 'Mar', index: 78, patients: 9800 },
  { month: 'Apr', index: 82, patients: 10500 },
  { month: 'May', index: 85, patients: 11200 },
  { month: 'Jun', index: 88, patients: 12430 }
];

const hospitalLoad = [
  { hospital: 'Apollo', load: 85, capacity: 100 },
  { hospital: 'Fortis', load: 72, capacity: 100 },
  { hospital: 'AIIMS', load: 95, capacity: 100 },
  { hospital: 'Max', load: 68, capacity: 100 }
];

const resourceAllocation = [
  { name: 'Emergency', value: 35, color: '#ef4444' },
  { name: 'ICU', value: 25, color: '#f59e0b' },
  { name: 'General', value: 40, color: '#10b981' }
];

const realtimeMetrics = [
  { time: '00:00', active: 245, critical: 12 },
  { time: '04:00', active: 198, critical: 8 },
  { time: '08:00', active: 312, critical: 15 },
  { time: '12:00', active: 428, critical: 22 },
  { time: '16:00', active: 385, critical: 18 },
  { time: '20:00', active: 356, critical: 14 },
  { time: '24:00', active: 289, critical: 11 }
];

export function Landing() {
  const [loading, setLoading] = useState(false);
  const [aiTyping, setAiTyping] = useState('');
  const [showCharts, setShowCharts] = useState(false);
  const [counters, setCounters] = useState({ cities: 0, patients: 0, predictions: 0 });
  
  const { loginAsGuest } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  // AI Typing Animation
  useEffect(() => {
    const text = "Analyzing 12,430 patients across 47 cities... Detecting 3 critical cases requiring immediate attention. Health index: 88% (↑5% from last month). Predictive model suggests optimal resource allocation for next 48 hours.";
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setAiTyping(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Counter Animation
  useEffect(() => {
    const targets = { cities: 47, patients: 12430, predictions: 1847293 };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setCounters({
        cities: Math.floor(targets.cities * progress),
        patients: Math.floor(targets.patients * progress),
        predictions: Math.floor(targets.predictions * progress)
      });
      if (step >= steps) clearInterval(timer);
    }, interval);
    
    return () => clearInterval(timer);
  }, []);

  // Show charts after delay
  useEffect(() => {
    const timer = setTimeout(() => setShowCharts(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleGuestSignIn = async () => {
    setLoading(true);
    try {
      await loginAsGuest();
      toast('Welcome to Arcadia Health Platform 🚀', 'success');
      navigate('/dashboard');
    } catch (err) {
      toast(err.message || 'Access failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Hero Section with AI-Generated Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* AI-Generated Smart City Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 opacity-95"></div>
          <img 
            src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=1920&h=1080&fit=crop&q=80" 
            alt="Smart City Healthcare"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50"></div>
          
          {/* Data Overlay Grid */}
          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-12 h-full">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="border-r border-cyan-500/20"></div>
              ))}
            </div>
          </div>
          
          {/* Floating Data Points */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-cyan-400/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </div>

        {/* Floating Nav */}
        <motion.nav 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute top-0 left-0 right-0 z-50 p-6"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/logo.svg" 
                alt="Arcadia Health Logo" 
                className="w-10 h-10 drop-shadow-lg"
              />
              <div>
                <div className="text-xl font-bold">Arcadia Health</div>
                <div className="text-xs text-slate-400">AI Healthcare Platform</div>
              </div>
            </div>
            <button
              onClick={handleGuestSignIn}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-600/20 backdrop-blur-lg border border-cyan-500/30 hover:border-cyan-500/50 transition-all"
            >
              {loading ? 'Initializing...' : 'Launch Platform →'}
            </button>
          </div>
        </motion.nav>

        {/* Hero Content */}
        <motion.div style={{ y: heroY }} className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full glass border border-cyan-500/30"
          >
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-cyan-400 text-sm font-medium">Live • 47 Cities Connected</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight"
          >
            AI-Powered Healthcare
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
              Infrastructure
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Real-time monitoring of 12,430+ patients. Predictive analytics. 
            Instant insights. Built for rural and semi-urban India.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-4 mb-16"
          >
            <button
              onClick={handleGuestSignIn}
              disabled={loading}
              className="group px-10 py-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Initializing Platform...' : 'Access Demo Platform'}
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </motion.div>

          {/* Real-time Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-900/40 to-cyan-950/40 backdrop-blur-xl border border-cyan-500/20 p-6"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl"></div>
              <div className="relative">
                <div className="text-5xl font-black text-cyan-400 mb-2">{counters.patients.toLocaleString()}</div>
                <div className="text-sm text-slate-300 font-medium">Patients Monitored</div>
                <div className="text-xs text-green-400 mt-2 flex items-center gap-1">
                  <span>↑ 23%</span>
                  <span className="text-slate-500">vs last month</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/40 to-purple-950/40 backdrop-blur-xl border border-purple-500/20 p-6"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
              <div className="relative">
                <div className="text-5xl font-black text-purple-400 mb-2">88%</div>
                <div className="text-sm text-slate-300 font-medium">Health Index Score</div>
                <div className="text-xs text-green-400 mt-2 flex items-center gap-1">
                  <span>↑ 5pts</span>
                  <span className="text-slate-500">from last month</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-900/40 to-pink-950/40 backdrop-blur-xl border border-pink-500/20 p-6"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl"></div>
              <div className="relative">
                <div className="text-5xl font-black text-pink-400 mb-2">{counters.cities}</div>
                <div className="text-sm text-slate-300 font-medium">Connected Cities</div>
                <div className="text-xs text-cyan-400 mt-2 flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Real-time sync</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Live Data Dashboard Section */}
      <section className="relative py-24 px-6 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <span className="text-cyan-400 text-sm font-medium">Live Data Streams</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">Real-Time Intelligence</h2>
            <p className="text-xl text-slate-400">Monitoring health metrics across 47 cities, 24/7</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Patient Activity Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 rounded-3xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-slate-700/50 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white">Patient Activity (24h)</h3>
                  <p className="text-sm text-slate-400">Active consultations and critical cases</p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-cyan-400 rounded-sm"></div>
                    <span className="text-slate-400">Active</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-400 rounded-sm"></div>
                    <span className="text-slate-400">Critical</span>
                  </div>
                </div>
              </div>
              {showCharts ? (
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={realtimeMetrics}>
                    <defs>
                      <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="time" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #334155', 
                        borderRadius: '12px',
                        padding: '12px'
                      }} 
                    />
                    <Area type="monotone" dataKey="active" stroke="#06b6d4" fillOpacity={1} fill="url(#colorActive)" strokeWidth={2} />
                    <Area type="monotone" dataKey="critical" stroke="#ef4444" fillOpacity={1} fill="url(#colorCritical)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[280px] flex items-center justify-center">
                  <div className="text-slate-600 animate-pulse">Loading real-time data...</div>
                </div>
              )}
            </motion.div>

            {/* Resource Allocation */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="rounded-3xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-slate-700/50 p-6"
            >
              <h3 className="text-lg font-bold mb-6">Resource Distribution</h3>
              {showCharts ? (
                <>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={resourceAllocation}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {resourceAllocation.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #334155', 
                          borderRadius: '8px' 
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-6 space-y-3">
                    {resourceAllocation.map((item) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }}></div>
                          <span className="text-sm font-medium">{item.name}</span>
                        </div>
                        <span className="text-lg font-bold">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-[280px] flex items-center justify-center">
                  <div className="text-slate-600 animate-pulse">Loading data...</div>
                </div>
              )}
            </motion.div>

            {/* Hospital Capacity */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-3 rounded-3xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-slate-700/50 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold">Hospital Capacity Utilization</h3>
                  <p className="text-sm text-slate-400">Current load across major facilities</p>
                </div>
                <span className="text-xs text-green-400 flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  Updated 2 min ago
                </span>
              </div>
              {showCharts ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={hospitalLoad}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="hospital" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #334155', 
                        borderRadius: '12px',
                        padding: '12px'
                      }} 
                    />
                    <Bar dataKey="load" fill="#a855f7" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[220px] flex items-center justify-center">
                  <div className="text-slate-600 animate-pulse">Loading data...</div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* AI Analysis Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20">
              <span className="text-purple-400 text-sm font-medium">🤖 AI Engine</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">AI in Action</h2>
            <p className="text-xl text-slate-400">Real-time analysis of health data across the network</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-cyan-500/20 p-8 shadow-2xl shadow-cyan-500/10"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-auto text-xs text-slate-500 font-mono">arcadia-ai-engine v2.1.0</span>
            </div>
            <div className="bg-slate-950 rounded-2xl p-6 font-mono text-sm border border-slate-800">
              <div className="text-cyan-400 mb-3">$ arcadia analyze --realtime --cities=47</div>
              <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                {aiTyping}
                <span className="inline-block w-2 h-5 bg-cyan-400 ml-1 animate-pulse"></span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Platform Capabilities */}
      <section className="relative py-24 px-6 bg-gradient-to-b from-transparent to-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">Enterprise Capabilities</h2>
            <p className="text-xl text-slate-400">Production-grade infrastructure for smart healthcare</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🧠', title: 'AI Intelligence', desc: 'Deep learning models trained on 10M+ health records', gradient: 'from-cyan-500/10 to-cyan-600/10', border: 'border-cyan-500/20' },
              { icon: '🏙️', title: 'Smart Infrastructure', desc: 'Real-time monitoring across 47 connected cities', gradient: 'from-purple-500/10 to-purple-600/10', border: 'border-purple-500/20' },
              { icon: '📊', title: 'Predictive Analytics', desc: 'Forecast health trends 48 hours in advance', gradient: 'from-pink-500/10 to-pink-600/10', border: 'border-pink-500/20' },
              { icon: '👥', title: 'Citizen-Centric', desc: 'Simple language explanations for all users', gradient: 'from-green-500/10 to-green-600/10', border: 'border-green-500/20' },
              { icon: '🔒', title: 'Secure Data Layer', desc: 'AES-256 encryption, HIPAA compliant', gradient: 'from-red-500/10 to-red-600/10', border: 'border-red-500/20' },
              { icon: '⚡', title: 'Scalable Architecture', desc: 'Handle 100K+ concurrent users effortlessly', gradient: 'from-yellow-500/10 to-yellow-600/10', border: 'border-yellow-500/20' }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${feature.gradient} backdrop-blur-xl border ${feature.border} p-8 cursor-pointer group`}
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Metrics */}
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">Trusted at Scale</h2>
            <p className="text-xl text-slate-400">Real metrics from our demo environment</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-900/40 to-cyan-950/40 backdrop-blur-xl border border-cyan-500/20 p-10 text-center"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"></div>
              <div className="relative">
                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-600 mb-4">
                  {counters.cities}
                </div>
                <div className="text-slate-300 font-medium">Cities Connected</div>
                <div className="text-xs text-slate-500 mt-2">Across India</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900/40 to-purple-950/40 backdrop-blur-xl border border-purple-500/20 p-10 text-center"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
              <div className="relative">
                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
                  {counters.patients.toLocaleString()}
                </div>
                <div className="text-slate-300 font-medium">Patients Monitored</div>
                <div className="text-xs text-slate-500 mt-2">Daily active users</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-900/40 to-pink-950/40 backdrop-blur-xl border border-pink-500/20 p-10 text-center"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl"></div>
              <div className="relative">
                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-red-400 mb-4">
                  {counters.predictions.toLocaleString()}
                </div>
                <div className="text-slate-300 font-medium">AI Predictions</div>
                <div className="text-xs text-slate-500 mt-2">Generated to date</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-black mb-8 leading-tight">
              Transform Healthcare with
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                AI-Powered Intelligence
              </span>
            </h2>
            <p className="text-xl text-slate-400 mb-12">
              Join 47 cities already revolutionizing healthcare delivery
            </p>
            <motion.button
              onClick={handleGuestSignIn}
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-2xl font-black shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Launching Platform...' : 'Launch Demo Platform →'}
            </motion.button>
            <p className="mt-6 text-sm text-slate-500">
              Full demo access • No sign-up required • 11 sample patients
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 px-6 bg-slate-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.svg" 
              alt="Arcadia Health Logo" 
              className="w-8 h-8 drop-shadow-lg"
            />
            <div>
              <div className="font-bold">Arcadia Health</div>
              <div className="text-xs text-slate-500">AI Healthcare Platform</div>
            </div>
          </div>
          <div className="text-sm text-slate-500">
            © 2026 Arcadia Health. Built for rural and semi-urban India.
          </div>
        </div>
      </footer>
    </div>
  );
}
