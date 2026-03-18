// Basic Keyword-based Emotion Detection Module

const EMOTION_KEYWORDS = {
  sad: ['sad', 'depressed', 'cry', 'lonely', 'unhappy', 'hopeless', 'tired', 'exhausted', 'hurt', 'triste', 'llorar', 'deprimido', 'solitario', 'dukh', 'rona', 'udaas'],
  anxious: ['anxious', 'worried', 'nervous', 'scared', 'panic', 'stress', 'ansioso', 'preocupado', 'daro', 'chinta'],
  happy: ['happy', 'joy', 'excited', 'great', 'good', 'wonderful', 'amazing', 'feliz', 'contento', 'khush', 'badiya'],
};

export const detectEmotion = (text) => {
  const words = text.toLowerCase().split(/\W+/);
  
  let scores = {
    sad: 0,
    anxious: 0,
    happy: 0,
    neutral: 0
  };

  words.forEach(word => {
    for (const [emotion, keywords] of Object.entries(EMOTION_KEYWORDS)) {
      if (keywords.includes(word)) {
        scores[emotion]++;
      }
    }
  });

  // Find max
  const entries = Object.entries(scores);
  let dominant = 'neutral';
  let maxScore = 0;

  for (const [emotion, score] of entries) {
    if (score > maxScore) {
      maxScore = score;
      dominant = emotion;
    }
  }

  return maxScore > 0 ? dominant : 'neutral';
};
