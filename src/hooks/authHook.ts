import { loginFn } from "@/api/auth"
import { authActions } from "@/store/authStore"
import type { LoginDataType, LoginResponseType } from "@/util/types"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import toast from "react-hot-toast"

// useLoginHook.ts
export const useLoginHook = () => {
  const navigate = useNavigate();

  return useMutation<LoginResponseType, Error, LoginDataType>({
    mutationKey: ['login'],
    mutationFn: loginFn,
    onSuccess: (data: LoginResponseType) => {
      if (data?.status === 'success') {
        const userData = data.data;
        navigate({ to: '/dashboard' });
        authActions.setUser({ user: userData, isVerified: true });
        toast.success('Login successful');
      } else {
        toast.error(data?.message || 'Login failed');
      }
    },
    onError: (error) => {
      console.error('Error occurred', error);
      toast.error(error.message || 'An error occurred during login');
    }
  });
};