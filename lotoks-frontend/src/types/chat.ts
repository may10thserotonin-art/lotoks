export interface ChatMessage {
  id: string;
  sender: 'user' | 'support' | 'system';
  text: string;
  timestamp: Date;
}

export interface OfflineFormData {
  name: string;
  email: string;
  message: string;
}
