import { Box, Card, Grid, styled } from "@mui/material";
import { Home, PetsRounded } from "@mui/icons-material";
import { Small } from "app/components/Typography";
import { getBreeds, getHouses } from "app/apis/chicken_api";
import { getChickens } from "app/apis/individual_chicken_api";
import { getGroupChickens } from "app/apis/group_chicken_api";
import { getIncubationRecords } from "app/apis/hatchery_unit_api";
import { getHatcherRecord } from "app/apis/hatchery_unit_api";
import { getHatcherSummarys } from "app/apis/hatchery_unit_api";
import { useEffect, useState } from "react";

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
export const StatCards = ()=> {
  const [chickens, setChickens] = useState(0);
  const [groupChickens, setGroupChickens] = useState(0);
  const [breeds, setBreeds] = useState(0);
  const [houses, setHouses] = useState(0);
  const [incubations, setIncubations] = useState(0);
  const [hatcheryUnits, setHatcheryUnits] = useState(0);
  const [hatcherySummaries, setHatcherySummaries] = useState(0);
console.log(chickens)
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const chickenData = await getChickens();
        setChickens(Array.isArray(chickenData) ? chickenData.length : 0);

        const groupData = await getGroupChickens();
        setGroupChickens(Array.isArray(groupData) ? groupData.length : 0);

        const breedData = await getBreeds();
        setBreeds(Array.isArray(breedData) ? breedData.length : 0);

        const houseData = await getHouses();
        setHouses(Array.isArray(houseData) ? houseData.length : 0);

        const incubationData = await getIncubationRecords();
        setIncubations(Array.isArray(incubationData) ? incubationData.length : 0);

        const hatcheryUnitData = await getHatcherRecord();
        setHatcheryUnits(Array.isArray(hatcheryUnitData) ? hatcheryUnitData.length : 0);

        const hatcherySummaryData = await getHatcherSummarys();
        setHatcherySummaries(Array.isArray(hatcherySummaryData) ? hatcherySummaryData.length : 0);
        


        // const incubationData = await getHatcherRecord();
        // setIncubations(Array.isArray(incubationData) ? incubationData.length : 0);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchCounts();
  }, []);

  const cardList = [
    { name: "Experimental", amount: chickens, Icon: PetsRounded, color: "#43A047" },
    { name: "Groups", amount: groupChickens, Icon: PetsRounded, color: "#FB8C00" },
    { name: "Breeds", amount: breeds, Icon: PetsRounded, color: "#E53935" },
    { name: "Houses", amount: houses, Icon: Home, color: "#1E88E5" },
    { name: "Incubation ", amount: incubations, Icon: PetsRounded, color: "#FB8C00" },
    { name: "Hatchery Unit", amount: hatcheryUnits, Icon: PetsRounded, color: "#E53935" },
    { name: "Hatchery Summary", amount: hatcherySummaries, Icon: Home, color: "#1E88E5" },
  ];


  return (
    <Grid container spacing={2} sx={{ mb: "24px" }}>
      {cardList.map(({ amount, Icon, name, color }) => (
        <Grid item xs={6} md={6} lg={6} key={name}>
          <StyledCard elevation={2}>
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
