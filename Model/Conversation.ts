import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema({
  id: { type: String },
  createdAt: { type: Date },
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
});

const Conversation = mongoose.model("Conversation", ConversationSchema);

export default Conversation;

//    id: 12345,
//   time: time,
//   members: ['user1', 'user2'],
//   messages: [
//     {
//        sender: 'user1',
//        message: 'Hello World',
//        timestamp: time
//     },
//     {
//        sender: 'user1',
//        message: 'Hello World',
//        timestamp: time
//     }],
//  total_messages: 2
