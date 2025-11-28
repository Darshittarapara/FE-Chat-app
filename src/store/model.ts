import { Socket, } from "socket.io-client";
export type AuthUser = {
  _id: string;
  fullName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  profilePic: string;
}
export type SignUpFormData = {
  email: string;
  fullName: string;
  password: string
}
export type Login = Omit<SignUpFormData, 'fullName'>
export type AuthStoreStates = {
  authUser: AuthUser | null
  error: string;
  setOnlineUsers: (onlineUser: any) => void
  socket: Socket | null
  onlineUsers: string[]
  updateProfile: (data: File) => Promise<void>
  isLoggingIn: boolean;
  isUpdatingProfile: boolean
  login: (formData: Login) => Promise<void>
  isLogoutprocessstart: boolean
  connectSocket: () => void
  disConnectSocket: () => void
  logOut: () => Promise<void>
  checkAuth: () => void
  signup: (formData: SignUpFormData) => void;
  isSigningUp: boolean;
  isCheckingAuth: boolean;
}

export type ThemeInitState = {
  theme: string;
  setTheme: (theme: string) => void
}

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  text: string;
  images: string[];
  createdAt: string;
}
export interface ChatUser {
  _id: string;
  fullName: string;
  email: string;
  profilePic?: string;
}
export interface ChatStore {
  messages: Message[];
  users: ChatUser[];
  subscribeToMessage: () => void;
  unScribeToMessage: () => void
  setSelectedUser: (user: ChatUser | null) => void
  selectedUser: ChatUser | null;
  sendMessage: (data: any) => Promise<void>
  isUsersLoading: boolean;
  isMessagesLoading: boolean;

  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
}
