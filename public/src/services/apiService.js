import axios from 'axios';
import { 
  sendMessageRoute, 
  receiveMessageRoute, 
  sendRatingRoute, 
  getRatingRoute, 
  createUserRoute, 
  getAllSubUsersRoute, 
  updateUserRoute, 
  deleteUserRoute,
  getAllRatingRoute,
  allUsersRoute
} from '../utils/ApiRoutes';

export const fetchMessages = async (chatId, token) => {
  const response = await axios.post(`${receiveMessageRoute}/${chatId}`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchRatings = async (chatId, token) => {
  const response = await axios.post(`${getRatingRoute}/${chatId}`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const sendMessage = async (chatId, message, token) => {
  await axios.post(`${sendMessageRoute}/${chatId}`, { message }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const sendRating = async (chatId, rating, content, token) => {
  await axios.post(`${sendRatingRoute}/${chatId}`, { star: rating, content }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// CRUD User API Calls
export const getAllSubUsers = async (token) => {
  const response = await axios.get(getAllSubUsersRoute, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createSubUser = async (subUser, token) => {
  const response = await axios.post(createUserRoute, subUser, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateSubUser = async (userId, subUser, token) => {
  const response = await axios.put(updateUserRoute(userId), subUser, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteSubUser = async (userId, token) => {
  const response = await axios.delete(deleteUserRoute(userId), {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchAllRatings = async (filters, token) => {
  const response = await axios.post(getAllRatingRoute, filters, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

//Get all users
export const fetchAllUsers = async (token, currentUserId) => {
  const response = await axios.get(`${allUsersRoute}/${currentUserId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};