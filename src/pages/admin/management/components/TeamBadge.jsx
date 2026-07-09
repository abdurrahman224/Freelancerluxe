import React from 'react';

const TeamBadge = ({ team }) => (
  <span className="inline-block border border-[#ff6b2d]/50 text-[#ff6b2d] text-xs px-2.5 py-1 rounded-sm whitespace-nowrap">
    {team}
  </span>
);

export default TeamBadge;
