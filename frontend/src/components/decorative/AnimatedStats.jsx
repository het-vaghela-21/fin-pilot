import React, { useEffect, useRef, useState } from 'react';

/**
 * AnimatedNumber component that counts up to a target value
 * @param {Object} props
 * @param {number} props.value - The target value to count to
 * @param {string} props.prefix - Optional prefix (e.g., currency symbol)
 * @param {string} props.suffix - Optional suffix (e.g., '%')
 * @param {number} props.duration - Animation duration in milliseconds
 * @param {number} props.decimals - Number of decimal places
 */
export const AnimatedNumber = ({ 
  value = 0, 
  prefix = '', 
  suffix = '', 
  duration = 1500, 
  decimals = 0,
  className = ''
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const startTimeRef = useRef(null);
  const frameRef = useRef(null);
  const startValueRef = useRef(0);
  const targetValueRef = useRef(value);

  useEffect(() => {
    // Store the current display value as the starting point
    startValueRef.current = displayValue;
    targetValueRef.current = value;
    startTimeRef.current = null;
    
    // Cancel any existing animation
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }
    
    // Start new animation
    frameRef.current = requestAnimationFrame(animateNumber);
    
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [value]);

  const animateNumber = (timestamp) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }
    
    const elapsed = timestamp - startTimeRef.current;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function for smoother animation
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    
    // Calculate current value based on progress
    const currentValue = startValueRef.current + 
      (targetValueRef.current - startValueRef.current) * easeOutQuart;
    
    setDisplayValue(currentValue);
    
    if (progress < 1) {
      frameRef.current = requestAnimationFrame(animateNumber);
    }
  };

  // Format the display value with the specified number of decimal places
  const formattedValue = displayValue.toFixed(decimals);
  
  // Format with thousand separators
  const formatted = Number(formattedValue).toLocaleString('en-IN');

  return (
    <span className={className}>
      {prefix}{formatted}{suffix}
    </span>
  );
};

/**
 * AnimatedProgressBar component that fills up to a target percentage
 * @param {Object} props
 * @param {number} props.percentage - The target percentage (0-100)
 * @param {string} props.color - The color of the progress bar
 * @param {number} props.height - The height of the progress bar in pixels
 * @param {number} props.duration - Animation duration in milliseconds
 */
export const AnimatedProgressBar = ({
  percentage = 0,
  color = 'bg-blue-600',
  height = 8,
  duration = 1500,
  className = ''
}) => {
  const [width, setWidth] = useState(0);
  const barRef = useRef(null);
  
  useEffect(() => {
    // Use CSS animation if available
    if (barRef.current) {
      barRef.current.style.width = '0%';
      barRef.current.style.transition = 'none';
      
      // Force reflow
      void barRef.current.offsetWidth;
      
      barRef.current.style.width = `${percentage}%`;
      barRef.current.style.transition = `width ${duration/1000}s ease-out`;
    }
    
    // Fallback for browsers without CSS transition support
    const startTime = Date.now();
    const startWidth = width;
    const targetWidth = percentage;
    
    const animateWidth = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      setWidth(startWidth + (targetWidth - startWidth) * easeOutQuart);
      
      if (progress < 1) {
        requestAnimationFrame(animateWidth);
      }
    };
    
    requestAnimationFrame(animateWidth);
  }, [percentage, duration]);

  return (
    <div className={`w-full bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700 ${className}`} style={{ height: `${height}px` }}>
      <div 
        ref={barRef}
        className={`h-full ${color} rounded-full`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
};

/**
 * AnimatedStatCard component that displays a statistic with animation
 * @param {Object} props
 * @param {string} props.title - The title of the stat
 * @param {number} props.value - The value to display
 * @param {string} props.prefix - Optional prefix (e.g., currency symbol)
 * @param {string} props.suffix - Optional suffix (e.g., '%')
 * @param {string} props.icon - Optional icon component
 * @param {string} props.color - The accent color
 */
export const AnimatedStatCard = ({
  title,
  value = 0,
  prefix = '',
  suffix = '',
  icon,
  color = 'blue',
  className = ''
}) => {
  const colorMap = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-100 dark:border-blue-800',
      progress: 'bg-blue-600 dark:bg-blue-500'
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      text: 'text-green-600 dark:text-green-400',
      border: 'border-green-100 dark:border-green-800',
      progress: 'bg-green-600 dark:bg-green-500'
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      text: 'text-red-600 dark:text-red-400',
      border: 'border-red-100 dark:border-red-800',
      progress: 'bg-red-600 dark:bg-red-500'
    },
    yellow: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      text: 'text-yellow-600 dark:text-yellow-400',
      border: 'border-yellow-100 dark:border-yellow-800',
      progress: 'bg-yellow-600 dark:bg-yellow-500'
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      text: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-100 dark:border-purple-800',
      progress: 'bg-purple-600 dark:bg-purple-500'
    },
    indigo: {
      bg: 'bg-indigo-50 dark:bg-indigo-900/20',
      text: 'text-indigo-600 dark:text-indigo-400',
      border: 'border-indigo-100 dark:border-indigo-800',
      progress: 'bg-indigo-600 dark:bg-indigo-500'
    }
  };
  
  const colors = colorMap[color] || colorMap.blue;
  
  // Calculate a percentage for the progress bar (for visual effect)
  // This is just for display, using the value as a percentage between 0-100
  const percentage = Math.min(100, Math.max(0, value > 100 ? 100 : value));
  
  return (
    <div className={`rounded-xl border ${colors.border} ${colors.bg} p-4 shadow-sm transition-all duration-300 hover:shadow-md ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">{title}</div>
        {icon && <div className={colors.text}>{icon}</div>}
      </div>
      
      <div className="mt-1">
        <AnimatedNumber 
          value={value}
          prefix={prefix}
          suffix={suffix}
          className={`text-2xl font-bold ${colors.text}`}
        />
      </div>
      
      <div className="mt-3">
        <AnimatedProgressBar 
          percentage={percentage}
          color={colors.progress}
          height={4}
        />
      </div>
    </div>
  );
};

export default AnimatedStatCard;
