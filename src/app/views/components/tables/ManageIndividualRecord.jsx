import { useState } from "react";
import { Box, Button, styled } from "@mui/material";
import RecordManageCard from 'app/views/components/RecordManageCard';
import ViewIndividualChicken from "./ViewIndividualChicken";
import ViewIndividualBodyweight from "./ViewIndividualBodyweight";
import ViewIndividualIntake from "./ViewIndividualIntake";
import ViewIndividualEgg from "./ViewIndividualEgg";
import ViewIndividualDeath from "./ViewIndividualDeath";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDove } from "@fortawesome/free-solid-svg-icons";
import ViewIndividualVaccination from "./ViewIndividualVaccination";

// STYLED COMPONENTS
const Container = styled("div")(({ theme }) => ({
    margin: "30px",
    [theme.breakpoints.down("sm")]: { margin: "16px" },
    "& .breadcrumb": {
        marginBottom: "30px",
        [theme.breakpoints.down("sm")]: { marginBottom: "16px" }
    }
}));

export default function ManageIndividualRecord() {
    const [view, setView] = useState('chicken');

    const handleViewChange = (event) => {
        setView(event.target.value);
    };

    return (
        <Container>
            <RecordManageCard>
                <Box display="flex" alignItems="center" mb={3}>
                    <Box>
                    <FontAwesomeIcon
                        icon={faDove}
                        color="#ECAE1F"
                        style={{ fontSize: '32px' }} 
                    />&nbsp;&nbsp;&nbsp;&nbsp;
                        <Button
                            variant={view === 'chicken' ? 'contained' : 'outlined'}
                            onClick={() => handleViewChange({ target: { value: 'chicken' } })}
                            sx={{
                                mr: 1,
                                backgroundColor: view === 'chicken' ? '#19B839' : 'transparent',
                                color: view === 'chicken' ? '#fff' : '#19B839',
                                borderColor: '#19B839',
                                '&:hover': {
                                    backgroundColor: view === 'chicken' ? '#17a832' : '#19B839',
                                    color: '#fff',
                                },
                            }}
                        >
                            Manage Chicken
                        </Button>
                        <Button
                            variant={view === 'bodyweight' ? 'contained' : 'outlined'}
                            onClick={() => handleViewChange({ target: { value: 'bodyweight' } })}
                            sx={{
                                mr: 1,
                                backgroundColor: view === 'bodyweight' ? '#19B839' : 'transparent',
                                color: view === 'bodyweight' ? '#fff' : '#19B839',
                                borderColor: '#19B839',
                                '&:hover': {
                                    backgroundColor: view === 'bodyweight' ? '#17a832' : '#19B839',
                                    color: '#fff',
                                },
                            }}
                        >
                             Bodyweight
                        </Button>
                        <Button
                            variant={view === 'intake' ? 'contained' : 'outlined'}
                            onClick={() => handleViewChange({ target: { value: 'intake' } })}
                            sx={{
                                mr: 1,
                                backgroundColor: view === 'intake' ? '#19B839' : 'transparent',
                                color: view === 'intake' ? '#fff' : '#19B839',
                                borderColor: '#19B839',
                                '&:hover': {
                                    backgroundColor: view === 'intake' ? '#17a832' : '#19B839',
                                    color: '#fff',
                                },
                            }}
                        >
                             Intake
                        </Button>
                        <Button
                            variant={view === 'egg' ? 'contained' : 'outlined'}
                            onClick={() => handleViewChange({ target: { value: 'egg' } })}
                            sx={{
                                mr: 1,
                                backgroundColor: view === 'egg' ? '#19B839' : 'transparent',
                                color: view === 'egg' ? '#fff' : '#19B839',
                                borderColor: '#19B839',
                                '&:hover': {
                                    backgroundColor: view === 'egg' ? '#17a832' : '#19B839',
                                    color: '#fff',
                                },
                            }}
                        >
                             Egg
                        </Button>

                        
                        <Button
                            variant={view === 'death' ? 'contained' : 'outlined'}
                            onClick={() => handleViewChange({ target: { value: 'death' } })}
                            sx={{
                                mr: 1,
                                backgroundColor: view === 'death' ? '#19B839' : 'transparent',
                                color: view === 'death' ? '#fff' : '#19B839',
                                borderColor: '#19B839',
                                '&:hover': {
                                    backgroundColor: view === 'death' ? '#17a832' : '#19B839',
                                    color: '#fff',
                                },
                            }}
                        >
                             Mortality
                        </Button>
                        <Button
                            variant={view === 'vaccine' ? 'contained' : 'outlined'}
                            onClick={() => handleViewChange({ target: { value: 'vaccine' } })}
                            sx={{
                                mr: 1,
                                backgroundColor: view === 'vaccine' ? '#19B839' : 'transparent',
                                color: view === 'vaccine' ? '#fff' : '#19B839',
                                borderColor: '#19B839',
                                '&:hover': {
                                    backgroundColor: view === 'vaccine' ? '#17a832' : '#19B839',
                                    color: '#fff',
                                },
                            }}
                        >
                             Vaccination
                        </Button>
                    </Box>
                </Box>

                <Box width="100%" overflow="auto">
                    {view === 'chicken' && <ViewIndividualChicken />}
                    {view === 'bodyweight' && <ViewIndividualBodyweight />}
                    {view === 'intake' && <ViewIndividualIntake />}
                    {view === 'egg' && <ViewIndividualEgg />}
                    {view === 'death' && <ViewIndividualDeath/>}
                    {view === 'vaccine' && <ViewIndividualVaccination/>}
                </Box>
            </RecordManageCard>
        </Container>
    );
}
