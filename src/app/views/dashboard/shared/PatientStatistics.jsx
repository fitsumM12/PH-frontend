import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import ReactEcharts from 'echarts-for-react';
import styled from '@emotion/styled';
// STYLED COMPONENTS
const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "24px !important",
  background: theme.palette.background.paper,
  [theme.breakpoints.down("sm")]: { padding: "16px !important" },
}));

const ContentBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  "& small": { color: theme.palette.text.secondary },
  "& .icon": {
    opacity: 0.6,
    fontSize: "44px",
    color: theme.palette.primary.main,
  },
}));
const PatientStatistics = () => {
  const chartOptions = {
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    yAxis: {
      type: 'value',
      min: 0,
    },
    series: [
      {
        name: 'Male',
        type: 'bar',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 10, 15, 0, 0],
        itemStyle: { color: '#FFA726' }, // Male color
      },
      {
        name: 'Female',
        type: 'bar',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 5, 10, 0, 0],
        itemStyle: { color: '#2196F3' }, // Female color
      },
    ],
  };

  return (
    
    <StyledCard>
    <ContentBox>
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Patients By Gender
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
        <FormControl variant="outlined" size="small">
          <InputLabel>Type</InputLabel>
          <Select label="Type">
            <MenuItem value="Sinus Bradycardia">Sinus Bradycardia</MenuItem>
            {/* Add other options as needed */}
          </Select>
        </FormControl>
        <FormControl variant="outlined" size="small">
          <InputLabel>Year</InputLabel>
          <Select label="Year">
            <MenuItem value={2024}>2024</MenuItem>
            {/* Add other years as needed */}
          </Select>
        </FormControl>
      </Box>

      <ReactEcharts option={chartOptions} style={{ height: '400px', width: '100%' }} />

    </Box>
    </ContentBox>
    </StyledCard>
  );
};

export default PatientStatistics;
