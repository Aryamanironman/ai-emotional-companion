import React, { useEffect, useRef } from 'react';

const ChatPanel = ({ history }) => {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  return (
    <div className="flex flex-col h-full bg-dark-800 p-4">
      <div className="flex items-center justify-between pb-4 border-b border-dark-700 mb-4">
        <h2 className="text-lg font-semibold text-gray-200">Session History</h2>
        <span className="text-xs text-gray-500">{history.length} messages</span>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {history.length === 0 ? (
          <div className="text-center text-gray-500 mt-10 text-sm">
            No history yet. Tap the microphone to start sharing.
          </div>
        ) : (
          history.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div 
                className={`max-w-[85%] rounded-2xl p-4 shadow-md ${
                  msg.role === 'user' 
                    ? 'bg-neon-purple/20 text-blue-50 rounded-br-sm border border-neon-purple/30' 
                    : 'bg-dark-700 text-gray-200 rounded-bl-sm border border-dark-600'
                }`}
              >
                <p className="text-md font-light leading-relaxed">{msg.content}</p>
                {msg.emotion && msg.emotion !== 'neutral' && msg.role === 'user' && (
                  <span className="text-[10px] uppercase opacity-50 mt-2 block tracking-wider">Tone: {msg.emotion}</span>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
};

export default ChatPanel;
