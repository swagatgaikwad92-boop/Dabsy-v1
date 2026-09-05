window.DABSyScheduler = (function () {
  const STORAGE_KEY = 'commitments';
  let commitments = [];

  function init() {
    commitments = window.DABSyStorage.get(STORAGE_KEY, [
      { id: 'c1', title: 'College Classes', start: '09:00', end: '15:30', fixed: true },
      { id: 'c2', title: 'Physics Revision Slot', start: '18:30', end: '20:00', fixed: false }
    ]);
  }

  function getCommitments() {
    return [...commitments];
  }

  function addCommitment(item) {
    const entry = {
      id: window.DABSyStorage.generateUUID(),
      title: item.title || 'Focus Block',
      start: item.start || '17:00',
      end: item.end || '18:00',
      fixed: Boolean(item.fixed)
    };
    commitments.push(entry);
    save();
    window.DABSyEvents.emit('SCHEDULE_CHANGED', commitments);
    return entry;
  }

  function detectConflicts() {
    const conflicts = [];
    for (let i = 0; i < commitments.length; i++) {
      for (let j = i + 1; j < commitments.length; j++) {
        const a = commitments[i];
        const b = commitments[j];
        if (timeOverlaps(a.start, a.end, b.start, b.end)) {
          conflicts.push({ a, b });
        }
      }
    }
    return conflicts;
  }

  function timeOverlaps(s1, e1, s2, e2) {
    return s1 < e2 && e1 > s2;
  }

  function save() {
    window.DABSyStorage.set(STORAGE_KEY, commitments);
  }

  return {
    init,
    getCommitments,
    addCommitment,
    detectConflicts
  };
})();

