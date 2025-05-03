// src/services/userService.ts
import API from '../api'; // using your existing axios instance

export const registerUser = (userData: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  return API.post('/users/register', userData);
};

export const loginUser = (credentials: { email: string; password: string }) => {
  return API.post('/users/login', credentials);
};
