import axios from 'axios';
import { Box, styled } from "@mui/material";
import { Span } from "./Typography";
import useSettings from "app/hooks/useSettings";
import "@fontsource/pacifico";
import React, { useState, useEffect,useContext } from 'react';
import { ProfileContext } from "app/contexts/profileContext"; // Ensure this context provides the necessary data


const BrandRoot = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  padding: "20px 18px 20px 29px",
}));

const StyledSpan = styled(Span)(({ theme, mode }) => ({
  fontSize: 20,
  fontFamily: 'Helvetica, Arial, sans-serif',
  background: `linear-gradient(95deg, ${theme.palette.secondary.main}, ${'#3BC659'})`,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  marginLeft: ".5rem",
  display: mode === "compact" ? "none" : "block",
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: -4,
    left: 0,
    width: "100%",
    height: 2,
    background: `linear-gradient(95deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
    transform: "skewX(-20deg)",
  },
}));

export default function Brand({ children }) {
  const { profileStatus } = useContext(ProfileContext); // Use context to get the profile data
console.log(profileStatus);

  const [profile, setProfile] = useState({
    bio: '',
    dashboard_image: '',
  });
  const { settings } = useSettings();
  const leftSidebar = settings.layout1Settings.leftSidebar;
  const { mode } = leftSidebar;

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/dashboard-profile/");
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, [profileStatus]);

  console.log('Dashboard Image URL:', profile.dashboard_image);
  console.log("Bio:", profile.bio);

  return (
    <BrandRoot>
      <Box display="flex" alignItems="center">
         <img
          src={profile.dashboard_image}
          alt="Dashboard"
          style={{ width: 50, height: 50, borderRadius: 20 }}
        />

         <StyledSpan mode={mode} className="sidenavHoverShow">
          {profile.bio}
        </StyledSpan>
      </Box>
    </BrandRoot>
  );
}
