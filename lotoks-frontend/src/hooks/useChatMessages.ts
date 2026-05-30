
import { useState, useEffect, useCallback } from 'react';
import type { ChatMessage, OfflineFormData } from '@/types/chat';
import { SUPPORT_CONFIG, AUTO_REPLIES, DEFAULT_REPLY } from '@/config/support';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function getAutoReply(text: string): string {
  const lower = text.toLowerCase();
  for (const { keywords, reply } of AUTO_REPLIES) {
    if (keywords.some((kw) => lower.includes(kw))) return reply;
  }
  return DEFAULT_REPLY;
}

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  sender: 'system',
  text: '👋 Welcome to Lotoks Support! How can we help you today?',
  timestamp: new Date(),
};

function loadMessages(): ChatMessage[] {
  if (typeof window === 'undefined') return [WELCOME_MESSAGE];
  try {
    const raw = localStorage.getItem(SUPPORT_CONFIG.persistKey);
    if (!raw) return [WELCOME_MESSAGE];
    const parsed: ChatMessage[] = JSON.parse(raw);
    // Restore Date objects
    return parsed.map((m) => ({ ...m, timestamp: new Date(m.timestamp) }));
  } catch {
    return [WELCOME_MESSAGE];
  }
}

function saveMessages(messages: ChatMessage[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SUPPORT_CONFIG.persistKey, JSON.stringify(messages));
  } catch {
    // ignore storage errors
  }
}

export function useChatMessages() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load persisted messages on mount
  useEffect(() => {
    const stored = loadMessages();
    setMessages(stored);
    setIsLoaded(true);
  }, []);

  // Persist on every change (after initial load)
  useEffect(() => {
    if (isLoaded) saveMessages(messages);
  }, [messages, isLoaded]);

  const openChat = useCallback(() => {
    setIsOpen(true);
    setUnreadCount(0);
  }, []);

  const closeChat = useCallback(() => setIsOpen(false), []);

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const userMsg: ChatMessage = {
        id: generateId(),
        sender: 'user',
        text: trimmed,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);

      // Show typing indicator after autoReplyDelay - typingDelay
      const typingTimer = setTimeout(() => {
        setIsTyping(true);
      }, SUPPORT_CONFIG.autoReplyDelay - SUPPORT_CONFIG.typingDelay);

      // Send auto-reply
      const replyTimer = setTimeout(() => {
        setIsTyping(false);
        const replyMsg: ChatMessage = {
          id: generateId(),
          sender: 'support',
          text: getAutoReply(trimmed),
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, replyMsg]);
        if (!isOpen) setUnreadCount((c) => c + 1);
      }, SUPPORT_CONFIG.autoReplyDelay);

      return () => {
        clearTimeout(typingTimer);
        clearTimeout(replyTimer);
      };
    },
    [isOpen]
  );

  const submitOfflineForm = useCallback((_data: OfflineFormData) => {
    // In production: POST to your API endpoint
    // For now, just add a confirmation system message
    const confirmMsg: ChatMessage = {
      id: generateId(),
      sender: 'system',
      text: '✅ Message sent! We\'ll get back to you within 24 hours.',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, confirmMsg]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([WELCOME_MESSAGE]);
  }, []);

  return {
    messages,
    isOpen,
    unreadCount,
    isTyping,
    isLoaded,
    openChat,
    closeChat,
    sendMessage,
    submitOfflineForm,
    clearMessages,
  };
}
