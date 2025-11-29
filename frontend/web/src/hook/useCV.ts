import { useState, useCallback } from "react";
import axios, { AxiosError } from "axios";
import { HOSTS } from "../utils/host";
import type { CVData } from "../utils/interfaces";

export interface CVResponse {
  _id: string;
  userId: string;
  name: string;
  fileUrls: string[];
  status: "draft" | "active" | "archived";
  createdAt?: string;
  updatedAt?: string;
  templateType: number;
}

export interface CVAIResponse {
  data(data: any): unknown;
  optimizedSummary?: string;
  optimizedSkills?: string[];
  optimizedExperience?: string;
  optimizedEducation?: string;
  optimizedProjects?: string;
  cv_analysis?: string;
}

export interface CVAnalysisData {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggested_skills: string[];
  roadmap: string[];
  job_match_score: number;
}

interface cvAnalysisRes {
  success: boolean;
  data: CVAnalysisData;
  message?: string;
}

export default function useCV() {
  const [loadingCV, setLoading] = useState(false);
  const [errorCV, setError] = useState<string | null>(null);
  const [cvs, setCVs] = useState<CVResponse[]>([]);
  const [result, setResult] = useState<CVAnalysisData | null>(null);

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

  const createCVParse = useCallback(async (userId: string, cvData: CVData, pdfUrl: string) => {
    try {
      setLoading(true);
      setError(null);

      const payload = {
        userId,
        cvData,
        pdfUrl
      };

      const res = await axios.post<CVData>(`${HOSTS.cvService}/createCV`, payload);
      return res.data;

    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      const msg = axiosErr.response?.data?.message || "Tạo CV thất bại";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCV = useCallback(async (cvId: string, updateData: Partial<CVResponse>, newPdfUrl?: string) => {
    try {
      setLoading(true);
      setError(null);
      const currentCv = cvs.find((item) => item._id === cvId);
      const oldUrl = currentCv?.fileUrls?.[0] || null;
      const payload = {
        ...updateData,
        oldUrl: oldUrl,
        newUrl: newPdfUrl
      };

      const res = await axios.put<CVResponse>(`${HOSTS.cvService}/${cvId}`, payload);
      setCVs(prev => prev.map(cv => (cv._id === cvId ? res.data : cv)));
      return res.data;
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message || "updateCV failed");
    } finally {
      setLoading(false);
    }
  }, [cvs]);

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

  // ================= Parse CV Text =================
  const parseCVText = useCallback(async (cvText: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.post(`${HOSTS.cvService}/parse-cv`, { cvText });
      return res.data;
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message || "parseCVText failed");
    } finally {
      setLoading(false);
    }
  }, []);

  // ================= AI Optimize =================
  const optimizeSummary = useCallback(async (content: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log(`${HOSTS.cvAIService}/summary`);
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

  const analyzeCV = useCallback(async (cvId: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      //console.log(`${HOSTS.cvAIService}/analysis-cv`);
      const res = await axios.post<cvAnalysisRes>(`${HOSTS.cvAIService}/analysis-cv`, {
        cvId: cvId
      });

      if (res.data.success) {
        setResult(res.data.data);
        return res.data.data;
      } else {
        throw new Error(res.data.message || "Phân tích thất bại");
      }

    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      const errorMsg = axiosErr.response?.data?.message || axiosErr.message || "Lỗi kết nối đến dịch vụ AI";

      setError(errorMsg);
      return null;
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
    createCVParse,
    updateCV,
    deleteCV,
    parseCVText,
    optimizeSummary,
    optimizeSkills,
    optimizeExperience,
    optimizeEducation,
    optimizeProjects,
    analyzeCV,
    result
  };
}
