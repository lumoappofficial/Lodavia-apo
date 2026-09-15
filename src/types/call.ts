export type CallType = 'voice' | 'video';

export type CallStatus = 
  | 'incoming' 
  | 'calling' 
  | 'ringing' 
  | 'connecting' 
  | 'connected' 
  | 'reconnecting' 
  | 'poor_connection' 
  | 'ended' 
  | 'missed';

export interface CallParticipant {
  id: string;
  name: string;
  avatar: string;
  badge?: string;
  rank?: string;
  isMuted?: boolean;
  isVideoOff?: boolean;
  isSpeaking?: boolean;
}

export interface ActiveCallState {
  type: CallType;
  contactName: string;
  contactAvatar?: string;
  contactBadge?: string;
  contactRole?: string;
  status: CallStatus;
  isIncoming?: boolean;
  duration?: number;
  conversationId?: string;
  quality?: 'excellent' | 'good' | 'poor';
  resolution?: string;
  encryption?: string;
  callerId?: string;
}

export interface CallFilter {
  id: string;
  nameAr: string;
  nameEn: string;
  icon: string;
  cssFilter?: string;
  overlayClass?: string;
}

export interface VirtualBackground {
  id: string;
  nameAr: string;
  nameEn: string;
  thumbnail: string;
  backgroundUrl: string;
}

export interface InCallChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}
