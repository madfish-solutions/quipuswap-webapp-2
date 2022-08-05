import { FC } from 'react';

export const VisibleIcon: FC = props => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm-2 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
      fill="#8B90A0"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18.066 17.66c-1.67 1.593-3.874 2.373-6.066 2.339-2.192.034-4.395-.746-6.066-2.339L0 12l5.934-5.66C7.604 4.747 9.808 3.967 12 4.001c2.192-.034 4.395.746 6.066 2.339L24 12l-5.934 5.66ZM7.315 16.213 2.898 12l4.417-4.213c1.265-1.206 2.95-1.812 4.654-1.786h.061c1.705-.026 3.39.58 4.655 1.786L21.102 12l-4.417 4.213c-1.265 1.206-2.95 1.812-4.654 1.786h-.061c-1.705.026-3.39-.58-4.655-1.786Z"
      fill="#8B90A0"
    />
  </svg>
);
