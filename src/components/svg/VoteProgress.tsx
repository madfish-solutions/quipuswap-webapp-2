import React from 'react';

const calcXpos = (
  progress:number,
  size = 128,
) => size - Math.cos((progress / 100) * (Math.PI)) * size;

const calcYpos = (
  progress:number,
  size = 128,
) => size - Math.sin((progress / 100) * (Math.PI)) * size;

type VoteProgressProps = {
  progress: number
} & IconProps;

const rB = 128; // big radius
const rM = 92; // mini radius
const deltaR = rB - rM;
const BR = 8; // border radius
const BE = 128; // bottom end

const x1 = 18;
const y1 = 120;

export const VoteProgress: React.FC<VoteProgressProps> = ({
  className,
  progress,
}) => {
  const x2 = calcXpos(progress, rB - (deltaR / 2));
  const y2 = calcYpos(progress, rB - (deltaR / 2));
  return (
    <svg width="256" height="128" viewBox="0 0 256 128" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M 248 128 A 1 1 0 0 0 248 112 L 256 120 A 1.067 1 0 0 0 0 120 A 1 1 0 0 0 16 120 L 8 128 L 28 128 A 1 1 0 0 0 28 112 L 36 120 A 1.097 1 0 1 1 220 120 A 1 1 0 1 0 236 120 L 228 128 L 248 128 Z"
        fill="#EA2424"
      />
      <path
        d={`M 248 128
            A 1 1 0 0 0 ${x2 + deltaR} ${y2 - (2 * BR)} //x2 + deltaR, y2 - 2xBR//
            L ${x1} ${y1} //x1 y1//
            A 1.067 1 0 0 0 0 ${BE - BR}
            A 1 1 0 0 0 ${BR * 2} ${BE - BR}
            L ${BR} ${BE}
            L ${deltaR - BR} ${BE}
            A 1 1 0 0 0 ${deltaR - BR} ${BE - (BR * 2)}
            L ${deltaR} ${BE - BR}
            A 1.097 1 0 1 1 ${x2} ${y2 - BR} //x2 y2//
            A 1 1 0 0 0 ${x2 + (2 * BR)} ${y2 - BR} //x2 + 2xBR, y2 - BR//
            L ${x2 + BR} ${y2} // x2 + BR, y2//
            L ${x2 + deltaR} ${y2} // x2 + deltaR, y2//
            Z`}
        strokeWidth="2px"
        stroke="#2ED33E"
        fill="#2ED33E"
      />
    </svg>
  );
};
