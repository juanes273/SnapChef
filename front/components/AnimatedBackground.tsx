import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

export function AnimatedBackground() {
  const [leftImageError, setLeftImageError] = useState(false);
  const [rightImageError, setRightImageError] = useState(false);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 flex">
        <motion.div
          className="w-1/2 h-full relative overflow-hidden"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <Image
            src="/background-left.jpg"
            alt="Background Left"
            layout="fill"
            objectFit="cover"
            quality={100}
            onError={() => {
              console.error("Error loading left background image");
              setLeftImageError(true);
            }}
          />
          {leftImageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500">
              Error loading image
            </div>
          )}
        </motion.div>
        <motion.div
          className="w-1/2 h-full relative overflow-hidden"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <Image
            src="/background-right.jpg"
            alt="Background Right"
            layout="fill"
            objectFit="cover"
            quality={100}
            onError={() => {
              console.error("Error loading right background image");
              setRightImageError(true);
            }}
          />
          {rightImageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500">
              Error loading image
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

