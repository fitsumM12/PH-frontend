// import { Card, Grid, useTheme } from "@mui/material";
// import DoughnutChart from "./Doughnut";
// import useAuth from "app/hooks/useAuth";
// import { useEffect } from "react";
// import { fetchPatientForDoctor } from "app/apis/patients_api";
// import { useState } from "react";

// export const DoctorDoughnut = () => {
//   const { palette } = useTheme();
//   const [patients, setPatients] = useState([]);
//   const doctor = useAuth();

//   const fetchPatients = async (id) => {
//     try {
//       const patientData = await fetchPatientForDoctor(id);
//       setPatients(patientData);
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     }
//   };
//   useEffect(() => {
//     fetchPatients(doctor.user.id);
//   }, [doctor.user.id]);

//   const Severity = {
//     0: "NO DR",
//     1: "NPDR",
//     2: "PLDR",
//   };

//   const genderDistribution = patients.reduce((acc, person) => {
//     acc[person.gender] = (acc[person.gender] || 0) + 1;
//     return acc;
//   }, {});

//   const resultDistribution = patients.reduce((acc, person) => {
//     const result =
//       Severity[person.prediction.indexOf(Math.max(...person.prediction))];
//     acc[result] = (acc[result] || 0) + 1;
//     return acc;
//   }, {});

//   return (
//     <>
//       <Grid container spacing={3}>
//         <Grid item lg={6} md={6} sm={12} xs={12}>
//           <Card sx={{ px: 3, py: 2, mb: 3, textAlign: "center" }}>
//             <DoughnutChart
//               title="Patient Gender Distributions"
//               record={genderDistribution}
//               height="300px"
//               color={[
//                 palette.primary.dark,
//                 palette.primary.main,
//                 palette.primary.light,
//               ]}
//             />
//           </Card>
//         </Grid>
//         <Grid item lg={6} md={6} sm={12} xs={12}>
//           <Card sx={{ px: 3, py: 2, mb: 3, textAlign: "center" }}>
//             <DoughnutChart
//               title="Patients Summary"
//               record={resultDistribution}
//               height="300px"
//               color={[
//                 palette.primary.dark,
//                 palette.primary.main,
//                 palette.primary.light,
//               ]}
//             />
//           </Card>
//         </Grid>
//       </Grid>
//     </>
//   );
// };
