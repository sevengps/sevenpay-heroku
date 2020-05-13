const mongoose = require("mongoose");
const transactionSchema = new mongoose.Schema({
  totalAmount: {
    type: Number,
    required: true,
  },
  transactionDate: {
    type: Date,
    required: true,
  },
  gateway: {
    type: String,
    required: true,
  },
  platformId: {
    type: String,
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
  },
  transactionList: [
    {
      bill_ref: {
        type: Number,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
    },
  ],
});

const pendingTransactions = new mongoose.Schema({
  transactionList: [
    {
      bill_ref: {
        type: Number,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  transactionId: {
    type: Number,
    required: true,
  },
  apiKey: {
    type: String,
    required: true,
  },
  returnUrl: {
    type: String,
    required: true,
  },
  authHeader: {
    type: String,
    required: true,
  },
});

const paymentModels = {
  transactionSchema: mongoose.model(
    "paymentTransactionDetails",
    transactionSchema
  ),
  pendingTransactions: mongoose.model(
    "pendingTransactions",
    pendingTransactions
  ),
};

module.exports = paymentModels;
