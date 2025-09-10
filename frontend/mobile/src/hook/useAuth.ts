import { useState } from "react";
import axios, { AxiosError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HOSTS } from "../utils/host";

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user?: any;
  [key: string]: any;
}

export default function useAuth() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const saveAuthData = async (data: AuthResponse) => {
    await AsyncStorage.setItem("accessToken", data.accessToken);
    await AsyncStorage.setItem("refreshToken", data.refreshToken);
    if (data.user) {
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
    }
  };

  const login = async (email: string, password: string): Promise<AuthResponse | void> => {
    try {
      const host = HOSTS.authService;
      setLoading(true);
      setError(null);

      const res = await axios.post<AuthResponse>(`${host}/login`, { email, password });
      await saveAuthData(res.data);

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

      await saveAuthData(res.data);
      return res.data;
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    await AsyncStorage.multiRemove(["accessToken", "refreshToken", "user"]);
  };

  return { login, register, logout, loading, error };
}
