import React, { createContext, useContext, useState } from 'react';
import NotificationSnackbar from '../components/NotificationSnackbar';

const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'info',
    });

    const showNotification = (message, severity = 'info') => {
        setNotification({
            open: true,
            message,
            severity,
        });
    };

    const hideNotification = () => {
        setNotification((prev) => ({
            ...prev,
            open: false,
        }));
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            <NotificationSnackbar
                open={notification.open}
                onClose={hideNotification}
                message={notification.message}
                severity={notification.severity}
            />
        </NotificationContext.Provider>
    );
};