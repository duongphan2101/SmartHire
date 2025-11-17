import { useState } from "react";
import axios, { AxiosError } from "axios";
import { HOSTS } from "../utils/host";
import type { Interview } from "../utils/interfaces";

type ApiError = {
  message?: string;
};

export default function useInterview() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const host = HOSTS.interviewService;

  const handleError = (err: unknown, defaultMessage: string) => {
    const axiosErr = err as AxiosError<ApiError>;
    const message = axiosErr.response?.data?.message || defaultMessage;
    setError(message);
    throw new Error(message);
  };

  const clearError = () => {
    setError(null);
  };

   //* CREATE: Tạo một interview mới
  const createInterview = async (data: Partial<Interview>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post<Interview>(`${host}/`, data);
      setInterviews((prev) => [res.data, ...prev]); 
      return res.data;
    } catch (err) {
      return handleError(err, "Failed to create interview");
    } finally {
      setLoading(false);
    }
  };

   //* READ (All): Lấy tất cả interviews
  const fetchAllInterviews = async () => {
    setLoading(true);
    setError(null);
    try {
      // console.log(`${host}/`);
      const res = await axios.get<Interview[]>(`${host}/`);
      setInterviews(res.data);
      // console.log("DATA: ", res.data);
      return res.data;
    } catch (err) {
      handleError(err, "Failed to fetch interviews");
    } finally {
      setLoading(false);
    }
  };

   //* READ (One): Lấy một interview bằng ID
  const fetchInterviewById = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get<Interview>(`${host}/${id}`);
      setInterview(res.data);
      console.log(`DATA ${res.data}`)
      return res.data;
    } catch (err) {
      handleError(err, "Interview not found");
    } finally {
      setLoading(false);
    }
  };

   //* UPDATE: Cập nhật một interview
  const updateInterview = async (id: string, data: Partial<Interview>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.put<Interview>(`${host}/${id}`, data);
      
      setInterviews((prev) =>
        prev.map((item) => (item._id === id ? res.data : item))
      );
      
      if (interview?._id === id) {
        setInterview(res.data);
      }
      
      return res.data;
    } catch (err) {
      return handleError(err, "Failed to update interview");
    } finally {
      setLoading(false);
    }
  };

   //* DELETE: Xóa một interview
  const deleteInterview = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${host}/${id}`);

      setInterviews((prev) => prev.filter((item) => item._id !== id));

       if (interview?._id === id) {
        setInterview(null);
      }
    } catch (err) {
      handleError(err, "Failed to delete interview");
    } finally {
      setLoading(false);
    }
  };

  return {
    // States
    interviews,
    interview,
    loading,
    error,
    
    // Functions
    createInterview,
    fetchAllInterviews,
    fetchInterviewById,
    updateInterview,
    deleteInterview,
    clearError,
  };
}