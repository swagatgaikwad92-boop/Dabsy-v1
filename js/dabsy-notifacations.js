window.DABSyNotifications = (function () {
  let capsule, messageElem;
  let hideTimer = null;

  function init() {
    capsule = document.getElementById('notification-capsule');
    messageElem = document.getElementById('notification-message');

    window.DABSyEvents.on('IMPORTANT_NOTIFICATION', show);
  }

  function show(payload) {
    if (!capsule || !messageElem) return;
    const text = typeof payload === 'string' ? payload : payload.text;

    messageElem.textContent = text;
    capsule.classList.remove('hidden');

    // Tie pulse notification
    window.DABSyTie.pulse();

    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      capsule.classList.add('hidden');
    }, 3800);
  }

  return {
    init,
    show
  };
})();

