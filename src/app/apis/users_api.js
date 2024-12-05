import axios from "axios";

const API_USER_URL = "http://127.0.0.1:8000/api/users";
const API_INST_URL = "http://127.0.0.1:8000/api/institute";
const token = localStorage.getItem('token');

// UPLOAD FILES
export const uploadFiles = async (imageFile, passportFile) => {
  try {
    const formData = new FormData();
    formData.append('files', imageFile);
    formData.append('files', passportFile);

    const response = await axios.post(`${API_USER_URL}/upload_files/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status >= 200 && response.status <= 299) {
      return response;
    } else {
      throw new Error("Network response was not ok");
    }
  } catch (error) {
    console.error("There was a problem uploading files:", error);
    throw error;
  }
};

// ADD USERS
export const addUser = async (formData) => {
  try {
    const response = await axios.post(`${API_USER_URL}/add/`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status >= 200 && response.status <= 299) {
      return response.data;
    } else {
      throw new Error("Network response was not ok");
    }
  } catch (error) {
    console.error("There was a problem submitting the form:", error);
    throw error;
  }
};

// GET USERS
export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_USER_URL}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// GET USER
export const getUser = async (userId) => {
  try {
    const response = await axios.get(`${API_USER_URL}/${userId}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

// GET HOW MANY INSTITUTE IS REGISTERED
export const get_institution_count = async () => {
  try {
    const response = await axios.get(`${API_INST_URL}/get_healthy_institution_count`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data
  } catch (error) {
    console.error('Error fetch the count of institute', error);
    throw error;
  }
}
// BLOCK USERS
export const blockUser = async (userId) => {
  try {
    const response = await axios.patch(`${API_USER_URL}/block/${userId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error('Error blocking user:', error);
    throw error;
  }
};

// APPROVE USER
export const approveUser = async (userId) => {
  try {
    const response = await axios.patch(`${API_USER_URL}/approve/${userId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error('Error approving user:', error);
    throw error;
  }
};

// DELETE USER
export const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(`${API_USER_URL}/user_retrieve/${userId}/`, {
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
