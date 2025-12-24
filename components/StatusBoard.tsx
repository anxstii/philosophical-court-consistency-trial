
import React from 'react';
import { GameState } from '../types';

interface StatusBoardProps {
  gameState: GameState;
}

const StatusBoard: React.FC<StatusBoardProps> = ({ gameState }) => {
  return (
    <div className="space-y-8 overflow-y-auto">
      <div>
        <h3 className="text-xs font-cinzel tracking-widest text-slate-500 mb-2 uppercase">Trial Progress</h3>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-garamond font-bold text-slate-200">Round {gameState.round}</span>
          <span className="text-sm text-slate-500 mb-1">/ 7</span>
        </div>
        <div className="mt-2 w-full bg-slate-800 h-1 rounded-full overflow-hidden">
          <div 
            className="h-full bg-slate-400 transition-all duration-1000" 
            style={{ width: `${(gameState.round / 7) * 100}%` }}
          />
        </div>
      </div>

      <div>
        <h3 className="text-xs font-cinzel tracking-widest text-slate-500 mb-4 uppercase">Stored Principles</h3>
        {gameState.principles.length === 0 ? (
          <p className="text-sm font-garamond italic text-slate-600">No principles extracted yet...</p>
        ) : (
          <ul className="space-y-4">
            {gameState.principles.map((p, i) => (
              <li key={p.principle_id} className="group p-3 rounded bg-slate-800/30 border border-slate-700/50 hover:border-slate-500 transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] text-slate-500 font-cinzel">P-{i+1}</span>
                  <span className="text-[10px] text-slate-600 font-cinzel">Rnd {p.source_round}</span>
                </div>
                <p className="text-sm text-slate-300 font-garamond leading-relaxed">
                  {p.principle_summary}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {gameState.contradictions.length > 0 && (
        <div>
          <h3 className="text-xs font-cinzel tracking-widest text-red-900 mb-4 uppercase">Noted Contradictions</h3>
          <ul className="space-y-3">
            {gameState.contradictions.map((c, i) => (
              <li key={i} className="p-3 bg-red-950/20 border border-red-900/30 rounded">
                <p className="text-xs text-red-200 font-garamond leading-relaxed">
                  {c.explanation}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StatusBoard;
