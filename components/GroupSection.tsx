import React, { useState } from 'react';
import { Users, LayoutGrid, Shuffle, Download } from 'lucide-react';
import { Participant } from '../types';
import { shuffleArray, downloadCSV } from '../utils';

interface GroupSectionProps {
  participants: Participant[];
}

const GroupSection: React.FC<GroupSectionProps> = ({ participants }) => {
  const [groupSize, setGroupSize] = useState<number>(3);
  const [groups, setGroups] = useState<Participant[][]>([]);
  const [isGenerated, setIsGenerated] = useState(false);

  const handleGroup = () => {
    if (groupSize < 1) return;
    
    const shuffled = shuffleArray<Participant>(participants);
    const newGroups: Participant[][] = [];
    
    for (let i = 0; i < shuffled.length; i += groupSize) {
      newGroups.push(shuffled.slice(i, i + groupSize));
    }
    
    setGroups(newGroups);
    setIsGenerated(true);
  };

  const handleExport = () => {
    if (groups.length === 0) return;

    let csvContent = "Group,Name\n";
    groups.forEach((group, index) => {
      group.forEach(member => {
        csvContent += `Group ${index + 1},${member.name}\n`;
      });
    });

    const timestamp = new Date().toISOString().slice(0, 10);
    downloadCSV(csvContent, `teams_export_${timestamp}.csv`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
               <Users className="w-6 h-6" />
             </div>
             <div>
               <h2 className="text-xl font-bold text-slate-800">分組設定</h2>
               <p className="text-slate-500 text-sm">目前共有 {participants.length} 位參與者</p>
             </div>
           </div>

           <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
             <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
               <label className="text-slate-600 font-medium whitespace-nowrap">每組人數</label>
               <input 
                 type="number" 
                 min="1"
                 max={participants.length}
                 value={groupSize}
                 onChange={(e) => setGroupSize(Math.max(1, parseInt(e.target.value) || 1))}
                 className="w-20 bg-transparent font-bold text-center focus:outline-none text-slate-800"
               />
             </div>
             
             <button
               onClick={handleGroup}
               className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 whitespace-nowrap"
             >
               <Shuffle className="w-4 h-4" />
               自動分組
             </button>

             {isGenerated && (
                <button
                  onClick={handleExport}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 whitespace-nowrap"
                >
                  <Download className="w-4 h-4" />
                  匯出 CSV
                </button>
             )}
           </div>
        </div>
      </div>

      {/* Results Grid */}
      {isGenerated && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {groups.map((group, index) => (
            <div key={index} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-slate-50 p-3 border-b border-slate-100 flex justify-between items-center">
                <span className="font-bold text-slate-700">第 {index + 1} 組</span>
                <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">{group.length} 人</span>
              </div>
              <div className="p-4">
                <ul className="space-y-2">
                  {group.map(member => (
                    <li key={member.id} className="flex items-center gap-2 text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-400"></div>
                      {member.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {!isGenerated && participants.length > 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <LayoutGrid className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">調整設定並點擊「自動分組」來查看結果</p>
        </div>
      )}
    </div>
  );
};

export default GroupSection;