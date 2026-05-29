import { useRef, useState } from 'react';

/**
 * SpotlightCard Component (from ReactBits)
 * A glassmorphic card container with a cursor-following radial gold glow.
 */
export default function SpotlightCard({ 
  children, 
  className = '', 
  spotlightColor = 'rgba(212, 168, 67, 0.12)', // gold glow
  borderColor = 'rgba(212, 168, 67, 0.22)',
  glowSize = 350
}) {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`spotlight-card ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '16px',
        border: `1px solid ${borderColor}`,
        background: 'rgba(12, 12, 12, 0.82)',
        backdropFilter: 'blur(16px)',
        padding: '24px',
        transition: 'border-color 0.3s'
      }}
    >
      {/* Light Sweep Follower */}
      <div
        style={{
          pointerEvents: 'none',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: opacity,
          transition: 'opacity 0.4s ease',
          background: `radial-gradient(${glowSize}px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`,
          zIndex: 0
        }}
      />
      {/* Content wrapper */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
