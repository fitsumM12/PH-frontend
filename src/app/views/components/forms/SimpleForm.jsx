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

const SimpleForm = () => {
  const [state, setState] = useState({ date: new Date() });

  useEffect(() => {
    ValidatorForm.addValidationRule("isPasswordMatch", (value) => {
      if (value !== state.password) return false;

      return true;
    });
    return () => ValidatorForm.removeValidationRule("isPasswordMatch");
  }, [state.password]);

  const handleSubmit = (event) => {
  };

  const handleChange = (event) => {
    event.persist();
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const handleDateChange = (date) => setState({ ...state, date });

  const {
    firstName,
    lastName,
    mobile,
    gender,
    job,
    age,
    email, zone, region, kebele
  } = state;

  return (
    <div>
      <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
        <Grid container spacing={6}>
          <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>

            <TextField
              type="text"
              name="firstName"
              label="First Name"
              onChange={handleChange}
              value={firstName || ""}
              validators={["required"]}
              errorMessages={["this field is required"]}
            />
            <TextField
              type="text"
              name="lastName"
              label="Last Name"
              onChange={handleChange}
              value={lastName || ""}
              validators={["required"]}
              errorMessages={["this field is required"]}
            />
            <TextField
              type="number"
              name="age"
              label="Age"
              onChange={handleChange}
              value={age || ""}
              validators={["required"]}
              errorMessages={["this field is required"]}
            />

            <RadioGroup
              row
              name="gender"
              label='Gender'
              sx={{ mb: 2 }}
              value={gender || ""}
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
              value={job || ""}
            />

          </Grid>

          <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
            <TextField
              type="email"
              name="email"
              label="Email"
              value={email || ""}
              onChange={handleChange}
              // validators={["required", "isEmail"]}
              errorMessages={["this field is required", "email is not valid"]}
            />

            <TextField
              type="text"
              name="mobile"
              value={mobile || ""}
              label="Mobile Nubmer"
              onChange={handleChange}
              validators={["required"]}
              errorMessages={["this field is required"]}
            />
            <TextField
              type="text"
              name="region"
              label="Region"
              value={region || ""}
              onChange={handleChange}
            />
            <TextField
              type="text"
              name="zone"
              label="Zone"
              value={zone || ""}
              onChange={handleChange}
            />
            <TextField
              type="text"
              name="kebele"
              label="Kebele"
              value={kebele || ""}
              onChange={handleChange}
            />


          </Grid>
        </Grid>

        <Button color="primary" variant="contained" type="submit">
          {/* <Icon>Next</Icon> */}
          <Span sx={{ pl: 1, textTransform: "capitalize" }}>Next</Span>
        </Button>
      </ValidatorForm>
    </div>
  );
};

export default SimpleForm;
