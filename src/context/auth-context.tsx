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
    email?: string;
    needs_verification?: boolean;
    account_deactivated?: boolean;
  }>;
  register: (credentials: RegisterCredentials) => Promise<{
    success: boolean;
    message?: string;
    email?: string;
  }>;
  logout: () => Promise<void>;
  clearSession: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface ApiError {
  response?: {
    data?: {
      message?: string;
      email?: string;
      needs_verification?: boolean;
      account_deactivated?: boolean;
    };
  };
  message?: string;
}

function isApiError(error: unknown): error is ApiError {
  return typeof error === 'object' && error !== null;
}

function extractErrorMessage(error: unknown, fallback: string): string {
  if (isApiError(error)) {
    return error.response?.data?.message ?? error.message ?? fallback;
  }
  return fallback;
}

function extractErrorMeta(error: unknown) {
  if (isApiError(error)) {
    return {
      email: error.response?.data?.email,
      needs_verification: error.response?.data?.needs_verification,
      account_deactivated: error.response?.data?.account_deactivated,
    };
  }
  return {};
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const storedToken = localStorage.getItem('auth_token');
  const storedUser = localStorage.getItem('auth_user');

  if (storedToken && storedUser) {
    try {
      // Hydrating auth state from localStorage (a browser-only API) on mount.
      // Can't use a lazy useState initializer here because this component
      // also renders on the server, where localStorage doesn't exist —
      // so syncing via effect is intentional, not an oversight.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setToken(storedToken);
      setUser(JSON.parse(storedUser) as User);
    } catch (error) {
      console.error('Failed to parse stored user, clearing auth data', error);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
  }

  setLoading(false);
}, []);

  const login = async (credentials: LoginCredentials
  ) : Promise<{ 
    success: boolean;
   message?: string; 
   user?: User
   email?: string;
  needs_verification?: boolean;
  account_deactivated?: boolean; 
  
  }> => {
  try {
    const response = await authApi.login(credentials);

    const newToken = response.accessToken!;
    const newUser = response.user!;

    setToken(newToken);
    setUser(newUser);

    localStorage.setItem('auth_token', newToken);
    localStorage.setItem('auth_user', JSON.stringify(newUser));

     const userStr = encodeURIComponent(JSON.stringify(newUser));
    document.cookie = `auth_token=${newToken}; path=/; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}; Secure`;
    document.cookie = `auth_user=${userStr}; path=/; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}; Secure`;


    return {
      success: response.success,
      message: response.message,
      user: newUser,
    };
  } catch (error : unknown) {
    console.error(error);
      const errorMessage = extractErrorMessage(
        error,
        'Email ou mot de passe incorrect. Veuillez réessayer.'
      );
      const meta = extractErrorMeta(error);
        return {
          success: false,
          message: errorMessage,
          user: undefined,
          ...meta,
        };
  }
};



  const register = async (credentials: RegisterCredentials
) : Promise<{ success: boolean; message?: string; email?: string }> => {
   
       try {
         const response = await authApi.register(credentials);
          
         if(response.success=== true){
          return {
          success: true,
          message: response.message,
          email: response.email,
        };
         }

         return {
        success: false,
        message: response.message,
      };
        
       } catch (error) {
         console.error(error);
      const errorMessage = extractErrorMessage(
        error,
        "Une erreur est survenue lors de l'inscription. Veuillez réessayer."
      );

      return {
        success: false,
        message: errorMessage,
      };
       } 
  };

//  const logout = async () => {
//   try {
//     if (token) {
//       await authApi.logout(token);
//     }
//   } catch (error) {
//     console.error('Logout API failed:', error);
//   }

//   document.cookie =
//     'auth_token=; ' +
//     'auth_user=; ' +
//     'path=/; ' +
//     'expires=Thu, 01 Jan 1970 00:00:01 GMT; ' +
//     'SameSite=Strict; ' +
//     (window.location.protocol === 'https:' ? 'Secure;' : '');

//   localStorage.removeItem('auth_token');
//   localStorage.removeItem('auth_user');

//   setToken(null);
//   setUser(null);
// };

const deleteAllAuthCookies = () => {
  const cookies = ['auth_token', 'auth_user'];
  cookies.forEach((name) => {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict${
      window.location.protocol === 'https:' ? '; Secure' : ''
    }`;
  });
};
const clearSession = () => {
  deleteAllAuthCookies();
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
  setToken(null);
  setUser(null);
};

const logout = async () => {
  try {
    if (token) await authApi.logout(token);
  } catch (error) {
    console.error(error);
  }
  clearSession(); 
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
        clearSession
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