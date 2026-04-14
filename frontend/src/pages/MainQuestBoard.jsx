/**
 * @author Daredevil-suburbs
 * The Hunter System - Main Quest Board
 * A gamified, ADHD-friendly task management dashboard inspired by Solo Leveling
 */
import { useState } from 'react';
import {
  Sword,
  Shield,
  Target,
  Trophy,
  Flame,
  Clock,
  CheckCircle,
  Circle,
  Zap,
  Skull,
  Award,
  Plus,
  LogOut,
  Sparkles,
  TrendingUp,
  Heart,
  Brain,
  Activity
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Progress,
  Button,
  Chip,
  Avatar,
  Divider,
  Badge,
  Tabs,
  Tab
} from '@nextui-org/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

// ── Mock Data ────────────────────────────────────────────
const MOCK_QUESTS = {
  main: [
    {
      id: 1,
      title: "Complete Project Documentation",
      description: "Finish the API documentation for the authentication module",
      difficulty: "ELITE",
      priority: "HIGH",
      xpReward: 500,
      goldReward: 150,
      dueDate: "2026-04-14",
      category: "work",
      status: "IN_PROGRESS",
      progress: 75
    },
    {
      id: 2,
      title: "Morning Workout Routine",
      description: "Complete 30 minutes of cardio and strength training",
      difficulty: "NORMAL",
      priority: "MEDIUM",
      xpReward: 200,
      goldReward: 50,
      dueDate: "2026-04-14",
      category: "health",
      status: "TODO",
      progress: 0
    },
    {
      id: 3,
      title: "Review Pull Requests",
      description: "Code review for the new feature branch - 3 PRs pending",
      difficulty: "NORMAL",
      priority: "MEDIUM",
      xpReward: 150,
      goldReward: 40,
      dueDate: "2026-04-15",
      category: "work",
      status: "TODO",
      progress: 0
    }
  ],
  daily: [
    {
      id: 4,
      title: "Daily Standup",
      description: "Attend team sync meeting",
      difficulty: "NORMAL",
      priority: "HIGH",
      xpReward: 100,
      goldReward: 25,
      streak: 12,
      category: "work",
      status: "TODO",
      isDaily: true
    },
    {
      id: 5,
      title: "Meditation Session",
      description: "10 minutes of mindfulness meditation",
      difficulty: "NORMAL",
      priority: "MEDIUM",
      xpReward: 75,
      goldReward: 20,
      streak: 5,
      category: "health",
      status: "DONE",
      isDaily: true
    },
    {
      id: 6,
      title: "Read Technical Article",
      description: "Read one article from dev.to or medium",
      difficulty: "NORMAL",
      priority: "LOW",
      xpReward: 50,
      goldReward: 15,
      streak: 3,
      category: "learning",
      status: "TODO",
      isDaily: true
    }
  ],
  completed: [
    {
      id: 7,
      title: "Fix Authentication Bug",
      description: "Resolve the JWT token expiration issue",
      difficulty: "ELITE",
      priority: "HIGH",
      xpReward: 400,
      goldReward: 120,
      completedAt: "2026-04-14T10:30:00",
      category: "work"
    },
    {
      id: 8,
      title: "Grocery Shopping",
      description: "Buy weekly groceries",
      difficulty: "NORMAL",
      priority: "MEDIUM",
      xpReward: 100,
      goldReward: 30,
      completedAt: "2026-04-13T18:00:00",
      category: "personal"
    }
  ]
};

const PLAYER_STATS = {
  level: 24,
  currentXp: 2450,
  maxXp: 3000,
  rank: "B",
  title: "The Persistent",
  questsCompleted: 147,
  questsFailed: 12,
  dailyStreak: 12,
  longestStreak: 28,
  totalGold: 4520,
  completionRate: 92,
  attributes: {
    strength: 45,
    agility: 32,
    intelligence: 67,
    vitality: 28,
    focus: 54
  }
};

// ── Utility Functions ────────────────────────────────────
const getDifficultyStyle = (difficulty) => {
  switch (difficulty) {
    case 'ELITE':
      return {
        text: 'text-orange-400',
        border: 'border-orange-400/30',
        bg: 'bg-orange-500/10',
        glow: 'shadow-[0_0_15px_rgba(251,146,60,0.3)]'
      };
    case 'RARE':
      return {
        text: 'text-purple-400',
        border: 'border-purple-400/30',
        bg: 'bg-purple-500/10',
        glow: 'shadow-[0_0_15px_rgba(168,85,247,0.3)]'
      };
    default:
      return {
        text: 'text-blue-400',
        border: 'border-blue-400/30',
        bg: 'bg-blue-500/10',
        glow: 'shadow-[0_0_10px_rgba(59,130,246,0.2)]'
      };
  }
};

const getPriorityStyle = (priority) => {
  switch (priority) {
    case 'HIGH':
      return {
        color: 'text-red-400',
        border: 'border-red-500',
        bg: 'bg-red-500/10',
        glow: 'shadow-[0_0_15px_rgba(239,68,68,0.3)]'
      };
    case 'MEDIUM':
      return {
        color: 'text-yellow-400',
        border: 'border-yellow-500',
        bg: 'bg-yellow-500/10',
        glow: 'shadow-[0_0_10px_rgba(234,179,8,0.2)]'
      };
    default:
      return {
        color: 'text-slate-400',
        border: 'border-slate-600',
        bg: 'bg-slate-500/10',
        glow: ''
      };
  }
};

const getCategoryIcon = (category) => {
  switch (category) {
    case 'work': return <Sword className="w-4 h-4 text-blue-400" />;
    case 'health': return <Heart className="w-4 h-4 text-green-400" />;
    case 'learning': return <Brain className="w-4 h-4 text-purple-400" />;
    case 'personal': return <Target className="w-4 h-4 text-pink-400" />;
    default: return <Award className="w-4 h-4 text-slate-400" />;
  }
};

const getRankColor = (rank) => {
  switch (rank) {
    case 'S': return 'text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]';
    case 'A': return 'text-orange-400';
    case 'B': return 'text-yellow-400';
    case 'C': return 'text-green-400';
    case 'D': return 'text-blue-400';
    default: return 'text-slate-400';
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const isOverdue = (dueDate) => {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
};

// ── Sub-Components ───────────────────────────────────────

/**
 * Hunter Rank Badge - Displays the player's current rank with glow effect
 */
const HunterRankBadge = ({ rank }) => {
  const colorClass = getRankColor(rank);

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`relative w-16 h-16 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-700 flex items-center justify-center ${colorClass}`}
    >
      <span className="text-3xl font-black">{rank}</span>
      <div className={`absolute inset-0 rounded-xl ${colorClass.replace('text-', 'shadow-[0_0_20px_rgba(')}/20)]`} />
    </motion.div>
  );
};

/**
 * XP Progress Bar - Shows current XP with animated glow
 */
const XPProgressBar = ({ currentXp, maxXp, level }) => {
  const percentage = Math.min((currentXp / maxXp) * 100, 100);
  const remaining = maxXp - currentXp;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)]">
            <span className="text-xl font-black text-white">{level}</span>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold">Experience</p>
            <p className="text-sm text-blue-400 font-bold">{currentXp.toLocaleString()} / {maxXp.toLocaleString()} XP</p>
          </div>
        </div>
        <Zap className="w-6 h-6 text-blue-400" />
      </div>

      <Progress
        value={percentage}
        className="h-3"
        classNames={{
          track: "bg-slate-800 border border-slate-700",
          indicator: "bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400",
          label: "text-slate-400"
        }}
        style={{
          boxShadow: '0 0 20px rgba(59,130,246,0.4), inset 0 0 10px rgba(59,130,246,0.2)'
        }}
      />
      <p className="text-xs text-slate-500 mt-2 text-center">
        {remaining.toLocaleString()} XP until Level {level + 1}
      </p>
    </div>
  );
};

/**
 * Stat Card - Small stat display with icon
 */
const StatCard = ({ icon: Icon, label, value, subValue, color = "blue", glow = false }) => {
  const colorClasses = {
    blue: "from-blue-500/10 to-cyan-500/10 border-blue-500/30 text-blue-400",
    green: "from-green-500/10 to-emerald-500/10 border-green-500/30 text-green-400",
    orange: "from-orange-500/10 to-red-500/10 border-orange-500/30 text-orange-400",
    yellow: "from-yellow-500/10 to-amber-500/10 border-yellow-500/30 text-yellow-400",
    purple: "from-purple-500/10 to-pink-500/10 border-purple-500/30 text-purple-400"
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className={`bg-gradient-to-br ${colorClasses[color]} rounded-lg p-4 border backdrop-blur-sm ${glow ? 'shadow-[0_0_15px_rgba(var(--glow),0.3)]' : ''}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-5 h-5" />
        <span className="text-slate-400 text-sm font-semibold">{label}</span>
      </div>
      <p className="text-2xl font-black">{value}</p>
      {subValue && <p className="text-xs text-slate-500 mt-1">{subValue}</p>}
    </motion.div>
  );
};

/**
 * Attribute Bar - Shows a single attribute with progress
 */
const AttributeBar = ({ name, value, max = 100 }) => {
  const percentage = (value / max) * 100;
  const getColor = () => {
    if (value >= 80) return "from-orange-500 to-orange-400 text-orange-400";
    if (value >= 50) return "from-blue-500 to-blue-400 text-blue-400";
    if (value >= 30) return "from-green-500 to-green-400 text-green-400";
    return "from-slate-500 to-slate-400 text-slate-400";
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-400 uppercase font-semibold">{name}</span>
        <span className={`text-sm font-bold ${getColor().split(' ').pop()}`}>{value}</span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`h-full bg-gradient-to-r ${getColor().split(' ').slice(0, 3).join(' ')}`}
          style={{ boxShadow: `0 0 10px currentColor` }}
        />
      </div>
    </div>
  );
};

/**
 * Quest Card - Main quest display card with all RPG elements
 */
const QuestCard = ({ quest, onComplete, onAbandon }) => {
  const [completing, setCompleting] = useState(false);
  const [showXPPopup, setShowXPPopup] = useState(false);

  const isDone = quest.status === 'DONE';
  const overdue = isOverdue(quest.dueDate) && !isDone;
  const difficultyStyle = getDifficultyStyle(quest.difficulty);
  const priorityStyle = getPriorityStyle(quest.priority);

  const handleComplete = async () => {
    if (isDone || completing) return;
    setCompleting(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    setShowXPPopup(true);
    setTimeout(() => {
      setShowXPPopup(false);
      setCompleting(false);
      onComplete?.(quest.id);
    }, 1500);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: isDone ? 0.5 : 1,
      y: 0,
      transition: { duration: 0.3 }
    },
    hover: {
      scale: 1.02,
      boxShadow: priorityStyle.glow,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="relative"
    >
      <Card
        className={`bg-slate-900/60 backdrop-blur-md border border-slate-800 overflow-hidden ${
          isDone ? 'opacity-50 grayscale-[0.3]' : ''
        } ${overdue ? 'border-red-500/30' : ''}`}
        style={{
          borderLeft: `3px solid ${
            quest.priority === 'HIGH' ? '#ef4444' :
            quest.priority === 'MEDIUM' ? '#eab308' : '#64748b'
          }`
        }}
      >
        {/* XP Popup Animation */}
        <AnimatePresence>
          {showXPPopup && (
            <motion.div
              initial={{ opacity: 0, y: 0, scale: 0.8 }}
              animate={{ opacity: 1, y: -20, scale: 1 }}
              exit={{ opacity: 0, y: -40 }}
              className="absolute inset-0 flex items-center justify-center z-20 bg-slate-900/80 backdrop-blur-sm"
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
                </motion.div>
                <p className="text-2xl font-black text-yellow-400">+{quest.xpReward} XP</p>
                <p className="text-sm text-green-400">+{quest.goldReward} Gold</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <CardHeader className="pb-0">
          <div className="flex items-start justify-between w-full gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Difficulty Badge */}
              <Chip
                size="sm"
                variant="flat"
                className={`${difficultyStyle.bg} ${difficultyStyle.text} ${difficultyStyle.border} border font-bold text-xs uppercase tracking-wider`}
              >
                {quest.difficulty}
              </Chip>

              {/* Priority Badge */}
              <Chip
                size="sm"
                variant="flat"
                className={`${priorityStyle.bg} ${priorityStyle.color} ${priorityStyle.border} border font-bold text-xs uppercase tracking-wider`}
              >
                {quest.priority}
              </Chip>
            </div>

            {/* Category Icon */}
            <div className="flex items-center gap-1 text-slate-400 text-sm">
              {getCategoryIcon(quest.category)}
              <span className="capitalize hidden sm:inline">{quest.category}</span>
            </div>
          </div>
        </CardHeader>

        <CardBody className="pt-2">
          {/* Quest Title */}
          <h3 className={`text-lg font-bold mb-1 ${isDone ? 'text-slate-400 line-through' : 'text-slate-100 group-hover:text-blue-400'} transition-colors`}>
            {quest.title}
          </h3>

          {/* Quest Description */}
          {quest.description && (
            <p className="text-slate-400 text-sm mb-3 line-clamp-2">
              {quest.description}
            </p>
          )}

          {/* Progress Bar for Active Quests */}
          {!quest.isDaily && quest.progress !== undefined && quest.progress > 0 && (
            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Progress</span>
                <span className="text-blue-400 font-bold">{quest.progress}%</span>
              </div>
              <Progress
                value={quest.progress}
                size="sm"
                classNames={{
                  track: "bg-slate-800",
                  indicator: "bg-gradient-to-r from-blue-600 to-blue-400"
                }}
              />
            </div>
          )}

          {/* Daily Streak */}
          {quest.isDaily && (
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-orange-400 text-sm font-bold">{quest.streak} day streak</span>
            </div>
          )}
        </CardBody>

        <CardFooter className="pt-0">
          <Divider className="bg-slate-800 mb-3" />

          <div className="flex items-center justify-between w-full">
            {/* Rewards */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-blue-400">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-bold">{quest.xpReward} XP</span>
              </div>
              <div className="flex items-center gap-1 text-yellow-400">
                <Award className="w-4 h-4" />
                <span className="text-sm font-bold">{quest.goldReward} G</span>
              </div>
            </div>

            {/* Due Date or Completion Status */}
            <div className="flex items-center gap-2">
              {!isDone ? (
                quest.dueDate && (
                  <div className={`flex items-center gap-1 text-sm ${overdue ? 'text-red-400' : 'text-slate-400'}`}>
                    <Clock className="w-4 h-4" />
                    <span className={overdue ? 'font-bold' : ''}>
                      {overdue ? 'OVERDUE' : formatDate(quest.dueDate)}
                    </span>
                  </div>
                )
              ) : (
                <div className="flex items-center gap-1 text-green-400 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-bold">COMPLETED</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {!isDone && (
            <div className="flex gap-2 mt-4 w-full">
              <Button
                size="sm"
                color="success"
                variant="shadow"
                className="flex-1 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold uppercase tracking-wide shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)]"
                onClick={handleComplete}
                isLoading={completing}
                startContent={<CheckCircle className="w-4 h-4" />}
              >
                Complete
              </Button>
              <Button
                size="sm"
                color="danger"
                variant="ghost"
                className="font-bold uppercase tracking-wide"
                onClick={() => onAbandon?.(quest.id)}
              >
                Abandon
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

/**
 * Player Stats Panel - Shows comprehensive player statistics
 */
const PlayerStatsPanel = () => {
  return (
    <Card className="bg-slate-900/80 backdrop-blur-md border border-slate-800">
      <CardHeader>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <HunterRankBadge rank={PLAYER_STATS.rank} />
            <div>
              <h2 className="text-xl font-black text-slate-100 uppercase tracking-wide">
                {PLAYER_STATS.rank}-Rank Hunter
              </h2>
              <p className="text-blue-400 font-semibold italic">"{PLAYER_STATS.title}"</p>
            </div>
          </div>
          <Trophy className="w-8 h-8 text-yellow-400" />
        </div>
      </CardHeader>

      <CardBody>
        <XPProgressBar
          currentXp={PLAYER_STATS.currentXp}
          maxXp={PLAYER_STATS.maxXp}
          level={PLAYER_STATS.level}
        />

        <Divider className="my-4 bg-slate-800" />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <StatCard
            icon={CheckCircle}
            label="Completed"
            value={PLAYER_STATS.questsCompleted}
            color="green"
          />
          <StatCard
            icon={Flame}
            label="Streak"
            value={`${PLAYER_STATS.dailyStreak}d`}
            subValue={`Best: ${PLAYER_STATS.longestStreak}d`}
            color="orange"
          />
          <StatCard
            icon={Award}
            label="Gold"
            value={PLAYER_STATS.totalGold.toLocaleString()}
            color="yellow"
          />
          <StatCard
            icon={Target}
            label="Success Rate"
            value={`${PLAYER_STATS.completionRate}%`}
            color="blue"
          />
        </div>

        {/* Attributes */}
        <div>
          <h3 className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Hunter Attributes
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(PLAYER_STATS.attributes).map(([attr, value]) => (
              <AttributeBar key={attr} name={attr} value={value} />
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

// ── Main Component ───────────────────────────────────────

export default function MainQuestBoard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('main');
  const [quests, setQuests] = useState(MOCK_QUESTS);
  const [showNewQuestModal, setShowNewQuestModal] = useState(false);

  const handleCompleteQuest = (questId) => {
    // Move quest from active to completed
    const questList = activeTab === 'main' ? quests.main : quests.daily;
    const quest = questList.find(q => q.id === questId);
    if (quest) {
      quest.status = 'DONE';
      quest.completedAt = new Date().toISOString();
      setQuests({
        ...quests,
        completed: [quest, ...quests.completed]
      });
    }
  };

  const handleAbandonQuest = (questId) => {
    if (!confirm('Are you sure you want to abandon this quest?')) return;
    // Remove quest from current list
    if (activeTab === 'main') {
      setQuests({
        ...quests,
        main: quests.main.filter(q => q.id !== questId)
      });
    } else {
      setQuests({
        ...quests,
        daily: quests.daily.filter(q => q.id !== questId)
      });
    }
  };

  const getCurrentQuests = () => {
    switch (activeTab) {
      case 'main': return quests.main;
      case 'daily': return quests.daily;
      case 'completed': return quests.completed;
      default: return [];
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo / Title */}
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500 }}
                className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)]"
              >
                <span className="text-xl font-black text-white">H</span>
              </motion.div>
              <div>
                <h1 className="text-xl font-black text-slate-100 uppercase tracking-widest">
                  The Hunter System
                </h1>
                <p className="text-slate-500 text-xs">Main Quest Board</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <Tabs
              variant="underlined"
              color="primary"
              selectedKey={activeTab}
              onSelectionChange={(key) => setActiveTab(key)}
              classNames={{
                tabList: "bg-slate-900/50 rounded-lg p-1",
                cursor: "bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]",
                tab: "data-[hover=true]:bg-slate-800 data-[hover=true]:rounded-md",
                tabContent: "font-bold uppercase tracking-wide text-sm"
              }}
            >
              <Tab
                key="main"
                title={
                  <span className="flex items-center gap-2">
                    <Sword className="w-4 h-4" />
                    Main Quests
                  </span>
                }
              />
              <Tab
                key="daily"
                title={
                  <span className="flex items-center gap-2">
                    <Flame className="w-4 h-4" />
                    Daily
                  </span>
                }
              />
              <Tab
                key="completed"
                title={
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Completed
                  </span>
                }
              />
            </Tabs>

            {/* User & Actions */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3">
                <Avatar
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Hunter'}`}
                  className="w-8 h-8 border border-blue-400/30"
                />
                <span className="text-slate-400 text-sm">Welcome, <span className="text-slate-100 font-semibold">{user?.name}</span></span>
              </div>

              <Button
                size="sm"
                variant="ghost"
                className="text-slate-400 hover:text-slate-100"
                onClick={logout}
                startContent={<LogOut className="w-4 h-4" />}
              >
                Logout
              </Button>

              <Button
                size="md"
                color="primary"
                variant="shadow"
                className="bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold uppercase tracking-wide shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.7)]"
                onClick={() => setShowNewQuestModal(true)}
                startContent={<Plus className="w-5 h-5" />}
              >
                New Quest
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Player Stats */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <PlayerStatsPanel />
            </div>
          </div>

          {/* Main Quest Area */}
          <div className="lg:col-span-3">
            {/* Quest Count Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-100 uppercase tracking-wide">
                  {activeTab === 'main' ? 'Active Quests' : activeTab === 'daily' ? 'Daily Challenges' : 'Completed Quests'}
                </h2>
                <p className="text-slate-500 text-sm">
                  {getCurrentQuests().length} {getCurrentQuests().length === 1 ? 'quest' : 'quests'} available
                </p>
              </div>
              {activeTab !== 'completed' && (
                <Chip
                  variant="flat"
                  className="bg-blue-500/10 text-blue-400 border border-blue-500/30"
                  startContent={<Sparkles className="w-4 h-4" />}
                >
                  {getCurrentQuests().filter(q => q.priority === 'HIGH').length} High Priority
                </Chip>
              )}
            </div>

            {/* Quest Grid */}
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <AnimatePresence mode="popLayout">
                {getCurrentQuests().length > 0 ? (
                  getCurrentQuests().map((quest, index) => (
                    <motion.div
                      key={quest.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <QuestCard
                        quest={quest}
                        onComplete={handleCompleteQuest}
                        onAbandon={handleAbandonQuest}
                      />
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full text-center py-20"
                  >
                    <Skull className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-500 text-lg">No quests in this category</p>
                    <p className="text-slate-600 text-sm mt-2">The hunter must seek new challenges</p>
                    <Button
                      size="md"
                      color="primary"
                      variant="ghost"
                      className="mt-4"
                      onClick={() => setShowNewQuestModal(true)}
                    >
                      Accept New Quest
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </main>

      {/* New Quest Modal Placeholder */}
      {showNewQuestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-100 uppercase tracking-wide">Accept New Quest</h3>
              <Button
                size="sm"
                variant="light"
                className="text-slate-400"
                onClick={() => setShowNewQuestModal(false)}
              >
                ✕
              </Button>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              Quest creation form would go here. This is a placeholder for the actual implementation.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowNewQuestModal(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                color="primary"
                onClick={() => setShowNewQuestModal(false)}
              >
                Create Quest
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
