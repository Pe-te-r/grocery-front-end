import type { LoginDataType, RegisterDataTypeT } from "@/util/types";
import { url } from "./url";
import { getAuthTokens } from "@/lib/authHelper";

export const loginFn = async (data: LoginDataType) => {
  const response = await fetch(`${url}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
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
  const response = await fetch(`${url}/auth/reset-password/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ oldPassword, newPassword }),
  });

  return await response.json();
};

export const sendCodeMail = async (email: string) => {
  console.log('email', email)
  const token = getAuthTokens()?.accessToken;

  const response = await fetch(`${url}/auth/code`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ 'email': email, reason: 'PASSWORD_RESET'})
  })
  const response_json = await response.json()
  return response_json;
}