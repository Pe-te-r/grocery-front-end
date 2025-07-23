import { motion } from 'framer-motion';
export const ProgressCard = ({ 
  title, 
  value, 
  total, 
  color = 'green' 
}: {
  title: string;
  value: number;
  total: number;
  color?: 'green' | 'blue' | 'orange' | 'red';
}) => {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  const colorClasses = {
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800',
    orange: 'bg-orange-100 text-orange-800',
    red: 'bg-red-100 text-red-800',
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
    >
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-2xl font-bold text-gray-800">
          {value} <span className="text-sm font-normal text-gray-500">/ {total}</span>
        </span>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${colorClasses[color]}`}>
          {percentage}%
        </span>
      </div>
      <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${
            color === 'green' ? 'bg-green-500' :
            color === 'blue' ? 'bg-blue-500' :
            color === 'orange' ? 'bg-orange-500' : 'bg-red-500'
          }`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </motion.div>
  );
};
