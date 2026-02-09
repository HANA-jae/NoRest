import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { useHistoryStore, SimulationHistoryItem } from '@/store/history.store';
import { useToast } from '@/components/common/Toast';
import { userService } from '@/services/user.service';
import { formatWon } from '@/utils/calculator';
import { ROUTES } from '@/router/routes';

function ProfileCard() {
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
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-start justify-between mb-6">
        <h2 className="text-lg font-semibold text-neutral-800">내 프로필</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-brand-600 hover:text-brand-700 font-medium"
          >
            수정
          </button>
        )}
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-accent-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          {isEditing ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-xl font-semibold text-neutral-800 border-b-2 border-brand-500 focus:outline-none bg-transparent"
              autoFocus
            />
          ) : (
            <h3 className="text-xl font-semibold text-neutral-800">{user.name}</h3>
          )}
          <p className="text-neutral-500">{user.email}</p>
        </div>
      </div>

      {isEditing && (
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 disabled:opacity-50"
          >
            {isSaving ? '저장 중...' : '저장'}
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              setName(user.name);
            }}
            className="flex-1 py-2 bg-neutral-200 text-neutral-700 rounded-lg font-medium hover:bg-neutral-300"
          >
            취소
          </button>
        </div>
      )}
    </div>
  );
}

function QuickActions() {
  const tools = [
    {
      title: '퇴사 시뮬레이터',
      description: '퇴사 후 생존 기간 계산',
      icon: '🚀',
      href: ROUTES.SIMULATOR,
      color: 'from-brand-500 to-brand-600',
    },
    {
      title: '연봉 계산기',
      description: '실수령액 계산',
      icon: '💰',
      href: '/salary-calculator',
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      title: '퇴직연금 계산기',
      description: '퇴직연금 예상액 계산',
      icon: '🏦',
      href: '/pension-calculator',
      color: 'from-amber-500 to-amber-600',
    },
    {
      title: '이직 가이드',
      description: '이직 준비 체크리스트',
      icon: '📋',
      href: '/job-guide',
      color: 'from-violet-500 to-violet-600',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-neutral-800 mb-4">빠른 실행</h2>
      <div className="grid grid-cols-2 gap-3">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            to={tool.href}
            className="flex items-center gap-3 p-4 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition-colors group"
          >
            <div
              className={`w-10 h-10 bg-gradient-to-br ${tool.color} rounded-lg flex items-center justify-center text-xl group-hover:scale-110 transition-transform`}
            >
              {tool.icon}
            </div>
            <div>
              <h3 className="font-medium text-neutral-800 text-sm">{tool.title}</h3>
              <p className="text-xs text-neutral-500">{tool.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function HistoryCard({ item, onRemove }: { item: SimulationHistoryItem; onRemove: () => void }) {
  const date = new Date(item.date);
  const formattedDate = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;

  const gradeColors: Record<string, string> = {
    S: 'bg-gradient-to-r from-amber-400 to-amber-500 text-white',
    A: 'bg-gradient-to-r from-emerald-400 to-emerald-500 text-white',
    B: 'bg-gradient-to-r from-blue-400 to-blue-500 text-white',
    C: 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white',
    D: 'bg-gradient-to-r from-orange-400 to-orange-500 text-white',
    F: 'bg-gradient-to-r from-red-400 to-red-500 text-white',
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl">
      <div
        className={`w-12 h-12 ${gradeColors[item.grade] || 'bg-neutral-400'} rounded-lg flex items-center justify-center text-xl font-bold`}
      >
        {item.grade}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-neutral-800">
            생존 {item.survivalDays}일
          </span>
          <span className="text-xs text-neutral-400">|</span>
          <span className="text-sm text-neutral-500">상위 {item.percentile}%</span>
        </div>
        <div className="text-sm text-neutral-500">
          월급 {formatWon(item.monthlySalary)} · 근속 {Math.floor(item.workingDays / 365)}년
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs text-neutral-400">{formattedDate}</p>
        <button
          onClick={onRemove}
          className="text-xs text-neutral-400 hover:text-danger-500 mt-1"
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
    clearHistory();
    success('기록이 삭제되었습니다.');
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-neutral-800">시뮬레이션 기록</h2>
        {simulations.length > 0 && (
          <button
            onClick={handleClear}
            className="text-sm text-neutral-400 hover:text-danger-500"
          >
            전체 삭제
          </button>
        )}
      </div>

      {simulations.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">📊</div>
          <p className="text-neutral-500 mb-4">아직 시뮬레이션 기록이 없습니다.</p>
          <Link
            to={ROUTES.SIMULATOR}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700"
          >
            첫 시뮬레이션 시작하기
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {simulations.map((item) => (
            <HistoryCard
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

function StatsCard() {
  const simulations = useHistoryStore((state) => state.simulations);

  if (simulations.length === 0) return null;

  const avgSurvival = Math.round(
    simulations.reduce((sum, s) => sum + s.survivalDays, 0) / simulations.length
  );
  const bestGrade = simulations.reduce(
    (best, s) => {
      const order = ['S', 'A', 'B', 'C', 'D', 'F'];
      return order.indexOf(s.grade) < order.indexOf(best) ? s.grade : best;
    },
    'F' as string
  );
  const avgSalary = Math.round(
    simulations.reduce((sum, s) => sum + s.monthlySalary, 0) / simulations.length
  );

  return (
    <div className="bg-gradient-to-br from-brand-600 to-accent-600 rounded-2xl p-6 text-white">
      <h2 className="text-lg font-semibold mb-4 opacity-90">나의 통계</h2>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-3xl font-bold">{avgSurvival}</p>
          <p className="text-sm opacity-75">평균 생존일</p>
        </div>
        <div>
          <p className="text-3xl font-bold">{bestGrade}</p>
          <p className="text-sm opacity-75">최고 등급</p>
        </div>
        <div>
          <p className="text-3xl font-bold">{simulations.length}</p>
          <p className="text-sm opacity-75">총 시뮬레이션</p>
        </div>
      </div>
    </div>
  );
}

export function DashboardPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 page-enter">
      <h1 className="text-2xl font-bold text-neutral-800 mb-6">마이페이지</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <ProfileCard />
          <StatsCard />
        </div>
        <div className="space-y-6">
          <QuickActions />
          <SimulationHistory />
        </div>
      </div>
    </div>
  );
}
