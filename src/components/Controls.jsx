import React from 'react';
import { Globe } from 'lucide-react';
import VoiceInput from './VoiceInput';

const LANGUAGES = [
  { code: 'en-US', label: 'English' },
  { code: 'hi-IN', label: 'हिंदी (Hindi)' },
  { code: 'es-ES', label: 'Español (Spanish)' }
];

const Controls = ({ state, onToggleMic, language, setLanguage }) => {
  return (
    <div className="flex flex-col items-center gap-4">
      
      {/* Voice Input Button */}
      <VoiceInput state={state} onToggle={onToggleMic} />
      
      {/* Language Selection Dropdown */}
      <div className="flex items-center gap-2 bg-dark-800/90 px-4 py-2 rounded-full border border-dark-700 shadow-xl backdrop-blur-sm">
        <Globe size={18} className="text-neon-purple animate-pulse-slow" />
        <select 
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-transparent text-sm text-gray-200 outline-none cursor-pointer font-medium appearance-none pr-4"
        >
          {LANGUAGES.map(lang => (
            <option key={lang.code} value={lang.code} className="bg-dark-800 text-white">
              {lang.label}
            </option>
          ))}
        </select>
      </div>

    </div>
  );
};

export default Controls;
