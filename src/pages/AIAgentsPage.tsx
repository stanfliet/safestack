import { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { MessageSquare, Bot, Shield, AlertTriangle, FileText, ClipboardCheck, Users, BarChart3, Send, Loader2, Sparkles } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  icon: any;
  color: string;
  desc: string;
  systemPrompt: string;
}

const agents: Agent[] = [
  { id: 'safety', name: 'Safety Advisor', icon: Shield, color: 'bg-blue-500', desc: 'OHS compliance, regulations, safety plans',
    systemPrompt: 'You are a South African OHS safety advisor. Provide expert advice on OHSA, Construction Regulations 2014, and general safety compliance.' },
  { id: 'risk', name: 'Risk Analyst', icon: AlertTriangle, color: 'bg-amber-500', desc: 'Risk assessments, hazard identification, controls',
    systemPrompt: 'You are a risk assessment specialist. Help identify hazards, evaluate risks, and recommend control measures for construction sites.' },
  { id: 'legal', name: 'Legal Advisor', icon: FileText, color: 'bg-purple-500', desc: 'Contracts, liability, regulatory requirements',
    systemPrompt: 'You are a construction law specialist. Advise on SA construction contracts, liability, and OHS legal requirements.' },
  { id: 'inspector', name: 'Inspector', icon: ClipboardCheck, color: 'bg-green-500', desc: 'Inspection checklists, audit preparation',
    systemPrompt: 'You are an experienced construction inspector. Help create inspection checklists and prepare for audits.' },
  { id: 'trainer', name: 'Trainer', icon: Users, color: 'bg-teal-500', desc: 'Training content, induction materials',
    systemPrompt: 'You are an OHS training specialist. Create training content, induction materials, and competency assessments.' },
  { id: 'analyst', name: 'Analytics', icon: BarChart3, color: 'bg-indigo-500', desc: 'Data analysis, trend identification, reporting',
    systemPrompt: 'You are a construction data analyst. Help interpret safety data, identify trends, and generate reports.' },
  { id: 'general', name: 'General Assistant', icon: Bot, color: 'bg-surface-500', desc: 'General SAFESTACK platform help',
    systemPrompt: 'You are a helpful assistant for the SAFESTACK OHS platform. Help users with general questions about the platform.' },
];

export default function AIAgentsPage() {
  const { user } = useAuth();
  const [selectedAgent, setSelectedAgent] = useState<Agent>(agents[6]);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [processing, setProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleSelectAgent(agent: Agent) {
    setSelectedAgent(agent);
    setMessages([{ role: 'assistant', content: `Hello! I'm the **${agent.name}**. ${agent.desc}. How can I help you today?` }]);
  }

  async function handleSend() {
    if (!input.trim() || processing) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setProcessing(true);

    const contextPrompt = `${selectedAgent.systemPrompt}\n\nUser question: ${userMsg}\n\nProvide a helpful, concise response. Include practical advice, regulations (if relevant), and actionable recommendations.`;
    setMessages(prev => [...prev, { role: 'assistant', content: '...' }]);

    try {
      const { data, error } = await supabase.functions.invoke('generate-ai-response', {
        body: { prompt: contextPrompt }
      }).catch(() => ({ data: null, error: new Error('AI function not deployed') }));

      if (error || !data?.response) {
        const fallbackResponses: Record<string, string> = {
          safety: "For comprehensive OHS advice, consult the OHSA and Construction Regulations 2014. Key requirements include:\n\n- Appoint a competent H&S agent for projects over R13m\n- Conduct risk assessments before work begins\n- Provide fall protection above 2m\n- Maintain safety files on site\n\nWould you like specific guidance on any of these areas?",
          risk: "A proper risk assessment should:\n\n1. Identify all hazards per work area\n2. Assess likelihood (1-5) and severity (1-5)\n3. Calculate risk score (L x S)\n4. Implement hierarchy of controls\n5. Review and update regularly\n\nWhich specific hazard or activity would you like to assess?",
          legal: "Key legal considerations for SA construction:\n\n- Ensure compliance with OHSA Section 8-10\n- Maintain valid contractor agreements\n- Verify insurance and COID registration\n- Document all H&S communications\n\nPlease consult a legal professional for specific advice on your situation.",
          inspector: "An effective inspection covers:\n\n- Housekeeping and access\n- Fire safety equipment\n- PPE compliance\n- Electrical safety\n- Scaffolding and ladders\n- Plant and equipment\n- Hazardous substances\n\nWould you like a detailed checklist for a specific area?",
          trainer: "Effective OHS training should include:\n\n- Induction for all new workers\n- Task-specific training\n- Emergency procedures\n- Toolbox talks (weekly minimum)\n- Competency assessments\n- Refresher training annually\n\nWhat type of training material do you need?",
          analyst: "To analyze your safety data effectively:\n\n- Track leading indicators (inspections, training)\n- Monitor lagging indicators (incidents, injuries)\n- Compare against industry benchmarks\n- Identify recurring patterns\n- Generate monthly trend reports\n\nWhat data would you like to analyze?",
          general: "Welcome to SAFESTACK! I can help you with:\n\n- Navigating the platform\n- Understanding features\n- Document generation\n- Compliance tracking\n- Best practices\n\nWhat would you like help with?",
        };
        const fallback = fallbackResponses[selectedAgent.id] || fallbackResponses.general;
        setMessages(prev => [...prev.slice(0, -1), { role: 'assistant', content: fallback }]);
      } else {
        setMessages(prev => [...prev.slice(0, -1), { role: 'assistant', content: data.response }]);
      }
    } catch {
      setMessages(prev => [...prev.slice(0, -1), { role: 'assistant', content: "I apologize, but I'm having trouble connecting. Please try again or check that the AI function is deployed." }]);
    }
    setProcessing(false);
  }

  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">AI Agents</h1><p className="text-surface-500 mt-1">Expert agents to assist with OHS management</p></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-2">
          {agents.map(a => (
            <button key={a.id} onClick={() => handleSelectAgent(a)}
              className={`w-full p-3 rounded-xl border text-left transition-all ${selectedAgent.id === a.id ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' : 'border-surface-200 hover:border-primary-300 hover:bg-surface-50'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 ${a.color} rounded-lg flex items-center justify-center`}><a.icon className="h-5 w-5 text-white" /></div>
                <div><p className="text-sm font-medium">{a.name}</p><p className="text-xs text-surface-500">{a.desc}</p></div>
              </div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 card flex flex-col h-[65vh]">
          <div className="card-header flex items-center gap-3 border-b">
            <div className={`w-9 h-9 ${selectedAgent.color} rounded-lg flex items-center justify-center`}><selectedAgent.icon className="h-5 w-5 text-white" /></div>
            <div><h2 className="section-title">{selectedAgent.name}</h2><p className="text-xs text-surface-500">{selectedAgent.desc}</p></div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-12 text-surface-400">
                <MessageSquare className="h-12 w-12 mx-auto mb-3 text-surface-300" />
                <p className="font-medium">Select an agent to start chatting</p>
                <p className="text-sm mt-1">Each agent specializes in different areas of OHS management</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'assistant' && (
                  <div className={`w-8 h-8 ${selectedAgent.color} rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <selectedAgent.icon className="h-4 w-4 text-white" />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${msg.role === 'user' ? 'bg-primary-600 text-white' : 'bg-surface-100 text-surface-700'}`}>
                  {msg.content === '...' ? <Loader2 className="h-4 w-4 animate-spin" /> : <div className="whitespace-pre-wrap">{msg.content}</div>}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="card-body border-t">
            <div className="flex gap-2">
              <input className="input flex-1" value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder={`Ask the ${selectedAgent.name}...`} disabled={processing} />
              <button onClick={handleSend} disabled={!input.trim() || processing} className="btn-primary px-4">
                {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
