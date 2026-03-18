import React from 'react';

const Orb = ({ state, emotion, transcript }) => {
  // Determine color based on emotion and state
  let orbColor = 'bg-neon-blue shadow-[0_0_50px_#3b82f6]';
  if (state === 'listening') orbColor = 'bg-neon-purple shadow-[0_0_80px_#8b5cf6] animate-pulse-slow';
  if (state === 'speaking') orbColor = 'bg-neon-cyan shadow-[0_0_100px_#06b6d4] animate-wave';
  if (state === 'processing') orbColor = 'bg-gray-400 shadow-[0_0_20px_#9ca3af] animate-spin';

  // Specific emotion overrides when not processing/speaking
  if (state === 'idle') {
    if (emotion === 'sad') orbColor = 'bg-blue-400 shadow-[0_0_30px_#60a5fa]';
    if (emotion === 'anxious') orbColor = 'bg-yellow-400 shadow-[0_0_30px_#facc15]';
    if (emotion === 'happy') orbColor = 'bg-green-400 shadow-[0_0_30px_#4ade80]';
  }

  return (
    <div className="flex flex-col items-center justify-center grow h-full relative">
      
      {/* Voice Wave Effect (Around Orb) - Only visible when speaking or listening */}
      {(state === 'speaking' || state === 'listening') && (
        <div className="absolute flex items-center justify-center w-64 h-64 md:w-96 md:h-96">
          <div className={`absolute w-full h-full border rounded-full ${state === 'speaking' ? 'border-neon-cyan animate-ripple' : 'border-neon-purple animate-pulse'}`} />
          <div className={`absolute w-4/5 h-4/5 border rounded-full ${state === 'speaking' ? 'border-neon-cyan animate-ripple' : 'border-neon-purple animate-pulse'}`} style={{ animationDelay: '0.4s' }} />
          <div className={`absolute w-3/5 h-3/5 border rounded-full ${state === 'speaking' ? 'border-neon-cyan animate-ripple' : 'border-neon-purple animate-pulse'}`} style={{ animationDelay: '0.8s' }} />
        </div>
      )}

      {/* Main AI Orb */}
      <div className={`w-32 h-32 md:w-48 md:h-48 rounded-full transition-all duration-700 ease-in-out z-10 ${orbColor}`}></div>
      
      {/* Current Transcript Feedback */}
      {transcript && (
        <div className="absolute bottom-1/4 max-w-md text-center bg-dark-800/60 p-4 rounded-xl backdrop-blur-sm border border-dark-700 shadow-xl z-20">
          <p className="text-gray-200 text-lg font-light leading-relaxed truncate px-2">{transcript}</p>
        </div>
      )}
    </div>
  );
};

export default Orb;
