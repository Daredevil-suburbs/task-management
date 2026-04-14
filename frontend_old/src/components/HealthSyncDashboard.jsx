/** 
 * @author Daredevil-suburbs
 */
import React, { useState } from 'react';
import {
  Heart,
  Activity,
  Moon,
  Droplets,
  Utensils,
  Brain,
  Zap,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const HealthSyncDashboard = () => {
  const [healthStats, setHealthStats] = useState({
    hp: 78,        // Overall health score
    energy: 65,    // Energy level
    sleep: 7.5,    // Hours
    hydration: 45, // Percentage
    nutrition: 60, // Percentage
    stress: 35,    // Lower is better
    focus: 72      // Focus level
  });

  const [logs, setLogs] = useState([
    { id: 1, type: 'water', amount: '500ml', time: '10:30 AM' },
    { id: 2, type: 'sleep', hours: 7.5, time: '7:00 AM' },
    { id: 3, type: 'meal', name: 'Breakfast', time: '8:00 AM' }
  ]);

  const getHPColor = (hp) => {
    if (hp >= 70) return 'text-green-400 from-green-600 to-green-400';
    if (hp >= 40) return 'text-yellow-400 from-yellow-600 to-yellow-400';
    return 'text-red-400 from-red-600 to-red-400';
  };

  const getHPGlow = (hp) => {
    if (hp >= 70) return 'shadow-[0_0_25px_rgba(34,197,94,0.5)]';
    if (hp >= 40) return 'shadow-[0_0_20px_rgba(234,179,8,0.4)]';
    return 'shadow-[0_0_20px_rgba(239,68,68,0.5)]';
  };

  const getEnergyStatus = (energy) => {
    if (energy >= 70) return { label: 'Optimal', color: 'text-green-400' };
    if (energy >= 40) return { label: 'Moderate', color: 'text-yellow-400' };
    return { label: 'Low', color: 'text-red-400' };
  };

  const energyStatus = getEnergyStatus(healthStats.energy);

  const addLog = (type, data) => {
    const newLog = {
      id: Date.now(),
      type,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      ...data
    };
    setLogs([newLog, ...logs]);
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-800 bg-gradient-to-b from-red-900/10 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getHPColor(healthStats.hp)} flex items-center justify-center ${getHPGlow(healthStats.hp)}`}>
                <Heart className="w-8 h-8 text-white fill-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-800 border-2 border-green-500 flex items-center justify-center">
                <CheckCircle className="w-3 h-3 text-green-400" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-100 uppercase tracking-wide">
                Vital Signs
              </h2>
              <p className="text-slate-400 text-sm">Hunter Health Monitor</p>
            </div>
          </div>

          {/* HP Display */}
          <div className="text-right">
            <p className={`text-4xl font-black ${getHPColor(healthStats.hp).split(' ')[0]}`}>
              {healthStats.hp}%
            </p>
            <p className="text-slate-500 text-xs uppercase tracking-wide">Health Points</p>
          </div>
        </div>

        {/* HP Bar */}
        <div className="mt-6">
          <div className="h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700 relative">
            <div
              className={`h-full bg-gradient-to-r ${getHPColor(healthStats.hp)} rounded-full transition-all duration-700`}
              style={{
                width: `${healthStats.hp}%`,
                boxShadow: healthStats.hp >= 70
                  ? '0 0 20px rgba(34,197,94,0.6), inset 0 0 10px rgba(34,197,94,0.3)'
                  : healthStats.hp >= 40
                  ? '0 0 20px rgba(234,179,8,0.5), inset 0 0 10px rgba(234,179,8,0.3)'
                  : '0 0 20px rgba(239,68,68,0.6), inset 0 0 10px rgba(239,68,68,0.3)'
              }}
            >
              {/* Pulsing effect at critical levels */}
              {healthStats.hp < 40 && (
                <div className="absolute inset-0 bg-red-500/30 animate-pulse" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {/* Energy */}
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 hover:border-yellow-500/30 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-slate-400 text-sm font-semibold">Energy</span>
              </div>
              <span className={`text-xs font-bold ${energyStatus.color}`}>{energyStatus.label}</span>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-black text-slate-100">{healthStats.energy}%</p>
              <div className="flex gap-1">
                <button
                  onClick={() => setHealthStats(prev => ({ ...prev, energy: Math.min(100, prev.energy + 5) }))}
                  className="p-1.5 rounded bg-slate-700 hover:bg-green-500/20 hover:text-green-400 transition-all"
                >
                  <TrendingUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setHealthStats(prev => ({ ...prev, energy: Math.max(0, prev.energy - 5) }))}
                  className="p-1.5 rounded bg-slate-700 hover:bg-red-500/20 hover:text-red-400 transition-all"
                >
                  <TrendingDown className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full"
                style={{ width: `${healthStats.energy}%`, boxShadow: '0 0 10px rgba(234,179,8,0.4)' }}
              />
            </div>
          </div>

          {/* Sleep */}
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 hover:border-purple-500/30 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Moon className="w-5 h-5 text-purple-400" />
                <span className="text-slate-400 text-sm font-semibold">Sleep</span>
              </div>
              <span className={`text-xs font-bold ${healthStats.sleep >= 7 ? 'text-green-400' : 'text-yellow-400'}`}>
                {healthStats.sleep >= 7 ? 'Good' : 'Needs Rest'}
              </span>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-black text-slate-100">{healthStats.sleep}<span className="text-lg text-slate-400">h</span></p>
              <div className="flex gap-1">
                <button
                  onClick={() => setHealthStats(prev => ({ ...prev, sleep: prev.sleep + 0.5 }))}
                  className="p-1.5 rounded bg-slate-700 hover:bg-green-500/20 hover:text-green-400 transition-all"
                >
                  <TrendingUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setHealthStats(prev => ({ ...prev, sleep: Math.max(0, prev.sleep - 0.5) }))}
                  className="p-1.5 rounded bg-slate-700 hover:bg-red-500/20 hover:text-red-400 transition-all"
                >
                  <TrendingDown className="w-4 h-4" />
                </button>
              </div>
            </div>
            {/* Sleep quality indicator */}
            <div className="mt-2 flex gap-1">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full ${
                    i < Math.floor(healthStats.sleep)
                      ? 'bg-gradient-to-r from-purple-600 to-purple-400'
                      : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Hydration */}
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 hover:border-blue-500/30 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-blue-400" />
                <span className="text-slate-400 text-sm font-semibold">Hydration</span>
              </div>
              <span className={`text-xs font-bold ${healthStats.hydration >= 60 ? 'text-green-400' : 'text-blue-400'}`}>
                {healthStats.hydration >= 60 ? 'Optimal' : 'Drink More'}
              </span>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-black text-slate-100">{healthStats.hydration}%</p>
              <button
                onClick={() => {
                  setHealthStats(prev => ({ ...prev, hydration: Math.min(100, prev.hydration + 10) }));
                  addLog('water', { amount: '250ml' });
                }}
                className="p-2 rounded bg-blue-500/20 border border-blue-400/30 text-blue-400 hover:bg-blue-500/30 transition-all"
                title="Log water intake"
              >
                <Droplets className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"
                style={{ width: `${healthStats.hydration}%`, boxShadow: '0 0 10px rgba(59,130,246,0.5)' }}
              />
            </div>
          </div>

          {/* Nutrition */}
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 hover:border-green-500/30 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Utensils className="w-5 h-5 text-green-400" />
                <span className="text-slate-400 text-sm font-semibold">Nutrition</span>
              </div>
              <span className={`text-xs font-bold ${healthStats.nutrition >= 70 ? 'text-green-400' : 'text-yellow-400'}`}>
                {healthStats.nutrition >= 70 ? 'Good' : 'Needs Fuel'}
              </span>
            </div>
            <p className="text-3xl font-black text-slate-100">{healthStats.nutrition}%</p>
            <div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full"
                style={{ width: `${healthStats.nutrition}%`, boxShadow: '0 0 10px rgba(34,197,94,0.5)' }}
              />
            </div>
          </div>

          {/* Stress Level */}
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 hover:border-orange-500/30 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-orange-400" />
                <span className="text-slate-400 text-sm font-semibold">Stress</span>
              </div>
              <span className={`text-xs font-bold ${healthStats.stress <= 30 ? 'text-green-400' : healthStats.stress <= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                {healthStats.stress <= 30 ? 'Low' : healthStats.stress <= 60 ? 'Moderate' : 'High'}
              </span>
            </div>
            <p className="text-3xl font-black text-slate-100">{healthStats.stress}%</p>
            <div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full"
                style={{ width: `${healthStats.stress}%`, boxShadow: '0 0 10px rgba(251,146,60,0.4)' }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">Lower is better</p>
          </div>

          {/* Focus Level */}
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 hover:border-cyan-500/30 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" />
                <span className="text-slate-400 text-sm font-semibold">Focus</span>
              </div>
              <span className={`text-xs font-bold ${healthStats.focus >= 70 ? 'text-green-400' : healthStats.focus >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                {healthStats.focus >= 70 ? 'Sharp' : healthStats.focus >= 40 ? 'Moderate' : 'Scattered'}
              </span>
            </div>
            <p className="text-3xl font-black text-slate-100">{healthStats.focus}%</p>
            <div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full"
                style={{ width: `${healthStats.focus}%`, boxShadow: '0 0 10px rgba(34,211,238,0.5)' }}
              />
            </div>
          </div>
        </div>

        {/* Activity Log */}
        <div className="border-t border-slate-800 pt-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Today's Activity Log
          </h3>
          <div className="space-y-2">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg border border-slate-800"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  log.type === 'water' ? 'bg-blue-500/10' :
                  log.type === 'sleep' ? 'bg-purple-500/10' :
                  'bg-green-500/10'
                }`}>
                  {log.type === 'water' ? (
                    <Droplets className="w-4 h-4 text-blue-400" />
                  ) : log.type === 'sleep' ? (
                    <Moon className="w-4 h-4 text-purple-400" />
                  ) : (
                    <Utensils className="w-4 h-4 text-green-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-200">
                    {log.type === 'water' ? `Drank ${log.amount} water` :
                     log.type === 'sleep' ? `Slept ${log.hours} hours` :
                     `Ate ${log.name}`}
                  </p>
                  <p className="text-xs text-slate-500">{log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        {healthStats.energy < 30 || healthStats.hydration < 30 || healthStats.sleep < 6 && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-400 font-bold text-sm">Vital Signs Critical</p>
              <p className="text-slate-400 text-sm">
                {healthStats.energy < 30 && 'Energy levels are critically low. Rest recommended. '}
                {healthStats.hydration < 30 && 'Hydration levels dangerous. Drink water immediately. '}
                {healthStats.sleep < 6 && 'Insufficient sleep detected. Prioritize rest.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthSyncDashboard;
