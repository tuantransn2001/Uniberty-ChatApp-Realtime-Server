import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    db_id: { type: String },
    chat_id: { type: String },
    type: { type: String },
    contactList: {
      type: [
        {
          type: String,
        },
      ],
    },
    status: {
      type: String,
      default: "offline",
    },
  },
  { timestamps: true, minimize: false }
);

const User = mongoose.model("User", UserSchema);

export default User;
