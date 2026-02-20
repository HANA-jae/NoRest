'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useReducedMotion,
  type Variants,
  type Transition,
  type HTMLMotionProps,
} from 'framer-motion';

// ─── Reduced Motion Hook ───
function useMotionSafe() {
  const prefersReduced = useReducedMotion();
  return !prefersReduced;
}

// ─── FadeIn ───
interface FadeInProps extends HTMLMotionProps<'div'> {
  delay?: number;
  duration?: number;
  y?: number;
  once?: boolean;
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.5,
  y = 20,
  once = true,
  ...props
}: FadeInProps) {
  const enabled = useMotionSafe();
  return (
    <motion.div
      initial={enabled ? { opacity: 0, y } : undefined}
      whileInView={enabled ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once, margin: '-50px' }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ─── SlideIn ───
type Direction = 'left' | 'right' | 'up' | 'down';

interface SlideInProps extends HTMLMotionProps<'div'> {
  direction?: Direction;
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
}

const slideOffset = (dir: Direction, dist: number) => {
  switch (dir) {
    case 'left': return { x: -dist, y: 0 };
    case 'right': return { x: dist, y: 0 };
    case 'up': return { x: 0, y: -dist };
    case 'down': return { x: 0, y: dist };
  }
};

export function SlideIn({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.5,
  distance = 30,
  once = true,
  ...props
}: SlideInProps) {
  const enabled = useMotionSafe();
  const offset = slideOffset(direction, distance);
  return (
    <motion.div
      initial={enabled ? { opacity: 0, ...offset } : undefined}
      whileInView={enabled ? { opacity: 1, x: 0, y: 0 } : undefined}
      viewport={{ once, margin: '-50px' }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ─── ScaleIn ───
interface ScaleInProps extends HTMLMotionProps<'div'> {
  delay?: number;
  duration?: number;
  once?: boolean;
}

export function ScaleIn({
  children,
  delay = 0,
  duration = 0.4,
  once = true,
  ...props
}: ScaleInProps) {
  const enabled = useMotionSafe();
  return (
    <motion.div
      initial={enabled ? { opacity: 0, scale: 0.9 } : undefined}
      whileInView={enabled ? { opacity: 1, scale: 1 } : undefined}
      viewport={{ once, margin: '-50px' }}
      transition={{
        duration,
        delay,
        type: 'spring',
        stiffness: 200,
        damping: 20,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ─── Stagger Container + Item ───
const staggerContainerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
};

interface StaggerContainerProps extends HTMLMotionProps<'div'> {
  stagger?: number;
  once?: boolean;
}

export function StaggerContainer({
  children,
  stagger = 0.08,
  once = true,
  ...props
}: StaggerContainerProps) {
  const enabled = useMotionSafe();
  const variants: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: stagger },
    },
  };
  return (
    <motion.div
      variants={enabled ? variants : undefined}
      initial={enabled ? 'hidden' : undefined}
      whileInView={enabled ? 'show' : undefined}
      viewport={{ once, margin: '-30px' }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps extends HTMLMotionProps<'div'> {
  y?: number;
}

export function StaggerItem({ children, y = 16, ...props }: StaggerItemProps) {
  const enabled = useMotionSafe();
  const variants: Variants = {
    hidden: { opacity: 0, y },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
    },
  };
  return (
    <motion.div variants={enabled ? variants : undefined} {...props}>
      {children}
    </motion.div>
  );
}

// ─── CountUp ───
interface CountUpProps {
  end: number;
  duration?: number;
  delay?: number;
  separator?: string;
  prefix?: string;
  suffix?: string;
  className?: string;
  decimals?: number;
}

export function CountUp({
  end,
  duration = 1,
  delay = 0,
  separator = ',',
  prefix = '',
  suffix = '',
  className,
  decimals = 0,
}: CountUpProps) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);
  const enabled = useMotionSafe();

  useEffect(() => {
    if (!enabled) {
      setValue(end);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;

          const startTime = performance.now() + delay * 1000;
          const endTime = startTime + duration * 1000;

          const animate = (now: number) => {
            if (now < startTime) {
              requestAnimationFrame(animate);
              return;
            }
            const progress = Math.min((now - startTime) / (duration * 1000), 1);
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            setValue(eased * end);
            if (progress < 1) requestAnimationFrame(animate);
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration, delay, enabled]);

  const formatted = decimals > 0
    ? value.toFixed(decimals)
    : Math.round(value).toLocaleString('ko-KR');

  return (
    <span ref={ref} className={className}>
      {prefix}{formatted}{suffix}
    </span>
  );
}

// ─── AnimatedProgress ───
interface AnimatedProgressProps {
  value: number; // 0-100
  delay?: number;
  duration?: number;
  className?: string;
  barClassName?: string;
}

export function AnimatedProgress({
  value,
  delay = 0,
  duration = 0.8,
  className,
  barClassName,
}: AnimatedProgressProps) {
  const enabled = useMotionSafe();
  return (
    <div className={className}>
      <motion.div
        className={barClassName}
        initial={enabled ? { width: '0%' } : { width: `${value}%` }}
        whileInView={enabled ? { width: `${value}%` } : undefined}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      />
    </div>
  );
}

// ─── PageTransition ───
export function PageTransition({ children }: { children: React.ReactNode }) {
  const enabled = useMotionSafe();
  return (
    <motion.div
      initial={enabled ? { opacity: 0, y: 8 } : undefined}
      animate={enabled ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

