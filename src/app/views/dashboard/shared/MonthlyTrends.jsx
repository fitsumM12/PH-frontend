import React, { useEffect, useState, useMemo } from "react";
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
import { Paper, Typography, Grid, Box, TextField } from "@mui/material";
import dayjs from "dayjs";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import {
  getMonthlyGroupEgg,
  getMonthlyGroupFeedIntakeRefusal,
  getMonthlyGroupBodyweight,
  getMonthlyIndividualEgg,
  getMonthlyIndividualFeedIntakeRefusal,
  getMonthlyIndividualBodyweight,
  getMonthlyIndividualVaccination,
  getMonthlyGroupDeath,
  getMonthlyGroupCulling,
  getMonthlyGroupReplacement,
  getMonthlyGroupVaccination,
  getMonthlyIndividualDeathCount, 

  
} from "app/apis/kpi_api";


const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const MonthlyTrends = () => {
  const [records, setRecords] = useState({
    groupEggs: [],
    groupFeedIntakes: { feed_intake: [], feed_refusal: [] },
    groupBodyweights: [],
    groupDeaths: [],
    groupCullings: [],
    groupReplacements: [],
    groupVaccinations: [],
    individualEggs: [],
    individualFeedIntakes: { feed_intake: [], feed_refusal: [] },
    individualBodyweights: [],
    individualVaccinations: [],
    

  });
  const [selectedYear, setSelectedYear] = useState(dayjs().year());
  const [selectedYearForGroup, setSelectedYearForGroup] = useState(
    dayjs().year()
  );
  const fetchData = async () => {
    try {
      const [
        groupEggs,
        groupFeedIntakes,
        groupBodyweights,
        groupDeaths,
        groupCullings,
        groupReplacements,
        groupVaccinations,
        individualEggs,
        individualFeedIntakes,
        individualBodyweights,
        individualVaccinations,
        individualDeathCounts, // Add this

      ] = await Promise.all([
        getMonthlyGroupEgg(),
        getMonthlyGroupFeedIntakeRefusal(),
        getMonthlyGroupBodyweight(),
        getMonthlyGroupDeath(),
        getMonthlyGroupCulling(),
        getMonthlyGroupReplacement(),
        getMonthlyGroupVaccination(),
        getMonthlyIndividualEgg(),
        getMonthlyIndividualFeedIntakeRefusal(),
        getMonthlyIndividualBodyweight(),
        getMonthlyIndividualVaccination(),
        getMonthlyIndividualDeathCount(),  

      ]);
      console.log("Individual Death Counts: ", individualDeathCounts);

      setRecords({
        groupEggs: Array.isArray(groupEggs) ? groupEggs : [],
        groupFeedIntakes: {
          feed_intake: Array.isArray(groupFeedIntakes.feed_intake) ? groupFeedIntakes.feed_intake : [],
          feed_refusal: Array.isArray(groupFeedIntakes.feed_refusal) ? groupFeedIntakes.feed_refusal : [],
        },
        groupBodyweights: Array.isArray(groupBodyweights) ? groupBodyweights : [],
        groupDeaths: Array.isArray(groupDeaths) ? groupDeaths : [],
        groupCullings: Array.isArray(groupCullings) ? groupCullings : [],
        groupReplacements: Array.isArray(groupReplacements) ? groupReplacements : [],
        groupVaccinations: Array.isArray(groupVaccinations) ? groupVaccinations : [],
        individualEggs: Array.isArray(individualEggs) ? individualEggs : [],
        individualVaccinations: Array.isArray(individualVaccinations) ? individualVaccinations : [],
        individualDeathCounts: Array.isArray(individualDeathCounts) ? individualDeathCounts : [],
        individualFeedIntakes: {
          feed_intake: Array.isArray(individualFeedIntakes.feed_intake) ? individualFeedIntakes.feed_intake : [],
          feed_refusal: Array.isArray(individualFeedIntakes.feed_refusal) ? individualFeedIntakes.feed_refusal : [],
        },
        individualBodyweights: Array.isArray(individualBodyweights) ? individualBodyweights : [],
        
      });

    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const handleYearChange = (newYear) => {
    setSelectedYear(newYear.year());
  };

  const handleYearChangeForGroup = (newYear) => {
    setSelectedYearForGroup(newYear.year());
  };
  const processIndividualChartData = useMemo(() => {
    const individualData = {};
  
    const accumulateRecords = (records, key) => {
      if (!Array.isArray(records)) {
        console.error(`Expected an array for ${key}, but got:`, records);
        return;
      }

      records.forEach((record) => {
        console.log("Processing Record:", record);
        const year = record.year;
        const month = record.month;
  
        if (year === selectedYear) {
          const monthStr = MONTHS[month - 1];
  
          if (!individualData[monthStr]) {
            individualData[monthStr] = {
              month: monthStr,
              total_egg_production: 0,
              vaccination_count: 0,
              death_count: 0, 
              total_feed_intake: 0,
              average_body_weight: 0,
              record_count: 0,
            };
          }
  
          individualData[monthStr].total_egg_production += record.total_egg_production || 0;
          individualData[monthStr].vaccination_count += record.total_vaccinations || 0; 
          individualData[monthStr].total_feed_intake += record.total_feed_intake || 0;
          individualData[monthStr].death_count += record.total_deaths || 0;  
          individualData[monthStr].average_body_weight += record.average_body_weight || 0;
          individualData[monthStr].record_count += 1;
        }
      });
    };
  
    accumulateRecords(records.individualEggs, "individualEggs");
    accumulateRecords(records.individualVaccinations, "individualVaccinations");
    accumulateRecords(records.individualFeedIntakes.feed_intake, "individualFeedIntakes");
    accumulateRecords(records.individualDeathCounts, "individualDeathCounts");  

    accumulateRecords(records.individualBodyweights, "individualBodyweights");
  
    for (const month in individualData) {
      if (individualData[month].record_count > 0) {
        individualData[month].average_body_weight /= individualData[month].record_count;
      }
    }
  
    return MONTHS.map((month) => ({
      month,
      total_egg_production: individualData[month]?.total_egg_production || 0,
      vaccination_count: individualData[month]?.vaccination_count || 0,
      death_count: individualData[month]?.death_count || 0,  
      total_feed_intake: individualData[month]?.total_feed_intake || 0,
      average_body_weight: individualData[month]?.average_body_weight || 0,
      record_count: individualData[month]?.record_count || 0,
    }));
  }, [records, selectedYear]);

  const processGroupChartData = useMemo(() => {
    const groupData = {};

    const accumulateRecords = (records, key) => {
      if (!Array.isArray(records)) {
        console.error(`Expected an array for ${key}, but got:`, records);
        return;
      }

      records.forEach((record) => {
        const year = record.year;
        const month = record.month;

        if (year === selectedYearForGroup) {
          const monthStr = MONTHS[month - 1];

          if (!groupData[monthStr]) {
            groupData[monthStr] = {
              month: monthStr,
              total_egg_production: 0,
              total_feed_intake: 0,
              total_body_weight: 0,
              total_deaths: 0,
              total_cullings: 0,
              vaccination_count: 0,
              total_replacements: 0,
              record_count: 0,
            };
          }

          groupData[monthStr].total_egg_production +=
            record.total_egg_production || 0;
          groupData[monthStr].total_feed_intake +=
            record.total_feed_intake || 0;
          groupData[monthStr].total_body_weight +=
            record.total_body_weight || 0;
          groupData[monthStr].total_deaths += record.total_deaths || 0;
          groupData[monthStr].vaccination_count +=
            record.vaccination_count || 0;
          groupData[monthStr].total_replacements +=
            record.total_replacements || 0;
          groupData[monthStr].total_cullings += record.total_cullings || 0;
          groupData[monthStr].record_count += 1;
        }
      });
    };

    accumulateRecords(records.groupEggs, "groupEggs");
    accumulateRecords(records.groupFeedIntakes.feed_intake, "groupFeedIntakes");
    accumulateRecords(records.groupBodyweights, "groupBodyweights");
    accumulateRecords(records.groupDeaths, "groupDeaths");
    accumulateRecords(records.groupCullings, "groupCullings");
    accumulateRecords(records.groupVaccinations, "groupVaccinations");
    accumulateRecords(records.groupReplacements, "groupReplacements");

    return MONTHS.map((month) => ({
      month,
      total_egg_production: groupData[month]?.total_egg_production || 0,
      total_feed_intake: groupData[month]?.total_feed_intake || 0,
      total_body_weight: groupData[month]?.total_body_weight || 0,
      total_deaths: groupData[month]?.total_deaths || 0,
      total_cullings: groupData[month]?.total_cullings || 0,
      vaccination_count: groupData[month]?.vaccination_count || 0,
      total_replacements: groupData[month]?.total_replacements || 0,
      record_count: groupData[month]?.record_count || 0,
    }));
  }, [records, selectedYearForGroup]);

  return (
    <Paper
      elevation={3}
      style={{
        padding: 20,
        borderRadius: 10,
        border: "1px solid rgba(95, 96, 164, 0.5)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Grid container spacing={3} alignItems="center" >
        <Grid item lg={1} md={1} sm={0} xs={0}></Grid>
        <Grid item lg={3} md={3} sm={4} xs={4}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Select Year"
              views={["year"]}
              value={dayjs().year(selectedYear)}
              onChange={handleYearChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item lg={8} md={8} sm={8} xs={8}>
          <Box display="flex" alignItems="center">
            <QueryStatsIcon fontSize="medium" />
            &nbsp;&nbsp;
            <Typography
              variant="h6"
              sx={{ textAlign: "left", fontWeight: "bold", color: "#181b62" }}
            >
              Experimental Chicken
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <Typography variant="h6" gutterBottom></Typography>
      <ResponsiveContainer width="100%" height={200}  >
        <LineChart data={processIndividualChartData} >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="total_egg_production"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="vaccination_count"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
   
          <Line type="monotone" dataKey="total_feed_intake" stroke="#82ca9d" />
          <Line
            type="monotone"
            dataKey="average_body_weight"
            stroke="#ff7300"
          />
          <Line
    type="monotone"
    dataKey="death_count"
    stroke="#ff0000"
    activeDot={{ r: 8 }}
/>

        </LineChart>
      </ResponsiveContainer>
      <hr />
      <br />
      <Grid container spacing={3}>
        <Grid item lg={1} md={1} sm={0} xs={0}></Grid>
        <Grid item lg={3} md={3} sm={4} xs={4}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Select Year"
              views={["year"]}
              value={dayjs().year(selectedYearForGroup)}
              onChange={handleYearChangeForGroup}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item lg={8} md={8} sm={8} xs={8}>
          <Box display="flex" alignItems="center">
            <QueryStatsIcon fontSize="medium" />
            &nbsp;&nbsp;
            <Typography
              variant="h6"
              sx={{ textAlign: "left", fontWeight: "bold", color: "#181b62" }}
            >
              Group Chicken
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={processGroupChartData} lg={6}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="total_egg_production"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line type="monotone" dataKey="total_feed_intake" stroke="#82ca9d" />
          <Line type="monotone" dataKey="total_body_weight" stroke="#ff7300" />
          <Line type="monotone" dataKey="total_deaths" stroke="#7d0b0b" />
          <Line type="monotone" dataKey="total_cullings" stroke="#21801d" />
          <Line type="monotone" dataKey="total_replacements" stroke="#000" />
          <Line type="monotone" dataKey="vaccination_count" stroke="#1d7180" />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default MonthlyTrends;


