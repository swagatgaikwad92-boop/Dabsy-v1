window.DABSy = (function () {
  let initialized = false;

  async function boot() {
    if (initialized) return;

    // 1. Storage & State initialization
    window.DABSyMemory.init();
    window.DABSyScheduler.init();
    window.DABSyContext.init();

    // 2. Visual & Kinetic engines
    window.DABSyMotion.start();
    window.DABSyEyes.init();
    window.DABSyTie.init();

    // 3. Cognitive & Audio subsystems
    window.DABSyVoice.init();
    window.DABSyBehaviour.init();
    window.DABSyNotifications.init();
    window.DABSyUI.renderSubtitles();
    window.DABSyWorld.init();
    window.DABSyInteraction.init();

    // 4. Cinematic Wake-up Sequence
    runWakeUpSequence();

    initialized = true;
    console.log('[D.A.B.s.y] Neural core online.');
  }

  function runWakeUpSequence() {
    const veil = document.getElementById('veil');
    const eyeLeft = document.getElementById('eye-left');
    const eyeRight = document.getElementById('eye-right');

    // Phase 1: Deep darkness veil lifts
    setTimeout(() => {
      if (veil) veil.classList.add('awakened');
    }, 400);

    // Phase 2: Blurred, unfocused eyes gradually clarify
    if (eyeLeft && eyeRight) {
      eyeLeft.style.filter = 'blur(16px)';
      eyeRight.style.filter = 'blur(16px)';
      eyeLeft.style.opacity = '0.3';
      eyeRight.style.opacity = '0.3';

      setTimeout(() => {
        eyeLeft.style.transition = 'filter 2s ease, opacity 2s ease';
        eyeRight.style.transition = 'filter 2s ease, opacity 2s ease';
        eyeLeft.style.filter = 'blur(0px)';
        eyeRight.style.filter = 'blur(0px)';
        eyeLeft.style.opacity = '1';
        eyeRight.style.opacity = '1';
      }, 1100);
    }

    // Phase 3: First autonomous gaze sweep, looking at the user
    setTimeout(() => {
      window.DABSyEyes.setGaze(-0.35, -0.1);
      setTimeout(() => {
        window.DABSyEyes.setGaze(0.35, -0.1);
        setTimeout(() => {
          window.DABSyEyes.setGaze(0, 0);
          window.DABSyEyes.triggerBlink();
        }, 900);
      }, 900);
    }, 2800);
  }

  return {
    boot,
    state: window.DABSyState,
    events: window.DABSyEvents,
    eyes: window.DABSyEyes,
    expression: window.DABSyExpression,
    voice: window.DABSyVoice,
    world: window.DABSyWorld
  };
})();

