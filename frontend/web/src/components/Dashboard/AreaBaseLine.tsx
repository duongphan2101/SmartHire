import { Box } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";

export default function AreaBaseline() {
    return (
        <Box sx={{ backgroundColor: "#fff", borderRadius: 2, p: 2 }}>
            <LineChart
                xAxis={[
                    { data: [1, 2, 3, 5, 8, 10], disableLine: true, disableTicks: true }
                ]}
                yAxis={[{ disableLine: true, disableTicks: true }]}
                series={[
                    {
                        data: [2, -5.5, 2, -7.5, 1.5, 6],
                        area: true,
                        baseline: "min",
                        color: "#059669",
                        showMark: ({ index }) => index % 2 === 0,                    
                    },
                ]}
                height={250}
                sx={{
                    backgroundColor: "#fff"
                }}
            />
        </Box>
    );
}
