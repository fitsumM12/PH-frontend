import { Box, Card, Grid, styled, Table, Typography, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { Home, PetsRounded } from "@mui/icons-material";
import GrassIcon from '@mui/icons-material/Grass'; // Alternative for incubation
import EggIcon from '@mui/icons-material/Egg'; // For hatchery unit
import AssignmentIcon from '@mui/icons-material/Assignment'; // For hatchery summary

import { Small } from "app/components/Typography";
import { getBreeds, getHouses } from "app/apis/chicken_api";
import { getChickens } from "app/apis/individual_chicken_api";
import { getGroupChickens } from "app/apis/group_chicken_api";
import { getIncubationRecords } from "app/apis/hatchery_unit_api";
import { getHatcherRecords } from "app/apis/hatchery_unit_api";
import { getHatcherSummarys } from "app/apis/hatchery_unit_api";
import { getGroupEggs } from "app/apis/group_chicken_api";
import { useEffect, useState } from "react";
// import { styled, TableRow } from "@mui/material";

const HoverableTableRow = styled(TableRow)(({ theme }) => ({
  "&:hover": {
    backgroundColor: theme.palette.action.hover, // Uses Material-UI's hover color
    cursor: "pointer",
  },
}));
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
export const StatCards = () => {
  const [chickens, setChickens] = useState(0);
  const [groupChickens, setGroupChickens] = useState(0);
  const [breeds, setBreeds] = useState(0);
  const [houses, setHouses] = useState(0);
  const [incubations, setIncubations] = useState(0);
  const [hatcheryUnits, setHatcheryUnits] = useState(0);
  const [hatcherySummaries, setHatcherySummaries] = useState(0);
  const [topThreeGroups, setTopThreeGroups] = useState([]);
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

        const hatcheryUnitData = await getHatcherRecords();
        setHatcheryUnits(Array.isArray(hatcheryUnitData) ? hatcheryUnitData.length : 0);

        const hatcherySummaryData = await getHatcherSummarys();
        setHatcherySummaries(Array.isArray(hatcherySummaryData) ? hatcherySummaryData.length : 0);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchCounts();
  }, []);



  const EggProductionTable = () => {


    useEffect(() => {
      const fetchTopThreeEggProduction = async () => {
        try {
          // Fetch egg production data
          const eggData = await getGroupEggs();

          if (Array.isArray(eggData)) {
            // Sort the egg production data in descending order of total egg production
            const sortedEggData = eggData.sort((a, b) => b.total_egg_production - a.total_egg_production);

            // Get the top 3 highest egg-producing groups
            const topThree = sortedEggData.slice(0, 3);
            setTopThreeGroups(topThree);
          }
        } catch (error) {
          console.error('Error fetching egg production data:', error);
        }
      };

      fetchTopThreeEggProduction();
    }, []);
  }

  EggProductionTable()
  const cardList = [
    { name: "Experimental", amount: chickens, Icon: PetsRounded, color: "#43A047" },
    { name: "Groups", amount: groupChickens, Icon: PetsRounded, color: "#FB8C00" },
    { name: "Breeds", amount: breeds, Icon: PetsRounded, color: "#E53935" },
    { name: "Houses", amount: houses, Icon: Home, color: "#1E88E5" },
    { name: "Incubation", amount: incubations, Icon: GrassIcon, color: "#FB8C00" },
    { name: "Hatchery Unit", amount: hatcheryUnits, Icon: EggIcon, color: "#E53935" },
    { name: "Hatchery Summary", amount: hatcherySummaries, Icon: AssignmentIcon, color: "#1E88E5" },
  ];

  return (
    <>
         {/* Table inside a card */}
         <Grid item xs={12} sx={{ mb: "10px" }} >
        <StyledCard elevation={2}>
          <Typography variant="h6" gutterBottom>
            Top 3 Egg-Producing Chicken Groups
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Group ID</TableCell>
                  <TableCell align="center">Number of Eggs</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topThreeGroups.length > 0 ? (
                  topThreeGroups.map((group) => (
                    <HoverableTableRow key={group.id}>
                      <TableCell align="center">{group.chicken_group}</TableCell>
                      <TableCell align="center">{group.total_egg_production}</TableCell>
                    </HoverableTableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell align="center" colSpan={2}>
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>

            </Table>
          </TableContainer>
        </StyledCard>
      </Grid>
      <Grid container spacing={1} >
        {cardList.map(({ amount, Icon, name, color }) => (
          <Grid item xs={4} md={4} lg={4} key={name}>
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

 
    </>
  );
}
