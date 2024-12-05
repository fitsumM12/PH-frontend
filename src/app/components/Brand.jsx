import { Box, styled } from "@mui/material";
import { Span } from "./Typography";
import { Logo } from "app/components";
import useSettings from "app/hooks/useSettings";
import "@fontsource/pacifico"; 

// STYLED COMPONENTS
const BrandRoot = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  padding: "20px 18px 20px 29px",
}));

const StyledSpan = styled(Span)(({ theme, mode }) => ({
  fontSize: 20,
  fontFamily: 'Helvetica, Arial, sans-serif', // Added Helvetica font
  background: `linear-gradient(95deg, ${theme.palette.secondary.main}, ${'#E53935'})`,
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
  const { settings } = useSettings();
  const leftSidebar = settings.layout1Settings.leftSidebar;
  const { mode } = leftSidebar;

  return (
    <>
      <BrandRoot>
        <Box display="flex" alignItems="center">
          <Logo />
          <StyledSpan mode={mode} className="sidenavHoverShow">
            Deep Eye
          </StyledSpan>
        </Box>
      </BrandRoot>
    </>
  );
}
