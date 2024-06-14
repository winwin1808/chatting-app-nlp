import Customer from '../models/customerModel.js';
import User from '../models/userModel.js';
import CustomerConversations from '../models/customerConversationModel.js';

export const initializeCustomerChat = async (req, res) => {
  try {
    const { name, phone, admin } = req.body;

    // Check if the customer already exists
    let customer = await Customer.findOne({ phone });
    if (!customer) {
      // Create a new customer if they don't exist
      customer = new Customer({ name, phone, admin });
      await customer.save();
    }

    // Check if a conversation already exists for this customer and admin
    let conversation = await CustomerConversations.findOne({ participants: { $all: [customer._id, customer.admin] } });
    if (!conversation) {
      // Create a new conversation if it doesn't exist
      conversation = new CustomerConversations({
        participants: [customer._id, admin],
        participantModel: ['Customer', 'Admin']
      });
      await conversation.save();
    }

    res.status(201).json({ customerId: customer._id, conversationId: conversation._id });
  } catch (error) {
    console.error("Error initializing customer chat:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllConversationCustomers = async (req, res) => {
  try {
    const { id } = req.params;

    // Try to find the admin user
    let user = await User.findById(id);
    let adminId = id; // Default to the provided ID

    if (user && user.admin) {
      adminId = user.admin; // Use the admin field if it exists
    }

    // Find conversations where the admin is a participant and isDone is false
    let conversations = await CustomerConversations.find({ participants: adminId, isDone: false })
    .populate({
      path: 'participants', // Populate only the first participant (Customer)
      model: 'Customer', // Use the Customer model
    });

    res.status(200).json(conversations);
  } catch (error) {
    console.error("Error getting all conversation customers:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};