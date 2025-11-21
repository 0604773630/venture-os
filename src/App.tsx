import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  LayoutDashboard, Zap, Settings, LogOut, Lock, Mail, ArrowRight, Loader2, 
  Sparkles, FileText, Code, CreditCard, Coins, CheckCircle2, Menu, X, Download, Copy 
} from 'lucide-react';

// --- 1. INTERNAL SUPABASE SETUP ---
// We define the client right here so we don't get "Module not found" errors.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('CRITICAL: Supabase Environment Variables are missing in Vercel Settings.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);

// --- 2. TYPES ---
interface DocumentFile {
  id: number;
  title: string;
  type: string;
  size: string;
}

interface GeneratedData {
  website_code: string;
  docs: DocumentFile[];
}
// --- 3. LOGIN COMPONENT ---
const LoginScreen = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) setMessage(error.message);
    else setMessage('Check your email for the magic link!');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 text-white">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center">
        <div className="w-12 h-12 bg-blue-600 rounded-xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-blue-900/20">
          <Lock className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Venture OS</h2>
        <p className="text-slate-400 text-sm mb-6">Secure Access Terminal</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative text-left">
            <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
            <input 
              type="email" placeholder="founder@venture.com" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg py-3 pl-10 pr-4 focus:ring-2 focus:ring-blue-600 outline-none"
              required
            />
          </div>
          <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin" /> : <>Enter System <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>
        {message && <div className="mt-4 p-3 bg-blue-900/20 text-blue-400 text-sm rounded-lg border border-blue-800">{message}</div>}
      </div>
    </div>
  );
};

// --- 4. DASHBOARD COMPONENT ---
const Dashboard = ({ session }: { session: any }) => {
  const [credits, setCredits] = useState<number>(3);
  const [prompt, setPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedData, setGeneratedData] = useState<GeneratedData | null>(null);
  const [showPricing, setShowPricing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'docs'>('preview');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    if (credits <= 0) { setShowPricing(true); return; }

    setCredits((prev) => prev - 1);
    setIsGenerating(true);
    setGeneratedData(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error('API_MOCK_FALLBACK');
      const data = await response.json();
      setGeneratedData(data);

    } catch (error) {
      // Simulation Fallback
      setTimeout(() => {
        setGeneratedData({
          website_code: `<!-- Generated for: ${prompt} -->\n<html>\n<body class="bg-black text-white p-10">\n  <h1 class="text-4xl font-bold">Venture for ${prompt}</h1>\n  <p>AI Generated Business Concept.</p>\n</body>\n</html>`,
          docs: [
            { id: 1, title: 'Executive Summary.pdf', type: 'PDF', size: '1.2 MB' },
            { id: 2, title: 'Financial Projections.xlsx', type: 'EXCEL', size: '850 KB' },
          ]
        });
        setIsGenerating(false);
      }, 2500);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-slate-900 border-b border-slate-800 p-4 flex justify-between z-40">
        <span className="font-bold text-lg">Venture OS</span>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}><Menu /></button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed md:relative z-40 w-64 h-full bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 pt-16 md:pt-0`}>
        <div className="p-6 hidden md:flex items-center gap-2 font-bold text-xl border-b border-slate-800">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"><Zap className="w-5 h-5" /></div> Venture OS
        </div>
        <div className="flex-1 p-4 space-y-2">
          <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl mb-4">
            <div className="text-xs text-slate-400 mb-1">Credits</div>
            <div className="text-2xl font-bold text-blue-400">{credits}</div>
            <button onClick={() => setShowPricing(true)} className="w-full mt-3 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg">Top Up</button>
          </div>
          <button className="w-full flex items-center gap-3 px-4 py-2 bg-slate-800 text-white rounded-lg"><LayoutDashboard size={18}/> Dashboard</button>
        </div>
        <div className="p-4 border-t border-slate-800">
          <div className="text-xs text-slate-500 truncate mb-2">{session.user.email}</div>
          <button onClick={() => supabase.auth.signOut()} className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300"><LogOut size={16}/> Sign Out</button>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 pt-16 md:pt-0 overflow-y-auto bg-black relative p-6">
        {!generatedData && !isGenerating ? (
          <div className="flex flex-col items-center justify-center h-full text-center max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">Initialize Project</h1>
            <p className="text-slate-400 mb-8">Describe your startup idea. AI agents will generate the business plan and code.</p>
            <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-2">
              <textarea 
                value={prompt} onChange={(e) => setPrompt(e.target.value)} 
                placeholder="E.g. A marketplace for drone pilots..." 
                className="w-full bg-transparent border-none text-white p-4 h-32 resize-none focus:ring-0"
              />
              <div className="flex justify-between items-center px-4 pb-2">
                <span className="text-xs text-slate-500">{prompt.length}/500</span>
                <button onClick={handleGenerate} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2">
                  {credits <= 0 ? <Lock size={14}/> : <Sparkles size={14}/>} Generate
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col">
            {isGenerating ? (
              <div className="flex-1 flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4"/>
                <h3 className="text-xl font-bold">Compiling Assets...</h3>
              </div>
            ) : (
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Results</h2>
                  <button onClick={() => setGeneratedData(null)} className="text-slate-400 hover:text-white">New Project</button>
                </div>
                <div className="flex gap-2 mb-4 bg-slate-900 w-fit p-1 rounded-lg border border-slate-800">
                  <button onClick={() => setActiveTab('preview')} className={`px-4 py-2 rounded-md text-sm ${activeTab === 'preview' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}>Preview</button>
                  <button onClick={() => setActiveTab('docs')} className={`px-4 py-2 rounded-md text-sm ${activeTab === 'docs' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}>Docs</button>
                </div>
                <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden relative">
                  {activeTab === 'preview' ? (
                    <pre className="p-4 text-green-400 font-mono text-xs overflow-auto h-full absolute inset-0">{generatedData?.website_code}</pre>
                  ) : (
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {generatedData?.docs.map(doc => (
                        <div key={doc.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between hover:border-blue-500/50 cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center"><FileText className="text-blue-500"/></div>
                            <div><div className="font-bold text-sm">{doc.title}</div><div className="text-xs text-slate-500">{doc.size}</div></div>
                          </div>
                          <Download className="text-slate-500"/>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
              // --- 5. MAIN APP ROUTER ---
export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white"><Loader2 className="animate-spin mr-2"/> Initializing...</div>;

  if (!session) return <LoginScreen />;

  return <Dashboard session={session} />;
}
