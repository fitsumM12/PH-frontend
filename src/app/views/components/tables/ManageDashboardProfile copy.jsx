import React, { useState } from "react";
import { Box, Button, TextField, Typography, styled, Avatar } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import RecordManageCard from 'app/views/components/RecordManageCard';
import axios from "axios";

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
    boxShadow: theme.shadows[2],
}));

export default function ManageDashboardProfile() {
    const [bio, setBio] = useState("");
    const [dashboardImage, setDashboardImage] = useState(null);
    const [landingpageImage, setLandingpageImage] = useState(null); // New state
    const [previewDashboardImage, setPreviewDashboardImage] = useState(null);
    const [previewLandingpageImage, setPreviewLandingpageImage] = useState(null); // New preview state

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
        formData.append("dashboard_image", dashboardImage);
        formData.append("landingpage_image", landingpageImage); // Add new field
        formData.append("bio", bio);

        try {
            const response = await axios.patch("http://localhost:8000/api/dashboard-profile/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("Success:", response.data);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to update profile. Please try again.");
        }
    };

    return (
        <Container>
            <RecordManageCard>
                <FormBox>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Update Dashboard Profile
                    </Typography>

                    {/* Dashboard Image Section */}
                    <Box display="flex" flexDirection="column" alignItems="center">
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
                            variant="contained"
                            component="label"
                            startIcon={<UploadFileIcon />}
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

                    {/* Landing Page Image Section */}
                    <Box display="flex" flexDirection="column" alignItems="center" mt={3}>
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
                            variant="contained"
                            component="label"
                            startIcon={<UploadFileIcon />}
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

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            label="Bio"
                            multiline
                            rows={1}
                            variant="outlined"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            sx={{
                                width: '50%',
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
                            color="primary"
                            onClick={handleSubmit}
                            size="large"
                            sx={{
                                width: '10%',
                                margin: '0 20%',
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
