import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { fadeUp, staggerParent, viewportOnce } from '@/lib/motion';

type Props = {
  id?: string;
  className?: string;
  children: ReactNode;
  variant?: 'default' | 'dark' | 'sand';
  noPadding?: boolean;
};

const variantClasses: Record<NonNullable<Props['variant']>, string> = {
  default: 'bg-bone text-ink',
  dark: 'bg-ink text-bone',
  sand: 'bg-sand-soft text-ink',
};

export function Section({ id, className = '', children, variant = 'default', noPadding = false }: Props) {
  return (
    <section
      id={id}
      className={`${variantClasses[variant]} ${noPadding ? '' : 'py-24 sm:py-32'} ${className}`}
    >
      <motion.div
        variants={staggerParent}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="container-x"
      >
        <motion.div variants={fadeUp}>{children}</motion.div>
      </motion.div>
    </section>
  );
}
