import React, { useState, useEffect, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Grid, Box, Paper, Typography, TextField } from "@mui/material";
import dayjs from "dayjs";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { monthlyPatientCount } from "app/apis/patients_api";


const MonthlyTrend = () => {
  const [selectedYear, setSelectedYear] = useState(dayjs().year());
  const [monthlyPatient, setMonthlyPatient] = useState([]);

  useEffect(() => {
    const fetchMonthlyData = async (year) => {
      try {
        const patientData = await monthlyPatientCount(year);
        setMonthlyPatient(patientData);
      } catch (error) {
        console.error("Error fetching patient trends", error);
      }
    };

    fetchMonthlyData(selectedYear);
  }, [selectedYear]);

  const chartData = useMemo(() => {
    return monthlyPatient.map((patient) => ({
      month: patient.month,
      total_count: patient.total_count,
      male_count: patient.male_count,
      female_count: patient.female_count,
    }));
  }, [monthlyPatient]);

  const handleYearChange = (newYear) => {
    setSelectedYear(newYear.year());
  };
  console.log(monthlyPatient)

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper
          elevation={3}
          style={{
            padding: 20,
            borderRadius: 10,
            border: "1px solid rgba(95, 96, 164, 0.5)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={4} md={3} sm={4} lg={3}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Select Year"
                  views={["year"]}
                  value={dayjs().year(selectedYear)}
                  onChange={handleYearChange}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={8} md={9} sm={8} lg={9}>
              <Box display="flex" alignItems="center">
                <QueryStatsIcon fontSize="medium" style={{ marginRight: 8 }} />
                <Typography
                  variant="h6"
                  style={{ textAlign: "left", fontWeight: "bold", color: "#181b62" }}
                >
                  Monthly Statistics
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  interval={0}
                  tick={{ fontSize: 12, angle: 0, textAnchor: "middle" }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="total_count"
                  stroke="#43A047"
                  strokeWidth={2}
                  name="Total Patients"
                />
                <Line
                  type="monotone"
                  dataKey="male_count"
                  stroke="#1E88E5"
                  strokeWidth={2}
                  name="Male Patients"
                />
                <Line
                  type="monotone"
                  dataKey="female_count"
                  stroke="#FB8C00"
                  strokeWidth={2}
                  name="Female Patients"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <Typography
              variant="body1"
              color="textSecondary"
              align="center"
              style={{ marginTop: 20 }}
            >
              No data available for {selectedYear}
            </Typography>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default MonthlyTrend;
