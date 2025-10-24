import { useState, useEffect, useCallback } from "react";
import axios, { AxiosError } from "axios";
import { HOSTS } from "../utils/host";

// --- 1. CẬP NHẬT INTERFACE DepartmentData ---
export type DepartmentStatus = 'Active' | 'Suspended' | 'Archived';

export interface DepartmentData {
  _id: string;
  name: string;
  address: string;
  avatar: string;
  description: string;
  website: string;
  // BỔ SUNG: Trạng thái hệ thống
  status: DepartmentStatus; 
}

// --- 2. CẬP NHẬT INTERFACE UseDepartmentReturn ---
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
  // BỔ SUNG: Hàm cập nhật trạng thái
  updateDepartmentStatus: (id: string, newStatus: DepartmentStatus) => Promise<void>;
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

        // API findDepartmentByUserId trả về một DepartmentData
        const res = await axios.get<DepartmentData>(`${host}/user/${userId}`); 
        setDepartment(res.data);
      }

      if (mode === "all") {
        // API getDepartments trả về một mảng DepartmentData
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


  const createDepartment = async (data: Omit<DepartmentData, "_id" | "status"> & { employees: string[] }) => {
    try {
        // Mặc định status là Active được xử lý ở Back-end model
      await axios.post(`${host}/create`, data);
      await fetchData();
    } catch (err) {
      throw err;
    }
  };


  const deleteDepartment = async (id: string) => {
    try {
      await axios.delete(`${host}/delete/${id}`);
      await fetchData();
    } catch (err) {
      throw err;
    }
  };
  
  // --- 3. BỔ SUNG HÀM updateDepartmentStatus ---
  const updateDepartmentStatus = async (id: string, newStatus: DepartmentStatus) => {
      try {
          // PUT /api/departments/status/:id
          const res = await axios.put<DepartmentData>(`${host}/status/${id}`, { status: newStatus });
          
          // Cập nhật state cục bộ sau khi thành công
          setDepartments(prev => 
              prev.map(dept => dept._id === id ? res.data : dept)
          );
          
          // Nếu đang xem mode="user" và department đó bị cập nhật
          if (department && department._id === id) {
              setDepartment(res.data);
          }
      } catch (err) {
          throw err;
      }
  };


  return { 
    department, 
    departments, 
    loading, 
    error, 
    refetch: fetchData, 
    createDepartment, 
    deleteDepartment,
    updateDepartmentStatus // THÊM HÀM MỚI VÀO RETURN
  };
}