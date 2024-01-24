import React from 'react';
import { useEffect } from "react"
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import HomePage from "./pages/HomePage";
import SubscriptionsPage from "./pages/SubscriptionsPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from './pages/SignUpPage';
import MyAccountPage from './pages/MyAccountPage';
import { AuthProvider } from './components/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  useEffect(() => {
    document.title = "Audio Converter"
  }, []);

  return (
    <AuthProvider>
      <Router>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/subscriptions" element={<SubscriptionsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/myaccount" element={
            <PrivateRoute>
              <MyAccountPage />
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
