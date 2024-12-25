import { Box, Card, Grid, styled, Table, Typography, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { Home, PetsRounded } from "@mui/icons-material";
import GrassIcon from '@mui/icons-material/Grass';
import EggIcon from '@mui/icons-material/Egg';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { Small } from "app/components/Typography";
import { getBreeds, getHouses } from "app/apis/chicken_api";
import { getChickens } from "app/apis/individual_chicken_api";
import { getGroupChickens } from "app/apis/group_chicken_api";
import { getIncubationRecords } from "app/apis/hatchery_unit_api";
import { getHatcherRecords } from "app/apis/hatchery_unit_api";
import { getHatcherSummarys } from "app/apis/hatchery_unit_api";
import { getGroupEggs } from "app/apis/group_chicken_api";
import { getGroupEggsForDashboard } from "app/apis/group_chicken_api";
import { getIndividualEggsForDashboard } from "app/apis/group_chicken_api";
import { useEffect, useState } from "react";
import StarIcon from '@mui/icons-material/Star';
const HoverableTableRow = styled(TableRow)(({ theme }) => ({
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    cursor: "pointer",
  },
}));
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

export const StatCards = () => {
  const [chickens, setChickens] = useState(0);
  const [groupChickens, setGroupChickens] = useState(0);
  const [breeds, setBreeds] = useState(0);
  const [houses, setHouses] = useState(0);
  const [incubations, setIncubations] = useState(0);
  const [hatcheryUnits, setHatcheryUnits] = useState(0);
  const [hatcherySummaries, setHatcherySummaries] = useState(0);
  const [topThreeGroups, setTopThreeGroups] = useState([]);
  const [topThreeIndividuals, setTopThreeIndividuals] = useState([]);
  const [pageSizeIndividual, setPageSizeIndividual] = useState(3);
  const [pageSizeGroup, setPageSizeGroup] = useState(5);
  const [activeGrid, setActiveGrid] = useState(1);
  const [isHoveredIndividual, setIsHoveredIndividual] = useState(false);
  const [isHoveredGroup, setIsHoveredGroup] = useState(false);

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
          const eggData = await getGroupEggsForDashboard();

          if (Array.isArray(eggData)) {
            const sortedEggData = eggData.sort((a, b) => b.total_egg_production - a.total_egg_production);

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



  const EggProductionTableForIndividual = () => {

    useEffect(() => {
      const fetchTopThreeIndividualEggProduction = async () => {
        try {
          const eggDataForIndividual = await getIndividualEggsForDashboard();

          if (Array.isArray(eggDataForIndividual)) {
            const sortedEggDataForIndividual = eggDataForIndividual.sort((a, b) => b.total_egg_production - a.total_egg_production);

            const topThreeIndividuals = sortedEggDataForIndividual.slice(0, 3);
            setTopThreeIndividuals(topThreeIndividuals);
          }
        } catch (error) {
          console.error('Error fetching egg production data:', error);
        }
      };

      fetchTopThreeIndividualEggProduction();
    }, []);
  }
  EggProductionTableForIndividual()

  const cardList = [
    { name: "Experimentals", amount: chickens, Icon: PetsRounded, color: "#43A047" },
    { name: "Groups", amount: groupChickens, Icon: PetsRounded, color: "#FB8C00" },
    { name: "Breeds", amount: breeds, Icon: PetsRounded, color: "#E53935" },
    { name: "Houses", amount: houses, Icon: Home, color: "#1E88E5" },
    { name: "Incubations", amount: incubations, Icon: GrassIcon, color: "#FB8C00" },
    { name: "Hatchery Units", amount: hatcheryUnits, Icon: EggIcon, color: "#E53935" },
    { name: "Hatchery Summaries", amount: hatcherySummaries, Icon: AssignmentIcon, color: "#1E88E5" },
  ];



  return (
    <>


      <Grid item xs={12} sx={{ mb: "10px" }}>
        <StyledCard elevation={2}>
          <div

            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              overflow: "hidden",
              borderRadius: "4px",
              height: 44,
              whiteSpace: "pre",
              marginBottom: "8px",
              textDecoration: "none",
              transition: "all 150ms ease-in",
              backgroundColor: isHoveredGroup ? "#19B839" : "transparent",
              boxShadow: isHoveredGroup ? "0 4px 8px rgba(0, 0, 0, 0.2)" : "none",
              transform: isHoveredGroup ? "translateY(-2px)" : "none",
            }}
            onMouseEnter={() => setIsHoveredGroup(true)}
            onMouseLeave={() => setIsHoveredGroup(false)}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <StarIcon
                style={{ marginRight: 8, color: "gold", cursor: "pointer" }}
                onClick={() => setActiveGrid(1)}
              />
              <Typography
                gutterBottom
                sx={{ fontSize: "0.875rem", fontWeight: "bold", cursor: "pointer" }}
                onClick={() => setActiveGrid(1)}
              >
                Top Egg-Producing Groups
              </Typography>
            </div>
            <div>

              <select
                onChange={(e) => setPageSizeGroup(Number(e.target.value))}
                value={pageSizeGroup}
                style={{
                  marginBottom: '10px',
                  padding: '4px',
                  border: '1px solid rgb(28, 185, 72)',
                  borderRadius: '4px',
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>

          </div>
          {activeGrid === 1 && (
            <TableContainer
              style={{
                maxHeight: 300,
                overflowY: "auto",
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">House Number</TableCell>
                    <TableCell align="center">Number of Eggs</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topThreeGroups.length > 0 ? (
                    topThreeGroups.slice(0, pageSizeGroup).map((group) => (
                      <HoverableTableRow key={group.id}>
                        <TableCell align="center">{group.chicken_group.house}</TableCell>
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
          )}
        </StyledCard>
      </Grid>

      <Grid item xs={12} sx={{ mb: "10px" }}>
        <StyledCard elevation={2}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              overflow: "hidden",
              borderRadius: "4px",
              height: 44,
              whiteSpace: "pre",
              marginBottom: "8px",
              textDecoration: "none",
              transition: "all 150ms ease-in",
              backgroundColor: isHoveredIndividual ? "#19B839" : "transparent",
              boxShadow: isHoveredIndividual ? "0 4px 8px rgba(0, 0, 0, 0.2)" : "none",
              transform: isHoveredIndividual ? "translateY(-2px)" : "none",
            }}
            onMouseEnter={() => setIsHoveredIndividual(true)}
            onMouseLeave={() => setIsHoveredIndividual(false)}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <StarIcon
                style={{ marginRight: 8, color: "gold", cursor: "pointer" }}
                onClick={() => setActiveGrid(2)}
              />
              <Typography
                gutterBottom
                sx={{ fontSize: "0.875rem", fontWeight: "bold", cursor: "pointer" }}
                onClick={() => setActiveGrid(2)}
              >
                Top Egg-Producing Individuals
              </Typography>
            </div>
            <div>
              <select
                onChange={(e) => setPageSizeIndividual(Number(e.target.value))}
                value={pageSizeIndividual}
                style={{
                  marginBottom: '10px',
                  padding: '4px',
                  border: '1px solid rgb(28, 185, 72)',
                  borderRadius: '4px',
                  height: '100%',
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>
          {activeGrid === 2 && (
            <TableContainer
              style={{
                maxHeight: 300,
                overflowY: "auto",
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Bird ID</TableCell>
                    <TableCell align="center">Breed Name</TableCell>
                    <TableCell align="center">Number of Eggs</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {topThreeIndividuals.length > 0 ? (
                    topThreeIndividuals.slice(0, pageSizeIndividual).map((individual) => (
                        <HoverableTableRow key={individual.id}>
                            <TableCell align="center">{individual.bird.bird_id}</TableCell>
                            <TableCell align="center">{individual.bird.breed.name}</TableCell> {/* Accessing breed name */}
                            <TableCell align="center">{individual.egg_count}</TableCell>
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
          )}
        </StyledCard>
      </Grid>


      <Grid container spacing={1} >
        {cardList.map(({ amount, Icon, name, color }) => (
          <Grid item xs={6} md={6} lg={4} key={name}>
            <StyledCard>
              <ContentBox style={{ display: 'flex', alignItems: 'center' }}>
              <Icon className="icon" style={{ color, fontSize: '32px' }} /> 
                <Box style={{ display: 'flex', alignItems: 'center', marginLeft: '1px' }}>
                  <Typography variant="h5" style={{ fontSize: '0.75rem', marginRight: '4px' }}>
                    {amount}
                  </Typography>
                  <Typography variant="h6" style={{ fontSize: '0.625rem' }}>
                    {name}
                  </Typography>
                </Box>
              </ContentBox>
            </StyledCard>
          </Grid>


                    // <Grid item xs={6} md={6} lg={4} key={name}>
                    //   <StyledCard elevation={2}>
                    //     <ContentBox>
                    //       <Icon className="icon" style={{ color }} />
                    //       <Box>
                    //         <Heading>{amount}</Heading>
                    //         <Small>{name}</Small>
                    //       </Box>
                    //     </ContentBox>
                    //   </StyledCard>
                    // </Grid> 
        ))}
      </Grid>
    </>
  );
}
