import { Card, Box, styled } from "@mui/material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
// STYLED COMPONENTS
const CardRoot = styled(Card)({
  height: "100%",
  padding: "20px 24px"
});

const CardTitle = styled("div")(({ subtitle }) => ({
  fontSize: "1.25rem",
  fontWeight: "600",
  textTransform: "capitalize",
  marginBottom: !subtitle && "16px",
  padding: "10px",
  borderRadius: "8px",
  display: 'flex',
  alignItems: 'center',
  boxShadow: "0 0 2px rgba(0, 0, 0, 0.2)",
  color:'#181b62'
}));

export default function SimpleCard({ children, title, subtitle }) {
  return (
    <CardRoot elevation={6} style={{
      border: '1px solid rgba(95, 96, 164, 0.5)',
      width: '80%',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
    }}

    >
      <CardTitle subtitle={subtitle}>&nbsp;&nbsp;&nbsp;<PersonAddIcon style={{ color: '#fa931d' }} />   &nbsp;&nbsp;&nbsp;{title}</CardTitle>
      {subtitle && <Box mb={2}>{subtitle}</Box>}
      {children}
    </CardRoot>
  );
}
