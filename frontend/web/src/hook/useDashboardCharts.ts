import { useState } from "react";
import axios from "axios";

const useDashboardCharts = () => {
  const [salaryStats, setSalaryStats] = useState([]);
  const [industryStats, setIndustryStats] = useState([]);

  const fetchChartData = async () => {
    try {
      const salaryRes = await axios.get("http://localhost:4444/api/jobs/stats/salary");
      const industryRes = await axios.get("http://localhost:4444/api/jobs/stats/hot-industry");

      setSalaryStats(salaryRes.data);
      setIndustryStats(industryRes.data);
    } catch (error) {
      console.error("Chart Data Error:", error);
    }
  };

  return { salaryStats, industryStats, fetchChartData };
};

export default useDashboardCharts;
