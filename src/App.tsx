import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Zap, Settings, LogOut, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from './lib/supabase';

// --- COMPONENT: LOGIN SCREEN ---
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
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center">
        <div className="w-12 h-12 bg-blue-600 rounded-xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-blue-900/20">
          <Lock className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Venture OS</h2>
        <p className="text-slate-400 text-sm mb-8">Secure Access Terminal</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative text-left">
            <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
            <input 
              type="email" 
              placeholder="founder@venture.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg py-3 pl-10 pr-4 focus:ring-2 focus:ring-blue-600 outline-none"
              required
            />
          </div>
          <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin" /> : <>Enter System <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>
        {message && <div className="mt-4 p-3 bg-blue-900/20 text-blue-400 text-sm rounded-lg">{message}</div>}
      </div>
    </div>
  );
};

// --- COMPONENT: DASHBOARD ---
const Dashboard = ({ session }: { session: any }) => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col">
        <div className="flex items-center gap-2 font-bold text-xl mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"><Zap className="w-5 h-5" /></div>
          Venture OS
        </div>
        <nav className="space-y-2 flex-1">
          <button className="w-full flex items-center gap-3 px-4 py-2 bg-slate-800 text-white rounded-lg"><LayoutDashboard size={18}/> Overview</button>
          <button className="w-full flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"><Settings size={18}/> Settings</button>
        </nav>
        <div className="pt-4 border-t border-slate-800">
          <div className="text-sm text-slate-400 mb-2 truncate">{session.user.email}</div>
          <button onClick={() => supabase.auth.signOut()} className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300"><LogOut size={16}/> Sign Out</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-2">Command Center</h1>
        <p className="text-slate-400 mb-8">System metrics and active modules.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
            <div className="text-slate-400 text-sm mb-1">Active Projects</div>
            <div className="text-3xl font-bold">0</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
            <div className="text-slate-400 text-sm mb-1">Credits Available</div>
            <div className="text-3xl font-bold text-blue-400">3</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
            <div className="text-slate-400 text-sm mb-1">System Status</div>
            <div className="text-3xl font-bold text-green-400">Online</div>
          </div>
        </div>
      </main>
    </div>
  );
};

// --- MAIN APP LOGIC ---
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

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Initializing...</div>;

  if (!session) return <LoginScreen />;

  return <Dashboard session={session} />;
}


            
