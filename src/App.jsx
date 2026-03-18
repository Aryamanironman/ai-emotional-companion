import React, { useState, useEffect, useRef } from 'react';
import Orb from './components/Orb';
import Controls from './components/Controls';
import ChatPanel from './components/ChatPanel';
import { SpeechService } from './utils/speech';
import { synthesizeSpeech, stopSpeech } from './utils/tts';
import { getAIChatResponse } from './utils/ai';
import { detectEmotion } from './utils/emotion';
import { AlertTriangle } from 'lucide-react';

function App() {
  const [appState, setAppState] = useState('idle'); // 'idle', 'listening', 'processing', 'speaking'
  const [chatHistory, setChatHistory] = useState([]);
  const [detectedLanguage, setDetectedLanguage] = useState('en-US'); // This is the user-selected code (e.g. en-US, es-ES, hi-IN)
  const [currentEmotion, setCurrentEmotion] = useState('neutral');
  const [transcript, setTranscript] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [textInput, setTextInput] = useState('');
  
  const speechServiceRef = useRef(null);
  const callbacksRef = useRef({});

  // Essential to avoid stale closures in the long-lived SpeechService
  useEffect(() => {
    callbacksRef.current = {
      handleUserMessage,
      setTranscript,
      setAppState,
      setErrorMessage
    };
  }, [chatHistory, appState]); // Update whenever critical state changes

  useEffect(() => {
    // Initialize Web Speech API
    speechServiceRef.current = new SpeechService({
      onResult: (text, isFinal) => {
        callbacksRef.current.setTranscript(text);
        if (isFinal && text.trim().length > 0) {
          callbacksRef.current.handleUserMessage(text);
        }
      },
      onStart: () => callbacksRef.current.setAppState('listening'),
      onEnd: () => {
        callbacksRef.current.setAppState(prev => prev === 'listening' ? 'idle' : prev);
      },
      onError: (err) => {
        console.error("Speech Error:", err);
        const code = err?.error || "unknown";
        if (code === 'not-allowed') {
          callbacksRef.current.setErrorMessage("Microphone access denied. Please allow permissions.");
        } else if (code !== 'no-speech') {
          callbacksRef.current.setErrorMessage(`Speech recognition error: ${code}`);
        }
        callbacksRef.current.setAppState('idle');
      }
    });

    if (!speechServiceRef.current.recognition) {
      setErrorMessage("Speech Recognition API is not supported in this browser. Please try Chrome.");
    }

    return () => {
      speechServiceRef.current?.stop();
      stopSpeech();
    };
  }, []);

  const handleUserMessage = async (text) => {
    // 1. Stop Speech Recognition
    speechServiceRef.current?.stop();
    setAppState('processing');
    
    // Check simple emotion
    const tone = detectEmotion(text);
    setCurrentEmotion(tone);

    // Update Chat History
    const newUserMsg = { role: 'user', content: text, emotion: tone };
    setChatHistory(prev => [...prev, newUserMsg]);
    setTranscript('');

    try {
      // 2. LLM Call
      // Now passing the explicitly selected language to the AI logic
      const res = await getAIChatResponse([...chatHistory, newUserMsg], detectedLanguage);
      const { text: aiText, lang } = res;
      // We keep the selected language or follow AI if it insists, but mostly trust selected
      const finalLang = lang || detectedLanguage;

      const newAiMsg = { role: 'ai', content: aiText };
      setChatHistory(prev => [...prev, newAiMsg]);

      // 3. TTS Call
      setAppState('speaking');
      synthesizeSpeech(aiText, finalLang, () => {
        setAppState(prev => prev === 'speaking' ? 'idle' : prev);
      });
      
    } catch (error) {
      console.error(error);
      const errorMsg = { role: 'ai', content: "I'm having trouble processing that right now." };
      setChatHistory(prev => [...prev, errorMsg]);
      setAppState('idle');
    }
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (textInput.trim()) {
      handleUserMessage(textInput);
      setTextInput('');
    }
  };

  const handleMicClick = () => {
    if (appState === 'listening') {
      speechServiceRef.current?.stop();
      setAppState('idle');
    } else if (appState === 'speaking') {
      stopSpeech();
      setAppState('idle');
    } else {
      stopSpeech();
      try {
        setErrorMessage(''); // Clear previous errors
        if (!speechServiceRef.current?.recognition) {
           setErrorMessage("Your browser does not support the Web Speech API. Please use Chrome or Edge.");
           return;
        }
        speechServiceRef.current?.start(detectedLanguage);
      } catch (e) {
        setErrorMessage(e.message || "Failed to start microphone");
      }
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex text-white relative flex-col lg:flex-row font-sans">
      {/* Disclaimer */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-2 bg-dark-800/80 backdrop-blur-md px-4 py-2 rounded-full border border-dark-700 text-[10px] md:text-xs text-gray-400 whitespace-nowrap">
        <AlertTriangle size={14} className="text-yellow-500" />
        AI provides emotional support only. Not a licensed therapist.
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col items-center justify-center relative p-8 h-screen pt-24 overflow-hidden">
        
        {errorMessage && (
          <div className="absolute top-20 bg-red-500/80 text-white px-6 py-3 rounded-lg z-50 shadow-xl backdrop-blur-md animate-pulse">
            {errorMessage}
          </div>
        )}

        <Orb state={appState} emotion={currentEmotion} transcript={transcript} />
        
        <div className="absolute bottom-6 w-full flex flex-col items-center gap-6 px-4">
          
          {/* Text Input Layout */}
          <form onSubmit={handleTextSubmit} className="w-full max-w-lg flex gap-2">
            <input 
              type="text" 
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Type your feelings here..."
              disabled={appState === 'processing' || appState === 'speaking'}
              className="flex-1 bg-dark-800/80 border border-dark-700/50 rounded-full px-6 py-3 text-sm focus:outline-none focus:border-neon-purple/50 transition-all backdrop-blur-md"
            />
            {textInput.trim() && (
              <button 
                type="submit"
                className="bg-neon-purple text-white px-6 rounded-full text-sm font-medium hover:bg-neon-purple/90 transition-all"
              >
                Send
              </button>
            )}
          </form>

          <Controls 
            state={appState}
            onToggleMic={handleMicClick}
            language={detectedLanguage}
            setLanguage={setDetectedLanguage}
          />
        </div>
      </div>

      {/* Side Chat Panel */}
      <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-dark-700 bg-dark-800 h-screen overflow-hidden flex flex-col z-30">
        <ChatPanel history={chatHistory} />
      </div>
    </div>
  );
}

export default App;
