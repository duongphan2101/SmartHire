import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { HOSTS } from "../utils/host";

interface DepartmentData {
  _id: string;
  name: string;
  address: string;
  avatar: string;
  description: string;
  website: string;
}

interface UseDepartmentReturn {
  department: DepartmentData | null;
  loading: boolean;
  error: string | null;
}

export default function useDepartment(): UseDepartmentReturn {
  const [department, setDepartment] = useState<DepartmentData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setLoading(false);
      return;
    }

    try {
      const parsed = JSON.parse(storedUser);
      const userId: string = parsed.user_id || parsed._id || "";

      if (!userId) {
        setLoading(false);
        return;
      }

      const fetchDepartment = async () => {
        try {
          setLoading(true);
          setError(null);

          const host = HOSTS.companyService;
          const res = await axios.get<DepartmentData[] | DepartmentData>(
            `${host}/user/${userId}`
          );

          if (Array.isArray(res.data)) {
            setDepartment(res.data[0] || null);
          } else {
            setDepartment(res.data);
          }
        } catch (err) {
          const axiosErr = err as AxiosError<{ message?: string }>;
          setError(axiosErr.message || "Failed to fetch department");
        } finally {
          setLoading(false);
        }
      };

      fetchDepartment();
    } catch (err) {
      console.error("Error parsing user:", err);
      setLoading(false);
    }
  }, []);

  return { department, loading, error };
}
