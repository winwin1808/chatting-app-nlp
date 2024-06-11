import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const Customer = mongoose.model('Customer', customerSchema);
export default Customer;
