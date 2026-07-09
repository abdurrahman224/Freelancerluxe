import React from 'react';

const LeaderTable = ({ title, rows }) => (
  <div
    className="rounded-2xl p-0 flex-1 shadow-sm"
    style={{
      background: 'linear-gradient(135deg, #ffefea 0%, #ffd8c2 45%, #ff9a6b 100%)'
    }}
  >
    <div className="p-4 rounded-t-2xl">
      <h3 className="text-xl lg:text-2xl font-semibold text-[#111827] mb-0" style={{ fontFamily: 'var(--font-primary)' }}>
        {title}
      </h3>
    </div>

    <div className="p-4">
      <ul className="space-y-3">
        {rows.map((r) => (
          <li key={r.name} className="bg-white rounded-lg p-3 flex items-center gap-3">
            <span className="text-xs text-[#9ca3af] w-6">#{r.rank}</span>
            <div className="w-9 h-9 rounded-full bg-[#ffe4d4] flex items-center justify-center text-xs font-bold text-[#ff6b2d] shrink-0">
              {r.init}
            </div>
            <span className="flex-1 text-sm font-medium text-[#111827]">{r.name}</span>
            <span className="text-lg font-bold text-[#ff6b2d]">{r.score}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default LeaderTable;
