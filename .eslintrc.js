module.exports = {
  extends: [
    'eslint-config-qunar'
  ].map(require.resolve),
  rules: {
    'react/prefer-stateless-function': 0,
    'react/prop-types': 0,
    'import/extensions': 0,
    'jsx-a11y/no-static-element-interactions': 0
  }
};
