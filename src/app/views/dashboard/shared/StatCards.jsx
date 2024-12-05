import { Box, Card, Grid, styled } from "@mui/material";
import { Group, LocalHospital } from "@mui/icons-material";
import { Small } from "app/components/Typography";
import { fetchPatientForDoctor, getPatientsCount } from "app/apis/patients_api";
import useAuth from "app/hooks/useAuth";
import { useEffect, useState } from "react";
import { get_institution_count } from "app/apis/users_api";

// STYLED COMPONENTS
const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  borderRadius: 10,
  border: '1px solid rgba(95, 96, 164, 0.5)',
  alignItems: "center",
  justifyContent: "center",
  padding: "16px !important",
  background: theme.palette.background.paper,
  [theme.breakpoints.down("sm")]: { padding: "16px !important" },
}));

const ContentBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row", 
  alignItems: "center",
  "& small": { color: theme.palette.text.secondary },
  "& .icon": {
    opacity: 0.8,
    fontSize: "44px",
    marginRight: "16px", 
  },
}));

const Heading = styled("h2")(({ theme }) => ({
  margin: 0,
  marginTop: "4px",
  fontSize: "20px",
  fontWeight: "500",
  color: '#181b62',
}));

// MAIN COMPONENT
export default function StatCards() {
  const [institution, setInstitution] = useState(0);
  const [normalCount, setNormalCount] = useState(0);
  const [abnormalCount, setAbnormalCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await getPatientsCount();
        setTotalCount(response.total_patients_count);
        setNormalCount(response.normal_patients_count);
        setAbnormalCount(response.abnormal_patients_count);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCount();
  }, []);

  useEffect(() => {
    const fetchInstitutionCount = async () => {
      try {
        const response = await get_institution_count();
        setInstitution(response.institution_count);
      } catch (error) {
        console.error("Error fetching institution count:", error);
      }
    };

    fetchInstitutionCount();
  }, []);

  const cardList = [
    { name: "Hospitals", amount: institution, Icon: LocalHospital, color: "#1E88E5" },
    { name: "Total", amount: totalCount, Icon: Group, color: "#43A047" },
    { name: "Normal", amount: normalCount, Icon: Group, color: "#FB8C00" },
    { name: "Abnormal", amount: abnormalCount, Icon: Group, color: "#E53935" },
  ];

  return (
    <Grid container spacing={4} sx={{ mb: "24px" }}>
      {cardList.map(({ amount, Icon, name, color }) => (
        <Grid item xs={6} md={3} lg={3} key={name}>
          <StyledCard elevation={6}>
            <ContentBox>
              <Icon className="icon" style={{ color }} />
              <Box>
                <Heading>{amount}</Heading>
                <Small>{name}</Small>
              </Box>
            </ContentBox>
          </StyledCard>
        </Grid>
      ))}
    </Grid>
  );
}
