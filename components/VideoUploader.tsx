
import React, { useState, useRef } from 'react';
import { StrokeType } from '../types';

interface Props {
  onVideoSelect: (file: File, stroke: string) => void;
  isProcessing: boolean;
}

const VideoUploader: React.FC<Props> = ({ onVideoSelect, isProcessing }) => {
  const [selectedStroke, setSelectedStroke] = useState<string>(StrokeType.DRIVE);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onVideoSelect(file, selectedStroke);
      // Reset value so onChange triggers even if same file is selected later
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const strokes = [
    { id: StrokeType.DRIVE, label: 'Drive', icon: '🎾' },
    { id: StrokeType.BACKHAND, label: 'Revés', icon: '🎾' },
    { id: StrokeType.SERVE, label: 'Saque', icon: '🚀' },
    { id: StrokeType.VOLLEY, label: 'Volea', icon: '🤚' },
    { id: StrokeType.SMASH, label: 'Smash', icon: '💥' },
    { id: StrokeType.FOOTWORK, label: 'Pies', icon: '👟' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-200">
        <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-5 text-center">
          Paso 1: ¿Qué estás practicando?
        </p>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {strokes.map((stroke) => (
            <button
              key={stroke.id}
              onClick={() => setSelectedStroke(stroke.id)}
              disabled={isProcessing}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-200 ${
                selectedStroke === stroke.id
                  ? 'border-green-600 bg-green-50 text-green-700 scale-105 shadow-md'
                  : 'border-gray-50 hover:border-gray-200 text-gray-400 grayscale opacity-70'
              }`}
            >
              <span className="text-2xl mb-1">{stroke.icon}</span>
              <span className="text-[10px] font-black uppercase tracking-tighter">{stroke.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center justify-center p-12 border-4 border-dotted border-gray-200 rounded-[2.5rem] bg-white hover:border-green-500/50 transition-all cursor-pointer group relative overflow-hidden shadow-sm">
        <div className="mb-6 p-5 bg-green-50 rounded-full text-green-600 group-hover:rotate-12 transition-transform duration-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
        </div>
        <h3 className="text-2xl font-black text-gray-800 mb-2">Paso 2: Sube tu video</h3>
        <p className="text-gray-500 text-center max-w-xs mb-8 text-sm font-medium">
          El análisis se centrará en tu <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">{selectedStroke}</span>.
        </p>
        
        <label className="relative inline-flex items-center justify-center px-10 py-4 overflow-hidden font-bold text-white transition duration-300 ease-out bg-green-600 rounded-full shadow-xl group cursor-pointer hover:bg-green-700 active:scale-95">
          <span className="relative">SELECCIONAR ARCHIVO</span>
          <input 
            ref={fileInputRef}
            type="file" 
            className="hidden" 
            accept="video/*" 
            onChange={handleFileChange} 
            disabled={isProcessing}
          />
        </label>
        
        <p className="mt-6 text-[10px] font-bold text-gray-300 uppercase tracking-widest">MP4 / MOV • Max 25MB</p>
      </div>
    </div>
  );
};

export default VideoUploader;
