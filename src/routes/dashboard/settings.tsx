import { Loading } from '@/components/Loading';
import SettingsLayout from '@/components/settings/SecurityLayout';
import { userByIdHook } from '@/hooks/userHook';
import { getUserIdHelper } from '@/lib/authHelper';
// import type { User, UserData } from '@/util/types';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/dashboard/settings')({
  component: SettingsRouteComponent,
});

function SettingsRouteComponent() {
  const { data, isSuccess, isLoading,refetch } = userByIdHook(getUserIdHelper() ?? '', { account_modal: true });
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    joinedAt: '',
    lastLogin: '',
    isTwoFactorEnabled: false,
    status: '',
    role: ''
  });

  useEffect(() => {
    if (isSuccess && data?.data) {
      const user = data.data;
      setUserData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        joinedAt: user.joinedAt || '',
        lastLogin: user.lastLogin || '',
        isTwoFactorEnabled: user.isTwoFactorEnabled || false,
        status: user.status || '',
        role: user.role || ''
      });
    }
  }, [isSuccess, data]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 flex justify-center items-center">
        <Loading/>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <SettingsLayout userData={userData} refetch={refetch} />
    </div>
  );
}