
import React from 'react';
import { GameState } from '../types';

interface MoralReportProps {
  gameState: GameState;
  onRestart: () => void;
}

const MoralReport: React.FC<MoralReportProps> = ({ gameState, onRestart }) => {
  // @ts-ignore
  const finalSummary = gameState.final_summary || "The trial has concluded. Your moral architecture has been logged.";
  // @ts-ignore
  const consistencyReport = gameState.consistency_report || "No specific findings were articulated before termination.";

  const getScoreRating = (score: number) => {
    if (score >= 100) return "Architect of Clarity";
    if (score >= 80) return "Principled Thinker";
    if (score >= 60) return "Flexible Pragmatist";
    if (score >= 40) return "Conflicted Soul";
    return "Logical Void";
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-inter">
      <div className="max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-2xl">
        <div className="bg-slate-950 p-8 border-b border-slate-800 text-center">
          <div className="inline-block px-4 py-1 border border-slate-800 text-[10px] tracking-[0.3em] font-cinzel text-slate-500 uppercase mb-4">
            Final Verdict
          </div>
          <h2 className="text-4xl font-garamond font-bold text-slate-200 mb-2">Consistency Evaluation</h2>
          <div className="flex justify-center items-center gap-4 mt-6">
            <div className="text-center">
              <div className="text-xs font-cinzel text-slate-500 uppercase">Score</div>
              <div className="text-5xl font-garamond font-bold text-white">{gameState.score}</div>
            </div>
            <div className="h-12 w-[1px] bg-slate-800 mx-4" />
            <div className="text-left">
              <div className="text-xs font-cinzel text-slate-500 uppercase">Classification</div>
              <div className="text-2xl font-garamond text-slate-300">{getScoreRating(gameState.score)}</div>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto">
          <div>
            <h3 className="text-xs font-cinzel text-slate-400 tracking-widest uppercase mb-4">Executive Summary</h3>
            <p className="text-lg font-garamond text-slate-300 leading-relaxed italic">
              {finalSummary}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-cinzel text-slate-400 tracking-widest uppercase mb-4">Detailed Findings</h3>
            <p className="text-slate-400 font-inter text-sm leading-relaxed whitespace-pre-wrap bg-slate-950/50 p-6 rounded border border-slate-800">
              {consistencyReport}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-[10px] font-cinzel text-slate-500 uppercase mb-2">Precedents Established</h4>
              <ul className="space-y-2">
                {gameState.principles.map((p, i) => (
                  <li key={i} className="text-xs font-garamond text-slate-500 flex gap-2">
                    <span className="text-slate-700">•</span> {p.principle_summary}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-cinzel text-red-900 uppercase mb-2">Logical Faults</h4>
              <ul className="space-y-2">
                {gameState.contradictions.length === 0 ? (
                  <li className="text-xs font-garamond text-emerald-900">None detected. Internal logic holds firm.</li>
                ) : (
                  gameState.contradictions.map((c, i) => (
                    <li key={i} className="text-xs font-garamond text-red-400 flex gap-2">
                      <span className="text-red-900">•</span> {c.explanation}
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-slate-950 p-6 border-t border-slate-800 flex justify-center">
          <button 
            onClick={onRestart}
            className="px-10 py-3 bg-slate-100 text-slate-950 font-cinzel tracking-widest text-sm hover:bg-white transition-all transform hover:scale-105 active:scale-95 shadow-lg"
          >
            Re-Evaluate Identity
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoralReport;
