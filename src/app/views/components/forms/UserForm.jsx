import { Button, FormControl, FormControlLabel, Grid, Icon, MenuItem, Radio, RadioGroup, Select, styled } from "@mui/material";
import { Span } from "app/components/Typography";
import { useEffect, useState } from "react";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import useAppContext from "app/hooks/useAppContext";
import { uploadFiles, addUser } from "app/apis/users_api";
import { formatDateOfBirth } from "app/utils/date";

const TextField = styled(TextValidator)(() => ({
  width: "100%",
  marginBottom: "16px"
}));

function UserForm() {
  const date = new Date()
  const [formData, setFormData] = useState(
    {
      firstname: "",
      lastname: "",
      birthday: formatDateOfBirth(date),
      gender: "Other",
      email: "",
      password: "secretpassword",
      mobile: "1234567890",
      region: "Region",
      zone: "Zone",
      kebele: "Kebele",
      organization: "Workplace",
      image: 'null',
      passport: 'null',
      status: "PENDING",
      role: "GUEST",
    }
  );

  const { state, dispatch } = useAppContext();
  // DEFINE FUNCTIONS
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  
  const handleImageUpload = (event, fieldName) => {
    const file = event.target.files[0];
    setFormData({ ...formData, [fieldName]: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // UPLOAD IMAGE FILES
      const uploadResponse = await uploadFiles(formData.image, formData.passport);
      
      // EXTRACT UPLOADED IMAGE
      const imageUrl = uploadResponse.data.file_urls[0];
      const passportUrl = uploadResponse.data.file_urls[1];
      
      // CREATE NEW OBJECT 
      const updatedFormData = {
        ...formData,
        image: imageUrl,
        passport: passportUrl
      };
      
      // FINALLY, ADD THE USER
  
      const responseData = await addUser(updatedFormData);
    } catch (error) {
      console.error("There was a problem submitting the form:", error);
    }
  };
  
  

  return (
    <div>
      <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
        <Grid container spacing={6}>
          <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
            <TextField
              type="text"
              name="firstname"
              label="First Name"
              onChange={handleChange}
              value={formData.firstname}
              validators={["required"]}
              errorMessages={["this field is required"]}
            />
            <TextField
              type="text"
              name="lastname"
              label="Last Name"
              onChange={handleChange}
              value={formData.lastname}
              validators={["required"]}
              errorMessages={["this field is required"]}
            />
            <TextField
              type="text"
              name="region"
              label="Region"
              onChange={handleChange}
              value={formData.region}
            />

            <TextField
              type="text"
              name="zone"
              label="Zone"
              onChange={handleChange}
              value={formData.zone}
            />

            <TextField
              type="text"
              name="kebele"
              label="Kebele"
              onChange={handleChange}
              value={formData.kebele}
            />
            <TextField
              type="text"
              name="organization"
              label="organization"
              onChange={handleChange}
              value={formData.organization}
            />
            <TextField
              type="date"
              name="birthday"
              label="Date of Birth"
              onChange={handleChange}
              value={formData.birthday}
              validators={["required"]}
              errorMessages={["this field is required"]}
            />

            <RadioGroup
              row
              name="gender"
              label='Gender'
              sx={{ mb: 2 }}
              value={formData.gender}
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
          </Grid>

          <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>



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
              type="password"
              name="password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
              validators={["required"]}
              errorMessages={["this field is required"]}
            />
              <FormControl fullWidth>
              <Select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="APPROVED">Approve</MenuItem>
                <MenuItem value="BLOCKED">Block</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <Select
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <MenuItem value="GUEST">Guest</MenuItem>
                <MenuItem value="ADMIN">Admin</MenuItem>
                <MenuItem value="SUPERADMIN">Super Admin</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <input
                accept="image/*"
                id="passport-upload"
                type="file"
                onChange={(e) => handleImageUpload(e, 'passport')}
                style={{ display: 'none' }}
              />
              <label htmlFor="passport-upload">
                <Button variant="outlined" component="span">
                <FileUploadIcon/> Upload User Passport
                </Button>
              </label>
            </FormControl>
            <FormControl fullWidth>
              <input
                accept="image/*"
                id="image-upload"
                type="file"
                onChange={(e) => handleImageUpload(e, 'image')}
                style={{ display: 'none' }}
              />
              <label htmlFor="image-upload">
                <Button variant="outlined" component="span">
                  <FileUploadIcon/>
                  Upload User Image
                </Button>
              </label>
            </FormControl>
          </Grid>
        </Grid>

        <Button color="primary" variant="contained" type="submit">
          <Span sx={{ pl: 1, textTransform: "capitalize" }}>Add User</Span>
        </Button>

      </ValidatorForm>
    </div>
  );
}

export default UserForm;
