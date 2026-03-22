import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {type ReactNode } from "react";

type Props = {
  role: "ADMIN" | "EMPLOYEE";
  children: ReactNode;
};

export default function ProtectedRoute({ role, children }: Props) {
  const { user } = useAuth();

  if (!user || user.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
