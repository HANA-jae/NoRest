'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from '@/components/motion';

interface PhaseCelebrationProps {
  phaseTitle: string | null;
  isAllComplete?: boolean;
  onDismiss: () => void;
}

function Confetti({ count = 40 }: { count?: number }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 1.5 + Math.random() * 1.5,
        size: 4 + Math.random() * 6,
        color: [
          '#f59e0b', '#10b981', '#3b82f6', '#ef4444',
          '#8b5cf6', '#ec4899', '#14b8a6', '#f97316',
        ][i % 8],
        rotation: Math.random() * 360,
        drift: (Math.random() - 0.5) * 60,
      })),
    [count],
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            left: `${p.x}%`,
            top: '-5%',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
          initial={{ y: 0, x: 0, rotate: 0, opacity: 1 }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, p.drift],
            rotate: [0, p.rotation + 360],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

export function PhaseCelebration({ phaseTitle, isAllComplete, onDismiss }: PhaseCelebrationProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (phaseTitle) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onDismiss, 400);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [phaseTitle, onDismiss]);

  return (
    <AnimatePresence>
      {visible && phaseTitle && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => { setVisible(false); setTimeout(onDismiss, 300); }}
        >
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

          <Confetti count={isAllComplete ? 60 : 35} />

          <motion.div
            className="relative z-10 text-center px-8 py-10"
            initial={{ scale: 0.5, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 250, damping: 20, delay: 0.1 }}
          >
            {/* Checkmark circle */}
            <motion.div
              className="mx-auto mb-5 w-20 h-20 rounded-full bg-white shadow-xl flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.2 }}
            >
              <motion.svg
                className={`w-10 h-10 ${isAllComplete ? 'text-amber-500' : 'text-green-500'}`}
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2.5"
                stroke="currentColor"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                {isAllComplete ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                )}
              </motion.svg>
            </motion.div>

            {/* Title */}
            <motion.p
              className="text-2xl font-bold text-white mb-2 drop-shadow-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {isAllComplete ? '모든 단계 완료!' : `${phaseTitle} 완료!`}
            </motion.p>

            {/* Subtitle */}
            <motion.p
              className="text-sm text-white/80 drop-shadow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {isAllComplete
                ? '모든 이직 준비를 마쳤어요. 새로운 시작을 응원합니다!'
                : '다음 단계도 화이팅!'}
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
