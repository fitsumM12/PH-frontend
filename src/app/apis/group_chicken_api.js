import axios from 'axios';
import { useHistory } from 'react-router-dom';

// Base URL for your API
const CHICKEN_API_URL = 'http://127.0.0.1:8000/api/poultry/';
const token = localStorage.getItem('token');


// GroupChicken APIS
// ADD GroupChicken
export const addGroupChicken = async (formData) => {
    try {
        const response = await axios.post(`${CHICKEN_API_URL}group_chicken/add/`, formData, {
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
// FETCH ALL GroupChicken
export const getGroupChickens = async () => {
    try {
        const response = await axios.get(`${CHICKEN_API_URL}group_chicken/list/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching chickens:', error);
        throw error;
    }
};
// FETCH SINGLE GroupChicken
export const getGroupChicken = async (chicken_id) => {
    try {
        const response = await axios.get(`${CHICKEN_API_URL}group_chicken/group_chicken/${chicken_id}`, {
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
// DELETE GroupChicken FROM THE DATABASE
export const deleteGroupChicken = async (breed_id) => {
    try {
        const response = await axios.delete(`${CHICKEN_API_URL}group_chicken/delete/${breed_id}/`, {
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
// UPDATE GroupChicken FUNCTION IN API CALLS
export const updateGroupChickenInAPI = async (id, formData) => {
    try {
        const response = await axios.put(`${CHICKEN_API_URL}group_chicken/update/${id}/`, formData, {
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
// ADD BODYWEIGHT
export const addGroupBodyweight = async (formData) => {
    try {
        const response = await axios.post(`${CHICKEN_API_URL}group_bodyweight/add/`, formData, {
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
// FETCH ALL CHICKEN BODYWEIGHT
export const getGroupBodyweights = async () => {
    try {
        const response = await axios.get(`${CHICKEN_API_URL}group_bodyweight/list/`, {
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
// FETCH SINGLE CHICKEN BODYWEIGHT
export const getGroupBodyweight = async (chicken_id) => {
    try {
        const response = await axios.get(`${CHICKEN_API_URL}group_bodyweight/group_bodyweight/${chicken_id}`, {
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
// DELETE CHICKEN BODY WEIGHT FROM THE DATABASE
export const deleteGroupBodyweight = async (breed_id) => {
    try {
        const response = await axios.delete(`${CHICKEN_API_URL}group_bodyweight/delete/${breed_id}/`, {
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
// UPDATE CHICKEN BODYWEIGHT FUNCTION IN API CALLS
export const updateGroupBodyweightInAPI = async (id, formData) => {
    try {
        const response = await axios.put(`${CHICKEN_API_URL}group_bodyweight/update/${id}/`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating group bodywieght:', error);
        throw error;
    }
};






// GROUP CHICKE INTAKE API
// ADD INTAKE
export const addGroupIntake = async (formData) => {
    try {
        const response = await axios.post(`${CHICKEN_API_URL}group_intake/add/`, formData, {
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
export const getGroupIntakes = async () => {
    try {
        const response = await axios.get(`${CHICKEN_API_URL}group_intake/list/`, {
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
export const getGroupIntake = async (chicken_id) => {
    try {
        const response = await axios.get(`${CHICKEN_API_URL}group_intake/group_intake/${chicken_id}`, {
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
export const deleteGroupIntake = async (breed_id) => {
    try {
        const response = await axios.delete(`${CHICKEN_API_URL}group_intake/delete/${breed_id}/`, {
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
export const updateGroupIntakeInAPI = async (id, formData) => {
    try {
        const response = await axios.put(`${CHICKEN_API_URL}group_intake/update/${id}/`, formData, {
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






// GROUP EGG  API
// ADD EGG
export const addGroupEgg = async (formData) => {
    try {
        const response = await axios.post(`${CHICKEN_API_URL}group_egg/add/`, formData, {
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
export const getGroupEggs = async () => {
    try {
        const response = await axios.get(`${CHICKEN_API_URL}group_egg/list/`, {
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
export const getGroupEgg = async (egg_id) => {
    try {
        const response = await axios.get(`${CHICKEN_API_URL}group_egg/group_egg/${egg_id}`, {
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

// DELETE GROUP EGG FROM THE DATABASE
export const deleteGroupEgg = async (breed_id) => {
    try {
        const response = await axios.delete(`${CHICKEN_API_URL}group_egg/delete/${breed_id}/`, {
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
export const updateGroupEggInAPI = async (id, formData) => {
    try {
        const response = await axios.put(`${CHICKEN_API_URL}group_egg/update/${id}/`, formData, {
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



















// GROUP CULLING  API
// ADD CULLING
export const addGroupCulling = async (formData) => {
    try {
        const response = await axios.post(`${CHICKEN_API_URL}group_culling/add/`, formData, {
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

// FETCH ALL CULLING
export const getGroupCullings = async () => {
    try {
        const response = await axios.get(`${CHICKEN_API_URL}group_culling/list/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        // console.log(response)/
        return response.data;
    } catch (error) {
        console.error('Error fetching culling:', error);
        throw error;
    }
};

// FETCH SINGLE CULLING
export const getGroupCulling = async (id) => {
    try {
        const response = await axios.get(`${CHICKEN_API_URL}group_culling/group_culling/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching culling:', error);
        throw error;
    }
};

// DELETE GROUP CULLING FROM THE DATABASE
export const deleteGroupCulling = async (breed_id) => {
    try {
        const response = await axios.delete(`${CHICKEN_API_URL}group_culling/delete/${breed_id}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        console.error('Error deleting culling:', error);
        throw error;
    }
};

// UPDATE CULLING FUNCTION IN API CALLS
export const updateGroupCullingInAPI = async (id, formData) => {
    try {
        const response = await axios.put(`${CHICKEN_API_URL}group_culling/update/${id}/`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating culling:', error);
        throw error;
    }
};






// GROUP DEATH  API
// ADD DEATH
export const addGroupDeath = async (formData) => {
    try {
        const response = await axios.post(`${CHICKEN_API_URL}group_death/add/`, formData, {
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

// FETCH ALL DEATH
export const getGroupDeaths = async () => {
    try {
        const response = await axios.get(`${CHICKEN_API_URL}group_death/list/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        // console.log(response)/
        return response.data;
    } catch (error) {
        console.error('Error fetching death:', error);
        throw error;
    }
};

// FETCH SINGLE DEATH
export const getGroupDeath = async (id) => {
    try {
        const response = await axios.get(`${CHICKEN_API_URL}group_death/group_death/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching death:', error);
        throw error;
    }
};

// DELETE GROUP DEATH FROM THE DATABASE
export const deleteGroupDeath = async (breed_id) => {
    try {
        const response = await axios.delete(`${CHICKEN_API_URL}group_death/delete/${breed_id}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        console.error('Error deleting death:', error);
        throw error;
    }
};

// UPDATE DEATH FUNCTION IN API CALLS
export const updateGroupDeathInAPI = async (id, formData) => {
    try {
        const response = await axios.put(`${CHICKEN_API_URL}group_death/update/${id}/`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        console.log(response)
        return response.data;
    } catch (error) {
        console.error('Error updating death:', error);
        throw error;
    }
};











// GROUP DEATH  API
// ADD DEATH
export const addGroupReplacement = async (formData) => {
    try {
        const response = await axios.post(`${CHICKEN_API_URL}group_replacement/add/`, formData, {
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

// FETCH ALL DEATH
export const getGroupReplacements = async () => {
    try {
        const response = await axios.get(`${CHICKEN_API_URL}group_replacement/list/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        // console.log(response)/
        return response.data;
    } catch (error) {
        console.error('Error fetching replacement:', error);
        throw error;
    }
};

// FETCH SINGLE DEATH
export const getGroupReplacement = async (id) => {
    try {
        const response = await axios.get(`${CHICKEN_API_URL}group_replacement/group_replacement/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching replacement:', error);
        throw error;
    }
};

// DELETE GROUP DEATH FROM THE DATABASE
export const deleteGroupReplacement = async (breed_id) => {
    try {
        const response = await axios.delete(`${CHICKEN_API_URL}group_replacement/delete/${breed_id}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        console.error('Error deleting replacement:', error);
        throw error;
    }
};

// UPDATE DEATH FUNCTION IN API CALLS
export const updateGroupReplacementInAPI = async (id, formData) => {
    try {
        const response = await axios.put(`${CHICKEN_API_URL}group_replacement/update/${id}/`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating replacement:', error);
        throw error;
    }
};















// GROUP VACCINATION  API
// ADD VACCINATION
export const addGroupVaccination = async (formData) => {
    try {
        const response = await axios.post(`${CHICKEN_API_URL}group_vaccine/add/`, formData, {
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
export const getGroupVaccinations = async () => {
    try {
        const response = await axios.get(`${CHICKEN_API_URL}group_vaccine/list/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        // console.log(response)/
        return response.data;
    } catch (error) {
        console.error('Error fetching group_vaccine:', error);
        throw error;
    }
};

// FETCH SINGLE VACCINATION
export const getGroupVaccination = async (id) => {
    try {
        const response = await axios.get(`${CHICKEN_API_URL}group_vaccine/group_vaccine/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching group_vaccine:', error);
        throw error;
    }
};

// DELETE GROUP VACCINATION FROM THE DATABASE
export const deleteGroupVaccination = async (breed_id) => {
    try {
        const response = await axios.delete(`${CHICKEN_API_URL}group_vaccine/delete/${breed_id}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        console.error('Error deleting group_vaccine:', error);
        throw error;
    }
};

// UPDATE VACCINATION FUNCTION IN API CALLS
export const updateGroupVaccinationInAPI = async (id, formData) => {
    try {
        const response = await axios.put(`${CHICKEN_API_URL}group_vaccine/update/${id}/`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating group_vaccine:', error);
        throw error;
    }
};