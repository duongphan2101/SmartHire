import { useState } from "react";
import axios, { AxiosError } from "axios";
import { HOSTS } from "../utils/host";

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  [key: string]: any;
}

export default function useAuth() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string): Promise<AuthResponse | void> => {
    try {
      const host = HOSTS.authService;
      setLoading(true);
      setError(null);

      const res = await axios.post<AuthResponse>(`${host}/login`, { email, password });

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      return res.data;
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    fullname: string,
    email: string,
    password: string
  ): Promise<AuthResponse | void> => {
    try {
      const host = HOSTS.authService;
      setLoading(true);
      setError(null);

      const res = await axios.post<AuthResponse>(`${host}/register`, {
        fullname,
        email,
        password,
      });

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);

      return res.data;
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  return { login, register, logout, loading, error };
}
