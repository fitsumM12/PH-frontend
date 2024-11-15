import { memo } from "react";
import { Box, styled, Avatar, Hidden, useTheme, MenuItem, IconButton, useMediaQuery } from "@mui/material";
import useAuth from "app/hooks/useAuth";
import useSettings from "app/hooks/useSettings";
import { Span } from "app/components/Typography";
import { MainMenu } from "app/components";
import { themeShadows } from "app/components/Theme/themeColors";
import { topBarHeight } from "app/utils/constant";
import { Menu, Person, Settings, PowerSettingsNew } from "@mui/icons-material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// STYLED COMPONENTS
const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.primary
}));

const TopbarRoot = styled("div")({
  top: 0,
  zIndex: 96,
  height: topBarHeight,
  boxShadow: themeShadows[8],
  transition: "all 0.3s ease"
});

const TopbarContainer = styled(Box)(({ theme }) => ({
  padding: "8px",
  paddingLeft: 18,
  paddingRight: 20,
  height: "100%",
  display: "flex",
  alignItems: "center",
  borderBottom:'1.5px solid #d19a0',
  justifyContent: "space-between",
  background: theme.palette.primary.main,
  [theme.breakpoints.down("sm")]: { paddingLeft: 16, paddingRight: 16 },
  [theme.breakpoints.down("xs")]: { paddingLeft: 14, paddingRight: 16 }
}));

const UserMenu = styled(Box)({
  padding: 4,
  display: "flex",
  borderRadius: 24,
  cursor: "pointer",
  alignItems: "center",
  "& span": { margin: "0 8px" }
});

const StyledItem = styled(MenuItem)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  minWidth: 185,
  "& a": {
    width: "100%",
    display: "flex",
    alignItems: "center",
    textDecoration: "none"
  },
  "& span": { marginRight: "10px", color: theme.palette.text.primary }
}));

// TO MAKE AVATAR
const getInitials = (firstName, lastName) => {
  if (!firstName || !lastName) {
    return '?'; // Default if either name is missing
  }
  return firstName[0] + lastName[0];
};

// MAIN
const renderAvatar = (user) => {
  if (!user || !user.first_name || !user.last_name) {
    return <Avatar sx={{ cursor: 'pointer', backgroundColor: '#23297a' }}>?</Avatar>; // Fallback Avatar
  }

  const initials = getInitials(user.first_name, user.last_name);
  return <Avatar sx={{ cursor: 'pointer', backgroundColor: '#23297a' }}>{initials}</Avatar>;
};

const Layout1Topbar = () => {
  const theme = useTheme();
  const { settings, updateSettings } = useSettings();
  const { logout, user } = useAuth();

  // Move all hooks to the top, including useMediaQuery
  const isMdScreen = useMediaQuery(theme.breakpoints.down("md"));

  // Check if the user is loading or undefined
  if (!user) {
    return <div>Loading...</div>; // Fallback UI while user data is loading
  }

  const updateSidebarMode = (sidebarSettings) => {
    updateSettings({ layout1Settings: { leftSidebar: { ...sidebarSettings } } });
  };

  const handleSidebarToggle = () => {
    let { layout1Settings } = settings;
    let mode;
    if (isMdScreen) {
      mode = layout1Settings.leftSidebar.mode === "close" ? "mobile" : "close";
    } else {
      mode = layout1Settings.leftSidebar.mode === "full" ? "close" : "full";
    }
    updateSidebarMode({ mode });
  };

  return (
    <TopbarRoot>
      <TopbarContainer>
        <Box display="flex">
          <StyledIconButton onClick={handleSidebarToggle}>
            <Menu />
          </StyledIconButton>
        </Box>

        <Box display="flex" alignItems="center">
          <Span>
            <h5>{user.first_name}</h5>
          </Span>
          <MainMenu
            menuButton={
              <UserMenu>
                <Hidden xsDown>
                </Hidden>
                <AccountCircleIcon style={{ color: '#00004D', height:'30px', width:'30px', margin:2}} />

              </UserMenu>
            }
          >
            {/* <StyledItem>
              <Person />
              <Span>Profile</Span>
            </StyledItem> */}

            <StyledItem onClick={logout}>
              <PowerSettingsNew />
              <Span>Logout</Span>
            </StyledItem>
          </MainMenu>
        </Box>
      </TopbarContainer>
    </TopbarRoot>
  );
};

export default memo(Layout1Topbar);
