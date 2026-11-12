export interface MufradatItem {
  id: string;
  arabic: string;
  transliteration: string;
  meaning: string;
  category: "penyakit" | "medis" | "tindakan" | "doa";
  exampleArabic?: string;
  exampleIndo?: string;
  iconName?: string;
}

export interface DialogueLine {
  speaker: string;
  arabic: string;
  transliteration: string;
  translation: string;
  avatarRole: "doctor" | "friend" | "patient" | "student";
}

export interface DialogueScene {
  id: string;
  title: string;
  titleArabic: string;
  description: string;
  dialogue: DialogueLine[];
}

export interface ReadingParagraph {
  arabic: string;
  transliteration: string;
  translation: string;
}

export interface ReadingText {
  id: string;
  title: string;
  titleArabic: string;
  source: string;
  paragraphs: ReadingParagraph[];
  comprehensionQuestions: {
    id: string;
    questionArabic: string;
    questionIndo: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }[];
}

export interface FiilTasrif {
  dhomir: string;
  dhomirMeaning: string;
  fiilMadhi: string;
  fiilMudhari: string;
  fiilAmr?: string;
  suffix: string;
  suffixMeaning: string;
  example: string;
}

export interface QuizQuestion {
  id: number;
  questionArabic: string;
  questionIndo: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  type: "istima" | "kalam" | "qiraah" | "kitabah" | "tarkib";
  audioText?: string;
}

export interface TarkibAnalysisResult {
  isCorrect: boolean;
  score: number;
  correctedArabic: string;
  indonesianTranslation: string;
  fiilMadhi: string;
  fail: string;
  explanation: string;
  praiseOrAdvice: string;
}
