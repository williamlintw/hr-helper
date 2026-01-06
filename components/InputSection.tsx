import React, { useState, useRef, useMemo } from 'react';
import { Upload, Users, X, ArrowRight, Trash2, AlertCircle, FileText } from 'lucide-react';
import { Participant } from '../types';
import { parseNames, parseCSV, getMockNames } from '../utils';

interface InputSectionProps {
  participants: Participant[];
  onUpdateParticipants: (participants: Participant[]) => void;
  onNext: () => void;
}

const InputSection: React.FC<InputSectionProps> = ({ participants, onUpdateParticipants, onNext }) => {
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate duplicates
  const duplicates = useMemo(() => {
    const nameCounts = new Map<string, number>();
    const duplicateNames = new Set<string>();
    
    participants.forEach(p => {
      const count = nameCounts.get(p.name) || 0;
      nameCounts.set(p.name, count + 1);
      if (count === 1) { // Found the second occurrence
        duplicateNames.add(p.name);
      }
    });
    
    return Array.from(duplicateNames);
  }, [participants]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateData(e.target.value);
  };

  const updateData = (text: string) => {
    setInputText(text);
    const parsed = parseNames(text);
    onUpdateParticipants(parsed);
    setError(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv') && file.type !== 'text/plain') {
        setError('請上傳 .csv 或 .txt 檔案');
        return;
    }

    try {
      const parsed = await parseCSV(file);
      onUpdateParticipants(parsed);
      setInputText(parsed.map(p => p.name).join('\n'));
      setError(null);
    } catch (err) {
      setError('讀取檔案失敗');
    }
    
    // Reset input so same file can be selected again
    if (e.target) e.target.value = '';
  };

  const clearData = () => {
    setInputText('');
    onUpdateParticipants([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setError(null);
  };

  const loadMockData = () => {
    const mock = getMockNames();
    updateData(mock);
  };

  const removeDuplicates = () => {
    const uniqueMap = new Map();
    participants.forEach(p => {
      if (!uniqueMap.has(p.name)) {
        uniqueMap.set(p.name, p);
      }
    });
    const uniqueParticipants = Array.from(uniqueMap.values());
    
    onUpdateParticipants(uniqueParticipants);
    setInputText(uniqueParticipants.map(p => p.name).join('\n'));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-600" />
            名單匯入
          </h2>
          <div className="flex gap-2">
            <button
              onClick={loadMockData}
              className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4" />
              模擬名單
            </button>
            {participants.length > 0 && (
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                已匯入 {participants.length} 人
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Text Input Area */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              直接貼上姓名 (以換行或逗號分隔)
            </label>
            <textarea
              className="w-full h-64 p-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all resize-none text-slate-700 placeholder:text-slate-400 text-base"
              placeholder="王小明&#10;李大同&#10;陳小美..."
              value={inputText}
              onChange={handleTextChange}
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">
                {participants.length > 0 ? `目前名單: ${participants.length} 人` : '請輸入名單'}
              </span>
              {participants.length > 0 && (
                <button
                  onClick={clearData}
                  className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" /> 清除
                </button>
              )}
            </div>
          </div>

          {/* File Upload Area */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              或是上傳 CSV 檔案
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg h-64 flex flex-col items-center justify-center p-6 text-center hover:border-brand-400 hover:bg-brand-50 transition-colors cursor-pointer relative bg-slate-50"
                 onClick={() => fileInputRef.current?.click()}>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".csv,.txt"
                onChange={handleFileUpload}
              />
              <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                <Upload className="w-8 h-8 text-brand-500" />
              </div>
              <p className="text-slate-900 font-medium mb-1">點擊上傳檔案</p>
              <p className="text-slate-500 text-sm">支援 .csv 或 .txt 純文字檔</p>
            </div>
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
                <X className="w-4 h-4" />
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Duplicates Warning */}
        {duplicates.length > 0 && (
          <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <h3 className="font-semibold text-orange-800 text-sm">發現 {duplicates.length} 個重複姓名</h3>
                <p className="text-orange-600 text-sm mt-1">重複名單: {duplicates.slice(0, 5).join(', ')}{duplicates.length > 5 ? '...' : ''}</p>
              </div>
            </div>
            <button
              onClick={removeDuplicates}
              className="whitespace-nowrap px-4 py-2 bg-white border border-orange-300 text-orange-700 hover:bg-orange-100 rounded-lg text-sm font-medium transition-colors"
            >
              移除重複姓名
            </button>
          </div>
        )}

        {participants.length > 0 && (
          <div className="mt-8 flex justify-end">
            <button
              onClick={onNext}
              className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              開始抽獎
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InputSection;