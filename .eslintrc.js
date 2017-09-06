module.exports = {
  "extends": "airbnb",
  "parser": "babel-eslint",
  env: {
    browser: true,
    es6: true,
    commonjs: true,
    mocha: true
  },
  globals: {
    expect: 'false',
    sinon: 'false'
  },
  rules: {
    "no-case-declarations": 'off',
    "react/no-unescaped-entities": 'off',
    "react/forbid-prop-types": 'off',
    "max-len": [2, 320],
    "consistent-return": "off",
    "no-nested-ternary": "off",
    "no-return-assign": "off",
    "jsx-a11y/no-static-element-interactions": "off",
    "jsx-a11y/no-noninteractive-element-interactions": "off",
    "semi": "off",
    "no-mixed-operators": "off",
    "comma-dangle": "off",
    "no-shadow": "off",
    "global-require": "off",
    "no-use-before-define": ["error", { "functions": false }],
    "react/jsx-filename-extension": ["error", { "extensions": [".js", ".jsx"] }],
    "no-underscore-dangle": ["error", { "allowAfterThis": true }],
    "import/no-extraneous-dependencies": "off",
    "import/extensions": "off",
    "import/no-unresolved": "off",
    "import/first": "off",
    "import/prefer-default-export": "off",
    "no-bitwise": ["error", { "allow": ["~"] }],
    "no-plusplus": "off",
    "func-names": "off",
    "class-methods-use-this": "off",
    "linebreak-style": 0
  }
};
