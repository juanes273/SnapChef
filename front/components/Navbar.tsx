import { motion } from 'framer-motion';
import Image from 'next/image';

export function Navbar() {
  return (
    <motion.nav 
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 bg-yellow-600 bg-opacity-90 backdrop-filter backdrop-blur-lg z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          <motion.div 
            className="flex items-center flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image
              src="/logo.jpg"
              alt="SnapChef Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <motion.span 
              className="ml-2 text-xl font-bold text-white"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              SnapChef
            </motion.span>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
}

