window.DABSyExpression = (function () {
  let currentExpression = 'neutral';
  const creatureElem = () => document.getElementById('creature');

  const ALL_EXPRESSIONS = [
    'neutral', 'curious', 'happy', 'excited', 'confused',
    'thinking', 'focused', 'sleepy', 'surprised', 'concerned',
    'proud', 'playful', 'listening', 'speaking'
  ];

  function set(expressionName, duration = 0) {
    if (!ALL_EXPRESSIONS.includes(expressionName)) {
      expressionName = 'neutral';
    }

    const elem = creatureElem();
    if (!elem) return;

    ALL_EXPRESSIONS.forEach(exp => elem.classList.remove(`expr-${exp}`));
    elem.classList.add(`expr-${expressionName}`);
    currentExpression = expressionName;

    window.DABSyEvents.emit('EXPRESSION_APPLIED', expressionName);

    if (duration > 0) {
      setTimeout(() => {
        if (currentExpression === expressionName) {
          set('neutral');
        }
      }, duration);
    }
  }

  function get() {
    return currentExpression;
  }

  return {
    set,
    get,
    ALL_EXPRESSIONS
  };
})();

