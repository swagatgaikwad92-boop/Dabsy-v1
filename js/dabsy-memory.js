window.DABSyMemory = (function () {
  const STORAGE_KEY = 'memories';
  let memoryLedger = [];

  function init() {
    memoryLedger = window.DABSyStorage.get(STORAGE_KEY, [
      { id: 'm1', text: 'Prefers deep study during quiet evenings.', timestamp: Date.now() - 86400000 },
      { id: 'm2', text: 'Currently prioritizing Thermodynamics & Linear Algebra.', timestamp: Date.now() - 43200000 }
    ]);
  }

  function addMemory(text) {
    const entry = {
      id: window.DABSyStorage.generateUUID(),
      text: text.trim(),
      timestamp: Date.now()
    };
    memoryLedger.unshift(entry);
    window.DABSyStorage.set(STORAGE_KEY, memoryLedger);
    window.DABSyEvents.emit('MEMORY_ADDED', entry);
    return entry;
  }

  function getAll() {
    return [...memoryLedger];
  }

  function remove(id) {
    memoryLedger = memoryLedger.filter(m => m.id !== id);
    window.DABSyStorage.set(STORAGE_KEY, memoryLedger);
    window.DABSyEvents.emit('MEMORY_REMOVED', id);
  }

  return {
    init,
    addMemory,
    getAll,
    remove
  };
})();

