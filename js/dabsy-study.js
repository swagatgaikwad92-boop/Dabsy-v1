window.DABSyStudy = (function () {
  let activeCardIndex = 0;
  const cards = [
    {
      q: 'What is the Second Law of Thermodynamics regarding entropy?',
      a: 'The total entropy of an isolated system always increases over time for spontaneous processes.'
    },
    {
      q: 'How does an adiabatic process differ from an isothermal process?',
      a: 'In an adiabatic process no heat is transferred (Q = 0); in an isothermal process temperature remains constant (ΔT = 0).'
    },
    {
      q: 'What is the physical meaning of the divergence of a vector field?',
      a: 'It measures the net magnitude of a vector field source or sink at a given point.'
    }
  ];

  function getActiveCard() {
    return cards[activeCardIndex % cards.length];
  }

  function nextCard() {
    activeCardIndex = (activeCardIndex + 1) % cards.length;
    return getActiveCard();
  }

  return {
    getActiveCard,
    nextCard
  };
})();

