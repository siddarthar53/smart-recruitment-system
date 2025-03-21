const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true,unique:true },
  phoneno: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["user", "admin"], // only allow 'user' or 'admin' roles
    default: "user",
  },
  // applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }] 
});

module.exports = mongoose.model("User", UserSchema);