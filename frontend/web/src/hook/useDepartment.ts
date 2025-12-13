import { useState, useEffect, useCallback } from "react";
import axios, { AxiosError } from "axios";
import { HOSTS } from "../utils/host";
// import type { InviteData } from "../utils/interfaces";

export type DepartmentStatus = "Pending" | "Active" | "Suspended";

export interface DepartmentData {
    _id: string;
    name: string;
    address: string;
    avatar: string;
    description: string;
    website: string;
    status: DepartmentStatus;
    employees: string[];
    averageRating?: number;
    totalReviews?: number;
    createdAt?: string; // Thêm createdAt cho việc hiển thị ngày
}

interface UseDepartmentReturn {
    // data
    department: DepartmentData | null;
    departments: DepartmentData[];
    invite: InviteResponse | null;
    joinResponse: { success: boolean; message: string } | null;

    // state
    loading: boolean;
    error: string | null;

    // actions
    refetch: () => void;
    createDepartment: (data: Omit<DepartmentData, "_id" | "status"> & { employees: string[] }) => Promise<void>;
    deleteDepartment: (id: string) => Promise<void>;
    updateDepartmentStatus: (id: string, newStatus: DepartmentStatus) => Promise<void>;
    getDepartmentById: (id: string) => Promise<void>;
    createInvite: (departmentId: string, createdBy: string) => Promise<InviteResponse>;
    joinDepartment: (code: string, userId: string) => Promise<void>;
    getDepartmentByUserId: (id: string) => Promise<DepartmentData | undefined>;

    // NEW ADMIN ACTION
    fetchPendingDepartmentsAdmin: () => Promise<DepartmentData[]>;
}

type InviteResponse = {
    code: string;
    expiresAt: string;
    message: string;
};

export default function useDepartment(mode: "user" | "all" = "user"): UseDepartmentReturn {
    const [department, setDepartment] = useState<DepartmentData | null>(null);
    const [departments, setDepartments] = useState<DepartmentData[]>([]);
    const [invite, setInvite] = useState<InviteResponse | null>(null);
    const [joinResponse, setJoinResponse] = useState<{ success: boolean; message: string } | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const host = HOSTS.companyService;

    const fetchPendingDepartmentsAdmin = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await axios.get<DepartmentData[]>(`${host}/getAll`);
            const pendingList = res.data.filter(dep => dep.status === 'Pending');
            setDepartments(pendingList || []);
            return pendingList;
        } catch (err) {
            const axiosErr = err as AxiosError<{ message?: string }>;
            setError(axiosErr.message || "Failed to fetch pending departments");
            setDepartments([]);
            return [];
        } finally {
            setLoading(false);
        }
    }, [host]);

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
            const res = await axios.get<DepartmentData>(`${host}/${id}`);
            setDepartment(res.data || null);
        } catch (err) {
            const axiosErr = err as AxiosError<{ message?: string }>;
            setError(axiosErr.message || "Failed to fetch department by ID");
            setDepartment(null);
        } finally {
            setLoading(false);
        }
    }, [host]);

    const createInvite = useCallback(async (departmentId: string, createdBy: string) => {
        try {
            setLoading(true);
            const res = await axios.post<InviteResponse>(`${host}/create-invite`, { departmentId, createdBy });
            if (!res.data?.code) {
                throw new Error("Response không hợp lệ");
            }
            setInvite(res.data);
            return res.data;
        } catch (err) {
            const axiosErr = err as AxiosError<{ message?: string }>;
            setError(axiosErr.response?.data?.message || axiosErr.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [host]);

    const joinDepartment = useCallback(async (code: string, userId: string) => {
        try {
            setLoading(true);
            const res = await axios.post(`${host}/join-department`, { code, userId });
            setJoinResponse(res.data);
            await fetchData();
        } catch (err) {
            const axiosErr = err as AxiosError<{ message?: string }>;
            setError(axiosErr.response?.data?.message || axiosErr.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [host, fetchData]);

    const getDepartmentByUserId = useCallback(async (id: string) => {
        try {
            setLoading(true);
            const res = await axios.get<DepartmentData>(`${host}/user/${id}`);
            return res.data;
        } catch (err) {
            const axiosErr = err as AxiosError<{ message?: string }>;
            setError(axiosErr.message || "Failed to fetch department by ID");
        } finally {
            setLoading(false);
        }
    }, [host]);

    return {
        department,
        departments,
        invite,
        joinResponse,
        loading,
        error,
        refetch: fetchData,
        createDepartment,
        deleteDepartment,
        updateDepartmentStatus,
        getDepartmentById,
        createInvite,
        joinDepartment,
        getDepartmentByUserId,
        fetchPendingDepartmentsAdmin // ADDED
    };
}