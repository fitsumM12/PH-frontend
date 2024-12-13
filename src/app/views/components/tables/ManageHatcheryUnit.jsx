import { useState } from "react";
import { Box, Button, styled } from "@mui/material";
import RecordManageCard from "app/views/components/RecordManageCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDove } from "@fortawesome/free-solid-svg-icons";
import ViewHatcheryRecord from "./ViewHatcherRecord";
import ViewIncubationRecord from "./ViewIncubationRecord";
import ViewHatcherSummary from "./ViewHatcherSummary";
import {Grid } from "@mui/material";
// STYLED COMPONENTS
const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

export default function ManageHatcheryUnit() {
  const [view, setView] = useState("hatchery_record");
  const handleViewChange = (newView) => {
    setView(newView);
  };

  return (
    <Container>
      <RecordManageCard>
      <Box display="flex" alignItems="center" mb={3}>
      <FontAwesomeIcon
        icon={faDove}
        color="#ECAE1F"
        style={{ fontSize: "32px", marginRight: "16px" }}
      />
      <Grid container spacing={1}>
        
        <Grid item xs={8} sm={6} lg={2} >
          <Button
            fullWidth
            variant={view === "hatchery_record" ? "contained" : "outlined"}
            onClick={() => handleViewChange("hatchery_record")}
            sx={{
              backgroundColor:
                view === "hatchery_record" ? "#19B839" : "transparent",
              color: view === "hatchery_record" ? "#fff" : "#19B839",
              borderColor: "#19B839",
              "&:hover": {
                backgroundColor:
                  view === "hatchery_record" ? "#17a832" : "#19B839",
                color: "#fff",
              },
            }}
          >
            Manage Hatchery
          </Button>
        </Grid>
        <Grid item xs={4} sm={6} lg={2}>
          <Button
            fullWidth
            variant={view === "incubation" ? "contained" : "outlined"}
            onClick={() => handleViewChange("incubation")}
            sx={{
              backgroundColor:
                view === "incubation" ? "#19B839" : "transparent",
              color: view === "incubation" ? "#fff" : "#19B839",
              borderColor: "#19B839",
              "&:hover": {
                backgroundColor:
                  view === "incubation" ? "#17a832" : "#19B839",
                color: "#fff",
              },
            }}
          >
            Incubation
          </Button>
        </Grid>
        <Grid item xs={8} sm={6} lg={2}>
          <Button
            fullWidth
            variant={view === "hatchery_summary" ? "contained" : "outlined"}
            onClick={() => handleViewChange("hatchery_summary")}
            sx={{
              backgroundColor:
                view === "hatchery_summary" ? "#19B839" : "transparent",
              color: view === "hatchery_summary" ? "#fff" : "#19B839",
              borderColor: "#19B839",
              "&:hover": {
                backgroundColor:
                  view === "hatchery_summary" ? "#17a832" : "#19B839",
                color: "#fff",
              },
            }}
          >
            Hatchery Summary
          </Button>
        </Grid>
      </Grid>
    </Box>
        <Box width="100%" overflow="auto">
          {view === "hatchery_record" && <ViewHatcheryRecord />}
          {view === "incubation" && <ViewIncubationRecord />}
          {view === "hatchery_summary" && <ViewHatcherSummary />}
        </Box>
      </RecordManageCard>
    </Container>
  );
}
