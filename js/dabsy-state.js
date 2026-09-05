window.DABSyState = (function () {
  const STATES = {
    IDLE: 'IDLE',
    LISTENING: 'LISTENING',
    THINKING: 'THINKING',
    SPEAKING: 'SPEAKING',
    CURIOUS: 'CURIOUS',
    HAPPY: 'HAPPY',
    FOCUSED: 'FOCUSED',
    SLEEPY: 'SLEEPY',
    SURPRISED: 'SURPRISED',
    PLAYFUL: 'PLAYFUL',
    STUDY_FOCUS: 'STUDY_FOCUS',
    EXPLAINING: 'EXPLAINING',
    QUIZ: 'QUIZ',
    REACTING: 'REACTING'
  };

  let currentState = STATES.IDLE;
  let previousState = STATES.IDLE;

  function transition(newState, metadata = {}) {
    if (!STATES[newState]) {
      console.warn(`[DABSy:State] Unknown state target: ${newState}`);
      return false;
    }
    if (currentState === newState) return true;

    previousState = currentState;
    currentState = newState;

    window.DABSyEvents.emit('STATE_CHANGED', {
      current: currentState,
      previous: previousState,
      meta: metadata
    });
    return true;
  }

  function get() {
    return currentState;
  }

  function getPrevious() {
    return previousState;
  }

  return {
    STATES,
    transition,
    get,
    getPrevious
  };
})();

