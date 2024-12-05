import ResponseChart from 'app/views/charts/ResponseChart';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useCallback } from 'react';
import axios from 'axios';
import { DatePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Icon,
  Radio,
  RadioGroup,
  styled
} from "@mui/material";
import { Span } from "app/components/Typography";
import { useEffect, useState } from "react";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";

const TextField = styled(TextValidator)(() => ({
  width: "100%",
  marginBottom: "16px"
}));

function ImageUploadForm() {
  // DEFINE AND INITIALIZE HOOKS
  const [responses, setResponses] = useState(null)
  const [imagePreview, setImagePreview] = useState(null);
  const [forward, setForward] = useState(true)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: 0,
    gender: 'unknown',
    job: 'unknown',
    gender: 'unknown',
    email: 'unknown@gmail.com',
    mobile: '',
    region: 'unknown',
    zone: 'unknown',
    kebele: 'unknown',
    image: null
  });

  // DEFINE FUNCTIONS
  const handleNext = () => {
    // No need to check form validity here
    setForward(!forward);
  }

  const handleChange = (event) => {
    event.persist();
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    const file = e.target.files[0];
    const newValue = name === 'image' ? files[0] : formData[name]; 
  
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
    setFormData(prevState => ({
      ...prevState,
      [name]: newValue
    }));
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('firstName', formData.firstName);
    data.append('lastName', formData.lastName);
    data.append('age', formData.age);
    data.append('gender', formData.gender);
    data.append('email', formData.email);
    data.append('mobile', formData.mobile);
    data.append('region', formData.region);
    data.append('zone', formData.zone);
    data.append('kebele', formData.kebele);
    data.append('image', formData.image);

    axios.post('http://127.0.0.1:8000/api/predicts/', data)
      .then(response => {
        if (response.status === 200) {
          return response.data;
        } else {
          throw new Error('Network response was not ok');
        }
      })
      .then(data => {
        setResponses(data);
        console.log('Form submitted successfully:', data);
      })
      .catch(error => {
        console.error('There was a problem submitting the form:', error);
      });
  };

  return (
    <>
      <>
        {forward ? (
          <div>
            <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
              <Grid container spacing={6}>
                <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>

                  <TextField
                    type="text"
                    name="firstName"
                    label="First Name"
                    onChange={handleChange}
                    value={formData.firstName || ""}
                    validators={["required"]}
                    errorMessages={["this field is required"]}
                  />
                  <TextField
                    type="text"
                    name="lastName"
                    label="Last Name"
                    onChange={handleChange}
                    value={formData.lastName || ""}
                    validators={["required"]}
                    errorMessages={["this field is required"]}
                  />
                  <TextField
                    type="number"
                    name="age"
                    label="Age"
                    onChange={handleChange}
                    value={formData.age || ""}
                    validators={["required"]}
                    errorMessages={["this field is required"]}
                  />

                  <RadioGroup
                    row
                    name="gender"
                    label='Gender'
                    sx={{ mb: 2 }}
                    value={formData.gender || ""}
                    onChange={handleChange}>
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
                  <TextField
                    type="text"
                    name="Job"
                    label="Job"
                    onChange={handleChange}
                    value={formData.job || ""}
                  />

                </Grid>

                <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                  <TextField
                    type="email"
                    name="email"
                    label="Email"
                    value={formData.email || ""}
                    onChange={handleChange}
                    // validators={["required", "isEmail"]}
                    errorMessages={["this field is required", "email is not valid"]}
                  />

                  <TextField
                    type="text"
                    name="mobile"
                    value={formData.mobile || ""}
                    label="Mobile Nubmer"
                    onChange={handleChange}
                    validators={["required"]}
                    errorMessages={["this field is required"]}
                  />
                  <TextField
                    type="text"
                    name="region"
                    label="Region"
                    value={formData.region || ""}
                    onChange={handleChange}
                  />
                  <TextField
                    type="text"
                    name="zone"
                    label="Zone"
                    value={formData.zone || ""}
                    onChange={handleChange}
                  />
                  <TextField
                    type="text"
                    name="kebele"
                    label="Kebele"
                    value={formData.kebele || ""}
                    onChange={handleChange}
                  />


                </Grid>

              </Grid>

              <Button
                color="primary"
                variant="contained"
                type="submit"
                onClick={handleNext}
                // onSubmit={handleSubmit}
              >

                <Span sx={{ pl: 1, textTransform: "capitalize" }}>Next</Span>
                <ArrowForwardIosIcon />
              </Button>
            </ValidatorForm>
          </div>
        ) : (
          <div>
            <form onSubmit={handleSubmit}>
              <input type="file" name='image' onChange={handleImageChange} />
              <button type="submit" color="secondary" variant="contained" >
              <Span sx={{ pl: 1, textTransform: "capitalize" }}>Predict</Span></button>
            </form>
            <Button color="primary" variant="contained" type="submit" onClick={handleNext} style={{ alignItems: 'self-end' }}>
              <ArrowBackIosIcon />
              <Span sx={{ pl: 1, textTransform: "capitalize" }}>Back</Span>
            </Button>
          </div>
        )}
      </>

      {responses && !forward ? (
        <Grid container spacing={6}>
          {/* <Grid item lg={6} sm={12} xs={12} sx={{ mt: 2 }}>
            <span>Original Image</span><br />
            {imagePreview && <img src={imagePreview} alt="Uploaded" style={{ maxWidth: '60%' }} />}
          </Grid> */}
          <Grid item lg={6} sm={12} xs={12} sx={{ mt: 2 }}><div style={{ textAlign: 'left' }}>
            <span>Grad-CAM image</span>
          </div>

            {imagePreview && <img src={imagePreview} alt="Uploaded" style={{ maxWidth: '60%' }} />}
          </Grid>
          <Grid item lg={6} sm={12} xs={12} sx={{ mt: 2 }}>
            <ResponseChart data={responses.result[0]} height={400} />
          </Grid>
        </Grid>
      ) : null}
    </>
  );
}

export default ImageUploadForm;
