
import React, { useState, useEffect, useRef } from 'react';
import { GameState, GamePhase, Message, TrialResult } from './types';
import { processTurn } from './services/geminiService';
import StatusBoard from './components/StatusBoard';
import MessageList from './components/MessageList';
import MoralReport from './components/MoralReport';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    round: 0,
    score: 100,
    principles: [],
    contradictions: [],
    history: [],
    phase: GamePhase.START,
  });
  const [userInput, setUserInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [gameState.history]);

  const handleStart = async () => {
    setIsProcessing(true);
    setGameState(prev => ({ ...prev, phase: GamePhase.LOADING }));
    try {
      const result = await processTurn(gameState, "The player is ready to begin.");
      updateGameState(result, "system");
    } catch (error) {
      setGameState(prev => ({ ...prev, phase: GamePhase.FAILED }));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSend = async () => {
    if (!userInput.trim() || isProcessing) return;

    const currentInput = userInput;
    setUserInput('');
    setIsProcessing(true);

    const newHistory: Message[] = [
      ...gameState.history,
      { role: 'player', content: currentInput }
    ];

    setGameState(prev => ({ ...prev, history: newHistory }));

    try {
      const result = await processTurn({ ...gameState, history: newHistory }, currentInput);
      updateGameState(result, 'player');
    } catch (error) {
      setGameState(prev => ({ ...prev, phase: GamePhase.FAILED }));
    } finally {
      setIsProcessing(false);
    }
  };

  const updateGameState = (result: TrialResult, source: 'player' | 'system') => {
    setGameState(prev => {
      const updatedPrinciples = result.new_principle 
        ? [...prev.principles, result.new_principle] 
        : prev.principles;
      
      const updatedContradictions = result.new_contradiction 
        ? [...prev.contradictions, result.new_contradiction] 
        : prev.contradictions;

      const updatedScore = Math.max(0, prev.score + result.score_delta);
      const isGameOver = updatedScore <= 0 || result.next_step === 'final_report';

      return {
        ...prev,
        round: result.next_step === 'dilemma' ? prev.round + 1 : prev.round,
        score: updatedScore,
        principles: updatedPrinciples,
        contradictions: updatedContradictions,
        history: [...prev.history, { role: 'court', content: result.content }],
        phase: isGameOver ? GamePhase.FINAL_REPORT : GamePhase.WAITING_FOR_USER,
        final_summary: result.final_summary,
        consistency_report: result.consistency_report
      };
    });
  };

  if (gameState.phase === GamePhase.FINAL_REPORT) {
    return <MoralReport gameState={gameState} onRestart={() => window.location.reload()} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row font-inter selection:bg-blue-500/30">
      {/* Sidebar: Status and Principles */}
      <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-900/50 p-6 flex flex-col gap-6">
        <StatusBoard gameState={gameState} />
      </div>

      {/* Main Trial Area */}
      <div className="flex-1 flex flex-col h-[70vh] md:h-screen relative overflow-hidden">
        {/* Header */}
        <header className="p-4 border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-10 flex justify-between items-center">
          <h1 className="font-cinzel text-xl tracking-widest text-slate-200">Consistency Trial</h1>
          <div className="text-xs uppercase tracking-tighter text-slate-500 font-medium">Session: Internal Moral Review</div>
        </header>

        {/* Dialogue */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth">
          {gameState.phase === GamePhase.START ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 max-w-xl mx-auto">
              <div className="w-20 h-20 rounded-full border border-slate-700 flex items-center justify-center text-4xl animate-pulse">
                ⚖️
              </div>
              <p className="font-garamond text-2xl italic text-slate-400">
                "This court does not judge what is right. It judges whether you remain consistent with yourself."
              </p>
              <button
                onClick={handleStart}
                className="px-8 py-3 bg-slate-200 text-slate-950 font-cinzel tracking-widest hover:bg-white transition-colors duration-300 disabled:opacity-50"
                disabled={isProcessing}
              >
                Enter the Court
              </button>
            </div>
          ) : (
            <MessageList history={gameState.history} />
          )}

          {isProcessing && (
            <div className="flex items-center space-x-2 text-slate-500 font-garamond italic">
              <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-.3s]" />
              <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-.5s]" />
              <span>The Court is deliberating...</span>
            </div>
          )}
        </div>

        {/* Input */}
        {gameState.phase === GamePhase.WAITING_FOR_USER && (
          <div className="p-4 md:p-8 border-t border-slate-800 bg-slate-900/30">
            <div className="max-w-4xl mx-auto flex gap-4">
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Explain your reasoning to the court..."
                className="flex-1 bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-600 resize-none h-20"
              />
              <button
                onClick={handleSend}
                disabled={isProcessing || !userInput.trim()}
                className="px-6 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-cinzel tracking-widest disabled:opacity-50"
              >
                Reply
              </button>
            </div>
            <p className="text-[10px] text-center mt-4 uppercase tracking-[0.2em] text-slate-600">
              Silence from the court is not consent. Every word is a binding precedent.
            </p>
          </div>
        )}

        {gameState.phase === GamePhase.FAILED && (
          <div className="p-8 text-center text-red-400">
            A fatal error occurred in the proceedings. <button onClick={() => window.location.reload()} className="underline">Restart Trial</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
