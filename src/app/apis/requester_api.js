import axios from 'axios';
// Base URL for your API

const BASEURL =  process.env.REACT_APP_API_BASE_URL
const REQUESTER_API_URL = `${BASEURL}/api/poultry/`;
const token = localStorage.getItem('token');




// REQUESTER API
// ADD REQUESTER
export const addRequester = async (formData) => {
    try {
        const response = await axios.post(`${REQUESTER_API_URL}requester/add/`, formData, {
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

// FETCH ALL REQUESTER
export const getRequesters = async () => {
    try {
        const response = await axios.get(`${REQUESTER_API_URL}requester/list/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        // console.log(response)/
        return response.data;
    } catch (error) {
        console.error('Error fetching requester:', error);
        throw error;
    }
};




// FETCH SINGLE REQUESTER
export const getRequester = async (requester_id) => {
    try {
        const response = await axios.get(`${REQUESTER_API_URL}requester/requester/${requester_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching requester:', error);
        throw error;
    }
};



// DELETE REQUESTER FROM THE DATABASE
export const deleteRequester = async (requester_id) => {
    try {
      const response = await axios.delete(`${REQUESTER_API_URL}requester/delete/${requester_id}/`,  {
        headers: {
          Authorization: `Bearer ${token}`,  
        },
      });
      return response;
    } catch (error) {
      console.error('Error deleting intake:', error);
      throw error;
    }
  };

  // UPDATE REEQUEST FUNCTION IN API CALLS
  export const updateRequesterInAPI = async (id, formData) => {
    try {
        const response = await axios.put(`${REQUESTER_API_URL}requester/update/${id}/`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating requester:', error);
        throw error;
    }
};
