import { Participant } from './types';

export const parseNames = (input: string): Participant[] => {
  return input
    .split(/[\n,]+/) // Split by newline or comma
    .map(name => name.trim())
    .filter(name => name.length > 0)
    .map(name => ({
      id: crypto.randomUUID(),
      name
    }));
};

export const parseCSV = async (file: File): Promise<Participant[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        const names = parseNames(text);
        resolve(names);
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = () => reject(new Error("File reading error"));
    reader.readAsText(file);
  });
};

export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export const downloadCSV = (content: string, filename: string) => {
  // Add BOM for Excel UTF-8 compatibility
  const bom = '\uFEFF';
  const blob = new Blob([bom + content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const getMockNames = (): string => {
  return `王小明, 李小華, 陳大文, 林怡君, 張志偉, 劉淑芬, 楊家豪, 黃雅婷, 
趙子龍, 孫悟空, 豬八戒, 沙悟淨, 
賈寶玉, 林黛玉, 
哈利波特, 妙麗, 榮恩, 
魯夫, 索隆, 娜美, 
鳴人, 佐助, 小櫻, 
炭治郎, 禰豆子, 善逸, 伊之助, 
五條悟, 虎杖悠仁, 伏黑惠`;
};
