import React, { useState } from 'react';
import { ChevronRight, X } from 'lucide-react';

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C'];
const ERAS = ['1980s', '1990s', '2000s', '2010s', '2020s'];
const EMPTY = { name: '', team: '', position: '', jerseyNumber: '', era: '', difficulty: 'Medium', bio: '', imageUrl: '' };

const PlayerModal = ({ title, initial = EMPTY, teams, onSave, onClose }) => {
  const [form, setForm] = useState(() => ({
    name: initial?.name || '',
    team: initial?.team || '',
    position: initial?.position || '',
    jerseyNumber: initial?.jerseyNumber || '',
    era: initial?.era || '',
    difficulty: initial?.difficulty || 'Medium',
    bio: initial?.bio || '',
    imageUrl: initial?.imageUrl || '',
  }));

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl flex flex-col max-h-[90vh]" style={{ fontFamily: 'var(--font-primary)' }}>
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white rounded-t-2xl p-6 border-b border-gray-200 flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl lg:text-2xl font-bold text-[#111827] mb-0.5" style={{ fontFamily: 'var(--font-primary)' }}>{title}</h3>
            <p className="text-sm lg:text-base text-[#140601]">Update the database</p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <label className="block text-sm lg:text-base font-medium text-[#140601] mb-1">Player name</label>
          <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-[#ff6b2d]/30" placeholder="LeBron James" value={form.name} onChange={(e) => set('name', e.target.value)} />

          <label className="block text-sm lg:text-base font-medium text-[#140601] mb-1">Team</label>
          <div className="relative mb-4">
            <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#ff6b2d]/30 bg-white" value={form.team} onChange={(e) => set('team', e.target.value)}>
              {teams.map((t) => <option key={t}>{t}</option>)}
            </select>
            <ChevronRight size={13} className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm lg:text-base font-medium text-[#140601] mb-1">Position</label>
              <div className="relative">
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#ff6b2d]/30 bg-white" value={form.position} onChange={(e) => set('position', e.target.value)}>
                  <option value="">Select position</option>
                  {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
                <ChevronRight size={13} className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm lg:text-base font-medium text-[#140601] mb-1">Jersey #</label>
              <input type="number" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b2d]/30" placeholder="23" value={form.jerseyNumber} onChange={(e) => set('jerseyNumber', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm lg:text-base font-medium text-[#140601] mb-1">Era</label>
              <div className="relative">
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#ff6b2d]/30 bg-white" value={form.era} onChange={(e) => set('era', e.target.value)}>
                  <option value="">Select era</option>
                  {ERAS.map((e) => <option key={e} value={e}>{e}</option>)}
                </select>
                <ChevronRight size={13} className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm lg:text-base font-medium text-[#140601] mb-1">Difficulty</label>
              <div className="relative">
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#ff6b2d]/30 bg-white" value={form.difficulty} onChange={(e) => set('difficulty', e.target.value)}>
                  {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                <ChevronRight size={13} className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <label className="block text-sm lg:text-base font-medium text-[#140601] mb-1">Bio</label>
          <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-[#ff6b2d]/30" placeholder="Draft bio" value={form.bio} onChange={(e) => set('bio', e.target.value)} />

          <label className="block text-sm lg:text-base font-medium text-[#140601] mb-1">Image URL</label>
          <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b2d]/30" placeholder="https://..." value={form.imageUrl} onChange={(e) => set('imageUrl', e.target.value)} />
        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 bg-white p-6 border-t border-gray-200 rounded-b-2xl">
          <button
            disabled={!form.name.trim() || !form.team}
            onClick={() => form.name.trim() && form.team && onSave(form)}
            className="w-full bg-[#ff6b2d] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#e05520] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title={!form.name.trim() ? 'Player name is required' : !form.team ? 'Team is required' : ''}
          >
            {title === 'Add New Player' ? 'Create Player' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerModal;
