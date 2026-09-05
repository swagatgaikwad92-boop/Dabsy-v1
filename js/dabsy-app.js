function startDabsy() {
  // Register ServiceWorker for PWA support
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('./sw.js').catch((err) => {
      console.warn('[DABSy] Service worker registration omitted:', err);
    });
  }

  // Populate config fields with saved local settings
  try {
    const keyInput = document.getElementById('gemini-key');
    const modelInput = document.getElementById('gemini-model');
    const permInput = document.getElementById('permission-mode');
    const voiceCheck = document.getElementById('voice-synthesis-enabled');

    if (keyInput && window.DABSyStorage) keyInput.value = window.DABSyStorage.get('gemini_api_key', '');
    if (modelInput && window.DABSyStorage) modelInput.value = window.DABSyStorage.get('gemini_model', 'gemini-2.5-flash');
    if (permInput && window.DABSyPermissions) permInput.value = window.DABSyPermissions.getMode();
    if (voiceCheck && window.DABSyStorage) voiceCheck.checked = window.DABSyStorage.get('voice_enabled', true);
  } catch (e) {
    console.warn('[DABSy] Settings prefill warning:', e);
  }

  // Boot D.A.B.s.y
  if (window.DABSy && typeof window.DABSy.boot === 'function') {
    window.DABSy.boot();
  } else {
    console.error('[DABSy] Core module missing or failed to initialize.');
    const veil = document.getElementById('veil');
    if (veil) veil.classList.add('awakened');
  }
}

// Ensure execution whether DOM is already parsed or still loading
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startDabsy);
} else {
  startDabsy();
}
