import { AnimatePresence, motion } from 'framer-motion';
import { User, Shield, Bell } from 'lucide-react';
import { useState } from 'react';
import type { UserData } from './types';
import ProfileSection from './ProfileSection';
import NotificationsSection from './NotificationsSection';
import SecuritySection from './SecuritySection';
import { getUserIdHelper } from '@/lib/authHelper';

const SettingsLayout = ({ userData, refetch }: { userData: UserData, refetch:()=> void }) => {
  const [activeSection, setActiveSection] = useState('profile');

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-3xl font-bold text-gray-800 mb-6"
      >
        Profile-Settings
      </motion.h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="w-full md:w-64 flex-shrink-0"
        >
          <div className="space-y-1">
            {['profile', 'security', 'notifications'].map((section) => {
              const Icon = section === 'profile'
                ? User
                : section === 'security'
                  ? Shield
                  : Bell;
              return (
                <motion.button
                  key={section}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveSection(section)}
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${activeSection === section
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <Icon className="mr-2 h-5 w-5" />
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={sectionVariants}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              {activeSection === 'profile' && (
                <ProfileSection userData={userData} refetch={refetch} />
              )}
              {activeSection === 'security' && (
                <SecuritySection
                  isTwoFactorEnabled={userData.isTwoFactorEnabled}
                  lastLogin={userData.lastLogin}
                  userID={getUserIdHelper()?? ''}
                  refetch={refetch}
                />
              )}
              {activeSection === 'notifications' && <NotificationsSection />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;