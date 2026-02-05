import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { aiApi } from '../lib/api';
import { RadioGroup } from '../components/ui/RadioGroup';
import { Skeleton } from '../components/ui/Skeleton';
import { useToast } from '../context/ToastContext';

const AI_MODES = [
  { value: 'patient', label: 'Patient details' },
  { value: 'dashboard', label: 'Dashboard summary' },
  { value: 'general', label: 'General' },
];

export function AIAssistant() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Ask me about any patient (e.g. "Tell me about patient Arjun" or "What condition does Priya have?") or request a dashboard summary.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('patient');
  const bottomRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', content: text }]);
    setLoading(true);
    try {
      const history = messages.slice(-6).map((x) => ({ role: x.role, content: x.content }));
      const { reply } = await aiApi.chat(text, history);
      setMessages((m) => [...m, { role: 'assistant', content: reply }]);
    } catch (err) {
      toast(err.message || 'AI request failed', 'error');
      setMessages((m) => [...m, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 flex flex-col h-[calc(100vh-8rem)]">
      <div className="rounded-2xl glass flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-xl font-bold text-white">AI Assistant</h2>
          <RadioGroup options={AI_MODES} value={mode} onChange={setMode} name="aimode" />
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                  msg.role === 'user' ? 'bg-cyan-500/30 text-white' : 'bg-slate-700/50 text-slate-200'
                }`}
              >
                <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl px-4 py-2 bg-slate-700/50">
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        <form
          className="p-4 border-t border-white/10 flex gap-2"
          onSubmit={(e) => { e.preventDefault(); send(); }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about a patient or dashboard..."
            className="flex-1 px-4 py-3 rounded-xl neumo text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500"
            disabled={loading}
          />
          <button type="submit" disabled={loading} className="neo-btn px-6 py-3 rounded-xl">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
