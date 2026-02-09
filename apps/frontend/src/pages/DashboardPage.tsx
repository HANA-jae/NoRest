import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { useHistoryStore, SimulationHistoryItem } from '@/store/history.store';
import { useToast } from '@/components/common/Toast';
import { userService } from '@/services/user.service';
import { formatWon } from '@/utils/calculator';
import { ROUTES } from '@/router/routes';

function ProfileSection() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const { success, error } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || name.length < 2) {
      error('이름은 2자 이상이어야 합니다.');
      return;
    }

    setIsSaving(true);
    try {
      const updated = await userService.updateProfile({ name: name.trim() });
      setUser(updated);
      success('프로필이 업데이트되었습니다.');
      setIsEditing(false);
    } catch (e) {
      error('프로필 업데이트에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-semibold text-neutral-900">프로필</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-neutral-500 hover:text-neutral-700"
          >
            수정
          </button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-neutral-900 rounded-full flex items-center justify-center text-white font-medium">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          {isEditing ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 px-3 py-1.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:border-neutral-500"
                autoFocus
              />
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-3 py-1.5 bg-neutral-900 text-white text-sm rounded-lg hover:bg-neutral-800 disabled:opacity-50"
              >
                저장
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setName(user.name);
                }}
                className="px-3 py-1.5 text-neutral-500 text-sm hover:text-neutral-700"
              >
                취소
              </button>
            </div>
          ) : (
            <>
              <p className="font-medium text-neutral-900">{user.name}</p>
              <p className="text-sm text-neutral-500">{user.email}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function QuickLinks() {
  const links = [
    { title: '퇴사 시뮬레이터', href: ROUTES.SIMULATOR },
    { title: '연봉 계산기', href: ROUTES.SALARY_CALCULATOR },
    { title: '퇴직연금 계산기', href: ROUTES.PENSION_CALCULATOR },
    { title: '이직 가이드', href: ROUTES.JOB_GUIDE },
  ];

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-6">
      <h2 className="font-semibold text-neutral-900 mb-4">도구</h2>
      <div className="grid grid-cols-2 gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className="px-4 py-3 bg-neutral-50 rounded-lg text-sm text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            {link.title}
          </Link>
        ))}
      </div>
    </div>
  );
}

function HistoryItem({ item, onRemove }: { item: SimulationHistoryItem; onRemove: () => void }) {
  const date = new Date(item.date);
  const formattedDate = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;

  return (
    <div className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center font-semibold text-neutral-700">
          {item.grade}
        </div>
        <div>
          <p className="text-sm font-medium text-neutral-900">
            생존 {item.survivalDays}일 · 상위 {item.percentile}%
          </p>
          <p className="text-xs text-neutral-500">
            월급 {formatWon(item.monthlySalary)}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs text-neutral-400">{formattedDate}</p>
        <button
          onClick={onRemove}
          className="text-xs text-neutral-400 hover:text-red-500 mt-1"
        >
          삭제
        </button>
      </div>
    </div>
  );
}

function SimulationHistory() {
  const { simulations, removeSimulation, clearHistory } = useHistoryStore();
  const { success } = useToast();

  const handleClear = () => {
    if (confirm('모든 기록을 삭제하시겠습니까?')) {
      clearHistory();
      success('기록이 삭제되었습니다.');
    }
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-neutral-900">시뮬레이션 기록</h2>
        {simulations.length > 0 && (
          <button
            onClick={handleClear}
            className="text-xs text-neutral-400 hover:text-red-500"
          >
            전체 삭제
          </button>
        )}
      </div>

      {simulations.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-neutral-500 mb-4">기록이 없습니다.</p>
          <Link
            to={ROUTES.SIMULATOR}
            className="text-sm text-neutral-900 font-medium hover:underline"
          >
            시뮬레이션 시작하기
          </Link>
        </div>
      ) : (
        <div>
          {simulations.slice(0, 5).map((item) => (
            <HistoryItem
              key={item.id}
              item={item}
              onRemove={() => removeSimulation(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function DashboardPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-xl font-bold text-neutral-900 mb-8">마이페이지</h1>

      <div className="space-y-6">
        <ProfileSection />
        <QuickLinks />
        <SimulationHistory />
      </div>
    </div>
  );
}
