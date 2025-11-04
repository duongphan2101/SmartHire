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

interface EmailJobMatching {
  _id: string;
  title: string;
  description?: string[];
  location?: string;
  salary?: string;
}

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

  /**
  * Gửi email thông báo job phù hợp nhất cho top 5 ứng viên
  * @param hr Thông tin HR đăng job
  * @param job Thông tin job mới đăng
  * @param matchedUsers Danh sách ứng viên từ API matching (đã slice top 5)
  */
  const sendJobRecommendationEmails = async (
    hr: EmailHR,
    job: EmailJobMatching,
    candidates: any[]
  ) => {
    if (!candidates || candidates.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const payload = {
        hr,
        job,
        candidates: candidates.map((c) => ({
          fullname: c.user.fullname,
          email: c.user.email,
          finalScore: c.finalScore,
          reason: c.reason,
        })),
      };

      console.log("📤 Sending job recommendation emails:", payload);

      const res = await axios.post(`${host}/notify-job-tracking-email`, payload);
      return res.data;
    } catch (err) {
      return handleError(err, "Failed to send job recommendation emails");
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
    sendJobRecommendationEmails
  };
}