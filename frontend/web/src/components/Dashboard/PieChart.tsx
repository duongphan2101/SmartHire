import { PieChart } from '@mui/x-charts/PieChart';
import { desktopOS, valueFormatter } from './webUsageStats';
import { Box } from '@mui/material';

export default function PieActiveArc() {
    return (
        <Box sx={{ backgroundColor: "#fff", borderRadius: 2, p: 2, position: 'relative' }}>
            <PieChart
                series={[
                    {
                        data: desktopOS,
                        highlightScope: { fade: 'global', highlight: 'item' },
                        faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                        valueFormatter,
                    },
                ]}
                height={250}
                width={200}
                sx={{
                    backgroundColor: "#fff",
                    position: 'relative'
                }}
            />
        </Box>
    );
}
