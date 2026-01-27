/* ============================================
   PARTICLES JS - Siddharth Rajpal Portfolio
   ============================================ */

class ParticleSystem {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    // Default options
    this.options = {
      particleCount: options.particleCount || 50,
      colors: options.colors || ['#00d4ff', '#7b2cbf', '#00ff88', '#ff6b6b'],
      minSize: options.minSize || 2,
      maxSize: options.maxSize || 6,
      speed: options.speed || 1,
      connectDistance: options.connectDistance || 150,
      connectLines: options.connectLines !== undefined ? options.connectLines : true,
      mouseInteraction: options.mouseInteraction !== undefined ? options.mouseInteraction : true
    };

    this.particles = [];
    this.mouse = { x: null, y: null, radius: 150 };
    this.animationId = null;
    this.isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!this.isReduced) {
      this.init();
    }
  }

  init() {
    // Create canvas
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.container.appendChild(this.canvas);

    // Set canvas size
    this.resize();

    // Create particles
    this.createParticles();

    // Event listeners
    window.addEventListener('resize', () => this.resize());

    if (this.options.mouseInteraction) {
      window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
      window.addEventListener('mouseout', () => this.handleMouseOut());
    }

    // Start animation
    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // Adjust particle count based on screen size
    const isMobile = this.width < 768;
    const adjustedCount = isMobile ? Math.floor(this.options.particleCount / 2) : this.options.particleCount;

    // Recreate particles if count changed significantly
    if (Math.abs(this.particles.length - adjustedCount) > 10) {
      this.particles = [];
      this.createParticles(adjustedCount);
    }
  }

  createParticles(count = this.options.particleCount) {
    const isMobile = this.width < 768;
    const actualCount = isMobile ? Math.floor(count / 2) : count;

    for (let i = 0; i < actualCount; i++) {
      this.particles.push(new Particle(this));
    }
  }

  handleMouseMove(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  }

  handleMouseOut() {
    this.mouse.x = null;
    this.mouse.y = null;
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Update and draw particles
    this.particles.forEach((particle, index) => {
      particle.update();
      particle.draw();

      // Draw connections
      if (this.options.connectLines) {
        for (let j = index + 1; j < this.particles.length; j++) {
          const dx = particle.x - this.particles[j].x;
          const dy = particle.y - this.particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < this.options.connectDistance) {
            const opacity = 1 - distance / this.options.connectDistance;
            this.ctx.beginPath();
            this.ctx.strokeStyle = `rgba(0, 212, 255, ${opacity * 0.2})`;
            this.ctx.lineWidth = 0.5;
            this.ctx.moveTo(particle.x, particle.y);
            this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
            this.ctx.stroke();
          }
        }
      }
    });

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.canvas) {
      this.canvas.remove();
    }
  }
}

class Particle {
  constructor(system) {
    this.system = system;
    this.ctx = system.ctx;
    this.options = system.options;

    this.x = Math.random() * system.width;
    this.y = Math.random() * system.height;
    this.size = Math.random() * (this.options.maxSize - this.options.minSize) + this.options.minSize;
    this.baseSize = this.size;
    this.color = this.options.colors[Math.floor(Math.random() * this.options.colors.length)];

    // Velocity
    this.vx = (Math.random() - 0.5) * this.options.speed;
    this.vy = (Math.random() - 0.5) * this.options.speed;

    // For floating effect
    this.angle = Math.random() * Math.PI * 2;
    this.angleSpeed = 0.02 + Math.random() * 0.02;
    this.floatRadius = 20 + Math.random() * 30;

    // Opacity
    this.opacity = 0.3 + Math.random() * 0.4;
    this.baseOpacity = this.opacity;
  }

  update() {
    // Floating motion
    this.angle += this.angleSpeed;
    const floatX = Math.cos(this.angle) * 0.3;
    const floatY = Math.sin(this.angle) * 0.3;

    this.x += this.vx + floatX;
    this.y += this.vy + floatY;

    // Wrap around screen
    if (this.x < -50) this.x = this.system.width + 50;
    if (this.x > this.system.width + 50) this.x = -50;
    if (this.y < -50) this.y = this.system.height + 50;
    if (this.y > this.system.height + 50) this.y = -50;

    // Mouse interaction
    if (this.system.mouse.x !== null && this.system.mouse.y !== null) {
      const dx = this.x - this.system.mouse.x;
      const dy = this.y - this.system.mouse.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.system.mouse.radius) {
        const force = (this.system.mouse.radius - distance) / this.system.mouse.radius;
        const angle = Math.atan2(dy, dx);

        this.x += Math.cos(angle) * force * 2;
        this.y += Math.sin(angle) * force * 2;

        // Increase size and opacity near mouse
        this.size = this.baseSize * (1 + force * 0.5);
        this.opacity = this.baseOpacity + force * 0.3;
      } else {
        this.size = this.baseSize;
        this.opacity = this.baseOpacity;
      }
    }
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    this.ctx.fillStyle = this.hexToRgba(this.color, this.opacity);
    this.ctx.fill();

    // Add glow effect
    this.ctx.shadowBlur = 15;
    this.ctx.shadowColor = this.color;
    this.ctx.fill();
    this.ctx.shadowBlur = 0;
  }

  hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}

// Initialize particles when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    new ParticleSystem('particles', {
      particleCount: 60,
      colors: ['#ff9f1c', '#ffbf69', '#f77f00', '#fcbf49'],
      minSize: 2,
      maxSize: 5,
      speed: 0.5,
      connectDistance: 120,
      connectLines: true,
      mouseInteraction: true
    });
  }
});
