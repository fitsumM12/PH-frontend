import React from 'react';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Card, CardContent, Typography } from '@mui/material';
import ReportIcon from '@mui/icons-material/Report';
// PredictionResult Component
const PredictionResult = ({ data, eye }) => {
    const values = {
        0: 'Normal',
        1: 'Non Proliferative DR',
        2: 'Proliferative DR',
    };
    const maxIndex = data.indexOf(Math.max(...data));
    const result = values[maxIndex];

    return (
        <Card variant="outlined" sx={{ margin: 2 }}>
            <CardContent>
                <Typography variant="h6" component="div">
                    {eye.charAt(0).toUpperCase() + eye.slice(1)} Eye Diagnosis
                </Typography>
                <Typography variant="h7" color="#fa931d" sx={{ display: 'flex', alignItems: 'center'}}>
                   <ArrowForwardIosIcon sx={{color:'#fa931d', marginRight: 1, height:'20px' }}/> {result}
                </Typography>
            </CardContent>
        </Card>
    );
};

// AbnormalityDetection Component
const AbnormalityDetection = ({ leftData = [0], rightData = [0] }) => {    
    const maxIndexLeft = leftData.indexOf(Math.max(...leftData));
    const maxIndexRight = rightData.indexOf(Math.max(...rightData));
    const leftAbnormal = maxIndexLeft > 0;
    const rightAbnormal = maxIndexRight > 0;

    const abnormalityDetected = leftAbnormal || rightAbnormal;

    return (
        <Card variant="outlined" sx={{ margin: 2 }}>
            <CardContent>
                <Typography variant="h6" component="div">
                    Abnormality Detection
                </Typography>
                <Typography variant="body1">
                    {abnormalityDetected ? (
                        <div style={{ color: 'red', display: 'flex', alignItems: 'center' }}>
                            <ReportIcon sx={{ color: 'red', marginRight: 1 }} />
                            Abnormality has been detected.
                        </div>
                    ) : (
                        <div style={{ color: 'green', display: 'flex', alignItems: 'center' }}>
                        <ReportIcon sx={{ color: 'green', marginRight: 1 }} />
                        No abnormality detected.
                    </div>
                    )}
                </Typography>
            </CardContent>
        </Card>
    );
};



export { PredictionResult, AbnormalityDetection };
