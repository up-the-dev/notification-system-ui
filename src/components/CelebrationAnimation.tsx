import React from 'react';
import { motion } from 'framer-motion';

const CelebrationAnimation: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Fireworks */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`firework-${i}`}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 60 + 20}%`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1, 1.5, 0],
            opacity: [0, 1, 1, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            delay: i * 0.2,
            ease: "easeOut",
          }}
        >
          {/* Firework burst */}
          {[...Array(8)].map((_, j) => (
            <motion.div
              key={j}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: `hsl(${Math.random() * 360}, 70%, 60%)`,
              }}
              initial={{ x: 0, y: 0, scale: 0 }}
              animate={{
                x: Math.cos((j * 45 * Math.PI) / 180) * (30 + Math.random() * 20),
                y: Math.sin((j * 45 * Math.PI) / 180) * (30 + Math.random() * 20),
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.2 + 0.5,
                ease: "easeOut",
              }}
            />
          ))}
        </motion.div>
      ))}

      {/* Confetti */}
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={`confetti-${i}`}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            background: `hsl(${Math.random() * 360}, 70%, 60%)`,
            left: `${Math.random() * 100}%`,
            top: '-10%',
          }}
          initial={{ y: 0, rotate: 0, opacity: 1 }}
          animate={{
            y: window.innerHeight + 100,
            rotate: Math.random() * 720,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: Math.random() * 2,
            ease: "easeIn",
          }}
        />
      ))}

      {/* Sparkles */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute w-1 h-1 bg-yellow-300 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1,
            delay: Math.random() * 3,
            repeat: 3,
            repeatDelay: Math.random() * 2,
          }}
        />
      ))}

      {/* Shooting stars */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute w-1 h-20 bg-gradient-to-b from-white to-transparent"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 50}%`,
            transform: 'rotate(45deg)',
          }}
          initial={{ x: -100, opacity: 0 }}
          animate={{
            x: window.innerWidth + 100,
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.5,
            delay: i * 0.3,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
};

export default CelebrationAnimation;