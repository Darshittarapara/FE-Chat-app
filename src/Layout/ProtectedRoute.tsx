import  { useEffect } from 'react'
import useAuthStore from '../store/useAuthStore'
import Loader from '../components/Loader';
import { Outlet, useNavigate } from 'react-router-dom';

const ProtectedRoute = () => {
  const { isCheckingAuth, authUser } = useAuthStore();
  
  const navigator = useNavigate()

  useEffect(() => {
    if (!authUser) {
      navigator('/login')
    }
  }, [authUser, navigator]);

  if (isCheckingAuth) return <Loader />


  return (
    <div>
     
      {<Outlet/>}
    </div>
  )
}

export default ProtectedRoute