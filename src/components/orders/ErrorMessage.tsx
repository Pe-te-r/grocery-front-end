import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export const ErrorMessage = ({ message }: { message: string }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center gap-2"
  >
    <AlertTriangle className="w-5 h-5" />
    <span>{message}</span>
  </motion.div>
);