import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
  {
    id: { type: String },
    name: { type: String },
    members: {
      type: [
        {
          id: { type: String },
          type: { type: String },
        },
      ],
    },
    messages: {
      type: [
        {
          sender: { id: { type: String }, type: { type: String } },
          content: { type: String },
          createdAt: { type: Date },
          updatedAt: { type: Date },
        },
      ],
    },
    createdAt: { type: Date },
    updatedAt: { type: Date },
  },
  { timestamps: true, minimize: false }
);

const Conversation = mongoose.model("Conversation", ConversationSchema);

export default Conversation;
