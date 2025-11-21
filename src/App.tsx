import React, { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { LayoutDashboard, Zap, Settings, LogOut, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react'

export default function App() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Check your email for the login link!')
    }
    setLoading(false)
  }

  // --- LOGIN VIEW ---
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center">
          <div className="w-12 h-12 bg-blue-600 rounded-xl mx-auto flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Venture OS</h2>
          <p className="text-slate-400 text-sm mb-6">Secure Access Terminal</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
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

            <button
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <>Enter System <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          {message && (
            <div className="mt-4 p-3 bg-blue-900/20 border border-blue-800 text-blue-400 text-sm rounded-lg">
              {message}
            </div>
          )}
        </div>
      </div>
    )
  }

  // --- DASHBOARD VIEW ---
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
          className="absolute top-0 right-0 text-slate-600 hover:text-white p-2"
        >
          <LogOut size={20}/>
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
  )
          }
