/* eslint-disable react-refresh/only-export-components */
import React, { useState, createContext, useEffect, ReactNode } from "react";
import { jwtDecode, JwtDecodeOptions } from "jwt-decode";

interface User {
  id: string;
  nombre: string;
  apellido: string;
  rol: string;
  requierecambiocontrasena: boolean;
}

interface AuthState {
  authToken: string | null;
  user: User | null;
  isLoading: boolean | null;
}

const initialAuthState: AuthState = {
  authToken: null,
  user: {
    id: "",
    nombre: "",
    apellido: "",
    rol: "",
    requierecambiocontrasena: false,
  },
  isLoading: null,
};

interface decodedToken extends JwtDecodeOptions {
  id: string;
  nombre: string;
  apellido: string;
  rol: string;
  requierecambiocontrasena: boolean;
}

interface AuthContextProps {
  authState: AuthState;
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;
  setAuthToken: (token: string) => void;
  clearAuthToken: () => void;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

function decodeToken(token: string): User {
  const decoded = jwtDecode<decodedToken>(token);
  return {
    id: decoded.id,
    nombre: decoded.nombre,
    apellido: decoded.apellido,
    rol: decoded.rol,
    requierecambiocontrasena: decoded.requierecambiocontrasena,
  };
}

// Creación del contexto de autenticación
export const AuthContext = createContext<AuthContextProps | null>(null); // El valor inicial es null

// Hook personalizado para usar el contexto de autenticación
export const useAuth = (): AuthContextProps => {
  // Recupera el contexto
  const context = React.useContext(AuthContext);

  // Si el contexto es null, arroja un error (útil para detectar si el hook está siendo usado fuera de un proveedor)
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }

  return context; // Si todo está bien, devuelve el contexto
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    authToken: localStorage.getItem("token"),
    user: {
      id: "",
      nombre: "",
      apellido: "",
      rol: "",
      requierecambiocontrasena: false,
    },
    isLoading: true,
  });

  useEffect(() => {
    const initializeAuthState = () => {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = decodeToken(token);
        setAuthState({
          authToken: token,
          user: decoded,
          isLoading: false,
        });
      } else {
        setAuthState(initialAuthState);
      }
    };

    initializeAuthState();
  }, []);

  const setAuthToken = (token: string) => {
    localStorage.setItem("token", token);
    const decodedToken = jwtDecode(token);
    setAuthState({ authToken: token, user: JSON.parse(decodedToken.toString()), isLoading: false });
  };

  const clearAuthToken = () => {
    localStorage.removeItem("token");
    setAuthState( initialAuthState );
  };

  const login = (token: string, userData: User) => {
    localStorage.setItem("token", token);
    setAuthState({ authToken: token, user: userData, isLoading: false });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthState( initialAuthState );
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        setAuthState,
        setAuthToken,
        clearAuthToken,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
