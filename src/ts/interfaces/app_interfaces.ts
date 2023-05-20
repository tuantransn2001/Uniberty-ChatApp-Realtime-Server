interface UserAttributes {
  db_id: string;
  chat_id: string;
  type: string;
  status: string;
  contactList: Array<UserAttributes>;
}

interface ConversationAttributes {
  id: string;
  members: Array<string>;
  messages: Array<{
    author: String;
    content: String;
    createdAt: Date;
  }>;
}

export { UserAttributes, ConversationAttributes };
