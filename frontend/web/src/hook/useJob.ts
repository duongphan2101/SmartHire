import { useState, useEffect, useCallback } from "react";
import axios, { AxiosError } from "axios";
import { HOSTS } from "../utils/host";
import useDepartment from "./useDepartment";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export interface Job {
  updatedAt?: string;
  _id: string;
  jobTitle: string;
  jobType: string;
  jobLevel: string;
  department: {
    _id: string;
    name: string;
    avatar?: string;
  };
  createBy: {
    _id: string;
    fullname: string;
    avatar?: string;
  };
  requirement: string[];
  skills: string[];
  benefits: string[];
  salary: string;
  location: string;
  address: string;
  workingHours: string;
  jobDescription: string[];
  experience: string;
  endDate: string;
  num: number;
  createdAt: string;
  status: string;
  districts?: { name: string }[];
  accepted: number;
}

export interface Category {
  sum: number;
  data: Job[];
}

export default function useJob() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [pendingJobsAdmin, setPendingJobsAdmin] = useState<Job[]>([]);
  const [totalJobsCount, setTotalJobsCount] = useState<number>(0);    
  const [joblatest, setJobLatest] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { department } = useDepartment("user");
  const host = HOSTS.jobService;

  const fetchTotalJobsCount = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get<Job[]>(`${host}/getAll`);
      if (Array.isArray(res.data)) {
        setTotalJobsCount(res.data.length);
      }
    } catch (err) {
      console.error("Lỗi lấy tổng số bài đăng:", err);
      setTotalJobsCount(0);
    } finally {
      setLoading(false);
    }
  }, [host]);

  const fetchPendingJobsAdmin = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get<Job[]>(`${host}/pending`);
      setPendingJobsAdmin(res.data);
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message || "Không tải được bài chờ duyệt");
    } finally {
      setLoading(false);
    }
  }, [host]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.pathname.includes("/admin")) {
      fetchPendingJobsAdmin();
      fetchTotalJobsCount();   
    }
  }, [fetchPendingJobsAdmin, fetchTotalJobsCount]);

  useEffect(() => {
    if (department?._id) {
    }
  }, [department]);

  const refetch = useCallback(async () => {
    if (!department?._id) {
      setJobs([]);
      setError("Bạn chưa thuộc công ty nào");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get<Job[]>(`${host}/getAll/${department._id}`);
      setJobs(res.data);
      setError("");
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message || "Lỗi tải việc làm");
    } finally {
      setLoading(false);
    }
  }, [host, department]);

  const createJob = useCallback(async (payload: Omit<Job, "_id" | "createdAt">) => {
    if (!department) {
      await MySwal.fire({ title: "Chưa có công ty", text: "Vui lòng tạo hoặc tham gia công ty trước.", icon: "warning" });
      throw new Error("No department");
    }
    try {
      setLoading(true);
      const res = await axios.post<Job>(`${host}/create`, payload);
      setJobs(prev => [...prev, res.data]);
      fetchTotalJobsCount();
      await MySwal.fire({ title: "Đã gửi!", text: "Bài đăng đang chờ duyệt.", icon: "info" });
      return res.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || "Không thể đăng bài";
      await MySwal.fire({ title: "Lỗi", text: msg, icon: "error" });
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [host, department, fetchTotalJobsCount]);

  const approveJob = useCallback(async (id: string) => {
    try {
      const res = await axios.put(`${host}/approve/${id}`);
      setPendingJobsAdmin(prev => prev.filter(j => j._id !== id));
      fetchTotalJobsCount(); 
      return res.data;
    } catch {
      setError("Duyệt thất bại");
      return null;
    }
  }, [host, fetchTotalJobsCount]);

  const rejectJob = useCallback(async (id: string) => {
    try {
      const res = await axios.put(`${host}/reject/${id}`);
      setPendingJobsAdmin(prev => prev.filter(j => j._id !== id));
      fetchTotalJobsCount();
      return res.data;
    } catch {
      setError("Từ chối thất bại");
      return null;
    }
  }, [host, fetchTotalJobsCount]);

  const deleteJob = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await axios.delete(`${host}/${id}`);
      setJobs(prev => prev.filter(j => j._id !== id));
      setPendingJobsAdmin(prev => prev.filter(j => j._id !== id));
      fetchTotalJobsCount(); 
    } catch (err: any) {
      setError(err.response?.data?.message || "Xóa thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [host, fetchTotalJobsCount]);

  // Các hàm khác giữ nguyên (không cần thay đổi)
  const getPendingCount = useCallback(() => pendingJobsAdmin.length, [pendingJobsAdmin]);

  const fetchAllJob = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get<Job[]>(`${host}/getAll`);
      setJobs(res.data);
      return res.data;
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message || "Lỗi tải danh sách việc làm");
    } finally {
      setLoading(false);
    }
  }, [host]);

  const latest = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get<Job[]>(`${host}/getLatest`);
      setJobLatest(res.data);
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message || "Lỗi tải việc làm mới nhất");
    } finally {
      setLoading(false);
    }
  }, [host]);

  const getJobByDepartmentId = useCallback(async (id: string) => {
    if (!id) return [];
    try {
      const res = await axios.get<Job[]>(`${host}/getAll/${id}`);
      return res.data;
    } catch {
      setError("Lỗi tải việc làm theo công ty");
      return [];
    }
  }, [host]);

  const getJobByDepId = useCallback(async (id: string) => {
    try {
      const res = await axios.get<Job[]>(`${host}/jobByDepId/${id}`);
      return res.data;
    } catch {
      setError("Lỗi tải việc làm");
      return [];
    }
  }, [host]);

  const filterJobs = useCallback(async (params: any) => {
    try {
      setLoading(true);
      const res = await axios.get<Job[]>(`${host}/filter/search`, { params });
      return res.data;
    } catch {
      setError("Lọc thất bại");
      return [];
    } finally {
      setLoading(false);
    }
  }, [host]);

  const getJobById = useCallback(async (id: string) => {
    try {
      const res = await axios.get<Job>(`${host}/${id}`);
      return res.data;
    } catch {
      return null;
    }
  }, [host]);

  const categories_sum = useCallback(async (title?: string) => {
    try {
      setLoading(true);
      const res = await axios.get<Category>(`${host}/categories`, { params: { title } });
      return res.data;
    } catch {
      return { sum: 0, data: [] };
    } finally {
      setLoading(false);
    }
  }, [host]);

  const banJob = async (id: string) => {
    try {
      const res = await axios.put(`${host}/${id}`, { status: "banned" });
      fetchTotalJobsCount();
      return res.data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  return {
    jobs,
    pendingJobsAdmin,
    joblatest,
    totalJobsCount,          
    loading,
    error,
    refetch,
    createJob,
    deleteJob,
    filterJobs,
    getJobById,
    categories_sum,
    getJobByDepartmentId,
    getJobByDepId,
    approveJob,
    rejectJob,
    fetchPendingJobsAdmin,
    fetchTotalJobsCount,    
    fetchAllJob,
    getPendingCount,
    banJob,
  };
}