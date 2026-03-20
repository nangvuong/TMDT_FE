import axiosClient from './axiosClient';
import { ADDRESSES_ENDPOINTS } from '../constants/api';
import type { Address, CreateAddressDto, UpdateAddressDto } from '../types';

/**
 * Address Service - Handles all address-related API calls
 * All endpoints require JWT authentication
 */
export const addressService = {
  /**
   * Get all addresses for the current user
   */
  getAddresses: async (): Promise<Address[]> => {
    try {
      const result = await axiosClient.get<Address[] | { data: Address[] }>(ADDRESSES_ENDPOINTS.GET_ALL);
      // Handle wrapped response { data: [...] } or direct array [...]
      return Array.isArray(result) ? result : (result as any).data || result;
    } catch (error) {
      console.error('Error fetching addresses:', error);
      throw error;
    }
  },

  /**
   * Get a specific address by ID
   */
  getAddressById: async (id: string): Promise<Address> => {
    try {
      const endpoint = ADDRESSES_ENDPOINTS.GET_BY_ID.replace(':id', id);
      const result = await axiosClient.get<Address | { data: Address }>(endpoint);
      // Handle wrapped response { data: {...} } or direct object {...}
      return Array.isArray(result) ? result[0] : (result as any).data || result;
    } catch (error) {
      console.error(`Error fetching address ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new address
   * If isDefault is true, other addresses will be set to isDefault: false
   */
  createAddress: async (data: CreateAddressDto): Promise<Address> => {
    try {
      const result = await axiosClient.post<Address | { data: Address }>(ADDRESSES_ENDPOINTS.CREATE, data);
      // Handle wrapped response { data: {...} } or direct object {...}
      return Array.isArray(result) ? result[0] : (result as any).data || result;
    } catch (error) {
      console.error('Error creating address:', error);
      throw error;
    }
  },

  /**
   * Update an existing address
   * If isDefault is true, other addresses will be set to isDefault: false
   */
  updateAddress: async (id: string, data: UpdateAddressDto): Promise<Address> => {
    try {
      const endpoint = ADDRESSES_ENDPOINTS.UPDATE.replace(':id', id);
      const result = await axiosClient.put<Address | { data: Address }>(endpoint, data);
      // Handle wrapped response { data: {...} } or direct object {...}
      return Array.isArray(result) ? result[0] : (result as any).data || result;
    } catch (error) {
      console.error(`Error updating address ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete an address
   */
  deleteAddress: async (id: string): Promise<{ success: boolean }> => {
    try {
      const endpoint = ADDRESSES_ENDPOINTS.DELETE.replace(':id', id);
      const result = await axiosClient.delete<{ success: boolean } | { data: { success: boolean } }>(endpoint);
      // Handle wrapped response or direct object
      return (result as any).data || result;
    } catch (error) {
      console.error(`Error deleting address ${id}:`, error);
      throw error;
    }
  },

  /**
   * Set an address as default
   * Automatically sets all other addresses to isDefault: false
   */
  setDefaultAddress: async (id: string): Promise<Address> => {
    try {
      return await addressService.updateAddress(id, { isDefault: true });
    } catch (error) {
      console.error(`Error setting default address ${id}:`, error);
      throw error;
    }
  },
};
