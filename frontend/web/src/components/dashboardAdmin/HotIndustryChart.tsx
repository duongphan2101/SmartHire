import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface IndustryData {
  _id: string;
  totalJobs: number;
}

const HotIndustryChart = ({ data }: { data: IndustryData[] }) => {
  const formattedData = data.map(item => ({
    industry: item._id,
    count: item.totalJobs,
  }));

  return (
    <div className="bg-white rounded-xl shadow-xl p-4">
      <h2 className="font-semibold text-lg mb-3">Công ty hot</h2>

      <ResponsiveContainer width="100%" height={560}>
        <BarChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="industry" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#10b981" name="Tin tuyển dụng" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HotIndustryChart;
