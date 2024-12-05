import axios from 'axios';

// Base URL for your API
const API_PATIENT_URL = 'http://127.0.0.1:8000/api/patients/';
const token = localStorage.getItem('token');



// MAKE THE PREDICTION API
export const predictImage = async (formData) => {
  try {
    const response = await axios.post(`${API_PATIENT_URL}predict_image/`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error predicting image:', error);
    throw error;
  }
};

// TO ADD THE DATAFORM PLUGIN
export const submitFormData = async (formData) => {
  try {
    const response = await axios.post(`${API_PATIENT_URL}add/`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting form data:', error);
    throw error;
  }
};



// ADDING AN IMAGE AND PREDICTIONS
export const submitImageAndPrediction = async (formData) => {
  try {
    const response = await axios.post(`${API_PATIENT_URL}add_image_predictions/`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding predictions:', error);
    throw error;
  }
};


export const submitPhysicianDecision = async (formData) => {
  try {
    const response = await axios.post(`${API_PATIENT_URL}addphysiciandecision/`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding predictions:', error);
    throw error;
  }
};

export const fetchPatientForDoctor = async (in_id) => {
  try {
    const response = await axios.get(`${API_PATIENT_URL}doctor/${in_id}/`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching patients for doctor:', error);
    throw error;
  }
};



// FETCH INDIVIDUAL PATIENTS API
export const fetchPatient = async (p_id) => {
  try {
    const response = await axios.get(`${API_PATIENT_URL}${p_id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching patient:', error);
    throw error;
  }
};


// UPDATE PATIENT FUNCTION IN API CALLS
export const updatePatientInAPI = async (id, formData) => {
  try {
    const response = await axios.put(`${API_PATIENT_URL}update/${id}/`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating breed:', error);
    throw error;
  }
};
export const fetchPatientById = async (id) => {
  try {
    const response = await axios.get(`${API_PATIENT_URL}getprediction/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching patient by ID:', error);
    throw error;
  }
};

export const getPatientsCount = async () => {
  try {
    const response = await axios.get(`${API_PATIENT_URL}count_patients_json/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching patient by ID:', error);
    throw error;
  }
};

export const genderCount = async () => {
  try {
    const response = await axios.get(`${API_PATIENT_URL}gender_count/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching patient by ID:', error);
    throw error;
  }
};

export const newandreturning = async () => {
  try {
    const response = await axios.get(`${API_PATIENT_URL}new_vs_returning_patients/`, {
      headers:{
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error){
    console.error('Error fetching new and returning patients:', error);
    throw error;
  }
}


export const monthlyPatientCount = async (year) => {
  try {
    const response = await axios.get(`${API_PATIENT_URL}monthly_patient_count/${year}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching monthly patient trend', error);
    throw error;
  }
};

export const monthlyPredictionCount = async(year)=>{
  try {
    const response = await axios.get(`${API_PATIENT_URL}predictions_by_month/${year}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching monthly patient trend', error);
    throw error;
  }
};