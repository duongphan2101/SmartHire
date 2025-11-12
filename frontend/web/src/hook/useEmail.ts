// hooks/useEmailService.ts
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { HOSTS } from "../utils/host";
import type { Interview } from "../utils/interfaces";

// --- Các interface hiện có ---
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

interface EmailJob2 {
  title: string;
  _id: string;
}

export interface InterviewEmailPayload {
  candidate: EmailUser;
  hr: EmailHR;
  job: EmailJob;
  interview: Interview;
}

export interface HrInviteEmailPayload {
  candidate: EmailUser;
  hr: EmailHR;
  job: EmailJob2;
  message: string;
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
   * Gửi email mời phỏng vấn (chính thức, có lịch)
   */
  const sendInterviewInvite = async (payload: InterviewEmailPayload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${host}/interview`, payload);
      return res.data;
    } catch (err) {
      return handleError(err, "Failed to send interview email");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Gửi email mời trao đổi (lời nhắn) từ HR đến ứng viên
   */
  const sendHrExchangeInvite = async (payload: HrInviteEmailPayload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${host}/notify-chat-request`, payload);
      return res.data;
    } catch (err) {
      return handleError(err, "Failed to send HR exchange invite email");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Gửi email thông báo job phù hợp nhất cho top 5 ứng viên
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
    sendJobRecommendationEmails,
    sendHrExchangeInvite,
  };
}