import { HOSTS } from './../utils/host';
import { useState, useCallback, useRef } from "react";

const TERMS_API_URL = HOSTS.termService;

export function useTerms() {
  const [termsText, setTermsText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const cacheRef = useRef<Record<string, string>>({});

  const fetchTerms = useCallback(async (role: string) => {
    if (cacheRef.current[role]) {
      setTermsText(cacheRef.current[role]);
      return;
    }

    setIsLoading(true);
    setTermsText("Đang tải điều khoản...");

    try {
      const res = await fetch(`${TERMS_API_URL}/${role}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const content = data.content || "Không tìm thấy nội dung điều khoản.";
      cacheRef.current[role] = content;
      setTermsText(content);
    } catch {
      setTermsText("Không thể tải điều khoản. Vui lòng kiểm tra server.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateTerms = useCallback(async (role: string, newContent: string) => {
    setIsSaving(true);
    try {
      const res = await fetch(`${TERMS_API_URL}/${role}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newContent }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      cacheRef.current[role] = data.data.content;
      setTermsText(data.data.content);

      return { success: true, message: data.message };
    } catch {
      return { success: false, message: "Cập nhật thất bại." };
    } finally {
      setIsSaving(false);
    }
  }, []);

  return { termsText, isLoading, isSaving, fetchTerms, updateTerms, setTermsText };
}
