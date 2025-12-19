
import React from 'react';
import { AnalysisResult } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer
} from 'recharts';

interface EnhancedAnalysisResult extends AnalysisResult {
  detectedStrokeJustification: string;
}

interface Props {
  result: EnhancedAnalysisResult;
  videoUrl: string | null;
  onReset: () => void;
}

const Dashboard: React.FC<Props> = ({ result, videoUrl, onReset }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header con Justificación IA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
          <div className="relative mb-6">
            <svg className="w-40 h-40 transform -rotate-90">
              <circle cx="80" cy="80" r="74" stroke="#f3f4f6" strokeWidth="12" fill="transparent" />
              <circle
                cx="80"
                cy="80"
                r="74"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={464.9}
                strokeDashoffset={464.9 - (464.9 * result.overallScore) / 100}
                strokeLinecap="round"
                style={{ color: getScoreColor(result.overallScore) }}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black" style={{ color: getScoreColor(result.overallScore) }}>{result.overallScore}</span>
              <span className="text-[10px] text-gray-400 uppercase font-black tracking-[0.2em]">Puntaje Total</span>
            </div>
          </div>
          <div className="inline-block px-4 py-1 bg-green-100 text-green-700 rounded-full text-xs font-black uppercase mb-2">
            {result.strokeType}
          </div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-tight">Identificación técnica verificada</p>
        </div>

        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center">
            <span className="mr-2">💡</span> ¿Por qué hemos detectado este golpe?
          </h3>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl">
            <p className="text-blue-900 text-sm leading-relaxed italic">
              "{result.detectedStrokeJustification}"
            </p>
          </div>
          
          <div className="mt-8">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Desglose de Habilidades</h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={result.breakdown} layout="vertical">
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis dataKey="label" type="category" width={110} axisLine={false} tickLine={false} style={{fontSize: '10px', fontWeight: 'bold'}} />
                  <Bar dataKey="score" radius={[0, 10, 10, 0]} barSize={20}>
                    {result.breakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getScoreColor(entry.score)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <h3 className="text-lg font-black mb-4 text-green-800 flex items-center">
              <span className="mr-2">📢</span> Veredicto del Coach
            </h3>
            <p className="text-gray-600 leading-relaxed font-medium">"{result.summary}"</p>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <h3 className="text-lg font-black mb-4 text-red-600 flex items-center">
              <span className="mr-2">⚠️</span> Puntos Críticos
            </h3>
            <ul className="space-y-4">
              {result.improvementAreas.map((area, i) => (
                <li key={i} className="flex items-start bg-red-50 p-3 rounded-xl">
                  <span className="mr-3 text-red-500 font-bold">#</span>
                  <span className="text-gray-700 text-sm font-bold">{area}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-green-600 text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <svg width="120" height="120" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><circle cx="12" cy="12" r="5"/></svg>
            </div>
            <h3 className="text-xl font-black mb-6 flex items-center">
              <span className="mr-3">🎯</span> Plan de Entrenamiento
            </h3>
            <div className="space-y-4">
              {result.actionableTips.map((tip, i) => (
                <div key={i} className="bg-white/10 p-5 rounded-2xl border border-white/20 backdrop-blur-sm">
                  <h4 className="font-black mb-1 uppercase text-xs tracking-widest">{tip.title}</h4>
                  <p className="text-sm text-green-50 leading-relaxed">{tip.description}</p>
                </div>
              ))}
            </div>
          </div>

          {videoUrl && (
            <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100">
              <p className="text-[10px] font-black text-gray-400 mb-3 uppercase tracking-widest text-center">Video de Sesión Analizado</p>
              <video src={videoUrl} controls className="w-full rounded-2xl shadow-inner" />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center pb-12">
        <button 
          onClick={onReset}
          className="px-10 py-4 bg-gray-900 text-white font-black rounded-full hover:bg-black transition-all shadow-xl hover:scale-105 active:scale-95 uppercase tracking-widest text-xs"
        >
          Nueva Sesión de Análisis
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
