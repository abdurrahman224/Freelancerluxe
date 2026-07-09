import React from 'react';

const NumInput = ({ value, onChange, min, max, hint }) => (
  <div>
    <input
      type="number"
      value={value}
      min={min}
      max={max}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b2d]/30 bg-white"
    />
    {hint && <p className="text-xs text-[#140601]/70 mt-1">{hint}</p>}
  </div>
);

export default NumInput;
