import { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Calendar,
  Shield,
  Lock,
  Bell,
  Check,
  X,
  Edit,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const SettingsPage = ({ userData, onSave, onPasswordChange, onToggle2FA }) => {
  // State for editable fields
  const [editableUser, setEditableUser] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  // State for UI controls
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState({
    profile: false,
    security: false,
    notifications: false
  });

  // Initialize with user data
  useEffect(() => {
    if (userData) {
      setEditableUser({
        firstName: userData.first_name || '',
        lastName: userData.last_name || '',
        email: userData.email || ''
      });
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    onSave(editableUser);
    setIsEditing(false);
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }

    setPasswordError('');
    onPasswordChange(currentPassword, newPassword);
    setPasswordSuccess(true);
    setTimeout(() => setPasswordSuccess(false), 3000);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const toggleSection = (section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Settings</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar navigation */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="space-y-1">
            <button
              onClick={() => setActiveSection('profile')}
              className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${activeSection === 'profile' ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <User className="mr-2 h-5 w-5" />
              Profile
            </button>
            <button
              onClick={() => setActiveSection('security')}
              className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${activeSection === 'security' ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Shield className="mr-2 h-5 w-5" />
              Security
            </button>
            <button
              onClick={() => setActiveSection('notifications')}
              className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${activeSection === 'notifications' ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Bell className="mr-2 h-5 w-5" />
              Notifications
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          {/* Profile Section */}
          <div className={`mb-8 ${activeSection !== 'profile' ? 'hidden' : ''}`}>
            <div
              className="flex justify-between items-center cursor-pointer mb-4"
              onClick={() => toggleSection('profile')}
            >
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <User className="mr-2 h-5 w-5 text-green-600" />
                Profile Information
              </h2>
              {collapsedSections.profile ? <ChevronDown /> : <ChevronUp />}
            </div>

            {!collapsedSections.profile && (
              <div className="bg-gray-50 p-6 rounded-lg">
                {!isEditing ? (
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <span className="text-gray-600 w-32">First Name:</span>
                      <span className="font-medium">{editableUser.firstName}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 w-32">Last Name:</span>
                      <span className="font-medium">{editableUser.lastName}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 w-32">Email:</span>
                      <span className="font-medium flex items-center">
                        <Mail className="mr-2 h-4 w-4" />
                        {editableUser.email}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 w-32">Account Created:</span>
                      <span className="font-medium flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        {formatDate(userData?.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 w-32">Last Updated:</span>
                      <span className="font-medium flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        {formatDate(userData?.updatedAt)}
                      </span>
                    </div>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="mt-4 flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <label className="text-gray-600 mb-1">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={editableUser.firstName}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-gray-600 mb-1">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={editableUser.lastName}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-gray-600 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={editableUser.email}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div className="flex space-x-3 mt-4">
                      <button
                        onClick={handleSaveProfile}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Save Changes
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Security Section */}
          <div className={`mb-8 ${activeSection !== 'security' ? 'hidden' : ''}`}>
            <div
              className="flex justify-between items-center cursor-pointer mb-4"
              onClick={() => toggleSection('security')}
            >
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <Shield className="mr-2 h-5 w-5 text-green-600" />
                Security Settings
              </h2>
              {collapsedSections.security ? <ChevronDown /> : <ChevronUp />}
            </div>

            {!collapsedSections.security && (
              <div className="space-y-6">
                {/* Two-Factor Authentication */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-gray-800 flex items-center">
                      <Lock className="mr-2 h-5 w-5" />
                      Two-Factor Authentication (2FA)
                    </h3>
                    <div className="flex items-center">
                      <span className={`mr-2 text-sm font-medium ${userData?.is2FAEnabled ? 'text-green-600' : 'text-gray-500'}`}>
                        {userData?.is2FAEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                      <button
                        onClick={() => onToggle2FA(!userData?.is2FAEnabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${userData?.is2FAEnabled ? 'bg-green-600' : 'bg-gray-200'}`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${userData?.is2FAEnabled ? 'translate-x-6' : 'translate-x-1'}`}
                        />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Two-factor authentication adds an additional layer of security to your account by requiring more than just a password to log in.
                  </p>
                </div>

                {/* Change Password */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-medium text-gray-800 flex items-center mb-4">
                    <Lock className="mr-2 h-5 w-5" />
                    Change Password
                  </h3>
                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <label className="text-gray-600 mb-1">Current Password</label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-gray-600 mb-1">New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-gray-600 mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    {passwordError && (
                      <div className="text-red-500 text-sm">{passwordError}</div>
                    )}
                    {passwordSuccess && (
                      <div className="text-green-600 text-sm">Password changed successfully!</div>
                    )}
                    <button
                      onClick={handlePasswordChange}
                      className="mt-2 flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notifications Section */}
          <div className={`mb-8 ${activeSection !== 'notifications' ? 'hidden' : ''}`}>
            <div
              className="flex justify-between items-center cursor-pointer mb-4"
              onClick={() => toggleSection('notifications')}
            >
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <Bell className="mr-2 h-5 w-5 text-green-600" />
                Notification Preferences
              </h2>
              {collapsedSections.notifications ? <ChevronDown /> : <ChevronUp />}
            </div>

            {!collapsedSections.notifications && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-800">Email Notifications</h3>
                      <p className="text-gray-600 text-sm">Receive important updates via email</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-600">
                      <span className="inline-block h-4 w-4 transform translate-x-6 rounded-full bg-white" />
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-800">Push Notifications</h3>
                      <p className="text-gray-600 text-sm">Get instant alerts on your device</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                      <span className="inline-block h-4 w-4 transform translate-x-1 rounded-full bg-white" />
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-800">SMS Alerts</h3>
                      <p className="text-gray-600 text-sm">Critical notifications via text message</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                      <span className="inline-block h-4 w-4 transform translate-x-1 rounded-full bg-white" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;