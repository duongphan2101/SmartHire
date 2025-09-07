// File: src/hooks/useJob.ts

import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { HOSTS } from "../utils/host";

// Định nghĩa kiểu dữ liệu cho Job
interface JobData {
  _id: string;
  jobTitle: string;
  jobType: string;
  skills: string[];
  salary: string;
  address: string;
  createdAt: Date;
}

interface UseJobReturn {
  jobs: JobData[];
  loading: boolean;
  error: string | null;
  refetch: () => void; // Thêm hàm refetch để tải lại dữ liệu
}

export default function useJob(): UseJobReturn {
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const host = HOSTS.jobService; 
      if (!host) throw new Error("jobService not defined in HOSTS");
      const response = await axios.get<JobData[]>(`${host}/getAll`);
      setJobs(response.data);
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.message || "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const refetch = () => {
    fetchJobs();
  };

  return { jobs, loading, error, refetch };
}