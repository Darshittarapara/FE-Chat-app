import ChatContainer from "../components/ChatContainer"
import useChatStore from "../store/useChatStore"
import Sidebar from "../components/Sidebar"
import useAuthStore from "../store/useAuthStore"
import { useEffect } from "react"

const HomePage = () => {
  const { selectedUser } = useChatStore()
  const { authUser, connectSocket } = useAuthStore()

  useEffect(() => {
    if (authUser) {
      connectSocket()
    }
  }, [connectSocket, authUser])
  
  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            
            {/* Sidebar - Hidden on mobile when user is selected, always visible on desktop */}
            <div className={`${selectedUser ? 'hidden' : 'block'} lg:block`}>
              <Sidebar />
            </div>
            
            {/* ChatContainer - Hidden on mobile when no user selected, always visible on desktop */}
            <div className={`${selectedUser ? 'block' : 'hidden'} lg:block flex-1`}>
              <ChatContainer />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage