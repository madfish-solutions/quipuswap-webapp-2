import React from 'react';

export const QuipuToken: React.FC<IconProps> = ({ id, className }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
      fill="#14202C"
    />
    <path
      d="M9.65025 8.84852L15.1554 14.3537C15.8691 15.0673 16.9905 15.1693 17.8061 14.7615C18.01 14.6595 18.1119 14.5576 18.3158 14.3537C19.2333 13.4362 19.2333 12.0089 18.3158 11.1933L12.8106 5.68815C11.995 4.77062 10.5678 4.77062 9.65025 5.68815C9.44636 5.89204 9.24246 6.19788 9.14051 6.40178C8.83467 7.21736 9.03857 8.23684 9.65025 8.84852Z"
      fill={`url(#QuipuToken-${id}paint0_linear)`}
    />
    <path
      d="M14.3147 15.2075L8.73096 9.58906C8.12183 9.07829 7.30964 8.87398 6.59898 9.07829C6.29442 9.18045 5.98985 9.38475 5.68528 9.69122C4.77157 10.6106 4.77157 12.0408 5.68528 12.858L11.1675 18.3743C11.8782 19.0894 12.9949 19.1915 13.9086 18.6808C14.1117 18.5786 14.2132 18.4765 14.3147 18.3743C15.2284 17.5571 15.2284 16.1269 14.3147 15.2075Z"
      fill={`url(#QuipuToken-${id}paint1_linear)`}
    />
    <defs>
      <linearGradient
        id={`QuipuToken-${id}paint0_linear`}
        x1="9"
        y1="5"
        x2="20.1893"
        y2="6.57412"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF6B00" />
        <stop offset="1" stopColor="#F9A605" />
      </linearGradient>
      <linearGradient
        id={`QuipuToken-${id}paint1_linear`}
        x1="5"
        y1="9"
        x2="16.1851"
        y2="10.5729"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF6B00" />
        <stop offset="1" stopColor="#F9A605" />
      </linearGradient>
    </defs>
  </svg>
);
