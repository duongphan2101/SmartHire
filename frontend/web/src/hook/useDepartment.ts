import { useState, useEffect, useCallback } from "react";
import axios, { AxiosError } from "axios";
import { HOSTS } from "../utils/host";

export interface DepartmentData {
  _id: string;
  name: string;
  address: string;
  avatar: string;
  description: string;
  website: string;
}

interface UseDepartmentReturn {
  // data
  department: DepartmentData | null; 
  departments: DepartmentData[]; 

  // state
  loading: boolean;
  error: string | null;

  // actions
  refetch: () => void;
  createDepartment: (data: Omit<DepartmentData, "_id"> & { employees: string[] }) => Promise<void>;
  deleteDepartment: (id: string) => Promise<void>;
}

export default function useDepartment(mode: "user" | "all" = "user"): UseDepartmentReturn {
  const [department, setDepartment] = useState<DepartmentData | null>(null);
  const [departments, setDepartments] = useState<DepartmentData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const host = HOSTS.companyService;

      if (mode === "user") {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          setDepartment(null);
          setLoading(false);
          return;
        }

        const parsed = JSON.parse(storedUser);
        const userId: string = parsed.user_id || parsed._id || "";
        if (!userId) {
          setDepartment(null);
          setLoading(false);
          return;
        }

        const res = await axios.get<DepartmentData[] | DepartmentData>(`${host}/user/${userId}`);
        if (Array.isArray(res.data)) {
          setDepartment(res.data[0] || null);
        } else {
          setDepartment(res.data);
        }
      }

      if (mode === "all") {
        const res = await axios.get<DepartmentData[]>(`${host}/getAll`);
        setDepartments(res.data || []);
      }
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.message || "Failed to fetch department");
    } finally {
      setLoading(false);
    }
  }, [mode]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

 
  const createDepartment = async (data: Omit<DepartmentData, "_id"> & { employees: string[] }) => {
    try {
      await axios.post(`${HOSTS.companyService}/create`, data);
      await fetchData();
    } catch (err) {
      throw err;
    }
  };


  const deleteDepartment = async (id: string) => {
    try {
      await axios.delete(`${HOSTS.companyService}/delete/${id}`);
      await fetchData();
    } catch (err) {
      throw err;
    }
  };

  return { department, departments, loading, error, refetch: fetchData, createDepartment, deleteDepartment };
}
