import { Variants } from 'framer-motion';

export const coinSwapVariant: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  enter: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } },
  exit: { opacity: 0, scale: 0.8, y: -10, transition: { duration: 0.25 } },
};

export const pathRevealVariant: Variants = {
  hidden: { opacity: 0, clipPath: 'inset(0 100% 0 0)' },
  visible: { opacity: 1, clipPath: 'inset(0 0% 0 0)', transition: { duration: 0.6, ease: 'easeOut' } },
};

export const cardFadeVariant: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};
