import dotenv from 'dotenv';

dotenv.config();

export const host = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_PROD_HOST : process.env.REACT_APP_DEV_HOST;
export const loginRoute = `${host}/api/auth/login`;
export const registerRoute = `${host}/api/auth/register`;
export const logoutRoute = `${host}/api/auth/logout`;
export const allUsersRoute = `${host}/api/user/allusers`;
export const sendMessageRoute = `${host}/api/messages/sendMessage`;
export const receiveMessageRoute = `${host}/api/messages/getMessage`;
export const setAvatarRoute = `${host}/api/user/setavatar`;