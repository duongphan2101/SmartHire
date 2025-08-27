import { useState, useCallback } from "react";
import axios, { AxiosError } from "axios";
import { HOSTS } from "../utils/host";

export interface UserResponse {
  fullname: string;
  email: string;
  user_id: string;
  avatar: string;
  role: string;
  dob?: string;
  phone?: string;
}

export default function useUser() {
  const [loadingUser, setLoading] = useState(false);
  const [errorUser, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserResponse | null>(null);

  const getUser = useCallback(async (user_id: string): Promise<UserResponse | void> => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get<UserResponse>(`${HOSTS.userService}/${user_id}`);
      setUser(res.data);

      return res.data;
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message || "getUserById failed");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (user_id: string, data: Partial<UserResponse>): Promise<UserResponse | void> => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.put<UserResponse>(`${HOSTS.userService}/${user_id}`, data);
      setUser(res.data);

      return res.data;
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message || "updateUser failed");
    } finally { setLoading(false); }
  }, []);

  const updateUserAvatar = useCallback(async (user_id: string, imageUrl: string): Promise<UserResponse | void> => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.put<UserResponse>(
        `${HOSTS.userService}/avt/${user_id}`,
        { avatar: imageUrl }
      );

      setUser(res.data);
      return res.data;
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message || "updateUserAvatar failed");
    } finally {
      setLoading(false);
    }
  },
    []
  );

  return { getUser, user, updateUser, updateUserAvatar, loadingUser, errorUser };
}
