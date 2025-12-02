import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import './Navigation.css';

function Navigation({ isLoggedIn, onLogout, username }) {
    const location = useLocation();
    const [showUsersDropdown, setShowUsersDropdown] = useState(false);

    const users = {
        1: { id: 1, name: 'Анна', role: 'Фронтенд разработчик', progress: 75 },
        2: { id: 2, name: 'Иван', role: 'Бэкенд разработчик', progress: 60 },
        3: { id: 3, name: 'Мария', role: 'Fullstack разработчик', progress: 85 }
    };

    const handleUserSelect = (user) => {
        setShowUsersDropdown(false);
        alert(`👤 ${user.name}\n🎯 Должность: ${user.role}\n📊 Прогресс: ${user.progress}%`);
    };

    return (
        <nav className="main-navigation">
            <div className="nav-brand">
                <Link to="/">
                    <h2>🚀 Трекер технологий</h2>
                </Link>
            </div>

            <ul className="nav-menu">
                <li>
                    <Link
                        to="/"
                        className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                    >
                        Главная
                    </Link>
                </li>
                
                {isLoggedIn ? (
                    <>
                        <li>
                            <Link
                                to="/technologies"
                                className={`nav-link ${location.pathname === '/technologies' ? 'active' : ''}`}
                            >
                                Технологии
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/statistics"
                                className={`nav-link ${location.pathname === '/statistics' ? 'active' : ''}`}
                            >
                                Статистика
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/settings"
                                className={`nav-link ${location.pathname === '/settings' ? 'active' : ''}`}
                            >
                                Настройки
                            </Link>
                        </li>
                        
                        {/* Вкладка пользователей для админа */}
                        {username === 'admin' && (
                            <li className="dropdown-container">
                                <button 
                                    className="nav-link dropdown-toggle"
                                    onClick={() => setShowUsersDropdown(!showUsersDropdown)}
                                >
                                    Пользователи
                                </button>
                                {showUsersDropdown && (
                                    <div className="dropdown-menu">
                                        {Object.values(users).map(user => (
                                            <div 
                                                key={user.id} 
                                                className="dropdown-item"
                                                onClick={() => handleUserSelect(user)}
                                            >
                                                <div className="user-name">{user.name}</div>
                                                <div className="user-details">
                                                    <span className="user-role">{user.role}</span>
                                                    <span className="user-progress">{user.progress}%</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </li>
                        )}
                        
                        <li className="user-info">
                            <span className="username">👤 {username}</span>
                            <button onClick={onLogout} className="logout-btn">
                                Выйти
                            </button>
                        </li>
                    </>
                ) : (
                    <li>
                        <Link
                            to="/login"
                            className={`nav-link login-link ${location.pathname === '/login' ? 'active' : ''}`}
                        >
                            Войти
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    );
}

export default Navigation;