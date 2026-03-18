// Web Speech API for Text-To-Speech

const getBestVoice = (lang) => {
  const voices = window.speechSynthesis.getVoices();
  // Try to find a voice that matches the language
  const expectedLang = lang.substring(0, 2).toLowerCase();
  
  // Preferably pick a calm sounding voice, female often sounds more like standard assistants.
  // E.g., Google variants usually sound cleaner.
  let best = voices.find(v => v.lang.toLowerCase().startsWith(expectedLang) && v.name.includes("Google"));
  if (!best) {
    best = voices.find(v => v.lang.toLowerCase().startsWith(expectedLang) && v.name.includes("Natural"));
  }
  if (!best) {
    best = voices.find(v => v.lang.toLowerCase().startsWith(expectedLang));
  }
  return best || voices[0];
};

export const synthesizeSpeech = (text, lang = 'en-US', onEnd) => {
  if (!window.speechSynthesis) {
    console.warn("Speech Synthesis API not supported.");
    if (onEnd) onEnd();
    return;
  }

  // To ensure the voice list is loaded (Chrome quirk)
  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = getBestVoice(lang);
    
    if (voice) {
      utterance.voice = voice;
    }
    
    utterance.lang = lang;
    utterance.rate = 0.9; // Calm, slightly slower pace
    utterance.pitch = 1.0;
    
    utterance.onend = () => {
      if (onEnd) onEnd();
    };
    
    utterance.onerror = (e) => {
      console.error("Speech Synthesis Error:", e);
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  };

  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = speak;
  } else {
    speak();
  }
};

export const stopSpeech = () => {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};
