import React, { useState, useEffect } from 'react';
import { Trophy, RefreshCw, Settings } from 'lucide-react';
import { Participant } from '../types';

interface DrawSectionProps {
  participants: Participant[];
}

const DrawSection: React.FC<DrawSectionProps> = ({ participants }) => {
  const [winners, setWinners] = useState<Participant[]>([]);
  const [currentDisplay, setCurrentDisplay] = useState<string>('?');
  const [isDrawing, setIsDrawing] = useState(false);
  const [allowRepeats, setAllowRepeats] = useState(false);
  const [remainingPool, setRemainingPool] = useState<Participant[]>(participants);

  // Update remaining pool when participants or winners change (if no repeats)
  useEffect(() => {
    if (allowRepeats) {
      setRemainingPool(participants);
    } else {
      const winnerIds = new Set(winners.map(w => w.id));
      setRemainingPool(participants.filter(p => !winnerIds.has(p.id)));
    }
  }, [participants, winners, allowRepeats]);

  const handleDraw = () => {
    if (remainingPool.length === 0) return;

    setIsDrawing(true);
    let counter = 0;
    const maxCount = 20; // How many shuffles before stop
    const intervalTime = 80; // ms

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * remainingPool.length);
      setCurrentDisplay(remainingPool[randomIndex].name);
      counter++;

      if (counter >= maxCount) {
        clearInterval(interval);
        const finalIndex = Math.floor(Math.random() * remainingPool.length);
        const winner = remainingPool[finalIndex];
        setCurrentDisplay(winner.name);
        setWinners(prev => [winner, ...prev]);
        setIsDrawing(false);
      }
    }, intervalTime);
  };

  const reset = () => {
    setWinners([]);
    setCurrentDisplay('?');
    setRemainingPool(participants);
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Main Draw Area */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center min-h-[400px] flex flex-col justify-center items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-400 to-indigo-500"></div>
          
          <h2 className="text-slate-500 font-semibold mb-8 tracking-wide uppercase text-sm">Lucky Draw</h2>
          
          <div className={`text-6xl md:text-8xl font-black mb-12 transition-all duration-200 ${isDrawing ? 'scale-110 text-brand-600' : 'text-slate-800'}`}>
            {currentDisplay}
          </div>

          <div className="flex gap-4 items-center z-10">
            <button
              onClick={handleDraw}
              disabled={isDrawing || remainingPool.length === 0}
              className="bg-brand-600 hover:bg-brand-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-10 py-4 rounded-full font-bold text-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center gap-2"
            >
              {isDrawing ? '抽取中...' : '開始抽獎'}
            </button>
          </div>
          
          {remainingPool.length === 0 && !isDrawing && (
             <p className="mt-4 text-orange-500 font-medium">所有人都中獎了！</p>
          )}
        </div>

        {/* Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center justify-between">
           <div className="flex items-center gap-2">
             <Settings className="w-5 h-5 text-slate-400" />
             <span className="font-semibold text-slate-700">抽獎設定</span>
           </div>
           
           <label className="flex items-center gap-3 cursor-pointer">
             <div className="relative inline-flex items-center">
               <input 
                 type="checkbox" 
                 className="sr-only peer" 
                 checked={allowRepeats}
                 onChange={(e) => setAllowRepeats(e.target.checked)}
               />
               <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
             </div>
             <span className="text-slate-700 text-sm font-medium">允許重複中獎</span>
           </label>
        </div>
      </div>

      {/* Winners List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-[500px]">
        <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            中獎名單 ({winners.length})
          </h3>
          <button 
            onClick={reset}
            className="text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-slate-50 rounded-lg"
            title="重置"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {winners.length === 0 ? (
            <div className="text-center text-slate-400 py-10 flex flex-col items-center">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                <Trophy className="w-6 h-6 text-slate-300" />
              </div>
              <p>尚未有人中獎</p>
            </div>
          ) : (
            winners.map((winner, index) => (
              <div key={`${winner.id}-${index}`} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 animate-in slide-in-from-left-4 fade-in duration-300">
                <div className="w-8 h-8 bg-yellow-100 text-yellow-700 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                  {winners.length - index}
                </div>
                <span className="font-semibold text-slate-700 truncate">{winner.name}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DrawSection;