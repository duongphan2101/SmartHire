import { useState, useEffect, useCallback } from "react";
import axios, { AxiosError } from "axios";
import { HOSTS } from "../utils/host";
import useDepartment from "./useDepartment";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export interface Job {
  updatedAt: string | undefined;
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
  const [joblatest, setJobLatest] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { department } = useDepartment("user");

  const host = HOSTS.jobService;

  const fetchPendingJobsAdmin = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get<Job[]>(`${host}/pending`);
      setJobs(res.data);
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message || "Failed to fetch pending jobs");
    } finally {
      setLoading(false);
    }
  }, [host]);

  const fetchAllJob = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get<Job[]>(`${host}/getAll`);
      setJobs(res.data);
      return res.data;
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message || "Failed to fetch pending jobs");
    } finally {
      setLoading(false);
    }
  }, [host]);

  const refetch = useCallback(async () => {
    if (!department || !department._id){
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
      setError(axiosErr.response?.data?.message || "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  }, [host, department]);

  const latest = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get<Job[]>(`${host}/getLatest`);
      setJobLatest(res.data);
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(
        axiosErr.response?.data?.message || "Failed to fetch jobs latest"
      );
    } finally {
      setLoading(false);
    }
  }, [host]);

  useEffect(() => {
    if (department && department._id) {
      refetch();
    }
  }, [department, refetch]);

  const getJobByDepartmentId = useCallback(async (id: string) => {
    if (!id) {
        console.warn("getJobByDepartmentId called with undefined ID.");
        return [];
    }
    try {
      const res = await axios.get<Job[]>(`${host}/getAll/${id}`);
      return res.data;
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message || "Failed to fetch job by id");
      return [];
    }
  }, [host]);

  const getJobByDepId = useCallback(async (id: string) => {
    try {
      const res = await axios.get<Job[]>(`${host}/jobByDepId/${id}`);
      return res.data;
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message || "Failed to fetch job by id");
      return [];
    }
  }, [host]);

  // createJob với Swal xử lý lỗi và thông báo thành công
  const createJob = useCallback(
    async (payload: Omit<Job, "_id" | "createdAt">) => {
      if (!department) {
        await MySwal.fire({
          title: "Chưa có công ty",
          text: "Bạn chưa thuộc công ty nào. Vui lòng tạo hoặc tham gia công ty trước khi tiếp tục.",
          icon: "warning",
          confirmButtonText: "OK",
        });
        throw new Error("Bạn chưa thuộc công ty nào");
      }

      try {
        setLoading(true);
        const res = await axios.post<Job>(`${host}/create`, payload);
        setJobs((prev) => [...prev, res.data]);

        await MySwal.fire({
          title: "Bài đăng đã gửi",
          text: "Bài đăng của bạn đã được gửi và đang chờ admin duyệt.",
          icon: "info",
          confirmButtonText: "OK",
        });

        return res.data;
      } catch (err) {
        const axiosErr = err as AxiosError<{ message?: string }>;
        const errorMessage =
          axiosErr.response?.data?.message || "Lỗi không xác định khi tạo Job.";

        await MySwal.fire({
          title: "Không thể đăng bài",
          text: errorMessage,
          icon: "error",
          confirmButtonText: "OK",
        });

        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [host, department]
  );

  const deleteJob = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await axios.delete(`${host}/${id}`);
      setJobs((prev) => prev.filter((j) => j._id !== id));
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message || "Failed to delete job");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [host]);

  const filterJobs = useCallback(
    async (
      title?: string,
      location?: string,
      district?: string,
      jobType?: string,
      jobLevel?: string,
      experience?: string
    ) => {
      try {
        setLoading(true);
        const res = await axios.get<Job[]>(`${host}/filter/search`, {
          params: { title, location, district, jobType, jobLevel, experience },
        });
        return res.data;
      } catch (err) {
        const axiosErr = err as AxiosError<{ message?: string }>;
        setError(axiosErr.response?.data?.message || "Failed to filter jobs");
        return [];
      } finally {
        setLoading(false);
      }
    },
    [host]
  );

  const getJobById = useCallback(
    async (id: string) => {
      try {
        const res = await axios.get<Job>(`${host}/${id}`);
        return res.data;
      } catch (err) {
        const axiosErr = err as AxiosError<{ message?: string }>;
        setError(axiosErr.response?.data?.message || "Failed to fetch job by id");
        return null;
      }
    },
    [host]
  );

  const categories_sum = useCallback(async (
    title?: string,
  ) => {
    try {
      setLoading(true);
      const res = await axios.get<Category>(`${host}/categories`, {
        params: { title },
      });
      return res.data;
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message || "Failed to filter jobs");
      return { sum: 0, data: [] };
    } finally {
      setLoading(false);
    }
  }, [host]);

  const approveJob = useCallback(async (id: string) => {
    try {
      const res = await axios.put(`${host}/approve/${id}`);
      return res.data;
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message || "Duyệt bài thất bại");
      return null;
    }
  }, [host]);

  const rejectJob = useCallback(async (id: string) => {
    try {
      const res = await axios.put(`${host}/reject/${id}`);
      return res.data;
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message || "Từ chối bài thất bại");
      return null;
    }
  }, [host]);

  useEffect(() => {
    refetch();
    latest();
  }, [refetch, latest]);

  return {
    jobs,
    joblatest,
    loading,
    error,
    refetch,
    createJob,
    deleteJob,
    filterJobs,
    getJobById,
    categories_sum,
    getJobByDepartmentId,
    approveJob,
    rejectJob,
    fetchPendingJobsAdmin,
    fetchAllJob,
    getJobByDepId
  };
}
