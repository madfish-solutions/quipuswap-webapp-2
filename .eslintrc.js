module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react-hooks'],
  extends: ['airbnb-typescript', 'plugin:react/recommended', 'prettier'],
  rules: {
    'react/display-name': 0,
    'react/jsx-props-no-spreading': 0,
    'react/prop-types': 0,
    'import/prefer-default-export': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'react-hooks/rules-of-hooks': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
    'no-plusplus': 0,
    'linebreak-style': 0,
  },
  parserOptions: {
    project: './tsconfig.json',
  },
};
