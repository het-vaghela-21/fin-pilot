// Animation utilities using GSAP
// This file provides reusable animation functions for the application
// Import GSAP like this in your components:
// import { gsap } from 'gsap';

import { gsap } from 'gsap';

/**
 * Animates a number counting up
 * @param {HTMLElement} element - The DOM element to animate
 * @param {number} endValue - The final value to count to
 * @param {string} prefix - Optional prefix (like currency symbol)
 * @param {number} decimals - Number of decimal places
 * @param {number} duration - Animation duration in seconds
 */
export function animateCounter(element, endValue, prefix = '', decimals = 0, duration = 2) {
  // GSAP version
  gsap.to(element, {
    duration: duration,
    innerText: endValue,
    snap: { innerText: 1 },
    modifiers: {
      innerText: value => {
        return prefix + Number(value).toFixed(decimals).toLocaleString();
      }
    },
    ease: 'power2.out'
  });
}

/**
 * Animates elements into view with a stagger effect
 * @param {string} selector - CSS selector for elements to animate
 * @param {number} staggerTime - Time between each element animation
 */
export function staggerElements(elements, fromVars, toVars, staggerTime = 0.1, delayStart = 0) {
  // GSAP version
  gsap.fromTo(elements, 
    fromVars, 
    {
      ...toVars,
      stagger: staggerTime,
      delay: delayStart,
      ease: 'power2.out'
    }
  );
}

/**
 * Creates a floating animation for elements
 * @param {string} selector - CSS selector for elements to animate
 */
export const floatingAnimation = (selector) => {
  // Implementation will create a gentle floating effect
  gsap.to(selector, {
    y: "+=10",
    duration: 2,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true
  });
};

/**
 * Creates a money rain effect (falling coins/bills)
 * @param {HTMLElement} container - Container element for the animation
 * @param {number} count - Number of money elements to create
 */
export function moneyRain(container, count = 30, duration = 3) {
  // GSAP version
  // Clear any existing particles
  container.innerHTML = '';
  
  // Create money particles
  for (let i = 0; i < count; i++) {
    createMoneyParticle(container, duration);
  }
}

// Helper function to create a single money particle with GSAP
function createMoneyParticle(container, duration) {
  const particle = document.createElement('div');
  
  // Random properties
  const symbols = ['💰', '💵', '💸', '₹', '💎', '🪙'];
  const symbol = symbols[Math.floor(Math.random() * symbols.length)];
  const size = Math.random() * 20 + 10; // 10-30px
  const left = Math.random() * 100; // 0-100%
  const delay = Math.random() * 2; // 0-2s
  const rotation = Math.random() * 360; // 0-360deg
  
  // Apply initial styles
  particle.style.position = 'absolute';
  particle.style.left = `${left}%`;
  particle.style.top = '-50px';
  particle.style.fontSize = `${size}px`;
  particle.style.opacity = 0;
  particle.innerHTML = symbol;
  
  // Add to container
  container.appendChild(particle);
  
  // Animate with GSAP
  gsap.set(particle, { 
    rotation: 0,
    opacity: Math.random() * 0.8 + 0.2 // 0.2-1.0
  });
  
  gsap.to(particle, {
    y: window.innerHeight + 100,
    rotation: rotation,
    duration: duration,
    delay: delay,
    ease: 'none',
    onComplete: () => {
      if (container.contains(particle)) {
        container.removeChild(particle);
      }
    }
  });
}

/**
 * Animates a progress bar filling up
 * @param {HTMLElement} element - The progress bar element
 * @param {number} percentage - The percentage to fill (0-100)
 */
export function animateProgressBar(barElement, percentage, duration = 1.5) {
  // GSAP version
  gsap.to(barElement, {
    width: `${percentage}%`,
    duration: duration,
    ease: 'power2.inOut'
  });
}
