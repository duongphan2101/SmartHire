import { useState } from "react";
import axios from "axios";
import { HOSTS } from "../utils/host";

const useDashboardCharts = () => {
  const [salaryStats, setSalaryStats] = useState([]);
  const [industryStats, setIndustryStats] = useState([]);

  const fetchChartData = async () => {
    try {
      const salaryRes = await axios.get(`${HOSTS.jobService}/stats/salary`);
      const industryRes = await axios.get(`${HOSTS.jobService}/stats/hot-industry`);
      
      setSalaryStats(salaryRes.data);
      setIndustryStats(industryRes.data);
    } catch (error) {
      console.error("Chart Data Error:", error);
    }
  };

  return { salaryStats, industryStats, fetchChartData };
};

export default useDashboardCharts;
