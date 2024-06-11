import Customer from '../models/customerModel.js';
import Conversation from '../models/conversationModel.js';

export const initializeCustomerChat = async (req, res) => {
  try {
    const { name, phone } = req.body;

    // Check if the customer already exists
    let customer = await Customer.findOne({ phone });
    if (!customer) {
      // Create a new customer if they don't exist
      customer = new Customer({ name, phone });
      await customer.save();
    }

    // Check if a conversation already exists for this customer
    let conversation = await Conversation.findOne({ participants: customer._id });
    if (!conversation) {
      // Create a new conversation if it doesn't exist
      conversation = new Conversation({ participants: [customer._id] });
      await conversation.save();
    }

    res.status(201).json({ customerId: customer._id, conversationId: conversation._id });
  } catch (error) {
    console.error("Error initializing customer chat:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
