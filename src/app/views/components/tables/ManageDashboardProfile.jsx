import React, { useState, useEffect ,useContext} from "react";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import RecordManageCard from 'app/views/components/RecordManageCard';
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDove } from "@fortawesome/free-solid-svg-icons";
import { faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { ProfileContext } from "app/contexts/profileContext";  
import { Box, Button, TextField, Typography, styled, Avatar, Snackbar, Alert } from "@mui/material";
const token = localStorage.getItem('token');

const Container = styled("div")(({ theme }) => ({
    margin: "30px",
    [theme.breakpoints.down("sm")]: { margin: "16px" },
}));

const FormBox = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    padding: "24px",
    borderRadius: "8px",
    background: theme.palette.background.paper,
    boxShadow: theme.shadows[0],
}));


export default function ManageDashboardProfile() {
    const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);

    const { setProfileStatus } = useContext(ProfileContext); 

    const [isActive, setIsActive] = useState(false);


    const handleToggle = () => {
        setIsActive(!isActive);
    };
    const [bio, setBio] = useState("");
    const [dashboardImage, setDashboardImage] = useState(null);
    const [landingpageImage, setLandingpageImage] = useState(null);
    const [previewDashboardImage, setPreviewDashboardImage] = useState(null);
    const [previewLandingpageImage, setPreviewLandingpageImage] = useState(null);


    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const profileResponse = await axios.get("http://localhost:8000/api/dashboard-profile/");
                setBio(profileResponse.data.bio);
                setDashboardImage(profileResponse.data.dashboard_image);
                setPreviewDashboardImage(profileResponse.data.dashboard_image);

                const landingPageResponse = await axios.get("http://localhost:8000/api/landingpage-image/");
                setLandingpageImage(landingPageResponse.data.landingpage_image);
                setPreviewLandingpageImage(landingPageResponse.data.landingpage_image);
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        };

        fetchProfileData();
    }, []);

    console.log("Submitting:", { bio, dashboardImage, landingpageImage });
    const handleImageChange = (event, setImage, setPreview) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        if (bio) {
            formData.append("bio", bio);
        }

        if (dashboardImage && dashboardImage !== previewDashboardImage) {
            formData.append("dashboard_image", dashboardImage);
        }

        if (landingpageImage && landingpageImage !== previewLandingpageImage) {
            formData.append("landingpage_image", landingpageImage);
        }

        try {
            const response = await axios.patch("http://localhost:8000/api/dashboard-profile/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("Success:", response.data);
            // alert("Profile updated successfully!");

            
            setProfileStatus(prev => prev + 1);  
            setSuccessSnackbarOpen(true); // Show success snackbar
            // window.location.reload();
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to update profile. Please try again.");
        }
    };


    const handleSnackbarClose = () => {
        setSuccessSnackbarOpen(false);
    };


    return (
        <Container>
            <Snackbar
                open={successSnackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert onClose={handleSnackbarClose} severity="success">
                    Profile updated successfully!
                </Alert>
            </Snackbar>      

            <RecordManageCard>
                <FormBox>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            mb: { xs: 2, sm: 0 },
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                //   backgroundColor: '#FFF7E0',  
                                borderRadius: '50%',
                                padding: 2,
                            }}
                        >
                            <FontAwesomeIcon
                                icon={faUserEdit}
                                color="#ECAE1F"
                                style={{ fontSize: '32px' }}
                            />
                        </Box>

                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            Update Dashboard Profile
                        </Typography>
                    </Box>


                    <Box display="flex" justifyContent="space-between" mt={3}>
                        <Box display="flex" flexDirection="column" alignItems="center" flex={1} mr={2}>
                            <Avatar
                                src={previewDashboardImage || "/static/images/avatar-placeholder.png"}
                                alt="Dashboard Preview"
                                sx={{
                                    width: 120,
                                    height: 120,
                                    mb: 2,
                                    border: "2px solid #1976d2",
                                }}
                            />
                            <Button
                                variant={isActive ? 'contained' : 'outlined'}
                                component="label"
                                startIcon={<UploadFileIcon />}
                                sx={{
                                    backgroundColor: isActive ? '#19B839' : 'transparent',
                                    color: isActive ? '#fff' : '#19B839',
                                    borderColor: '#19B839',
                                    '&:hover': {
                                        backgroundColor: isActive ? '#17a832' : '#19B839',
                                        color: '#fff',
                                    },
                                }}
                                onClick={handleToggle}
                            >
                                Upload Dashboard Image
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={(event) =>
                                        handleImageChange(event, setDashboardImage, setPreviewDashboardImage)
                                    }
                                />
                            </Button>




                            <Typography variant="body2" color="textSecondary">
                                {dashboardImage ? dashboardImage.name : "No file selected"}
                            </Typography>
                        </Box>

                        <Box display="flex" flexDirection="column" alignItems="center" flex={1}>
                            <Avatar
                                src={previewLandingpageImage || "/static/images/avatar-placeholder.png"}
                                alt="Landing Page Preview"
                                sx={{
                                    width: 120,
                                    height: 120,
                                    mb: 2,
                                    border: "2px solid #1976d2",
                                }}
                            />
                            <Button
                                variant={isActive ? 'contained' : 'outlined'}
                                component="label"
                                startIcon={<UploadFileIcon />}
                                sx={{
                                    backgroundColor: isActive ? '#19B839' : 'transparent',
                                    color: isActive ? '#fff' : '#19B839',
                                    borderColor: '#19B839',
                                    '&:hover': {
                                        backgroundColor: isActive ? '#17a832' : '#19B839',
                                        color: '#fff',
                                    },
                                }}
                                onClick={handleToggle}
                            >
                                Upload Landing Page Image
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={(event) =>
                                        handleImageChange(event, setLandingpageImage, setPreviewLandingpageImage)
                                    }
                                />
                            </Button>
                            <Typography variant="body2" color="textSecondary">
                                {landingpageImage ? landingpageImage.name : "No file selected"}
                            </Typography>
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            label="Company Name"
                            multiline
                            rows={1}
                            variant="outlined"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            sx={{
                                width: '50%',
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: '#19B839',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#19B839',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#19B839',
                                    },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#19B839',
                                },
                            }}
                        />
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            width: '100%',
                        }}
                    >
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            size="large"
                            sx={{
                                width: '15%',
                                margin: '0 20%',
                                backgroundColor: '#19B839',
                                color: '#fff',
                                borderColor: '#19B839',
                                '&:hover': {
                                    backgroundColor: '#17a832',
                                    color: '#fff',
                                },
                            }}
                        >
                            Save Profile
                        </Button>

                    </Box>
                </FormBox>
            </RecordManageCard>
        </Container>
    );
}