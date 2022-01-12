import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  YAxis,
  ResponsiveContainer,
} from "recharts";

const SimpleAreaChart = ({ title, data, name, color = "#5550bd", grid }) => {
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
        <AreaChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area name={name} type="monotone" dataKey="value" stroke={color} />
          {grid && <CartesianGrid stroke="#e0dfdf" strokeDasharray="5 5" />}
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default SimpleAreaChart;
