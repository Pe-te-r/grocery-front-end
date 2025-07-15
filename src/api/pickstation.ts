import { getAccessTokenHelper } from '@/lib/authHelper';

import { url as BASE_URL } from './url';

// Get all pickup stations
export const getPickupStations = async (search?: string) => {
  const token = await getAccessTokenHelper()
  let url = `${BASE_URL}/pickup-stations`;

  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch pickup stations');
  }

  return response.json();
};

// Create a new pickup station
export const createPickupStation = async (data: any) => {
  const token = await getAccessTokenHelper()
  const url = `${BASE_URL}/pickup-stations`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error('Failed to create pickup station');
  }

  return response.json();
};

// Update a pickup station
export const updatePickupStation = async (id: string, data: any) => {
  const token = await getAccessTokenHelper()
  const url = `${BASE_URL}/pickup-stations/${id}`;

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error('Failed to update pickup station');
  }

  return response.json();
};

// Delete a pickup station
export const deletePickupStation = async (id: string) => {
  const token = await getAccessTokenHelper()
  const url = `${BASE_URL}/pickup-stations/${id}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete pickup station');
  }

  return response.json();
};


export const fetchPickupStationsByCounty = async (id: string) => {
  const token = await getAccessTokenHelper()
  let url = `${BASE_URL}/pickup-stations/${id}/county`;


  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch pickup stations');
  }

  return response.json();
};