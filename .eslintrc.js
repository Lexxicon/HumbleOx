module.exports = {
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
    },
    "sourceType": "module",
    "installedESLint": true,
    "env": {
      "es6": true,
      "node": true,
      "browser": true
    },
    "root": true,
    "extends": [
        "eslint:recommended",
    ],
    "rules": {
        "no-empty": "warn",
        "no-unused-vars": ["error", { "vars": "all", "args": "none" }],
        "no-console": 0,
        "indent": [
            "error",
            2
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};
