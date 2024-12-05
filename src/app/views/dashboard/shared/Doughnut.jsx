import { useTheme } from "@mui/material/styles";
import ReactEcharts from "echarts-for-react";

export default function DoughnutChart({ title, record, height, color = [] }) {
  const theme = useTheme();
  const data = Object.entries(record).map(([name, value]) => ({ name, value }));

  const option = {
    title: { 
      text: title,  
      left: "center",  
      textStyle: {  
        color: theme.palette.text.primary, 
        fontSize: 14, 
        fontFamily: "roboto",  
        fontWeight: "bold"  
      },
      padding: 3
    },
    legend: {
      show: true,
      itemGap: 10,
      icon: "circle",
      bottom: 0,
      textStyle: { color: theme.palette.text.secondary, fontSize: 12, fontFamily: "roboto" }
    },
    tooltip: { show: false, trigger: "item", formatter: "{a} <br/>{b}: {c} ({d}%)" },
    xAxis: [{ axisLine: { show: false }, splitLine: { show: false } }],
    yAxis: [{ axisLine: { show: false }, splitLine: { show: false } }],
    series: [
      {
        name: title, 
        type: "pie",
        radius: ["45%", "72.55%"],
        center: ["50%", "50%"],
        avoidLabelOverlap: false,
        hoverOffset: 5,
        stillShowZeroSum: false,
        label: {
          normal: {
            show: false,
            position: "center",
            textStyle: { color: theme.palette.text.secondary, fontSize: 12, fontFamily: "roboto" },
            formatter: "{a}"
          },
          emphasis: {
            show: true,
            textStyle: { fontSize: "14", fontWeight: "normal" },
            formatter: "{b} \n{c} ({d}%)"
          }
        },
        labelLine: { normal: { show: false } },
        data: data,
        itemStyle: {
          emphasis: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: "rgba(0, 0, 0, 0.5)" }
        }
      }
    ]
  };

  return <ReactEcharts style={{ height: height}} option={{ ...option, color: [...color] }} />;
}
