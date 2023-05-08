import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    id: { type: String },
    name: { type: String },
    password: { type: String },
    type: { type: String },
    contactList: { type: [String] },
    status: {
      type: String,
      default: "offline",
    },
  },
  { timestamps: true, minimize: false }
);

const User = mongoose.model("User", UserSchema);

export default User;
