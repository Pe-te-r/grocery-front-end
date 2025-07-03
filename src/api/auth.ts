import type { LoginDataType, RegisterDataTypeT } from "@/util/types";
import { url } from "./url";

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