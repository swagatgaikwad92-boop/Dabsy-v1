window.DABSyContext = (function () {
  let context = {
    timeOfDay: 'day',
    activeMode: 'companion', // 'companion' | 'butler' | 'study'
    activeSubject: 'Physics - Thermodynamics',
    stressLevel: 0.2, // 0.0 to 1.0
    lastInteractionTime: Date.now(),
    interactionCountStreak: 0
  };

  function init() {
    evaluateTimeOfDay();
    setInterval(evaluateTimeOfDay, 60000);
  }

  function evaluateTimeOfDay() {
    const hour = new Date().getHours();
    let tod = 'day';
    if (hour >= 22 || hour < 5) tod = 'night';
    else if (hour >= 5 && hour < 12) tod = 'morning';
    else if (hour >= 12 && hour < 18) tod = 'afternoon';
    else tod = 'evening';

    if (tod !== context.timeOfDay) {
      context.timeOfDay = tod;
      window.DABSyEvents.emit('CONTEXT_TIME_CHANGED', tod);
    }
  }

  function get() {
    return { ...context };
  }

  function update(partial) {
    Object.assign(context, partial);
    window.DABSyEvents.emit('CONTEXT_UPDATED', context);
  }

  return {
    init,
    get,
    update
  };
})();

