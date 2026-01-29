'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '@/api/auth';
import { User } from '@/types/user';
import { LoginCredentials, RegisterCredentials } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<{
    success: boolean;
    message?: string;
    user?: User;
  }>;
  register: (credentials: RegisterCredentials) => Promise<{
    success: boolean;
    message?: string;
    email?: string;
  }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
   
     try {
    
    const response = await authApi.login(credentials);
    setToken(response.accessToken!);
    setUser(response.user!);
    localStorage.setItem('auth_token', response.accessToken!);
    // Also save to cookie (accessible to middleware)
    document.cookie = `auth_token=${response.accessToken}; path=/; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}; Secure`;
    localStorage.setItem('auth_user', JSON.stringify(response.user));
   
    return {
      success: response.success,
      message: response.message,  
      user: response.user,
    };
        
     } catch (error) {
        console.log(error)
        const errorMessage =
              error.response?.data?.message ||          
              error.message ||
              'Email ou mot de passe incorrect. Veuillez réessayer.';

            return {
              success: false,
              message: errorMessage,
              user: null,
            };
     }
  };

  const register = async (credentials: RegisterCredentials) => {
   
       try {
         const response = await authApi.register(credentials);
          
         if(response.success=== true){
          return{
            message:response.message,
            success:response.success,
            email:response.email
          }
         }
        
       } catch (error) {
        console.log(error)
       } 
  };

 const logout = async () => {
  try {
    if (token) {
      await authApi.logout(token);
    }
  } catch (error) {
    console.error('Logout API failed:', error);
  }

  document.cookie =
    'auth_token=; ' +
    'path=/; ' +
    'expires=Thu, 01 Jan 1970 00:00:01 GMT; ' +
    'SameSite=Strict; ' +
    (window.location.protocol === 'https:' ? 'Secure;' : '');

  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');

  setToken(null);
  setUser(null);
};

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user && !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}