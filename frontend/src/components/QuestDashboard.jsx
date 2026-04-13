import React, { useState } from 'react';
import {
  Sword,
  Shield,
  Target,
  Trophy,
  Flame,
  Clock,
  CheckCircle,
  Circle,
  TrendingUp,
  Zap,
  Skull,
  Award
} from 'lucide-react';

const QuestDashboard = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [completedQuests, setCompletedQuests] = useState([1]);

  // Mock quest data - would come from props/API in real app
  const quests = {
    active: [
      {
        id: 1,
        title: "Complete Project Documentation",
        description: "Finish the API documentation for the authentication module",
        difficulty: "精英",
        priority: "high",
        xp: 500,
        gold: 150,
        timeRemaining: "2h 30m",
        category: "work",
        progress: 75
      },
      {
        id: 2,
        title: "Morning Workout Routine",
        description: "Complete 30 minutes of cardio and strength training",
        difficulty: "普通",
        priority: "medium",
        xp: 200,
        gold: 50,
        timeRemaining: "5h 00m",
        category: "health",
        progress: 0
      },
      {
        id: 3,
        title: "Review Pull Requests",
        description: "Code review for the new feature branch",
        difficulty: "普通",
        priority: "medium",
        xp: 150,
        gold: 40,
        timeRemaining: "1h 15m",
        category: "work",
        progress: 30
      },
      {
        id: 4,
        title: "Learn Advanced TypeScript",
        description: "Complete Chapter 5 of the TypeScript deep dive",
        difficulty: "稀有",
        priority: "low",
        xp: 350,
        gold: 100,
        timeRemaining: "1d 00h",
        category: "learning",
        progress: 10
      }
    ],
    daily: [
      {
        id: 5,
        title: "Daily Standup",
        description: "Attend team sync meeting",
        difficulty: "普通",
        priority: "high",
        xp: 100,
        gold: 25,
        streak: 12,
        category: "work",
        completed: false
      },
      {
        id: 6,
        title: "Meditation Session",
        description: "10 minutes of mindfulness meditation",
        difficulty: "普通",
        priority: "medium",
        xp: 75,
        gold: 20,
        streak: 5,
        category: "health",
        completed: true
      },
      {
        id: 7,
        title: "Read Technical Article",
        description: "Read one article from dev.to or medium",
        difficulty: "普通",
        priority: "low",
        xp: 50,
        gold: 15,
        streak: 3,
        category: "learning",
        completed: false
      }
    ],
    completed: [
      {
        id: 8,
        title: "Fix Authentication Bug",
        description: "Resolve the JWT token expiration issue",
        difficulty: "精英",
        priority: "high",
        xp: 400,
        gold: 120,
        completedAt: "2 hours ago",
        category: "work"
      },
      {
        id: 9,
        title: "Grocery Shopping",
        description: "Buy weekly groceries",
        difficulty: "普通",
        priority: "medium",
        xp: 100,
        gold: 30,
        completedAt: "Yesterday",
        category: "personal"
      }
    ]
  };

  const playerStats = {
    level: 24,
    currentXp: 2450,
    maxXp: 3000,
    rank: "B-Rank Hunter",
    questsCompleted: 147,
    streak: 12,
    totalGold: 4520
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case '精英': return 'text-orange-400 border-orange-400/30 bg-orange-500/10';
      case '稀有': return 'text-purple-400 border-purple-400/30 bg-purple-500/10';
      default: return 'text-blue-400 border-blue-400/30 bg-blue-500/10';
    }
  };

  const getPriorityBorder = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]';
      case 'medium': return 'border-l-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.2)]';
      default: return 'border-l-slate-600';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'work': return <Sword className="w-4 h-4 text-blue-400" />;
      case 'health': return <Shield className="w-4 h-4 text-green-400" />;
      case 'learning': return <Target className="w-4 h-4 text-purple-400" />;
      default: return <Award className="w-4 h-4 text-slate-400" />;
    }
  };

  const handleCompleteQuest = (questId) => {
    if (!completedQuests.includes(questId)) {
      setCompletedQuests([...completedQuests, questId]);
    }
  };

  const renderQuestCard = (quest, isDaily = false) => {
    const isCompleted = isDaily ? quest.completed : completedQuests.includes(quest.id);

    return (
      <div
        key={quest.id}
        className={`relative group bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-lg p-4 transition-all duration-300 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] ${
          quest.priority === 'high' ? 'border-l-red-500' :
          quest.priority === 'medium' ? 'border-l-yellow-500' : 'border-l-slate-600'
        } ${isCompleted ? 'opacity-50' : ''}`}
      >
        {/* Difficulty Badge */}
        <div className="flex items-start justify-between mb-3">
          <div className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider border ${getDifficultyColor(quest.difficulty)}`}>
            {quest.difficulty}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-slate-400 text-sm">
              {getCategoryIcon(quest.category)}
              <span className="capitalize">{quest.category}</span>
            </div>
          </div>
        </div>

        {/* Quest Title */}
        <h3 className="text-lg font-bold text-slate-100 mb-1 group-hover:text-blue-400 transition-colors">
          {quest.title}
        </h3>
        <p className="text-slate-400 text-sm mb-4">{quest.description}</p>

        {/* Progress Bar for Active Quests */}
        {!isDaily && quest.progress !== undefined && (
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Progress</span>
              <span className="text-blue-400 font-bold">{quest.progress}%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-500"
                style={{
                  width: `${quest.progress}%`,
                  boxShadow: '0 0 10px rgba(59,130,246,0.5)'
                }}
              />
            </div>
          </div>
        )}

        {/* Rewards & Time */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-blue-400">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-bold">{quest.xp} XP</span>
            </div>
            <div className="flex items-center gap-1 text-yellow-400">
              <Award className="w-4 h-4" />
              <span className="text-sm font-bold">{quest.gold} G</span>
            </div>
          </div>

          {isDaily ? (
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-orange-400 text-sm font-bold">{quest.streak} day streak</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-slate-400 text-sm">
              <Clock className="w-4 h-4" />
              {quest.timeRemaining}
            </div>
          )}
        </div>

        {/* Complete Button */}
        {!isCompleted && (
          <button
            onClick={() => handleCompleteQuest(quest.id)}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 border border-slate-700 text-slate-400 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-green-500/20 hover:border-green-500 hover:text-green-400 hover:shadow-[0_0_15px_rgba(34,197,94,0.4)]"
          >
            <CheckCircle className="w-5 h-5" />
          </button>
        )}

        {isCompleted && (
          <div className="absolute top-4 right-4 p-2 rounded-full bg-green-500/20 border border-green-500 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.4)]">
            <CheckCircle className="w-5 h-5" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      {/* Header Stats Bar */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-6 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Level & XP */}
            <div className="col-span-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                    <span className="text-xl font-black">{playerStats.level}</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-100">Hunter Rank</h2>
                    <p className="text-blue-400 text-sm font-semibold">{playerStats.rank}</p>
                  </div>
                </div>
                <Trophy className="w-8 h-8 text-yellow-400" />
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Experience</span>
                  <span className="text-blue-400 font-bold">{playerStats.currentXp} / {playerStats.maxXp} XP</span>
                </div>
                <div className="h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 rounded-full transition-all duration-500"
                    style={{
                      width: `${(playerStats.currentXp / playerStats.maxXp) * 100}%`,
                      boxShadow: '0 0 20px rgba(59,130,246,0.6), inset 0 0 10px rgba(59,130,246,0.3)'
                    }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1 text-center">
                  {playerStats.maxXp - playerStats.currentXp} XP until Level {playerStats.level + 1}
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-slate-400 text-sm">Quests Completed</span>
              </div>
              <p className="text-3xl font-black text-slate-100">{playerStats.questsCompleted}</p>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-5 h-5 text-orange-400" />
                <span className="text-slate-400 text-sm">Current Streak</span>
              </div>
              <p className="text-3xl font-black text-orange-400">{playerStats.streak} Days</p>
            </div>
          </div>

          {/* Gold Display */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-yellow-500/10 px-4 py-2 rounded-lg border border-yellow-500/30">
                <Award className="w-6 h-6 text-yellow-400" />
                <span className="text-yellow-400 font-black text-xl">{playerStats.totalGold.toLocaleString()} G</span>
              </div>
              <span className="text-slate-500 text-sm">Hunter Gold</span>
            </div>
            <TrendingUp className="w-6 h-6 text-green-400" />
          </div>
        </div>
      </div>

      {/* Main Quest Board */}
      <div className="max-w-7xl mx-auto">
        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mb-6 bg-slate-900/50 p-2 rounded-lg border border-slate-800 w-fit">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-6 py-3 rounded-md font-bold uppercase tracking-wide transition-all duration-300 ${
              activeTab === 'active'
                ? 'bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
            }`}
          >
            <span className="flex items-center gap-2">
              <Sword className="w-5 h-5" />
              Active Quests
            </span>
          </button>
          <button
            onClick={() => setActiveTab('daily')}
            className={`px-6 py-3 rounded-md font-bold uppercase tracking-wide transition-all duration-300 ${
              activeTab === 'daily'
                ? 'bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
            }`}
          >
            <span className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Daily Challenges
            </span>
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-6 py-3 rounded-md font-bold uppercase tracking-wide transition-all duration-300 ${
              activeTab === 'completed'
                ? 'bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
            }`}
          >
            <span className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Completed
            </span>
          </button>
        </div>

        {/* Quest Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeTab === 'active' && quests.active.map(quest => renderQuestCard(quest))}
          {activeTab === 'daily' && quests.daily.map(quest => renderQuestCard(quest, true))}
          {activeTab === 'completed' && quests.completed.map(quest => (
            <div
              key={quest.id}
              className="bg-slate-900/30 border border-slate-800 rounded-lg p-4 opacity-60"
            >
              <div className={`inline-block px-2 py-1 rounded text-xs font-bold uppercase tracking-wider border mb-3 ${getDifficultyColor(quest.difficulty)}`}>
                {quest.difficulty}
              </div>
              <h3 className="text-lg font-bold text-slate-300 mb-1 line-through">{quest.title}</h3>
              <p className="text-slate-500 text-sm mb-3">{quest.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-bold">COMPLETED</span>
                </div>
                <span className="text-slate-500 text-sm">{quest.completedAt}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {((activeTab === 'active' && quests.active.length === 0) ||
          (activeTab === 'daily' && quests.daily.length === 0) ||
          (activeTab === 'completed' && quests.completed.length === 0)) && (
          <div className="text-center py-20">
            <Skull className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">No quests in this category</p>
            <p className="text-slate-600 text-sm mt-2">The hunter must seek new challenges</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestDashboard;
