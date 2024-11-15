import { useTheme } from "@mui/material/styles";
import ReactEcharts from "echarts-for-react";

export default function ResponseChart({ height, data }) {
  const theme = useTheme();

  const option = {
    grid: { top: "10%", bottom: "10%", right: "5%" },
    legend: { show: false },
    color: ["#223388", "rgba(34, 51, 136, 0.8)"],
    barGap: 0,
    barMaxWidth: "64px",
    dataset: {
      source: [
        ["Value", "Data"],
        ["No DR", data[0]],
        ["NPDR", data[1]],
        ["PLDR", data[2]],
      ]
    },
    xAxis: {
      type: "category",
      axisLine: { show: false },
      splitLine: { show: false },
      axisTick: { show: false },
      axisLabel: { fontSize: 13, fontFamily: "roboto", color: 'black' }
    },
    yAxis: {
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: theme.palette.text.secondary, opacity: 0.15 } },
      axisLabel: { fontSize: 13, fontFamily: "roboto", color: 'black' }
    },
    series: [{ type: "bar" }]
  };

  return <ReactEcharts style={{ height: height }} option={{ ...option }} />;
}
