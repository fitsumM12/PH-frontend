import React from 'react';
import { Card, Box, styled, Grid, Button } from "@mui/material";
import useAppContext from 'app/hooks/useAppContext';
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
    const { state, dispatch } = useAppContext();
    const updateState = () => {
        dispatch({ type: 'TOGGLE_ADD_NEW_USER', payload: false });
        dispatch({ type: 'TOGGLE_VIEW_ALL_USER', payload: true });
        dispatch({ type: 'TOGGLE_VIEW_USER', payload: false });
    };

    return (
        <CardRoot elevation={6}>
            <Grid container spacing={6}>
                <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                    <CardTitle subtitle={subtitle}>{title}</CardTitle>
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2, justifyContent: 'flex-end', display: 'flex' }}>
                    <>
                        <Button onClick={updateState}> {state.add_new_user ? (<p>View All</p>) : (<p>Add New User</p>)}</Button>
                    </>

                </Grid>
            </Grid>
            {subtitle && <Box mb={2}>{subtitle}</Box>}
            {children}
        </CardRoot>
    );
};

export default UserManageCard;
