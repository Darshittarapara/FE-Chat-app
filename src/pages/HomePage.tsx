import ChatContainer from "../components/ChatContainer"
import useChatStore from "../store/useChatStore"
import Sidebar from "../components/Sidebar"
import useAuthStore from "../store/useAuthStore"
import { useEffect } from "react"
import NoChatSelected from "../components/NoChatSelected"

const HomePage = () => {
  const { selectedUser } = useChatStore()
  const { authUser, connectSocket } = useAuthStore()

  useEffect(() => {
    if (authUser) {
      connectSocket();
    }
  }, [connectSocket, authUser])
  
  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg">
            
            {/* Sidebar - Hidden on mobile when user is selected, always visible on desktop */}
            <div className={`${selectedUser ? 'hidden' : 'block'} lg:inline-block`}>
              <Sidebar />
            </div>
            
            {/* ChatContainer - Hidden on mobile when no user selected, always visible on desktop */}
            <div className={`${selectedUser ? 'block' : 'hidden'}  lg:flex flex-1`}>
              {selectedUser ? <ChatContainer /> : <NoChatSelected/>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage