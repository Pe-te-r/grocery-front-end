// import { useState, useEffect } from 'react';
// import {
//   User,
//   Mail,
//   Calendar,
//   Shield,
//   Lock,
//   Bell,
//   Check,
//   X,
//   Edit,
//   ChevronDown,
//   ChevronUp,
//   Phone,
//   Key,
//   BadgeCheck,
//   UserCog
// } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';

// interface UserData {
//   first_name: string;
//   last_name: string;
//   email: string;
//   phone?: string;
//   createdAt: string;
//   updatedAt: string;
//   is2FAEnabled: boolean;
//   status?: string;
//   role?: string;
// }

// interface SettingsPageProps {
//   userData: UserData;
//   onSave: (data: { firstName: string; lastName: string; email: string }) => void;
//   onPasswordChange: (currentPassword: string, newPassword: string) => void;
//   onToggle2FA: (enable: boolean) => void;
// }

// const SettingsPage = ({ userData, onSave, onPasswordChange, onToggle2FA }: SettingsPageProps) => {
//   // State for editable fields
//   const [editableUser, setEditableUser] = useState({
//     firstName: '',
//     lastName: '',
//     email: ''
//   });

//   // State for UI controls
//   const [isEditing, setIsEditing] = useState(false);
//   const [activeSection, setActiveSection] = useState('profile');
//   const [currentPassword, setCurrentPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [passwordError, setPasswordError] = useState('');
//   const [passwordSuccess, setPasswordSuccess] = useState(false);
//   const [collapsedSections, setCollapsedSections] = useState({
//     profile: false,
//     security: false,
//     notifications: false
//   });

//   // Initialize with user data
//   useEffect(() => {
//     if (userData) {
//       setEditableUser({
//         firstName: userData.first_name || '',
//         lastName: userData.last_name || '',
//         email: userData.email || ''
//       });
//     }
//   }, [userData]);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setEditableUser(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSaveProfile = () => {
//     onSave(editableUser);
//     setIsEditing(false);
//   };

//   const handlePasswordChange = () => {
//     if (newPassword !== confirmPassword) {
//       setPasswordError('Passwords do not match');
//       return;
//     }

//     if (newPassword.length < 8) {
//       setPasswordError('Password must be at least 8 characters');
//       return;
//     }

//     setPasswordError('');
//     onPasswordChange(currentPassword, newPassword);
//     setPasswordSuccess(true);
//     setTimeout(() => setPasswordSuccess(false), 3000);
//     setCurrentPassword('');
//     setNewPassword('');
//     setConfirmPassword('');
//   };

//   const toggleSection = (section: string) => {
//     setCollapsedSections(prev => ({
//       ...prev,
//       [section]: !prev[section]
//     }));
//   };

//   const formatDate = (dateString: string) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
//   };

//   // Animation variants
//   const sectionVariants = {
//     open: { opacity: 1, height: 'auto' },
//     collapsed: { opacity: 0, height: 0 }
//   };

//   const switchVariants = {
//     on: { backgroundColor: '#10B981' },
//     off: { backgroundColor: '#E5E7EB' }
//   };

//   const thumbVariants = {
//     on: { x: 20 },
//     off: { x: 0 }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
//       <motion.h1
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.3 }}
//         className="text-3xl font-bold text-gray-800 mb-6"
//       >
//         Settings
//       </motion.h1>

//       <div className="flex flex-col md:flex-row gap-6">
//         {/* Sidebar navigation */}
//         <motion.div
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.3, delay: 0.1 }}
//           className="w-full md:w-64 flex-shrink-0"
//         >
//           <div className="space-y-1">
//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={() => setActiveSection('profile')}
//               className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${activeSection === 'profile' ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'}`}
//             >
//               <User className="mr-2 h-5 w-5" />
//               Profile
//             </motion.button>
//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={() => setActiveSection('security')}
//               className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${activeSection === 'security' ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'}`}
//             >
//               <Shield className="mr-2 h-5 w-5" />
//               Security
//             </motion.button>
//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={() => setActiveSection('notifications')}
//               className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${activeSection === 'notifications' ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'}`}
//             >
//               <Bell className="mr-2 h-5 w-5" />
//               Notifications
//             </motion.button>
//           </div>
//         </motion.div>

//         {/* Main content */}
//         <div className="flex-1">
//           {/* Profile Section */}
//           <div className={`mb-8 ${activeSection !== 'profile' ? 'hidden' : ''}`}>
//             <motion.div
//               whileHover={{ scale: 1.01 }}
//               className="flex justify-between items-center cursor-pointer mb-4"
//               onClick={() => toggleSection('profile')}
//             >
//               <h2 className="text-xl font-semibold text-gray-800 flex items-center">
//                 <User className="mr-2 h-5 w-5 text-green-600" />
//                 Profile Information
//               </h2>
//               {collapsedSections.profile ? <ChevronDown /> : <ChevronUp />}
//             </motion.div>

//             <AnimatePresence>
//               {!collapsedSections.profile && (
//                 <motion.div
//                   initial="collapsed"
//                   animate="open"
//                   exit="collapsed"
//                   variants={sectionVariants}
//                   transition={{ duration: 0.3 }}
//                   className="bg-gray-50 p-6 rounded-lg overflow-hidden"
//                 >
//                   {!isEditing ? (
//                     <div className="space-y-4">
//                       <div className="flex items-center">
//                         <span className="text-gray-600 w-32">First Name:</span>
//                         <span className="font-medium">{editableUser.firstName}</span>
//                       </div>
//                       <div className="flex items-center">
//                         <span className="text-gray-600 w-32">Last Name:</span>
//                         <span className="font-medium">{editableUser.lastName}</span>
//                       </div>
//                       <div className="flex items-center">
//                         <span className="text-gray-600 w-32">Email:</span>
//                         <span className="font-medium flex items-center">
//                           <Mail className="mr-2 h-4 w-4" />
//                           {editableUser.email}
//                         </span>
//                       </div>
//                       {userData.phone && (
//                         <div className="flex items-center">
//                           <span className="text-gray-600 w-32">Phone:</span>
//                           <span className="font-medium flex items-center">
//                             <Phone className="mr-2 h-4 w-4" />
//                             {userData.phone}
//                           </span>
//                         </div>
//                       )}
//                       <div className="flex items-center">
//                         <span className="text-gray-600 w-32">Account Created:</span>
//                         <span className="font-medium flex items-center">
//                           <Calendar className="mr-2 h-4 w-4" />
//                           {formatDate(userData?.createdAt)}
//                         </span>
//                       </div>
//                       <div className="flex items-center">
//                         <span className="text-gray-600 w-32">Last Updated:</span>
//                         <span className="font-medium flex items-center">
//                           <Calendar className="mr-2 h-4 w-4" />
//                           {formatDate(userData?.updatedAt)}
//                         </span>
//                       </div>
//                       {userData.role && (
//                         <div className="flex items-center">
//                           <span className="text-gray-600 w-32">Role:</span>
//                           <span className="font-medium flex items-center">
//                             <UserCog className="mr-2 h-4 w-4" />
//                             {userData.role}
//                           </span>
//                         </div>
//                       )}
//                       {userData.status && (
//                         <div className="flex items-center">
//                           <span className="text-gray-600 w-32">Status:</span>
//                           <span className={`font-medium flex items-center ${userData.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
//                             <BadgeCheck className="mr-2 h-4 w-4" />
//                             {userData.status.charAt(0).toUpperCase() + userData.status.slice(1)}
//                           </span>
//                         </div>
//                       )}
//                       <motion.button
//                         whileHover={{ scale: 1.02 }}
//                         whileTap={{ scale: 0.98 }}
//                         onClick={() => setIsEditing(true)}
//                         className="mt-4 flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
//                       >
//                         <Edit className="mr-2 h-4 w-4" />
//                         Edit Profile
//                       </motion.button>
//                     </div>
//                   ) : (
//                     <motion.div
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ duration: 0.2 }}
//                       className="space-y-4"
//                     >
//                       <div className="flex flex-col">
//                         <label className="text-gray-600 mb-1">First Name</label>
//                         <input
//                           type="text"
//                           name="firstName"
//                           value={editableUser.firstName}
//                           onChange={handleInputChange}
//                           className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
//                         />
//                       </div>
//                       <div className="flex flex-col">
//                         <label className="text-gray-600 mb-1">Last Name</label>
//                         <input
//                           type="text"
//                           name="lastName"
//                           value={editableUser.lastName}
//                           onChange={handleInputChange}
//                           className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
//                         />
//                       </div>
//                       <div className="flex flex-col">
//                         <label className="text-gray-600 mb-1">Email</label>
//                         <input
//                           type="email"
//                           name="email"
//                           value={editableUser.email}
//                           onChange={handleInputChange}
//                           className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
//                         />
//                       </div>
//                       <div className="flex space-x-3 mt-4">
//                         <motion.button
//                           whileHover={{ scale: 1.02 }}
//                           whileTap={{ scale: 0.98 }}
//                           onClick={handleSaveProfile}
//                           className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
//                         >
//                           <Check className="mr-2 h-4 w-4" />
//                           Save Changes
//                         </motion.button>
//                         <motion.button
//                           whileHover={{ scale: 1.02 }}
//                           whileTap={{ scale: 0.98 }}
//                           onClick={() => setIsEditing(false)}
//                           className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
//                         >
//                           <X className="mr-2 h-4 w-4" />
//                           Cancel
//                         </motion.button>
//                       </div>
//                     </motion.div>
//                   )}
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>

//           {/* Security Section */}
//           <div className={`mb-8 ${activeSection !== 'security' ? 'hidden' : ''}`}>
//             <motion.div
//               whileHover={{ scale: 1.01 }}
//               className="flex justify-between items-center cursor-pointer mb-4"
//               onClick={() => toggleSection('security')}
//             >
//               <h2 className="text-xl font-semibold text-gray-800 flex items-center">
//                 <Shield className="mr-2 h-5 w-5 text-green-600" />
//                 Security Settings
//               </h2>
//               {collapsedSections.security ? <ChevronDown /> : <ChevronUp />}
//             </motion.div>

//             <AnimatePresence>
//               {!collapsedSections.security && (
//                 <motion.div
//                   initial="collapsed"
//                   animate="open"
//                   exit="collapsed"
//                   variants={sectionVariants}
//                   transition={{ duration: 0.3 }}
//                   className="space-y-6 overflow-hidden"
//                 >
//                   {/* Two-Factor Authentication */}
//                   <div className="bg-gray-50 p-6 rounded-lg">
//                     <div className="flex justify-between items-center mb-4">
//                       <h3 className="font-medium text-gray-800 flex items-center">
//                         <Lock className="mr-2 h-5 w-5" />
//                         Two-Factor Authentication (2FA)
//                       </h3>
//                       <div className="flex items-center">
//                         <span className={`mr-2 text-sm font-medium ${userData?.is2FAEnabled ? 'text-green-600' : 'text-gray-500'}`}>
//                           {userData?.is2FAEnabled ? 'Enabled' : 'Disabled'}
//                         </span>
//                         <motion.button
//                           animate={userData?.is2FAEnabled ? "on" : "off"}
//                           variants={switchVariants}
//                           onClick={() => onToggle2FA(!userData?.is2FAEnabled)}
//                           className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
//                         >
//                           <motion.span
//                             variants={thumbVariants}
//                             className="inline-block h-4 w-4 rounded-full bg-white"
//                           />
//                         </motion.button>
//                       </div>
//                     </div>
//                     <p className="text-gray-600 text-sm">
//                       Two-factor authentication adds an additional layer of security to your account by requiring more than just a password to log in.
//                     </p>
//                   </div>

//                   {/* Change Password */}
//                   <div className="bg-gray-50 p-6 rounded-lg">
//                     <h3 className="font-medium text-gray-800 flex items-center mb-4">
//                       <Key className="mr-2 h-5 w-5" />
//                       Change Password
//                     </h3>
//                     <div className="space-y-4">
//                       <div className="flex flex-col">
//                         <label className="text-gray-600 mb-1">Current Password</label>
//                         <input
//                           type="password"
//                           value={currentPassword}
//                           onChange={(e) => setCurrentPassword(e.target.value)}
//                           className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
//                         />
//                       </div>
//                       <div className="flex flex-col">
//                         <label className="text-gray-600 mb-1">New Password</label>
//                         <input
//                           type="password"
//                           value={newPassword}
//                           onChange={(e) => setNewPassword(e.target.value)}
//                           className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
//                         />
//                       </div>
//                       <div className="flex flex-col">
//                         <label className="text-gray-600 mb-1">Confirm New Password</label>
//                         <input
//                           type="password"
//                           value={confirmPassword}
//                           onChange={(e) => setConfirmPassword(e.target.value)}
//                           className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
//                         />
//                       </div>
//                       {passwordError && (
//                         <motion.div
//                           initial={{ opacity: 0, y: -10 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           className="text-red-500 text-sm"
//                         >
//                           {passwordError}
//                         </motion.div>
//                       )}
//                       {passwordSuccess && (
//                         <motion.div
//                           initial={{ opacity: 0, y: -10 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           className="text-green-600 text-sm"
//                         >
//                           Password changed successfully!
//                         </motion.div>
//                       )}
//                       <motion.button
//                         whileHover={{ scale: 1.02 }}
//                         whileTap={{ scale: 0.98 }}
//                         onClick={handlePasswordChange}
//                         className="mt-2 flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
//                       >
//                         <Check className="mr-2 h-4 w-4" />
//                         Change Password
//                       </motion.button>
//                     </div>
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>

//           {/* Notifications Section */}
//           <div className={`mb-8 ${activeSection !== 'notifications' ? 'hidden' : ''}`}>
//             <motion.div
//               whileHover={{ scale: 1.01 }}
//               className="flex justify-between items-center cursor-pointer mb-4"
//               onClick={() => toggleSection('notifications')}
//             >
//               <h2 className="text-xl font-semibold text-gray-800 flex items-center">
//                 <Bell className="mr-2 h-5 w-5 text-green-600" />
//                 Notification Preferences
//               </h2>
//               {collapsedSections.notifications ? <ChevronDown /> : <ChevronUp />}
//             </motion.div>

//             <AnimatePresence>
//               {!collapsedSections.notifications && (
//                 <motion.div
//                   initial="collapsed"
//                   animate="open"
//                   exit="collapsed"
//                   variants={sectionVariants}
//                   transition={{ duration: 0.3 }}
//                   className="bg-gray-50 p-6 rounded-lg overflow-hidden"
//                 >
//                   <div className="space-y-4">
//                     <div className="flex justify-between items-center">
//                       <div>
//                         <h3 className="font-medium text-gray-800">Email Notifications</h3>
//                         <p className="text-gray-600 text-sm">Receive important updates via email</p>
//                       </div>
//                       <motion.button
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                         className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-600"
//                       >
//                         <span className="inline-block h-4 w-4 transform translate-x-6 rounded-full bg-white" />
//                       </motion.button>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <div>
//                         <h3 className="font-medium text-gray-800">Push Notifications</h3>
//                         <p className="text-gray-600 text-sm">Get instant alerts on your device</p>
//                       </div>
//                       <motion.button
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                         className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200"
//                       >
//                         <span className="inline-block h-4 w-4 transform translate-x-1 rounded-full bg-white" />
//                       </motion.button>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <div>
//                         <h3 className="font-medium text-gray-800">SMS Alerts</h3>
//                         <p className="text-gray-600 text-sm">Critical notifications via text message</p>
//                       </div>
//                       <motion.button
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                         className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200"
//                       >
//                         <span className="inline-block h-4 w-4 transform translate-x-1 rounded-full bg-white" />
//                       </motion.button>
//                     </div>
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SettingsPage;