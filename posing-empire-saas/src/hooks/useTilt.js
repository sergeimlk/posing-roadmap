import { useRef } from 'react';

/**
 * A custom React hook that adds a premium 3D tilt effect to elements (like cards) on mouse hover.
 * The card tilts slightly towards the direction of the cursor.
 * When the mouse leaves, the card smoothly resets to its original flat orientation.
 * 
 * Disabled per Manaël's request to keep form cards static.
 * 
 * @param {Object} options Configuration options
 */
export default function useTilt() {
  const ref = useRef(null);
  return ref;
}
