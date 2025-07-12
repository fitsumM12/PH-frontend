import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Grid, TextField, Box, styled } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Formik } from "formik";
import axios from "axios";
import * as Yup from "yup";

import useAuth from "app/hooks/useAuth";
import Brand from "app/components/Brand";

const ContentBox = styled("div")(() => ({
  height: "100%",
  padding: "32px",
  position: "relative",
  background: "rgba(0, 0, 0, 0.01)",
}));

const StyledRoot = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100% !important",
  "& .card": {
    maxWidth: 800,
    minHeight: 400,
    margin: "1rem",
    display: "flex",
    borderRadius: 12,
    alignItems: "center",
  },
  ".img-wrapper": {
    height: "100%",
    minWidth: 320,
    display: "flex",
    padding: "2rem",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const initialValues = {
  email: "",
  password: "",
  remember: true,
};

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, "Password must be 6 character length")
    .required("Password is required!"),
  email: Yup.string().email("Invalid Email address").required("Email is required!"),
});

export default function JwtLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [landingPageImage, setLandingPageImage] = useState(process.env.PUBLIC_URL + "/assets/images/screening.gif");

  const { login } = useAuth();

  useEffect(() => {
    const fetchLandingPageImage = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/landingpage-image/`);
        setLandingPageImage(response.data.landingpage_image); // Corrected key
      } catch (error) {
        console.error("Error fetching landing page image:", error);
      }
    };
  
    fetchLandingPageImage();
  }, []);
  
  
console.log( "This is LandingPage Image"+" "+ landingPageImage);

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      navigate("/");
    } catch (e) {
      console.error("Login failed:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledRoot>
      <Card
        className="card"
        style={{
          padding: 20,
          borderRadius: 10,
          border: "1px solid rgba(95, 96, 164, 0.5)",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Grid container>
          <Grid item sm={6} xs={12}>
            <div className="img-wrapper">
              <img
                src={landingPageImage}
                style={{ borderRadius: 20 }}
                width="100%"
                alt="Landing Page"
              />
            </div>
          </Grid>

          <Grid item sm={6} xs={12}>
            <Box display="flex" justifyContent="center" mt={5} ml={-3}>
              <Brand />
            </Box>
            <ContentBox>
              <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={validationSchema}
              >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                  <form onSubmit={handleSubmit}>
                    <TextField
                      fullWidth
                      size="small"
                      type="email"
                      name="email"
                      label="Email"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.email}
                      onChange={handleChange}
                      helperText={touched.email && errors.email}
                      error={Boolean(errors.email && touched.email)}
                      sx={{ mb: 3 }}
                    />

                    <TextField
                      fullWidth
                      size="small"
                      name="password"
                      type="password"
                      label="Password"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.password}
                      onChange={handleChange}
                      helperText={touched.password && errors.password}
                      error={Boolean(errors.password && touched.password)}
                      sx={{ mb: 1.5 }}
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <LoadingButton
                        type="submit"
                        style={{ backgroundColor: "#19B839" }}
                        loading={loading}
                        variant="contained"
                        sx={{ my: 2, borderRadius: 5, width: "60%" }}
                      >
                        Login
                      </LoadingButton>
                    </div>
                  </form>
                )}
              </Formik>
            </ContentBox>
          </Grid>
        </Grid>
      </Card>
    </StyledRoot>
  );
}
