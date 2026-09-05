window.DABSyUI = (function () {
  function escapeHTML(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function renderSubtitles() {
    const subText = document.getElementById('subtitle-text');
    let clearTimer = null;

    window.DABSyEvents.on('SUBTITLE_REQUESTED', (text) => {
      if (!subText) return;
      subText.textContent = text;
      subText.classList.add('active');

      if (clearTimer) clearTimeout(clearTimer);
      const readingDuration = Math.max(2400, text.length * 55);
      clearTimer = setTimeout(() => {
        subText.classList.remove('active');
      }, readingDuration);
    });
  }

  function renderTimeline() {
    const mount = document.getElementById('schedule-timeline');
    if (!mount) return;
    const commitments = window.DABSyScheduler.getCommitments();
    const conflicts = window.DABSyScheduler.detectConflicts();

    mount.innerHTML = commitments.map(item => {
      const isConflict = conflicts.some(c => c.a.id === item.id || c.b.id === item.id);
      return `
        <div class="timeline-item ${isConflict ? 'conflict' : ''}">
          <span class="item-time">${escapeHTML(item.start)} – ${escapeHTML(item.end)}</span>
          <div class="item-body">
            <h4 class="item-title">${escapeHTML(item.title)}</h4>
            <p class="item-meta">${item.fixed ? 'Fixed Routine' : 'Flexible Focus'}</p>
            ${isConflict ? '<span class="item-conflict-badge">⚠ Overlap Detected</span>' : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  function renderVault() {
    const mount = document.getElementById('vault-entries');
    if (!mount) return;
    const memories = window.DABSyMemory.getAll();

    mount.innerHTML = memories.map(m => `
      <div class="timeline-item">
        <div class="item-body">
          <p class="item-title">${escapeHTML(m.text)}</p>
          <span class="item-meta">${new Date(m.timestamp).toLocaleDateString()}</span>
        </div>
      </div>
    `).join('');
  }

  return {
    escapeHTML,
    renderSubtitles,
    renderTimeline,
    renderVault
  };
})();

