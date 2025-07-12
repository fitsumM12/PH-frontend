import axios from 'axios';

// Base URL for your API

const BASEURL =  process.env.REACT_APP_API_BASE_URL
const CHICKEN_API_URL = `${BASEURL}/api/poultry/`;
const token = localStorage.getItem('token');


// HatcherRecord APIS
// ADD HatcherRecord
export const addHatcherRecord = async (formData) => {
    try {
        const response = await axios.post(`${HATCHERY_UNIT_API_URL}hatchery_record/add/`, formData, {
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

}

// FETCH ALL HatcherRecord
export const getHatcherRecords = async () => {
    try {
        const response = await axios.get(`${HATCHERY_UNIT_API_URL}hatchery_record/list/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        // console.log(response)/
        return response.data;
    } catch (error) {
        console.error('Error fetching hatchery_record:', error);
        throw error;
    }
};

// FETCH SINGLE HatcherRecord
export const getHatcherRecord = async (id) => {
    try {
        const response = await axios.get(`${HATCHERY_UNIT_API_URL}hatchery_record/hatchery_record/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching hatchery_record:', error);
        throw error;
    }
};



// DELETE HatcherRecord FROM THE DATABASE
export const deleteHatcherRecord = async (breed_id) => {
    try {
      const response = await axios.delete(`${HATCHERY_UNIT_API_URL}hatchery_record/delete/${breed_id}/`,  {
        headers: {
          Authorization: `Bearer ${token}`,  
        },
      });
      return response;
    } catch (error) {
      console.error('Error deleting hatchery_record:', error);
      throw error;
    }
  };

  // UPDATE HatcherRecord FUNCTION IN API CALLS
export const updateHatcherRecordInAPI = async (id, formData) => {
    try {
        const response = await axios.put(`${HATCHERY_UNIT_API_URL}hatchery_record/update/${id}/`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating hatchery_record:', error);
        throw error;
    }
};













// INCUBATION RECORD APIS
// ADD INCUBATION RECORD
export const addIncubationRecord = async (formData) => {
    try {
        const response = await axios.post(`${HATCHERY_UNIT_API_URL}incubation_record/add/`, formData, {
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

}

// FETCH ALL INCUBATION RECORD
export const getIncubationRecords = async () => {
    try {
        const response = await axios.get(`${HATCHERY_UNIT_API_URL}incubation_record/list/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        // console.log(response)/
        return response.data;
    } catch (error) {
        console.error('Error fetching incubation_record:', error);
        throw error;
    }
};

// FETCH SINGLE INCUBATION RECORD
export const getIncubationRecord = async (id) => {
    try {
        const response = await axios.get(`${HATCHERY_UNIT_API_URL}incubation_record/incubation_record/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching incubation_record:', error);
        throw error;
    }
};



// DELETE INCUBATION RECORD FROM THE DATABASE
export const deleteIncubationRecord = async (id) => {
    try {
      const response = await axios.delete(`${HATCHERY_UNIT_API_URL}incubation_record/delete/${id}/`,  {
        headers: {
          Authorization: `Bearer ${token}`,  
        },
      });
      return response;
    } catch (error) {
      console.error('Error deleting incubation_record:', error);
      throw error;
    }
  };

  // UPDATE INCUBATION RECORD FUNCTION IN API CALLS
export const updateIncubationRecordInAPI = async (id, formData) => {
    try {
        const response = await axios.put(`${HATCHERY_UNIT_API_URL}incubation_record/update/${id}/`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating incubation_record:', error);
        throw error;
    }
};






// HATCHERY SUMMARY RECORD APIS
// ADD HATCHERY SUMMARY
export const addHatcherSummary = async (formData) => {
    try {
        const response = await axios.post(`${HATCHERY_UNIT_API_URL}hatchery_summary/add/`, formData, {
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

}

// FETCH ALL HATCHERY SUMMARY
export const getHatcherSummarys = async () => {
    try {
        const response = await axios.get(`${HATCHERY_UNIT_API_URL}hatchery_summary/list/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        // console.log(response)/
        return response.data;
    } catch (error) {
        console.error('Error fetching hatchery_summary:', error);
        throw error;
    }
};

// FETCH SINGLE HATCHERY SUMMARY
export const getHatcherSummary= async (id) => {
    try {
        const response = await axios.get(`${HATCHERY_UNIT_API_URL}hatchery_summary/hatchery_summary/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching hatchery_summary:', error);
        throw error;
    }
};



// DELETE HATCHERY SUMMARY FROM THE DATABASE
export const deleteHatcherSummary = async (breed_id) => {
    try {
      const response = await axios.delete(`${HATCHERY_UNIT_API_URL}hatchery_summary/delete/${breed_id}/`,  {
        headers: {
          Authorization: `Bearer ${token}`,  
        },
      });
      return response;
    } catch (error) {
      console.error('Error deleting incubation_record:', error);
      throw error;
    }
  };

  // UPDATE HATCHERY SUMMARY FUNCTION IN API CALLS
export const updateHatcherSummaryInAPI = async (id, formData) => {
    try {
        const response = await axios.put(`${HATCHERY_UNIT_API_URL}hatchery_summary/update/${id}/`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating hatchery_summary:', error);
        throw error;
    }
};


