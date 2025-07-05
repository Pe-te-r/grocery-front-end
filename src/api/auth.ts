import type { LoginDataType, RegisterDataTypeT } from "@/util/types";
import { url } from "./url";
import { getAuthTokens } from "@/lib/authHelper";

export const loginFn = async (data: LoginDataType) => {
  const response = await fetch(`${url}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body:JSON.stringify(data)
  })
  const json_data = await response.json()
  return json_data
}

export const registerFn = async (data: RegisterDataTypeT) => {
  const response = await fetch(`${url}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  const json_data = await response.json()
  return json_data
}


export const resetPasswordFn = async ({
  id,
  oldPassword,
  newPassword,
}: {
  id: string;
  oldPassword: string;
  newPassword: string;
}) => {
  const token = getAuthTokens()?.accessToken;
  const response = await fetch(`/api/auth/reset-password/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ oldPassword, newPassword }),
  });

  // if (!response.ok) {
  //   const error = await response.json();
  //   throw new Error(error.message || 'Failed to reset password');
  // }

  return await response.json();
};