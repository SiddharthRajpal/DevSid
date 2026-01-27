/* ============================================
   TYPING ANIMATION - Siddharth Rajpal Portfolio
   ============================================ */

class TypingEffect {
  constructor(elementId, options = {}) {
    this.element = document.getElementById(elementId);
    if (!this.element) return;

    // Default options
    this.options = {
      strings: options.strings || [
        'AI/ML Developer',
        'Roboticist',
        'Software Engineer',
        'Hackathon Champion',
        'Problem Solver'
      ],
      typeSpeed: options.typeSpeed || 80,
      deleteSpeed: options.deleteSpeed || 50,
      pauseBeforeDelete: options.pauseBeforeDelete || 2000,
      pauseBeforeType: options.pauseBeforeType || 500,
      loop: options.loop !== undefined ? options.loop : true,
      cursor: options.cursor !== undefined ? options.cursor : true
    };

    this.currentStringIndex = 0;
    this.currentCharIndex = 0;
    this.isDeleting = false;
    this.isPaused = false;

    // Check for reduced motion preference
    this.isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.init();
  }

  init() {
    if (this.isReduced) {
      // If reduced motion, just show the first string without animation
      this.element.textContent = this.options.strings[0];
      return;
    }

    this.type();
  }

  type() {
    const currentString = this.options.strings[this.currentStringIndex];
    let displayText = '';

    if (this.isDeleting) {
      // Deleting characters
      displayText = currentString.substring(0, this.currentCharIndex - 1);
      this.currentCharIndex--;
    } else {
      // Typing characters
      displayText = currentString.substring(0, this.currentCharIndex + 1);
      this.currentCharIndex++;
    }

    this.element.textContent = displayText;

    // Calculate typing speed
    let typingSpeed = this.isDeleting ? this.options.deleteSpeed : this.options.typeSpeed;

    // Add some randomness to make it feel more natural
    typingSpeed += Math.random() * 50 - 25;

    // Check if word is complete
    if (!this.isDeleting && this.currentCharIndex === currentString.length) {
      // Pause before deleting
      typingSpeed = this.options.pauseBeforeDelete;
      this.isDeleting = true;
    } else if (this.isDeleting && this.currentCharIndex === 0) {
      // Move to next string
      this.isDeleting = false;
      this.currentStringIndex = (this.currentStringIndex + 1) % this.options.strings.length;

      // Pause before typing next word
      typingSpeed = this.options.pauseBeforeType;
    }

    // Continue the loop
    if (this.options.loop || this.currentStringIndex < this.options.strings.length - 1 || this.currentCharIndex > 0) {
      setTimeout(() => this.type(), typingSpeed);
    }
  }

  // Method to change strings dynamically
  setStrings(newStrings) {
    this.options.strings = newStrings;
    this.currentStringIndex = 0;
    this.currentCharIndex = 0;
    this.isDeleting = false;
  }

  // Method to pause/resume
  pause() {
    this.isPaused = true;
  }

  resume() {
    if (this.isPaused) {
      this.isPaused = false;
      this.type();
    }
  }
}

// Alternative simpler typing effect using CSS animation
class SimpleTypingEffect {
  constructor(elementId, strings, options = {}) {
    this.element = document.getElementById(elementId);
    if (!this.element) return;

    this.strings = strings;
    this.currentIndex = 0;
    this.options = {
      displayTime: options.displayTime || 3000,
      fadeTime: options.fadeTime || 500
    };

    this.init();
  }

  init() {
    this.element.style.transition = `opacity ${this.options.fadeTime}ms ease`;
    this.showNextString();
  }

  showNextString() {
    // Fade out
    this.element.style.opacity = '0';

    setTimeout(() => {
      // Change text
      this.element.textContent = this.strings[this.currentIndex];
      this.currentIndex = (this.currentIndex + 1) % this.strings.length;

      // Fade in
      this.element.style.opacity = '1';

      // Schedule next change
      setTimeout(() => this.showNextString(), this.options.displayTime);
    }, this.options.fadeTime);
  }
}

// Initialize typing effect when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the main typing effect
  new TypingEffect('typed-text', {
    strings: [
      'AI/ML Developer',
      'Roboticist',
      'Software Engineer',
      'Hackathon Champion',
      'RoboCup Competitor',
      'Tech Mentor'
    ],
    typeSpeed: 70,
    deleteSpeed: 40,
    pauseBeforeDelete: 2500,
    pauseBeforeType: 400,
    loop: true
  });
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TypingEffect, SimpleTypingEffect };
}
