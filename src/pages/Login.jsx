import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // Простая проверка (в реальном приложении был бы запрос к API)
        if (username === 'admin' && password === 'password') {
            // Сохраняем данные авторизации
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            
            // Обновляем состояние в App
            onLogin(username);
            
            // Перенаправляем на главную
            navigate('/');
        } else {
            setError('Неверное имя пользователя или пароль. Попробуйте admin/password');
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <h1>🔐 Вход в систему</h1>
                    <p>Для доступа к полному функционалу трекера технологий</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {error && (
                        <div className="error-message">
                            ⚠️ {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="username">Имя пользователя:</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Введите имя пользователя"
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Пароль:</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Введите пароль"
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary login-btn">
                        Войти
                    </button>

                    <div className="login-hint">
                        <p><strong>Тестовые данные для входа:</strong></p>
                        <div className="credentials">
                            <div className="credential-item">
                                <span className="credential-label">👑 Админ:</span>
                                <span className="credential-value">admin / password</span>
                            </div>
                            <p className="admin-feature">
                                У админа есть доступ к разделу "Пользователи" в навигации
                            </p>
                        </div>
                    </div>

                    <div className="login-footer">
                        <p>
                            Вернуться на <Link to="/" className="footer-link">главную страницу</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;