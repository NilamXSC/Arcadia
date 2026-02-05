const express = require('express');
const { chat } = require('../controllers/aiController');
const { auth } = require('../middleware/auth');

const router = express.Router();
router.use(auth);

router.post('/chat', (req, res, next) => {
  if (req.user && req.user.role === 'guest') {
    const { message } = req.body;
    
    // Simple mock AI responses
    let response = "I'm the Arcadia Health AI assistant. I can help you understand health data in simple terms.";
    
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes('arjun')) {
      response = "Arjun Kumar is a 45-year-old male patient from Mumbai with Type 2 Diabetes and Hypertension. His condition is currently stable with blood pressure at 130/85 mmHg and heart rate of 78 bpm. His latest HbA1c is 7.2%, indicating moderate blood sugar control. He's responding well to medication.";
    } else if (lowerMsg.includes('priya')) {
      response = "Priya Sharma is a 32-year-old female patient from Delhi with Hypertension. She's under monitoring with blood pressure at 145/92 mmHg. Regular monitoring is recommended to manage her condition effectively.";
    } else if (lowerMsg.includes('vikram')) {
      response = "⚠️ Vikram Singh is a 41-year-old male patient from Jaipur with Type 2 Diabetes. His status is CRITICAL with elevated blood pressure at 160/95 mmHg and heart rate of 88 bpm. He requires immediate medical attention.";
    } else if (lowerMsg.includes('rajesh')) {
      response = "Rajesh Patel is a 58-year-old male patient from Ahmedabad with Asthma. His condition is stable, and he's using his inhaler as prescribed. Blood pressure is normal at 125/80 mmHg.";
    } else if (lowerMsg.includes('lakshmi')) {
      response = "Lakshmi Reddy is a 67-year-old female patient from Hyderabad with Arthritis and Osteoporosis. Her condition is stable. Physical therapy has been recommended to help manage her symptoms.";
    } else if (lowerMsg.includes('dashboard') || lowerMsg.includes('summary') || lowerMsg.includes('overview')) {
      response = "📊 Dashboard Summary:\n\n• Total Patients: 11\n• Average Age: 45 years\n• Active Cases: 8\n• Critical Cases: 2 (requires attention)\n\nTop Conditions:\n1. Diabetes Type 2 (4 patients)\n2. Hypertension (3 patients)\n3. Asthma (2 patients)\n\nTop Cities: Mumbai (3), Delhi (2), Ahmedabad (2)\n\nNote: Vikram Singh requires immediate attention due to elevated vital signs.";
    } else if (lowerMsg.includes('patient') && !lowerMsg.includes('about')) {
      response = "I can provide information about any of our 11 patients. Try asking:\n• 'Tell me about Arjun'\n• 'What condition does Priya have?'\n• 'Show me Vikram's status'\n\nOr ask for a 'dashboard summary' to see overall statistics.";
    } else if (lowerMsg.includes('diabetes')) {
      response = "We have 4 patients with Type 2 Diabetes: Arjun Kumar, Vikram Singh, Deepa Nair, and one more. Diabetes management includes monitoring blood sugar levels, medication adherence, and lifestyle modifications. Regular HbA1c testing is important.";
    } else if (lowerMsg.includes('hypertension') || lowerMsg.includes('blood pressure')) {
      response = "We have 3 patients with Hypertension. High blood pressure should be monitored regularly. Normal BP is around 120/80 mmHg. Readings above 140/90 mmHg indicate hypertension and require medical attention.";
    } else if (lowerMsg.includes('help') || lowerMsg.includes('what can you')) {
      response = "I can help you with:\n\n✓ Patient Information - Ask about specific patients by name\n✓ Health Conditions - Learn about diabetes, hypertension, asthma, etc.\n✓ Vital Signs - Understand blood pressure, heart rate, oxygen levels\n✓ Dashboard Analytics - Get overview of all patients\n✓ Medical Terms - Explain health concepts in simple language\n\nTry asking: 'Tell me about Arjun' or 'Show dashboard summary'";
    } else if (lowerMsg.includes('critical') || lowerMsg.includes('emergency')) {
      response = "⚠️ We currently have 2 critical cases:\n\n1. Vikram Singh - Elevated BP (160/95), requires immediate attention\n2. One other patient under close monitoring\n\nCritical cases need prompt medical intervention. Please ensure these patients receive appropriate care.";
    }
    
    return res.json({ reply: response });
  }
  chat(req, res, next);
});

module.exports = router;
