
import { useEffect, useState } from "react";
import { formatDateOfBirth } from "app/utils/date";
import { getUser } from "app/apis/users_api";
import { Typography,Grid, Paper } from '@mui/material';


function UserView(userId) {
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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUser(userId.userId); 
        setFormData(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
    <Typography variant="h5" gutterBottom>User Information</Typography>
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Typography variant="body1"><strong>First Name:</strong> {formData.firstname}</Typography>
        <Typography variant="body1"><strong>Last Name:</strong> {formData.lastname}</Typography>
        <Typography variant="body1"><strong>Region:</strong> {formData.region}</Typography>
        <Typography variant="body1"><strong>Zone:</strong> {formData.zone}</Typography>
        <Typography variant="body1"><strong>Kebele:</strong> {formData.kebele}</Typography>
        <Typography variant="body1"><strong>Organization:</strong> {formData.organization}</Typography>
        <Typography variant="body1"><strong>Date of Birth:</strong> {formData.birthday}</Typography>
        <Typography variant="body1"><strong>Gender:</strong> {formData.gender}</Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography variant="body1"><strong>Mobile Number:</strong> {formData.mobile}</Typography>
        <Typography variant="body1"><strong>Email:</strong> {formData.email}</Typography>
        <Typography variant="body1"><strong>Password:</strong> ********</Typography> {/* Do not display actual password */}
        <Typography variant="body1"><strong>Status:</strong> {formData.status}</Typography>
        <Typography variant="body1"><strong>Role:</strong> {formData.role}</Typography>
        {/* Optionally display uploaded files */}
        <Typography variant="body1"><strong>Passport:</strong> {formData.passport}</Typography>
        <Typography variant="body1"><strong>Image:</strong> {formData.image}</Typography>
      </Grid>
    </Grid>
  </Paper>
  );
}

export default UserView;
