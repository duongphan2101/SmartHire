import { useState, useCallback } from "react";
import axios, { AxiosError } from "axios";
import { HOSTS } from "../utils/host";

export interface ApplicationResponse {
  _id: string;
  jobId: string;
  userId: string;
  resumeId: string;
  coverLetter?: string;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  createdAt?: string;
  updatedAt?: string;
}

export default function useApplication() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createApplication = useCallback(
    async (data: {
      jobId: string;
      userId: string;
      resumeId: string;
      coverLetter?: string;
    }) => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.post<ApplicationResponse>(
          `${HOSTS.applicationService}`,
          data
        );
        return res.data;
      } catch (err) {
        const axiosErr = err as AxiosError<{ message?: string }>;
        setError(axiosErr.response?.data?.message || "createApplication failed");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { createApplication, loading, error };
}
