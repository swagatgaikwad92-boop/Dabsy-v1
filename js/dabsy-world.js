window.DABSyWorld = (function () {
  let worldContainer;
  let isOpen = false;

  function init() {
    worldContainer = document.getElementById('dabsy-world');
    bindNavigation();
    bindWorldActions();
  }

  function bindNavigation() {
    const tabs = document.querySelectorAll('.world-tab[data-tab]');
    const panels = document.querySelectorAll('.world-panel');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        const activePanel = document.getElementById(`world-panel-${target}`);
        if (activePanel) activePanel.classList.add('active');

        if (target === 'desk') window.DABSyUI.renderTimeline();
        if (target === 'vault') window.DABSyUI.renderVault();
      });
    });

    const closeBtn = document.getElementById('world-close');
    if (closeBtn) closeBtn.addEventListener('click', close);
  }

  function bindWorldActions() {
    // Add commitment
    const addBtn = document.getElementById('btn-add-task');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        const title = prompt('Commitment title:');
        if (title) {
          window.DABSyScheduler.addCommitment({
            title: title.trim(),
            start: '16:00',
            end: '17:00',
            fixed: false
          });
          window.DABSyUI.renderTimeline();
        }
      });
    }

    // Flashcard Flip
    const flashcard = document.getElementById('flashcard');
    const flipBtn = document.getElementById('btn-card-flip');
    const nextBtn = document.getElementById('btn-card-next');

    if (flipBtn && flashcard) {
      flipBtn.addEventListener('click', () => flashcard.classList.toggle('flipped'));
      flashcard.addEventListener('click', () => flashcard.classList.toggle('flipped'));
    }

    if (nextBtn && flashcard) {
      nextBtn.addEventListener('click', () => {
        flashcard.classList.remove('flipped');
        const next = window.DABSyStudy.nextCard();
        document.getElementById('card-question').textContent = next.q;
        document.getElementById('card-answer').textContent = next.a;
      });
    }

    const quizBtn = document.getElementById('btn-launch-quiz');
    if (quizBtn) {
      quizBtn.addEventListener('click', () => {
        const dock = document.getElementById('flashcard-dock');
        dock.classList.toggle('hidden');
        const active = window.DABSyStudy.getActiveCard();
        document.getElementById('card-question').textContent = active.q;
        document.getElementById('card-answer').textContent = active.a;
      });
    }

    // Settings save
    const saveSettings = document.getElementById('btn-save-settings');
    if (saveSettings) {
      saveSettings.addEventListener('click', () => {
        const key = document.getElementById('gemini-key').value.trim();
        const model = document.getElementById('gemini-model').value.trim();
        const perm = document.getElementById('permission-mode').value;
        const voice = document.getElementById('voice-synthesis-enabled').checked;

        window.DABSyStorage.set('gemini_api_key', key);
        window.DABSyStorage.set('gemini_model', model || 'gemini-2.5-flash');
        window.DABSyPermissions.setMode(perm);
        window.DABSyStorage.set('voice_enabled', voice);

        window.DABSyNotifications.show('Parameters updated successfully.');
      });
    }
  }

  function open() {
    if (!worldContainer) return;
    isOpen = true;
    worldContainer.classList.remove('hidden');
    // Force layout flush for smooth CSS entrance
    void worldContainer.offsetWidth;
    worldContainer.classList.add('open');
    worldContainer.setAttribute('aria-hidden', 'false');

    // Elevate creature slightly
    const creatureMount = document.getElementById('creature-mount');
    if (creatureMount) {
      creatureMount.style.transform = 'translateY(-140px) scale(0.72)';
    }

    window.DABSyUI.renderTimeline();
    window.DABSyEvents.emit('WORLD_OPENED');
  }

  function close() {
    if (!worldContainer) return;
    isOpen = false;
    worldContainer.classList.remove('open');
    worldContainer.setAttribute('aria-hidden', 'true');

    const creatureMount = document.getElementById('creature-mount');
    if (creatureMount) {
      creatureMount.style.transform = '';
    }

    setTimeout(() => {
      if (!isOpen) worldContainer.classList.add('hidden');
    }, 600);

    window.DABSyEvents.emit('WORLD_CLOSED');
  }

  return {
    init,
    open,
    close,
    isOpen: () => isOpen
  };
})();

