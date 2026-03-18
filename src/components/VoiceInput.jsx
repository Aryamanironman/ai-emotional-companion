import React from 'react';
import { Mic, MicOff, Loader2, Volume2 } from 'lucide-react';

const VoiceInput = ({ state, onToggle }) => {
  const isListening = state === 'listening';
  const isSpeaking = state === 'speaking';
  const isProcessing = state === 'processing';

  return (
    <button 
      onClick={onToggle}
      disabled={isProcessing}
      className={`p-6 rounded-full transition-all duration-300 shadow-lg ${
        isListening ? 'bg-red-500 scale-110 shadow-red-500/50' : 
        isSpeaking ? 'bg-neon-cyan/20 scale-100 border border-neon-cyan/50 text-neon-cyan' :
        isProcessing ? 'bg-dark-700 text-gray-400' :
        'bg-neon-purple hover:bg-neon-purple/80 hover:shadow-neon-purple/50 shadow-neon-purple/20'
      }`}
    >
      {isListening ? <MicOff size={32} /> : 
       isSpeaking ? <Volume2 size={32} /> :
       isProcessing ? <Loader2 size={32} className="animate-spin" /> : 
       <Mic size={32} />}
    </button>
  );
};

export default VoiceInput;
