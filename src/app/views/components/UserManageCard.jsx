import React from 'react';
import { Card, Box, styled, Grid } from "@mui/material";
import { faDove, faUsersGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
/////////////////////////////////
const CardRoot = styled(Card)({
    height: "100%",
    padding: "20px 24px"
});

const CardTitle = styled("div")(({ subtitle }) => ({
    fontSize: "1rem",
    fontWeight: "500",
    textTransform: "capitalize",
    marginBottom: !subtitle && "16px"
}));


const UserManageCard = ({ children, title, subtitle }) => {
  

    return (
        <CardRoot elevation={6} style={{
            padding: 20,
            borderRadius: 10,
            border: '1px solid rgba(95, 96, 164, 0.5)',
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}>
            <Grid container spacing={6}>
                <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                    <CardTitle subtitle={subtitle}><FontAwesomeIcon
                        icon={faUsersGear}
                        color="#ECAE1F"
                        style={{ fontSize: '32px' }} 
                    />&nbsp;&nbsp;&nbsp;&nbsp;{title}</CardTitle>
                </Grid>
                
            </Grid>
            {subtitle && <Box mb={2}>{subtitle}</Box>}
            {children}
        </CardRoot>
    );
};

export default UserManageCard;
