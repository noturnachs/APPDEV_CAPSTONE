import { useState, useEffect } from 'react';

const NumberTicker = ({ value = 0, duration = 1000, delay = 0 }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      let start = 0;
      const end = parseInt(value);
      const increment = end / 40;
      const timer = setInterval(() => {
        start += increment;
        setCount(Math.floor(start));
        
        if (start >= end) {
          clearInterval(timer);
          setCount(end);
        }
      }, duration / 40);
      
      return () => clearInterval(timer);
    }, delay);
    
    return () => clearTimeout(timeout);
  }, [value, duration, delay]);
  
  return <span>{count}</span>;
};

export default NumberTicker;
