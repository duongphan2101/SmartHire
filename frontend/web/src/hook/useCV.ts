import { useState, useCallback } from "react";
import axios, { AxiosError } from "axios";
import { HOSTS } from "../utils/host";

export interface CVResponse {
  _id: string;
  userId: string;
  name: string;
  fileUrls: string[];
  status: "draft" | "active" | "archived";
  createdAt?: string;
  updatedAt?: string;
}

export interface CVAIResponse {
  optimizedSummary?: string;
  optimizedSkills?: string[];
  optimizedExperience?: string;
  optimizedEducation?: string;
  optimizedProjects?: string;
}

export default function useCV() {
  const [loadingCV, setLoading] = useState(false);
  const [errorCV, setError] = useState<string | null>(null);
  const [cvs, setCVs] = useState<CVResponse[]>([]);

  // ================= CRUD =================
  const getCVs = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get<CVResponse[]>(`${HOSTS.cvService}/user/${userId}`);
      setCVs(res.data);
      return res.data;
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message || "getCVs failed");
    } finally {
      setLoading(false);
    }
  }, []);

  const createCV = useCallback(async (userId: string, cvData: Partial<CVResponse>, pdfUrl: string) => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.post<CVResponse>(`${HOSTS.cvService}/createCV`, {
        userId,
        cvData,
        pdfUrl,
      });

      setCVs(prev => [...prev, res.data]);
      return res.data;
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message || "createCV failed");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCV = useCallback(async (cvId: string, updateData: Partial<CVResponse>) => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.put<CVResponse>(`${HOSTS.cvService}/cv/${cvId}`, updateData);
      setCVs(prev => prev.map(cv => (cv._id === cvId ? res.data : cv)));
      return res.data;
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message || "updateCV failed");
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCV = useCallback(async (cvId: string) => {
    try {
      setLoading(true);
      setError(null);

      await axios.delete(`${HOSTS.cvService}/cv/${cvId}`);
      setCVs(prev => prev.filter(cv => cv._id !== cvId));
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message || "deleteCV failed");
    } finally {
      setLoading(false);
    }
  }, []);

  // ================= AI Optimize =================
  const optimizeSummary = useCallback(async (content: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.post<CVAIResponse>(`${HOSTS.cvAIService}/summary`, { content });
      return res.data;
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message || "optimizeSummary failed");
    } finally {
      setLoading(false);
    }
  }, []);

  const optimizeSkills = useCallback(async (content: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.post<CVAIResponse>(`${HOSTS.cvAIService}/skills`, { content });
      return res.data;
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message || "optimizeSkills failed");
    } finally {
      setLoading(false);
    }
  }, []);

  const optimizeExperience = useCallback(async (content: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.post<CVAIResponse>(`${HOSTS.cvAIService}/experience`, { content });
      return res.data;
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message || "optimizeExperience failed");
    } finally {
      setLoading(false);
    }
  }, []);

  const optimizeEducation = useCallback(async (content: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.post<CVAIResponse>(`${HOSTS.cvAIService}/education`, { content });
      return res.data;
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message || "optimizeEducation failed");
    } finally {
      setLoading(false);
    }
  }, []);

  const optimizeProjects = useCallback(async (content: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.post<CVAIResponse>(`${HOSTS.cvAIService}/projects`, { content });
      return res.data;
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message || "optimizeProjects failed");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    cvs,
    loadingCV,
    errorCV,
    getCVs,
    createCV,
    updateCV,
    deleteCV,
    optimizeSummary,
    optimizeSkills,
    optimizeExperience,
    optimizeEducation,
    optimizeProjects,
  };
}
