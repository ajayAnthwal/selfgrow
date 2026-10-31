'use client';

import React, { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiClientError } from '@/lib/api/client';
import { LoginInput, RegisterInput } from './auth.schema';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  preferredLanguage: 'EN' | 'HI';
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (data: LoginInput) => Promise<AuthUser>;
  register: (data: RegisterInput) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const {
    data: user = null,
    isLoading,
    refetch,
  } = useQuery<AuthUser | null>({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      try {
        const response = await api.get<{ user: AuthUser }>('/auth/me');
        return response.user;
      } catch (err) {
        if (err instanceof ApiClientError && err.status === 401) {
          return null;
        }
        return null;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginInput) => {
      const response = await api.post<{ user: AuthUser }>('/auth/login', data);
      return response.user;
    },
    onSuccess: (newUser) => {
      queryClient.setQueryData(['auth', 'me'], newUser);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterInput) => {
      const response = await api.post<{ user: AuthUser }>('/auth/register', data);
      return response.user;
    },
    onSuccess: (newUser) => {
      queryClient.setQueryData(['auth', 'me'], newUser);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await api.post('/auth/logout');
    },
    onSuccess: () => {
      queryClient.setQueryData(['auth', 'me'], null);
      queryClient.clear();
    },
  });

  const login = async (data: LoginInput): Promise<AuthUser> => {
    return await loginMutation.mutateAsync(data);
  };

  const register = async (data: RegisterInput): Promise<AuthUser> => {
    return await registerMutation.mutateAsync(data);
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  const refetchUser = async () => {
    await refetch();
  };

  const isAuthenticated = Boolean(user && user.isActive);
  const isAdmin = Boolean(user && user.role === 'ADMIN');

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        refetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

