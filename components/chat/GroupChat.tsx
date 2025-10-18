import React, { useState, useRef, useEffect } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TextInput, 
  Pressable, 
  KeyboardAvoidingView,
  Platform 
} from "react-native";
import { getCompanyData } from "../swipecard/CompanyData";

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
  isInvestor: boolean;
}

interface GroupChatProps {
  companyID: string;
  onClose: () => void;
}

// Sample messages for demo
const SAMPLE_MESSAGES: Record<string, Message[]> = {
  "company_001": [
    {
      id: "1",
      text: "Welcome to TechFlow AI's investor chat! 🚀",
      sender: "TechFlow AI Team",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isInvestor: false,
    },
    {
      id: "2", 
      text: "Hi! I'm interested in learning more about your AI platform. What makes it different from competitors?",
      sender: "Sarah Chen",
      timestamp: new Date(Date.now() - 90 * 60 * 1000),
      isInvestor: true,
    },
    {
      id: "3",
      text: "Great question! Our platform uses proprietary machine learning algorithms that reduce workflow automation time by 70% compared to traditional solutions.",
      sender: "TechFlow AI Team",
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      isInvestor: false,
    },
    {
      id: "4",
      text: "What's your current customer acquisition cost and lifetime value?",
      sender: "Michael Rodriguez",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      isInvestor: true,
    },
  ],
  "company_002": [
    {
      id: "1",
      text: "Welcome to GreenTech Solutions investor discussion! 🌱",
      sender: "GreenTech Solutions",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      isInvestor: false,
    },
    {
      id: "2",
      text: "Excited to learn about your sustainable energy platform!",
      sender: "Emma Wilson",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isInvestor: true,
    },
  ],
  "company_003": [
    {
      id: "1",
      text: "HealthConnect investor chat is now live! 👩‍⚕️",
      sender: "HealthConnect Team",
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      isInvestor: false,
    },
    {
      id: "2",
      text: "What's your expansion plan for international markets?",
      sender: "David Kim",
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      isInvestor: true,
    },
  ],
  "company_004": [
    {
      id: "1",
      text: "Welcome to EduTech Pro's investor community! 📚",
      sender: "EduTech Pro",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      isInvestor: false,
    },
  ],
};

export function GroupChat({ companyID, onClose }: GroupChatProps) {
  const [messages, setMessages] = useState<Message[]>(SAMPLE_MESSAGES[companyID] || []);
  const [newMessage, setNewMessage] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);
  const companyData = getCompanyData(companyID);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage.trim(),
        sender: "You",
        timestamp: new Date(),
        isInvestor: true,
      };
      
      setMessages(prev => [...prev, message]);
      setNewMessage("");
      
      // Auto-scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    // Auto-scroll to bottom when messages change
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.companyName}>{companyData.name}</Text>
          <Text style={styles.participants}>{messages.filter(m => m.isInvestor).length + 1} participants</Text>
        </View>
        <Pressable style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
      </View>

      {/* Messages */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <View 
            key={message.id} 
            style={[
              styles.messageContainer,
              message.isInvestor ? styles.investorMessage : styles.companyMessage
            ]}
          >
            <View style={[
              styles.messageBubble,
              message.isInvestor ? styles.investorBubble : styles.companyBubble
            ]}>
              <Text style={[
                styles.messageText,
                message.isInvestor ? styles.investorText : styles.companyText
              ]}>
                {message.text}
              </Text>
              <View style={styles.messageFooter}>
                <Text style={styles.senderName}>{message.sender}</Text>
                <Text style={styles.timestamp}>{formatTime(message.timestamp)}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type your message..."
          placeholderTextColor="#9ca3af"
          multiline
          maxLength={500}
        />
        <Pressable 
          style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!newMessage.trim()}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  
  headerLeft: {
    flex: 1,
  },
  
  companyName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 2,
  },
  
  participants: {
    fontSize: 12,
    color: "#6b7280",
  },
  
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  
  closeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6b7280",
  },
  
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  
  messageContainer: {
    marginBottom: 12,
  },
  
  investorMessage: {
    alignItems: "flex-end",
  },
  
  companyMessage: {
    alignItems: "flex-start",
  },
  
  messageBubble: {
    maxWidth: "80%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
  },
  
  investorBubble: {
    backgroundColor: "#3b82f6",
    borderBottomRightRadius: 4,
  },
  
  companyBubble: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderBottomLeftRadius: 4,
  },
  
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  
  investorText: {
    color: "#ffffff",
  },
  
  companyText: {
    color: "#1f2937",
  },
  
  messageFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  
  senderName: {
    fontSize: 11,
    fontWeight: "600",
    opacity: 0.8,
  },
  
  timestamp: {
    fontSize: 11,
    opacity: 0.7,
    marginLeft: 8,
  },
  
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  
  textInput: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    fontSize: 14,
    color: "#1f2937",
    maxHeight: 100,
  },
  
  sendButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  
  sendButtonDisabled: {
    backgroundColor: "#d1d5db",
  },
  
  sendButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
});
