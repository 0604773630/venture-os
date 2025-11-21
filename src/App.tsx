import React, { useState } from 'react';
import { LayoutDashboard, Zap, Settings, LogOut } from 'lucide-react';
import { supabase } from './lib/supabase';

export default function App() {
  const [session, setSession] = useState<any>(null);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // --- Simple Login View ---
  if (!session) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-blue-900/20">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Venture OS</h1>
          <p className="text-slate-400">Please sign in to access your terminal.</p>
          <button 
            onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}
            className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-slate-200 transition"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  // --- Dashboard View ---
  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 flex flex-col items-center justify-center text-center">
      <div className="mb-8 relative w-full max-w-md">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-blue-900/20">
          <Zap className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Venture OS
        </h1>
        <p className="text-slate-500 mt-2">Welcome back, Founder.</p>
        <button 
          onClick={() => supabase.auth.signOut()} 
          className="absolute top-0 right-0 p-2 bg-slate-900 rounded-full hover:bg-slate-800 border border-slate-800"
        >
          <LogOut size={20} className="text-slate-400"/>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
        <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-blue-500/50 transition-colors cursor-pointer group">
          <LayoutDashboard className="w-6 h-6 text-blue-500 mb-3 group-hover:scale-110 transition-transform mx-auto" />
          <h3 className="font-semibold">Command Center</h3>
          <p className="text-xs text-slate-500 mt-1">Manage your projects</p>
        </div>

        <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-purple-500/50 transition-colors cursor-pointer group">
          <Settings className="w-6 h-6 text-purple-500 mb-3 group-hover:scale-110 transition-transform mx-auto" />
          <h3 className="font-semibold">System Config</h3>
          <p className="text-xs text-slate-500 mt-1">API & Database Status</p>
        </div>
      </div>
    </div>
  );
}


