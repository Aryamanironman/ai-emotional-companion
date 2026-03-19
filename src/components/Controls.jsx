import React from 'react';
import { Globe } from 'lucide-react';
import VoiceInput from './VoiceInput';

const LANGUAGES = [
  { code: 'en-US', label: 'English' },
  { code: 'hi-IN', label: 'हिंदी (Hindi)' },
  { code: 'pa-IN', label: 'ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'es-ES', label: 'Español (Spanish)' },
  { code: 'fr-FR', label: 'Français (French)' },
  { code: 'de-DE', label: 'Deutsch (German)' },
  { code: 'it-IT', label: 'Italiano (Italian)' },
  { code: 'pt-BR', label: 'Português (Portuguese)' },
  { code: 'ja-JP', label: '日本語 (Japanese)' },
  { code: 'ko-KR', label: '한국어 (Korean)' },
  { code: 'zh-CN', label: '中文 (Chinese)' },
  { code: 'ru-RU', label: 'Русский (Russian)' },
  { code: 'ar-SA', label: 'العربية (Arabic)' },
  { code: 'tr-TR', label: 'Türkçe (Turkish)' }
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
          className="bg-transparent text-sm text-gray-200 outline-none cursor-pointer font-medium appearance-none pr-8 relative"
        >
          {LANGUAGES.map(lang => (
            <option key={lang.code} value={lang.code} className="bg-dark-800 text-white">
              {lang.label}
            </option>
          ))}
        </select>
        {/* Simple down arrow icon placeholder since appearance-none was used */}
        <div className="absolute right-6 pointer-events-none text-gray-500">▼</div>
      </div>

    </div>
  );
};

export default Controls;
