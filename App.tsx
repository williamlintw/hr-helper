import React, { useState } from 'react';
import { Gift, Users, PenLine } from 'lucide-react';
import InputSection from './components/InputSection';
import DrawSection from './components/DrawSection';
import GroupSection from './components/GroupSection';
import { Participant, AppMode } from './types';

function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.Input);
  const [participants, setParticipants] = useState<Participant[]>([]);

  // Calculate stats for sidebar or header
  const hasData = participants.length > 0;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-brand-600 text-white p-1.5 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">TeamSync <span className="text-brand-600">HR</span></h1>
          </div>
          
          <nav className="flex items-center gap-1 md:gap-2">
             <button
               onClick={() => setMode(AppMode.Input)}
               className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${mode === AppMode.Input ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100'}`}
             >
               <PenLine className="w-4 h-4" />
               <span className="hidden md:inline">名單輸入</span>
             </button>
             
             <div className="w-px h-6 bg-slate-200 mx-1"></div>

             <button
               onClick={() => hasData && setMode(AppMode.Draw)}
               disabled={!hasData}
               className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${mode === AppMode.Draw ? 'bg-brand-50 text-brand-700' : hasData ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-300 cursor-not-allowed'}`}
             >
               <Gift className="w-4 h-4" />
               <span className="hidden md:inline">幸運抽籤</span>
             </button>

             <button
               onClick={() => hasData && setMode(AppMode.Group)}
               disabled={!hasData}
               className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${mode === AppMode.Group ? 'bg-brand-50 text-brand-700' : hasData ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-300 cursor-not-allowed'}`}
             >
               <Users className="w-4 h-4" />
               <span className="hidden md:inline">自動分組</span>
             </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {mode === AppMode.Input && (
          <InputSection 
            participants={participants}
            onUpdateParticipants={setParticipants}
            onNext={() => setMode(AppMode.Draw)}
          />
        )}
        
        {mode === AppMode.Draw && (
          <DrawSection participants={participants} />
        )}
        
        {mode === AppMode.Group && (
          <GroupSection participants={participants} />
        )}
      </main>
    </div>
  );
}

export default App;