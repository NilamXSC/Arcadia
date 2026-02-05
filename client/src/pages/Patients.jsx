import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { patientsApi } from '../lib/api';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { SkeletonTable } from '../components/ui/Skeleton';
import { useToast } from '../context/ToastContext';

export function Patients() {
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);
    patientsApi.list({ page, limit: 20, search: search || undefined })
      .then((res) => {
        setList(res.patients);
        setTotal(res.total);
      })
      .catch((e) => toast(e.message, 'error'))
      .finally(() => setLoading(false));
  }, [page, search]);

  return (
    <div className="p-6 space-y-4">
      <Breadcrumbs items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Patients' }]} />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-white">Patients</h2>
        <input
          type="search"
          placeholder="Search..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="px-4 py-2 rounded-xl neumo text-white w-64"
        />
      </div>
      <div className="rounded-xl glass overflow-hidden">
        {loading ? (
          <div className="p-4"><SkeletonTable rows={10} /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-slate-400 text-sm">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Age</th>
                  <th className="p-3">City</th>
                  <th className="p-3">Hospital</th>
                  <th className="p-3">Conditions</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                {list.map((p) => (
                  <tr key={p._id} className="border-t border-white/5 hover:bg-white/5">
                    <td className="p-3 font-medium">{p.name}</td>
                    <td className="p-3">{p.age}</td>
                    <td className="p-3">{p.city}</td>
                    <td className="p-3">{p.hospital}</td>
                    <td className="p-3 text-sm">{(p.conditions || []).slice(0, 2).join(', ')}</td>
                    <td className="p-3">
                      <Link to={`/patients/${p._id}`} className="text-cyan-400 hover:underline text-sm">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {total > 0 && (
          <div className="flex items-center justify-between p-3 border-t border-white/5 text-sm text-slate-400">
            <span>Total: {total}</span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 rounded bg-slate-700 disabled:opacity-50"
              >
                Prev
              </button>
              <span>Page {page}</span>
              <button
                disabled={list.length < 20 || page * 20 >= total}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 rounded bg-slate-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
