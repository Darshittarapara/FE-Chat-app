import { create } from "zustand";
import type { AuthStoreStates } from "./model";
import { axiosInstance } from "../lib/axiosInstance";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const useAuthStore = create<AuthStoreStates>((set, get) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    socket: null,
    onlineUsers: [],
    isLogoutprocessstart: false,
    isUpdatingProfile: false,
    isLoggingIn: false,
    error: '',
    setOnlineUsers: (onlineUser) => {
        set({ onlineUsers: onlineUser })
    },
    login: async (data) => {
        set({ isLoggingIn: true });
        const { connectSocket } = get()
        try {
            const res = await axiosInstance.post('auth/login', data);

            if (res) {
                toast.success('User login sucessfully');

                set({ authUser: res?.data });
                connectSocket()
            }
        } catch (error: any) {
            console.log(error, 'error')
            set({ error: error?.response?.data?.error ?? error?.message })
        } finally {
            set({ isLoggingIn: false })
        }

    },
    logOut: async () => {
        set({ isLogoutprocessstart: true });
        const { disConnectSocket } = get()

        try {
            await axiosInstance.post('auth/logout', {})
            disConnectSocket()
        } catch (error) {
            console.log(error);
        } finally {
            set({ isLogoutprocessstart: false });

        }
    },
    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post('auth/signup', data);
            console.log(res, 'res');
            if (res) {
                toast.success('User Register sucessfully');

                set({ authUser: res.data });
            }
        } catch (error: any) {
            console.log(error, 'error')
            set({ error: error?.response?.data?.error ?? error?.message })
        } finally {
            set({ isSigningUp: false })
        }

    },
    updateProfile: async (file) => {
        try {
            set({ isUpdatingProfile: true })
            const formData = new FormData();
            formData.append('profilePic', file)

            const res = await axiosInstance.post(`auth/updateProfile`, formData);
            console.log(res, 'res')
            if (res) {
                set({ authUser: res.data.user });
                toast.success('Profile updated successfully')
            }
        } catch (error) {
            console.log(error);
        } finally {
            set({ isUpdatingProfile: false })
        }
    },
    checkAuth: async () => {
        try {
            set({ isCheckingAuth: true })

            const res = await axiosInstance.get(`auth/check-auth`);
            console.log(res, 'res')
            if (res) {
                set({ authUser: res.data.user })
            }
        } catch (error) {
            console.log(error);
            set({ authUser: null })
        } finally {
            set({ isCheckingAuth: false })
        }
    },

    connectSocket: async () => {
        const { authUser, socket } = get()
        if (!authUser || socket) return;
        const newSocket = io(import.meta.env.VITE_SOCKET_BASE_URL, {
            query: {
                userId: authUser?._id
            },
            autoConnect: true, // auto connect
            reconnection: true,
        });

        newSocket.connect()
        set({ socket: newSocket });
        newSocket.on('getOnlineUser', (users) => {
            set({ onlineUsers: users })
        })
    },
    disConnectSocket: () => {
        const { socket } = get();
        socket?.on('getOnlineUser', (users) => {
            set({ onlineUsers: users })
        })
        socket?.disconnect();

    }
}))

export default useAuthStore;