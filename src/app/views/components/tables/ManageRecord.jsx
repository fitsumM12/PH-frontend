import { useState } from "react";
import { Box, Button, styled } from "@mui/material";
import RecordManageCard from 'app/views/components/RecordManageCard';
import ViewBreed from './ViewBreed';
import ViewHouse from './ViewHouse';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDove } from '@fortawesome/free-solid-svg-icons';
// STYLED COMPONENTS
const Container = styled("div")(({ theme }) => ({
    margin: "30px",
    [theme.breakpoints.down("sm")]: { margin: "16px" },
    "& .breadcrumb": {
        marginBottom: "30px",
        [theme.breakpoints.down("sm")]: { marginBottom: "16px" }
    }
}));

export default function ManageRecord() {
    const [view, setView] = useState('breed');

    const handleViewChange = (newView) => {
        setView(newView);
    };

    return (
        <Container>
            <RecordManageCard>
   
            <Box
  display="grid"
  gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(2, minmax(0, 150px))' }} // Two buttons per row on smaller screens and limit width on larger screens
  gap={2} // Add spacing between buttons
>

    

  <Button
    variant={view === 'breed' ? 'contained' : 'outlined'}
    onClick={() => handleViewChange('breed')}
    sx={{
      backgroundColor: view === 'breed' ? '#19B839' : 'transparent',
      color: view === 'breed' ? '#fff' : '#19B839',
      borderColor: '#19B839',
      '&:hover': {
        backgroundColor: view === 'breed' ? '#17a832' : '#19B839',
        color: '#fff',
      },
    }}
  >
    Manage Breed
  </Button>
  <Button
    variant={view === 'house' ? 'contained' : 'outlined'}
    onClick={() => handleViewChange('house')}
    sx={{
      backgroundColor: view === 'house' ? '#19B839' : 'transparent',
      color: view === 'house' ? '#fff' : '#19B839',
      borderColor: '#19B839',
      '&:hover': {
        backgroundColor: view === 'house' ? '#17a832' : '#19B839',
        color: '#fff',
      },
    }}
  >
    Manage House
  </Button>
</Box>





                <Box width="100%" overflow="auto">
                    {view === 'breed' && <ViewBreed />}
                    {view === 'house' && <ViewHouse />}
                </Box>
            </RecordManageCard>
        </Container>
    );
}
