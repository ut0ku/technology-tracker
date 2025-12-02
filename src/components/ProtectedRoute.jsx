import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, isLoggedIn }) {
    // Если пользователь не авторизован, перенаправляем на страницу входа
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    // Если авторизован, показываем защищенный контент
    return children;
}

export default ProtectedRoute;