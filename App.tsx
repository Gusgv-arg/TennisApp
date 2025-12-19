
import React, { useState } from 'react';
import VideoUploader from './components/VideoUploader';
import Dashboard from './components/Dashboard';
import { extractFrames, analyzeVideoFrames } from './services/geminiService';
import { AppState } from './types';

interface ExtendedAppState extends AppState {
  currentFrames: string[];
}

const App: React.FC = () => {
  const [state, setState] = useState<ExtendedAppState>({
    isAnalyzing: false,
    result: null,
    error: null,
    videoPreviewUrl: null,
    currentFrames: [],
  });

  const handleVideoUpload = async (file: File, strokeType: string) => {
    if (state.videoPreviewUrl) {
      URL.revokeObjectURL(state.videoPreviewUrl);
    }

    setState({
      isAnalyzing: true,
      result: null,
      error: null,
      videoPreviewUrl: URL.createObjectURL(file),
      currentFrames: [],
    });

    try {
      const frames = await extractFrames(file, 12);
      setState(prev => ({ ...prev, currentFrames: frames }));
      const analysis = await analyzeVideoFrames(frames, strokeType);
      
      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        result: analysis
      }));
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        error: err.message || "Error en el análisis."
      }));
    }
  };

  const handleReset = () => {
    if (state.videoPreviewUrl) {
      URL.revokeObjectURL(state.videoPreviewUrl);
    }
    setState({
      isAnalyzing: false,
      result: null,
      error: null,
      videoPreviewUrl: null,
      currentFrames: [],
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="tennis-gradient text-white pt-10 pb-6 safe-top shadow-xl">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
              <span className="text-xl">🎾</span>
            </div>
            <h1 className="text-2xl font-black italic tracking-tighter uppercase leading-none">
              TennisPro<span className="text-yellow-400">AI</span>
            </h1>
          </div>
          <div className="hidden sm:block text-[10px] font-bold opacity-60 uppercase tracking-[0.2em]">
            V 2.0 Mobile Ready
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-6xl mx-auto px-4 py-6 w-full safe-bottom">
        {!state.result && !state.isAnalyzing && (
          <div className="max-w-2xl mx-auto text-center space-y-8 animate-in fade-in duration-500">
            <div className="space-y-3">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-tight px-4">Entrena como un Profesional</h2>
              <p className="text-gray-500 font-medium text-sm">Sube tu golpe y nuestra IA analizará tu biomecánica en segundos.</p>
            </div>
            
            <VideoUploader 
              onVideoSelect={handleVideoUpload} 
              isProcessing={state.isAnalyzing}
            />
          </div>
        )}

        {state.isAnalyzing && (
          <div className="max-w-3xl mx-auto py-12 text-center space-y-8">
             <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-6 shadow-sm"></div>
                <h3 className="text-2xl font-black text-gray-800 tracking-tight">Escaneando Biomecánica</h3>
                <p className="text-gray-400 text-sm font-medium mt-1">Extrayendo puntos de impacto clave...</p>
             </div>

             <div className="bg-white p-4 rounded-3xl shadow-xl border border-gray-100 overflow-x-auto mx-2">
               <div className="flex space-x-3 min-w-max pb-2">
                 {state.currentFrames.length > 0 ? (
                   state.currentFrames.map((f, i) => (
                     <img key={i} src={f} className="h-40 rounded-xl border border-gray-100 shadow-sm transition-all animate-in zoom-in-50 duration-300" />
                   ))
                 ) : (
                   Array.from({length: 4}).map((_, i) => (
                     <div key={i} className="h-40 w-32 bg-gray-50 animate-pulse rounded-xl" />
                   ))
                 )}
               </div>
             </div>
          </div>
        )}

        {state.error && (
          <div className="max-w-md mx-auto mb-8 bg-white border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-2xl flex items-center shadow-xl animate-in slide-in-from-top-4">
            <div className="bg-red-50 p-2 rounded-full mr-4 text-xl">⚠️</div>
            <div className="flex-grow">
              <p className="text-xs uppercase font-black tracking-widest opacity-50 mb-1">Error detectado</p>
              <p className="text-sm font-bold leading-tight">{state.error}</p>
            </div>
            <button onClick={() => setState(prev => ({ ...prev, error: null }))} className="ml-4 text-2xl font-light opacity-30 hover:opacity-100">&times;</button>
          </div>
        )}

        {state.result && (
          <Dashboard 
            result={state.result} 
            videoUrl={state.videoPreviewUrl} 
            onReset={handleReset} 
          />
        )}
      </main>

      <footer className="bg-white border-t border-gray-100 py-8 mb-safe">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-2">TennisPro AI Performance Lab</p>
          <div className="flex justify-center space-x-4 opacity-30 grayscale scale-75">
             <span className="text-2xl">🎾</span>
             <span className="text-2xl">⚡</span>
             <span className="text-2xl">📊</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
