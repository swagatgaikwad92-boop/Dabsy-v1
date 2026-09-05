window.DABSyBehaviour = (function () {
  function init() {
    window.DABSyEvents.on('USER_TAPPED', handleTap);
    window.DABSyEvents.on('AI_STARTED_SPEAKING', () => {
      window.DABSyExpression.set('speaking');
    });
    window.DABSyEvents.on('AI_FINISHED_SPEAKING', () => {
      window.DABSyExpression.set('neutral');
    });
  }

  function handleTap({ x, y, normalizedX }) {
    // Glance toward tap coordinate
    const gazeTargetX = (normalizedX - 0.5) * 1.6;
    window.DABSyEyes.setGaze(gazeTargetX, 0);

    const currentState = window.DABSyState.get();
    if (currentState === 'IDLE') {
      window.DABSyExpression.set('curious', 1800);
      window.DABSyEyes.triggerBlink();
    }

    setTimeout(() => {
      if (window.DABSyState.get() === 'IDLE') {
        window.DABSyEyes.setGaze(0, 0);
      }
    }, 1400);
  }

  async function processUserPrompt(promptText) {
    window.DABSyState.transition('THINKING');
    window.DABSyExpression.set('thinking');
    window.DABSyEyes.setGaze(0.2, -0.3);

    const result = await window.DABSyAI.generateResponse(promptText);

    window.DABSyState.transition('SPEAKING');
    window.DABSyExpression.set(result.expression || 'neutral');
    window.DABSyEyes.setGaze(0, 0);

    window.DABSyVoice.speak(result.speech, () => {
      window.DABSyState.transition('IDLE');
      window.DABSyExpression.set('neutral');
    });

    if (result.action) {
      handleCognitiveAction(result.action);
    }
  }

  function handleCognitiveAction(action) {
    if (action.type === 'SCHEDULE_TASK') {
      window.DABSyPermissions.handleActionRequest('SCHEDULE', action.payload, () => {
        window.DABSyScheduler.addCommitment({
          title: action.payload.title,
          start: '19:30',
          end: '21:00',
          fixed: false
        });
      });
    }
  }

  return {
    init,
    processUserPrompt
  };
})();

