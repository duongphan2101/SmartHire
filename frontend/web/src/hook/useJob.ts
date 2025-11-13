import { useState, useEffect, useCallback } from "react";
import axios, { AxiosError } from "axios";
import { HOSTS } from "../utils/host";
import useDepartment from "./useDepartment";

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

  // fetch all
  const refetch = useCallback(async () => {
    if (!department) {
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

  // fetch all
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
    try {
      const idDepartment = id;
      const res = await axios.get<Job[]>(`${host}/getAll/${idDepartment}`);
      return res.data;
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message || "Failed to fetch job by id");
      return [];
    }
  }, [host]);

  // create
  const createJob = useCallback(async (payload: Omit<Job, "_id" | "createdAt">) => {
    try {
      setLoading(true);
      const res = await axios.post<Job>(`${host}/create`, payload);
      setJobs((prev) => [...prev, res.data]);
      return res.data;
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      const errorMessage = axiosErr.response?.data?.message || "Lỗi không xác định khi tạo Job.";
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    } finally {
    }
  }, [host]);

  // delete
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

  const filterJobs = useCallback(async (
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
  }, [host]);

  const getJobById = useCallback(async (id: string) => {
    try {
      // setLoading(true);
      const res = await axios.get<Job>(`${host}/${id}`);
      return res.data;
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message || "Failed to fetch job by id");
      return null;
    }
  }, [host]);

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
    getJobByDepartmentId
  };
}