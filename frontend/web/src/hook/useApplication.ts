import { useState, useCallback } from "react";
import axios, { AxiosError } from "axios";
import { HOSTS } from "../utils/host";
import type { Job } from "../utils/interfaces";

export interface ApplicationResponse {
  jobSnapshot: any;
  userSnapshot: any;
  _id: string;
  jobId: string;
  userId: string;
  resumeId: string;
  coverLetter?: string;
  status: "pending" | "reviewed" | "accepted" | "rejected" | "contacted";
  createdAt?: string;
  updatedAt?: string;
}

export interface MatchingResponse {
  map: any;
  matches: MatchingResponse;
  cvId: string;
  job: Job;
  title?: string;
  cosineScore: number;
  aiScore: number;
  finalScore: number;
  reason?: string;
  strengths?: string[];
  weaknesses?: string[];
}

export interface MatchingJobListResponse {
  cvId: string;
  matches: {
    jobId: string;
    title?: string;
    cosineScore: number;
    aiScore: number;
    finalScore: number;
    reason?: string;
    strengths?: string[];
    weaknesses?: string[];
  }[];
}

export interface MatchingCVSResponse {
  cvId: string;
  userId: string;
  user: UserResponse | null;
  jobId?: string;
  title?: string;
  cosineScore: number;
  aiScore: number;
  finalScore: number;
  reason?: string;
  strengths?: string[];
  weaknesses?: string[];
}

export interface CVResponse {
  _id: string;
  fileUrls: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserResponse {
  _id: string;
  fullname: string;
  email: string;
  avatar?: string;
  cv: CVResponse[];
}

// interface CoverLetterParams {
//   cvId: string;
//   jobId: string;
// }

type CoverLetterParams =
  | { cvId: string; jobId: string; }
  | { previousResult: string; refinementPrompt: string; };

export default function useApplication() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coverLetter, setCoverLetter] = useState<string | null>(null);

  // 🟢 Gửi đơn ứng tuyển
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

  // 🟣 Matching 1 CV với 1 Job
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

  // 🟣 Matching viec lam phu hop
  const renderMatchingJob = useCallback(
    async (data: { cv_id: string }) => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.post<MatchingResponse>(
          `${HOSTS.matchingService}/match-all`,
          data
        );
        // console.log("res match all", res.data);
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

  // 🟢 Matching nhiều CV cho 1 Job
  const renderMatchingCvsForOneJob = useCallback(async (data: { job_id: string }) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.post<MatchingCVSResponse[]>(
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
  }, []);

  // 🟠 Matching 1 CV với nhiều Job trong 1 Department
  const renderMatchingJobsForDepartment = useCallback(async (data: { department_id: string; cv_id: string }) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.post<MatchingJobListResponse>(
        `${HOSTS.matchingService}/match-department`,
        data
      );
      return res.data;
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message || "Matching Department failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 🟡 Cập nhật trạng thái đơn ứng tuyển
  const updateStatus = useCallback(
    async (data: { id: string; status: string }) => {
      try {
        setLoading(true);
        setError(null);
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

  const updateStatusAndNote = useCallback(
    async (data: { id: string; status: string; note: string; }) => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.put<{ success: boolean; data: any }>(
          `${HOSTS.applicationService}/${data.id}/status-note`,
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

  // 🔵 Tạo thư xin việc tự động bằng AI
  const generateCoverLetter = async (params: CoverLetterParams) => {
    setLoading(true);
    setError(null);

    try {
      const host = HOSTS.cvAIService;
      const res = await axios.post(`${host}/coverLetter`, params);

      if (res.data && res.data.coverLetter) {
        setCoverLetter(res.data.coverLetter);
        return res.data;
      } else {
        throw new Error("API không trả về 'coverLetter' như mong đợi.");
      }

    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || "Có lỗi xảy ra khi tạo thư giới thiệu";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getAllJobByUser = useCallback(
    async (hrId: string, startDate: string, endDate: string) => {
      try {
        setLoading(true);
        setError(null);
        const data = {
          hrId, startDate, endDate
        }
        //console.log(`${HOSTS.applicationService}/hr-candidatelist`);
        const res = await axios.post(
          `${HOSTS.applicationService}/hr-candidatelist`, data
        );
        // console.log("APPDATA: ", res.data);
        return res.data.data;
      } catch (err) {
        const axiosErr = err as AxiosError<{ message?: string }>;
        setError(axiosErr.response?.data?.message || "Get Application failed");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    createApplication,
    renderMatchingJob,
    renderMatchingCvForJob,
    renderMatchingCvsForOneJob,
    renderMatchingJobsForDepartment,
    updateStatus,
    updateStatusAndNote,
    loading,
    error,
    coverLetter,
    generateCoverLetter,
    getAllJobByUser
  };
}
