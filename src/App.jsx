import { useState, useEffect, useContext } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import DoctorProfile from "./pages/DoctorProfile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import BottomNav from "./components/BottomNav";
import OfflinePage from "./components/OfflinePage";
import { UserContext } from './context/UserContext';
import { fetchCurrentUser } from './api/token';

const AuthBootstrap = () => {
  const { user, login, logout } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const token = localStorage.getItem('token');

    if (!token) {
      return;
    }

    const validateToken = async () => {
      try {
        const me = await fetchCurrentUser();
        if (me && !user) {
          login(me);
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }
        logout();
        navigate('/');
      }
    };

    validateToken();

    return () => {
      isMounted = false;
    };
  }, [login, logout, navigate, user]);

  return null;
};

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOnline) {
    return <OfflinePage />;
  }

  return (
    <BrowserRouter>
      <AuthBootstrap />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/doctor/:id" element={<DoctorProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <BottomNav />
    </BrowserRouter>
  );
}

 

export default App;
