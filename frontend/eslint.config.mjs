import { ESLint } from 'eslint';

const eslint = new ESLint({
  baseConfig: {
    extends: ['next', 'next/core-web-vitals'],
  },
});

export default eslint;