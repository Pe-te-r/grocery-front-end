import { loginFn, registerFn, resetPasswordFn, sendCodeMail } from "@/api/auth"
import { loginUserHelper } from "@/lib/authHelper"
import type { ApiResponse, LoginDataType, LoginResponseType, RegisterDataTypeT, RegisterResponseType, } from "@/util/types"
import { useMutation, } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import toast from "react-hot-toast"

// useLoginHook
export const useLoginHook = () => {
  const navigate = useNavigate();
  return useMutation<LoginResponseType, Error, LoginDataType>({
    mutationKey: ['login'],
    mutationFn: loginFn,
    onSuccess: (data: LoginResponseType) => {
      if (data?.status === 'success') {
        const userData = data.data;
        navigate({ to: '/dashboard' });
        // loginUser(data.data.tokens,data.data.user)
        loginUserHelper(data.data.tokens, userData.user)
        // loginUser(data.data.tokens, {isVerified:true,user:data.data.user})
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

// useRegisterHook
export const useRegisterHook = () => {
  const navigate = useNavigate();
  return useMutation<RegisterResponseType, Error, RegisterDataTypeT>({
    mutationKey: ['register'],
    mutationFn: registerFn,
    onSuccess: (data) => {
      if (data.status == 'success') {
        toast.success('Registration success!!Now you can login.')
        navigate({ to: '/login' })
      } else if (data.status == 'error') {
        console.log(data)
        toast.error(data.message)
      }
    },
    onError: (error) => {
      console.error('register error', error.message)
    }
  })
}

interface dataT {
  oldPassword: string;
  newPassword: string
  userID: string
}

export const useResetPassword = () => {
  return useMutation<ApiResponse<null>, Error, dataT>({
    mutationFn: (data: dataT) =>
      resetPasswordFn({ id: data.userID, newPassword: data.newPassword, oldPassword: data.oldPassword }),
  })
};

export const useSendMailCode = () => {
  return useMutation({
    mutationFn: (email: string) => sendCodeMail(email)
  })
}