export const host = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_PROD_HOST : process.env.REACT_APP_DEV_HOST;
//User API Routes
export const loginRoute = `${host}/api/auth/login`;
export const registerRoute = `${host}/api/auth/register`;
export const logoutRoute = `${host}/api/auth/logout`;
export const allUsersRoute = `${host}/api/user/allusers`;

//Message API Routes
export const sendMessageRoute = `${host}/api/userMessages/sendMessage`;
export const receiveMessageRoute = `${host}/api/userMessages/getMessage`;
export const sendRatingRoute = `${host}/api/userMessages/sendRating`;
export const getRatingRoute = `${host}/api/userMessages/getRating`;
export const sendRatingRequestRoute = `${host}/api/userMessages/sendRatingRequest`;
export const setAvatarRoute = `${host}/api/user/setavatar`;

// CRUD User API Routes
export const createUserRoute = `${host}/api/user/sub-users`;
export const getAllSubUsersRoute = `${host}/api/user/sub-users`;
export const updateUserRoute = (userId) => `${host}/api/user/sub-users/${userId}`;
export const deleteUserRoute = (userId) => `${host}/api/user/sub-users/${userId}`;

//Report API Routes
export const getAllRatingRoute = `${host}/api/report/getAllRatings`;