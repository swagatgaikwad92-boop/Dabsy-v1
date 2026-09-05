window.DABSyStorage = (function () {
  const PREFIX = 'dabsy_v1_';
  let memoryCache = {};

  function isAvailable() {
    try {
      const testKey = '__dabsy_test__';
      localStorage.setItem(testKey, '1');
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  const storageSupported = isAvailable();

  function get(key, defaultValue = null) {
    const fullKey = PREFIX + key;
    if (storageSupported) {
      try {
        const item = localStorage.getItem(fullKey);
        return item ? JSON.parse(item) : defaultValue;
      } catch (err) {
        console.warn('[DABSy:Storage] Read parse error', err);
        return defaultValue;
      }
    }
    return memoryCache[fullKey] !== undefined ? memoryCache[fullKey] : defaultValue;
  }

  function set(key, value) {
    const fullKey = PREFIX + key;
    if (storageSupported) {
      try {
        localStorage.setItem(fullKey, JSON.stringify(value));
      } catch (err) {
        console.warn('[DABSy:Storage] Write failed', err);
      }
    }
    memoryCache[fullKey] = value;
  }

  function remove(key) {
    const fullKey = PREFIX + key;
    if (storageSupported) {
      try {
        localStorage.removeItem(fullKey);
      } catch (err) {
        console.warn('[DABSy:Storage] Remove failed', err);
      }
    }
    delete memoryCache[fullKey];
  }

  function generateUUID() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return 'dabsy_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);
  }

  return {
    get,
    set,
    remove,
    generateUUID
  };
})();
