export class TTSService {
  static getSynth() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      return window.speechSynthesis;
    }
    return null;
  }

  static playBeepSound() {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 note
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5 note

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  static speak(text, lang = 'hi') {
    if (!text) return;

    // 1. Play subtle audio chime confirmation
    this.playBeepSound();

    // 2. Dispatch custom event so UI can show Floating Audio Toast & Soundwave
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('punarjyoti_audio_speak', {
        detail: { text, lang, timestamp: Date.now() },
      });
      window.dispatchEvent(event);
    }

    // 3. Web Speech Synthesis Execution
    const synth = this.getSynth();
    if (!synth) {
      console.warn('Speech synthesis not supported in this browser.');
      return;
    }

    try {
      synth.cancel();
    } catch {}

    setTimeout(() => {
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        
        let targetLangTag = 'hi-IN';
        if (lang === 'mr') targetLangTag = 'mr-IN';
        if (lang === 'te') targetLangTag = 'te-IN';
        if (lang === 'kn') targetLangTag = 'kn-IN';
        if (lang === 'ta') targetLangTag = 'ta-IN';
        if (lang === 'gu') targetLangTag = 'gu-IN';
        if (lang === 'bn') targetLangTag = 'bn-IN';
        if (lang === 'en') targetLangTag = 'en-IN';

        utterance.lang = targetLangTag;
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        // Try selecting matching voice if available
        const voices = synth.getVoices();
        if (voices && voices.length > 0) {
          const matchedVoice = voices.find(v => 
            v.lang.toLowerCase() === targetLangTag.toLowerCase() ||
            v.lang.toLowerCase().startsWith(lang.toLowerCase())
          );
          if (matchedVoice) {
            utterance.voice = matchedVoice;
          }
        }

        synth.speak(utterance);
      } catch (err) {
        console.error('Speech synthesis execution error:', err);
      }
    }, 50);
  }

  static stop() {
    const synth = this.getSynth();
    if (synth) {
      try {
        synth.cancel();
      } catch {}
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('punarjyoti_audio_stop'));
    }
  }
}
