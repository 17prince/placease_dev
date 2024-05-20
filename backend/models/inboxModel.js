const mongoose = require("mongoose");

const inboxSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "Students",
    required: [true, "Token must belong to a user"],
  },
  tokens: {
    access_token: String,
    refresh_token: String,
    token_type: String,
    scope: String,
    expiry_date: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Inbox", inboxSchema);
