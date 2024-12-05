import { Card, Grid, useTheme } from "@mui/material";
import DoughnutChart from "./Doughnut";
import { useEffect } from "react";
import { genderCount, getPatientsCount, newandreturning } from "app/apis/patients_api";
import { useState } from "react";

export const DoctorDoughnut = () => {
  const [newPatient, setNewPatient] = useState(0);
  const [returningPatient, setReturningPatient] = useState(0);
  const [normalCount, setNormalCount] = useState(0);
  const [abnormalCount, setAbnormalCount] = useState(0);
  const [maleCount, setMaleCount] = useState(0)
  const [femaleCount, setFemaleCount] = useState(0)

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const patientData = await newandreturning();
        setNewPatient(patientData.new_patients)
        setReturningPatient(patientData.returning_patients)
        console.log(patientData)
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };
    fetchPatients()
  }, [])


  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await getPatientsCount();
        setNormalCount(response.normal_patients_count)
        setAbnormalCount(response.abnormal_patients_count)
      }
      catch (error) {
        console.log(error)
      }
    }
    fetchCount()
  }, []);

  useEffect(() => {
    const fetchGender = async () => {
      try {
        const response = await genderCount();
        setMaleCount(response.male_count);
        setFemaleCount(response.female_count);
      }
      catch (error) {
        console.log(error)
      }
    }
    fetchGender()
  }, [])

  const resultDistribution = {
    Normal: normalCount,
    Abnormal: abnormalCount,
  };

  const patientDistribution = {
    New: newPatient,
    Returning: returningPatient
  }

  const genderDistribution = {
    Male: maleCount,
    Female: femaleCount,
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item lg={4} md={4} sm={6} xs={12}>
          <Card sx={{
            px: 2, py: 2, mb: 2, textAlign: "center",
            border: '1px solid rgba(95, 96, 164, 0.5)',
          }}>
            <DoughnutChart
              title="Patients Summary"
              record={patientDistribution}
              height="230px"
              color={[
                '#fa931d',
                '#181b62',
              ]}
            />
          </Card>
        </Grid>
        <Grid item lg={4} md={4} sm={6} xs={12}>
          <Card sx={{
            px: 2, py: 2, mb: 2, textAlign: "center",
            border: '1px solid rgba(95, 96, 164, 0.5)',
          }}>
            <DoughnutChart
              title="Gender Distributions"
              record={genderDistribution}
              height="230px"

              color={[
                '#fa931d',
                '#181b62',
              ]}
            />
          </Card>
        </Grid>
        <Grid item lg={4} md={4} sm={6} xs={12}>
          <Card sx={{
            px: 2, py: 2, mb: 2, textAlign: "center",
            border: '1px solid rgba(95, 96, 164, 0.5)',
          }}>
            <DoughnutChart
              title="Result Summary"
              record={resultDistribution}
              height="230px"
              color={[
                '#fa931d',
                '#181b62',
              ]}
            />
          </Card>
        </Grid>
      </Grid>
    </>
  );
};
