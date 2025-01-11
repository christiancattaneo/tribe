export interface Notification {
  id: number;
  type: 'reaction' | 'reply';
  messageId: number;
  user: string;
  content: string;
  timestamp: string;
}

export interface Message {
  id: string;
  user: string;
  userImage?: string;
  content: string;
  timestamp: string;
  reactions: string[];
  replyCount: number;
  file?: {
    id: string;
    name: string;
    type: string;
    url: string;
  };
}

export interface DMMessages {
  [userPair: string]: Message[];
}

export interface ThreadMessage {
  id: string;
  user: string;
  content: string;
  timestamp: string;
  file?: {
    name: string;
    type: string;
    url: string;
  };
}

export interface Thread {
  id: string;
  messageId: string;
  messages: ThreadMessage[];
}

export interface User {
  id: string;
  name: string;
  status: string;
  statusMessage: string;
  profileImage?: string;
} 