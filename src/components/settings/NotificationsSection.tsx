import { motion } from 'framer-motion';
import {  Mail } from 'lucide-react';
import { useState } from 'react';

const NotificationsSection = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleToggleEmail = () => {
    const newValue = !emailNotifications;
    setEmailNotifications(newValue);
    console.log(`Email notifications ${newValue ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-medium text-gray-800 flex items-center">
            <Mail className="mr-2 h-5 w-5" />
            Email Notifications
          </h3>
          <p className="text-gray-600 text-sm">
            Receive important updates via email
          </p>
        </div>
        <motion.button
          animate={emailNotifications ? "on" : "off"}
          variants={{
            on: { backgroundColor: '#10B981' },
            off: { backgroundColor: '#E5E7EB' }
          }}
          onClick={handleToggleEmail}
          className="relative inline-flex h-6 w-11 items-center rounded-full"
        >
          <motion.span
            variants={{
              on: { x: 20 },
              off: { x: 0 }
            }}
            className="inline-block h-4 w-4 rounded-full bg-white"
          />
        </motion.button>
      </div>
    </div>
  );
};

export default NotificationsSection;