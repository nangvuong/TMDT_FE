export type UserRole = 'admin' | 'customer' | 'seller';
export type FitnessGoal = 'weight_loss' | 'muscle_gain' | 'strength' | 'endurance' | 'general_fitness';

export interface User {
  id: string; // UUID
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export interface PhysicalProfile {
  id: string; // UUID
  heightCm: number;
  weightKg: number;
  age: number;
  fitnessGoal: FitnessGoal;
  dietaryPreferences?: string;
  allergies?: string;
  userId: string; // FK to Users
  createdAt: string;
  updatedAt: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  accessToken: string;
}

