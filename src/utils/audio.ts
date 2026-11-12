// Web Speech API Arabic Text-to-Speech Utility

class ArabicAudioPlayer {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking: boolean = false;
  private listeners: Set<(isSpeaking: boolean) => void> = new Set();

  constructor() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public subscribe(listener: (isSpeaking: boolean) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(status: boolean) {
    this.isSpeaking = status;
    this.listeners.forEach((listener) => listener(status));
  }

  public speak(text: string, rate: number = 0.85): Promise<void> {
    return new Promise((resolve) => {
      if (!this.synth) {
        console.warn("Speech Synthesis not supported in this browser.");
        resolve();
        return;
      }

      this.stop();

      // Clean diacritics slightly if necessary, but Arabic synth reads harakat accurately
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ar-SA"; // Saudi Arabic
      utterance.rate = rate; // Slightly slower for language learners
      utterance.pitch = 1.0;

      // Find best available Arabic voice
      const voices = this.synth.getVoices();
      const arabicVoice =
        voices.find(
          (v) =>
            v.lang.startsWith("ar") &&
            (v.name.includes("Maged") ||
              v.name.includes("Arabic") ||
              v.name.includes("Tarik") ||
              v.name.includes("Laila") ||
              v.name.includes("Google") ||
              v.name.includes("Natural"))
        ) || voices.find((v) => v.lang.startsWith("ar"));

      if (arabicVoice) {
        utterance.voice = arabicVoice;
      }

      utterance.onstart = () => {
        this.notify(true);
      };

      utterance.onend = () => {
        this.notify(false);
        resolve();
      };

      utterance.onerror = (e) => {
        console.warn("Speech error:", e);
        this.notify(false);
        resolve();
      };

      this.currentUtterance = utterance;
      this.synth.speak(utterance);
    });
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.notify(false);
    }
  }

  public getSpeakingStatus(): boolean {
    return this.isSpeaking;
  }
}

export const arabicAudio = new ArabicAudioPlayer();
