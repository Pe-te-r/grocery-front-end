// src/api/driverApi.ts

import { getAccessTokenHelper } from "@/lib/authHelper";
import { url } from "./url";

export enum DriverStatus {
  OFFLINE = 'offline',
  AVAILABLE = 'available',
  ASSIGNED = 'assigned',
  IN_TRANSIT = 'in_transit',
  ON_BREAK = 'on_break',
}

export enum VehicleType {
  MOTORCYCLE = 'motorcycle',
  CAR = 'car',
  VAN = 'van',
  TRUCK = 'truck',
  BICYCLE = 'bicycle',
}
export interface CreateDriverDto {
  userId: string;
  status?: DriverStatus;
  vehicle_type: VehicleType;
  license_plate: string;
}


export const createDriver = async (driverData: CreateDriverDto) => {
  const token = await getAccessTokenHelper()
  const response = await fetch(`${url}/driver`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization':`Bearer ${token}`
    },
    body: JSON.stringify(driverData),
  });

  if (!response.ok) {
    throw new Error('Failed to create driver');
  }

  return response.json();
};