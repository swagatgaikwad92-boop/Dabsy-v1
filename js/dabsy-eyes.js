window.DABSyEyes = (function () {
  let eyeLeft, eyeRight, pupilLeft, pupilRight;
  let blinkTimer = null;
  let autonomousSaccadeTimer = null;

  function init() {
    eyeLeft = document.getElementById('eye-left');
    eyeRight = document.getElementById('eye-right');
    pupilLeft = eyeLeft.querySelector('.eye-pupil');
    pupilRight = eyeRight.querySelector('.eye-pupil');

    window.DABSyEvents.on('SPRING_FRAME', renderFrame);
    scheduleBlink();
    scheduleMicroSaccade();
  }

  function setGaze(x, y) {
    // x: -1 (left) to 1 (right)
    // y: -1 (up) to 1 (down)
    window.DABSyMotion.springs.gazeX.setTarget(x);
    window.DABSyMotion.springs.gazeY.setTarget(y);
  }

  function setSquish(scaleX, scaleY) {
    window.DABSyMotion.springs.scaleX.setTarget(scaleX);
    window.DABSyMotion.springs.scaleY.setTarget(scaleY);
  }

  function renderFrame({ gx, gy, sx, sy }) {
    if (!pupilLeft || !pupilRight) return;
    const maxShiftX = 14;
    const maxShiftY = 18;

    const px = gx * maxShiftX;
    const py = gy * maxShiftY;

    pupilLeft.style.transform = `translate(${px}px, ${py}px)`;
    pupilRight.style.transform = `translate(${px}px, ${py}px)`;

    const eyesBox = document.getElementById('eyes-container');
    if (eyesBox) {
      eyesBox.style.transform = `scale(${sx}, ${sy})`;
    }
  }

  function triggerBlink(type = 'normal') {
    if (!eyeLeft || !eyeRight) return;
    const duration = type === 'sleepy' ? 420 : 160;

    eyeLeft.style.transition = `transform ${duration / 2}ms ease-in`;
    eyeRight.style.transition = `transform ${duration / 2}ms ease-in`;
    eyeLeft.style.transform = 'scaleY(0.05)';
    eyeRight.style.transform = 'scaleY(0.05)';

    setTimeout(() => {
      eyeLeft.style.transition = `transform ${duration / 2}ms ease-out`;
      eyeRight.style.transition = `transform ${duration / 2}ms ease-out`;
      eyeLeft.style.transform = '';
      eyeRight.style.transform = '';
    }, duration / 2);
  }

  function scheduleBlink() {
    const nextBlinkMs = 2800 + Math.random() * 4200;
    blinkTimer = setTimeout(() => {
      const state = window.DABSyState.get();
      if (state !== 'SLEEPY') {
        triggerBlink();
      } else {
        triggerBlink('sleepy');
      }
      scheduleBlink();
    }, nextBlinkMs);
  }

  function scheduleMicroSaccade() {
    const nextSaccadeMs = 3500 + Math.random() * 5000;
    autonomousSaccadeTimer = setTimeout(() => {
      const state = window.DABSyState.get();
      if (state === 'IDLE' || state === 'CURIOUS') {
        const randX = (Math.random() - 0.5) * 0.65;
        const randY = (Math.random() - 0.5) * 0.45;
        setGaze(randX, randY);

        setTimeout(() => {
          if (window.DABSyState.get() === 'IDLE') {
            setGaze(0, 0);
          }
        }, 1200 + Math.random() * 800);
      }
      scheduleMicroSaccade();
    }, nextSaccadeMs);
  }

  return {
    init,
    setGaze,
    setSquish,
    triggerBlink
  };
})();

