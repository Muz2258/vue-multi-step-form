import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/form',
});

export const getFormSchema = () => api.get('/schema');
export const submitForm = (data) => api.post('/submit', data);
