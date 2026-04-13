import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus, LogOut } from 'lucide-react';
import { QuestDashboard, AddQuestModal, PlayerStatsPanel, HealthSyncDashboard } from '../components';

export default function HunterDashboard() {
  const { user, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePanel, setActivePanel] = useState('quests');

  const handleCreateQuest = (questData) => {
    console.log('New quest created:', questData);
    // TODO: Add API call here
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo / Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                <span className="text-xl font-black text-white">H</span>
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-100 uppercase tracking-widest">
                  The Hunter System
                </h1>
                <p className="text-slate-500 text-xs">Gamified Task Management</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActivePanel('quests')}
                className={`px-4 py-2 rounded-lg font-bold uppercase tracking-wide text-sm transition-all ${
                  activePanel === 'quests'
                    ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                }`}
              >
                Quests
              </button>
              <button
                onClick={() => setActivePanel('stats')}
                className={`px-4 py-2 rounded-lg font-bold uppercase tracking-wide text-sm transition-all ${
                  activePanel === 'stats'
                    ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                }`}
              >
                Stats
              </button>
              <button
                onClick={() => setActivePanel('health')}
                className={`px-4 py-2 rounded-lg font-bold uppercase tracking-wide text-sm transition-all ${
                  activePanel === 'health'
                    ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                }`}
              >
                Health
              </button>
            </div>

            {/* User & Logout */}
            <div className="flex items-center gap-4">
              <span className="text-slate-400 text-sm">Welcome, {user?.name}</span>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 text-slate-400 hover:text-slate-100 hover:border-slate-500 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-bold">Logout</span>
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold uppercase tracking-wide shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.7)] transition-all duration-300"
              >
                <Plus className="w-5 h-5" />
                New Quest
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-6 py-8">
        {activePanel === 'quests' && (
          <div className="space-y-6">
            <PlayerStatsPanel />
            <QuestDashboard />
          </div>
        )}
        {activePanel === 'stats' && <PlayerStatsPanel />}
        {activePanel === 'health' && <HealthSyncDashboard />}
      </main>

      {/* Add Quest Modal */}
      <AddQuestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateQuest}
      />
    </div>
  );
}
