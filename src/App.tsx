import { LayoutDashboard, Zap, Settings } from 'lucide-react'

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <div className="mb-8">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-blue-900/20">
          <Zap className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Venture OS
        </h1>
        <p className="text-slate-500 mt-2">System Online. Ready for modules.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
        <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-blue-500/50 transition-colors cursor-pointer group">
          <LayoutDashboard className="w-6 h-6 text-blue-500 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold">Command Center</h3>
          <p className="text-xs text-slate-500 mt-1">Manage your projects</p>
        </div>

        <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-purple-500/50 transition-colors cursor-pointer group">
          <Settings className="w-6 h-6 text-purple-500 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold">System Config</h3>
          <p className="text-xs text-slate-500 mt-1">API & Database Status</p>
        </div>
      </div>
    </div>
  )
}

export default App


