import axios from 'axios';

const API_URL =  'http://localhost:5000/api';

export const uploadResume = (formData) => {
  return axios.post(`${API_URL}/resume/parse`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};