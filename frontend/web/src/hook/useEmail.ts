// hooks/useEmailService.ts
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { HOSTS } from "../utils/host";
import type { Interview } from "../utils/interfaces";

interface EmailUser {
  fullname: string;
  email: string;
}

interface EmailHR {
  fullname: string;
  email: string;
  companyName?: string;
}

interface EmailJob {
  title: string;
}

export interface InterviewEmailPayload {
  candidate: EmailUser;
  hr: EmailHR;
  job: EmailJob;
  interview: Interview;
}

type ApiError = {
  message?: string;
};

export default function useEmailService() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const host = HOSTS.emailService;

  const handleError = (err: unknown, defaultMessage: string) => {
    const axiosErr = err as AxiosError<ApiError>;
    const message = axiosErr.response?.data?.message || defaultMessage;
    setError(message);
    throw new Error(message); // Re-throw lỗi
  };

  /**
   * Xóa thông báo lỗi
   */
  const clearError = () => {
    setError(null);
  };

  /**
   * Gửi email mời phỏng vấn
   */
  const sendInterviewInvite = async (payload: InterviewEmailPayload) => {
    setLoading(true);
    setError(null);
    try {
      
        console.log("Gửi email với payload:", payload);
        console.log(`${host}/interview`)
      const res = await axios.post(`${host}/interview`, payload);
      return res.data;
    } catch (err) {
      return handleError(err, "Failed to send interview email");
    } finally {
      setLoading(false);
    }
  };

  return {
    // States
    loading,
    error,
    // Functions
    sendInterviewInvite,
    clearError,
  };
}