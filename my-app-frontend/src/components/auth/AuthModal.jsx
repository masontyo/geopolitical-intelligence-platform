import React, { useState } from 'react';
import {
  Box,
  Modal,
  Backdrop,
  Fade,
  Container
} from '@mui/material';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthModal = ({ open, onClose, onAuthSuccess, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode);

  const handleSwitchToRegister = () => {
    setMode('register');
  };

  const handleSwitchToLogin = () => {
    setMode('login');
  };

  const handleAuthSuccess = (user) => {
    onAuthSuccess?.(user);
    onClose();
  };

  const handleClose = () => {
    setMode(initialMode);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
        sx: { backgroundColor: 'rgba(0, 0, 0, 0.3)' }
      }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Fade in={open}>
        <Container maxWidth="sm">
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            py: 2
          }}>
            {mode === 'login' ? (
              <LoginForm
                onSwitchToRegister={handleSwitchToRegister}
                onLoginSuccess={handleAuthSuccess}
              />
            ) : (
              <RegisterForm
                onSwitchToLogin={handleSwitchToLogin}
                onRegisterSuccess={handleAuthSuccess}
              />
            )}
          </Box>
        </Container>
      </Fade>
    </Modal>
  );
};

export default AuthModal;

