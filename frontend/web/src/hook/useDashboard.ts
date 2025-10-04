import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { HOSTS } from "../utils/host";
import useDepartment from "./useDepartment";

export default function useDashboard() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [allJobDepartment, setAllJobDepartment] = useState<number>(0);
    const [allJobUser, setAllJobUser] = useState<number>(0);
    const [allCandidate, setAllCandidate] = useState<number>(0);
    const [allCandidateByUser, setAllCandidateUser] = useState<number>(0);
    const { department } = useDepartment("user");
    const [userId, setUserId] = useState<string>("");

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                const idToFetch = parsed.user_id ?? parsed._id;
                setUserId(idToFetch);
                AllJobUser(idToFetch);
            }
        } catch (e) {
            console.error("Invalid user data in localStorage", e);
        }
    }, []);

    useEffect(() => {
        if (department && department._id) {
            AllJobDepartment();
            AllCandidate();
            AllCandidateByUser();
        }
    }, [department]);

    // fetch all job by department
    const AllJobDepartment = async () => {
        try {
            const host = HOSTS.jobService;
            setLoading(true);
            const res = await axios.get(`${host}/jobByDepartment/${department?._id}`);
            setAllJobDepartment(res.data);
        } catch (err) {
            const axiosErr = err as AxiosError<{ message?: string }>;
            setError(
                axiosErr.response?.data?.message || "Failed to fetch jobs latest"
            );
        } finally {
            setLoading(false);
        }
    };

    const AllJobUser = async (id?: string) => {
        try {
            const host = HOSTS.jobService;
            setLoading(true);
            const res = await axios.get(`${host}/jobByUser/${id ?? userId}`);
            setAllJobUser(res.data);
        } catch (err) {
            const axiosErr = err as AxiosError<{ message?: string }>;
            setError(axiosErr.response?.data?.message || "Failed to fetch jobs latest");
        } finally {
            setLoading(false);
        }
    };

    const AllCandidate = async () => {
        try {
            const host = HOSTS.applicationService;
            setLoading(true);
            const res = await axios.get(`${host}/num-application/${department?._id}`);
            setAllCandidate(res.data);
        } catch (err) {
            const axiosErr = err as AxiosError<{ message?: string }>;
            setError(
                axiosErr.response?.data?.message || "Failed to fetch jobs latest"
            );
        } finally {
            setLoading(false);
        }
    };

    const AllCandidateByUser = async () => {
        try {
            const host = HOSTS.applicationService;
            setLoading(true);
            const res = await axios.get(`${host}/num-application/${department?._id}/${userId}`);
            setAllCandidateUser(res.data);
        } catch (err) {
            const axiosErr = err as AxiosError<{ message?: string }>;
            setError(
                axiosErr.response?.data?.message || "Failed to fetch jobs latest"
            );
        } finally {
            setLoading(false);
        }
    };

    return {
        loading, error, allJobDepartment, allJobUser, allCandidate, allCandidateByUser
    };
}