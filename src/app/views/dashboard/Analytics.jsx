import { Fragment } from "react";
import { Grid, styled } from "@mui/material";
import StatCards from "./shared/StatCards";
import { DoctorDoughnut } from "./shared/DoughnutDoctor";
import MonthlyTrend from "./shared/MonthlyTrend";

// STYLED COMPONENTS
const ContentBox = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
}));



export default function Analytics() {

  return (
    <Fragment>
      <ContentBox className="analytics">
        <Grid container spacing={2}>
          <Grid item lg={5} md={5} sm={12} xs={12}>
            <MonthlyTrend />
          </Grid>
          <Grid item lg={7} md={7} sm={12} xs={12}>
            <StatCards />
            <DoctorDoughnut />
          </Grid>
        </Grid>
      </ContentBox>
    </Fragment>
  );
}
