import { useState, useEffect, useCallback } from "react";
import axios, { AxiosError } from "axios";
import { HOSTS } from "../utils/host";

export type DepartmentStatus = 'Active' | 'Suspended' | 'Archived';

export interface DepartmentData {
  _id: string;
  name: string;
  address: string;
  avatar: string;
  description: string;
  website: string;
  status: DepartmentStatus;
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
  createDepartment: (data: Omit<DepartmentData, "_id" | "status"> & { employees: string[] }) => Promise<void>;
  deleteDepartment: (id: string) => Promise<void>;
  updateDepartmentStatus: (id: string, newStatus: DepartmentStatus) => Promise<void>;
  getDepartmentById: (id: string) => Promise<void>;
}

export default function useDepartment(mode: "user" | "all" = "user"): UseDepartmentReturn {
  const [department, setDepartment] = useState<DepartmentData | null>(null);
  const [departments, setDepartments] = useState<DepartmentData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const host = HOSTS.companyService;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

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
        const res = await axios.get<DepartmentData>(`${host}/user/${userId}`);
        setDepartment(res.data);
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
  }, [mode, host]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  const createDepartment = useCallback(async (data: Omit<DepartmentData, "_id" | "status"> & { employees: string[] }) => {
    try {
      setLoading(true);
      await axios.post(`${host}/create`, data);
      await fetchData();
    } catch (err) {
      setError((err as AxiosError).message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [host, fetchData]);

  const deleteDepartment = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await axios.delete(`${host}/delete/${id}`);
      await fetchData();
    } catch (err) {
      setError((err as AxiosError).message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [host, fetchData]);

  const updateDepartmentStatus = useCallback(async (id: string, newStatus: DepartmentStatus) => {
    try {
      setLoading(true);
      await axios.put(`${host}/status/${id}`, { status: newStatus });
      await fetchData();
    } catch (err) {
      setError((err as AxiosError).message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [host, fetchData]);

  const getDepartmentById = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get<DepartmentData>(`${host}/${id}`);
      setDepartment(res.data || null);
      //console.log("Fetched department by ID:", res.data);

    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.message || "Failed to fetch department by ID");
      setDepartment(null);
    } finally {
      setLoading(false);
    }
  }, [host]);

  return {
    department,
    departments,
    loading,
    error,
    refetch: fetchData,
    createDepartment,
    deleteDepartment,
    updateDepartmentStatus,
    getDepartmentById,
  };
}