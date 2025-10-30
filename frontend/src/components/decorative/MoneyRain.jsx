import React, { useEffect, useRef } from 'react';

/**
 * MoneyRain component creates a money rain effect with falling coins/bills
 * @param {Object} props
 * @param {boolean} props.active - Whether the money rain is active
 * @param {number} props.duration - Duration in milliseconds
 * @param {number} props.count - Number of money particles
 */
const MoneyRain = ({ active = false, duration = 3000, count = 30 }) => {
  const containerRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;

    // Clear any existing particles
    containerRef.current.innerHTML = '';

    // Create money particles
    for (let i = 0; i < count; i++) {
      createMoneyParticle(containerRef.current);
    }

    // Clear the rain after duration
    timeoutRef.current = setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    }, duration);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [active, count, duration]);

  // Create a single money particle
  const createMoneyParticle = (container) => {
    const particle = document.createElement('div');
    particle.className = 'money-particle absolute';
    
    // Randomly choose between coin and bill emoji
    const symbols = ['💰', '💵', '💸', '₹', '💎', '🪙'];
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    
    // Set random properties
    const size = Math.random() * 20 + 10; // 10-30px
    const left = Math.random() * 100; // 0-100%
    const duration = Math.random() * 3 + 2; // 2-5s
    const delay = Math.random() * 2; // 0-2s
    const rotation = Math.random() * 360; // 0-360deg
    
    // Apply styles
    particle.style.left = `${left}%`;
    particle.style.top = '-50px';
    particle.style.fontSize = `${size}px`;
    particle.style.opacity = Math.random() * 0.8 + 0.2; // 0.2-1.0
    particle.style.transform = `rotate(${rotation}deg)`;
    particle.style.animation = `moneyFall ${duration}s linear ${delay}s forwards`;
    
    // Set content
    particle.innerHTML = symbol;
    
    // Add to container
    container.appendChild(particle);
    
    // Remove after animation completes
    setTimeout(() => {
      if (container.contains(particle)) {
        container.removeChild(particle);
      }
    }, (duration + delay) * 1000);
  };

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
      aria-hidden="true"
    />
  );
};

export default MoneyRain;
