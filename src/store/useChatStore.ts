import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axiosInstance";
import type { ChatStore } from "./model";
import useAuthStore from "./useAuthStore";

const useChatStore = create<ChatStore>((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    setSelectedUser(user) {
        set({ selectedUser: user })
    },
    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/users");
            console.log(res.data, 'res.data')
            set({ users: res.data.data });
        } catch (error: any) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },
    updateUnReadMessageCount: async () => {
        
        const socket = useAuthStore.getState().socket;
        const {users} = get()

        if(!socket) return;
        socket.on('unReadMessage', (updatedUserCount) => {
            const userIndex =users?.findIndex((user) => user._id ==updatedUserCount?._id);
            const newUsers =[...users];
            console.log(updatedUserCount,'updatedUserCount000')
            if(userIndex != -1) {
                newUsers[userIndex] = {...newUsers[userIndex],unreadCount:updatedUserCount.unreadCount }
                set({
                    users: newUsers
                })
            }
            console.log('user', newUsers)
        })
    },
    updateMessageCount: async () => {
        const socket = useAuthStore.getState().socket;
        const {users} = get()

        if(!socket) return;
        socket.on('updateduserscount', (updatedUserCount) => {
            console.log(updatedUserCount,users,'updatedUserCount')
            const userIndex =users?.findIndex((user) => user._id ==updatedUserCount?._id);
            const newUsers =[...users];
            if(userIndex != -1) {
                newUsers[userIndex] = {...updatedUserCount}
                set({
                    users: newUsers
                })
            }
            console.log('user', newUsers)
        })
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data.data });
        } catch (error: any) {
            toast.error(error.response.data.message);
        } finally {
            set({ isMessagesLoading: false });
        }
    },
    subscribeToMessage: () => {
        const {selectedUser} = get()
        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        socket.off("newMessage"); // remove previous listener if exists

        socket.on("newMessage", (newMessage) => {
               const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser?._id;
      if (!isMessageSentFromSelectedUser) return;
            set((state) => ({
                messages: [...state.messages, newMessage],
            }));
        });
    },
    markAsReadMessage: async (id) => {
      try {
        const response = await axiosInstance.put(`/messages/mark-read/${id}`);
        if(response) {
            console.log(response)
        }
      } catch (error) {
        console.log(error)
      }
    },
    unScribeToMessage: async () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;
        socket.off('newMessage');
        socket.off('unReadMessage')
    
        socket.off('updateduserscount')

    },
    sendMessage: async (data) => {
        set({ isMessagesLoading: true });
        try {
            const { messages, selectedUser } = get()
            const res = await axiosInstance.post(`/messages/${selectedUser?._id}`, data);
            console.log('test', res)
            set({ messages: [...messages, res.data.data] });

        } catch (error: any) {
            toast.error(error.response?.data.error ?? error?.message);
        } finally {
            set({ isMessagesLoading: false });
        }
    },
}))

export default useChatStore;