import axios from 'axios';
import { sendMessageRoute, receiveMessageRoute, sendRatingRoute, getRatingRoute } from '../utils/ApiRoutes';

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
