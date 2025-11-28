import { useEffect, useRef } from "react";
import useChatStore from "../store/useChatStore";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import ChatHeader from "./chat/ChatHeader";
import MessageInput from "./chat/MessageInput";
import { formatMessageTime } from "../lib/helper";
import useAuthStore from "../store/useAuthStore";


const ChatContainer = () => {
  const { selectedUser, isMessagesLoading, getMessages, messages, subscribeToMessage, unScribeToMessage } = useChatStore();
  const { authUser } = useAuthStore()
  const messageRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser?._id as string);
    }
      subscribeToMessage()

    return () => unScribeToMessage()
  }, [selectedUser, getMessages, subscribeToMessage, unScribeToMessage])

  useEffect(() => {
       if(messageRef.current && messages) {
        messageRef.current?.scrollIntoView()
       }
  }, [messages])
  if (isMessagesLoading) return <MessageSkeleton />

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div  className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
           
            key={message._id}
            className={`chat ${message.senderId === authUser?._id ? "chat-end" : "chat-start"}`}
         ref={messageRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser!._id
                      ? authUser!.profilePic || "/avatar.png"
                      : selectedUser?.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.images.length > 0 && message.images.map((img) => {
                return <img
                  key={`${img}`}
                  src={img}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              })}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;
