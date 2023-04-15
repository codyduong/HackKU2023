module.exports = {
  plugins: ['@typescript-eslint', 'eslint-plugin-prettier', 'solid'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:solid/recommended',
  ],
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    node: true,
  },
  rules: {
    indent: ['off', 2, { SwitchCase: 1 }],
    'linebreak-style': ['off', 'unix'],
    quotes: ['off', 'double'],
    semi: ['error', 'always'],
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
      },
    ],
  },
};
