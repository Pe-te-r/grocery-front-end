import SettingsPage from '@/components/Settings';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/settings')({
  component: RouteComponent,
})

interface userData {
  first_name: string;
  last_name: string
  email: string;
  createdAt: string;
  updatedAt: string;
  is2FAEnabled: boolean;
}

function RouteComponent() {

  const userData = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    createdAt: '2023-01-15T10:30:00Z',
    updatedAt: '2023-06-20T14:45:00Z',
    is2FAEnabled: false,
    // ... other user data
  };

  const handleSaveProfile = (updatedData: userData) => {
    console.log('Saving profile:', updatedData);
    // API call to save the data
  };

  const handlePasswordChange = (currentPassword:string, newPassword:string) => {
    console.log('Changing password:', { currentPassword, newPassword });
    // API call to change password
  };

  const handleToggle2FA = (enable:boolean) => {
    console.log('Toggling 2FA:', enable);
    // API call to enable/disable 2FA
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <SettingsPage
        userData={userData}
        onSave={handleSaveProfile}
        onPasswordChange={handlePasswordChange}
        onToggle2FA={handleToggle2FA}
      />
    </div>
  )
}


