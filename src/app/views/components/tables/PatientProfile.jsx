import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";

import AddCircleIcon from '@mui/icons-material/AddCircle';
import { fetchPatientById } from "app/apis/patients_api";
import {
  Box,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  Dialog,
  DialogContent,
  IconButton,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import PatientForm from "../forms/PatientForm";

import { useNavigate } from 'react-router-dom';
import useAppContext, { AppContext } from "app/hooks/useAppContext";
import { getUser } from "app/apis/users_api";

const StyledTable = styled(Table)(() => ({
  whiteSpace: "pre",
  "& thead": {
    "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } },
  },
  "& tbody": {
    "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } },
  },
}));

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: "100%",
    margin: "auto",
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  image: {
    width: "100%",
    height: "auto",
    maxHeight: "200px",
  },
}));

const ZoomImage = ({ imageUrl, onClose }) => {
  console.log("Image Url:", imageUrl)
  return (
    <Dialog open={Boolean(imageUrl)} onClose={onClose} maxWidth="lg">
      <DialogContent>
        <IconButton
          edge="start"
          color="inherit"
          onClick={onClose}
          aria-label="close"
          style={{ position: "absolute", right: 16, top: 16 }}
        >
          <CloseIcon />
        </IconButton>
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Enlarged"
            style={{ width: "100%", height: "auto" }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

// MAIN COMPONENT
const PatientProfile = ({ data }) => {
  const { state, dispatch } = useAppContext()
  const navigate = useNavigate();
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [patients, setPatients] = useState([]);
  const [zoomedImageUrl, setZoomedImageUrl] = useState(null);
  const [doctorDetails, setDoctorDetails] = useState({});

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const patientData = await fetchPatientById(data.id);
        setPatients(patientData);

        const uniqueDoctorIds = [...new Set(patientData.map(patient => patient.doctor_id))];
        const doctorPromises = uniqueDoctorIds.map(doctorId => getUser(doctorId));

        const doctors = await Promise.all(doctorPromises);
        const doctorDetailsMap = {};
        uniqueDoctorIds.forEach((doctorId, index) => {
          doctorDetailsMap[doctorId] = doctors[index];
        });
        setDoctorDetails(doctorDetailsMap);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, [data]);
  useEffect(() => {
    console.log("Updated doctor details:", doctorDetails);
  }, [doctorDetails]);

  const [searchQuery, setSearchQuery] = useState('');
  const filteredPatient = patients.filter((patient) =>
    String(patient.record_date).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleNewScreening = (id) => {
    dispatch({ type: 'START_NEW_SCREENING', payload: id });
    navigate('/newcase/')
  };
  // MEDIA BASE URL
  const mediaBaseUrl = 'http://localhost:8000/media/raw/';

  return (
    <>
      <CardContent>
        <Box width="100%" overflow="auto">
          <StyledTable>
            <TableHead>
              <TableRow>
                <TableCell align="center">
                  <ValidatorForm>
                    <TextValidator
                      label="Date"
                      onChange={(e) => setSearchQuery(e.target.value)}
                      name="id"
                      value={searchQuery}
                      validators={['required']}
                      errorMessages={['this field is required']}
                    />
                  </ValidatorForm>
                </TableCell>
                <TableCell align="center" colSpan={2}>Right Eye

                  <IconButton
                    onClick={() => handleNewScreening(patients[0].patient_id)}
                    sx={{ align: "right", "&:hover": { bgcolor: "grey.200" } }}
                  >
                    <AddCircleIcon sx={{ color: "#fa931d" }} />
                  </IconButton>
                </TableCell>
                <TableCell align="center" colSpan={2}>Left Eye
                  <IconButton
                    onClick={() => handleNewScreening(patients[0].patient_id)}
                    sx={{ align: "right", "&:hover": { bgcolor: "grey.200" } }}
                  >
                    <AddCircleIcon sx={{ color: "#fa931d" }} />
                  </IconButton>
                </TableCell>
                <TableCell align="center" >Doctor</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPatient
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((patient, index) => (
                  <TableRow key={index}>
                    <TableCell align="left">
                      {patient.record_date}
                    </TableCell>
                    <TableCell align="center">
                      {patient.right_eye_prediction}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Right Eye">
                        <span
                          style={{ cursor: "pointer", color: patient.right_eye_image_url ? "#181b62" : "gray" }}
                          onClick={() => {
                            if (patient.right_eye_image_url) {
                              const rightEyeImageName = patient.right_eye_image_url.split('\\').pop();
                              setZoomedImageUrl(`${mediaBaseUrl}${rightEyeImageName}`);
                            }
                          }}
                        >
                          <VisibilityIcon sx={{ color: patient.right_eye_image_url ? "#181b62" : "gray" }} />
                        </span>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center">{patient.left_eye_prediction}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Left Eye">
                        <span
                          style={{ cursor: "pointer", color: patient.left_eye_image_url ? "#181b62" : "gray" }}
                          onClick={() => {
                            if (patient.left_eye_image_url) {
                              const leftEyeImageName = patient.left_eye_image_url.split('\\').pop();
                              setZoomedImageUrl(`${mediaBaseUrl}${leftEyeImageName}`);
                            }
                          }}
                        >
                          <VisibilityIcon sx={{ color: patient.left_eye_image_url ? "#181b62" : "gray" }} />
                        </span>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center">
                      {doctorDetails[patient.doctor_id] ? (
                        <>
                          {doctorDetails[patient.doctor_id].first_name} {doctorDetails[patient.doctor_id].last_name}
                        </>
                      ) : (
                        <p>Loading doctor details...</p>
                      )}
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
            count={filteredPatient.length}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={handleChangeRowsPerPage}
            nextIconButtonProps={{ "aria-label": "Next Page" }}
            backIconButtonProps={{ "aria-label": "Previous Page" }}
          />
        </Box>
      </CardContent>
      <ZoomImage imageUrl={zoomedImageUrl} onClose={() => setZoomedImageUrl(null)} />
    </>
  );
};

export default PatientProfile;
