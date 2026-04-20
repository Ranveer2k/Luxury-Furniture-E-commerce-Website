import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const useProtectedRoute = () => {
  const navigate = useNavigate();
  const { user, token } = useAuthStore();

  useEffect(() => {
    if (!token || !user) {
      navigate('/login', { replace: true });
    }
  }, [token, user, navigate]);

  return { user, token, isAuthenticated: !!token && !!user };
};

export default useProtectedRoute;
