import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import TechnologyList from './pages/TechnologyList';
import TechnologyDetail from './pages/TechnologyDetail';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import Login from './pages/Login';
import './App.css';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const user = localStorage.getItem('username') || '';
        setIsLoggedIn(loggedIn);
        setUsername(user);
    }, []);

    const handleLogin = (user) => {
        setIsLoggedIn(true);
        setUsername(user);
    };

    const handleLogout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        setUsername('');
    };

    return (
        <Router>
            <div className="App">
                <Navigation 
                    isLoggedIn={isLoggedIn} 
                    onLogout={handleLogout} 
                    username={username} 
                />
                
                <div className="main-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login onLogin={handleLogin} />} />
                        
                        <Route path="/technologies" element={
                            <ProtectedRoute isLoggedIn={isLoggedIn}>
                                <TechnologyList />
                            </ProtectedRoute>
                        } />
                        
                        <Route path="/technology/:techId" element={
                            <ProtectedRoute isLoggedIn={isLoggedIn}>
                                <TechnologyDetail />
                            </ProtectedRoute>
                        } />
                        
                        <Route path="/statistics" element={
                            <ProtectedRoute isLoggedIn={isLoggedIn}>
                                <Statistics />
                            </ProtectedRoute>
                        } />
                        
                        <Route path="/settings" element={
                            <ProtectedRoute isLoggedIn={isLoggedIn}>
                                <Settings />
                            </ProtectedRoute>
                        } />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;