import React from 'react';
import { Snackbar, Alert, Slide } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';

const NotificationSnackbar = ({ open, onClose, message, severity }) => {
    const getIcon = () => {
        switch (severity) {
            case 'success':
                return <CheckCircleIcon />;
            case 'error':
                return <ErrorIcon />;
            case 'warning':
                return <WarningIcon />;
            case 'info':
                return <InfoIcon />;
            default:
                return <InfoIcon />;
        }
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            TransitionComponent={Slide}
        >
            <Alert
                onClose={onClose}
                severity={severity}
                variant="filled"
                icon={getIcon()}
                sx={{
                    width: '100%',
                    '@media (max-width: 600px)': {
                        width: '90%',
                    },
                }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

export default NotificationSnackbar;