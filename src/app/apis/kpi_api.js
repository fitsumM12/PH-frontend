import axios from 'axios';

// Base URL for your API
const CHICKEN_API_URL = 'http://127.0.0.1:8000/api/poultry/kpi/';
const token = localStorage.getItem('token');


// GROUP APIS

export const getMonthlyGroupEgg = async () => {
    try {
        const response = await axios.get(`${CHICKEN_API_URL}fetch_egg_production_per_group_api/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching breeds:', error);
        throw error;
    }
};



export const getMonthlyGroupFeedIntakeRefusal = async () => {
    try {
        const response = await axios.get(`${CHICKEN_API_URL}fetch_feed_intake_refusal_per_group_api/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching breeds:', error);
        throw error;
    }
};


export const getMonthlyGroupDeath = async () => {
    try {
        const response = await axios.get(`${CHICKEN_API_URL}fetch_death_per_group_api/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching breeds:', error);
        throw error;
    }
};


export const getMonthlyGroupCulling = async () => {
    try {
        const response = await axios.get(`${CHICKEN_API_URL}fetch_culling_per_group_api/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching breeds:', error);
        throw error;
    }
};


export const getMonthlyGroupReplacement = async () => {
    try {
        const response = await axios.get(`${CHICKEN_API_URL}fetch_replacement_per_group_api/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching breeds:', error);
        throw error;
    }
};

export const getMonthlyGroupBodyweight = async () => {
    try {
        const response = await axios.get(`${CHICKEN_API_URL}fetch_body_weight_per_group_api/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching breeds:', error);
        throw error;
    }
};

export const getMonthlyGroupVaccination = async () => {
    try {
        const response = await axios.get(`${CHICKEN_API_URL}fetch_vaccination_count_per_group_api/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching breeds:', error);
        throw error;
    }
};
export const getMonthlyGroupCount = async () => {
    try {
        const response = await axios.get(`${CHICKEN_API_URL}count_chicken_groups_api/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching breeds:', error);
        throw error;
    }
};




export const getMonthlyIndividualEgg = async () => {
    try {
        const response = await axios.get(`${CHICKEN_API_URL}fetch_egg_production_per_individual_chicken_api/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching breeds:', error);
        throw error;
    }
};

export const getMonthlyIndividualFeedIntakeRefusal = async () => {
    try {
        const response = await axios.get(`${CHICKEN_API_URL}fetch_feed_intake_refusal_per_individual_chicken_api/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching breeds:', error);
        throw error;
    }
};



export const getMonthlyIndividualBodyweight = async () => {
    try {
        const response = await axios.get(`${CHICKEN_API_URL}fetch_body_weight_per_individual_chicken_api/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching breeds:', error);
        throw error;
    }
};


export const getMonthlyIndividualVaccination = async () => {
    try {
        const response = await axios.get(`${CHICKEN_API_URL}fetch_vaccination_count_per_individual_chicken_api/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching breeds:', error);
        throw error;
    }
};

// FETCH INDIVIDUAL DEATH COUNT

export const getMonthlyIndividualDeathCount = async () => {
    try {
        const response = await axios.get(`${CHICKEN_API_URL}fetch_individual_death_count/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("Death Count API Response: ", response.data); // Log the response

        return response.data;
    } catch (error) {
        console.error('Error fetching individual death count:', error);
        throw error;
    }
};
// export const getMonthlyIndividualDeathCount = async () => {
//     try {
//         const response = await axios.get(`${CHICKEN_API_URL}fetch_individual_death_count/`, {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         });
//         console.log("Death Count API Response: ", response.data);
        
//         // Return individual_death_count directly
//         return response.data.individual_death_count || 0;
//     } catch (error) {
//         console.error("Error fetching individual death count:", error);
//         throw error;
//     }
// };

// FETCH MONTHLY CHICKEN DATA
export const getMonthlyChickenData = async () => {
    try {
        const response = await axios.get(`${CHICKEN_API_URL}fetch_monthly_chicken_data_api/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching monthly chicken data:', error);
        throw error;
    }
};

// export const getMonthlyIndividualDeath = async () => {
//     try {
//         const response = await axios.get(`${CHICKEN_API_URL}fetch_death_count_per_individual_chicken_api/`, {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             }
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching breeds:', error);
//         throw error;
//     }
// };



export const getMonthlyIndividualCount = async () => {
    try {
        const response = await axios.get(`${CHICKEN_API_URL}count_individual_chickens_api/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching breeds:', error);
        throw error;
    }
};



