

import { createPickupStation, deletePickupStation, getPickupStations, updatePickupStation } from '@/api/pickstation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const usePickupStationsQuery = (search?: string) => {
  return useQuery({
    queryKey: ['pickupStations', search],
    queryFn: () => getPickupStations(search),
  });
};

export const useCreatePickupStation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPickupStation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pickupStations'] });
    }
  });
};

export const useUpdatePickupStation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) =>
      updatePickupStation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pickupStations'] });
    }
  });
};

export const useDeletePickupStation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePickupStation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pickupStations'] });
    }
  });
};