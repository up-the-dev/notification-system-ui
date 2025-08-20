import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'from-cyan-400 to-purple-400' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex items-center justify-center">
      <motion.div
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-r ${color}`}
        animate={{
          rotate: 360,
          scale: [1, 1.2, 1],
        }}
        transition={{
          rotate: {
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          },
          scale: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      />
      <motion.div
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-r ${color} absolute`}
        animate={{
          rotate: -360,
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          rotate: {
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          },
          opacity: {
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      />
    </div>
  );
};

export default LoadingSpinner;