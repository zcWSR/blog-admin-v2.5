module.exports = {
  extends: [
    'eslint-config-qunar'
  ].map(require.resolve),
  rules: {
    'react/prefer-stateless-function': 0,
    'react/prop-types': 0,
    'import/extensions': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'react/no-multi-comp': 0,
    'react/no-string-refs': 0,
    'react/no-find-dom-node': 0,
    'react/no-array-index-key': 0,
    'react/jsx-no-target-blank': 0,
    'jsx-a11y/label-has-for': 0,
    'no-confusing-arrow': 0
  }
};
