import FlipIcon from '@mui/icons-material/Flip';
import {
  FormControlLabel,

  FormHelperText,

  FormLabel,

  IconButton,

  Radio,
  RadioGroup,
  Tooltip,

} from "@mui/material";

import React, { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Grid,
  styled,
  CircularProgress, Box,
  Stack,
} from "@mui/material";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { Span } from "app/components/Typography";
import { useDropzone } from "react-dropzone";
import { predictImage, submitFormData, submitImageAndPrediction } from "app/apis/patients_api";
import { SimpleCard } from "app/components";
import useAuth from "app/hooks/useAuth";
import { PredictionResult, AbnormalityDetection } from "./PredictionResult";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { updatePatientInAPI } from "app/apis/patients_api";
import { Typography } from "@mui/material";
import { use } from "echarts";
import useAppContext from "app/hooks/useAppContext";
import PhysicianDecisionDialog from "./PhysicianDecisionDialog";
// import {AddCircleIcon } from "@material-ui/icons";
import { AddCircleOutline } from "@mui/icons-material";
const TextField = styled(TextValidator)(() => ({
  width: "100%",
  marginBottom: "16px",
}));

const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));
const dropzoneStyle = {
  border: "2px dashed #4a90e2",
  borderRadius: "4px",
  padding: "5px",
  textAlign: "center",
  cursor: "pointer",
  marginBottom: "10px",
  height: "50px",
  backgroundColor: "#f0f8ff",
}

const diagnosisLabels = {
  0: "Normal",
  1: "Non Proliferative DR",
  2: "Proliferative DR"
};
const getLargestIndex = (predictionArray) => {
  return predictionArray.indexOf(Math.max(...predictionArray));
};

const isPredictionValid = (predictionArray) => {
  return Array.isArray(predictionArray) && predictionArray.length > 0;
};


function PatientForm() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [eyeSide, setEyeSide] = useState("left");
  const [leftEyePreview, setLeftEyePreview] = useState(null);
  const [rightEyePreview, setRightEyePreview] = useState(null);
  const [showImageSection, setShowImageSection] = useState(false);
  const [genderError, setGenderError] = useState(false);
  const [res, setRes] = useState({})
  const [predictions, setPredictions] = useState({
    left_eye: null,
    right_eye: null,
  });
  const { user } = useAuth()
  const { state, dispatch } = useAppContext()

  const initialFormData = {
    first_name: "",
    last_name: "",
    birthdate: "1990-12-12",
    gender: "",
    job: "job",
    email: "custom@gmail.com",
    mobile: "0974000000",
    region: "region",
    zone: "zone",
    kebele: "kebele",
    doctor_id: user.id,
    health_institution: user.health_institution.id
  };
  const initialPredictionForm = {
    left_eye_image_url: "",
    right_eye_image_url: "",
    left_eye_prediction: [],
    right_eye_prediction: [],
    patient_id: state.new_screening ? state.currentPatientId : null,
    doctor_id: user.id
  };


  useEffect(() => {
    if (state.new_screening) {
      setShowImageSection(true);
    }
    return () => {
      if (state.new_screening) {
        dispatch({ type: 'STOP_NEW_SCREENING' });
      }
    };
  }, [state.new_screening, dispatch]);
 
  const handleOpenDialog = () => {
    setDialogOpen(true)
  }
  const handleCloseDialog = () => {
    setDialogOpen(false)
  }

  const [formData, setFormData] = useState(initialFormData);
  const [predictionForm, setPredictionForm] = useState(initialPredictionForm);


  const onDrop = (acceptedFiles) => {
    const imageFiles = acceptedFiles.filter((file) =>
      file.type.startsWith("image/")
    );
    if (imageFiles.length > 0) {
      const firstImageFile = imageFiles[0];
      if (eyeSide === "left") {
        setLeftEyePreview(firstImageFile);
      } else {
        setRightEyePreview(firstImageFile);
      }
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    setEyeSide(event.target.value);
  };

  const handleEyeChange = (event) => {
    setEyeSide(event.target.value);
  };
  
  const predictImageForEye = async (imageFile) => {
    try {
      setIsLoading(true);
      const formData1 = new FormData();
      formData1.append("image", imageFile);
      const prediction = await predictImage(formData1);
      setIsLoading(false);
      // console.log(prediction);
      return prediction;
    } catch (error) {
      console.error("Error predicting image:", error);
      return null;
    }
  };


 
  const handleDiagnose = async () => {
    if (!leftEyePreview && !rightEyePreview) {
      window.alert("Please provide either a left or right eye image for diagnosis.");
      return; 
    }
  
    setIsLoading(true);
    let predictionsResult = {
      left_eye: null,
      right_eye: null,
    };
    let response = null;
  
    const handlePrediction = async (eye, preview) => {
      const prediction = await predictImageForEye(preview);

      if (prediction) {
        setPredictions((prev) => ({
          ...prev,
          [eye]: prediction,
        }));
        predictionsResult[eye] = prediction;
      }
    };
  
    try {
      const predictionPromises = [];
      if (leftEyePreview) {
        predictionPromises.push(handlePrediction('left_eye', leftEyePreview));
      }
      if (rightEyePreview) {
        predictionPromises.push(handlePrediction('right_eye', rightEyePreview));
      }
      await Promise.all(predictionPromises);
  
      const updatedFormData = {
        ...formData,
        left_eye_prediction: predictionsResult.left_eye ? predictionsResult.left_eye.predictions : [],
        right_eye_prediction: predictionsResult.right_eye ? predictionsResult.right_eye.predictions : [],
        left_eye_image_url: predictionsResult.left_eye ? predictionsResult.left_eye.image_url : formData.left_eye_image_url,
        right_eye_image_url: predictionsResult.right_eye ? predictionsResult.right_eye.image_url : formData.right_eye_image_url,
      };
      console.log(updatedFormData)
      const leftEyePrediction = updatedFormData.left_eye_prediction[0];
      const rightEyePrediction = updatedFormData.right_eye_prediction[0];
      let leftEyeDiagnosis = "Prediction data is missing";
      let rightEyeDiagnosis = "Prediction data is missing";
  
      if (isPredictionValid(leftEyePrediction)) {
        const leftEyeIndex = getLargestIndex(leftEyePrediction);
        leftEyeDiagnosis = diagnosisLabels[leftEyeIndex];
      }
  
      if (isPredictionValid(rightEyePrediction)) {
        const rightEyeIndex = getLargestIndex(rightEyePrediction);
        rightEyeDiagnosis = diagnosisLabels[rightEyeIndex];
      }
  
      const updatedPredictionData = {
        ...predictionForm,
        left_eye_prediction: leftEyeDiagnosis,
        right_eye_prediction: rightEyeDiagnosis,
        left_eye_image_url: updatedFormData.left_eye_image_url,
        right_eye_image_url: updatedFormData.right_eye_image_url,
      };
  
      response = await submitImageAndPrediction(updatedPredictionData);
      setRes(response);
  
    } catch (error) {
      console.error("Error during diagnosis or updating patient data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  


  const handleShowImageSection = async () => {
    if (!formData.gender) {
      setGenderError(true); 
      return;
    }
    
    try {
      const response = await submitFormData(formData);
      const patientId = response.id;
  
      setFormData((prev) => ({
        ...prev,
        id: patientId,
      }));
      setPredictionForm((prev) => ({
        ...prev,
        patient_id: patientId
      }));
      setShowImageSection(true);
    } catch (error) {
      console.error("Error saving patient data:", error);
    }
  };
  
  return (
    <Container>
      <Stack spacing={3}>
        <SimpleCard title="Patient Details">
          {!showImageSection ? (
            <ValidatorForm onSubmit={handleShowImageSection}>
              <Grid container spacing={6}>
                <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                  <TextField
                    type="text"
                    name="first_name"
                    label="First Name"
                    onChange={handleChange}
                    value={formData.first_name}
                    validators={["required"]}
                    errorMessages={["this field is required"]}
                  />
                  <TextField
                    type="text"
                    name="last_name"
                    label="Last Name"
                    onChange={handleChange}
                    value={formData.last_name}
                    validators={["required"]}
                    errorMessages={["this field is required"]}
                  />
                  <TextField
                    type="text"
                    name="mobile"
                    label="Mobile Number"
                    value={formData.mobile}
                    onChange={handleChange}
                    validators={["required"]}
                    errorMessages={["this field is required"]}
                  />
                  <TextField
                    type="email"
                    name="email"
                    label="Email"
                    value={formData.email}
                    onChange={handleChange}
                    validators={["required"]}
                    errorMessages={["this field is required"]}
                  />

                  <TextField
                    type="text"
                    name="job"
                    label="Job"
                    onChange={handleChange}
                    value={formData.job}
                    validators={["required"]}
                  />
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>

                  <TextField
                    type="date"
                    name="birthdate"
                    label="Date of Birth"
                    onChange={handleChange}
                    value={formData.birthdate}
                    defaultValue="1990-12-12"
                    validators={["required"]}
                    errorMessages={["this field is required"]}
                  />

                  <FormLabel component="legend">Gender</FormLabel>
                  <RadioGroup
                    row
                    name="gender"
                    label="Gender"
                    sx={{ mb: 2 }}
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value="Male"
                      label="Male"
                      labelPlacement="end"
                      control={<Radio color="secondary" />}
                    />
                    <FormControlLabel
                      value="Female"
                      label="Female"
                      labelPlacement="end"
                      control={<Radio color="secondary" />}
                    />
                    <FormControlLabel
                      value="Others"
                      label="Others"
                      labelPlacement="end"
                      control={<Radio color="secondary" />}
                    />
                  </RadioGroup>
                  {genderError && (
                  <FormHelperText error sx={{ mb: 2 }}>
                    Please select a gender
                  </FormHelperText>
                )}
                  <TextField
                    type="text"
                    name="region"
                    label="Region"
                    onChange={handleChange}
                    value={formData.region}
                    validators={["required"]}
                  />
                  <TextField
                    type="text"
                    name="zone"
                    label="Zone"
                    onChange={handleChange}
                    value={formData.zone}
                    validators={["required"]}
                  />
                  <TextField
                    type="text"
                    name="kebele"
                    label="Kebele"
                    onChange={handleChange}
                    value={formData.kebele}
                    validators={["required"]}
                  />
                </Grid>
              </Grid>

              <Button
                sx={{
                  bgcolor: '#181b62',
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: '#fa931d',
                  },
                }}
                variant="contained"
                type="submit"
              >
                <Span sx={{ pl: 1, textTransform: 'capitalize' }}>
                  Save and Continue
                </Span>
              </Button>

            </ValidatorForm>
          ) : (
            <>
              <Grid container spacing={2}>
                <Grid item lg={8} md={8} sm={10} xs={12} sx={{ mt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item lg={2} md={2} sm={4} xs={12} sx={{ mt: 2 }}>
                      <FormControl fullWidth>
                        <InputLabel id="eye-select-label">Select Eye</InputLabel>
                        <Select
                          labelId="eye-select-label"
                          value={eyeSide}
                          onChange={handleEyeChange}
                          label="Select Eye"
                        >
                          <MenuItem value="left">Left</MenuItem>
                          <MenuItem value="right">Right</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item lg={10} md={10} sm={8} xs={12} sx={{ mt: 2 }}>
                      <div {...getRootProps()} style={dropzoneStyle}>
                        <input {...getInputProps()} />
                        <p>Drag 'n' drop an image here, or click to select one</p>
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
                {/* Eye Selection Dropdown */}
                <Grid item lg={4} md={4} sm={2} xs={12} sx={{ mt: 2 }}>
                  <br />
                  {/* Predict Button */}
                  <Button
                    variant="contained"
                    onClick={handleDiagnose}
                    disabled={isLoading}
                    sx={{
                      bgcolor: '#181b62',
                      borderRadius: 2,
                      '&:hover': {
                        bgcolor: '#fa931d',
                      },
                    }}
                  >
                    <Span sx={{ pl: 1, textTransform: "capitalize" }}>
                      Eye Diagnosis
                    </Span>
                  </Button>
                </Grid>
              </Grid>


              <Grid container spacing={2} sx={{ marginTop: 2 }}>
                <Grid item xs={12} md={8}>


                  <Box component="section" sx={{ p: 2, border: '1px dashed grey', borderRadius: '5px' }}>
                    <Grid container spacing={2}>
                      {/* Left Eye Preview */}

                      {leftEyePreview && (
                        <Grid item xs={12} md={6}>

                          <h4 style={{ maxWidth: "80%", maxHeight: "80%", textAlign: 'center' }}>Left Eye</h4>
                          <>
                            <Zoom>
                              <img
                                src={URL.createObjectURL(leftEyePreview)}
                                alt="Left Eye"
                                style={{ maxWidth: "80%", maxHeight: "80%", cursor: "pointer" }}
                              />
                            </Zoom>
                          </>
                        </Grid>
                      )}<></>

                      {rightEyePreview && (<Grid item xs={12} md={6}>
                        <h4 style={{ maxWidth: "80%", maxHeight: "80%", textAlign: 'center' }}>Right Eye </h4>

                        <Zoom>
                          <img
                            src={URL.createObjectURL(rightEyePreview)}
                            alt="Right Eye"
                            style={{ maxWidth: "80%", maxHeight: "80%" }}
                          />
                        </Zoom>

                      </Grid>
                      )}
                    </Grid>
                  </Box>
                </Grid>

                <Grid item xs={12} md={4}>

                  <Box component="section" sx={{ p: 2, border: '1px dashed darkblue', borderRadius: '5px' }}>
                    <Typography variant="h6" component="div" sx={{ marginBottom: 1, textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <FlipIcon sx={{color:'#fa931d'}}/>               &nbsp;&nbsp;&nbsp;   Diagnosis Result &nbsp;&nbsp;&nbsp;
                        {(predictions.right_eye || predictions.left_eye) && (
                          <>
                            <Tooltip title="Add Feedback">
                              <IconButton
                                onClick={handleOpenDialog}
                                sx={{ align: "right", "&:hover": { bgcolor: "grey.200" } }}
                              >
                                <AddCircleOutline sx={{ color: "#E53935" }} />
                              </IconButton>
                            </Tooltip>
                            <PhysicianDecisionDialog open={dialogOpen} onClose={handleCloseDialog} Result={res} />
                          </>
                        )}
                      </div>

                    </Typography>
                    {isLoading && (
                      <div style={{ textAlign: "center" }}>
                        <CircularProgress />
                      </div>
                    )}
                    {(predictions.right_eye || predictions.left_eye) && (
                      <>
                        <AbnormalityDetection
                          leftData={predictions.left_eye ? predictions.left_eye.predictions[0] : [0]}
                          rightData={predictions.right_eye ? predictions.right_eye.predictions[0] : [0]}
                        />
                      </>
                    )}
                    {predictions.left_eye && (
                      <PredictionResult data={predictions.left_eye.predictions[0]} eye="Left" />
                    )}
                    {predictions.right_eye && (
                      <PredictionResult data={predictions.right_eye.predictions[0]} eye="Right" />
                    )}
                  </Box>
                </Grid>
              </Grid>

            </>
          )}
        </SimpleCard>
      </Stack>
    </Container >
  );
}

export default PatientForm;

