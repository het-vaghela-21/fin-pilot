import React, { useEffect, useRef } from 'react';

// This component provides decorative finance-themed elements
// After installing GSAP, uncomment the imports and animation code

// import { gsap } from 'gsap';

export const CoinStack = ({ size = 'md', className = '' }) => {
  const coinRef = useRef(null);
  
  useEffect(() => {
    // Animation will be added after GSAP installation
    // Example:
    /*
    gsap.to(coinRef.current, {
      y: "-5px",
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
    */
  }, []);
  
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24'
  };
  
  return (
    <div ref={coinRef} className={`relative ${sizeClasses[size]} ${className}`}>
      <div className="absolute bottom-0 h-1/2 w-full bg-yellow-400 rounded-full border-2 border-yellow-600 z-10"></div>
      <div className="absolute bottom-2 h-1/2 w-full bg-yellow-400 rounded-full border-2 border-yellow-600 z-20"></div>
      <div className="absolute bottom-4 h-1/2 w-full bg-yellow-400 rounded-full border-2 border-yellow-600 z-30"></div>
      <div className="absolute bottom-6 h-1/2 w-full bg-yellow-400 rounded-full border-2 border-yellow-600 z-40 flex items-center justify-center">
        <span className="text-yellow-800 font-bold text-xs">₹</span>
      </div>
    </div>
  );
};

export const WalletIcon = ({ size = 'md', className = '' }) => {
  const walletRef = useRef(null);
  
  useEffect(() => {
    // Animation will be added after GSAP installation
  }, []);
  
  const sizeClasses = {
    sm: 'h-8 w-10',
    md: 'h-12 w-16',
    lg: 'h-16 w-20',
    xl: 'h-24 w-32'
  };
  
  return (
    <div ref={walletRef} className={`relative ${sizeClasses[size]} ${className}`}>
      <div className="absolute inset-0 bg-blue-700 rounded-lg"></div>
      <div className="absolute top-0 right-0 bottom-0 w-1/4 bg-blue-800 rounded-r-lg"></div>
      <div className="absolute top-1/4 left-1/4 h-1/2 w-1/2 bg-green-500 rounded-sm"></div>
    </div>
  );
};

export const CreditCard = ({ size = 'md', className = '' }) => {
  const cardRef = useRef(null);
  
  useEffect(() => {
    // Animation will be added after GSAP installation
    // Example:
    /*
    gsap.to(cardRef.current, {
      rotationY: 5,
      rotationX: 5,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
    */
  }, []);
  
  const sizeClasses = {
    sm: 'h-6 w-10',
    md: 'h-10 w-16',
    lg: 'h-14 w-24',
    xl: 'h-20 w-32'
  };
  
  return (
    <div ref={cardRef} className={`relative ${sizeClasses[size]} ${className} bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg`}>
      <div className="absolute top-2 left-2 h-1 w-4 bg-yellow-400 rounded-full"></div>
      <div className="absolute bottom-2 left-2 right-2 h-1 bg-white/30 rounded-full"></div>
      <div className="absolute bottom-4 left-2 right-2 h-1 bg-white/20 rounded-full"></div>
    </div>
  );
};

export const PiggyBank = ({ size = 'md', className = '' }) => {
  const piggyRef = useRef(null);
  
  useEffect(() => {
    // Animation will be added after GSAP installation
  }, []);
  
  const sizeClasses = {
    sm: 'h-10 w-12',
    md: 'h-16 w-20',
    lg: 'h-24 w-32',
    xl: 'h-32 w-40'
  };
  
  return (
    <div ref={piggyRef} className={`relative ${sizeClasses[size]} ${className}`}>
      <div className="absolute bottom-0 left-1/4 right-1/4 h-1/5 bg-pink-400 rounded-lg"></div>
      <div className="absolute bottom-1/5 inset-x-0 h-3/5 bg-pink-400 rounded-full"></div>
      <div className="absolute top-1/4 right-1/5 h-1/5 w-2/5 bg-pink-400 rounded-full"></div>
      <div className="absolute top-1/3 right-1/6 h-1/10 w-1/10 bg-black rounded-full"></div>
      <div className="absolute top-1/5 left-1/6 h-1/6 w-1/6 bg-pink-300 rounded-full"></div>
    </div>
  );
};

export const GrowthChart = ({ size = 'md', className = '', positive = true }) => {
  const chartRef = useRef(null);
  
  useEffect(() => {
    // Animation will be added after GSAP installation
    // Example:
    /*
    const path = chartRef.current.querySelector('path');
    const length = path.getTotalLength();
    
    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length
    });
    
    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 2,
      ease: "power2.out"
    });
    */
  }, []);
  
  const sizeClasses = {
    sm: 'h-10 w-16',
    md: 'h-16 w-24',
    lg: 'h-24 w-32',
    xl: 'h-32 w-40'
  };
  
  const chartColor = positive ? 'text-green-500' : 'text-red-500';
  const chartPath = positive 
    ? 'M0,20 Q5,20 10,15 T20,10 T30,5 T40,0' 
    : 'M0,0 Q5,0 10,5 T20,10 T30,15 T40,20';
  
  return (
    <div ref={chartRef} className={`relative ${sizeClasses[size]} ${className} flex items-center justify-center`}>
      <svg width="100%" height="100%" viewBox="0 0 40 20" className={chartColor}>
        <path 
          d={chartPath} 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round"
        />
        {positive && (
          <polygon points="38,0 40,4 36,4" fill="currentColor" />
        )}
        {!positive && (
          <polygon points="38,16 40,20 36,20" fill="currentColor" />
        )}
      </svg>
    </div>
  );
};

// Floating money symbols component
export const MoneyRain = ({ count = 20 }) => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    // Animation will be added after GSAP installation
    // This will create random money symbols that float down
  }, []);
  
  return (
    <div ref={containerRef} className="money-rain-container absolute inset-0 overflow-hidden pointer-events-none z-0"></div>
  );
};

// Export a component that combines multiple finance elements
export const FinanceDecoration = ({ className = '' }) => {
  return (
    <div className={`finance-decoration relative ${className}`}>
      <CoinStack size="lg" className="absolute top-4 left-4" />
      <CreditCard size="lg" className="absolute top-8 right-8" />
      <GrowthChart size="lg" className="absolute bottom-8 left-8" />
      <PiggyBank size="lg" className="absolute bottom-4 right-4" />
    </div>
  );
};
