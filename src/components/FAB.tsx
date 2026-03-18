import React from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface FABProps {
  onClick: () => void;
}

export default function FAB({ onClick }: FABProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="fixed bottom-20 right-6 md:bottom-8 md:right-8 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center z-50 hover:bg-blue-700 transition-colors"
      aria-label="Add new drop"
    >
      <Plus className="w-8 h-8" />
    </motion.button>
  );
}
