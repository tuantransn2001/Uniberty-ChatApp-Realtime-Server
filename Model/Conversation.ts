import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
  {
    id: { type: String },
    members: { type: [String] },
    messages: {
      type: [
        {
          author: { type: String },
          content: { type: String },
          createdAt: { type: Date },
        },
      ],
    },
  },
  { timestamps: true, minimize: false }
);

const Conversation = mongoose.model("Conversation", ConversationSchema);

export default Conversation;
