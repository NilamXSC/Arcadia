const Patient = require('../models/Patient');

let knowledgeBase = [];
let lastLoaded = null;

function normalize(str) {
  return String(str || '')
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(str) {
  return normalize(str).split(' ').filter(Boolean);
}

function buildPatientContext(p) {
  const parts = [
    p.name,
    p.age,
    p.gender,
    p.city,
    p.hospital,
    ...(p.conditions || []),
    p.notes,
  ];
  (p.reports || []).forEach((r) => {
    parts.push(r.title, r.summary, ...(r.findings || []));
  });
  (p.vitals || []).slice(-3).forEach((v) => {
    if (v.bloodPressureSystolic) parts.push(`BP ${v.bloodPressureSystolic}/${v.bloodPressureDiastolic}`);
    if (v.heartRate) parts.push(`HR ${v.heartRate}`);
    if (v.temperature) parts.push(`Temp ${v.temperature}`);
    if (v.oxygenSaturation) parts.push(`SpO2 ${v.oxygenSaturation}`);
  });
  return { id: p._id.toString(), name: p.name, text: parts.join(' '), patient: p };
}

async function loadKnowledgeBase() {
  if (lastLoaded && Date.now() - lastLoaded < 60000) return knowledgeBase;
  const patients = await Patient.find().lean();
  knowledgeBase = patients.map(buildPatientContext);
  lastLoaded = Date.now();
  return knowledgeBase;
}

function scoreMatch(queryTokens, context) {
  const text = normalize(context.text);
  let score = 0;
  for (const t of queryTokens) {
    if (text.includes(t)) score += 1;
    if (normalize(context.name).includes(t)) score += 3;
    if (context.patient.conditions && context.patient.conditions.some((c) => normalize(c).includes(t))) score += 2;
    if (normalize(context.patient.city).includes(t)) score += 1;
    if (normalize(context.patient.hospital).includes(t)) score += 1;
  }
  return score;
}

function extractPatientName(query) {
  const q = normalize(query);
  const patterns = [
    /(?:patient|about|details?|info|tell me about)\s+([a-z]+(?:\s+[a-z]+)?)/i,
    /(?:who is|who's)\s+([a-z]+(?:\s+[a-z]+)?)/i,
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/,
  ];
  for (const re of patterns) {
    const m = query.match(re);
    if (m && m[1]) return normalize(m[1]).replace(/\s+/g, ' ');
  }
  return null;
}

function formatPatientSummary(p) {
  const lines = [
    `**${p.name}** (${p.age} years, ${p.gender})`,
    `City: ${p.city} | Hospital: ${p.hospital}`,
  ];
  if (p.conditions && p.conditions.length) {
    lines.push(`Conditions: ${p.conditions.join(', ')}`);
  }
  if (p.vitals && p.vitals.length) {
    const v = p.vitals[p.vitals.length - 1];
    const vParts = [];
    if (v.bloodPressureSystolic != null) vParts.push(`BP ${v.bloodPressureSystolic}/${v.bloodPressureDiastolic || '--'}`);
    if (v.heartRate != null) vParts.push(`HR ${v.heartRate}`);
    if (v.temperature != null) vParts.push(`Temp ${v.temperature}°C`);
    if (v.oxygenSaturation != null) vParts.push(`SpO2 ${v.oxygenSaturation}%`);
    if (vParts.length) lines.push(`Latest vitals: ${vParts.join(', ')}`);
  }
  if (p.reports && p.reports.length) {
    lines.push(`Reports: ${p.reports.length} on file (e.g. ${p.reports[0]?.title || 'N/A'})`);
  }
  if (p.notes) lines.push(`Notes: ${p.notes}`);
  return lines.join('\n');
}

function formatDashboardSummary(analytics) {
  const lines = [
    `Total patients: ${analytics.totalPatients}`,
    `Average age: ${Math.round(analytics.avgAge || 0)} years`,
  ];
  if (analytics.byCity && analytics.byCity.length) {
    lines.push(`Top cities: ${analytics.byCity.slice(0, 5).map((c) => `${c._id} (${c.count})`).join(', ')}`);
  }
  if (analytics.byCondition && analytics.byCondition.length) {
    lines.push(`Common conditions: ${analytics.byCondition.slice(0, 5).map((c) => `${c._id} (${c.count})`).join(', ')}`);
  }
  return lines.join('\n');
}

async function queryAI(userMessage, conversationHistory = [], dashboardSnapshot = null) {
  await loadKnowledgeBase();
  const queryTokens = tokenize(userMessage);
  const nameHint = extractPatientName(userMessage);
  const q = normalize(userMessage);

  const isAboutPatient = /patient|person|who|details?|condition|diagnosis|vitals?|report|arjun|priya|rahul|sneha|kavita|vijay|anita|raj|meera|suresh|deepa/i.test(q);
  const isAboutDashboard = /dashboard|summary|trend|total|how many|overview|city|cities|condition|health trend/i.test(q);

  if (isAboutPatient) {
    let best = null;
    let bestScore = 0;
    for (const ctx of knowledgeBase) {
      let s = scoreMatch(queryTokens, ctx);
      if (nameHint && normalize(ctx.name).includes(nameHint)) s += 5;
      if (s > bestScore) {
        bestScore = s;
        best = ctx;
      }
    }
    if (best && bestScore > 0) {
      const p = best.patient;
      const summary = formatPatientSummary(p);
      if (/condition|diagnosis|have|suffer|problem/i.test(q)) {
        const conds = (p.conditions && p.conditions.length) ? p.conditions.join(', ') : 'No conditions on file.';
        return {
          reply: `${p.name} has the following conditions on record: ${conds}. This is for educational context only—not a diagnosis.`,
          sources: [{ type: 'patient', id: p._id, name: p.name }],
        };
      }
      return {
        reply: `Here are the details for **${p.name}**:\n\n${summary}\n\n*Information is from records only; not medical advice.*`,
        sources: [{ type: 'patient', id: p._id, name: p.name }],
      };
    }
    return {
      reply: "I couldn't find a matching patient in the current data. Please check the name or try: \"List patients\" or \"Dashboard summary\".",
      sources: [],
    };
  }

  if (isAboutDashboard && dashboardSnapshot) {
    const summary = formatDashboardSummary(dashboardSnapshot);
    return {
      reply: `**Dashboard summary:**\n\n${summary}\n\n*Data is from the last loaded snapshot.*`,
      sources: [{ type: 'dashboard' }],
    };
  }

  if (/list|all patients|show patients|who are the patients/i.test(q)) {
    const names = knowledgeBase.slice(0, 15).map((k) => k.name).join(', ');
    return {
      reply: `Patients in the system (sample): ${names}.${knowledgeBase.length > 15 ? ' ...' : ''} Use "Tell me about [name]" for details.`,
      sources: [],
    };
  }

  return {
    reply: "I can answer questions about specific patients (e.g. \"Tell me about patient Arjun\" or \"What condition does Priya have?\") and dashboard summaries (e.g. \"Summarize health trends\"). Please ask about a patient name or the dashboard.",
    sources: [],
  };
}

module.exports = { queryAI, loadKnowledgeBase };
