import { loginFn } from "@/api/auth"
import { authActions } from "@/store/authStore"
import type { LoginDataType, LoginResponseType } from "@/util/types"
import { useMutation } from "@tanstack/react-query"

export const useLoginHook = () => {
  return useMutation<LoginResponseType, Error, LoginDataType>({
    mutationKey: ['login'],
    mutationFn: loginFn,
    onSuccess: (data: LoginResponseType) => {
      console.log('login data reponse', data);
      const userData = data?.data
      authActions.setUser({user:{ ...userData},isVerified: true })
    },
    onError: (error) => {
      console.error('error occured', error);
    }
  })
}