import { useState } from 'react'
import { LayoutDashboard, Zap, Settings } from 'lucide-react'

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Venture OS</h1>
        <p className="text-slate-400">System Initialized. Ready for modules.</p>
        <div className="mt-8 flex gap-4 justify-center">
          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
            <LayoutDashboard className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <span className="text-sm">Dashboard</span>
          </div>
          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
            <Zap className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
            <span className="text-sm">AI Core</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App


