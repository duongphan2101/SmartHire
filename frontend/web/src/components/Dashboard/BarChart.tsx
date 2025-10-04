import { BarChart } from '@mui/x-charts/BarChart';
import { dataset, valueFormatter } from './BarChartData';

const chartSetting = {
    yAxis: [
        {
            label: 'rainfall (mm)',
            width: 60,
        },
    ],
    series: [{ dataKey: 'seoul', label: 'Seoul rainfall', valueFormatter }],
    height: 500,
    margin: { left: 0 },
};

export default function TickPlacementBars() {

    return (
        <div style={{ width: '100%', borderRadius: 5 }}>
            <BarChart
                dataset={dataset}
                xAxis={[{ dataKey: 'month', disableLine: true }]}
                // yAxis={[{disableLine: true}]}
                {...chartSetting}
            />
        </div>
    );
}