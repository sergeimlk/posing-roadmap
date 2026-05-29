import { forwardRef, useEffect, useRef } from 'react';
import './StarBorder.css';

const StarBorder = forwardRef(({
  as: Component = 'div',
  className = '',
  color = 'white',
  speed = '6s',
  thickness = 1,
  children,
  ...rest
}, ref) => {
  const containerRef = useRef(null);

  // Sync ref
  useEffect(() => {
    if (!ref) return;
    if (typeof ref === 'function') {
      ref(containerRef.current);
    } else {
      ref.current = containerRef.current;
    }
  }, [ref]);

  return (
    <Component
      ref={containerRef}
      className={`star-border-container ${className}`}
      style={{
        padding: `${thickness}px`,
        ...rest.style
      }}
      {...rest}
    >
      <div
        className="border-gradient-bottom"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed
        }}
      ></div>
      <div
        className="border-gradient-top"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed
        }}
      ></div>
      <div className="inner-content">{children}</div>
    </Component>
  );
});

StarBorder.displayName = 'StarBorder';

export default StarBorder;
