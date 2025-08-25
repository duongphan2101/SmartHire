import { useState, useCallback } from "react";
import axios, { AxiosError } from "axios";
import { HOSTS } from "../utils/host";

export interface UserResponse {
  fullname: string;
  email: string;
  user_id: string;
  avatar: string;
  role: string;
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

  return { getUser, user, loadingUser, errorUser };
}
