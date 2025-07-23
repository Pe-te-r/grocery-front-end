import {motion} from 'framer-motion';
export const StatCard = ({ 
  title, 
  value, 
  icon, 
  change, 
  className = '' 
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  change?: number;
  className?: string;
}) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${className}`}
  >
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold mt-1 text-gray-800">{value}</h3>
      </div>
      <div className="p-3 rounded-lg bg-green-50 text-green-600">
        {icon}
      </div>
    </div>
    {change !== undefined && (
      <div className="mt-4 flex items-center">
        <span className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {change >= 0 ? '+' : ''}{change}%
        </span>
        <span className="text-xs text-gray-500 ml-1">vs last period</span>
      </div>
    )}
  </motion.div>
);