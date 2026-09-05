window.DABSyInteraction = (function () {
  let lastTapTime = 0;
  let tapTimeout = null;

  function init() {
    const stage = document.getElementById('dabsy-stage');
    const tie = document.getElementById('tie-container');
    const inputOverlay = document.getElementById('input-overlay');
    const queryInput = document.getElementById('query-input');
    const submitBtn = document.getElementById('btn-submit-query');

    // Stage Tap / Double Tap
    if (stage) {
      stage.addEventListener('pointerdown', (e) => {
        // Prevent click absorption if targeting interactive buttons
        if (e.target.closest('button, input, select, [role="button"]')) return;

        const now = Date.now();
        const delta = now - lastTapTime;

        if (delta < 320) {
          clearTimeout(tapTimeout);
          // Cinematic Double Tap: Open or Close World
          if (window.DABSyWorld.isOpen()) {
            window.DABSyWorld.close();
          } else {
            window.DABSyWorld.open();
          }
          lastTapTime = 0;
        } else {
          lastTapTime = now;
          tapTimeout = setTimeout(() => {
            const rect = stage.getBoundingClientRect();
            const normalizedX = (e.clientX - rect.left) / rect.width;
            const normalizedY = (e.clientY - rect.top) / rect.height;
            window.DABSyEvents.emit('USER_TAPPED', {
              x: e.clientX,
              y: e.clientY,
              normalizedX,
              normalizedY
            });
          }, 240);
        }
      });
    }

    // Bow Tie Tap: Downward glance + quick halo emergence / input bar
    if (tie) {
      tie.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        window.DABSyTie.pulse();
        window.DABSyEyes.setGaze(0, 0.7);

        setTimeout(() => {
          if (inputOverlay) {
            inputOverlay.classList.toggle('hidden');
            if (!inputOverlay.classList.contains('hidden')) {
              queryInput.focus();
            }
          }
        }, 180);
      });
    }

    // Input prompt submission
    function dispatchQuery() {
      const val = queryInput.value.trim();
      if (!val) return;
      queryInput.value = '';
      inputOverlay.classList.add('hidden');
      window.DABSyBehaviour.processUserPrompt(val);
    }

    if (submitBtn) submitBtn.addEventListener('click', dispatchQuery);
    if (queryInput) {
      queryInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') dispatchQuery();
      });
    }
  }

  return {
    init
  };
})();

