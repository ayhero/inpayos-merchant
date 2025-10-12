import { useState } from 'react';
import { LoginPage } from './LoginPage';
import { RegisterPage } from './RegisterPage';
import { ResetPasswordPage } from './ResetPasswordPage';
import { User } from '@/store/authStore';

interface AuthContainerProps {
  onLogin: (userInfo: User, token: string, refreshToken?: string) => void;
}

export function AuthContainer({ onLogin }: AuthContainerProps) {
  const [currentView, setCurrentView] = useState<'login' | 'register' | 'reset'>('login');

  const handleSwitchToRegister = () => {
    setCurrentView('register');
  };

  const handleSwitchToLogin = () => {
    setCurrentView('login');
  };

  const handleSwitchToResetPassword = () => {
    setCurrentView('reset');
  };

  const handleLoginSuccess = (userInfo: User, token: string, refreshToken?: string) => {
    onLogin(userInfo, token, refreshToken);
  };

  if (currentView === 'register') {
    return (
      <RegisterPage 
        onSwitchToLogin={handleSwitchToLogin}
      />
    );
  }

  if (currentView === 'reset') {
    return (
      <ResetPasswordPage 
        onSwitchToLogin={handleSwitchToLogin}
      />
    );
  }

  return (
    <LoginPage 
      onLogin={handleLoginSuccess}
      onSwitchToRegister={handleSwitchToRegister}
      onSwitchToResetPassword={handleSwitchToResetPassword}
    />
  );
}
