import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  Legend,
} from "recharts";

const SimpleRadarChart = ({ data, name, color = "#8884d8" }) => {
  return (
    <RadarChart outerRadius={150} width={500} height={500} data={data}>
      <PolarGrid />
      <PolarAngleAxis dataKey="name" />
      <PolarRadiusAxis />
      <Radar
        name={name}
        dataKey="value"
        stroke={color}
        fill={color}
        fillOpacity={0.6}
      />
      <Tooltip />
      <Legend />
    </RadarChart>
  );
};

export default SimpleRadarChart;
