import axios from 'axios';
// Base URL for your API

const BASEURL =  process.env.REACT_APP_API_BASE_URL
const CHICKEN_API_URL = `${BASEURL}/api/poultry/`;
const token = localStorage.getItem('token');


// CHICKEN APIS
// ADD CHICKEN
export const addChicken = async (formData) => {
    try {
        const response = await axios.post(`${CHICKEN_API_URL}chicken/add/`, formData, {
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
export const getChickens = async () => {
    try {
        const response = await axios.get(`${CHICKEN_API_URL}chicken/list/`, {
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
export const getChicken = async (chicken_id) => {
    try {
        const response = await axios.get(`${CHICKEN_API_URL}chicken/chicken/${chicken_id}`, {
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
export const deleteChicken = async (breed_id) => {
    try {
      const response = await axios.delete(`${CHICKEN_API_URL}chicken/delete/${breed_id}/`,  {
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
export const updateChickenInAPI = async (id, formData) => {
    try {
        const response = await axios.put(`${CHICKEN_API_URL}chicken/update/${id}/`, formData, {
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






















// BODY WEIGHT API
// ADD CHICKEN
export const addBodyweight = async (formData) => {
    try {
        const response = await axios.post(`${CHICKEN_API_URL}bodyweight/add/`, formData, {
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
export const getBodyweights = async () => {
    try {
        const response = await axios.get(`${CHICKEN_API_URL}bodyweight/list/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        // console.log(response)/
        return response.data;
    } catch (error) {
        console.error('Error fetching bodywieght:', error);
        throw error;
    }
};

// FETCH SINGLE CHICKEN
export const getBodyweight = async (chicken_id) => {
    try {
        const response = await axios.get(`${CHICKEN_API_URL}bodyweight/bodyweight/${chicken_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching bodywieght:', error);
        throw error;
    }
};



// DELETE CHICKEN FROM THE DATABASE
export const deleteBodyweight = async (breed_id) => {
    try {
      const response = await axios.delete(`${CHICKEN_API_URL}bodyweight/delete/${breed_id}/`,  {
        headers: {
          Authorization: `Bearer ${token}`,  
        },
      });
      return response;
    } catch (error) {
      console.error('Error deleting bodywieght:', error);
      throw error;
    }
  };

  // UPDATE CHICKEN FUNCTION IN API CALLS
export const updateBodyweightInAPI = async (id, formData) => {
    try {
        const response = await axios.put(`${CHICKEN_API_URL}bodyweight/update/${id}/`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating bodywieght:', error);
        throw error;
    }
};



// INDIVIDUAL VACCINATION  API
// ADD VACCINATION
export const addIndividualVaccination = async (formData) => {
    try {
        const response = await axios.post(`${CHICKEN_API_URL}individual_vaccine/add/`, formData, {
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

// FETCH ALL VACCINATION
export const getIndividualVaccinations = async () => {
    try {
        const response = await axios.get(`${CHICKEN_API_URL}individual_vaccine/list/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        // console.log(response)/
        return response.data;
    } catch (error) {
        console.error('Error fetching individual_vaccine:', error);
        throw error;
    }
};

// FETCH SINGLE VACCINATION
export const getIndividualVaccination = async (id) => {
    try {
        const response = await axios.get(`${CHICKEN_API_URL}individual_vaccine/individual_vaccine/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching individual_vaccine:', error);
        throw error;
    }
};

// DELETE GROUP VACCINATION FROM THE DATABASE
export const deleteIndividualVaccination = async (breed_id) => {
    try {
        const response = await axios.delete(`${CHICKEN_API_URL}individual_vaccine/delete/${breed_id}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        console.error('Error deleting individual_vaccine:', error);
        throw error;
    }
};

// UPDATE VACCINATION FUNCTION IN API CALLS
export const updateIndividualVaccinationInAPI = async (id, formData) => {
    try {
        const response = await axios.put(`${CHICKEN_API_URL}individual_vaccine/update/${id}/`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating individual_vaccine:', error);
        throw error;
    }
};














// INDIVIDUAL CHICKE INTAKE API
// ADD INTAKE
export const addIntake = async (formData) => {
    try {
        const response = await axios.post(`${CHICKEN_API_URL}intake/add/`, formData, {
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



// FETCH ALL INTAKE
export const getIntakes = async () => {
    try {
        const response = await axios.get(`${CHICKEN_API_URL}intake/list/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        // console.log(response)/
        return response.data;
    } catch (error) {
        console.error('Error fetching intake:', error);
        throw error;
    }
};

// FETCH SINGLE INTAKE
export const getIntake = async (chicken_id) => {
    try {
        const response = await axios.get(`${CHICKEN_API_URL}intake/intake/${chicken_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching intake:', error);
        throw error;
    }
};



// DELETE INTAKE FROM THE DATABASE
export const deleteIntake = async (breed_id) => {
    try {
      const response = await axios.delete(`${CHICKEN_API_URL}intake/delete/${breed_id}/`,  {
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

  // UPDATE INTAKE FUNCTION IN API CALLS
export const updateIntakeInAPI = async (id, formData) => {
    try {
        const response = await axios.put(`${CHICKEN_API_URL}intake/update/${id}/`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating intake:', error);
        throw error;
    }
};






// INDIVIDUAL EGG  API
// ADD EGG
export const addEgg = async (formData) => {
    try {
        const response = await axios.post(`${CHICKEN_API_URL}egg/add/`, formData, {
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

// FETCH ALL EGG
export const getEggs = async () => {
    try {
        const response = await axios.get(`${CHICKEN_API_URL}egg/list/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        // console.log(response)/
        return response.data;
    } catch (error) {
        console.error('Error fetching egg:', error);
        throw error;
    }
};

// FETCH SINGLE EGG
export const getEgg = async (egg_id) => {
    try {
        const response = await axios.get(`${CHICKEN_API_URL}egg/egg/${egg_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching egg:', error);
        throw error;
    }
};



// DELETE INTEGGAKE FROM THE DATABASE
export const deleteEgg= async (breed_id) => {
    try {
      const response = await axios.delete(`${CHICKEN_API_URL}egg/delete/${breed_id}/`,  {
        headers: {
          Authorization: `Bearer ${token}`,  
        },
      });
      return response;
    } catch (error) {
      console.error('Error deleting egg:', error);
      throw error;
    }
  };

  // UPDATE EGG FUNCTION IN API CALLS
export const updateEggInAPI = async (id, formData) => {
    try {
        const response = await axios.put(`${CHICKEN_API_URL}egg/update/${id}/`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating egg:', error);
        throw error;
    }
};

















// INDIVIDUAL DEATH API
// ADD DEATH
export const addIndividualDeath= async (formData) => {
    try {
        const response = await axios.post(`${CHICKEN_API_URL}individual_death/add/`, formData, {
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

// FETCH ALL EGG
export const getIndividualDeaths = async () => {
    try {
        const response = await axios.get(`${CHICKEN_API_URL}individual_death/list/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        // console.log(response)/
        return response.data;
    } catch (error) {
        console.error('Error fetching individual_death:', error);
        throw error;
    }
};

// FETCH SINGLE EGG
export const getIndividualDeath = async (id) => {
    try {
        const response = await axios.get(`${CHICKEN_API_URL}individual_death/individual_death/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching individual_death:', error);
        throw error;
    }
};



// DELETE individual_death FROM THE DATABASE
export const deleteIndividualDeath = async (id) => {
    try {
      const response = await axios.delete(`${CHICKEN_API_URL}individual_death/delete/${id}/`,  {
        headers: {
          Authorization: `Bearer ${token}`,  
        },
      });
      return response;
    } catch (error) {
      console.error('Error deleting individual_death:', error);
      throw error;
    }
  };

  // UPDATE EGG FUNCTION IN API CALLS
export const updateIndividualDeathInAPI = async (id, formData) => {
    try {
        const response = await axios.put(`${CHICKEN_API_URL}individual_death/update/${id}/`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating individual_death:', error);
        throw error;
    }
};