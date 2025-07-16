import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const LoadingSpinner = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex justify-center items-center py-8"
  >
    <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
  </motion.div>
);