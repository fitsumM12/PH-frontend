import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar, Typography, Grid, Paper } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  avatar: {
    width: theme.spacing(12),
    height: theme.spacing(12),
    margin: 'auto',
    marginBottom: theme.spacing(2),
  },
}));

const ProfilePage = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
              <PersonIcon fontSize="large" />
            </Avatar>
            <Typography variant="h4" gutterBottom>
              John Doe
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Web Developer
            </Typography>
            <Typography variant="body1">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Ut enim ad minim veniam, quis nostrud exercitation ullamco
              laboris nisi ut aliquip ex ea commodo consequat.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default ProfilePage;
