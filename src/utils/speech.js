// Web Speech API wrapper for Speech Recognition
// Configured to be as patient as possible for user speech.

export class SpeechService {
  constructor({ onResult, onStart, onEnd, onError }) {
    this.recognition = null;
    this.isListening = false;
    
    // Check both standard and webkit prefixes
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      
      // Keep listening even if the user pauses briefly
      this.recognition.continuous = true;
      
      // Let us see what they're saying as they say it for UI feedback
      this.recognition.interimResults = true;
      
      this.recognition.onstart = () => {
        this.isListening = true;
        if (onStart) onStart();
      };
      
      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        // Always send updates to onResult
        if (onResult) {
          onResult(interimTranscript || finalTranscript, !!finalTranscript);
        }
      };
      
      this.recognition.onerror = (event) => {
        if (event.error === 'no-speech') {
          // No big deal, just keep the state correct.
          return;
        }
        this.isListening = false;
        console.error("Speech recognition error:", event.error);
        if (onError) onError(event);
      };
      
      this.recognition.onend = () => {
        this.isListening = false;
        if (onEnd) onEnd();
      };
    } else {
      console.warn("Speech Recognition API not supported in this browser.");
    }
  }

  start(lang = 'en-US') {
    if (!this.recognition) return;
    if (this.isListening) return;

    // Set English as a generic base but allows it to hear other sounds.
    // Explicitly resetting the language each time.
    this.recognition.lang = lang || 'en-US'; 
    
    try {
      this.recognition.start();
    } catch(e) {
      // If it's already started, this might throw, so we catch it.
      if (e.name !== 'InvalidStateError') {
        console.error("Failed to start speech recognition:", e);
        throw e;
      }
    }
  }

  stop() {
    if (!this.recognition) return;
    if (this.isListening) {
      try {
        this.recognition.stop();
        this.isListening = false;
      } catch (e) {
        console.error("Failed to stop speech recognition:", e);
      }
    }
  }
}
