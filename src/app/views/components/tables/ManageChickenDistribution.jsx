import { useState } from "react";
import { Box, Button, styled } from "@mui/material";
import RecordManageCard from 'app/views/components/RecordManageCard';
// import ViewIndividualChicken from "./ViewIndividualChicken";
// import ViewIndividualIntake from "./ViewIndividualIntake";
import ViewRequester from "./ViewRequester";
import ViewChickenDistribution from "./ViewChickenDistribution";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDove } from "@fortawesome/free-solid-svg-icons";


// STYLED COMPONENTS
const Container = styled("div")(({ theme }) => ({
    margin: "30px",
    [theme.breakpoints.down("sm")]: { margin: "16px" },
    "& .breadcrumb": {
        marginBottom: "30px",
        [theme.breakpoints.down("sm")]: { marginBottom: "16px" }
    }
}));

export default function ManageChickenDistribution() {
    const [view, setView] = useState('chickendistribution');

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
                            variant={view === 'chickendistribution' ? 'contained' : 'outlined'}
                            onClick={() => handleViewChange({ target: { value: 'chickendistribution' } })}
                            sx={{
                                mr: 1,
                                backgroundColor: view === 'chickendistribution' ? '#19B839' : 'transparent',
                                color: view === 'chickendistribution' ? '#fff' : '#19B839',
                                borderColor: '#19B839',
                                '&:hover': {
                                    backgroundColor: view === 'chickendistribution' ? '#17a832' : '#19B839',
                                    color: '#fff',
                                },
                            }}
                        >
                            Manage Chicken Distribution
                        </Button>
                        <Button
                            variant={view === 'requester' ? 'contained' : 'outlined'}
                            onClick={() => handleViewChange({ target: { value: 'requester' } })}
                            sx={{
                                mr: 1,
                                backgroundColor: view === 'requester' ? '#19B839' : 'transparent',
                                color: view === 'requester' ? '#fff' : '#19B839',
                                borderColor: '#19B839',
                                '&:hover': {
                                    backgroundColor: view === 'requester' ? '#17a832' : '#19B839',
                                    color: '#fff',
                                },
                            }}
                        >
                             Requester
                        </Button>


                    </Box>
                </Box>

                <Box width="100%" overflow="auto">
                    {view === 'chickendistribution' && <ViewChickenDistribution />}
                    {view === 'requester' && <ViewRequester />}
                </Box>
            </RecordManageCard>
        </Container>
    );
}
