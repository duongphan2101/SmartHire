import { useState, useEffect } from "react";
import { useCallback } from "react";
import axios, { AxiosError } from "axios";
import { HOSTS } from "../utils/host";
import debounce from "lodash.debounce";

export interface Job {
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
  jobDescription: string[];
  endDate: string;
  num: number;
  createdAt: string;
}

export default function useJob() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const host = HOSTS.jobService;

  // fetch all
  const refetch = async () => {
    try {
      setLoading(true);
      const res = await axios.get<Job[]>(`${host}/getAll`);
      setJobs(res.data);
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message || "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  // create
  const createJob = async (payload: Omit<Job, "_id" | "createdAt">) => {
    try {
      setLoading(true);
      const res = await axios.post<Job>(`${host}/create`, payload);
      setJobs((prev) => [...prev, res.data]);
      return res.data;
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message || "Failed to create job");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // delete
  const deleteJob = async (id: string) => {
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
  };

//   // search
// const searchJobs = useCallback(
//     debounce(async (query: string, callback: (results: Job[]) => void) => {
//       try {
//         setLoading(true);
//         const res = await axios.get<Job[]>(`${host}/search?q=${query}`);
//         callback(res.data);
//       } catch (err) {
//         console.error("Search error:", err);
//         callback([]);
//       } finally {
//         setLoading(false);
//       }
//     }, 300), 
//     []
//   );

  useEffect(() => {
    refetch();
  }, []);

  return { jobs, loading, error, refetch, createJob, deleteJob };
}
