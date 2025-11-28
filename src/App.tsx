import {  Route, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import Setting from './pages/Setting'
import ProfilePage from './pages/ProfilePage'
import { Suspense, useEffect } from 'react'
import Loader from './components/Loader'
import useAuthStore from './store/useAuthStore'
import Login from './pages/auth/Login'
import SignUpPage from './pages/auth/Signup'
import ProtectedRoute from './Layout/ProtectedRoute'
import useThemeStore from './store/useThemeStore'
import Navbar from './components/Navbar'

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const {theme} = useThemeStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isCheckingAuth && !authUser) {
    return <Loader />
  }

  return (
    <div data-theme={theme} className='h-screen overflow-auto'>
       <Navbar/>
      <Suspense fallback={<Loader />}>
        <Routes>
           <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUpPage />} />
          <Route element = {<ProtectedRoute/>} path='/'>
            <Route element={<HomePage />} index />
            <Route element={<ProfilePage />} path='profile' />
          </Route>
           <Route element={<Setting />} path='/settings' />
         
        </Routes>
      </Suspense>
    </div>
  )
}

export default App
