import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface FloatingActionButtonProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  gradient: string;
  position: 'bottom-right' | 'bottom-left';
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  to,
  icon,
  label,
  gradient,
  position
}) => {
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6'
  };

  return (
    <Link to={to}>
      <motion.div
        className={`fixed ${positionClasses[position]} z-50`}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={{ 
          scale: 1.1,
          rotate: 5,
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
        }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <div className={`w-14 h-14 rounded-full bg-gradient-to-r ${gradient} flex items-center justify-center shadow-2xl group relative overflow-hidden`}>
          <motion.div
            className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"
            initial={false}
            animate={{ scale: [0, 1.5] }}
            transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
          />
          <div className="text-white z-10">
            {icon}
          </div>
          
          {/* Tooltip */}
          <motion.div
            className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap"
            initial={{ y: 10, opacity: 0 }}
            whileHover={{ y: 0, opacity: 1 }}
          >
            {label}
          </motion.div>
        </div>
      </motion.div>
    </Link>
  );
};

export default FloatingActionButton;