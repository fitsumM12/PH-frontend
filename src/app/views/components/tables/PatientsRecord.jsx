import React, { useState, useEffect } from "react";
import Tooltip from "@mui/material/Tooltip";
import VisibilityIcon from "@mui/icons-material/Visibility";
// import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBack from "@mui/icons-material/ArrowBack";
import Fade from '@mui/material/Fade';

import {
  Box,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  IconButton,
  TablePagination,
  Typography,
  Accordion,
  AccordionSummary,
} from "@mui/material";
import { Grid } from "@material-ui/core";
import { Stack, styled } from "@mui/system";
import PatientsRecordCard from "../PatientsRecordCard";
import { fetchPatientForDoctor, fetchPatient } from "app/apis/patients_api";
import useAppContext from "app/hooks/useAppContext";
import useAuth from "app/hooks/useAuth";
import PatientProfile from "./PatientProfile";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" }
  }
}));
const StyledTable = styled(Table)(() => ({
  whiteSpace: "pre",
  "& thead": {
    "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } },
  },
  "& tbody": {
    "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } },
  },
}));

const PatientsRecord = () => {

  const [expanded, setExpanded] = React.useState(false);

  const handleExpansion = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };
  const [page, setPage] = useState(0);
  const { state } = useAppContext();
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [patients, setPatients] = useState([]);
  const [patient, setPatient] = useState(null);
  const [viewPatient, setViewPatient] = useState(false);
  const doctor = useAuth();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const patientData = await fetchPatientForDoctor(doctor.user.health_institution.id);
        setPatients(patientData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchPatients();
  }, []);

  const handlePatientView = async (userId) => {
    try {
      const data = await fetchPatient(userId);
      setPatient(data);
      setViewPatient(true);
    } catch (e) {
      console.error("Error fetching patient", e);
    }
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const Severity = {
    0: "NO DR",
    1: "NPDR",
    2: "PLDR",
  };


  const largestIndex = (predictions) => {
    if (!predictions || predictions.length === 0 || predictions[0].length === 0) {
      return -1;
    }

    let largestIndex = 0;

    for (let i = 1; i < predictions[0].length; i++) {
      if (predictions[0][i] > predictions[0][largestIndex]) {
        largestIndex = i;
      }
    }

    return largestIndex;
  };


  const handleBack = () => {
    setViewPatient(false);
  };

  const [searchQuery, setSearchQuery] = useState('');
  const filteredpatient = patients.filter((patient) =>
    String(patient.first_name + patient.last_name).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container>
      <Stack spacing={3}>
        <PatientsRecordCard title="Patients Record">
          {!viewPatient ? (
            <Box width="100%" overflow="auto">
              <StyledTable>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">

                      <ValidatorForm>
                        <TextValidator
                          label="Patient Name"
                          onChange={(e) => setSearchQuery(e.target.value)}
                          name="id"
                          value={searchQuery}
                          validators={['required']}
                          errorMessages={['this field is required']}
                        />
                      </ValidatorForm>
                    </TableCell>
                    <TableCell align="center">Mobile</TableCell>
                    <TableCell align="center">Gender</TableCell>
                    <TableCell align="center">Registered</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredpatient
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((patient, index) => (
                      <TableRow key={index}>
                        <TableCell align="left">
                          {patient.first_name + " " + patient.last_name}
                        </TableCell>
                        <TableCell align="center">{patient.mobile}</TableCell>
                        <TableCell align="center">
                          {patient.gender}
                        </TableCell><TableCell align="center">
                          {patient.record_date}
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="View">
                            <IconButton
                              onClick={() => handlePatientView(patient.id)}
                              sx={{ "&:hover": { bgcolor: "grey.200" } }}
                            >
                              <VisibilityIcon sx={{ color: "#fa931d" }} />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </StyledTable>

              <TablePagination
                sx={{ px: 2 }}
                page={page}
                component="div"
                rowsPerPage={rowsPerPage}
                count={filteredpatient.length}
                onPageChange={handleChangePage}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={handleChangeRowsPerPage}
                nextIconButtonProps={{ "aria-label": "Next Page" }}
                backIconButtonProps={{ "aria-label": "Previous Page" }}
              />
            </Box>

          ) : (
            <>
              <Accordion
                expanded={expanded}
                onChange={handleExpansion}
                slots={{ transition: Fade }}
                slotProps={{ transition: { timeout: 400 } }}
                sx={[
                  expanded
                    ? {
                      '& .MuiAccordion-region': {
                        height: 'auto',
                      },
                      '& .MuiAccordionDetails-root': {
                        display: 'block',
                      },
                    }
                    : {
                      '& .MuiAccordion-region': {
                        height: 0,
                      },
                      '& .MuiAccordionDetails-root': {
                        display: 'none',
                      },
                    },
                ]}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <Tooltip title="Back">
                      <IconButton
                        onClick={handleBack}
                        sx={{ "&:hover": { bgcolor: "grey.200", color: "#7c80f1" } }}
                      >
                        <ArrowBack sx={{ color: "#fa931d" }} />
                      </IconButton>
                    </Tooltip>
                    <Typography variant="h8" sx={{fontStyle:"bold"}}>
                      {`${patient.first_name} ${patient.last_name}`.toUpperCase()}
                    </Typography>

                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ p: 2, border: '1px dashed blue', borderRadius: '5px', marginBottom: 2, boxShadow: 5 }}>
                    <Grid container spacing={2} justifyContent="flex" >
                      <Grid item xs={12} sm={6} md={6} lg={6}>

                        <Typography variant="subtitle1" align="left" gutterBottom>
                          {`${patient.gender}, ${patient.birthdate}`}
                        </Typography>
                        <Typography variant="subtitle1" align="left" gutterBottom>
                          {`Email: ${patient.email}`}
                        </Typography>
                        <Typography variant="subtitle1" align="left" gutterBottom>
                          {`Mobile: ${patient.mobile}`}
                        </Typography>
                        <Typography variant="subtitle1" align="left" gutterBottom>
                          {`Job: ${patient.job}`}
                        </Typography>
                      </Grid><Grid item xs={12} sm={6} md={6} lg={6}>

                        <Typography variant="subtitle1" align="left" gutterBottom>
                          {`Region: ${patient.region}`}
                        </Typography>
                        <Typography variant="subtitle1" align="left" gutterBottom>
                          {`Zone: ${patient.zone}`}
                        </Typography>
                        <Typography variant="subtitle1" align="left" gutterBottom>
                          {`Kebele: ${patient.kebele}`}
                        </Typography>
                        <Typography variant="subtitle1" align="left" gutterBottom>
                          {`Registered Date: ${patient.record_date}`}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </AccordionDetails>
              </Accordion>
              {patient && <PatientProfile data={patient} />}
            </>

          )}
        </PatientsRecordCard>
      </Stack>
    </Container>
  );
};

export default PatientsRecord;

