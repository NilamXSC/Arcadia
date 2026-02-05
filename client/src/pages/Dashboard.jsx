import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { dashboardApi } from '../lib/api';
import { BentoGrid, BentoCard } from '../components/layout/BentoGrid';
import { SkeletonCard, Skeleton } from '../components/ui/Skeleton';
import { Carousel } from '../components/ui/Carousel';

export function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    dashboardApi.analytics()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (error) return <div className="p-6 text-red-400">Error: {error}</div>;
  if (loading) {
    return (
      <div className="p-6">
        <BentoGrid>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </BentoGrid>
      </div>
    );
  }

  const alerts = [
    { id: 1, text: `${data?.totalPatients ?? 0} patients in system`, type: 'info' },
    { id: 2, text: `Avg age ${Math.round(data?.avgAge ?? 0)} years`, type: 'info' },
  ];

  return (
    <div className="p-6 space-y-6">
      <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-bold text-white">
        Dashboard
      </motion.h2>
      <BentoGrid>
        <BentoCard title="Total patients" span={1}>
          <p className="text-3xl font-bold text-cyan-400">{data?.totalPatients ?? 0}</p>
        </BentoCard>
        <BentoCard title="Average age" span={1}>
          <p className="text-3xl font-bold text-cyan-400">{Math.round(data?.avgAge ?? 0)} years</p>
        </BentoCard>
        <BentoCard title="By city" span={2}>
          <ul className="space-y-1 text-sm text-slate-400">
            {(data?.byCity ?? []).slice(0, 5).map((c) => (
              <li key={c._id}><span className="text-slate-200">{c._id}</span>: {c.count}</li>
            ))}
          </ul>
        </BentoCard>
        <BentoCard title="By condition" span={2}>
          <ul className="space-y-1 text-sm text-slate-400">
            {(data?.byCondition ?? []).slice(0, 6).map((c) => (
              <li key={c._id}><span className="text-slate-200">{c._id}</span>: {c.count}</li>
            ))}
          </ul>
        </BentoCard>
        <BentoCard title="By gender" span={1}>
          <ul className="space-y-1 text-sm text-slate-400">
            {(data?.byGender ?? []).map((g) => (
              <li key={g._id}>{g._id}: {g.count}</li>
            ))}
          </ul>
        </BentoCard>
        <BentoCard title="Insights carousel" span={2}>
          <Carousel
            items={alerts}
            renderItem={(item) => (
              <div className="rounded-lg glass p-3 text-slate-300">{item.text}</div>
            )}
          />
        </BentoCard>
      </BentoGrid>
    </div>
  );
}
