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

export interface MatchingResponse {
  cvId: string;
  score: string;
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

  const renderMatchingCvForJob = useCallback(
    async (data: { job_id: string; cv_id: string }) => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.post<MatchingResponse>(
          `${HOSTS.matchingService}/match-one`,
          data
        );
        return res.data;
      } catch (err) {
        const axiosErr = err as AxiosError<{ message?: string }>;
        setError(axiosErr.response?.data?.message || "Matching Rendering failed");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const renderMatchingCvsForOneJob = useCallback(
    async (data: { job_id: string }) => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.post<MatchingResponse[]>(
          `${HOSTS.matchingService}/match-cvs`,
          data
        );
        return res.data;
      } catch (err) {
        const axiosErr = err as AxiosError<{ message?: string }>;
        setError(axiosErr.response?.data?.message || "Matching Rendering failed");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateStatus = useCallback(
    async (data: { id: string; status: string }) => {
      try {
        setLoading(true);
        setError(null);

        console.log("Data: ", data);

        const res = await axios.put<{ success: boolean; data: any }>(
          `${HOSTS.applicationService}/${data.id}/status`,
          { status: data.status }
        );

        return res.data;
      } catch (err) {
        const axiosErr = err as AxiosError<{ message?: string }>;
        setError(axiosErr.response?.data?.message || "Update status failed");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { createApplication, renderMatchingCvForJob, renderMatchingCvsForOneJob, updateStatus, loading, error };
}
