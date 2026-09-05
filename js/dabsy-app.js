document.addEventListener('DOMContentLoaded', () => {
  // Register ServiceWorker for PWA support
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('./sw.js').catch((err) => {
      console.warn('[DABSy] Service worker registration omitted:', err);
    });
  }

  // Populate config fields with saved local settings
  const keyInput = document.getElementById('gemini-key');
  const modelInput = document.getElementById('gemini-model');
  const permInput = document.getElementById('permission-mode');
  const voiceCheck = document.getElementById('voice-synthesis-enabled');

  if (keyInput) keyInput.value = window.DABSyStorage.get('gemini_api_key', '');
  if (modelInput) modelInput.value = window.DABSyStorage.get('gemini_model', 'gemini-2.5-flash');
  if (permInput) permInput.value = window.DABSyPermissions.getMode();
  if (voiceCheck) voiceCheck.checked = window.DABSyStorage.get('voice_enabled', true);

  // Boot D.A.B.s.y
  window.DABSy.boot();
});

