import { Fragment } from "react";
import { Grid, styled } from "@mui/material";
import {StatCards} from "./shared/StatCards";
import MonthlyTrends from "./shared/MonthlyTrends";

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
          <Grid item lg={8} md={8} sm={12} xs={12}>
            <MonthlyTrends/>
          </Grid>
          <Grid item lg={4} md={4} sm={12} xs={12}>
            <StatCards />
            {/* <DoctorDoughnut /> */}
          </Grid>
        </Grid>
      </ContentBox>
    </Fragment>
  );
}
