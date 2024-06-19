import Customer from '../models/customerModel.js';
import User from '../models/userModel.js';
import CustomerConversations from '../models/customerConversationModel.js';
import { io,getReceiverSocketId } from "../config/socket.js";

export const initializeCustomerChat = async (req, res) => {
  try {
    const { name, phone, admin } = req.body;
    console.log(name, phone, admin);

    // Check if the customer already exists
    let customer = await Customer.findOne({ phone });
    if (!customer) {
      customer = new Customer({ name, phone, admin });
      await customer.save();
    }

    // Find an ongoing conversation
    let conversation = await CustomerConversations.findOne({
      participants: { $all: [customer._id, admin] },
      isDone: false
    });

    // If there's no ongoing conversation, create a new one
    if (!conversation) {
      conversation = new CustomerConversations({
        participants: [customer._id, admin],
        participantModel: ['Customer', 'Admin'],
        isDone: false
      });
      await conversation.save();

      // Emit event to notify about the new conversation
      const receiverSocketId = getReceiverSocketId(admin);
      if (receiverSocketId) {
        // Emit the new message to the receiver if they are connected
        io.to(receiverSocketId).emit('newContact');
        console.log("Message sent to receiver", receiverSocketId);
      } else {
        console.log("Receiver not connected");
      }
    }

    res.status(201).json({ customerId: customer._id, conversationId: conversation._id, isDone: conversation.isDone });
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
export const markConversationAsDone = async (req, res) => {
  try {
    const conversationId = req.params.id;

    // Find the conversation by ID and update its isDone status to true
    let conversation = await CustomerConversations.findByIdAndUpdate(
      conversationId,
      { isDone: true },
      { new: true }
    );

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.status(200).json({ message: 'Conversation marked as done', conversation });
  } catch (error) {
    console.error("Error marking conversation as done:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const checkConversationStatus = async (req, res) => {
  try {
    const conversationId = req.params.id;

    // Find the conversation by ID
    let conversation = await CustomerConversations.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.status(200).json({ isDone: conversation.isDone });
  } catch (error) {
    console.error("Error checking conversation status:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};