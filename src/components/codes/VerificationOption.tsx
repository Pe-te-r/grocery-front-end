import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';


interface VerificationOptionProps {
  title: string;
  description: string;
  icon: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  isVerified?: boolean;
}

export const VerificationOption = ({
  title,
  description,
  icon,
  onClick,
  disabled = false,
  isVerified = false,
}: VerificationOptionProps) => {
  return (
    <motion.div
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={disabled ? undefined : onClick}
      className={`p-4 border rounded-lg transition-all ${disabled
          ? 'bg-gray-100 border-gray-200 cursor-not-allowed'
          : onClick
            ? 'hover:border-green-400 hover:bg-green-50 border-gray-300 cursor-pointer'
            : 'border-gray-300'
        } relative overflow-hidden`}
    >
      {isVerified && (
        <div className="absolute top-0 right-0 bg-green-100 text-green-700 p-1 rounded-bl-lg">
          <Check size={16} />
        </div>
      )}
      <div className="flex items-start">
        <div className="mr-3 mt-1">{icon}</div>
        <div>
          <h3 className={`font-medium ${disabled ? 'text-gray-500' : 'text-gray-800'}`}>
            {title}
          </h3>
          <p className={`text-sm ${disabled ? 'text-gray-400' : 'text-gray-600'}`}>
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};