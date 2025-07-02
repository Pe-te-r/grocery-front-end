import { loginFn, registerFn } from "@/api/auth"
import { authActions } from "@/store/authStore"
import type { LoginDataType, LoginResponseType } from "@/util/types"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"

export const useLoginHook = () => {
  return useMutation<LoginResponseType, Error, LoginDataType>({
    mutationKey: ['login'],
    mutationFn: loginFn,
    onSuccess: (data: LoginResponseType) => {
      console.log('login data reponse', data);
      if (data?.status == 'success') {
        const userData = data?.data
        authActions.setUser({ user: userData, isVerified: true })
        toast.success('Login was success')
      }
      else toast.error(data?.message)
    },
    onError: (error) => {
      console.error('error occured', error);
      toast.error(error?.message)

    }
  })
}

export const useRegisterHook = () => {
  return useMutation({
    mutationKey: ['register'],
    mutationFn: registerFn,
    onSuccess: (data) => {
      console.log(data)
      toast.success('user registered success!')
    },
    onError: (error) => {
      console.error('error occured', error);
    }
  })
}