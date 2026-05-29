import { motion } from 'framer-motion';

/**
 * SplitText Component (from ReactBits)
 * Animates text characters with staggered vertical slide and fade entrance.
 */
export default function SplitText({ 
  text, 
  className = '', 
  delay = 0.05, 
  speed = 0.4 
}) {
  const words = text.split(' ');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: delay,
        delayChildren: 0.05
      }
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: speed,
        ease: [0.215, 0.61, 0.355, 1] // Ease out cubic
      }
    }
  };

  return (
    <motion.span
      className={`split-text ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ display: 'inline-flex', flexWrap: 'wrap' }}
    >
      {words.map((word, wordIdx) => (
        <span 
          key={wordIdx} 
          style={{ display: 'inline-flex', marginRight: '0.28em', whiteSpace: 'nowrap' }}
        >
          {word.split('').map((char, charIdx) => (
            <motion.span
              key={charIdx}
              variants={letterVariants}
              style={{ display: 'inline-block' }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.span>
  );
}
