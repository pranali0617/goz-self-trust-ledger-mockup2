import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { 
  Send, 
  Sparkles,
  Bot,
  User,
  ArrowLeft,
  RefreshCw,
  MessageCircle,
  Activity,
  ShieldAlert,
  Cpu,
  Zap,
  ShieldCheck,
  Fingerprint,
  BookOpen
} from 'lucide-react';
import { GozService, Message } from './services/GozService';

const PATHWAYS = [
  { id: 'audit', title: "The Life Audit", icon: <Activity size={20} />, description: "Find the leak so vague stress turns into a solvable problem.", color: "bg-blue-50 text-blue-600" },
  { id: 'payoff', title: "The Hidden Payoff", icon: <ShieldAlert size={20} />, description: "Find the safety system that keeps sabotage alive.", color: "bg-orange-50 text-orange-600" },
  { id: 'simulator', title: "The Neural Simulator", icon: <Zap size={20} />, description: "Practice the feared talk before the pressure hits.", color: "bg-yellow-50 text-yellow-600" },
  { id: 'tracer', title: "The Trigger Tracer", icon: <Fingerprint size={20} />, description: "Trace the old script behind today's reaction.", color: "bg-red-50 text-red-600" },
  { id: 'code', title: "The Personal Code", icon: <Cpu size={20} />, description: "Extract the rules your past wins and regrets taught you.", color: "bg-purple-50 text-purple-600" },
];

export default function App() {
  const [view, setView] = useState<'dashboard' | 'chat'>('dashboard');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const gozRef = useRef<GozService | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gozRef.current = new GozService();
    const initial = gozRef.current.getInitialMessage();
    setMessages([initial]);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text?: string) => {
    const messageToSend = text || input.trim();
    if (!messageToSend || !gozRef.current || isTyping) return;

    if (!text) setInput('');
    
    setMessages(prev => [...prev, { role: 'user', text: messageToSend }]);
    setIsTyping(true);

    const response = await gozRef.current.sendMessage(messageToSend);
    
    setMessages(prev => [...prev, response]);
    setIsTyping(false);
  };

  const resetChat = () => {
    if (gozRef.current) {
      const initial = gozRef.current.getInitialMessage();
      setMessages([initial]);
    }
  };

  const startPathway = (pathwayTitle: string) => {
    setView('chat');
    handleSend(`I'd like to start with ${pathwayTitle}`);
  };

  return (
    <div className="flex h-screen bg-goz-bg text-goz-text overflow-hidden font-sans">
      {/* Main Content */}
      <main className="flex-1 flex flex-col relative max-w-3xl mx-auto w-full">
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-6 bg-goz-bg/80 backdrop-blur-md z-20">
          <div className="flex items-center gap-3">
            {view === 'chat' ? (
              <button 
                onClick={() => setView('dashboard')}
                className="p-2 -ml-2 text-goz-muted hover:text-goz-sage transition-colors rounded-xl hover:bg-goz-accent"
              >
                <ArrowLeft size={20} />
              </button>
            ) : (
              <div className="w-10 h-10 bg-goz-sage rounded-2xl flex items-center justify-center text-white shadow-lg animate-float">
                <Sparkles size={20} />
              </div>
            )}
            <div>
              <h1 className="font-serif font-bold text-lg tracking-tight sage-text">Goz Framework</h1>
              <p className="text-[10px] text-goz-muted font-bold uppercase tracking-[0.2em]">
                {view === 'dashboard' ? 'Self-Trust Dashboard' : 'Guided Reflection Session'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {view === 'chat' && (
              <button 
                onClick={resetChat}
                className="p-2 text-goz-muted hover:text-goz-sage transition-colors rounded-xl hover:bg-goz-accent"
                title="Reset Conversation"
              >
                <RefreshCw size={18} />
              </button>
            )}
            <div className="w-8 h-8 rounded-full bg-goz-clay/20 flex items-center justify-center border border-goz-clay/30">
              <User size={16} className="text-goz-clay" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col relative">
          <AnimatePresence mode="wait">
            {view === 'dashboard' ? (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide pb-12"
              >
                <div className="space-y-2">
                  <h2 className="text-3xl font-serif font-bold tracking-tight">Build Your Evidence</h2>
                  <p className="text-goz-muted leading-relaxed">Track your actions. Log your wins. Build self-trust through real evidence.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {PATHWAYS.map((path) => (
                    <button
                      key={path.id}
                      onClick={() => startPathway(path.title)}
                      className="text-left p-6 goz-card hover:scale-[1.02] transition-all duration-300 group flex flex-col h-full"
                    >
                      <div className={`w-12 h-12 ${path.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        {path.icon}
                      </div>
                      <h3 className="font-serif font-bold text-xl mb-2">{path.title}</h3>
                      <p className="text-sm text-goz-muted leading-relaxed mb-6 flex-1">{path.description}</p>
                      <div className="flex items-center gap-2 text-goz-sage font-bold text-xs uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                        <span>Enter session</span>
                        <ArrowLeft size={14} className="rotate-180" />
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="chat"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col overflow-hidden"
              >
                <div 
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide pb-32"
                >
                  <AnimatePresence mode="popLayout">
                    {messages.map((msg, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className={`flex ${msg.role === 'model' ? 'justify-start' : 'justify-end'} items-start gap-4`}
                      >
                        {msg.role === 'model' && (
                          <div className="w-8 h-8 rounded-xl bg-goz-sage/10 flex items-center justify-center text-goz-sage flex-shrink-0 mt-1">
                            <Bot size={18} />
                          </div>
                        )}
                        <div className={`relative ${msg.role === 'model' ? 'max-w-[90%]' : 'max-w-[80%]'}`}>
                          <div className={`p-5 md:p-6 rounded-[24px] shadow-sm transition-all duration-500 ${msg.role === 'model' ? 'bg-white border border-goz-sage/5' : 'bg-goz-sage text-white'}`}>
                            <div className={`prose prose-sm max-w-none leading-relaxed ${msg.role === 'model' ? 'text-goz-text/90' : 'text-white font-medium'}`}>
                              <ReactMarkdown>{msg.text}</ReactMarkdown>
                            </div>
                            
                            {msg.options && (
                              <div className="flex flex-wrap gap-2 mt-6">
                                {msg.options.map((opt, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => handleSend(opt)}
                                    className={`px-4 py-2 rounded-full text-[11px] font-bold tracking-tight transition-all duration-300 ${msg.role === 'model' ? 'bg-goz-accent text-goz-sage hover:bg-goz-sage hover:text-white' : 'bg-white/20 text-white hover:bg-white/30'}`}
                                  >
                                    {opt}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {isTyping && (
                    <div className="flex justify-start items-start gap-4">
                      <div className="w-8 h-8 rounded-xl bg-goz-sage/10 flex items-center justify-center text-goz-sage flex-shrink-0">
                        <Bot size={18} />
                      </div>
                      <div className="bg-white border border-goz-sage/5 p-4 rounded-2xl flex items-center gap-1.5">
                        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-goz-sage rounded-full" />
                        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-goz-sage rounded-full" />
                        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-goz-sage rounded-full" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-goz-bg via-goz-bg to-transparent">
                  <div className="max-w-2xl mx-auto relative">
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[10px] font-bold text-goz-muted uppercase tracking-widest opacity-60">
                      <MessageCircle size={12} />
                      <span>Goz is listening</span>
                    </div>
                    <input 
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Share your thoughts..."
                      className="w-full goz-input pr-16 shadow-xl"
                    />
                    <button 
                      onClick={() => handleSend()}
                      disabled={!input.trim() || isTyping}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-goz-sage text-white rounded-xl disabled:opacity-50 transition-all hover:scale-105 shadow-lg"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
