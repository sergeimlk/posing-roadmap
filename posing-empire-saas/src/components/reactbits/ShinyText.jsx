import React from 'react';

/**
 * ShinyText Component (from ReactBits)
 * Creates a beautiful golden shimmering sweep animation across text.
 */
export default function ShinyText({ 
  text, 
  disabled = false, 
  speed = 5, 
  className = '' 
}) {
  const animationDuration = `${speed}s`;

  return (
    <span 
      className={`shiny-text ${disabled ? 'disabled' : ''} ${className}`}
      style={{
        animationDuration: animationDuration,
        display: 'inline-block'
      }}
    >
      {text}
    </span>
  );
}
