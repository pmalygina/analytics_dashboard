module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/no-multiple-template-root': 'off',
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: { max: 2 },
        multiline: { max: 1 },
      },
    ],
    'vue/first-attribute-linebreak': [
      'error',
      {
        singleline: 'ignore',
        multiline: 'below',
      },
    ],
    'prettier/prettier': [
      'error',
      {
        singleAttributePerLine: true,
      },
    ],
  },
}
