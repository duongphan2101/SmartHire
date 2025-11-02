import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ChartData {
  _id: string;
  avgSalary: number;
  totalJobs: number;
}

const SalaryJobChart = ({ data }: { data: ChartData[] }) => {
  const formattedData = data.map(item => ({
    date: item._id,
    salary: item.avgSalary,
    jobs: item.totalJobs,
  }));

  return (
    <div className="bg-white rounded-xl shadow-xl p-4">
      <h2 className="font-semibold text-lg mb-3">Tăng trưởng lương & cơ hội việc làm</h2>

      <ResponsiveContainer width="100%" height={560}>
        <LineChart data={formattedData}  margin={{ top: 40, right: 40, bottom: 40, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Line type="monotone" dataKey="salary" stroke="#10b981" strokeWidth={2} name="Lương trung bình" />
          <Line type="monotone" dataKey="jobs" stroke="#3b82f6" strokeWidth={2} name="Số việc làm" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalaryJobChart;
