import { createContext, useContext, useState, type ReactNode } from "react";

type User = {
  role: "ADMIN" | "EMPLOYEE";
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialize from localStorage so page refreshes retain login state
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  const [user, setUser] = useState<User | null>(() => {
    const savedRole = localStorage.getItem("role") as "ADMIN" | "EMPLOYEE" | null;
    const savedToken = localStorage.getItem("token");
    if (savedToken && (savedRole === "ADMIN" || savedRole === "EMPLOYEE")) {
      return { role: savedRole };
    }
    return null;
  });

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("token", newToken);
    localStorage.setItem("role", newUser.role);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
