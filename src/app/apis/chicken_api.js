import axios from 'axios';

// Base URL for your API
const CHICKEN_API_URL = 'http://127.0.0.1:8000/api/poultry/';
const token = localStorage.getItem('token');


// BREED APIS

// ADD BREED
export const addBreed = async (formData) => {
    try {
        const response = await axios.post(`${CHICKEN_API_URL}breed/add/`, formData, {
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

// FETCH ALL BREED
export const getBreeds = async () => {
    try {
        const response = await axios.get(`${CHICKEN_API_URL}breed/list/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        // console.log(response)/
        return response.data;
    } catch (error) {
        console.error('Error fetching breeds:', error);
        throw error;
    }
};

// FETCH SINGLE BREED
export const getBreed = async (breed_id) => {
    try {
        const response = await axios.get(`${CHICKEN_API_URL}breed/breed/${breed_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching breed:', error);
        throw error;
    }
};



// DELETE BREED FROM THE DATABASE
export const deleteBreed = async (breedID) => {
    try {
      const response = await axios.delete(`${CHICKEN_API_URL}breed/delete/${breedID}/`,  {
        headers: {
          Authorization: `Bearer ${token}`,  
        },
      });
      return response;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };

  // UPDATE BREED FUNCTION IN API CALLS
export const updateBreedInAPI = async (id, formData) => {
    try {
        const response = await axios.put(`${CHICKEN_API_URL}breed/update/${id}/`, formData, {
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


// HOUSE APIS

// ADD BREED
export const addHouse = async (formData) => {
    try {
        const response = await axios.post(`${CHICKEN_API_URL}house/add/`, formData, {
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

// FETCH ALL HOUSE
export const getHouses = async () => {
    try {
        const response = await axios.get(`${CHICKEN_API_URL}house/list/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        // console.log(response)/
        return response.data;
    } catch (error) {
        console.error('Error fetching houses:', error);
        throw error;
    }
};

// FETCH SINGLE HOUSE
export const getHouse = async (house_id) => {
    try {
        const response = await axios.get(`${CHICKEN_API_URL}house/house/${house_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching house:', error);
        throw error;
    }
};



// DELETE House FROM THE DATABASE
export const deleteHouse= async (houseID) => {
    try {
      const response = await axios.delete(`${CHICKEN_API_URL}house/delete/${houseID}/`,  {
        headers: {
          Authorization: `Bearer ${token}`,  
        },
      });
      return response;
    } catch (error) {
      console.error('Error deleting house:', error);
      throw error;
    }
  };

  // UPDATE HOUSE FUNCTION IN API CALLS
export const updateHouseInAPI = async (id, formData) => {
    try {
        const response = await axios.put(`${CHICKEN_API_URL}house/update/${id}/`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating house:', error);
        throw error;
    }
};