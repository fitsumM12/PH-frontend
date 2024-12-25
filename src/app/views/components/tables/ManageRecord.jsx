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
  display="inline-flex" // Use inline-flex to align the icon and buttons in a row
  alignItems="center" // Vertically align items to center
  gap={2} // Add spacing between the icon and buttons
>
  {/* Icon on the left */}
  <Box
    sx={{
      display: "inline-flex",
    }}
  >
    <FontAwesomeIcon
      icon={faDove}
      color="#ECAE1F"
      style={{ fontSize: '32px' }}
    />
  </Box>

  {/* Buttons next to the icon */}
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
