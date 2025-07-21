// src/hooks/useCreateDriver.ts

import { createDriver, getDriverOrders, type CreateDriverDto } from '@/api/driver';
import { useMutation } from '@tanstack/react-query';

export const useCreateDriver = () => {
  return useMutation({
    mutationFn: (driverData: CreateDriverDto) => createDriver(driverData),
    onSuccess: (data) => {
      console.log('Driver created successfully:', data);
      // You can add additional logic here (e.g., showing a toast, redirecting)
    },
    onError: (error) => {
      console.error('Error creating driver:', error);
      // Handle error (e.g., show an error message)
    },
  });
};

import { useQuery } from '@tanstack/react-query';

export const useGetDriverOrders = () => {
  return useQuery({
    queryKey: ['driver-orders'],
    queryFn: getDriverOrders,
  });
};
