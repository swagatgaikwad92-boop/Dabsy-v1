window.DABSyPermissions = (function () {
  const MODES = {
    ASK: 'ASK',
    SUGGEST: 'SUGGEST',
    AUTO: 'AUTO'
  };

  let currentMode = window.DABSyStorage.get('permission_mode', MODES.SUGGEST);

  function getMode() {
    return currentMode;
  }

  function setMode(mode) {
    if (MODES[mode]) {
      currentMode = mode;
      window.DABSyStorage.set('permission_mode', mode);
      window.DABSyEvents.emit('PERMISSION_MODE_CHANGED', mode);
    }
  }

  function handleActionRequest(actionType, actionDetails, executeCallback) {
    if (currentMode === MODES.AUTO) {
      executeCallback();
      window.DABSyEvents.emit('IMPORTANT_NOTIFICATION', {
        text: `Handled automatically: ${actionDetails.label || actionType}`
      });
      return;
    }

    if (currentMode === MODES.SUGGEST) {
      window.DABSyEvents.emit('AI_SUGGESTION_PROFFERED', {
        actionType,
        actionDetails,
        onConfirm: executeCallback
      });
      return;
    }

    // Default: ASK
    window.DABSyEvents.emit('AI_CONFIRMATION_REQUIRED', {
      actionType,
      actionDetails,
      onConfirm: executeCallback
    });
  }

  return {
    MODES,
    getMode,
    setMode,
    handleActionRequest
  };
})();

