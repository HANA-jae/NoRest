import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { useUiStore } from '@/store/ui.store';
import { useToastStore } from '@/store/toast.store';
import { authService } from '@/services/auth.service';
import type { LoginPayload, RegisterPayload } from '@han/shared';

export function useAuth() {
  const router = useRouter();
  const { login: storeLogin, logout: storeLogout, refreshToken } = useAuthStore();
  const { setLoading, setError, clearError } = useUiStore();
  const { closeLoginModal } = useUiStore();

  const login = useCallback(
    async (payload: LoginPayload) => {
      setLoading(true);
      clearError();
      try {
        const response = await authService.login(payload);
        storeLogin(response.user, response.accessToken, response.refreshToken);
        closeLoginModal();
        useToastStore.getState().success('로그인되었습니다');
        router.push('/dashboard');
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : '로그인에 실패했습니다';
        setError(message);
        useToastStore.getState().error(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [storeLogin, router, setLoading, setError, clearError, closeLoginModal],
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      setLoading(true);
      clearError();
      try {
        const response = await authService.register(payload);
        storeLogin(response.user, response.accessToken, response.refreshToken);
        useToastStore.getState().success('회원가입이 완료되었습니다');
        router.push('/dashboard');
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : '회원가입에 실패했습니다';
        setError(message);
        useToastStore.getState().error(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [storeLogin, router, setLoading, setError, clearError],
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
      useToastStore.getState().info('로그아웃되었습니다');
      router.push('/');
    }
  }, [storeLogout, router, refreshToken]);

  return { login, register, logout };
}
