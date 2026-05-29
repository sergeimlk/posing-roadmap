import { useState, useEffect, useRef } from 'react';

/**
 * DecryptedText Component (from ReactBits)
 * Reveals text with a digital decryption / scrambling effect.
 */
export default function DecryptedText({ 
  text, 
  speed = 40, 
  maxIterations = 8, 
  sequential = true,
  useHover = true,
  className = '' 
}) {
  const [displayedText, setDisplayedText] = useState(text);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef(null);
  
  // Custom characters for scramble (excluding space)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%&*+-/\\?[]{}';

  const startAnimation = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    let iterations = 0;
    
    intervalRef.current = setInterval(() => {
      setDisplayedText(() => {
        return text.split('').map((char, index) => {
          if (char === ' ') return ' ';
          
          // Calculate reveal threshold per character
          const revealLimit = sequential ? index * 1.5 : maxIterations;
          if (iterations > revealLimit) {
            return char;
          }
          
          // Render a random digital glyph
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('');
      });

      iterations++;
      
      const allRevealed = text.split('').every((char, index) => {
        const revealLimit = sequential ? index * 1.5 : maxIterations;
        return iterations > revealLimit;
      });

      if (allRevealed) {
        clearInterval(intervalRef.current);
        setIsAnimating(false);
        setDisplayedText(text);
      }
    }, speed);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps -- ReactBits animation: intentional mount-only trigger
  useEffect(() => { // eslint-disable-line react-hooks/set-state-in-effect
    if (!useHover) {
      startAnimation();
    } else {
      setDisplayedText(text);
    }
    return () => clearInterval(intervalRef.current);
  }, [text, useHover]);

  return (
    <span 
      className={`decrypted-text ${className}`}
      onMouseEnter={useHover ? startAnimation : undefined}
      style={{ 
        fontFamily: 'Courier New, monospace', 
        letterSpacing: '0.03em',
        cursor: useHover ? 'pointer' : 'default'
      }}
    >
      {displayedText}
    </span>
  );
}
