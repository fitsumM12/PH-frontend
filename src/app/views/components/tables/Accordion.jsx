import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import Fade from '@mui/material/Fade';
import { Card, CardContent, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { Box } from "@mui/material";
const useStyles = makeStyles((theme) => ({
    card: {
        maxWidth: "100%",
        margin: "auto",
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
    },
    image: {
        width: "100%",
        height: "auto",
        maxHeight: "200px",
    },
}));

export default function AccordionTransition({ data }) {
    const [expanded, setExpanded] = React.useState(false);

    const handleExpansion = () => {
        setExpanded((prevExpanded) => !prevExpanded);
    };
    const classes = useStyles();

    const Severity = {
        0: "No diabetic retinopathy",
        1: "Non proliferative diabetic retinopathy",
        2: "Proliferative diabetic retinopathy",
    };

    const largestIndex = (predictions) => {
        if (!predictions || predictions.length === 0 || !predictions[0] || predictions[0].length === 0) {
            return -1;
        }

        let largestIndex = 0;
        for (let i = 1; i < predictions[0].length; i++) {
            if (predictions[0][i] > predictions[0][largestIndex]) {
                largestIndex = i;
            }
        }
        return largestIndex;
    };
    return (
        <div>
            <Accordion
                expanded={expanded}
                onChange={handleExpansion}
                slots={{ transition: Fade }}
                slotProps={{ transition: { timeout: 400 } }}
                sx={[
                    expanded
                        ? {
                            '& .MuiAccordion-region': {
                                height: 'auto',
                            },
                            '& .MuiAccordionDetails-root': {
                                display: 'block',
                            },
                        }
                        : {
                            '& .MuiAccordion-region': {
                                height: 0,
                            },
                            '& .MuiAccordionDetails-root': {
                                display: 'none',
                            },
                        },
                ]}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                >
                    <Typography variant="h6" align="left" gutterBottom style={{ color: '#191970' }}>
                        {`${data.first_name} ${data.last_name}`}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box sx={{ p: 2, border: '1px dashed blue', borderRadius: '5px', marginBottom: 2, boxShadow: 5 }}>
                        <Grid container spacing={2} justifyContent="flex" >
                            <Grid item xs={12} sm={6} md={6} lg={6}>

                                <Typography variant="subtitle1" align="left" gutterBottom>
                                    {`${data.gender}, ${data.birthdate}`}
                                </Typography>
                                <Typography variant="subtitle1" align="left" gutterBottom>
                                    {`Email: ${data.email}`}
                                </Typography>
                                <Typography variant="subtitle1" align="left" gutterBottom>
                                    {`Mobile: ${data.mobile}`}
                                </Typography>
                                <Typography variant="subtitle1" align="left" gutterBottom>
                                    {`Job: ${data.job}`}
                                </Typography>
                            </Grid><Grid item xs={12} sm={6} md={6} lg={6}>

                                <Typography variant="subtitle1" align="left" gutterBottom>
                                    {`Region: ${data.region}`}
                                </Typography>
                                <Typography variant="subtitle1" align="left" gutterBottom>
                                    {`Zone: ${data.zone}`}
                                </Typography>
                                <Typography variant="subtitle1" align="left" gutterBottom>
                                    {`Kebele: ${data.kebele}`}
                                </Typography>
                                <Typography variant="subtitle1" align="left" gutterBottom>
                                    {`Screening Date: ${data.record_date}`}
                                </Typography>
                                <Typography variant="subtitle1" align="left" gutterBottom>
                                    {`Right Eye: ${Severity[largestIndex(data.right_eye_prediction)] ? Severity[largestIndex(data.right_eye_prediction)] : "Not Scanned"}`}
                                </Typography>
                                <Typography variant="subtitle1" align="left" gutterBottom>
                                    {`Left Eye: ${Severity[largestIndex(data.left_eye_prediction)] ? Severity[largestIndex(data.left_eye_prediction)] : "Not Scanned"}`}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}
