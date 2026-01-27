/* ============================================
   MAIN JS - Siddharth Rajpal Portfolio
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize preloader first
  initPreloader();

  // Initialize all modules
  initNavigation();
  initScrollReveal();
  initSkillBars();
  initCounters();
  initTiltEffect();
  initSmoothScroll();
  initContactForm();
  initProjectModal();
});

/* === PRELOADER / INTRO ANIMATION === */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const body = document.body;

  // Minimum display time for the preloader (let animations play)
  const minDisplayTime = 3000; // 3 seconds
  const startTime = Date.now();

  // Function to hide preloader
  const hidePreloader = () => {
    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

    setTimeout(() => {
      // Start exit animation
      preloader.classList.add('exit');

      // After exit animation completes, hide preloader and show content
      setTimeout(() => {
        preloader.classList.add('hidden');
        body.classList.remove('loading');
        body.classList.add('loaded');

        // Remove preloader from DOM after transition
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 500);
      }, 1100); // Wait for curtain animation
    }, remainingTime);
  };

  // Hide preloader when page is fully loaded
  if (document.readyState === 'complete') {
    hidePreloader();
  } else {
    window.addEventListener('load', hidePreloader);
  }

  // Fallback: hide preloader after max time even if load event doesn't fire
  setTimeout(() => {
    if (!preloader.classList.contains('exit')) {
      hidePreloader();
    }
  }, 5000);
}

/* === NAVIGATION === */
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Navbar scroll effect
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add scrolled class
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });

  // Mobile menu toggle
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  });

  // Close menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/* === SCROLL REVEAL ANIMATIONS === */
function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    '.reveal, .reveal-up, .reveal-down, .reveal-left, .reveal-right, .reveal-scale, .reveal-rotate'
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Get delay from data attribute or class
          const delay = entry.target.dataset.delay || 0;

          setTimeout(() => {
            entry.target.classList.add('active');
          }, delay);

          // Unobserve after animation for performance
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  revealElements.forEach((el) => {
    revealObserver.observe(el);
  });
}

/* === SKILL BARS ANIMATION === */
function initSkillBars() {
  const skillBars = document.querySelectorAll('.skill-progress');

  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const progressBar = entry.target;
          const progress = progressBar.dataset.progress;

          // Small delay for smoother appearance
          setTimeout(() => {
            progressBar.classList.add('animate');
          }, 200);

          skillObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.5
    }
  );

  skillBars.forEach((bar) => {
    skillObserver.observe(bar);
  });
}

/* === COUNTER ANIMATION === */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.dataset.target);

          animateCounter(counter, target);
          counterObserver.unobserve(counter);
        }
      });
    },
    {
      threshold: 0.5
    }
  );

  counters.forEach((counter) => {
    counterObserver.observe(counter);
  });
}

function animateCounter(element, target) {
  const duration = 2000; // 2 seconds
  const frameDuration = 1000 / 60; // 60fps
  const totalFrames = Math.round(duration / frameDuration);
  const easeOutQuad = (t) => t * (2 - t);

  let frame = 0;

  const animate = () => {
    frame++;
    const progress = easeOutQuad(frame / totalFrames);
    const currentValue = Math.round(target * progress);

    element.textContent = currentValue;

    if (frame < totalFrames) {
      requestAnimationFrame(animate);
    } else {
      element.textContent = target;
    }
  };

  animate();
}

/* === 3D TILT EFFECT === */
function initTiltEffect() {
  // Only enable on devices with hover capability
  if (window.matchMedia('(hover: hover)').matches) {
    const tiltElements = document.querySelectorAll('.tilt-effect');

    tiltElements.forEach((element) => {
      element.addEventListener('mousemove', handleTilt);
      element.addEventListener('mouseleave', resetTilt);
    });
  }
}

function handleTilt(e) {
  const element = e.currentTarget;
  const rect = element.getBoundingClientRect();

  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  const rotateX = (y - centerY) / 10;
  const rotateY = (centerX - x) / 10;

  element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
}

function resetTilt(e) {
  const element = e.currentTarget;
  element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
}

/* === SMOOTH SCROLL === */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');

      if (href === '#') return;

      e.preventDefault();

      const target = document.querySelector(href);
      if (target) {
        const navbarHeight = document.getElementById('navbar').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* === CONTACT FORM === */
function initContactForm() {
  const form = document.getElementById('contact-form');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Get form data
      const formData = new FormData(form);
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message')
      };

      // Here you would typically send the data to a server
      // For now, we'll just show a success message
      console.log('Form submitted:', data);

      // Show success feedback
      const button = form.querySelector('button[type="submit"]');
      const originalText = button.innerHTML;

      button.innerHTML = '<span>Message Sent! ✓</span>';
      button.disabled = true;
      button.style.background = 'var(--accent-tertiary)';

      // Reset form
      form.reset();

      // Reset button after 3 seconds
      setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
        button.style.background = '';
      }, 3000);
    });
  }
}

/* === ACTIVE NAV LINK ON SCROLL === */
function initActiveNavLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observerOptions = {
    threshold: 0.3,
    rootMargin: '-80px 0px -50% 0px'
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const currentId = entry.target.id;

        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${currentId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });
}

// Initialize active nav links
initActiveNavLinks();

/* === PERFORMANCE: Remove will-change after animations === */
document.addEventListener('animationend', (e) => {
  if (e.target.classList.contains('reveal') ||
      e.target.classList.contains('reveal-up') ||
      e.target.classList.contains('reveal-left') ||
      e.target.classList.contains('reveal-right')) {
    e.target.style.willChange = 'auto';
  }
});

/* === PREFERS REDUCED MOTION === */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // Disable all animations for users who prefer reduced motion
  document.documentElement.style.setProperty('--transition-fast', '0.01ms');
  document.documentElement.style.setProperty('--transition-normal', '0.01ms');
  document.documentElement.style.setProperty('--transition-slow', '0.01ms');
}

/* === PROJECT MODAL === */
const projectData = {
  ocr: {
    icon: '📄',
    type: 'Professional Internship',
    title: 'Intelligent Document Processing Plugin',
    badge: '💼 Quadrafort Technologies',
    badgeClass: 'gold',
    overview: 'During my internship at Quadrafort Technologies (May-July 2025), I developed a sophisticated document processing plugin that revolutionized how the company handles invoices and purchase orders. The system uses advanced OCR technology to automatically extract and validate data from various document formats.',
    features: [
      'Multi-template support for invoices and purchase orders from different vendors',
      'Advanced image preprocessing pipeline for handling low-quality scans',
      'Intelligent field detection and data extraction using Tesseract OCR',
      'Automatic data validation and error correction mechanisms',
      'Seamless integration with the company\'s existing CRM system',
      'Batch processing capability for handling multiple documents'
    ],
    technical: 'Built using Python with Tesseract OCR engine and OpenCV for image preprocessing. Implemented custom algorithms for template matching and field extraction. Used regex patterns and NLP techniques for data validation. The plugin reduced manual data entry time by over 80%.',
    tech: ['Python', 'Tesseract OCR', 'OpenCV', 'CRM Integration', 'Image Processing', 'NLP'],
    outcome: 'Successfully deployed in production, processing hundreds of documents daily. Improved overall plugin efficiency and user experience through comprehensive testing and performance optimization.'
  },
  fatigue: {
    icon: '👁️',
    type: 'Hackathon Project',
    title: 'Driver Fatigue Detection System',
    badge: '🏆 5th Place - Toyota Hackathon India 2025',
    badgeClass: 'gold',
    overview: 'A real-time computer vision system designed to monitor driver alertness and prevent accidents caused by drowsy driving. This project was developed for Toyota Hackathon India 2025 where it secured 5th place among hundreds of participants.',
    features: [
      'Real-time eye tracking and blink detection using facial landmarks',
      'Yawning detection through mouth aspect ratio analysis',
      'Head pose estimation to detect nodding or drooping',
      'Configurable alert thresholds for different sensitivity levels',
      'Audio and visual alerts when fatigue is detected',
      'Dashboard for monitoring driver alertness metrics over time'
    ],
    technical: 'Leveraged TensorFlow for the deep learning model and OpenCV for real-time video processing. Used dlib\'s facial landmark detector for precise eye and mouth tracking. Implemented a CNN-based classifier trained on a custom dataset of drowsy vs. alert drivers.',
    tech: ['Python', 'TensorFlow', 'OpenCV', 'CNN', 'dlib', 'Computer Vision'],
    outcome: 'Achieved 5th place at Toyota Hackathon India 2025. The system demonstrated 94% accuracy in detecting drowsiness in real-time testing conditions.'
  },
  stock: {
    icon: '📈',
    type: 'Hackathon Project',
    title: 'Stock Market Tracker & Predictor',
    badge: '🥈 Runner-up - Binary Fest Hackathon 2024',
    badgeClass: 'gold',
    overview: 'A comprehensive stock market application that combines real-time tracking with ML-based prediction capabilities. Built during Binary Fest Hackathon at Step By Step School, Noida, where it earned the runner-up position.',
    features: [
      'Real-time stock price tracking with live market data integration',
      'Interactive charts and visualizations for price history',
      'ML-based price prediction using SARIMA time-series model',
      'Portfolio management and tracking functionality',
      'Custom watchlists and price alerts',
      'News aggregation related to tracked stocks'
    ],
    technical: 'Used Python with SARIMA (Seasonal AutoRegressive Integrated Moving Average) for time-series forecasting. Integrated with financial APIs for real-time data. Built interactive dashboards for data visualization. Implemented backtesting to validate prediction accuracy.',
    tech: ['Python', 'SARIMA', 'Time Series Analysis', 'API Integration', 'Data Visualization', 'ML'],
    outcome: 'Won Runner-up at Binary Fest Hackathon 2024. The prediction model achieved reasonable accuracy for short-term price movement predictions.'
  },
  medical: {
    icon: '🏥',
    type: 'Hackathon Project',
    title: 'Medical Diagnostic AI',
    badge: '🥈 Runner-up - Jaipur Hackathon 2023',
    badgeClass: 'gold',
    overview: 'A neural network-based diagnostic system capable of detecting multiple diseases from medical images. Developed at Neerja Modi School Jaipur Hackathon, this project demonstrates the potential of AI in healthcare for early disease detection.',
    features: [
      'Glaucoma detection from retinal fundus images',
      'Skin cancer classification (melanoma vs benign)',
      'Pneumonia detection from chest X-rays',
      'Confidence scores for each diagnosis',
      'User-friendly interface for uploading medical images',
      'Detailed reports with findings explanation'
    ],
    technical: 'Built using TensorFlow with Convolutional Neural Networks (CNNs) trained on publicly available medical datasets. Used transfer learning with pre-trained models (ResNet, VGG) fine-tuned on medical imaging data. Implemented data augmentation to improve model robustness.',
    tech: ['Python', 'TensorFlow', 'CNN', 'Transfer Learning', 'Medical Imaging', 'Deep Learning'],
    outcome: 'Secured Runner-up position at Jaipur Hackathon 2023. The models achieved over 90% accuracy on test datasets for all three disease categories.'
  },
  covid: {
    icon: '🦠',
    type: 'National Hackathon',
    title: 'COVID-19 Case Predictor',
    badge: '🏆 Winner - IndiaAI Covid Warriors Hackathon',
    badgeClass: '',
    overview: 'A machine learning model that forecasted COVID-19 case trends during the pandemic using time-series analysis. This project won the IndiaAI Covid Warriors Hackathon in March 2021, earning a laptop as the grand prize.',
    features: [
      'Accurate prediction of COVID-19 case trends for multiple regions',
      'Time-series analysis using SARIMA modeling',
      'Interactive visualization of historical and predicted data',
      'Regional comparison and trend analysis',
      'Daily, weekly, and monthly forecast capabilities',
      'Data pipeline for automatic updates from official sources'
    ],
    technical: 'Implemented SARIMA (Seasonal AutoRegressive Integrated Moving Average) model for time-series forecasting. Used Python with pandas for data manipulation and matplotlib/plotly for visualizations. Trained on official COVID-19 data from government sources.',
    tech: ['Python', 'SARIMA', 'Time Series', 'Predictive Analytics', 'Data Visualization', 'ML'],
    outcome: 'Won 1st Place at IndiaAI Covid Warriors Hackathon! Received a laptop as the winning prize. The predictions helped visualize potential case trajectories during a critical time.'
  },
  robocup: {
    icon: '🤖',
    type: 'International Competition',
    title: 'RoboCup Junior Robotics',
    badge: '🌏 Asia-Pacific Representative - China 2024',
    badgeClass: '',
    overview: 'As the Software Lead for my robotics team, I\'ve been competing in RoboCup Junior competitions for multiple years. This journey has taken us from regional medals to representing India at the Asia-Pacific Championship in China.',
    features: [
      'Autonomous robot navigation and obstacle avoidance',
      'Computer vision for object and line detection',
      'PID-controlled motor movements for precision',
      'Sensor fusion combining multiple input sources',
      'Real-time decision making algorithms',
      'Wireless communication between robot and base station'
    ],
    technical: 'Programmed using Python with ROS (Robot Operating System) for robot control. Used OpenCV for computer vision tasks. Integrated Arduino for low-level motor control and sensor reading. Implemented path planning algorithms and state machines for autonomous behavior.',
    tech: ['Python', 'ROS', 'Arduino', 'OpenCV', 'Raspberry Pi', 'Sensor Integration'],
    outcome: '3x Regional Medalist (2022, 2023, 2024), 3x National Participant (2023, 2024, 2025), and represented India at RoboCup Junior Asia-Pacific Championship in China (November 2024).'
  }
};

function initProjectModal() {
  const modal = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close');
  const projectLinks = document.querySelectorAll('.project-link[data-modal]');

  // Open modal
  projectLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const projectId = link.dataset.modal;
      openModal(projectId);
    });
  });

  // Close modal on X button
  modalClose.addEventListener('click', closeModal);

  // Close modal on overlay click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

function openModal(projectId) {
  const project = projectData[projectId];
  if (!project) return;

  const modal = document.getElementById('project-modal');

  // Populate modal content
  document.getElementById('modal-icon').textContent = project.icon;
  document.getElementById('modal-type').textContent = project.type;
  document.getElementById('modal-title').textContent = project.title;

  const badge = document.getElementById('modal-badge');
  badge.textContent = project.badge;
  badge.className = 'modal-badge' + (project.badgeClass ? ' ' + project.badgeClass : '');

  document.getElementById('modal-overview').textContent = project.overview;

  // Populate features list
  const featuresList = document.getElementById('modal-features');
  featuresList.innerHTML = project.features.map(f => `<li>${f}</li>`).join('');

  document.getElementById('modal-technical').textContent = project.technical;

  // Populate tech tags
  const techContainer = document.getElementById('modal-tech');
  techContainer.innerHTML = project.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');

  document.getElementById('modal-outcome').textContent = project.outcome;

  // Show modal
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('project-modal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}
