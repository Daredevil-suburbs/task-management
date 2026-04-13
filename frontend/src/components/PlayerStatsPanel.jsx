/** 
 * @author Daredevil-suburbs
 */
import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Award,
  Zap,
  Clock,
  Target,
  Flame,
  Skull,
  Heart,
  Brain,
  Activity,
  Shield,
  Sword,
  CheckCircle
} from 'lucide-react';

const PlayerStatsPanel = ({ stats }) => {
  // Default stats if none provided
  const defaultStats = {
    level: 24,
    currentXp: 2450,
    maxXp: 3000,
    rank: 'B-Rank Hunter',
    title: 'The Persistent',
    questsCompleted: 147,
    questsFailed: 12,
    dailyStreak: 12,
    longestStreak: 28,
    totalGold: 4520,
    goldSpent: 3200,
    averageCompletionTime: '4h 32m',
    completionRate: 92,
    attributes: {
      strength: 45,  // Completed high-priority tasks
      agility: 32,   // Quick task completion
      intelligence: 67,  // Learning quests
      vitality: 28,  // Health-related quests
      focus: 54    // Long-focus sessions
    },
    recentActivity: [
      { type: 'complete', quest: 'Fix Authentication Bug', xp: 400, time: '2h ago' },
      { type: 'streak', days: 12, xp: 100, time: '5h ago' },
      { type: 'complete', quest: 'Morning Workout', xp: 200, time: '1d ago' },
      { type: 'levelup', level: 24, time: '2d ago' }
    ],
    achievements: [
      { id: 1, name: 'First Blood', description: 'Complete your first quest', icon: Sword, unlocked: true },
      { id: 2, name: 'On Fire', description: 'Reach a 7-day streak', icon: Flame, unlocked: true },
      { id: 3, name: 'Scholar', description: 'Complete 50 learning quests', icon: Brain, unlocked: true },
      { id: 4, name: 'Iron Will', description: 'Reach a 30-day streak', icon: Shield, unlocked: false },
      { id: 5, name: 'Boss Slayer', description: 'Complete 10 elite quests', icon: Skull, unlocked: false }
    ]
  };

  const data = stats || defaultStats;

  const xpPercentage = (data.currentXp / data.maxXp) * 100;

  const getAttributeColor = (value) => {
    if (value >= 80) return 'text-orange-400';
    if (value >= 50) return 'text-blue-400';
    if (value >= 30) return 'text-green-400';
    return 'text-slate-400';
  };

  const getAttributeGlow = (value) => {
    if (value >= 80) return 'shadow-[0_0_15px_rgba(251,146,60,0.5)]';
    if (value >= 50) return 'shadow-[0_0_10px_rgba(59,130,246,0.5)]';
    return '';
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden">
      {/* Header - Rank Display */}
      <div className="relative p-6 bg-gradient-to-b from-blue-900/20 to-transparent border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Level Badge */}
            <div className="relative">
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.6)]">
                <span className="text-3xl font-black text-white">{data.level}</span>
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-slate-800 border-2 border-blue-400 flex items-center justify-center">
                <Target className="w-4 h-4 text-blue-400" />
              </div>
            </div>

            {/* Rank Info */}
            <div>
              <h2 className="text-2xl font-black text-slate-100 uppercase tracking-wide">
                {data.rank}
              </h2>
              <p className="text-blue-400 font-semibold italic">"{data.title}"</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-4">
            <div className="text-center">
              <p className="text-2xl font-black text-green-400">{data.questsCompleted}</p>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-red-400">{data.questsFailed}</p>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Failed</p>
            </div>
          </div>
        </div>

        {/* XP Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-400 font-semibold">Experience to Level {data.level + 1}</span>
            <span className="text-blue-400 font-bold">{data.currentXp.toLocaleString()} / {data.maxXp.toLocaleString()} XP</span>
          </div>
          <div className="h-6 bg-slate-800 rounded-full overflow-hidden border border-slate-700 relative">
            <div
              className="h-full bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400 rounded-full transition-all duration-700 relative"
              style={{
                width: `${xpPercentage}%`,
                boxShadow: '0 0 25px rgba(59,130,246,0.7), inset 0 0 15px rgba(59,130,246,0.4)'
              }}
            >
              {/* Animated shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center">
            {(data.maxXp - data.currentXp).toLocaleString()} XP remaining
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Attributes Grid */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Hunter Attributes
          </h3>
          <div className="grid grid-cols-5 gap-3">
            {Object.entries(data.attributes).map(([attr, value]) => (
              <div
                key={attr}
                className="bg-slate-800/50 rounded-lg p-3 border border-slate-700 text-center hover:border-blue-500/30 transition-all"
              >
                <p className={`text-lg font-black ${getAttributeColor(value)} ${getAttributeGlow(value)}`}>
                  {value}
                </p>
                <p className="text-xs text-slate-500 uppercase mt-1">{attr}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Streak */}
          <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-lg p-4 border border-orange-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-orange-400" />
              <span className="text-slate-400 text-sm font-semibold">Current Streak</span>
            </div>
            <p className="text-3xl font-black text-orange-400">{data.dailyStreak}</p>
            <p className="text-xs text-slate-500 mt-1">
              Best: <span className="text-orange-400 font-bold">{data.longestStreak} days</span>
            </p>
          </div>

          {/* Gold */}
          <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 rounded-lg p-4 border border-yellow-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-yellow-400" />
              <span className="text-slate-400 text-sm font-semibold">Hunter Gold</span>
            </div>
            <p className="text-3xl font-black text-yellow-400">{data.totalGold.toLocaleString()} G</p>
            <p className="text-xs text-slate-500 mt-1">
              Spent: <span className="text-yellow-400 font-bold">{data.goldSpent.toLocaleString()} G</span>
            </p>
          </div>

          {/* Completion Rate */}
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg p-4 border border-green-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-green-400" />
              <span className="text-slate-400 text-sm font-semibold">Success Rate</span>
            </div>
            <p className="text-3xl font-black text-green-400">{data.completionRate}%</p>
            <div className="mt-2 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full"
                style={{ width: `${data.completionRate}%`, boxShadow: '0 0 10px rgba(34,197,94,0.5)' }}
              />
            </div>
          </div>

          {/* Avg Completion */}
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg p-4 border border-blue-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <span className="text-slate-400 text-sm font-semibold">Avg. Completion</span>
            </div>
            <p className="text-3xl font-black text-blue-400">{data.averageCompletionTime}</p>
            <p className="text-xs text-slate-500 mt-1">Per quest</p>
          </div>
        </div>

        {/* Achievements */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-4 flex items-center gap-2">
            <Award className="w-4 h-4" />
            Achievements
          </h3>
          <div className="grid grid-cols-5 gap-2">
            {data.achievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <div
                  key={achievement.id}
                  className={`relative group rounded-lg p-3 border transition-all duration-300 ${
                    achievement.unlocked
                      ? 'bg-yellow-500/10 border-yellow-500/30 hover:shadow-[0_0_15px_rgba(234,179,8,0.3)]'
                      : 'bg-slate-800/30 border-slate-700 opacity-50'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <Icon className={`w-6 h-6 mb-2 ${achievement.unlocked ? 'text-yellow-400' : 'text-slate-600'}`} />
                    <p className={`text-xs font-bold text-center ${achievement.unlocked ? 'text-slate-200' : 'text-slate-500'}`}>
                      {achievement.name}
                    </p>
                  </div>

                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    <p className="font-bold text-slate-200">{achievement.name}</p>
                    <p className="text-slate-400">{achievement.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Recent Activity
          </h3>
          <div className="space-y-2">
            {data.recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg border border-slate-800 hover:border-slate-700 transition-all"
              >
                {/* Activity Icon */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  activity.type === 'complete' ? 'bg-green-500/10' :
                  activity.type === 'streak' ? 'bg-orange-500/10' :
                  'bg-blue-500/10'
                }`}>
                  {activity.type === 'complete' ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : activity.type === 'streak' ? (
                    <Flame className="w-4 h-4 text-orange-400" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                  )}
                </div>

                {/* Activity Info */}
                <div className="flex-1">
                  <p className="text-sm text-slate-200">
                    {activity.type === 'levelup'
                      ? `Reached Level ${activity.level}!`
                      : activity.type === 'streak'
                      ? `${activity.days}-day streak milestone!`
                      : `Completed: ${activity.quest}`
                    }
                  </p>
                  <p className="text-xs text-slate-500">{activity.time}</p>
                </div>

                {/* XP Gain */}
                {activity.xp && (
                  <div className="flex items-center gap-1 text-blue-400">
                    <Zap className="w-4 h-4" />
                    <span className="text-sm font-bold">+{activity.xp}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerStatsPanel;
