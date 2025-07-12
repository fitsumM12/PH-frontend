import axios from 'axios';
// Base URL for your API

const BASEURL =  process.env.REACT_APP_API_BASE_URL
const CHICKEN_API_URL = `${BASEURL}/api/poultry/`;
const token = localStorage.getItem('token');


// CHICKEN APIS
// ADD CHICKEN
export const addChickenDistribution = async (formData) => {
    try {
        const response = await axios.post(`${CHICKEN_API_URL}chickendistribution/add/`, formData, {
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

// FETCH ALL CHICKEN
export const getChickenDistributions = async () => {
    try {
        const response = await axios.get(`${CHICKEN_API_URL}chickendistribution/list/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        // console.log(response)/
        return response.data;
    } catch (error) {
        console.error('Error fetching chickens:', error);
        throw error;
    }
};

// FETCH SINGLE CHICKEN
export const getChickenDistribution = async (id) => {
    try {
        const response = await axios.get(`${CHICKEN_API_URL}chickendistribution/chickendistribution/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching chicken:', error);
        throw error;
    }
};



// DELETE CHICKEN FROM THE DATABASE
export const deleteChickenDistribution = async (id) => {
    try {
      const response = await axios.delete(`${CHICKEN_API_URL}chickendistribution/delete/${id}/`,  {
        headers: {
          Authorization: `Bearer ${token}`,  
        },
      });
      return response;
    } catch (error) {
      console.error('Error deleting chicken:', error);
      throw error;
    }
  };

  // UPDATE CHICKEN FUNCTION IN API CALLS
export const updateChickenDistributionInAPI = async (id, formData) => {
    try {
        const response = await axios.put(`${CHICKEN_API_URL}chickendistribution/update/${id}/`, formData, {
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
