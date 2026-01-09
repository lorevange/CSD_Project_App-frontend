import { useState, useEffect, useContext } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import DoctorProfile from "./pages/DoctorProfile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Appointments from "./pages/Appointments";
import VerifyEmail from "./pages/VerifyEmail";
import BottomNav from "./components/BottomNav";
import OfflinePage from "./components/OfflinePage";
import AuthBootstrap from './components/AuthBootstrap';
import { UserContext } from './context/UserContext';
import Spinner from './components/Spinner';

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { sessionExpired, setSessionExpired } = useContext(UserContext);

  useEffect(() => {
    if (!sessionExpired) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setSessionExpired(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [sessionExpired, setSessionExpired]);

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
      <Spinner
        show={sessionExpired}
        message="Your session has expired. Please sign in again."
      />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctors/search" element={<SearchResults />} />
        <Route path="/doctor/:id" element={<DoctorProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/appointments" element={<Appointments />} />
      </Routes>
      <BottomNav />
    </BrowserRouter>
  );
}



export default App;
