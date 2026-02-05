import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { patientsApi } from '../lib/api';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Accordion } from '../components/ui/Accordion';
import { Skeleton } from '../components/ui/Skeleton';
import { useToast } from '../context/ToastContext';

export function PatientDetail() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    patientsApi.get(id)
      .then(setPatient)
      .catch((e) => toast(e.message, 'error'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }
  if (!patient) return <div className="p-6 text-red-400">Patient not found</div>;

  const v = patient.vitals?.[patient.vitals.length - 1];
  const accordionItems = [
    {
      title: 'Conditions',
      content: (patient.conditions?.length ? patient.conditions.join(', ') : 'None on file') + (patient.notes ? ` · ${patient.notes}` : ''),
    },
    {
      title: 'Latest vitals',
      content: v
        ? `BP ${v.bloodPressureSystolic ?? '--'}/${v.bloodPressureDiastolic ?? '--'}, HR ${v.heartRate ?? '--'}, Temp ${v.temperature ?? '--'}°C, SpO2 ${v.oxygenSaturation ?? '--'}%`
        : 'No vitals on file',
    },
    {
      title: 'Reports',
      content: (patient.reports?.length ? patient.reports.map((r) => `${r.title}: ${r.summary}`).join(' · ') : 'No reports'),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <Breadcrumbs items={[
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'Patients', to: '/patients' },
        { label: patient.name },
      ]} />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl glass p-6"
      >
        <h2 className="text-2xl font-bold text-white mb-2">{patient.name}</h2>
        <p className="text-slate-400">
          {patient.age} years · {patient.gender} · {patient.city} · {patient.hospital}
        </p>
        <div className="mt-4">
          <Accordion items={accordionItems} />
        </div>
        <Link to="/patients" className="inline-block mt-4 text-cyan-400 hover:underline">← Back to list</Link>
      </motion.div>
    </div>
  );
}
