import { useState } from "react";
import axios from "axios";

const useDashboardAdmin = () => {
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalCompanies, setTotalCompanies] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0); 

  const fetchCounts = async () => {
    try {
      const jobCount = await axios.get("http://localhost:4444/api/jobs/count");
      const companyCount = await axios.get("http://localhost:4444/api/departments/count");


      setTotalJobs(jobCount.data.total);
      setTotalCompanies(companyCount.data.total);
      setTotalPosts(jobCount.data.total); 
    } catch (err) {
      console.error("Dashboard count error ", err);
    }
  };

  return { totalJobs, totalCompanies, totalPosts, fetchCounts };
};

export default useDashboardAdmin;
