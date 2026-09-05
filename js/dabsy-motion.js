window.DABSyMotion = (function () {
  // Damped Harmonic Oscillator (Spring)
  class Spring {
    constructor({ val = 0, stiffness = 120, damping = 14, mass = 1 }) {
      this.current = val;
      this.target = val;
      this.velocity = 0;
      this.stiffness = stiffness;
      this.damping = damping;
      this.mass = mass;
    }

    setTarget(targetVal) {
      this.target = targetVal;
    }

    snap(val) {
      this.current = val;
      this.target = val;
      this.velocity = 0;
    }

    update(dt) {
      // Spring force: F = -k * (x - target)
      const displacement = this.current - this.target;
      const springForce = -this.stiffness * displacement;
      // Damping force: F_d = -c * v
      const dampingForce = -this.damping * this.velocity;
      const acceleration = (springForce + dampingForce) / this.mass;

      this.velocity += acceleration * dt;
      this.current += this.velocity * dt;

      // Settle check
      if (Math.abs(this.velocity) < 0.0001 && Math.abs(displacement) < 0.0001) {
        this.current = this.target;
        this.velocity = 0;
      }
      return this.current;
    }

    isResting() {
      return this.current === this.target && this.velocity === 0;
    }
  }

  // Active springs for eye gaze and squish
  const springs = {
    gazeX: new Spring({ val: 0, stiffness: 180, damping: 18 }),
    gazeY: new Spring({ val: 0, stiffness: 180, damping: 18 }),
    scaleX: new Spring({ val: 1, stiffness: 220, damping: 20 }),
    scaleY: new Spring({ val: 1, stiffness: 220, damping: 20 })
  };

  let lastTime = performance.now();
  let animId = null;

  function loop(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.064);
    lastTime = now;

    const gx = springs.gazeX.update(dt);
    const gy = springs.gazeY.update(dt);
    const sx = springs.scaleX.update(dt);
    const sy = springs.scaleY.update(dt);

    window.DABSyEvents.emit('SPRING_FRAME', { gx, gy, sx, sy });

    animId = requestAnimationFrame(loop);
  }

  function start() {
    if (!animId) {
      lastTime = performance.now();
      animId = requestAnimationFrame(loop);
    }
  }

  return {
    Spring,
    springs,
    start
  };
})();

