import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    fullName: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    avatar: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "Avatar",
    },
    address: { type: String, required: false, default: "" },
    city: { type: String, required: false, default: "" },
    state: { type: String, required: false, default: "" },
    zipCode: { type: String, required: false, default: "" },
  },
  {
    timestamp: true,
  }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
