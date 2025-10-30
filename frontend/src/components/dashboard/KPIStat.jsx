import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { animateCounter } from '../../utils/animations';

export default function KPIStat({ title, value, accent = 'blue', icon }) {
  const statRef = useRef(null);
  const valueRef = useRef(null);
  const barRef = useRef(null);
  
  const color = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    red: 'bg-red-600',
    indigo: 'bg-indigo-600',
  }[accent] || 'bg-blue-600';
  
  const textColor = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    indigo: 'text-indigo-600',
  }[accent] || 'text-blue-600';
  
  const iconMap = {
    balance: (
      <svg className={`h-6 w-6 ${textColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
    spending: (
      <svg className={`h-6 w-6 ${textColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    savings: (
      <svg className={`h-6 w-6 ${textColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    percent: (
      <svg className={`h-6 w-6 ${textColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  };
  
  const selectedIcon = icon ? iconMap[icon] : null;
  
  useEffect(() => {
    // Animate the card entrance
    gsap.fromTo(statRef.current, 
      { y: 20, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" }
    );
    
    // Animate the bar
    gsap.fromTo(barRef.current,
      { width: 0 },
      { width: '4rem', duration: 1, delay: 0.3, ease: "power2.inOut" }
    );
    
    // Animate the counter
    if (valueRef.current) {
      const rawValue = value.replace(/[^\d.-]/g, '');
      const numValue = parseFloat(rawValue);
      if (!isNaN(numValue)) {
        const prefix = value.replace(rawValue, '');
        animateCounter(valueRef.current, numValue, prefix, 2, 1.5);
      }
    }
  }, [value]);

  return (
    <div 
      ref={statRef}
      className="rounded-xl border bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950 hover:shadow-md transition-shadow duration-300"
    >
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400">{title}</div>
        {selectedIcon && <div>{selectedIcon}</div>}
      </div>
      <div className="mt-2 flex items-end justify-between">
        <div ref={valueRef} className="text-2xl font-semibold">{value}</div>
        <div ref={barRef} className={`h-2 w-16 rounded-full ${color}`}></div>
      </div>
    </div>
  );
}
