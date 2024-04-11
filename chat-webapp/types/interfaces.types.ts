export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  createdAt: string;
  lastUpdatedAt: string;
  bio: string;
}

export interface Chat {
  cid?: string;
  createdAt: string;
  lastMessage: string;
  members: string[];
  updatedAt: string;
  unreadCount: number;
}

export interface Message {
  id?: string;
  chatId: string;
  content: string;
  sender: string;
  receiver: string;
  createdAt: string;
}
