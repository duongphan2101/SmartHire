import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { HOSTS } from "../utils/host";

interface Department {
  _id: string;
  name: string;
  avatar: string;
}

interface CreateBy {
  _id: string;
  fullname: string;
  avatar: string;
}

export interface JobData {
  _id: string;
  jobTitle: string;
  jobType: string;
  jobLevel: string;
  department: Department;
  createBy: CreateBy;
  requirement: string[];
  skills: string[];
  benefits: string[];
  jobDescription: string[];
  salary: string;
  location: string;
  address: string;
  endDate: string;
  num: number;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface JobWithState extends JobData {
  isSaved: boolean;
  animateSave: boolean;
}

interface UseJobReturn {
  jobs: JobData[];
  joblatest: JobData[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export default function useJob(): UseJobReturn {
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [joblatest, setJobLatest] = useState<JobData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const host = HOSTS.jobService;
      if (!host) throw new Error("jobService not defined in HOSTS");

      const [allRes, latestRes] = await Promise.all([
        axios.get<JobData[]>(`${host}/getAll`),
        axios.get<JobData[]>(`${host}/getLatest`)
      ]);

      setJobs(allRes.data);
      setJobLatest(latestRes.data);
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message || "Failed to fetch jobs");
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

  return { jobs, joblatest, loading, error, refetch };
}
