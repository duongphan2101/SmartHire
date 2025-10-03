import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { HOSTS } from "../utils/host";

export default function usePayment() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<string>("");
    const [balance, setBalance] = useState<number>(0);
    const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
    const [transactions, setTransactions] = useState<any[]>([]);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                const idToFetch = parsed.user_id ?? parsed._id;
                setUserId(idToFetch);
                getBalance(idToFetch);
                getTransactions(idToFetch);
            }
        } catch (e) {
            console.error("Invalid user data in localStorage", e);
        }
    }, []);

    const getBalance = async (userId: string) => {
        try {
            const host = HOSTS.walletService;
            setLoading(true);

            const res = await axios.get(`${host}/${userId}`);
            // console.log(`${host}/${userId}`);
            // console.log("DATA: ", res.data);
            setBalance(res.data);
        } catch (err) {
            const axiosErr = err as AxiosError<{ message?: string }>;
            setError(
                axiosErr.response?.data?.message || "Failed to fetch jobs latest"
            );
        } finally {
            setLoading(false);
        }
    };

    const createPayment = async (amount: number) => {
        try {
            setLoading(true);
            setError(null);

            const host = HOSTS.paymentService;
            const orderId = `ORD_${Date.now()}`;
            const res = await axios.post(`${host}/create-qr`, {
                userId,
                amount,
                orderId,
            });

            setPaymentUrl(res.data);

            return res.data;
        } catch (err) {
            const axiosErr = err as AxiosError<{ error?: string }>;
            setError(
                axiosErr.response?.data?.error || "Failed to create payment"
            );
            return null;
        } finally {
            setLoading(false);
        }
    };

    const getTransactions = async (userId: string) => {
        try {
            const host = HOSTS.walletService;
            setLoading(true);

            const res = await axios.get(`${host}/${userId}/transactions`);
            setTransactions(res.data);
        } catch (err) {
            const axiosErr = err as AxiosError<{ message?: string }>;
            setError(
                axiosErr.response?.data?.message || "Failed to fetch transactions"
            );
        } finally {
            setLoading(false);
        }
    };

    const withdraw = async (amount: number) => {
        try {
            setLoading(true);
            setError(null);

            const host = HOSTS.walletService;
            const res = await axios.post(`${host}/withdraw`, {
                userId, amount
            });

            if (res.data?.balance !== undefined) {
                setBalance(res.data.balance);
            }

            setTransactions((prev) => [res.data.transaction, ...prev]);

            return res.data;
        } catch (err) {
            const axiosErr = err as AxiosError<{ error?: string }>;
            setError(
                axiosErr.response?.data?.error || "Failed to withdraw"
            );
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        balance,
        createPayment,
        paymentUrl,
        transactions,
        getTransactions,
        withdraw,
    };
}