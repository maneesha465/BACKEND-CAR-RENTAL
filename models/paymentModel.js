
import mongoose from 'mongoose';



const paymentSessionSchema = new mongoose.Schema({
  booking:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'booking',
    required: true,
  },

  paymentMethod:{
    type: String,
    enum: ['Credit Card', 'Debit Card', 'PayPal', 'Net Banking'],
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },

  transactionId: {
    type: String,
    unique: true,
    required: true,
},
currency: {
    type: String,
    default: 'IND',
},
paymentDate: {
    type: Date,
    default: Date.now,
},

receiptUrl: {
    type: String,
},
}, {
timestamps: true,
});
export const PaymentSession = mongoose.model('PaymentSession', paymentSessionSchema);


