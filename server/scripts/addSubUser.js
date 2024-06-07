import mongoose from 'mongoose';
import User from '../models/userModel.js'; 
import bcrypt from 'bcrypt'; // Adjust the path to your User model

// Connect to the database
mongoose.connect('mongodb://localhost:27017/chatting-app-test', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Specific user data
const userData = {
  username: 'winwin1707',
  email: 'test1707@gmail.com',
  password: '123123123',
  role: 'user',
  admin: new mongoose.Types.ObjectId("6662d81cb135cb33a0f8e32c") // Provided admin ID
};

const createSpecificUser = async () => {
  try {
    // Encrypt the password
    const encryptedPassword = await bcrypt.hash(userData.password, 10);

    // Create the user in the database
    const newUser = await User.create({
      username: userData.username,
      email: userData.email,
      password: encryptedPassword,
      role: userData.role,
      admin: userData.admin,
    });

    console.log('User created successfully:', newUser);

    // Close the connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error creating user:', error);
    mongoose.connection.close();
  }
};

createSpecificUser();
