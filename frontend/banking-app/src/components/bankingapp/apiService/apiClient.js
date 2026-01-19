import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://localhost:8081/api/accounts', // backend base URL
  headers: { 'Content-Type': 'application/json' }
});
