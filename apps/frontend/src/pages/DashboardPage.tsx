import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { useHistoryStore, SimulationHistoryItem } from '@/store/history.store';
import { useToast } from '@/components/common/Toast';
import { useConfirm } from '@/store/confirm.store';
import { userService } from '@/services/user.service';
import { formatWon } from '@/utils/calculator';
import { ROUTES } from '@/router/routes';

const tools = [
  { num: '01', title: '퇴사 시뮬레이터', href: ROUTES.SIMULATOR },
  { num: '02', title: '퇴사각 테스트', href: ROUTES.RESIGNATION_QUIZ },
  { num: '03', title: '연봉 계산기', href: ROUTES.SALARY_CALCULATOR },
  { num: '04', title: '퇴직연금 계산기', href: ROUTES.PENSION_CALCULATOR },
  { num: '05', title: '이직 가이드', href: ROUTES.JOB_GUIDE },
];

export function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const { simulations, removeSimulation, clearHistory } = useHistoryStore();
  const { success, error } = useToast();
  const { confirm } = useConfirm();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleClearHistory = async () => {
    const confirmed = await confirm({
      title: '기록 삭제',
      message: '모든 시뮬레이션 기록을 삭제하시겠습니까?',
      confirmText: '삭제',
      variant: 'danger',
    });
    if (confirmed) {
      clearHistory();
      success('삭제되었습니다.');
    }
  };

  const handleSave = async () => {
    if (!name.trim() || name.length < 2) {
      error('이름은 2자 이상이어야 합니다.');
      return;
    }
    setIsSaving(true);
    try {
      const updated = await userService.updateProfile({ name: name.trim() });
      setUser(updated);
      success('저장되었습니다.');
      setIsEditing(false);
    } catch {
      error('저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="flex items-start justify-between mb-16">
        <div>
          <p className="text-sm text-neutral-400 mb-2">Welcome back</p>
          {user && (
            <>
              {isEditing ? (
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-3xl font-bold bg-transparent border-b-2 border-neutral-900 outline-none"
                    autoFocus
                  />
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="text-sm text-neutral-900 font-medium"
                  >
                    저장
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setName(user.name);
                    }}
                    className="text-sm text-neutral-400"
                  >
                    취소
                  </button>
                </div>
              ) : (
                <h1
                  onClick={() => setIsEditing(true)}
                  className="text-3xl font-bold text-neutral-900 tracking-tight cursor-pointer hover:text-neutral-600 transition-colors"
                >
                  {user.name}
                </h1>
              )}
              <p className="text-neutral-500 mt-1">{user.email}</p>
            </>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-16">
        {/* Tools */}
        <div>
          <h2 className="text-xs text-neutral-400 uppercase tracking-wider mb-6">Tools</h2>
          <div className="space-y-2">
            {tools.map((tool) => (
              <Link
                key={tool.href}
                to={tool.href}
                className="group flex items-center gap-4 py-4 border-b border-neutral-100 hover:border-neutral-300 transition-colors"
              >
                <span className="text-xs text-neutral-300 tabular-nums">{tool.num}</span>
                <span className="flex-1 font-medium text-neutral-900 group-hover:text-neutral-600 transition-colors">
                  {tool.title}
                </span>
                <span className="text-neutral-300 group-hover:text-neutral-900 group-hover:translate-x-1 transition-all">
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* History */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xs text-neutral-400 uppercase tracking-wider">History</h2>
            {simulations.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="text-xs text-neutral-400 hover:text-neutral-900"
              >
                Clear
              </button>
            )}
          </div>

          {simulations.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-neutral-400 mb-4">기록이 없습니다</p>
              <Link
                to={ROUTES.SIMULATOR}
                className="text-sm text-neutral-900 font-medium hover:underline"
              >
                시뮬레이션 시작 →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {simulations.slice(0, 5).map((item) => (
                <HistoryCard key={item.id} item={item} onRemove={() => removeSimulation(item.id)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function HistoryCard({ item, onRemove }: { item: SimulationHistoryItem; onRemove: () => void }) {
  const date = new Date(item.date);
  const formatted = `${date.getMonth() + 1}/${date.getDate()}`;

  return (
    <div className="group flex items-center gap-4 p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors">
      <div className="w-12 h-12 bg-neutral-900 text-white rounded-lg flex items-center justify-center font-bold">
        {item.grade}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-neutral-900 tabular-nums">
          {item.survivalDays}일
          <span className="text-neutral-400 font-normal ml-2">상위 {item.percentile}%</span>
        </p>
        <p className="text-sm text-neutral-500 tabular-nums">
          {formatWon(item.monthlySalary)}
        </p>
      </div>
      <div className="text-right">
        <p className="text-xs text-neutral-400">{formatted}</p>
        <button
          onClick={onRemove}
          className="text-xs text-neutral-400 hover:text-neutral-900 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          삭제
        </button>
      </div>
    </div>
  );
}
