import { useEffect, useState } from 'react';
import type { Address, CreateAddressDto, UpdateAddressDto } from '../types';
import { addressService } from '../services';
import { useIsLoggedIn } from './useAuth';

interface UseAddressesReturn {
  addresses: Address[];
  loading: boolean;
  error: string | null;
  selectedAddressId: string | null;
  defaultAddress: Address | null;
  
  // CRUD Operations
  fetchAddresses: () => Promise<void>;
  getAddressById: (id: string) => Promise<Address | null>;
  createAddress: (data: CreateAddressDto) => Promise<Address | null>;
  updateAddress: (id: string, data: UpdateAddressDto) => Promise<Address | null>;
  deleteAddress: (id: string) => Promise<boolean>;
  setDefaultAddress: (id: string) => Promise<void>;
  
  // Selection
  selectAddress: (id: string) => void;
  clearSelection: () => void;
}

/**
 * Hook for managing user addresses
 * Handles fetching, creating, updating, deleting addresses
 * Automatically fetches addresses on mount if user is logged in
 */
export const useAddresses = (): UseAddressesReturn => {
  const { isLoggedIn } = useIsLoggedIn();
  
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  // Get default address from addresses list - safe check with optional chaining
  const defaultAddress = addresses && addresses.length > 0 
    ? addresses.find((addr) => addr.isDefault) || null 
    : null;

  /**
   * Fetch all addresses for current user
   */
  const fetchAddresses = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await addressService.getAddresses();
      
      // Validate that data is an array
      if (!Array.isArray(data)) {
        console.error('Expected array from getAddresses, got:', typeof data, data);
        throw new Error('Invalid response format - expected array of addresses');
      }
      
      setAddresses(data);
      
      // Auto-select default address if not already selected
      if (!selectedAddressId && data.length > 0) {
        const defaultAddr = data.find((addr) => addr.isDefault);
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch addresses';
      
      // Don't set error if it's a 401 - user just needs to log in
      if (!errorMessage.includes('401') && !errorMessage.includes('Unauthorized')) {
        setError(errorMessage);
        console.error('useAddresses - fetchAddresses error:', { message: errorMessage, err });
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get a specific address by ID
   */
  const getAddressById = async (id: string): Promise<Address | null> => {
    setError(null);
    try {
      const address = await addressService.getAddressById(id);
      return address;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch address';
      setError(errorMessage);
      console.error('useAddresses - getAddressById error:', err);
      return null;
    }
  };

  /**
   * Create a new address
   */
  const createAddress = async (data: CreateAddressDto): Promise<Address | null> => {
    setError(null);
    try {
      const newAddress = await addressService.createAddress(data);
      
      if (!newAddress || typeof newAddress !== 'object') {
        console.error('Invalid response from createAddress:', newAddress);
        throw new Error('Failed to create address - invalid response');
      }
      
      setAddresses((prev) => [...(Array.isArray(prev) ? prev : []), newAddress]);
      
      // Auto-select if it's the default or first address
      if (data.isDefault || (Array.isArray(addresses) && addresses.length === 0)) {
        setSelectedAddressId(newAddress.id);
      }
      
      return newAddress;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create address';
      setError(errorMessage);
      console.error('useAddresses - createAddress error:', { message: errorMessage, err });
      return null;
    }
  };

  /**
   * Update an existing address
   */
  const updateAddress = async (id: string, data: UpdateAddressDto): Promise<Address | null> => {
    setError(null);
    try {
      const updatedAddress = await addressService.updateAddress(id, data);
      
      if (!updatedAddress) {
        throw new Error('Invalid response');
      }
      
      // Update in state
      setAddresses((prev) => {
        if (!Array.isArray(prev)) return prev;
        return prev.map((addr) => (addr.id === id ? updatedAddress : addr));
      });
      
      return updatedAddress;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update address';
      setError(errorMessage);
      console.error('useAddresses - updateAddress error:', err);
      return null;
    }
  };

  /**
   * Delete an address
   */
  const deleteAddress = async (id: string): Promise<boolean> => {
    setError(null);
    try {
      await addressService.deleteAddress(id);
      
      setAddresses((prev) => {
        if (!Array.isArray(prev)) return prev;
        return prev.filter((addr) => addr.id !== id);
      });
      
      // Clear selection if deleted address was selected
      if (selectedAddressId === id) {
        setSelectedAddressId(null);
      }
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete address';
      setError(errorMessage);
      console.error('useAddresses - deleteAddress error:', err);
      return false;
    }
  };

  /**
   * Set an address as default
   */
  const setDefaultAddress = async (id: string): Promise<void> => {
    setError(null);
    try {
      await addressService.setDefaultAddress(id);
      
      // Update all addresses - only one can be default
      setAddresses((prev) => {
        if (!Array.isArray(prev)) return prev;
        return prev.map((addr) => ({
          ...addr,
          isDefault: addr.id === id,
        }));
      });
      
      // Auto-select as well since it's now default
      setSelectedAddressId(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to set default address';
      setError(errorMessage);
      console.error('useAddresses - setDefaultAddress error:', err);
    }
  };

  /**
   * Select an address for checkout
   */
  const selectAddress = (id: string): void => {
    const addressExists = Array.isArray(addresses) && addresses.some((addr) => addr.id === id);
    if (addressExists) {
      setSelectedAddressId(id);
      setError(null);
    } else {
      setError('Address not found');
    }
  };

  /**
   * Clear address selection
   */
  const clearSelection = (): void => {
    setSelectedAddressId(null);
  };

  /**
   * Fetch addresses on component mount (only if logged in)
   * Re-fetch when isLoggedIn status changes
   */
  useEffect(() => {
    if (isLoggedIn) {
      fetchAddresses();
    } else {
      // Reset state when user logs out
      setAddresses([]);
      setSelectedAddressId(null);
      setError(null);
    }
  }, [isLoggedIn]);

  return {
    addresses,
    loading,
    error,
    selectedAddressId,
    defaultAddress,
    fetchAddresses,
    getAddressById,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    selectAddress,
    clearSelection,
  };
};
