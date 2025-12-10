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
  color: string;
  fontFamily: string;
  languageForCV: string;
  templateType: number;
  title: string;
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
  missing_sections: string[];
  format_tips: string[];
  ats_check: {
    issues: string[];
    improvements: string[];
  };
}

interface CustomSettings {
  color: string;
  fontFamily: string;
  lang: string;
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

  const createCV = useCallback(async (
    userId: string,
    cvData: Partial<CVResponse>,
    settings: CustomSettings,
    layout: string[]
  ) => {
    try {
      setLoading(true);
      setError(null);

      const payload = {
        userId,
        cvData,
        settings,
        layout
      };

      const res = await axios.post<CVResponse>(`${HOSTS.cvService}/createCV`, payload);

      setCVs(prev => [...prev, res.data]);

      return res.data;
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message || "createCV failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCV = useCallback(async (
    cvId: string,
    updateData: Partial<CVResponse>,
    settings: CustomSettings,
    layout: string[]
  ) => {
    try {
      setLoading(true);
      setError(null);

      const payload = {
        ...updateData,
        settings,
        layout,
        regeneratePDF: true
      };

      const res = await axios.put<CVResponse>(`${HOSTS.cvService}/${cvId}`, payload);

      setCVs(prev => prev.map(cv => (cv._id === cvId ? res.data : cv)));

      return res.data;
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message || "updateCV failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [cvs]);

  const createCVParse = useCallback(async (userId: string, cvData: CVData, pdfUrl: string) => {
    try {
      setLoading(true);
      setError(null);

      const payload = {
        userId,
        cvData,
        pdfUrl
      };

      const res = await axios.post<CVData>(`${HOSTS.cvService}/createCVParse`, payload);
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

  const generateCV = useCallback(async (cvId: string, jobId: string) => {
    try {
      setLoading(true);
      setError(null);

      const payload = {
        cvId, jobId
      };

      const res = await axios.post(`${HOSTS.cvService}/generate-cv`, payload);

      // console.log("DATA: ", res.data.tailoredCV);
      return res.data.tailoredCV;

    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      const msg = axiosErr.response?.data?.message || "Tạo CV thất bại";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const refineCV = useCallback(
    async (currentCV: CVData, feedback: string) => {
      try {
        setLoading(true);
        setError(null);

        const payload = {
          currentCV,
          feedback
        };

        const res = await axios.post(
          `${HOSTS.cvService}/generate-cv`,
          payload
        );

        return res.data.refinedCV;
      } catch (err) {
        const axiosErr = err as AxiosError<{ message?: string }>;
        const msg = axiosErr.response?.data?.message || "Refine CV thất bại";
        setError(msg);
        throw new Error(msg);
      } finally {
        setLoading(false);
      }
    },
    []
  );

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
    result,
    generateCV,
    refineCV
  };
}