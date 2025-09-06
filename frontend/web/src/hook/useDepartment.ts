// File: src/hooks/useDepartment.ts

import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { HOSTS } from "../utils/host";

// Định nghĩa kiểu dữ liệu cho Department
interface DepartmentData {
  _id: string;
  name: string;
  address: string;
  avatar: string;
  description: string;
  website: string;
}

interface UseDepartmentReturn {
  departments: DepartmentData[];
  loading: boolean;
  error: string | null;
}

export default function useDepartment(): UseDepartmentReturn {
  const [departments, setDepartments] = useState<DepartmentData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Sử dụng URL từ HOSTS.companyService để lấy dữ liệu departments
        const host = HOSTS.companyService; 
        const response = await axios.get<DepartmentData[]>(`${host}/getAll`);
        
        setDepartments(response.data);
      } catch (err) {
        const axiosErr = err as AxiosError<{ message?: string }>;
        setError(axiosErr.message || "Failed to fetch departments");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  return { departments, loading, error };
}