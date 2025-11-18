// src/hook/useReport.ts
import { useState } from "react";
import axios from "axios";
import { HOSTS } from "../utils/host";

export interface ReportPayload {
  jobId: string;
  jobTitle: string;
  department?: string;
  userId: string;
  title: string;
  details: string;
  contact?: string;
}

export const useReport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitReport = async (payload: ReportPayload) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${HOSTS.reportService}/`, payload);
    } catch (err: any) {
      setError(err.message || "Gửi báo cáo thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { submitReport, loading, error };
};

export default useReport;
