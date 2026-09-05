import { Language } from '../types';

export class TTSService {
  private static synth = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;

  static speak(text: string, lang: Language = 'hi'): void {
    if (!this.synth) {
      console.warn('Speech synthesis not supported in this browser environment.');
      return;
    }

    // Cancel any ongoing speech
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set appropriate language code
    switch (lang) {
      case 'hi':
        utterance.lang = 'hi-IN';
        break;
      case 'mr':
        utterance.lang = 'mr-IN';
        break;
      case 'en':
        utterance.lang = 'en-IN';
        break;
    }

    utterance.rate = 0.9; // Slightly slower speed for clarity
    utterance.pitch = 1.0;

    this.synth.speak(utterance);
  }

  static stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}
