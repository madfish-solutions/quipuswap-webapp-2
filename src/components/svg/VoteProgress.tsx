import React from 'react';

const calcXpos = (
  progress:number,
  size = 128,
) => size - Math.cos((progress) * (Math.PI)) * size;

const calcYpos = (
  progress:number,
  size = 128,
) => size - Math.sin((progress) * (Math.PI)) * size;

type VoteProgressProps = {
  progress: number
} & IconProps;

const rB = 128; // big radius
const rM = 92; // mini radius
const deltaR = rB - rM;
const BR = 8; // border radius
const BE = 128; // bottom end

const inRadius = 110;

const x1 = 18;
// const y1 = 120;

export const VoteProgress: React.FC<VoteProgressProps> = ({
  className,
  progress,
}) => {
  const x2 = calcXpos(progress, inRadius) + x1;
  const y2 = calcYpos(progress, inRadius) + 10;
  const progressToPi = (progress) * (Math.PI);
  const smallArcRightEndX = x2 - Math.cos(progressToPi) * x1;
  const smallArcRightEndY = y2 - Math.sin(progressToPi) * x1;
  const arcEndRightCircleEndX = x2 - Math.cos(progressToPi) * (x1 - BR * 2);
  const arcEndRightCircleEndY = y2 - Math.sin(progressToPi) * (x1 - BR * 2);
  const arcEndLineToBottomX = x2 - Math.cos(progressToPi) * (x1 - BR);
  const arcEndLineToBottomY = y2 - Math.sin(progressToPi) * (x1 - BR);
  const arcEndLineToEndX = x2 + Math.cos(progressToPi) * (x1 + BR);
  const arcEndLineToEndY = y2 + Math.sin(progressToPi) * (x1 + BR);
  const bigArcPreCircleX = x2 + Math.cos(progressToPi) * (x1 + BR);
  const bigArcPreCircleY = y2 - Math.sin(progressToPi) * (x1 + BR);
  const bigArcPreLineX = x2 + Math.cos(progressToPi) * x1;
  const bigArcPreLineY = y2 + Math.sin(progressToPi) * x1;
  return (
    <svg width="256" height="128" viewBox="0 0 256 128" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M 248 128 A 1 1 0 0 0 248 112 L 256 120 A 1.067 1 0 0 0 0 120 A 1 1 0 0 0 16 120 L 8 128 L 28 128 A 1 1 0 0 0 28 112 L 36 120 A 1.097 1 0 1 1 220 120 A 1 1 0 1 0 236 120 L 228 128 L 248 128 Z"
        fill="#EA2424"
      />
      <path
        d={`M 
              ${arcEndLineToEndX}
              ${arcEndLineToEndY}
            A 1 1 0 0 0 
              ${bigArcPreCircleX} 
              ${bigArcPreCircleY}
            L
              ${bigArcPreLineX} 
              ${bigArcPreLineY}
            A 1.067 1 0 0 0 0 ${BE - BR}
            A 1 1 0 0 0 ${BR * 2} ${BE - BR}
            L ${BR} ${BE}
            L ${deltaR - BR} ${BE}
            A 1 1 0 0 0 ${deltaR - BR} ${BE - (BR * 2)}
            L ${deltaR} ${BE - BR}
            A 1.097 1 0 1 1 
              ${smallArcRightEndX} 
              ${smallArcRightEndY}
            A 1 1 0 0 0
              ${arcEndRightCircleEndX} 
              ${arcEndRightCircleEndY}
            L 
              ${arcEndLineToBottomX} 
              ${arcEndLineToBottomY}
            L ${arcEndLineToEndX} 
              ${arcEndLineToEndY}
            Z`}
        strokeWidth="2px"
        stroke="#2ED33E"
        fill="#2ED33E"
      />
    </svg>
  );
};
