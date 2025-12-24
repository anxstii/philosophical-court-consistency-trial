
import React from 'react';
import { Message } from '../types';

interface MessageListProps {
  history: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ history }) => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-8">
      {history.map((msg, i) => (
        <div 
          key={i} 
          className={`flex flex-col ${msg.role === 'player' ? 'items-end' : 'items-start'}`}
        >
          <div className={`max-w-[90%] md:max-w-[80%] ${
            msg.role === 'player' 
              ? 'bg-slate-800 text-slate-100 rounded-tl-2xl rounded-tr-lg rounded-bl-2xl p-4 shadow-lg border border-slate-700' 
              : 'text-slate-200 p-2'
          }`}>
            {msg.role === 'court' && (
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs">⚖️</div>
                <span className="text-[10px] font-cinzel tracking-widest text-slate-500 uppercase">The Court</span>
              </div>
            )}
            
            <p className={`whitespace-pre-wrap leading-relaxed ${
              msg.role === 'player' ? 'text-base font-inter' : 'text-xl font-garamond'
            }`}>
              {msg.content}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
