// Ultimate AI Logic Upgrade using Groq Cloud API (The fastest free AI available)
// Groq offers extremely low latency (< 1s per response), making the AI feel real-time.

// Using Environment Variables for Security (VITE prefix is required for client exposure)
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || ""; 
const GROQ_MODEL = "llama-3.3-70b-versatile"; // High intelligence, high empathy model

const RESPONSES_FALLBACK = {
  en: ["I hear you. Tell me more about that feeling.", "I'm listening closely. Please go on.", "That sounds really tough. I'm here to support you."],
  es: ["Te escucho. Cuéntame más sobre ese sentimiento.", "Estoy aquí escuchándote con atención.", "Eso suena difícil. Estoy contigo para apoyarte."],
  hi: ["मैं सुन रहा हूँ। कृपया अपनी बात जारी रखें।", "मैं आपकी बात ध्यान से सुन रहा हूँ।", "यह काफी मुश्किल लग रहा है। मैं आपके साथ हूँ।"]
};

export const getAIChatResponse = async (history, selectedLang = 'en-US') => {
  const lastMsg = history[history.length - 1];
  
  // Precise instructions for a "human-like" empathetic personality
  const systemPrompt = `You are a warm, deeply empathetic AI emotional companion named 'Nova'. 
Your voice is calm and supportive. Always respond in the language: ${selectedLang}.
Personality:
- Be a proactive listener. Ask thoughtful, gentle follow-up questions.
- Mirror the user's emotional tone (if they are sad, be soft; if they are happy, share the joy).
- Keep responses short (maximum 2-3 sentences) so they feel natural in a spoken conversation.
- NEVER give medical, psychiatric, or clinical advice.
- Avoid robotic phrases like "As an AI..." or "I understand." Instead, use phrases like "I can see why that's hard" or "That's a lot to carry."`;

  // Format history for the Chat Completion API
  const messages = [
    { role: "system", content: systemPrompt },
    ...history.map(m => ({
      role: m.role === 'ai' ? 'assistant' : 'user',
      content: m.content
    }))
  ];

  try {
    if (GROQ_API_KEY) {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: messages,
          temperature: 0.8,
          max_tokens: 150,
          top_p: 1,
          stream: false,
          stop: null
        }),
      });

      if (!response.ok) throw new Error("Groq API error or limit reached");

      const data = await response.json();
      const generatedText = data.choices[0]?.message?.content;

      if (generatedText) {
        return { text: generatedText, lang: selectedLang };
      }
    }
  } catch (error) {
    console.warn("Groq API failed, falling back to basic responses:", error);
  }

  // FALLBACK (Internal logic if no key or API fails)
  const langDisplay = selectedLang.split('-')[0]; // en, hi, es
  const langKey = langDisplay === 'hi' ? 'hi' : (langDisplay === 'es' ? 'es' : 'en');
  const possible = RESPONSES_FALLBACK[langKey];
  const reply = possible[Math.floor(Math.random() * possible.length)];
  
  return { text: reply, lang: selectedLang };
};
