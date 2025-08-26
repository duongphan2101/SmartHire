import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { HOSTS } from "../utils/host";

declare const google: any;

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  [key: string]: any;
}

export default function useAuth() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string): Promise<AuthResponse | void> => {
    try {
      const host = HOSTS.authService;
      setLoading(true);
      setError(null);

      const res = await axios.post<AuthResponse>(`${host}/login`, { email, password });

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      return res.data;
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    fullname: string,
    email: string,
    password: string
  ): Promise<AuthResponse | void> => {
    try {
      const host = HOSTS.authService;
      setLoading(true);
      setError(null);

      const res = await axios.post<AuthResponse>(`${host}/register`, {
        fullname,
        email,
        password,
      });

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      return res.data;
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  };

  // 🔹 Login with Google
  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);

      const host = HOSTS.authService;

      google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: async (response: any) => {
          const idToken = response.credential;

          const res = await axios.post(`${host}/login/google`, {
            token: idToken,
          });

          localStorage.setItem("accessToken", res.data.accessToken);
          localStorage.setItem("refreshToken", res.data.refreshToken);
          localStorage.setItem("user", JSON.stringify(res.data.user));

          window.location.href = "/home";
        },
      });

      google.accounts.id.prompt();
    } catch (err: any) {
      setError("Google login failed");
      console.error("Google login error =>", err);
    } finally {
      setLoading(false);
    }
  };


  // 🔹 Login with Facebook
  useEffect(() => {
    (window as any).fbAsyncInit = function () {
      (window as any).FB.init({
        appId: "SmartHire", // đổi thành app của bạn
        cookie: true,
        xfbml: true,
        version: "v21.0",
      });
    };
  }, []);

  //  Hàm login với Facebook
  const loginWithFacebook = () => {
    (window as any).FB.login(
      async (response: any) => {
        if (response.authResponse) {
          const accessToken = response.authResponse.accessToken;
          try {
            const host = HOSTS.authService;
            const res = await axios.post(`${host}/facebook`, { accessToken });
            localStorage.setItem("accessToken", res.data.accessToken);
            localStorage.setItem("refreshToken", res.data.refreshToken);
            localStorage.setItem("user", JSON.stringify(res.data.user));
          } catch (error) {
            console.error("FB login error =>", error);
          }
        } else {
          console.log("User canceled Facebook login or did not fully authorize.");
        }
      },
      { scope: "email,public_profile" }
    );
  };

  return { login, register, logout, loginWithFacebook, loginWithGoogle, loading, error };
}
