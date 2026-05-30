export type MessageSender = 'user' | 'support' | 'system';

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  text: string;
  timestamp: Date;
}

export interface ChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  unreadCount: number;
  isTyping: boolean;
}

export interface OfflineFormData {
  name: string;
  email: string;
  message: string;
}
