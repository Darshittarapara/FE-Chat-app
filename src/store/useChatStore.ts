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
            const res = await axiosInstance.get("messages/users");
            console.log(res.data, 'res.data')
            set({ users: res.data.data });
        } catch (error: any) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUsersLoading: false });
        }
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
        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        socket.off("newMessage"); // remove previous listener if exists

        socket.on("newMessage", (newMessage) => {
            set((state) => ({
                messages: [...state.messages, newMessage],
            }));
        });
    },
    unScribeToMessage: async () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;
        socket.off('newMessage')
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