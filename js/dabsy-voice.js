window.DABSyVoice = (function () {
  let synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
  let preferredVoice = null;
  let isSpeaking = false;

  function init() {
    if (synth) {
      loadVoices();
      if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = loadVoices;
      }
    }
  }

  function loadVoices() {
    if (!synth) return;
    const voices = synth.getVoices();
    // Prioritize warm, clear English voices
    preferredVoice = voices.find(v => 
      v.name.includes('Samantha') || 
      v.name.includes('Google UK English Female') ||
      v.name.includes('Natural')
    ) || voices.find(v => v.lang.startsWith('en')) || voices[0];
  }

  function speak(text, onComplete) {
    const isVoiceEnabled = window.DABSyStorage.get('voice_enabled', true);

    // Show subtitles through unified event
    window.DABSyEvents.emit('SUBTITLE_REQUESTED', text);

    if (!synth || !isVoiceEnabled) {
      simulateSpeakingTiming(text, onComplete);
      return;
    }

    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.pitch = 1.08;
    utterance.rate = 1.0;

    utterance.onstart = () => {
      isSpeaking = true;
      window.DABSyEvents.emit('AI_STARTED_SPEAKING');
    };

    utterance.onend = () => {
      isSpeaking = false;
      window.DABSyEvents.emit('AI_FINISHED_SPEAKING');
      if (onComplete) onComplete();
    };

    utterance.onerror = () => {
      isSpeaking = false;
      window.DABSyEvents.emit('AI_FINISHED_SPEAKING');
      if (onComplete) onComplete();
    };

    synth.speak(utterance);
  }

  function simulateSpeakingTiming(text, onComplete) {
    window.DABSyEvents.emit('AI_STARTED_SPEAKING');
    const wordCount = text.split(/\s+/).length;
    const estimatedDuration = Math.max(1600, wordCount * 280);

    setTimeout(() => {
      window.DABSyEvents.emit('AI_FINISHED_SPEAKING');
      if (onComplete) onComplete();
    }, estimatedDuration);
  }

  function stop() {
    if (synth) synth.cancel();
    isSpeaking = false;
  }

  return {
    init,
    speak,
    stop,
    isSpeaking: () => isSpeaking
  };
})();

