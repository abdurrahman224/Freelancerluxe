import React from 'react';

const StatCard = ({ label, value, subLabel, imgSrc }) => (
  <div className="flex-1 overflow-hidden rounded-2xl border border-gray-100 bg-linear-to-br from-[#f8b095] via-[#f7eeeb] to-[#f7eeeb]">
    <div className="flex items-center gap-2 p-3 sm:gap-3 sm:p-4 lg:gap-4">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center sm:h-18 sm:w-18 lg:h-22 lg:w-22 xl:h-28 xl:w-28">
        <img src={imgSrc} alt="stat" className="h-full w-full object-contain" />
      </div>

      <div className="flex-1 text-right">
        <div className="mb-1 text-xs font-medium text-[#140601] sm:mb-1.5 sm:text-sm lg:mb-2 lg:text-base xl:mb-2.5 xl:text-xl">
          {label}
        </div>
        <div
          className="text-xl font-medium text-[#1f0f0a] sm:text-2xl lg:text-3xl xl:text-4xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {value}
        </div>
        {subLabel && <div className="mt-1 text-xs text-[#9b6e62]">{subLabel}</div>}
      </div>
    </div>
  </div>
);

export default StatCard;
