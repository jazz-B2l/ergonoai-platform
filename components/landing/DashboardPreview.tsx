export function DashboardPreview() {
  return (
    <section className="py-32 bg-[#020617] border-y border-slate-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center mb-16">
        <h2 className="font-sora text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
          Enterprise-grade Insights
        </h2>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Monitor your entire organization from a single, powerful dashboard.
        </p>
      </div>

      {/* Massive Dashboard UI Screenshot Simulation */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-[#0f172a] rounded-t-2xl border border-slate-700 shadow-2xl overflow-hidden shadow-teal-900/20">
          <div className="flex h-[600px]">
            {/* Sidebar */}
            <div className="w-64 border-r border-slate-800 bg-[#0B1120] p-4 hidden md:block">
              <div className="h-8 bg-slate-800 rounded w-full mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-teal-900/50 rounded w-full border-l-2 border-teal-500 pl-2"></div>
                <div className="h-4 bg-slate-800/50 rounded w-5/6"></div>
                <div className="h-4 bg-slate-800/50 rounded w-4/5"></div>
                <div className="h-4 bg-slate-800/50 rounded w-full"></div>
                <div className="h-4 bg-slate-800/50 rounded w-3/4"></div>
              </div>
            </div>
            
            {/* Main Area */}
            <div className="flex-1 p-8 bg-[#0f172a] overflow-hidden">
              <div className="flex justify-between items-center mb-8">
                <div className="h-8 bg-slate-800 rounded w-48"></div>
                <div className="flex gap-2">
                  <div className="h-8 bg-slate-800 rounded w-24"></div>
                  <div className="h-8 bg-teal-600 rounded w-32"></div>
                </div>
              </div>

              {/* Top Stats */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                {[1,2,3,4].map(i => (
                  <div key={i} className="bg-[#1e293b] p-4 rounded-xl border border-slate-700">
                    <div className="h-3 bg-slate-600 rounded w-1/2 mb-4"></div>
                    <div className="h-8 bg-slate-200 rounded w-2/3 mb-2"></div>
                    <div className="h-2 bg-teal-500/20 rounded w-1/3"></div>
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 bg-[#1e293b] p-6 rounded-xl border border-slate-700 h-64 flex flex-col">
                  <div className="h-4 bg-slate-600 rounded w-1/4 mb-6"></div>
                  {/* Simulate Chart */}
                  <div className="flex-1 flex items-end gap-2 px-4">
                    {[30, 50, 40, 70, 60, 90, 80, 40, 60].map((h, i) => (
                      <div key={i} className="w-full bg-teal-500/20 rounded-t-sm relative group hover:bg-teal-500/40 transition-colors" style={{ height: `${h}%` }}>
                        <div className="absolute -top-2 left-0 right-0 h-1 bg-teal-400 rounded-full"></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-span-1 bg-[#1e293b] p-6 rounded-xl border border-slate-700 h-64 flex flex-col">
                   <div className="h-4 bg-slate-600 rounded w-1/2 mb-6"></div>
                   {/* Simulate Heatmap/List */}
                   <div className="space-y-3 flex-1 overflow-hidden">
                     {[1,2,3,4,5].map(i => (
                       <div key={i} className="flex justify-between items-center">
                         <div className="h-3 bg-slate-700 rounded w-1/2"></div>
                         <div className={`h-3 rounded w-1/4 ${i===1?'bg-red-500/50': i===2?'bg-orange-500/50': 'bg-green-500/50'}`}></div>
                       </div>
                     ))}
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
