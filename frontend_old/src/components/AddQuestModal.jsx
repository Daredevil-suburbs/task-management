/** 
 * @author Daredevil-suburbs
 */
import React, { useState } from 'react';
import {
  X,
  Sword,
  Shield,
  Target,
  User,
  Zap,
  Award,
  Clock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const AddQuestModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'work',
    difficulty: '普通',
    priority: 'medium',
    xp: 100,
    gold: 25,
    estimatedTime: ''
  });

  const [errors, setErrors] = useState({});

  const categoryOptions = [
    { value: 'work', label: 'Work', icon: Sword, color: 'text-blue-400' },
    { value: 'health', label: 'Health', icon: Shield, color: 'text-green-400' },
    { value: 'learning', label: 'Learning', icon: Target, color: 'text-purple-400' },
    { value: 'personal', label: 'Personal', icon: User, color: 'text-pink-400' }
  ];

  const difficultyOptions = [
    { value: '普通', xp: 100, gold: 25, color: 'text-blue-400', border: 'border-blue-400' },
    { value: '稀有', xp: 250, gold: 75, color: 'text-purple-400', border: 'border-purple-400' },
    { value: '精英', xp: 500, gold: 150, color: 'text-orange-400', border: 'border-orange-400' },
    { value: '领主', xp: 1000, gold: 300, color: 'text-red-400', border: 'border-red-400' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'text-slate-400', bg: 'bg-slate-400' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-400' },
    { value: 'high', label: 'High', color: 'text-red-400', bg: 'bg-red-400' }
  ];

  const selectedDifficulty = difficultyOptions.find(d => d.value === formData.difficulty);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Quest title is required';
    }
    if (formData.title.length > 60) {
      newErrors.title = 'Title must be under 60 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit?.(formData);
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'work',
        difficulty: '普通',
        priority: 'medium',
        xp: 100,
        gold: 25,
        estimatedTime: ''
      });
      onClose?.();
    }
  };

  const updateDifficulty = (diff) => {
    const option = difficultyOptions.find(d => d.value === diff);
    setFormData(prev => ({
      ...prev,
      difficulty: diff,
      xp: option.xp,
      gold: option.gold
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-[0_0_50px_rgba(59,130,246,0.2)] overflow-hidden">
        {/* Header Glow Effect */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 shadow-[0_0_20px_rgba(59,130,246,0.8)]" />

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-400/30 flex items-center justify-center">
              <Sword className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-100 uppercase tracking-wide">
                Create New Quest
              </h2>
              <p className="text-slate-500 text-sm">Define your next challenge</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-100 hover:border-slate-500 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Quest Title */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wide">
              Quest Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Complete the database migration"
              className={`w-full px-4 py-3 bg-slate-800 border ${
                errors.title ? 'border-red-500' : 'border-slate-700'
              } rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all`}
            />
            {errors.title && (
              <p className="mt-1 text-red-400 text-sm flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wide">
              Quest Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the objectives of this quest..."
              rows={3}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all resize-none"
            />
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-3 uppercase tracking-wide">
              Quest Category
            </label>
            <div className="grid grid-cols-4 gap-2">
              {categoryOptions.map((cat) => {
                const Icon = cat.icon;
                const isSelected = formData.category === cat.value;
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat.value })}
                    className={`p-3 rounded-lg border transition-all duration-300 flex flex-col items-center gap-2 ${
                      isSelected
                        ? 'bg-blue-500/20 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                        : 'bg-slate-800 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isSelected ? cat.color : 'text-slate-400'}`} />
                    <span className={`text-xs font-bold ${isSelected ? 'text-slate-100' : 'text-slate-400'}`}>
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty Selection */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-3 uppercase tracking-wide">
              Difficulty Rank
            </label>
            <div className="grid grid-cols-4 gap-2">
              {difficultyOptions.map((diff) => {
                const isSelected = formData.difficulty === diff.value;
                return (
                  <button
                    key={diff.value}
                    type="button"
                    onClick={() => updateDifficulty(diff.value)}
                    className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                      isSelected
                        ? `${diff.border} bg-slate-800 shadow-[0_0_15px_rgba(59,130,246,0.3)]`
                        : 'border-slate-700 bg-slate-800/50 hover:border-slate-500'
                    }`}
                  >
                    <p className={`text-sm font-black ${diff.color}`}>{diff.value}</p>
                    <p className="text-xs text-slate-400 mt-1">{diff.xp} XP</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priority & Estimated Time Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Priority */}
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-3 uppercase tracking-wide">
                Priority Level
              </label>
              <div className="flex gap-2">
                {priorityOptions.map((pri) => {
                  const isSelected = formData.priority === pri.value;
                  return (
                    <button
                      key={pri.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, priority: pri.value })}
                      className={`flex-1 py-2 rounded-lg border transition-all duration-300 ${
                        isSelected
                          ? `${pri.color} border-current bg-slate-800`
                          : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-500'
                      }`}
                    >
                      <span className="text-sm font-bold">{pri.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Estimated Time */}
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-3 uppercase tracking-wide">
                Est. Time
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={formData.estimatedTime}
                  onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
                  placeholder="e.g., 2h 30m"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all"
                />
              </div>
            </div>
          </div>

          {/* Rewards Preview */}
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <p className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wide">
              Quest Rewards
            </p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Zap className="w-6 h-6 text-blue-400" />
                <div>
                  <p className="text-blue-400 font-black text-xl">{formData.xp} XP</p>
                  <p className="text-slate-500 text-xs">Experience Points</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-yellow-400" />
                <div>
                  <p className="text-yellow-400 font-black text-xl">{formData.gold} G</p>
                  <p className="text-slate-500 text-xs">Hunter Gold</p>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-800 bg-slate-900/50">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-lg border border-slate-700 text-slate-400 font-bold uppercase tracking-wide hover:border-slate-500 hover:text-slate-100 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold uppercase tracking-wide shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.7)] transition-all duration-300 flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Create Quest
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddQuestModal;
