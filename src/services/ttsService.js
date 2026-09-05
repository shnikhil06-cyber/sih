export class TTSService {
  static synth = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;

  static speak(text, lang = 'hi') {
    if (!this.synth) {
      console.warn('Speech synthesis not supported in this browser environment.');
      return;
    }

    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
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

    utterance.rate = 0.9;
    utterance.pitch = 1.0;

    this.synth.speak(utterance);
  }

  static stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}
