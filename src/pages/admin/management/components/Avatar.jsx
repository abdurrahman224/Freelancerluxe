import React from 'react';

const Avatar = ({ player }) => {
  if (player.image) {
    return <img src={player.image} alt={player.name} className="w-10 h-10 rounded-lg object-cover" />;
  }
  const init = player.name.split(' ').map((w) => w[0]).slice(0, 2).join('');
  return (
    <div className="w-10 h-10 rounded-lg bg-[#ffe4d4] flex items-center justify-center text-xs font-bold text-[#ff6b2d] shrink-0">
      {init}
    </div>
  );
};

export default Avatar;
