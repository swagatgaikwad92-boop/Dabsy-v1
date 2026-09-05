window.DABSyEvents = (function () {
  const listeners = new Map();

  function on(eventName, callback) {
    if (!listeners.has(eventName)) {
      listeners.set(eventName, new Set());
    }
    listeners.get(eventName).add(callback);
    return () => off(eventName, callback);
  }

  function off(eventName, callback) {
    if (listeners.has(eventName)) {
      listeners.get(eventName).delete(callback);
    }
  }

  function emit(eventName, payload) {
    if (listeners.has(eventName)) {
      listeners.get(eventName).forEach((cb) => {
        try {
          cb(payload);
        } catch (error) {
          console.error(`[DABSy:Events] Error in handler for "${eventName}":`, error);
        }
      });
    }
  }

  return {
    on,
    off,
    emit
  };
})();

