interface UserAttributes {
  db_id: string;
  chat_id: string;
  type: string;
  status: string;
  contactList: Array<UserAttributes>;
}

interface ConversationAttributes {
  id: string;
  name?: string;
  members: Array<{ id: string; type: string }>;
  messages: Array<{
    sender: {
      id: string;
      type: string;
    };
    content: String;
    createdAt?: Date;
    updatedAt?: Date;
  }>;
  createdAt?: Date;
  updatedAt?: Date;
}
interface ObjectDynamicValueAttributes {
  [key: string]: any;
}

export { UserAttributes, ConversationAttributes, ObjectDynamicValueAttributes };
