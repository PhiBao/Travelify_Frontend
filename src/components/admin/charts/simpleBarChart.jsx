import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip,
  YAxis,
  ResponsiveContainer,
} from "recharts";

const SimpleBarChart = ({ title, data, name, color = "#3f51b5", grid }) => {
  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        margin: 3,
        padding: 3,
        borderRadius: "15px",
        boxShadow: "0px 0px 15px -10px rgba(0, 0, 0, 0.75)",
      }}
    >
      <Typography variant="h4" component="div" mb={3}>
        {title}
      </Typography>
      <ResponsiveContainer width="100%" aspect={4 / 1}>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis dataKey="name" stroke={color} tick={false} />
          <YAxis />
          <Tooltip />
          {grid && <CartesianGrid stroke="#e0dfdf" strokeDasharray="5 5" />}
          <Bar name={name} dataKey="value" fill={color} />
          <Tooltip />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default SimpleBarChart;
