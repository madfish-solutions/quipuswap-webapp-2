import React, { useContext } from 'react';

import { ColorThemeContext } from '@providers/ColorThemeContext';

export const VotingReward: React.FC<IconProps> = ({ className }) => {
  const { themeColors } = useContext(ColorThemeContext);

  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M32.2721 13.9756C40.637 13.9756 47.418 12.041 47.418 9.65446C47.418 7.26796 40.637 5.33331 32.2721 5.33331C23.9072 5.33331 17.1261 7.26796 17.1261 9.65446C17.1261 12.041 23.9072 13.9756 32.2721 13.9756Z"
        fill="url(#VotingReward-paint0_linear)"
      />
      <path
        opacity="0.08"
        d="M32.2721 13.9756C40.637 13.9756 47.418 12.041 47.418 9.65446C47.418 7.26796 40.637 5.33331 32.2721 5.33331C23.9072 5.33331 17.1261 7.26796 17.1261 9.65446C17.1261 12.041 23.9072 13.9756 32.2721 13.9756Z"
        fill="#232735"
      />
      <path d="M25.2115 58.6667H40.4015V43.4768H25.2115V58.6667Z" fill="url(#VotingReward-paint1_linear)" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.1694 9.36169H47.4175C47.6508 11.7715 47.6921 13.9389 47.5768 15.8881H50.6695C52.8079 15.8881 54.8587 16.7376 56.3707 18.2496C57.8828 19.7617 58.7323 21.8125 58.7323 23.9509C58.7323 26.0892 57.8828 28.14 56.3707 29.6521C54.8587 31.1641 52.8079 32.0136 50.6695 32.0136H38.1162C36.4006 32.7658 34.8166 33.0788 33.7364 33.208V43.4767H30.4993V33.2149C28.7029 33.0473 27.1404 32.6277 25.7822 32.0136H13.8592C11.7208 32.0136 9.67 31.1641 8.15794 29.6521C6.64588 28.14 5.79642 26.0892 5.79642 23.9509C5.79642 21.8125 6.64588 19.7617 8.15794 18.2496C9.67 16.7376 11.7208 15.8881 13.8592 15.8881H17.0369C16.7913 12.1829 17.1694 9.36169 17.1694 9.36169ZM17.6224 20.2952H13.8592C12.8896 20.2952 11.9598 20.6804 11.2743 21.366C10.5887 22.0515 10.2036 22.9813 10.2036 23.9509C10.2036 24.9204 10.5887 25.8502 11.2743 26.5358C11.9598 27.2213 12.8896 27.6065 13.8592 27.6065H20.5678C19.0496 25.4109 18.1462 22.8221 17.6224 20.2952ZM43.7529 27.6065C45.1394 25.8015 46.3058 23.4247 46.9886 20.2952H50.6695C51.639 20.2952 52.5688 20.6804 53.2544 21.366C53.94 22.0515 54.3251 22.9813 54.3251 23.9509C54.3251 24.9204 53.94 25.8502 53.2544 26.5358C52.5688 27.2213 51.639 27.6065 50.6695 27.6065H43.7529Z"
        fill="url(#VotingReward-paint2_linear)"
      />
      <path
        opacity="0.46"
        d="M37.3251 27.5836C40.2051 27.5836 42.5398 25.249 42.5398 22.369C42.5398 19.489 40.2051 17.1543 37.3251 17.1543C34.4451 17.1543 32.1104 19.489 32.1104 22.369C32.1104 25.249 34.4451 27.5836 37.3251 27.5836Z"
        fill="white"
      />
      <defs>
        <linearGradient
          id="VotingReward-paint0_linear"
          x1="17.1261"
          y1="5.33331"
          x2="44.9242"
          y2="19.0351"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient
          id="VotingReward-paint1_linear"
          x1="40.4015"
          y1="58.6667"
          x2="23.4114"
          y2="56.2775"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient
          id="VotingReward-paint2_linear"
          x1="5.79642"
          y1="9.36169"
          x2="63.4321"
          y2="21.9382"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
      </defs>
    </svg>
  );
};
