import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { useUiStore } from '@/store/ui.store';
import { authService } from '@/services/auth.service';
import type { LoginPayload, RegisterPayload } from '@han/shared';
import { ROUTES } from '@/router/routes';

export function useAuth() {
  const navigate = useNavigate();
  const { login: storeLogin, logout: storeLogout, refreshToken } = useAuthStore();
  const { setLoading, setError, clearError } = useUiStore();

  const login = useCallback(
    async (payload: LoginPayload) => {
      setLoading(true);
      clearError();
      try {
        const response = await authService.login(payload);
        storeLogin(response.user, response.accessToken, response.refreshToken);
        navigate(ROUTES.DASHBOARD);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Login failed';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [storeLogin, navigate, setLoading, setError, clearError],
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      setLoading(true);
      clearError();
      try {
        const response = await authService.register(payload);
        storeLogin(response.user, response.accessToken, response.refreshToken);
        navigate(ROUTES.DASHBOARD);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Registration failed';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [storeLogin, navigate, setLoading, setError, clearError],
  );

  const logout = useCallback(async () => {
    try {
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch {
      // Logout even if API call fails
    } finally {
      storeLogout();
      navigate(ROUTES.LOGIN);
    }
  }, [storeLogout, navigate, refreshToken]);

  return { login, register, logout };
}
