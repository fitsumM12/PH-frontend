import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
export const ResponseDrawer = ({ data }) => {
  const { _, predictions } = data;
  const [descriptionLetters, setDescriptionLetters] = useState("");
  const [diagnosisLetters, setDiagnosisLetters] = useState("");

  const largestIndex = (predictions) => {
    if (predictions[0].length === 0) {
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

  const description = {
    0: "Absence of diabetic retinopathy signs, indicating a healthy retina unaffected by diabetes-related changes.",
    1: "Early stages of retinal damage characterized by microaneurysms, hemorrhages, and hard exudates, without proliferation of new blood vessels.",
    2: "The most severe stage, marked by the proliferation of new and abnormal blood vessels on the retina or optic disc, increasing the risk of vision-threatening complications.",
  };

  const diagnosis = {
    0: "Regular eye exams are recommended to monitor for any changes in eye health. Maintain good control of blood sugar levels, blood pressure, and cholesterol to reduce the risk of developing retinopathy.",
    1: "Continue regular eye exams to monitor progression. Optimize blood sugar control through diet, exercise, and medication as advised by a healthcare professional. Consider laser treatment or injections to manage swelling or abnormal blood vessels if necessary.",
    2: "Urgent referral to an ophthalmologist is recommended for further evaluation and management. Treatment options may include laser surgery, intravitreal injections, or vitrectomy to prevent vision loss and manage complications.",
  };
  useEffect(() => {
    const descriptionInterval = setInterval(() => {
      setDescriptionLetters((prevState) => {
        const fullDescription = description[largestIndex(predictions)];
        const currentLength = prevState.length;
        if (currentLength < fullDescription.length) {
          return fullDescription.substring(0, currentLength + 1);
        } else {
          clearInterval(descriptionInterval);
          return prevState;
        }
      });
    }, 50);

    const diagnosisInterval = setInterval(() => {
      setDiagnosisLetters((prevState) => {
        const fullDiagnosis = diagnosis[largestIndex(predictions)];
        const currentLength = prevState.length;
        if (currentLength < fullDiagnosis.length) {
          return fullDiagnosis.substring(0, currentLength + 1);
        } else {
          clearInterval(diagnosisInterval);
          return prevState;
        }
      });
    }, 50);

    return () => {
      clearInterval(descriptionInterval);
      clearInterval(diagnosisInterval);
    };
  }, []);

  return (
    <Grid container spacing={2} sx={{ marginTop: 10 }}>
      <Grid item lg={6} sm={12} xs={12} sx={{ mt: 2 }}>
        <div style={{ textAlign: "left" }}>
          <h2>Symptoms:</h2>
          {descriptionLetters}
        </div>
      </Grid>
      <Grid item lg={6} sm={12} xs={12} sx={{ mt: 2 }}>
        <div>
          <h2>Diagnosis:</h2>
          {diagnosisLetters}
        </div>
      </Grid>
    </Grid>
  );
};
