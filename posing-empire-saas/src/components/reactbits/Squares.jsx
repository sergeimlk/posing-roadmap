import { useRef, useEffect } from 'react';

/**
 * Squares Component (from ReactBits)
 * A canvas-based interactive grid background where squares pulse and glow on mouse hover.
 */
export default function Squares({
  squareSize = 45,
  borderColor = 'rgba(212, 168, 67, 0.05)', // extremely subtle gold borders
  hoverColor = 'rgba(212, 168, 67, 0.12)', // gold flare on hover
  glowColor = 'rgba(212, 168, 67, 0.04)' // ambient gold sparkle
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let squares = [];
    const initSquares = () => {
      const cols = Math.ceil(canvas.width / squareSize);
      const rows = Math.ceil(canvas.height / squareSize);
      squares = [];
      for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
          squares.push({
            x: x * squareSize,
            y: y * squareSize,
            glow: 0,
            decay: 0.02 + Math.random() * 0.02
          });
        }
      }
    };
    initSquares();

    let mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      squares.forEach((sq) => {
        const isMouseOver = mouse.x >= sq.x && mouse.x < sq.x + squareSize &&
          mouse.y >= sq.y && mouse.y < sq.y + squareSize;

        if (isMouseOver) {
          sq.glow = 1.0;
        } else {
          // Random star-like sparkle flare
          if (Math.random() < 0.0004) {
            sq.glow = 0.4 + Math.random() * 0.4;
          } else {
            sq.glow = Math.max(0, sq.glow - sq.decay);
          }
        }

        // Draw glow fill
        if (sq.glow > 0) {
          ctx.fillStyle = isMouseOver ? hoverColor : glowColor.replace('0.04', String(sq.glow * 0.04));
          ctx.fillRect(sq.x, sq.y, squareSize, squareSize);
        }

        // Draw grid border
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 0.5;
        ctx.strokeRect(sq.x, sq.y, squareSize, squareSize);
      });

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [squareSize, borderColor, hoverColor, glowColor]);

  return (
    <canvas
      ref={canvasRef}
      className="squares-background"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'auto',
        zIndex: 0
      }}
    />
  );
}
